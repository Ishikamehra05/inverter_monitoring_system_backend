import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/server/db/prisma';
import { Prisma } from '@/server/db/generated/prisma/client';
import type { AuthenticatedRequest } from '@/server/middleware/auth.middleware';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { withRequestLogging } from '@/server/middleware/request-log.middleware';
import { errorResponse, successResponse } from '@/server/utils/api-response';
import {
	CHIP_TYPES,
	DEFAULT_STEP_TIMEOUT_SECONDS,
	UPDATE_TYPES,
} from '@/server/features/fota/constants';

// A "Batch Task" (upgrade_task) pushes ONE firmware to MANY devices — the
// firmware/chip type/update type are shared across the batch, per-device
// fields are just the device identity. This mirrors what the live
// /services/batch/task UI already collects (CreateTaskPanel.tsx), reconciled
// against plan.docx's single-device fota_job model via the upgrade_task/
// task_job bridge tables — see batch_task_database_plan_api.md Section 1.
const deviceSchema = z.object({
	plantId: z.union([z.string(), z.number()]).optional(),
	loggerImei: z.string().trim().min(1).max(20).optional(),
	inverterSerialNo: z.string().trim().min(1).max(50),
	currentFirmware: z.string().trim().max(255).optional(),
});

const createUpgradeTaskSchema = z.object({
	name: z.string().trim().min(1).max(255),
	newFirmwareVersion: z.string().trim().min(1).max(255),
	firmwareId: z.string().uuid().optional(),
	chipType: z.enum(CHIP_TYPES),
	updateType: z.enum(UPDATE_TYPES),
	firmwareUrl: z
		.string()
		.trim()
		.max(299)
		.regex(/^https?:\/\//, 'firmwareUrl must start with http:// or https://')
		.optional(),
	devices: z.array(deviceSchema).min(1, 'At least one device is required').max(500),
});

// plantId/loggerImei/currentFirmware/firmwareUrl are not yet sourceable from
// the UI (inverter->logger->plant join and a real firmware download URL are
// both future work — see coding_action/Zcreate-job-01.md). These sentinels
// let a submit go through in the meantime without touching the DB schema.
const DEFAULT_LOGGER_IMEI = '-1';
const DEFAULT_CURRENT_FIRMWARE = '-1';
const DEFAULT_FIRMWARE_URL = 'http://-1';
const PLACEHOLDER_PLANT_NAME = 'Unassigned';
const PLACEHOLDER_PLANT_TYPE = 'unassigned';
// Arbitrary constant used only to serialize concurrent first-time creation
// of the placeholder plant row (see resolvePlaceholderPlantId) — plants.name
// has no unique constraint to ON CONFLICT against, and adding one would be
// a schema change, which this feature must avoid.
const PLACEHOLDER_PLANT_LOCK_KEY = 872234455;

const listUpgradeTasksQuerySchema = z.object({
	name: z.string().trim().optional(),
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

type FirmwareLookupRow = { id: string; version: string; chip_type: string | null };
type PlantRow = { id: bigint };
type ActiveConflictRow = { logger_imei: string; inverter_serial_no: string; job_id: string; status: string };

function formatDateTime(value: Date): string {
	const pad = (part: number) => String(part).padStart(2, '0');
	return (
		[value.getFullYear(), pad(value.getMonth() + 1), pad(value.getDate())].join('-') +
		' ' +
		[pad(value.getHours()), pad(value.getMinutes()), pad(value.getSeconds())].join(':')
	);
}

async function resolveFirmware(
	newFirmwareVersion: string,
	chipType: string,
	firmwareId: string | undefined,
): Promise<{ ok: true; firmwareId: string } | { ok: false; message: string }> {
	if (firmwareId) {
		const rows = await prisma.$queryRaw<FirmwareLookupRow[]>`
			SELECT id::text, version, chip_type
			FROM firmware
			WHERE id = ${firmwareId}::uuid AND deleted_at IS NULL
			LIMIT 1
		`;
		const row = rows[0];
		if (!row) {
			return { ok: false, message: 'firmwareId does not reference an existing firmware record' };
		}
		if (row.version !== newFirmwareVersion || row.chip_type !== chipType) {
			return { ok: false, message: 'firmwareId does not match newFirmwareVersion/chipType' };
		}
		return { ok: true, firmwareId: row.id };
	}

	const rows = await prisma.$queryRaw<FirmwareLookupRow[]>`
		SELECT id::text, version, chip_type
		FROM firmware
		WHERE version = ${newFirmwareVersion}
			AND chip_type = ${chipType}::"ChipType"
			AND deleted_at IS NULL
		ORDER BY created_time DESC
		LIMIT 1
	`;
	const row = rows[0];
	if (!row) {
		return {
			ok: false,
			message: `newFirmwareVersion "${newFirmwareVersion}" was not found in the firmware catalog for chipType ${chipType}`,
		};
	}
	return { ok: true, firmwareId: row.id };
}

// Finds (or, on first ever call, creates) the placeholder "Unassigned"
// plant used to satisfy fota_job.plant_id's NOT NULL + foreign key when a
// device's real plantId isn't known yet. Deliberately data-only (INSERT),
// never a schema change — see coding_action/Zcreate-job-01.md §5.
async function resolvePlaceholderPlantId(actorId: bigint): Promise<bigint> {
	return prisma.$transaction(async (tx) => {
		await tx.$executeRaw`SELECT pg_advisory_xact_lock(${PLACEHOLDER_PLANT_LOCK_KEY})`;

		const existingRows = await tx.$queryRaw<PlantRow[]>`
			SELECT id FROM plants WHERE name = ${PLACEHOLDER_PLANT_NAME} AND deleted_at IS NULL LIMIT 1
		`;
		if (existingRows[0]) {
			return existingRows[0].id;
		}

		const ownerRows = await tx.$queryRaw<{ account: string }[]>`
			SELECT account FROM users WHERE id = ${actorId} LIMIT 1
		`;
		const ownerAccount = ownerRows[0]?.account;
		if (!ownerAccount) {
			throw new Error('Could not resolve an owning account for the placeholder plant');
		}

		const createdRows = await tx.$queryRaw<PlantRow[]>`
			INSERT INTO plants (name, type, user_account, created_at, updated_at)
			VALUES (${PLACEHOLDER_PLANT_NAME}, ${PLACEHOLDER_PLANT_TYPE}, ${ownerAccount}, now(), now())
			RETURNING id
		`;
		return createdRows[0].id;
	});
}

async function getStepTimeoutSeconds(): Promise<number> {
	const rows = await prisma.$queryRaw<{ step_timeout_seconds: number }[]>`
		SELECT step_timeout_seconds FROM fota_config WHERE id = 1
	`;
	return rows[0]?.step_timeout_seconds ?? DEFAULT_STEP_TIMEOUT_SECONDS;
}

async function postUpgradeTask(request: NextRequest): Promise<Response> {
	const authenticatedRequest = request as AuthenticatedRequest;
	const actorIdRaw = authenticatedRequest.auth?.userId;

	if (!actorIdRaw) {
		return errorResponse('Unauthorized', 401);
	}

	let actorId: bigint;
	try {
		actorId = BigInt(actorIdRaw);
	} catch {
		return errorResponse('Invalid token payload', 401);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return errorResponse('Invalid JSON payload', 400);
	}

	const parsed = createUpgradeTaskSchema.safeParse(body);
	if (!parsed.success) {
		const firstIssue = parsed.error.issues[0];
		const message = firstIssue
			? `${firstIssue.path.join('.') || 'body'}: ${firstIssue.message}`
			: 'Invalid request body';
		return errorResponse(message, 400);
	}

	const data = parsed.data;
	const firmwareUrl = data.firmwareUrl ?? DEFAULT_FIRMWARE_URL;

	let placeholderPlantId: bigint | null = null;
	if (data.devices.some((device) => device.plantId === undefined)) {
		try {
			placeholderPlantId = await resolvePlaceholderPlantId(actorId);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			return errorResponse(`Could not resolve a default plant for devices missing plantId: ${message}`, 500);
		}
	}

	// Resolve every optional per-device field up front so the rest of this
	// handler (duplicate check, conflict check, insert loop) only ever deals
	// in concrete values, never `undefined`.
	let resolvedDevices: {
		plantId: bigint;
		loggerImei: string;
		inverterSerialNo: string;
		currentFirmware: string;
	}[];
	try {
		resolvedDevices = data.devices.map((device) => ({
			plantId: device.plantId !== undefined ? BigInt(device.plantId) : placeholderPlantId!,
			loggerImei: device.loggerImei ?? DEFAULT_LOGGER_IMEI,
			inverterSerialNo: device.inverterSerialNo,
			currentFirmware: device.currentFirmware ?? DEFAULT_CURRENT_FIRMWARE,
		}));
	} catch {
		return errorResponse('plantId must be a valid integer for every device', 400);
	}

	// Duplicate devices within the same batch would otherwise collide on
	// idx_fota_job_one_active_per_device inside the transaction below.
	const seenDevices = new Set<string>();
	for (const device of resolvedDevices) {
		const key = `${device.loggerImei}::${device.inverterSerialNo}`;
		if (seenDevices.has(key)) {
			return errorResponse(
				`Duplicate device in request: loggerImei=${device.loggerImei} inverterSerialNo=${device.inverterSerialNo}`,
				400,
			);
		}
		seenDevices.add(key);
	}

	const uniquePlantIds = Array.from(new Set(resolvedDevices.map((device) => device.plantId)));
	const plantRows = await prisma.$queryRaw<PlantRow[]>`
		SELECT id FROM plants WHERE id IN (${Prisma.join(uniquePlantIds)}) AND deleted_at IS NULL
	`;
	const foundPlantIds = new Set(plantRows.map((row) => row.id.toString()));
	const missingPlantIds = uniquePlantIds.filter((id) => !foundPlantIds.has(id.toString()));
	if (missingPlantIds.length > 0) {
		return errorResponse(`Plant(s) not found: ${missingPlantIds.join(', ')}`, 404);
	}

	const firmwareResolution = await resolveFirmware(data.newFirmwareVersion, data.chipType, data.firmwareId);
	if (!firmwareResolution.ok) {
		return errorResponse(firmwareResolution.message, 400);
	}

	const imeis = resolvedDevices.map((device) => device.loggerImei);
	const serials = resolvedDevices.map((device) => device.inverterSerialNo);
	const conflictRows = await prisma.$queryRaw<ActiveConflictRow[]>`
		SELECT logger_imei, inverter_serial_no, job_id::text, status
		FROM fota_job
		WHERE status NOT IN ('COMPLETED', 'FAILED')
			AND (logger_imei, inverter_serial_no) IN (
				SELECT * FROM unnest(${imeis}::varchar[], ${serials}::varchar[])
			)
	`;
	if (conflictRows.length > 0) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'One or more devices already have an active FOTA job; no jobs were created for this task',
				data: {
					conflicts: conflictRows.map((row) => ({
						loggerImei: row.logger_imei,
						inverterSerialNo: row.inverter_serial_no,
						activeJobId: row.job_id,
						activeJobStatus: row.status,
					})),
				},
			}),
			{ status: 409, headers: { 'content-type': 'application/json' } },
		);
	}

	const stepTimeoutSeconds = await getStepTimeoutSeconds();

	try {
		const result = await prisma.$transaction(async (tx) => {
			const taskRows = await tx.$queryRaw<{ id: string }[]>`
				INSERT INTO upgrade_task (name, created_by, updated_at)
				VALUES (${data.name}, ${actorId}, now())
				RETURNING id::text
			`;
			const taskId = taskRows[0].id;

			const jobs: { jobId: string; plantId: string; loggerImei: string; inverterSerialNo: string; status: string }[] = [];

			for (const device of resolvedDevices) {
				const jobRows = await tx.$queryRaw<{ job_id: string; status: string }[]>`
					INSERT INTO fota_job (
						plant_id, logger_imei, inverter_serial_no, current_firmware,
						new_firmware_version, firmware_id, "chipType", update_type,
						firmware_url, step_timeout_seconds, step_deadline_at, started_by, updated_at
					) VALUES (
						${device.plantId}, ${device.loggerImei}, ${device.inverterSerialNo}, ${device.currentFirmware},
						${data.newFirmwareVersion}, ${firmwareResolution.firmwareId}::uuid, ${data.chipType}::"ChipType", ${data.updateType}::"UpdateType",
						${firmwareUrl}, ${stepTimeoutSeconds}, now() + make_interval(secs => ${stepTimeoutSeconds}), ${actorId}, now()
					)
					RETURNING job_id::text, status
				`;
				const job = jobRows[0];

				await tx.$executeRaw`
					INSERT INTO task_job (task_id, job_id) VALUES (${taskId}::uuid, ${job.job_id}::uuid)
				`;

				jobs.push({
					jobId: job.job_id,
					plantId: device.plantId.toString(),
					loggerImei: device.loggerImei,
					inverterSerialNo: device.inverterSerialNo,
					status: job.status,
				});
			}

			return { taskId, jobs };
		});

		return successResponse('Upgrade task created', result, 201);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		if (message.includes('idx_fota_job_one_active_per_device')) {
			return errorResponse(
				'A device in this batch already has an active FOTA job (race condition) — no jobs were created',
				409,
			);
		}
		throw error;
	}
}

