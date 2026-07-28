import type { NextRequest } from 'next/server';

import { prisma } from '@/server/db/prisma';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { withRequestLogging } from '@/server/middleware/request-log.middleware';
import { errorResponse, successResponse } from '@/server/utils/api-response';

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
