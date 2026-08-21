import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/server/db/prisma';
import { Prisma } from '@/server/db/generated/prisma/client';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { withRequestLogging } from '@/server/middleware/request-log.middleware';
import { errorResponse, successResponse } from '@/server/utils/api-response';

const CHIP_TYPES = [
	'MASTER_DSP',
	'SLAVE_DSP',
	'CSB',
	'DCDC_DSP',
	'AFCI',
	'BMS1',
	'BMS2',
	'LCD',
] as const;

const firmwareQuerySchema = z.object({
	firmwareName: z.string().trim().optional(),
	firmwareVersion: z.string().trim().optional(),
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(5),
});

const uploadSchema = z.object({
	name: z.string().trim().min(1, 'Firmware name is required'),
	chipType: z.enum(CHIP_TYPES),
	remark: z.string().trim().optional(),
});

type FirmwareRow = {
	id: string;
	name: string;
	chip_type: string | null;
	version: string;
	created_time: Date | string;
	remark: string | null;
};

type CountRow = {
	count: bigint | number | string;
};

// function formatDateTime(value: Date | string): string {
// 	const date = value instanceof Date ? value : new Date(value);

// 	if (Number.isNaN(date.getTime())) {
// 		return String(value);
// 	}

// 	const pad = (part: number) => String(part).padStart(2, '0');

// 	return [
// 		date.getFullYear(),
// 		pad(date.getMonth() + 1),
// 		pad(date.getDate()),
// 	].join('-') + ' ' + [
// 		pad(date.getHours()),
// 		pad(date.getMinutes()),
// 		pad(date.getSeconds()),
// 	].join(':');
// }

function formatDateTime(value: Date | string): string {
	const str =
		value instanceof Date ? value.toISOString() : String(value);

	return str.replace("T", " ").replace(/\.\d+Z?$/, "").replace("Z", "");
}

function mapFirmware(row: FirmwareRow) {
	return {
		id: row.id,
		name: row.name,
		chipType: row.chip_type ?? undefined,
		version: row.version,
		createdTime: formatDateTime(row.created_time),
		remark: row.remark ?? '',
	};
}

function getFirmwareVersion(fileName: string): string {
	const lastDot = fileName.lastIndexOf('.');
	return lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
}

async function getFirmware(request: NextRequest): Promise<Response> {
	const searchParams = request.nextUrl.searchParams;
	const parsed = firmwareQuerySchema.safeParse({
		firmwareName: searchParams.get('firmwareName') ?? undefined,
		firmwareVersion: searchParams.get('firmwareVersion') ?? undefined,
		page: searchParams.get('page') ?? undefined,
		pageSize: searchParams.get('pageSize') ?? undefined,
	});

	if (!parsed.success) {
		const firstIssue = parsed.error.issues[0];
		return errorResponse(firstIssue?.message ?? 'Invalid query parameters', 400);
	}

	const { firmwareName, firmwareVersion, page, pageSize } = parsed.data;
	const offset = (page - 1) * pageSize;
	const conditions: Prisma.Sql[] = [Prisma.sql`deleted_at IS NULL`];

	if (firmwareName) {
		conditions.push(Prisma.sql`name ILIKE ${`%${firmwareName}%`}`);
	}

	if (firmwareVersion) {
		conditions.push(Prisma.sql`version ILIKE ${`%${firmwareVersion}%`}`);
	}

	const whereSql = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;

	const [items, countRows] = await Promise.all([
		prisma.$queryRaw<FirmwareRow[]>`
			SELECT id::text, name, chip_type, version, created_time, remark
			FROM firmware
			${whereSql}
			ORDER BY created_time DESC
			LIMIT ${pageSize}
			OFFSET ${offset}
		`,
		prisma.$queryRaw<CountRow[]>`
			SELECT COUNT(*) AS count
			FROM firmware
			${whereSql}
		`,
	]);

	const totalItems = Number(countRows[0]?.count ?? 0);

	return successResponse('OK', {
		items: items.map(mapFirmware),
		pagination: {
			page,
			pageSize,
			totalItems,
			totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
		},
	});
}

async function postFirmware(request: NextRequest): Promise<Response> {
	let formData: FormData;

	try {
		formData = await request.formData();
	} catch {
		return errorResponse('Invalid multipart form data', 400);
	}

	const parsed = uploadSchema.safeParse({
		name: formData.get('name'),
		chipType: formData.get('chipType'),
		remark: formData.get('remark') ?? '',
	});

	if (!parsed.success) {
		const firstIssue = parsed.error.issues[0];
		return errorResponse(firstIssue?.message ?? 'Invalid request body', 400);
	}

	const file = formData.get('file');

	if (!(file instanceof File) || file.size === 0) {
		return errorResponse('Firmware file is required', 400);
	}

	const firmwareId = randomUUID();
	// const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
	// const storageDir = path.join(process.cwd(), 'uploads', 'firmware');
	// const storageName = `${firmwareId}-${safeFileName}`;
	// const filePath = path.join(storageDir, storageName);
	// const relativePath = path.join('uploads', 'firmware', storageName);
	const bytes = Buffer.from(await file.arrayBuffer());
	const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
	const storageDir = path.join(process.cwd(), 'uploads', 'firmware');
	const filePath = path.join(storageDir, safeFileName);
	const relativePath = safeFileName;

	await mkdir(storageDir, { recursive: true });
	await writeFile(filePath, bytes);

	const { name, chipType, remark } = parsed.data;
	const version = getFirmwareVersion(file.name);
	await prisma.$executeRaw`
		INSERT INTO firmware (
			id,
			name,
			chip_type,
			version,
			remark,
			file_path,
			file_size,
			updated_time
		)
		VALUES (
			${firmwareId}::uuid,
			${name},
			${chipType}::"ChipType",
			${version},
			${remark ?? ''},
			${relativePath},
			${file.size},
			now()
		)
	`;

	return successResponse('Firmware uploaded', { firmwareId }, 201);
}

export const GET = withRequestLogging(requireAuth(getFirmware), {
	routeName: 'service.firmware.list',
});

export const POST = withRequestLogging(requireAuth(postFirmware), {
	routeName: 'service.firmware.upload',
});
