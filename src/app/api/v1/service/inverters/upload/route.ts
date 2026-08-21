import type { NextRequest } from 'next/server';
import ExcelJS from 'exceljs';

import type { AuthenticatedRequest } from '@/server/middleware/auth.middleware';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { withRequestLogging } from '@/server/middleware/request-log.middleware';
import { errorResponse, successResponse } from '@/server/utils/api-response';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_ROWS = 2000;

type SheetDevice = { serialNumber: string; name: string };

function cellText(value: ExcelJS.CellValue): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') {
		// Rich text / hyperlink / formula-result cells
		const withText = value as { text?: string; result?: unknown; richText?: { text: string }[] };
		if (typeof withText.text === 'string') return withText.text;
		if (Array.isArray(withText.richText)) return withText.richText.map((part) => part.text).join('');
		if (withText.result !== undefined) return String(withText.result);
		return '';
	}
	return String(value).trim();
}

function findColumn(headerRow: ExcelJS.Row, matcher: (header: string) => boolean): number | null {
	let found: number | null = null;
	headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
		if (found !== null) return;
		const header = cellText(cell.value).toLowerCase();
		if (matcher(header)) {
			found = colNumber;
		}
	});
	return found;
}

async function parseWorkbook(buffer: ArrayBuffer): Promise<
	{ ok: true; devices: SheetDevice[] } | { ok: false; message: string }
> {
	const workbook = new ExcelJS.Workbook();

	try {
		await workbook.xlsx.load(buffer);
	} catch {
		return { ok: false, message: 'Could not read the uploaded file — make sure it is a valid .xlsx workbook' };
	}

	const worksheet = workbook.worksheets[0];
	if (!worksheet || worksheet.rowCount < 2) {
		return { ok: false, message: 'The uploaded sheet has no data rows' };
	}

	const headerRow = worksheet.getRow(1);
	const serialColumn = findColumn(
		headerRow,
		(header) => header.includes('serial') || header === 'sn' || header === 's/n',
	);
	const nameColumn = findColumn(headerRow, (header) => header.includes('name'));

	if (!serialColumn) {
		return { ok: false, message: 'Could not find a "Serial No" column in the uploaded sheet' };
	}

	const devices: SheetDevice[] = [];
	const lastRow = Math.min(worksheet.rowCount, MAX_ROWS + 1);

	for (let rowNumber = 2; rowNumber <= lastRow; rowNumber += 1) {
		const row = worksheet.getRow(rowNumber);
		const serialNumber = cellText(row.getCell(serialColumn).value);
		if (!serialNumber) continue;

		const name = nameColumn ? cellText(row.getCell(nameColumn).value) : '';
		devices.push({ serialNumber, name });
	}

	return { ok: true, devices };
}

async function postInvertersUpload(request: NextRequest): Promise<Response> {
	const authenticatedRequest = request as AuthenticatedRequest;
	const auth = authenticatedRequest.auth;

	if (!auth?.userId) {
		return errorResponse('Unauthorized', 401);
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return errorResponse('Invalid multipart form data', 400);
	}

	const file = formData.get('file');
	if (!(file instanceof File) || file.size === 0) {
		return errorResponse('An .xlsx file is required', 400);
	}
	if (!file.name.toLowerCase().endsWith('.xlsx')) {
		return errorResponse('Only .xlsx files are supported', 400);
	}
	if (file.size > MAX_FILE_SIZE_BYTES) {
		return errorResponse('File is too large — the limit is 5MB', 400);
	}

	const parsed = await parseWorkbook(await file.arrayBuffer());
	if (!parsed.ok) {
		return errorResponse(parsed.message, 400);
	}

	if (parsed.devices.length === 0) {
		return errorResponse('No serial numbers were found in the uploaded sheet', 400);
	}

	// Trust the sheet directly — no cross-check against device_inverters.
	// Dedupe by serial number in case the sheet has repeated rows.
	const seen = new Set<string>();
	const devices = parsed.devices.filter((device) => {
		if (seen.has(device.serialNumber)) return false;
		seen.add(device.serialNumber);
		return true;
	});

	return successResponse('OK', { devices });
}

export const POST = withRequestLogging(requireAuth(postInvertersUpload), {
	routeName: 'service.inverters.upload',
});
