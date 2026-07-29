import type { NextRequest } from 'next/server';

import { prisma } from '@/server/db/prisma';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { withRequestLogging } from '@/server/middleware/request-log.middleware';
import { errorResponse, successResponse } from '@/server/utils/api-response';
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  const { firmwareId } = await context.params;

  const rows = await prisma.$queryRaw<{ file_path: string }[]>`
    SELECT file_path
    FROM firmware
    WHERE id = ${firmwareId}::uuid
      AND deleted_at IS NULL
    LIMIT 1
  `;

  const firmware = rows[0];

  if (!firmware) {
    return errorResponse("Firmware not found", 404);
  }

  const filePath = path.join(process.cwd(), firmware.file_path);

  try {
    const file = await fs.readFile(filePath);

    return new Response(file, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`,
      },
    });
  } catch {
    return errorResponse("Firmware file not found", 404);
  }
}

type RouteContext = {
	params: Promise<{
		firmwareId: string;
	}>;
};

async function deleteFirmware(
	_request: NextRequest,
	context: RouteContext,
): Promise<Response> {
	const { firmwareId } = await context.params;

	if (!firmwareId) {
		return errorResponse('Firmware id is required', 400);
	}

	const updated = await prisma.$executeRaw`
		UPDATE firmware
		SET deleted_at = now()
		WHERE id = ${firmwareId}::uuid
			AND deleted_at IS NULL
	`;

	if (updated === 0) {
		return errorResponse('Firmware not found', 404);
	}

	return successResponse('Firmware deleted', null);
}

export const DELETE = withRequestLogging(requireAuth(deleteFirmware), {
	routeName: 'service.firmware.delete',
});