async function getUpgradeTasks(request: NextRequest): Promise<Response> {
	const searchParams = request.nextUrl.searchParams;
	const parsed = listUpgradeTasksQuerySchema.safeParse({
		name: searchParams.get('name') ?? undefined,
		page: searchParams.get('page') ?? undefined,
		pageSize: searchParams.get('pageSize') ?? undefined,
	});

	if (!parsed.success) {
		const firstIssue = parsed.error.issues[0];
		return errorResponse(firstIssue?.message ?? 'Invalid query parameters', 400);
	}

	const { name, page, pageSize } = parsed.data;
	const offset = (page - 1) * pageSize;
	const nameFilterSql = name ? Prisma.sql`WHERE ut.name ILIKE ${`%${name}%`}` : Prisma.empty;

	type TaskAggregateRow = {
		id: string;
		name: string;
		created_at: Date;
		total_jobs: bigint;
		failed_jobs: bigint;
		completed_jobs: bigint;
	};

	const items = await prisma.$queryRaw<TaskAggregateRow[]>`
		SELECT ut.id::text AS id, ut.name, ut.created_at,
			COUNT(fj.job_id) AS total_jobs,
			COUNT(*) FILTER (WHERE fj.status = 'FAILED') AS failed_jobs,
			COUNT(*) FILTER (WHERE fj.status = 'COMPLETED') AS completed_jobs
		FROM upgrade_task ut
		LEFT JOIN task_job tj ON tj.task_id = ut.id
		LEFT JOIN fota_job fj ON fj.job_id = tj.job_id
		${nameFilterSql}
		GROUP BY ut.id
		ORDER BY ut.created_at DESC
		LIMIT ${pageSize}
		OFFSET ${offset}
	`;

	const countRows = await prisma.$queryRaw<{ count: bigint | number | string }[]>`
		SELECT COUNT(*) AS count FROM upgrade_task ut ${nameFilterSql}
	`;
	const totalItems = Number(countRows[0]?.count ?? 0);

	return successResponse('OK', {
		items: items.map((row) => {
			const totalJobs = Number(row.total_jobs);
			const failedJobs = Number(row.failed_jobs);
			const completedJobs = Number(row.completed_jobs);
			const status =
				failedJobs > 0 ? 'Failed' : totalJobs > 0 && completedJobs === totalJobs ? 'Finished' : 'In Progress';

			return {
				id: row.id,
				name: row.name,
				status,
				created: formatDateTime(row.created_at),
				begin: formatDateTime(row.created_at),
			};
		}),
		pagination: {
			page,
			pageSize,
			totalItems,
			totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
		},
	});
}

export const POST = withRequestLogging(requireAuth(postUpgradeTask), {
	routeName: 'service.upgrade_tasks.create',
});

export const GET = withRequestLogging(requireAuth(getUpgradeTasks), {
	routeName: 'service.upgrade_tasks.list',
});
