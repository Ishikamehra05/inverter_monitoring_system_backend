import type { NextRequest } from 'next/server';

import { prisma } from '@/server/db/prisma';
import { Prisma } from '@/server/db/generated/prisma/client';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { withRequestLogging } from '@/server/middleware/request-log.middleware';
import { errorResponse, successResponse } from '@/server/utils/api-response';
import { FOTA_JOB_STATUS_MESSAGES } from '@/server/features/fota/constants';

type RouteContext = {
	params: Promise<{ taskId: string }>;
};

type TaskRow = { id: string; name: string; created_at: Date; updated_at: Date };

type JobRow = {
	job_id: string;
	plant_id: bigint;
	logger_imei: string;
	inverter_serial_no: string;
	current_firmware: string | null;
	new_firmware_version: string;
	firmware_id: string | null;
	chipType: string;
	update_type: string;
	firmware_url: string;
	status: string;
	failure_reason: string | null;
	step_deadline_at: Date;
	created_at: Date;
	updated_at: Date;
};

type CommandLogRow = {
	job_id: string;
	step: number;
	command_sent: string;
	raw_response: string | null;
	parsed_result: string | null;
	status: string;
	sent_at: Date;
	responded_at: Date | null;
};

async function getUpgradeTaskDetail(
	_request: NextRequest,
	context: RouteContext,
): Promise<Response> {
	const { taskId } = await context.params;

	if (!taskId) {
		return errorResponse('Task id is required', 400);
	}

	let taskRows: TaskRow[];
	try {
		taskRows = await prisma.$queryRaw<TaskRow[]>`
			SELECT id::text, name, created_at, updated_at
			FROM upgrade_task
			WHERE id = ${taskId}::uuid
			LIMIT 1
		`;
	} catch {
		return errorResponse('Invalid task id', 400);
	}

	const task = taskRows[0];
	if (!task) {
		return errorResponse('Upgrade task not found', 404);
	}

	const jobRows = await prisma.$queryRaw<JobRow[]>`
		SELECT fj.job_id, fj.plant_id, fj.logger_imei, fj.inverter_serial_no, fj.current_firmware,
			fj.new_firmware_version, fj.firmware_id::text AS firmware_id, fj."chipType", fj.update_type,
			fj.firmware_url, fj.status, fj.failure_reason, fj.step_deadline_at, fj.created_at, fj.updated_at
		FROM task_job tj
		JOIN fota_job fj ON fj.job_id = tj.job_id
		WHERE tj.task_id = ${taskId}::uuid
		ORDER BY fj.created_at ASC
	`;

	const jobIds = jobRows.map((row) => row.job_id);
	const commandLogRows =
		jobIds.length > 0
			? await prisma.$queryRaw<CommandLogRow[]>`
				SELECT job_id::text, step_sequence AS step, command_sent, raw_response, parsed_result, status, sent_at, responded_at
				FROM fota_command_log
				WHERE job_id IN (${Prisma.join(jobIds.map((id) => Prisma.sql`${id}::uuid`))})
				ORDER BY job_id, step_sequence ASC
			`
			: [];

	const commandLogByJobId = new Map<string, CommandLogRow[]>();
	for (const row of commandLogRows) {
		const existing = commandLogByJobId.get(row.job_id) ?? [];
		existing.push(row);
		commandLogByJobId.set(row.job_id, existing);
	}

	const failedJobs = jobRows.filter((row) => row.status === 'FAILED').length;
	const completedJobs = jobRows.filter((row) => row.status === 'COMPLETED').length;
	const aggregateStatus =
		failedJobs > 0 ? 'Failed' : jobRows.length > 0 && completedJobs === jobRows.length ? 'Finished' : 'In Progress';

	return successResponse('OK', {
		taskId: task.id,
		name: task.name,
		status: aggregateStatus,
		createdAt: task.created_at.toISOString(),
		updatedAt: task.updated_at.toISOString(),
		jobs: jobRows.map((row) => ({
			jobId: row.job_id,
			plantId: row.plant_id.toString(),
			loggerImei: row.logger_imei,
			inverterSerialNo: row.inverter_serial_no,
			currentFirmware: row.current_firmware,
			newFirmwareVersion: row.new_firmware_version,
			firmwareId: row.firmware_id,
			chipType: row.chipType,
			updateType: row.update_type,
			firmwareUrl: row.firmware_url,
			status: row.status,
			message: FOTA_JOB_STATUS_MESSAGES[row.status] ?? row.status,
			failureReason: row.failure_reason,
			stepDeadlineAt: row.step_deadline_at.toISOString(),
			createdAt: row.created_at.toISOString(),
			updatedAt: row.updated_at.toISOString(),
			commandLog: (commandLogByJobId.get(row.job_id) ?? []).map((log) => ({
				step: log.step,
				commandSent: log.command_sent,
				rawResponse: log.raw_response,
				parsedResult: log.parsed_result,
				status: log.status,
				sentAt: log.sent_at.toISOString(),
				respondedAt: log.responded_at ? log.responded_at.toISOString() : null,
			})),
		})),
	});
}

export const GET = withRequestLogging(requireAuth(getUpgradeTaskDetail), {
	routeName: 'service.upgrade_tasks.detail',
});
