import { UserRepository } from '@/server/repositories/user.repository';
import type { User } from '@/server/utils/auth-helper';
import { resolveUserScope } from '@/server/utils/scope-resolver';

const userRepository = new UserRepository();

export interface ResolveInverterScopeOptions {
	fromService?: boolean;
	targetEndUserId?: string;
}

export type ResolveInverterScopeResult =
	| { ok: true; scope: string[] | 'all' }
	| { ok: false; status: number; message: string };

// Shared by /service/inverters and /service/inverters/upload — a
// service_admin/service_super_admin's own account never owns a plant, so
// resolveUserScope() alone always yields zero results for them. A
// service_super_admin isn't scoped to any one end user and sees everything;
// a service_admin must pass fromService + targetEndUserId to view a specific
// end user's inverters, same as /monitor/plants/{plantId}/devices.
export async function resolveInverterScope(
	user: User,
	options: ResolveInverterScopeOptions,
): Promise<ResolveInverterScopeResult> {
	if (user.role === 'service_super_admin') {
		return { ok: true, scope: 'all' };
	}

	const hasServiceRole = user.role === 'service_admin' || user.role === 'service_super_admin';

	if (options.fromService && hasServiceRole && options.targetEndUserId) {
		const accountScope = await userRepository.getAccountScopeByUserId(options.targetEndUserId);
		if (!accountScope) {
			return { ok: false, status: 404, message: 'Selected end user not found' };
		}
		return { ok: true, scope: accountScope };
	}

	return { ok: true, scope: await resolveUserScope(user) };
}
