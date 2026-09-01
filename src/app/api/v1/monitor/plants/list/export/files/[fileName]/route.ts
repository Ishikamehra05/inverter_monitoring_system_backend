import type { NextRequest } from 'next/server';
import type { User } from '@/server/utils/auth-helper';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { withRequestLogging } from '@/server/middleware/request-log.middleware';
import { getPlantList } from '@/server/services/plant.service';
import { errorResponse } from '@/server/utils/api-response';
import { resolveUserScope } from '@/server/utils/scope-resolver';
import { UserRepository } from '@/server/repositories/user.repository';

const userRepository = new UserRepository();

type Context = {
    params: Promise<{
        fileName: string;
    }>;
};

async function getPlantListFileRoute(
    request: NextRequest,
    context: Context,
): Promise<Response> {
    const auth = (request as any).auth;

    if (!auth?.userId) {
        return errorResponse(
            'Unauthorized',
            401,
        );
    }

    const user: User = {
        userId: auth.userId,
        account:
            typeof auth.account === 'string'
                ? auth.account
                : auth.userId,
        role: auth.role,
    };

    // const scope =
    //     await resolveUserScope(user);
    const searchParams = new URL(request.url).searchParams;

    const fromService =
        searchParams.get('fromService') === 'true';

    const targetEndUserId =
        searchParams.get('targetEndUserId') ?? undefined;

    const baseScope =
        await resolveUserScope(user);

    const hasServiceRole =
        user.role === 'service_admin' ||
        user.role === 'service_super_admin';

    let scope = baseScope;

    if (
        fromService &&
        hasServiceRole &&
        targetEndUserId
    ) {
        const accountScope =
            await userRepository.getAccountScopeByUserId(
                targetEndUserId,
            );

        if (!accountScope) {
            return errorResponse(
                'Selected end user not found',
                404,
            );
        }

        scope = accountScope;
    }

    console.log({
        fromService,
        targetEndUserId,
        baseScope,
        finalScope: scope,
    });

    const { fileName } =
        await context.params;

    if (
        fileName !==
        'plant-list.csv'
    ) {
        return errorResponse(
            'File not found',
            404,
        );
    }

    const result =
        await getPlantList({
            user,
            scope,
            page: 1,
            pageSize: 100000,
        });

    const headers = [
        'Account',
        'Plant Name',
        'id',
        'ownerUserId',
        'type',
        'price',
        'priceUnit',
        'kwp',
        'address',
        'latitude',
        'longitude',
        'eToday',
        'eTotal',
        'power',
        'installed',
        'updated',
    ];

    const csvEscape = (value: unknown) => {
        const text = String(value ?? '');
        return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const rows = [headers.map(csvEscape).join(',')];

    for (const plant of result.items) {
        rows.push(
            [
                    plant.ownerUserId,
                    plant.name,
                    plant.id,
                plant.ownerUserId,
                plant.type,
                plant.price ?? '',
                plant.priceUnit ?? '',
                plant.kwp ?? '',
                plant.address ?? '',
                plant.latitude ?? '',
                plant.longitude ?? '',
                plant.eToday?.value ?? 0,
                plant.eTotal?.value ?? 0,
                plant.power?.value ?? 0,
                plant.installed ?? '',
                plant.updated ?? '',
            ].map(csvEscape).join(','),
        );
    }

    const BOM = '\uFEFF';

    return new Response(`${BOM}${rows.join('\n')}\n`, {
        status: 200,
        headers: {
            'content-type': 'text/csv; charset=utf-8',
            'content-disposition': 'attachment; filename="plants.csv"',
        },
    });

    // return new Response(
    //     rows.join('\n'),
    //     {
    //         headers: {
    //             'Content-Type':
    //                 'text/csv; charset=utf-8',

    //             'Content-Disposition':
    //                 'attachment; filename="plant-list.csv"',
    //         },
    //     },
    // );
}

export const GET =
    withRequestLogging(
        requireAuth(
            getPlantListFileRoute,
        ),
        {
            routeName:
                'monitor.plants.list.export.file',
        },
    );