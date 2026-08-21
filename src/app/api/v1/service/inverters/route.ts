import type { NextRequest } from 'next/server';

import type { AuthenticatedRequest } from '@/server/middleware/auth.middleware';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { withRequestLogging } from '@/server/middleware/request-log.middleware';
import { listInverters } from '@/server/services/device.service';
import { errorResponse, successResponse } from '@/server/utils/api-response';
import type { User } from '@/server/utils/auth-helper';
import { resolveInverterScope } from '@/server/utils/inverter-scope';
import { InverterListQueryValidator } from '@/server/validators/device.validator';

async function getInvertersRoute(request: NextRequest): Promise<Response> {
	const authenticatedRequest = request as AuthenticatedRequest;
	const auth = authenticatedRequest.auth;

	if (!auth?.userId) {
		return errorResponse('Unauthorized', 401);
	}

	const searchParams = request.nextUrl.searchParams;
	const parsedQuery = InverterListQueryValidator.safeParse({
		fromService: searchParams.get('fromService') ? searchParams.get('fromService') === 'true' : undefined,
		targetEndUserId: searchParams.get('targetEndUserId') ?? undefined,
		page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
		pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : undefined,
		search: searchParams.get('search') ?? undefined,
	});

	if (!parsedQuery.success) {
		const issue = parsedQuery.error.issues[0];
		return errorResponse(
			issue ? `${issue.path.join('.') || 'query'}: ${issue.message}` : 'Invalid query parameters',
			400,
		);
	}

	const user: User = {
		userId: auth.userId,
		account: typeof auth.account === 'string' ? auth.account : auth.userId,
		role: auth.role,
	};

	const { fromService, targetEndUserId, page, pageSize, search } = parsedQuery.data;
	const scopeResult = await resolveInverterScope(user, { fromService, targetEndUserId });
	if (!scopeResult.ok) {
		return errorResponse(scopeResult.message, scopeResult.status);
	}

	const { items, totalItems } = await listInverters({ scope: scopeResult.scope, page, pageSize, search });

	return successResponse('OK', {
		items,
		pagination: {
			page,
			pageSize,
			totalItems,
			totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
		},
	});
}

export const GET = withRequestLogging(requireAuth(getInvertersRoute), {
	routeName: 'service.inverters.list',
});
