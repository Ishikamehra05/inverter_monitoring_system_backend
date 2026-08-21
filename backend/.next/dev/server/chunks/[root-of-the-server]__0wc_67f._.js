module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/src/server/utils/api-error.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "getErrorDiagnostics",
    ()=>getErrorDiagnostics,
    "isDatabaseError",
    ()=>isDatabaseError,
    "toErrorMessage",
    ()=>toErrorMessage
]);
const DATABASE_ERROR_KEYWORDS = [
    'prisma',
    'database',
    'db',
    'query',
    'sql',
    'connection',
    'constraint',
    'foreign key',
    'unique'
];
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return String(error);
}
function extractErrorCode(error) {
    if (typeof error === 'object' && error !== null) {
        const withCode = error;
        if (typeof withCode.code === 'string' && withCode.code.trim().length > 0) {
            return withCode.code.trim().toUpperCase();
        }
    }
    const message = getErrorMessage(error);
    const prismaCode = message.match(/\bP\d{4}\b/i)?.[0];
    if (prismaCode) {
        return prismaCode.toUpperCase();
    }
    const sqlStateCode = message.match(/\bSQLSTATE\s*[:=]?\s*([0-9A-Z]{5})\b/i)?.[1];
    if (sqlStateCode) {
        return sqlStateCode.toUpperCase();
    }
    return undefined;
}
function extractErrorLine(error) {
    if (!(error instanceof Error) || typeof error.stack !== 'string') {
        return undefined;
    }
    const sourceLineMatch = error.stack.match(/src\/[^\n:]+:(\d+):(\d+)/);
    if (sourceLineMatch?.[1]) {
        return Number(sourceLineMatch[1]);
    }
    const fallbackLineMatch = error.stack.match(/:(\d+):(\d+)\)?(?:\n|$)/);
    if (fallbackLineMatch?.[1]) {
        return Number(fallbackLineMatch[1]);
    }
    return undefined;
}
function extractDatabaseOutput(error) {
    if (typeof error !== 'object' || error === null) {
        return undefined;
    }
    const withMeta = error;
    const candidate = withMeta.meta ?? withMeta.detail ?? withMeta.details;
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate.trim();
    }
    if (candidate && typeof candidate === 'object') {
        try {
            return JSON.stringify(candidate);
        } catch  {
            return undefined;
        }
    }
    return undefined;
}
function isDatabaseError(error) {
    const message = getErrorMessage(error).toLowerCase();
    if (DATABASE_ERROR_KEYWORDS.some((keyword)=>message.includes(keyword))) {
        return true;
    }
    if (typeof error === 'object' && error !== null) {
        const withCode = error;
        if (typeof withCode.code === 'string' && /^p\d{4}$/i.test(withCode.code)) {
            return true;
        }
        if (typeof withCode.name === 'string' && withCode.name.toLowerCase().includes('prisma')) {
            return true;
        }
    }
    return false;
}
function getErrorDiagnostics(error) {
    return {
        message: getErrorMessage(error),
        isDatabase: isDatabaseError(error),
        code: extractErrorCode(error),
        line: extractErrorLine(error),
        output: extractDatabaseOutput(error)
    };
}
function toErrorMessage(error) {
    const diagnostics = getErrorDiagnostics(error);
    if (!diagnostics.isDatabase) {
        return diagnostics.message;
    }
    const fragments = [
        'Database error'
    ];
    if (diagnostics.code) {
        fragments.push(`code=${diagnostics.code}`);
    }
    if (typeof diagnostics.line === 'number') {
        fragments.push(`line=${diagnostics.line}`);
    }
    const prefix = `${fragments.join(' | ')}: ${diagnostics.message}`;
    if (diagnostics.output) {
        return `${prefix} | dbOutput=${diagnostics.output}`;
    }
    return prefix;
}
class ApiError extends Error {
    statusCode;
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static handle(res, error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        res.status(statusCode).json({
            success: false,
            message
        });
    }
}
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/server/utils/request-context.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "attachResultToOperation",
    ()=>attachResultToOperation,
    "beginDbOperation",
    ()=>beginDbOperation,
    "detectQueryType",
    ()=>detectQueryType,
    "extractQueryResult",
    ()=>extractQueryResult,
    "getCapturedDbQueries",
    ()=>getCapturedDbQueries,
    "runWithRequestContext",
    ()=>runWithRequestContext,
    "trackDbQuery",
    ()=>trackDbQuery
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
;
const requestContext = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
const MAX_CAPTURED_DB_QUERIES = 25;
const MAX_QUERY_TEXT_LENGTH = 1200;
const MAX_PARAMS_TEXT_LENGTH = 1200;
function truncate(value, maxLength) {
    if (value.length <= maxLength) {
        return value;
    }
    return `${value.slice(0, maxLength)}...`;
}
function detectQueryType(query) {
    const trimmed = query.trim().toUpperCase();
    // Handle common query patterns
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
        return 'SELECT';
    }
    if (trimmed.startsWith('INSERT')) {
        return 'INSERT';
    }
    if (trimmed.startsWith('UPDATE')) {
        return 'UPDATE';
    }
    if (trimmed.startsWith('DELETE')) {
        return 'DELETE';
    }
    if (trimmed.startsWith('CREATE')) {
        return 'CREATE';
    }
    if (trimmed.startsWith('DROP')) {
        return 'DROP';
    }
    if (trimmed.startsWith('ALTER')) {
        return 'ALTER';
    }
    if (trimmed.startsWith('TRUNCATE')) {
        return 'TRUNCATE';
    }
    return 'OTHER';
}
function runWithRequestContext(requestId, fn) {
    return requestContext.run({
        requestId,
        dbQueries: []
    }, fn);
}
function trackDbQuery(query) {
    const store = requestContext.getStore();
    if (!store) {
        return;
    }
    if (store.dbQueries.length >= MAX_CAPTURED_DB_QUERIES) {
        return;
    }
    store.dbQueries.push({
        query: truncate(query.query, MAX_QUERY_TEXT_LENGTH),
        params: truncate(query.params, MAX_PARAMS_TEXT_LENGTH),
        durationMs: query.durationMs,
        target: query.target,
        type: query.type,
        result: query.result
    });
}
function beginDbOperation() {
    const store = requestContext.getStore();
    if (!store) {
        return -1;
    }
    return store.dbQueries.length;
}
function attachResultToOperation(startIndex, result) {
    const store = requestContext.getStore();
    if (!store || startIndex < 0 || startIndex >= store.dbQueries.length) {
        return;
    }
    for(let i = startIndex; i < store.dbQueries.length; i += 1){
        store.dbQueries[i].result = result;
    }
}
function extractQueryResult(result) {
    if (!result) {
        return {
            rowCount: 0
        };
    }
    // Handle array result (SELECT query)
    if (Array.isArray(result)) {
        return {
            rowCount: result.length,
            rows: result.slice(0, 10)
        };
    }
    // Handle object with count property (INSERT/UPDATE/DELETE affected rows)
    if (typeof result === 'object' && result !== null) {
        const obj = result;
        if ('count' in obj && typeof obj.count === 'number') {
            return {
                affectedRows: obj.count
            };
        }
        if ('affectedRows' in obj && typeof obj.affectedRows === 'number') {
            return {
                affectedRows: obj.affectedRows
            };
        }
        if ('rowCount' in obj && typeof obj.rowCount === 'number') {
            return {
                rowCount: obj.rowCount
            };
        }
        return {
            data: result
        };
    }
    return {
        data: result
    };
}
function getCapturedDbQueries() {
    const store = requestContext.getStore();
    return store ? [
        ...store.dbQueries
    ] : [];
}
}),
"[project]/src/server/middleware/request-log.middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withRequestLogging",
    ()=>withRequestLogging
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/api-error.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/request-context.ts [app-route] (ecmascript)");
;
;
;
;
;
async function readResponseBody(response) {
    const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
    if (!contentType.includes('application/json')) {
        return undefined;
    }
    try {
        return await response.clone().json();
    } catch  {
        return undefined;
    }
}
function errorMessageFromBody(body) {
    if (!body) return undefined;
    if (typeof body.error === 'string' && body.error.length > 0) return body.error;
    if (typeof body.message === 'string' && body.message.length > 0) return body.message;
    return undefined;
}
function diagnosticsFromErrorMessage(errorMessage) {
    if (!errorMessage) {
        return {};
    }
    const code = errorMessage.match(/code=([A-Z0-9_]+)/)?.[1];
    const lineText = errorMessage.match(/line=(\d+)/)?.[1];
    const output = errorMessage.match(/\|\s*dbOutput=(.+)$/)?.[1]?.trim();
    return {
        errorCode: code,
        errorLine: lineText ? Number(lineText) : undefined,
        databaseOutput: output,
        isDatabaseError: errorMessage.toLowerCase().startsWith('database error')
    };
}
function parseBoolean(value, defaultValue) {
    if (!value) {
        return defaultValue;
    }
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
}
function getTransports() {
    const rawTransports = process.env.API_LOG_TRANSPORTS?.trim();
    if (!rawTransports) {
        return [
            'console'
        ];
    }
    const transports = rawTransports.split(',').map((entry)=>entry.trim().toLowerCase()).filter((entry)=>{
        return entry === 'console' || entry === 'file' || entry === 'webhook';
    });
    return transports.length > 0 ? transports : [
        'console'
    ];
}
function getRequestId(request) {
    return request.headers.get('x-request-id') ?? crypto.randomUUID();
}
function getClientIp(request) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        const firstForwardedIp = forwardedFor.split(',')[0]?.trim();
        if (firstForwardedIp) {
            return firstForwardedIp;
        }
    }
    const realIp = request.headers.get('x-real-ip')?.trim();
    return realIp && realIp.length > 0 ? realIp : 'unknown';
}
function buildEvent(request, status, durationMs, requestId, dbQueries, options, responseBody, error, errorDetails) {
    const url = new URL(request.url);
    return {
        timestamp: new Date().toISOString(),
        requestId,
        method: request.method,
        path: url.pathname,
        status,
        durationMs,
        ip: getClientIp(request),
        userAgent: request.headers.get('user-agent') ?? 'unknown',
        routeName: options?.routeName,
        response: responseBody,
        error,
        errorCode: errorDetails?.errorCode,
        errorLine: errorDetails?.errorLine,
        databaseOutput: errorDetails?.databaseOutput,
        isDatabaseError: errorDetails?.isDatabaseError,
        dbQueryCount: dbQueries.length,
        dbQueries
    };
}
async function writeLogToFile(event) {
    const filePath = process.env.API_LOG_FILE_PATH?.trim() || 'logs/api.log';
    const directoryPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["dirname"])(filePath);
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["mkdir"])(directoryPath, {
        recursive: true
    });
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["appendFile"])(filePath, `${JSON.stringify(event)}\n`, 'utf8');
}
async function sendLogToWebhook(event) {
    const webhookUrl = process.env.API_LOG_WEBHOOK_URL?.trim();
    if (!webhookUrl) {
        return;
    }
    await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(event)
    });
}
/**
 * Organizes database queries by type for better readability in logs
 */ function formatQueriesByType(queries) {
    const grouped = {};
    for (const query of queries){
        if (!grouped[query.type]) {
            grouped[query.type] = [];
        }
        grouped[query.type].push(query);
    }
    return grouped;
}
function dispatchRequestLog(event) {
    const loggingEnabled = parseBoolean(process.env.API_LOG_ENABLED, true);
    if (!loggingEnabled) {
        return;
    }
    const transports = getTransports();
    for (const transport of transports){
        if (transport === 'console') {
            console.info('[API_REQUEST_LOG]', (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["inspect"])(event, {
                depth: null,
                colors: false
            }));
            // Log database queries organized by type if present
            if (event.dbQueryCount > 0) {
                const queriesByType = formatQueriesByType(event.dbQueries);
                const queriesOutput = Object.entries(queriesByType).reduce((acc, [type, queries])=>{
                    acc[type] = {
                        count: queries.length,
                        queries: queries.map((q)=>({
                                query: q.query,
                                params: q.params,
                                durationMs: q.durationMs,
                                target: q.target,
                                type: q.type,
                                result: q.result
                            }))
                    };
                    return acc;
                }, {});
                console.info('[API_DB_QUERIES]', (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["inspect"])({
                    total: event.dbQueryCount,
                    byType: queriesOutput
                }, {
                    depth: null,
                    colors: false
                }));
            }
            continue;
        }
        if (transport === 'file') {
            void writeLogToFile(event).catch((error)=>{
                console.error('[API_REQUEST_LOG_FILE_ERROR]', {
                    message: error instanceof Error ? error.message : String(error)
                });
            });
            continue;
        }
        if (transport === 'webhook') {
            void sendLogToWebhook(event).catch((error)=>{
                console.error('[API_REQUEST_LOG_WEBHOOK_ERROR]', {
                    message: error instanceof Error ? error.message : String(error)
                });
            });
        }
    }
}
function withRequestLogging(handler, options) {
    return async (request, context)=>{
        const requestId = getRequestId(request);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithRequestContext"])(requestId, async ()=>{
            const startedAt = Date.now();
            try {
                const response = await handler(request, context);
                const responseBody = await readResponseBody(response);
                const errorMessage = response.status >= 400 ? errorMessageFromBody(responseBody) : undefined;
                const responseDiagnostics = diagnosticsFromErrorMessage(errorMessage);
                const event = buildEvent(request, response.status, Date.now() - startedAt, requestId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCapturedDbQueries"])(), options, responseBody, errorMessage, responseDiagnostics);
                dispatchRequestLog(event);
                return response;
            } catch (error) {
                const diagnostics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getErrorDiagnostics"])(error);
                const errorBody = {
                    success: false,
                    message: diagnostics.message
                };
                const event = buildEvent(request, 500, Date.now() - startedAt, requestId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCapturedDbQueries"])(), options, errorBody, diagnostics.message, {
                    errorCode: diagnostics.code,
                    errorLine: diagnostics.line,
                    databaseOutput: diagnostics.output,
                    isDatabaseError: diagnostics.isDatabase
                });
                dispatchRequestLog(event);
                throw error;
            }
        });
    };
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/server/utils/api-response.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "errorResponse",
    ()=>errorResponse,
    "successResponse",
    ()=>successResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
function successResponse(message, data, status = 200) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        message,
        data
    }, {
        status
    });
}
function errorResponse(message, status) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message
    }, {
        status
    });
}
}),
"[project]/src/app/api/v1/auth/logout/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$middleware$2f$request$2d$log$2e$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/middleware/request-log.middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/api-response.ts [app-route] (ecmascript)");
;
;
async function postLogout(_request) {
    const response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])('Logout successful', {});
    const nextResponse = response;
    nextResponse.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0
    });
    nextResponse.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0
    });
    return nextResponse;
}
const POST = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$middleware$2f$request$2d$log$2e$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withRequestLogging"])(postLogout, {
    routeName: 'auth.logout'
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0wc_67f._.js.map