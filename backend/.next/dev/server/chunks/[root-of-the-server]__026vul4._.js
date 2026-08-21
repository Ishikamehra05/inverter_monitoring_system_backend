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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/server/middleware/auth.middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractAuthToken",
    ()=>extractAuthToken,
    "requireAuth",
    ()=>requireAuth,
    "verifyAuthToken",
    ()=>verifyAuthToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
;
const BEARER_PREFIX = 'Bearer ';
const DEFAULT_AUTH_COOKIE_NAME = 'accessToken';
function resolveJwtSecret(options) {
    if (options?.jwtSecret) {
        return options.jwtSecret;
    }
    return process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET ?? null;
}
function getUserId(payload) {
    const candidate = payload.userId ?? payload.user_id ?? payload.sub;
    if (typeof candidate === 'string' && candidate.length > 0) {
        return candidate;
    }
    return null;
}
function normalizeRole(payload) {
    const roleCandidate = payload.role;
    if (typeof roleCandidate === 'string' && roleCandidate.length > 0) {
        return roleCandidate;
    }
    return undefined;
}
function buildUnauthorizedResponse(message = 'Unauthorized') {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message
    }, {
        status: 401
    });
}
function buildServerErrorResponse(message) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message
    }, {
        status: 500
    });
}
function extractAuthToken(request, tokenCookieName = DEFAULT_AUTH_COOKIE_NAME) {
    const headerValue = request.headers.get('authorization');
    if (headerValue?.startsWith(BEARER_PREFIX)) {
        const token = headerValue.slice(BEARER_PREFIX.length).trim();
        return token.length > 0 ? token : null;
    }
    const cookieToken = request.cookies.get(tokenCookieName)?.value?.trim();
    return cookieToken && cookieToken.length > 0 ? cookieToken : null;
}
function verifyAuthToken(token, secret) {
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, secret);
        if (typeof decoded !== 'object' || !decoded) {
            return null;
        }
        return decoded;
    } catch  {
        return null;
    }
}
function requireAuth(handler, options) {
    return async (request, context)=>{
        const secret = resolveJwtSecret(options);
        if (!secret) {
            return buildServerErrorResponse('JWT secret is not configured');
        }
        const token = extractAuthToken(request, options?.tokenCookieName ?? DEFAULT_AUTH_COOKIE_NAME);
        if (!token) {
            return buildUnauthorizedResponse('Missing or invalid authorization token');
        }
        const payload = verifyAuthToken(token, secret);
        if (!payload) {
            return buildUnauthorizedResponse('Invalid or expired token');
        }
        const userId = getUserId(payload);
        if (!userId) {
            return buildUnauthorizedResponse('Token payload is missing user identifier');
        }
        const authenticatedRequest = request;
        authenticatedRequest.auth = {
            ...payload,
            userId,
            role: normalizeRole(payload)
        };
        return handler(authenticatedRequest, context);
    };
}
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
"[project]/src/server/utils/scope-resolver.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Scope Resolver
 * 
 * Determines which user accounts/plants the authenticated user can access.
 * This is critical for security - JWT validates true identity, scope determines data visibility.
 * 
 * Architecture:
 * - JWT determines WHO you are (userId, role)
 * - Scope determines WHAT DATA you can see
 * - Request role is only a DATA FILTER, not for access control
 */ __turbopack_context__.s([
    "resolveUserScope",
    ()=>resolveUserScope
]);
async function resolveUserScope(user) {
    // For now, each user can only access their own account
    // This can be extended to support:
    // - Service users managing multiple end-user accounts
    // - Hierarchical scope resolution
    // - Dynamic scope from database lookups
    if (!user || !user.account) {
        return [];
    }
    return [
        user.account
    ];
} /**
 * Future enhancement: Database-backed scope resolution
 * 
 * export async function resolveUserScope(user: User): Promise<string[]> {
 *   const prisma = new PrismaClient();
 *   
 *   // If user is admin, return all accounts they manage
 *   if (user.role === 'admin' || user.role === 'super_admin') {
 *     const accounts = await prisma.userAccount.findMany({
 *       where: { managedBy: user.userId },
 *       select: { accountId: true }
 *     });
 *     return accounts.map(a => a.accountId);
 *   }
 *   
 *   // Otherwise return user's own account
 *   return [user.account];
 * }
 */ 
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[project]/src/server/db/generated/prisma/internal/class.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPrismaClientClass",
    ()=>getPrismaClientClass
]);
/* !!! This is code generated by Prisma. Do not edit directly. !!! */ /* eslint-disable */ // biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * WARNING: This is an internal file that is subject to change!
 *
 * 🛑 Under no circumstances should you import this file directly! 🛑
 *
 * Please import the `PrismaClient` class from the `client.ts` file instead.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client/runtime/client [external] (@prisma/client/runtime/client, cjs, [project]/node_modules/@prisma/client)");
;
const config = {
    "previewFeatures": [],
    "clientVersion": "7.8.0",
    "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../src/server/db/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel User {\n  id                BigInt                 @id @default(autoincrement())\n  account           String                 @unique\n  email             String?\n  passwordHash      String                 @map(\"password_hash\")\n  portal            UserPortal\n  role              UserRole\n  status            UserStatus             @default(active)\n  assignedById      BigInt?\n  timezone          String?\n  phone             String?\n  address           String?\n  emailVerifiedAt   DateTime?              @map(\"email_verified_at\")\n  lastLoginAt       DateTime?              @map(\"last_login_at\")\n  createdAt         DateTime               @default(now()) @map(\"created_at\")\n  updatedAt         DateTime               @updatedAt @map(\"updated_at\")\n  isDeleted         Boolean                @default(false)\n  deletedAt         DateTime?\n  plants            Plant[]\n  plantInverterMaps UserPlantInverterMap[]\n  assignedBy        User?                  @relation(\"UserAssignment\", fields: [assignedById], references: [id])\n  assignedUsers     User[]                 @relation(\"UserAssignment\")\n\n  @@unique([portal, email])\n  @@index([portal, role])\n  @@index([status])\n  @@index([assignedById])\n  @@map(\"users\")\n}\n\nmodel Plant {\n  id               BigInt              @id @default(autoincrement())\n  name             String\n  type             String\n  installed        DateTime?\n  lastUpdatedAt    DateTime?           @map(\"last_updated_at\")\n  kwp              Float?\n  price            Float?\n  priceUnit        String?             @map(\"price_unit\")\n  longitude        String?\n  latitude         String?\n  address          String?\n  pictureFileId    String?             @map(\"picture_file_id\")\n  userAccount      String              @map(\"user_account\")\n  createdAt        DateTime            @default(now()) @map(\"created_at\")\n  updatedAt        DateTime            @updatedAt @map(\"updated_at\")\n  deletedAt        DateTime?           @map(\"deleted_at\")\n  dataloggers      DeviceDatalogger[]\n  inverters        DeviceInverter[]\n  information_data information_data[]\n  user             User                @relation(fields: [userAccount], references: [account])\n  currentStatus    PlantCurrentStatus?\n  alertStates      DeviceAlertState[]\n  alertEvents      AlertEvent[]\n\n  @@index([type])\n  @@index([name])\n  @@index([userAccount])\n  @@index([deletedAt])\n  @@map(\"plants\")\n}\n\nmodel DeviceInverter {\n  id                 BigInt                    @id @default(autoincrement())\n  name               String?\n  type               String                    @default(\"inverter\")\n  serialNumber       String                    @unique @map(\"serial_number\")\n  updateTime         DateTime?                 @map(\"update_time\")\n  plantId            BigInt                    @map(\"plant_id\")\n  createdAt          DateTime                  @default(now()) @map(\"created_at\")\n  updatedAt          DateTime                  @updatedAt @map(\"updated_at\")\n  deletedAt          DateTime?                 @map(\"deleted_at\")\n  dataloggers        DeviceDatalogger[]\n  plant              Plant                     @relation(fields: [plantId], references: [id])\n  remoteSettings     DeviceRemoteSetting[]\n  remoteSettingTasks DeviceRemoteSettingTask[]\n\n  @@index([plantId])\n  @@index([serialNumber])\n  @@index([type])\n  @@index([deletedAt])\n  @@map(\"device_inverters\")\n}\n\nmodel DeviceRemoteSetting {\n  id               BigInt            @id @default(autoincrement())\n  deviceInverterId BigInt            @map(\"device_inverter_id\")\n  tab              RemoteSettingsTab\n  settings         Json\n  updatedById      BigInt?           @map(\"updated_by_id\")\n  createdAt        DateTime          @default(now()) @map(\"created_at\")\n  updatedAt        DateTime          @updatedAt @map(\"updated_at\")\n  deviceInverter   DeviceInverter    @relation(fields: [deviceInverterId], references: [id])\n\n  @@unique([deviceInverterId, tab])\n  @@index([deviceInverterId])\n  @@map(\"device_remote_settings\")\n}\n\nmodel DeviceRemoteSettingTask {\n  id               BigInt                   @id @default(autoincrement())\n  deviceInverterId BigInt                   @map(\"device_inverter_id\")\n  kind             RemoteSettingsTaskKind\n  tab              RemoteSettingsTab?\n  payload          Json\n  status           RemoteSettingsTaskStatus @default(pending)\n  createdById      BigInt?                  @map(\"created_by_id\")\n  createdAt        DateTime                 @default(now()) @map(\"created_at\")\n  updatedAt        DateTime                 @updatedAt @map(\"updated_at\")\n  deviceInverter   DeviceInverter           @relation(fields: [deviceInverterId], references: [id])\n\n  @@index([deviceInverterId])\n  @@index([status])\n  @@map(\"device_remote_setting_tasks\")\n}\n\n// Reference/catalog table — which register on the physical inverter each\n// remote-setting field maps to. Populated externally (register-mapping\n// exercise), read-only from the application's perspective.\nmodel RemoteSettingParameterMaster {\n  id              BigInt   @id @default(autoincrement())\n  tab             String   @db.VarChar(40)\n  tabLabel        String   @map(\"tab_label\") @db.VarChar(60)\n  fieldKey        String   @map(\"field_key\") @db.VarChar(60)\n  label           String   @db.VarChar(150)\n  dataType        String   @map(\"data_type\") @db.VarChar(20)\n  unitOrOptions   String?  @map(\"unit_or_options\") @db.VarChar(200)\n  endpointPath    String   @map(\"endpoint_path\") @db.VarChar(120)\n  displayOrder    Int      @map(\"display_order\")\n  count           Int      @default(1)\n  registerAddress String?  @map(\"register_address\") @db.VarChar(20)\n  registerType    String?  @map(\"register_type\") @db.VarChar(20)\n  createdAt       DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt       DateTime @map(\"updated_at\") @db.Timestamptz(6)\n\n  @@unique([tab, fieldKey])\n  @@index([tab])\n  @@map(\"remote_setting_parameter_master\")\n}\n\n// Register-mapping catalog for the /remote-settings/command endpoint's four\n// actions (afdReset, syncDateTime, reset, clearAllData). Kept separate from\n// RemoteSettingParameterMaster because commands aren't tab-scoped settings —\n// no `tab` column here, just one row per command key. Populated externally,\n// read-only from the application's perspective.\nmodel RemoteSettingCommandMaster {\n  id              BigInt   @id @default(autoincrement())\n  commandKey      String   @unique @map(\"command_key\") @db.VarChar(60)\n  label           String   @db.VarChar(150)\n  endpointPath    String   @default(\"/remote-settings/command\") @map(\"endpoint_path\") @db.VarChar(120)\n  displayOrder    Int      @map(\"display_order\")\n  count           Int      @default(1)\n  registerAddress String?  @map(\"register_address\") @db.VarChar(20)\n  registerType    String?  @default(\"coil\") @map(\"register_type\") @db.VarChar(20)\n  createdAt       DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n\n  @@map(\"remote_setting_command_master\")\n}\n\nenum RemoteSettingsTab {\n  gridParameters\n  featureParameters\n  reactivePowerControl\n  powerLimit\n  otherSetting\n  maskingFaultDetection\n}\n\nenum RemoteSettingsTaskKind {\n  settings\n  command\n}\n\nenum RemoteSettingsTaskStatus {\n  pending\n  completed\n  failed\n}\n\nmodel UserPlantInverterMap {\n  id                 BigInt                           @id @default(autoincrement())\n  userId             BigInt                           @map(\"user_id\")\n  plantId            BigInt?                          @map(\"plant_id\")\n  serialNumber       String                           @unique @map(\"inverter_no\")\n  isDeleted          Boolean                          @default(false) @map(\"is_deleted\")\n  deletedAt          DateTime?                        @map(\"deleted_at\")\n  createdAt          DateTime                         @default(now()) @map(\"created_at\")\n  updatedAt          DateTime                         @updatedAt @map(\"updated_at\")\n  dailySummaries     DeviceDailySummary[]\n  lineChartSummaries DeviceDailySummaryPerLineChart[]\n  invertorStatus     DeviceInvertorStatus?            @relation(\"MapToInvertorStatus\")\n  user               User                             @relation(fields: [userId], references: [id])\n\n  @@index([userId, isDeleted])\n  @@index([plantId, isDeleted])\n  @@index([serialNumber])\n  @@index([serialNumber, isDeleted])\n  @@index([deletedAt])\n  @@map(\"user_plant_inverter_map\")\n}\n\nmodel DeviceInvertorStatus {\n  id                   BigInt               @id @default(autoincrement())\n  deviceSno            String               @unique @map(\"device_sno\")\n  latestTimeState      DateTime             @map(\"latest_time_state\")\n  status               Boolean              @default(false)\n  createdAt            DateTime             @default(now()) @map(\"created_at\")\n  updatedAt            DateTime             @updatedAt @map(\"updated_at\")\n  userPlantInverterMap UserPlantInverterMap @relation(\"MapToInvertorStatus\", fields: [deviceSno], references: [serialNumber], map: \"device_invertor_status_device_sno_user_plant_inverter_map_fkey\")\n\n  @@index([status])\n  @@index([latestTimeState])\n  @@index([deviceSno, status])\n  @@map(\"device_invertor_status\")\n}\n\nmodel DeviceDatalogger {\n  id           BigInt          @id @default(autoincrement())\n  name         String?\n  type         String          @default(\"datalogger\")\n  serialNumber String          @unique @map(\"serial_number\")\n  online       Boolean         @default(false)\n  status       String?\n  updateTime   DateTime?       @map(\"update_time\")\n  plantId      BigInt          @map(\"plant_id\")\n  inverterId   BigInt?         @map(\"inverter_id\")\n  createdAt    DateTime        @default(now()) @map(\"created_at\")\n  updatedAt    DateTime        @updatedAt @map(\"updated_at\")\n  deletedAt    DateTime?       @map(\"deleted_at\")\n  inverter     DeviceInverter? @relation(fields: [inverterId], references: [id])\n  plant        Plant           @relation(fields: [plantId], references: [id])\n\n  @@index([plantId])\n  @@index([inverterId])\n  @@index([serialNumber])\n  @@index([online])\n  @@index([deletedAt])\n  @@map(\"device_dataloggers\")\n}\n\nmodel DeviceLogs {\n  id                            BigInt    @id @default(autoincrement())\n  sno                           String?   @db.VarChar(255)\n  logger_status                 String?   @db.VarChar(255)\n  connected_plant               String?   @db.VarChar(255)\n  module_version_no             String?   @db.VarChar(255)\n  extended_system_version       String?   @db.VarChar(255)\n  data_acquisition_period       DateTime?\n  max_connected_devices         Int?\n  signal_strength               BigInt?\n  module_mac_address            String?   @db.VarChar(255)\n  router_ssid                   String?   @db.VarChar(255)\n  inverter_type                 Int?\n  production_compliance_country Int?\n  device_model                  String?\n  firmware_version              String?\n  production_type               Int?\n  rated_power                   Int?\n  phases                        Int?\n  mppt_no                       Int?\n  inverter_parameter_count      Int?\n  logger_parameter_count        Int?\n  protocol_version              Int?\n  comm_software_version_1       Int?\n  comm_software_version_2       Int?\n  control_software_version      Int?\n  dc_voltage_1                  Decimal?  @db.Decimal(12, 3)\n  dc_voltage_2                  Decimal?  @db.Decimal(12, 3)\n  dc_voltage_3                  Decimal?  @db.Decimal(12, 3)\n  dc_voltage_4                  Decimal?  @db.Decimal(12, 3)\n  dc_voltage_5                  Decimal?  @db.Decimal(12, 3)\n  dc_voltage_6                  Decimal?  @db.Decimal(12, 3)\n  dc_voltage_7                  Decimal?  @db.Decimal(12, 3)\n  dc_voltage_8                  Decimal?  @db.Decimal(12, 3)\n  dc_voltage_9                  Decimal?  @db.Decimal(12, 3)\n\n  dc_current_1 Decimal? @db.Decimal(12, 3)\n  dc_current_2 Decimal? @db.Decimal(12, 3)\n  dc_current_3 Decimal? @db.Decimal(12, 3)\n  dc_current_4 Decimal? @db.Decimal(12, 3)\n  dc_current_5 Decimal? @db.Decimal(12, 3)\n  dc_current_6 Decimal? @db.Decimal(12, 3)\n  dc_current_7 Decimal? @db.Decimal(12, 3)\n  dc_current_8 Decimal? @db.Decimal(12, 3)\n  dc_current_9 Decimal? @db.Decimal(12, 3)\n\n  dc_power_1 Decimal? @db.Decimal(12, 3)\n  dc_power_2 Decimal? @db.Decimal(12, 3)\n  dc_power_3 Decimal? @db.Decimal(12, 3)\n  dc_power_4 Decimal? @db.Decimal(12, 3)\n  dc_power_5 Decimal? @db.Decimal(12, 3)\n  dc_power_6 Decimal? @db.Decimal(12, 3)\n  dc_power_7 Decimal? @db.Decimal(12, 3)\n  dc_power_8 Decimal? @db.Decimal(12, 3)\n  dc_power_9 Decimal? @db.Decimal(12, 3)\n\n  total_input_power         Decimal? @db.Decimal(14, 3)\n  grid_total_active_power   Decimal? @db.Decimal(14, 3)\n  grid_total_reactive_power Decimal? @db.Decimal(14, 3)\n\n  ac_voltage_a Decimal? @db.Decimal(12, 3)\n  ac_voltage_b Decimal? @db.Decimal(12, 3)\n  ac_voltage_c Decimal? @db.Decimal(12, 3)\n\n  ac_current_a Decimal? @db.Decimal(12, 3)\n  ac_current_b Decimal? @db.Decimal(12, 3)\n  ac_current_c Decimal? @db.Decimal(12, 3)\n\n  ac_power_a Decimal? @db.Decimal(12, 3)\n  ac_power_b Decimal? @db.Decimal(12, 3)\n  ac_power_c Decimal? @db.Decimal(12, 3)\n\n  daily_production Decimal? @db.Decimal(14, 3)\n\n  ac_output_frequency Decimal? @db.Decimal(8, 2)\n\n  temperature_1 Decimal? @db.Decimal(8, 2)\n  temperature_2 Decimal? @db.Decimal(8, 2)\n  temperature_3 Decimal? @db.Decimal(8, 2)\n\n  total_production Decimal? @db.Decimal(14, 3)\n  fault_registers  Int?\n  fault_1          Int?\n  fault_2          Int?\n  fault_3          Int?\n  fault_4          Int?\n  fault_5          Int?\n\n  grid_status       Int?\n  inverter_status   Int?\n  temperature_count Int?\n\n  total_generation_time Int?\n  timestamp             DateTime\n  mac_address           String?                         @db.VarChar(255)\n  message_type          Int?\n  hybrid_json           Json?\n  lineChartSnapshots    DeviceDailySummaryPerLineChart?\n  latestSnapshots       DeviceLogsLatest?\n\n  @@index([timestamp])\n  @@index([sno])\n  @@index([sno, timestamp])\n  @@map(\"device_logs\")\n}\n\nmodel DeviceLogsLatest {\n  id              BigInt   @id @default(autoincrement())\n  sno             String   @db.VarChar(255)\n  inverterName    String?  @map(\"inverter_name\")\n  dayDate         DateTime @map(\"day_date\") @db.Date\n  latestTimestamp DateTime @map(\"latest_timestamp\")\n  sourceLogId     BigInt   @unique @map(\"source_log_id\")\n  batchKey        String   @unique @map(\"batch_key\")\n\n  dailyProduction Decimal? @map(\"daily_production\") @db.Decimal(14, 3)\n  totalEnergy     Decimal? @map(\"total_energy\") @db.Decimal(14, 3)\n  totalHours      Int?     @map(\"total_hours\")\n  currentPower    Decimal? @map(\"current_power\") @db.Decimal(14, 3)\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  sourceLog DeviceLogs @relation(fields: [sourceLogId], references: [id], onDelete: Cascade)\n\n  @@unique([sno, dayDate])\n  @@index([dayDate])\n  @@index([sno, dayDate])\n  @@index([batchKey])\n  @@map(\"device_logs_latest\")\n}\n\nmodel DeviceDailySummary {\n  id      BigInt   @id @default(autoincrement())\n  sno     String   @db.VarChar(255)\n  dayDate DateTime @map(\"day_date\") @db.Date\n\n  currentPower Decimal? @map(\"current_power\") @db.Decimal(14, 3)\n  eToday       Decimal? @map(\"e_today\") @db.Decimal(14, 3)\n  eTotal       Decimal? @map(\"e_total\") @db.Decimal(14, 3)\n  hTotal       Int?     @map(\"h_total\")\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  userPlantInverterMap UserPlantInverterMap @relation(fields: [sno], references: [serialNumber])\n\n  @@unique([sno, dayDate])\n  @@index([dayDate])\n  @@index([sno, dayDate])\n  @@map(\"device_daily_summary\")\n}\n\nmodel DeviceDailySummaryPerLineChart {\n  id                          BigInt               @id @default(autoincrement())\n  sno                         String               @db.VarChar(255)\n  dayDate                     DateTime             @map(\"day_date\") @db.Date\n  timestamp                   DateTime\n  sourceLogId                 BigInt               @unique @map(\"source_log_id\")\n  lineWindowMinutes           Int                  @default(5) @map(\"line_window_minutes\")\n  maxPoints                   Int                  @default(20) @map(\"max_points\")\n  loggerStatus                String?              @map(\"logger_status\") @db.VarChar(255)\n  connectedPlant              String?              @map(\"connected_plant\") @db.VarChar(255)\n  moduleVersionNo             String?              @map(\"module_version_no\") @db.VarChar(255)\n  extendedSystemVersion       String?              @map(\"extended_system_version\") @db.VarChar(255)\n  dataAcquisitionPeriod       DateTime?            @map(\"data_acquisition_period\")\n  maxConnectedDevices         Int?                 @map(\"max_connected_devices\")\n  signalStrength              Int?                 @map(\"signal_strength\")\n  moduleMacAddress            String?              @map(\"module_mac_address\") @db.VarChar(255)\n  routerSsid                  String?              @map(\"router_ssid\") @db.VarChar(255)\n  inverterType                Int?                 @map(\"inverter_type\")\n  productionComplianceCountry Int?                 @map(\"production_compliance_country\")\n  ratedPower                  Int?                 @map(\"rated_power\")\n  mpptNo                      Int?                 @map(\"mppt_no\")\n  protocolVersion             Int?                 @map(\"protocol_version\")\n  commSoftwareVersion1        Int?                 @map(\"comm_software_version_1\")\n  commSoftwareVersion2        Int?                 @map(\"comm_software_version_2\")\n  controlSoftwareVersion      Int?                 @map(\"control_software_version\")\n  deviceModel                 String?              @map(\"device_model\")\n  firmwareVersion             String?              @map(\"firmware_version\")\n  productionType              Int?                 @map(\"production_type\")\n  dcVoltage1                  Int?                 @map(\"dc_voltage_1\")\n  dcVoltage2                  Int?                 @map(\"dc_voltage_2\")\n  dcVoltage3                  Int?                 @map(\"dc_voltage_3\")\n  dcVoltage4                  Int?                 @map(\"dc_voltage_4\")\n  dcVoltage5                  Int?                 @map(\"dc_voltage_5\")\n  dcVoltage6                  Int?                 @map(\"dc_voltage_6\")\n  dcVoltage7                  Int?                 @map(\"dc_voltage_7\")\n  dcVoltage8                  Int?                 @map(\"dc_voltage_8\")\n  dcCurrent1                  Int?                 @map(\"dc_current_1\")\n  dcCurrent2                  Int?                 @map(\"dc_current_2\")\n  dcCurrent3                  Int?                 @map(\"dc_current_3\")\n  dcCurrent4                  Int?                 @map(\"dc_current_4\")\n  dcCurrent5                  Int?                 @map(\"dc_current_5\")\n  dcCurrent6                  Int?                 @map(\"dc_current_6\")\n  dcCurrent7                  Int?                 @map(\"dc_current_7\")\n  dcCurrent8                  Int?                 @map(\"dc_current_8\")\n  dcPower1                    Int?                 @map(\"dc_power_1\")\n  dcPower2                    Int?                 @map(\"dc_power_2\")\n  dcPower3                    Int?                 @map(\"dc_power_3\")\n  dcPower4                    Int?                 @map(\"dc_power_4\")\n  dcPower5                    Int?                 @map(\"dc_power_5\")\n  dcPower6                    Int?                 @map(\"dc_power_6\")\n  dcPower7                    Int?                 @map(\"dc_power_7\")\n  dcPower8                    Int?                 @map(\"dc_power_8\")\n  acVoltageA                  Int?                 @map(\"ac_voltage_a\")\n  acVoltageB                  Int?                 @map(\"ac_voltage_b\")\n  acVoltageC                  Int?                 @map(\"ac_voltage_c\")\n  acCurrentA                  Int?                 @map(\"ac_current_a\")\n  acCurrentB                  Int?                 @map(\"ac_current_b\")\n  acCurrentC                  Int?                 @map(\"ac_current_c\")\n  acPowerA                    Int?                 @map(\"ac_power_a\")\n  acPowerB                    Int?                 @map(\"ac_power_b\")\n  acPowerC                    Int?                 @map(\"ac_power_c\")\n  fault1                      Int?                 @map(\"fault_1\")\n  fault2                      Int?                 @map(\"fault_2\")\n  fault3                      Int?                 @map(\"fault_3\")\n  fault4                      Int?                 @map(\"fault_4\")\n  fault5                      Int?                 @map(\"fault_5\")\n  totalInputPower             Int?                 @map(\"total_input_power\")\n  gridTotalActivePower        Int?                 @map(\"grid_total_active_power\")\n  gridTotalReactivePower      Int?                 @map(\"grid_total_reactive_power\")\n  dailyProduction             Int?                 @map(\"daily_production\")\n  gridStatus                  Int?                 @map(\"grid_status\")\n  inverterStatus              Int?                 @map(\"inverter_status\")\n  acOutputFrequency           Int?                 @map(\"ac_output_frequency\")\n  temperature1                Int?                 @map(\"temperature_1\")\n  temperature2                Int?                 @map(\"temperature_2\")\n  temperature3                Int?                 @map(\"temperature_3\")\n  totalProduction             Int?                 @map(\"total_production\")\n  totalGenerationTime         Int?                 @map(\"total_generation_time\")\n  macAddress                  String?              @map(\"mac_address\") @db.VarChar(255)\n  messageType                 Int?                 @map(\"message_type\")\n  hybridJson                  Json?                @map(\"hybrid_json\")\n  createdAt                   DateTime             @default(now()) @map(\"created_at\")\n  updatedAt                   DateTime             @updatedAt @map(\"updated_at\")\n  dcVoltage9                  Int?                 @map(\"dc_voltage_9\")\n  userPlantInverterMap        UserPlantInverterMap @relation(fields: [sno], references: [serialNumber])\n  sourceLog                   DeviceLogs           @relation(fields: [sourceLogId], references: [id], onDelete: Cascade)\n\n  @@unique([sno, dayDate, timestamp])\n  @@index([dayDate])\n  @@index([sno, timestamp])\n  @@index([sno, dayDate])\n  @@map(\"device_daily_summary_per_line_chart\")\n}\n\nmodel information_data {\n  id               BigInt   @id @default(autoincrement())\n  input_power      Float?   @map(\"Input Power\")\n  co2              Float?\n  tree_planting    Float?   @map(\"Tree Planting\")\n  efficiency       Float?\n  weather          String?\n  irradiance       Float?\n  cell_temperature Float?\n  plantid          BigInt\n  created_at       DateTime @default(now())\n  updated_at       DateTime @updatedAt\n  plant            Plant    @relation(fields: [plantid], references: [id])\n\n  @@index([plantid])\n  @@map(\"information_data\")\n}\n\nmodel DeviceConnectionStatus {\n  id           BigInt    @id @default(autoincrement())\n  serialNumber String    @unique @map(\"serial_number\") @db.VarChar(255)\n  macAddress   String?   @map(\"mac_address\") @db.VarChar(255)\n  status       String    @db.VarChar(50)\n  lastSeenTime DateTime? @map(\"lastSeenTime\") @db.Timestamptz(6)\n\n  @@index([status], map: \"idx_device_connection_status_status\")\n  @@map(\"device_connection_status\")\n}\n\nmodel fota {\n  id          Int     @unique @default(autoincrement())\n  mac_address String  @id @db.VarChar(50)\n  firmware    String? @db.VarChar(50)\n  link        String? @db.VarChar(255)\n\n  @@map(\"fota\")\n}\n\nmodel DeviceCurrentStatus {\n  id              BigInt      @id @default(autoincrement())\n  sno             String      @unique\n  status          PlantStatus @default(Offline)\n  lastTelemetryAt DateTime?   @map(\"last_telemetry_at\")\n  updatedAt       DateTime    @updatedAt @map(\"updated_at\")\n\n  @@index([status])\n  @@index([lastTelemetryAt])\n  @@map(\"device_current_status\")\n}\n\nmodel DeviceStatusHistory {\n  id        BigInt      @id @default(autoincrement())\n  sno       String\n  plantId   BigInt?     @map(\"plant_id\")\n  status    PlantStatus\n  createdAt DateTime    @default(now()) @map(\"created_at\")\n\n  @@index([sno])\n  @@index([plantId])\n  @@index([status])\n  @@map(\"device_status_history\")\n}\n\nmodel PlantCurrentStatus {\n  id      BigInt @id @default(autoincrement())\n  plantId BigInt @unique @map(\"plant_id\")\n\n  status PlantStatus @default(Offline)\n\n  totalDevices  Int @default(0) @map(\"total_devices\")\n  normalCount   Int @default(0) @map(\"normal_count\")\n  abnormalCount Int @default(0) @map(\"abnormal_count\")\n  standbyCount  Int @default(0) @map(\"standby_count\")\n  offlineCount  Int @default(0) @map(\"offline_count\")\n\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  plant Plant @relation(fields: [plantId], references: [id])\n\n  @@index([status])\n  @@map(\"plant_current_status\")\n}\n\nmodel DeviceAlertState {\n  id               BigInt   @id @default(autoincrement())\n  serialNumber     String   @unique @map(\"serial_number\")\n  plantId          BigInt?  @map(\"plant_id\")\n  plant            Plant?   @relation(fields: [plantId], references: [id])\n  alertMatrix      Json     @map(\"alert_matrix\")\n  activeAlertCount Int      @default(0) @map(\"active_alert_count\")\n  lastTelemetryAt  DateTime @map(\"last_telemetry_at\")\n  createdAt        DateTime @default(now()) @map(\"created_at\")\n  updatedAt        DateTime @updatedAt @map(\"updated_at\")\n\n  @@index([serialNumber])\n  @@index([plantId])\n  @@map(\"device_alert_state\")\n}\n\nmodel AlertEvent {\n  id           BigInt      @id @default(autoincrement())\n  serialNumber String      @map(\"serial_number\")\n  plantId      BigInt?     @map(\"plant_id\")\n  plant        Plant?      @relation(fields: [plantId], references: [id])\n  registerNo   Int         @map(\"register_no\")\n  bitPosition  Int         @map(\"bit_position\")\n  faultCode    String      @map(\"fault_code\")\n  faultMessage String      @map(\"fault_message\")\n  status       AlertStatus\n  raisedAt     DateTime?   @map(\"raised_at\")\n  clearedAt    DateTime?   @map(\"cleared_at\")\n  createdAt    DateTime    @default(now()) @map(\"created_at\")\n\n  @@index([serialNumber])\n  @@index([plantId])\n  @@index([status])\n  @@map(\"alert_events\")\n}\n\nmodel FaultDictionary {\n  id           BigInt   @id @default(autoincrement())\n  registerName String   @map(\"register_name\") // ErrorCode1\n  registerAddr String   @map(\"register_addr\") // 0x101E\n  registerNo   Int      @map(\"register_no\") // 1..6 (your matrix index)\n  bitPosition  Int      @map(\"bit_position\")\n  faultCode    String   @map(\"fault_code\")\n  faultMessage String   @map(\"fault_message\")\n  createdAt    DateTime @default(now()) @map(\"created_at\")\n\n  @@unique([registerNo, bitPosition])\n  @@map(\"fault_dictionary\")\n}\n\nenum AlertStatus {\n  ACTIVE\n  INACTIVE\n}\n\nenum UserPortal {\n  monitoring\n  service\n}\n\nenum UserRole {\n  monitoring_user\n  service_admin\n  service_super_admin\n}\n\nenum UserStatus {\n  active\n  disabled\n  pending_verification\n}\n\nenum PlantStatus {\n  Offline\n  Online\n  Abnormal\n  Standby\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"account\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"password_hash\"},{\"name\":\"portal\",\"kind\":\"enum\",\"type\":\"UserPortal\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"UserRole\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"UserStatus\"},{\"name\":\"assignedById\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"timezone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"emailVerifiedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"email_verified_at\"},{\"name\":\"lastLoginAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"last_login_at\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"plants\",\"kind\":\"object\",\"type\":\"Plant\",\"relationName\":\"PlantToUser\"},{\"name\":\"plantInverterMaps\",\"kind\":\"object\",\"type\":\"UserPlantInverterMap\",\"relationName\":\"UserToUserPlantInverterMap\"},{\"name\":\"assignedBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserAssignment\"},{\"name\":\"assignedUsers\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserAssignment\"}],\"dbName\":\"users\"},\"Plant\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"installed\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastUpdatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"last_updated_at\"},{\"name\":\"kwp\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"priceUnit\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"price_unit\"},{\"name\":\"longitude\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"latitude\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"pictureFileId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"picture_file_id\"},{\"name\":\"userAccount\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_account\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"deleted_at\"},{\"name\":\"dataloggers\",\"kind\":\"object\",\"type\":\"DeviceDatalogger\",\"relationName\":\"DeviceDataloggerToPlant\"},{\"name\":\"inverters\",\"kind\":\"object\",\"type\":\"DeviceInverter\",\"relationName\":\"DeviceInverterToPlant\"},{\"name\":\"information_data\",\"kind\":\"object\",\"type\":\"information_data\",\"relationName\":\"PlantToinformation_data\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PlantToUser\"},{\"name\":\"currentStatus\",\"kind\":\"object\",\"type\":\"PlantCurrentStatus\",\"relationName\":\"PlantToPlantCurrentStatus\"},{\"name\":\"alertStates\",\"kind\":\"object\",\"type\":\"DeviceAlertState\",\"relationName\":\"DeviceAlertStateToPlant\"},{\"name\":\"alertEvents\",\"kind\":\"object\",\"type\":\"AlertEvent\",\"relationName\":\"AlertEventToPlant\"}],\"dbName\":\"plants\"},\"DeviceInverter\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"serialNumber\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"serial_number\"},{\"name\":\"updateTime\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"update_time\"},{\"name\":\"plantId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"plant_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"deleted_at\"},{\"name\":\"dataloggers\",\"kind\":\"object\",\"type\":\"DeviceDatalogger\",\"relationName\":\"DeviceDataloggerToDeviceInverter\"},{\"name\":\"plant\",\"kind\":\"object\",\"type\":\"Plant\",\"relationName\":\"DeviceInverterToPlant\"},{\"name\":\"remoteSettings\",\"kind\":\"object\",\"type\":\"DeviceRemoteSetting\",\"relationName\":\"DeviceInverterToDeviceRemoteSetting\"},{\"name\":\"remoteSettingTasks\",\"kind\":\"object\",\"type\":\"DeviceRemoteSettingTask\",\"relationName\":\"DeviceInverterToDeviceRemoteSettingTask\"}],\"dbName\":\"device_inverters\"},\"DeviceRemoteSetting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"deviceInverterId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"device_inverter_id\"},{\"name\":\"tab\",\"kind\":\"enum\",\"type\":\"RemoteSettingsTab\"},{\"name\":\"settings\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"updatedById\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"updated_by_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"deviceInverter\",\"kind\":\"object\",\"type\":\"DeviceInverter\",\"relationName\":\"DeviceInverterToDeviceRemoteSetting\"}],\"dbName\":\"device_remote_settings\"},\"DeviceRemoteSettingTask\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"deviceInverterId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"device_inverter_id\"},{\"name\":\"kind\",\"kind\":\"enum\",\"type\":\"RemoteSettingsTaskKind\"},{\"name\":\"tab\",\"kind\":\"enum\",\"type\":\"RemoteSettingsTab\"},{\"name\":\"payload\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"RemoteSettingsTaskStatus\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"created_by_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"deviceInverter\",\"kind\":\"object\",\"type\":\"DeviceInverter\",\"relationName\":\"DeviceInverterToDeviceRemoteSettingTask\"}],\"dbName\":\"device_remote_setting_tasks\"},\"RemoteSettingParameterMaster\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"tab\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tabLabel\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"tab_label\"},{\"name\":\"fieldKey\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"field_key\"},{\"name\":\"label\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dataType\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"data_type\"},{\"name\":\"unitOrOptions\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"unit_or_options\"},{\"name\":\"endpointPath\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"endpoint_path\"},{\"name\":\"displayOrder\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"display_order\"},{\"name\":\"count\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"registerAddress\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"register_address\"},{\"name\":\"registerType\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"register_type\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"}],\"dbName\":\"remote_setting_parameter_master\"},\"RemoteSettingCommandMaster\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"commandKey\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"command_key\"},{\"name\":\"label\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"endpointPath\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"endpoint_path\"},{\"name\":\"displayOrder\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"display_order\"},{\"name\":\"count\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"registerAddress\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"register_address\"},{\"name\":\"registerType\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"register_type\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"}],\"dbName\":\"remote_setting_command_master\"},\"UserPlantInverterMap\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"plantId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"plant_id\"},{\"name\":\"serialNumber\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"inverter_no\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"is_deleted\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"deleted_at\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"dailySummaries\",\"kind\":\"object\",\"type\":\"DeviceDailySummary\",\"relationName\":\"DeviceDailySummaryToUserPlantInverterMap\"},{\"name\":\"lineChartSummaries\",\"kind\":\"object\",\"type\":\"DeviceDailySummaryPerLineChart\",\"relationName\":\"DeviceDailySummaryPerLineChartToUserPlantInverterMap\"},{\"name\":\"invertorStatus\",\"kind\":\"object\",\"type\":\"DeviceInvertorStatus\",\"relationName\":\"MapToInvertorStatus\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserPlantInverterMap\"}],\"dbName\":\"user_plant_inverter_map\"},\"DeviceInvertorStatus\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"deviceSno\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"device_sno\"},{\"name\":\"latestTimeState\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"latest_time_state\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"userPlantInverterMap\",\"kind\":\"object\",\"type\":\"UserPlantInverterMap\",\"relationName\":\"MapToInvertorStatus\"}],\"dbName\":\"device_invertor_status\"},\"DeviceDatalogger\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"serialNumber\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"serial_number\"},{\"name\":\"online\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"updateTime\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"update_time\"},{\"name\":\"plantId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"plant_id\"},{\"name\":\"inverterId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"inverter_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"deleted_at\"},{\"name\":\"inverter\",\"kind\":\"object\",\"type\":\"DeviceInverter\",\"relationName\":\"DeviceDataloggerToDeviceInverter\"},{\"name\":\"plant\",\"kind\":\"object\",\"type\":\"Plant\",\"relationName\":\"DeviceDataloggerToPlant\"}],\"dbName\":\"device_dataloggers\"},\"DeviceLogs\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"sno\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logger_status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connected_plant\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"module_version_no\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"extended_system_version\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"data_acquisition_period\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"max_connected_devices\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"signal_strength\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"module_mac_address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"router_ssid\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"inverter_type\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"production_compliance_country\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"device_model\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"firmware_version\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"production_type\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"rated_power\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"phases\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mppt_no\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"inverter_parameter_count\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"logger_parameter_count\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"protocol_version\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"comm_software_version_1\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"comm_software_version_2\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"control_software_version\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"dc_voltage_1\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_voltage_2\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_voltage_3\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_voltage_4\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_voltage_5\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_voltage_6\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_voltage_7\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_voltage_8\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_voltage_9\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_current_1\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_current_2\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_current_3\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_current_4\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_current_5\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_current_6\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_current_7\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_current_8\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_current_9\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_power_1\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_power_2\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_power_3\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_power_4\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_power_5\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_power_6\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_power_7\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_power_8\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"dc_power_9\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"total_input_power\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"grid_total_active_power\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"grid_total_reactive_power\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_voltage_a\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_voltage_b\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_voltage_c\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_current_a\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_current_b\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_current_c\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_power_a\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_power_b\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_power_c\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"daily_production\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ac_output_frequency\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"temperature_1\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"temperature_2\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"temperature_3\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"total_production\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"fault_registers\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fault_1\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fault_2\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fault_3\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fault_4\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fault_5\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"grid_status\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"inverter_status\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"temperature_count\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"total_generation_time\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"mac_address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"message_type\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"hybrid_json\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"lineChartSnapshots\",\"kind\":\"object\",\"type\":\"DeviceDailySummaryPerLineChart\",\"relationName\":\"DeviceDailySummaryPerLineChartToDeviceLogs\"},{\"name\":\"latestSnapshots\",\"kind\":\"object\",\"type\":\"DeviceLogsLatest\",\"relationName\":\"DeviceLogsToDeviceLogsLatest\"}],\"dbName\":\"device_logs\"},\"DeviceLogsLatest\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"sno\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"inverterName\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"inverter_name\"},{\"name\":\"dayDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"day_date\"},{\"name\":\"latestTimestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"latest_timestamp\"},{\"name\":\"sourceLogId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"source_log_id\"},{\"name\":\"batchKey\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"batch_key\"},{\"name\":\"dailyProduction\",\"kind\":\"scalar\",\"type\":\"Decimal\",\"dbName\":\"daily_production\"},{\"name\":\"totalEnergy\",\"kind\":\"scalar\",\"type\":\"Decimal\",\"dbName\":\"total_energy\"},{\"name\":\"totalHours\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"total_hours\"},{\"name\":\"currentPower\",\"kind\":\"scalar\",\"type\":\"Decimal\",\"dbName\":\"current_power\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"sourceLog\",\"kind\":\"object\",\"type\":\"DeviceLogs\",\"relationName\":\"DeviceLogsToDeviceLogsLatest\"}],\"dbName\":\"device_logs_latest\"},\"DeviceDailySummary\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"sno\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dayDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"day_date\"},{\"name\":\"currentPower\",\"kind\":\"scalar\",\"type\":\"Decimal\",\"dbName\":\"current_power\"},{\"name\":\"eToday\",\"kind\":\"scalar\",\"type\":\"Decimal\",\"dbName\":\"e_today\"},{\"name\":\"eTotal\",\"kind\":\"scalar\",\"type\":\"Decimal\",\"dbName\":\"e_total\"},{\"name\":\"hTotal\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"h_total\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"userPlantInverterMap\",\"kind\":\"object\",\"type\":\"UserPlantInverterMap\",\"relationName\":\"DeviceDailySummaryToUserPlantInverterMap\"}],\"dbName\":\"device_daily_summary\"},\"DeviceDailySummaryPerLineChart\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"sno\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dayDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"day_date\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sourceLogId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"source_log_id\"},{\"name\":\"lineWindowMinutes\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"line_window_minutes\"},{\"name\":\"maxPoints\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"max_points\"},{\"name\":\"loggerStatus\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"logger_status\"},{\"name\":\"connectedPlant\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"connected_plant\"},{\"name\":\"moduleVersionNo\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"module_version_no\"},{\"name\":\"extendedSystemVersion\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"extended_system_version\"},{\"name\":\"dataAcquisitionPeriod\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"data_acquisition_period\"},{\"name\":\"maxConnectedDevices\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"max_connected_devices\"},{\"name\":\"signalStrength\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"signal_strength\"},{\"name\":\"moduleMacAddress\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"module_mac_address\"},{\"name\":\"routerSsid\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"router_ssid\"},{\"name\":\"inverterType\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"inverter_type\"},{\"name\":\"productionComplianceCountry\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"production_compliance_country\"},{\"name\":\"ratedPower\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"rated_power\"},{\"name\":\"mpptNo\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"mppt_no\"},{\"name\":\"protocolVersion\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"protocol_version\"},{\"name\":\"commSoftwareVersion1\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"comm_software_version_1\"},{\"name\":\"commSoftwareVersion2\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"comm_software_version_2\"},{\"name\":\"controlSoftwareVersion\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"control_software_version\"},{\"name\":\"deviceModel\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"device_model\"},{\"name\":\"firmwareVersion\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"firmware_version\"},{\"name\":\"productionType\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"production_type\"},{\"name\":\"dcVoltage1\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_voltage_1\"},{\"name\":\"dcVoltage2\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_voltage_2\"},{\"name\":\"dcVoltage3\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_voltage_3\"},{\"name\":\"dcVoltage4\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_voltage_4\"},{\"name\":\"dcVoltage5\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_voltage_5\"},{\"name\":\"dcVoltage6\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_voltage_6\"},{\"name\":\"dcVoltage7\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_voltage_7\"},{\"name\":\"dcVoltage8\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_voltage_8\"},{\"name\":\"dcCurrent1\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_current_1\"},{\"name\":\"dcCurrent2\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_current_2\"},{\"name\":\"dcCurrent3\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_current_3\"},{\"name\":\"dcCurrent4\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_current_4\"},{\"name\":\"dcCurrent5\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_current_5\"},{\"name\":\"dcCurrent6\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_current_6\"},{\"name\":\"dcCurrent7\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_current_7\"},{\"name\":\"dcCurrent8\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_current_8\"},{\"name\":\"dcPower1\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_power_1\"},{\"name\":\"dcPower2\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_power_2\"},{\"name\":\"dcPower3\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_power_3\"},{\"name\":\"dcPower4\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_power_4\"},{\"name\":\"dcPower5\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_power_5\"},{\"name\":\"dcPower6\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_power_6\"},{\"name\":\"dcPower7\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_power_7\"},{\"name\":\"dcPower8\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_power_8\"},{\"name\":\"acVoltageA\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_voltage_a\"},{\"name\":\"acVoltageB\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_voltage_b\"},{\"name\":\"acVoltageC\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_voltage_c\"},{\"name\":\"acCurrentA\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_current_a\"},{\"name\":\"acCurrentB\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_current_b\"},{\"name\":\"acCurrentC\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_current_c\"},{\"name\":\"acPowerA\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_power_a\"},{\"name\":\"acPowerB\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_power_b\"},{\"name\":\"acPowerC\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_power_c\"},{\"name\":\"fault1\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"fault_1\"},{\"name\":\"fault2\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"fault_2\"},{\"name\":\"fault3\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"fault_3\"},{\"name\":\"fault4\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"fault_4\"},{\"name\":\"fault5\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"fault_5\"},{\"name\":\"totalInputPower\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"total_input_power\"},{\"name\":\"gridTotalActivePower\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"grid_total_active_power\"},{\"name\":\"gridTotalReactivePower\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"grid_total_reactive_power\"},{\"name\":\"dailyProduction\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"daily_production\"},{\"name\":\"gridStatus\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"grid_status\"},{\"name\":\"inverterStatus\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"inverter_status\"},{\"name\":\"acOutputFrequency\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"ac_output_frequency\"},{\"name\":\"temperature1\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"temperature_1\"},{\"name\":\"temperature2\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"temperature_2\"},{\"name\":\"temperature3\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"temperature_3\"},{\"name\":\"totalProduction\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"total_production\"},{\"name\":\"totalGenerationTime\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"total_generation_time\"},{\"name\":\"macAddress\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"mac_address\"},{\"name\":\"messageType\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"message_type\"},{\"name\":\"hybridJson\",\"kind\":\"scalar\",\"type\":\"Json\",\"dbName\":\"hybrid_json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"dcVoltage9\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"dc_voltage_9\"},{\"name\":\"userPlantInverterMap\",\"kind\":\"object\",\"type\":\"UserPlantInverterMap\",\"relationName\":\"DeviceDailySummaryPerLineChartToUserPlantInverterMap\"},{\"name\":\"sourceLog\",\"kind\":\"object\",\"type\":\"DeviceLogs\",\"relationName\":\"DeviceDailySummaryPerLineChartToDeviceLogs\"}],\"dbName\":\"device_daily_summary_per_line_chart\"},\"information_data\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"input_power\",\"kind\":\"scalar\",\"type\":\"Float\",\"dbName\":\"Input Power\"},{\"name\":\"co2\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"tree_planting\",\"kind\":\"scalar\",\"type\":\"Float\",\"dbName\":\"Tree Planting\"},{\"name\":\"efficiency\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"weather\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"irradiance\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"cell_temperature\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"plantid\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"plant\",\"kind\":\"object\",\"type\":\"Plant\",\"relationName\":\"PlantToinformation_data\"}],\"dbName\":\"information_data\"},\"DeviceConnectionStatus\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"serialNumber\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"serial_number\"},{\"name\":\"macAddress\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"mac_address\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastSeenTime\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"lastSeenTime\"}],\"dbName\":\"device_connection_status\"},\"fota\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mac_address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"firmware\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"link\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":\"fota\"},\"DeviceCurrentStatus\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"sno\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"PlantStatus\"},{\"name\":\"lastTelemetryAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"last_telemetry_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"}],\"dbName\":\"device_current_status\"},\"DeviceStatusHistory\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"sno\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"plantId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"plant_id\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"PlantStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"}],\"dbName\":\"device_status_history\"},\"PlantCurrentStatus\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"plantId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"plant_id\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"PlantStatus\"},{\"name\":\"totalDevices\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"total_devices\"},{\"name\":\"normalCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"normal_count\"},{\"name\":\"abnormalCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"abnormal_count\"},{\"name\":\"standbyCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"standby_count\"},{\"name\":\"offlineCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"offline_count\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"plant\",\"kind\":\"object\",\"type\":\"Plant\",\"relationName\":\"PlantToPlantCurrentStatus\"}],\"dbName\":\"plant_current_status\"},\"DeviceAlertState\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"serialNumber\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"serial_number\"},{\"name\":\"plantId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"plant_id\"},{\"name\":\"plant\",\"kind\":\"object\",\"type\":\"Plant\",\"relationName\":\"DeviceAlertStateToPlant\"},{\"name\":\"alertMatrix\",\"kind\":\"scalar\",\"type\":\"Json\",\"dbName\":\"alert_matrix\"},{\"name\":\"activeAlertCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"active_alert_count\"},{\"name\":\"lastTelemetryAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"last_telemetry_at\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"}],\"dbName\":\"device_alert_state\"},\"AlertEvent\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"serialNumber\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"serial_number\"},{\"name\":\"plantId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"plant_id\"},{\"name\":\"plant\",\"kind\":\"object\",\"type\":\"Plant\",\"relationName\":\"AlertEventToPlant\"},{\"name\":\"registerNo\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"register_no\"},{\"name\":\"bitPosition\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"bit_position\"},{\"name\":\"faultCode\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"fault_code\"},{\"name\":\"faultMessage\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"fault_message\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AlertStatus\"},{\"name\":\"raisedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"raised_at\"},{\"name\":\"clearedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"cleared_at\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"}],\"dbName\":\"alert_events\"},\"FaultDictionary\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"registerName\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"register_name\"},{\"name\":\"registerAddr\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"register_addr\"},{\"name\":\"registerNo\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"register_no\"},{\"name\":\"bitPosition\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"bit_position\"},{\"name\":\"faultCode\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"fault_code\"},{\"name\":\"faultMessage\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"fault_message\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"}],\"dbName\":\"fault_dictionary\"}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"dataloggers\",\"plant\",\"deviceInverter\",\"remoteSettings\",\"remoteSettingTasks\",\"_count\",\"inverter\",\"inverters\",\"information_data\",\"user\",\"currentStatus\",\"alertStates\",\"alertEvents\",\"plants\",\"userPlantInverterMap\",\"dailySummaries\",\"lineChartSnapshots\",\"sourceLog\",\"latestSnapshots\",\"lineChartSummaries\",\"invertorStatus\",\"plantInverterMaps\",\"assignedBy\",\"assignedUsers\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"Plant.findUnique\",\"Plant.findUniqueOrThrow\",\"Plant.findFirst\",\"Plant.findFirstOrThrow\",\"Plant.findMany\",\"Plant.createOne\",\"Plant.createMany\",\"Plant.createManyAndReturn\",\"Plant.updateOne\",\"Plant.updateMany\",\"Plant.updateManyAndReturn\",\"Plant.upsertOne\",\"Plant.deleteOne\",\"Plant.deleteMany\",\"Plant.groupBy\",\"Plant.aggregate\",\"DeviceInverter.findUnique\",\"DeviceInverter.findUniqueOrThrow\",\"DeviceInverter.findFirst\",\"DeviceInverter.findFirstOrThrow\",\"DeviceInverter.findMany\",\"DeviceInverter.createOne\",\"DeviceInverter.createMany\",\"DeviceInverter.createManyAndReturn\",\"DeviceInverter.updateOne\",\"DeviceInverter.updateMany\",\"DeviceInverter.updateManyAndReturn\",\"DeviceInverter.upsertOne\",\"DeviceInverter.deleteOne\",\"DeviceInverter.deleteMany\",\"DeviceInverter.groupBy\",\"DeviceInverter.aggregate\",\"DeviceRemoteSetting.findUnique\",\"DeviceRemoteSetting.findUniqueOrThrow\",\"DeviceRemoteSetting.findFirst\",\"DeviceRemoteSetting.findFirstOrThrow\",\"DeviceRemoteSetting.findMany\",\"DeviceRemoteSetting.createOne\",\"DeviceRemoteSetting.createMany\",\"DeviceRemoteSetting.createManyAndReturn\",\"DeviceRemoteSetting.updateOne\",\"DeviceRemoteSetting.updateMany\",\"DeviceRemoteSetting.updateManyAndReturn\",\"DeviceRemoteSetting.upsertOne\",\"DeviceRemoteSetting.deleteOne\",\"DeviceRemoteSetting.deleteMany\",\"DeviceRemoteSetting.groupBy\",\"DeviceRemoteSetting.aggregate\",\"DeviceRemoteSettingTask.findUnique\",\"DeviceRemoteSettingTask.findUniqueOrThrow\",\"DeviceRemoteSettingTask.findFirst\",\"DeviceRemoteSettingTask.findFirstOrThrow\",\"DeviceRemoteSettingTask.findMany\",\"DeviceRemoteSettingTask.createOne\",\"DeviceRemoteSettingTask.createMany\",\"DeviceRemoteSettingTask.createManyAndReturn\",\"DeviceRemoteSettingTask.updateOne\",\"DeviceRemoteSettingTask.updateMany\",\"DeviceRemoteSettingTask.updateManyAndReturn\",\"DeviceRemoteSettingTask.upsertOne\",\"DeviceRemoteSettingTask.deleteOne\",\"DeviceRemoteSettingTask.deleteMany\",\"DeviceRemoteSettingTask.groupBy\",\"DeviceRemoteSettingTask.aggregate\",\"RemoteSettingParameterMaster.findUnique\",\"RemoteSettingParameterMaster.findUniqueOrThrow\",\"RemoteSettingParameterMaster.findFirst\",\"RemoteSettingParameterMaster.findFirstOrThrow\",\"RemoteSettingParameterMaster.findMany\",\"RemoteSettingParameterMaster.createOne\",\"RemoteSettingParameterMaster.createMany\",\"RemoteSettingParameterMaster.createManyAndReturn\",\"RemoteSettingParameterMaster.updateOne\",\"RemoteSettingParameterMaster.updateMany\",\"RemoteSettingParameterMaster.updateManyAndReturn\",\"RemoteSettingParameterMaster.upsertOne\",\"RemoteSettingParameterMaster.deleteOne\",\"RemoteSettingParameterMaster.deleteMany\",\"RemoteSettingParameterMaster.groupBy\",\"RemoteSettingParameterMaster.aggregate\",\"RemoteSettingCommandMaster.findUnique\",\"RemoteSettingCommandMaster.findUniqueOrThrow\",\"RemoteSettingCommandMaster.findFirst\",\"RemoteSettingCommandMaster.findFirstOrThrow\",\"RemoteSettingCommandMaster.findMany\",\"RemoteSettingCommandMaster.createOne\",\"RemoteSettingCommandMaster.createMany\",\"RemoteSettingCommandMaster.createManyAndReturn\",\"RemoteSettingCommandMaster.updateOne\",\"RemoteSettingCommandMaster.updateMany\",\"RemoteSettingCommandMaster.updateManyAndReturn\",\"RemoteSettingCommandMaster.upsertOne\",\"RemoteSettingCommandMaster.deleteOne\",\"RemoteSettingCommandMaster.deleteMany\",\"RemoteSettingCommandMaster.groupBy\",\"RemoteSettingCommandMaster.aggregate\",\"UserPlantInverterMap.findUnique\",\"UserPlantInverterMap.findUniqueOrThrow\",\"UserPlantInverterMap.findFirst\",\"UserPlantInverterMap.findFirstOrThrow\",\"UserPlantInverterMap.findMany\",\"UserPlantInverterMap.createOne\",\"UserPlantInverterMap.createMany\",\"UserPlantInverterMap.createManyAndReturn\",\"UserPlantInverterMap.updateOne\",\"UserPlantInverterMap.updateMany\",\"UserPlantInverterMap.updateManyAndReturn\",\"UserPlantInverterMap.upsertOne\",\"UserPlantInverterMap.deleteOne\",\"UserPlantInverterMap.deleteMany\",\"UserPlantInverterMap.groupBy\",\"UserPlantInverterMap.aggregate\",\"DeviceInvertorStatus.findUnique\",\"DeviceInvertorStatus.findUniqueOrThrow\",\"DeviceInvertorStatus.findFirst\",\"DeviceInvertorStatus.findFirstOrThrow\",\"DeviceInvertorStatus.findMany\",\"DeviceInvertorStatus.createOne\",\"DeviceInvertorStatus.createMany\",\"DeviceInvertorStatus.createManyAndReturn\",\"DeviceInvertorStatus.updateOne\",\"DeviceInvertorStatus.updateMany\",\"DeviceInvertorStatus.updateManyAndReturn\",\"DeviceInvertorStatus.upsertOne\",\"DeviceInvertorStatus.deleteOne\",\"DeviceInvertorStatus.deleteMany\",\"DeviceInvertorStatus.groupBy\",\"DeviceInvertorStatus.aggregate\",\"DeviceDatalogger.findUnique\",\"DeviceDatalogger.findUniqueOrThrow\",\"DeviceDatalogger.findFirst\",\"DeviceDatalogger.findFirstOrThrow\",\"DeviceDatalogger.findMany\",\"DeviceDatalogger.createOne\",\"DeviceDatalogger.createMany\",\"DeviceDatalogger.createManyAndReturn\",\"DeviceDatalogger.updateOne\",\"DeviceDatalogger.updateMany\",\"DeviceDatalogger.updateManyAndReturn\",\"DeviceDatalogger.upsertOne\",\"DeviceDatalogger.deleteOne\",\"DeviceDatalogger.deleteMany\",\"DeviceDatalogger.groupBy\",\"DeviceDatalogger.aggregate\",\"DeviceLogs.findUnique\",\"DeviceLogs.findUniqueOrThrow\",\"DeviceLogs.findFirst\",\"DeviceLogs.findFirstOrThrow\",\"DeviceLogs.findMany\",\"DeviceLogs.createOne\",\"DeviceLogs.createMany\",\"DeviceLogs.createManyAndReturn\",\"DeviceLogs.updateOne\",\"DeviceLogs.updateMany\",\"DeviceLogs.updateManyAndReturn\",\"DeviceLogs.upsertOne\",\"DeviceLogs.deleteOne\",\"DeviceLogs.deleteMany\",\"DeviceLogs.groupBy\",\"DeviceLogs.aggregate\",\"DeviceLogsLatest.findUnique\",\"DeviceLogsLatest.findUniqueOrThrow\",\"DeviceLogsLatest.findFirst\",\"DeviceLogsLatest.findFirstOrThrow\",\"DeviceLogsLatest.findMany\",\"DeviceLogsLatest.createOne\",\"DeviceLogsLatest.createMany\",\"DeviceLogsLatest.createManyAndReturn\",\"DeviceLogsLatest.updateOne\",\"DeviceLogsLatest.updateMany\",\"DeviceLogsLatest.updateManyAndReturn\",\"DeviceLogsLatest.upsertOne\",\"DeviceLogsLatest.deleteOne\",\"DeviceLogsLatest.deleteMany\",\"DeviceLogsLatest.groupBy\",\"DeviceLogsLatest.aggregate\",\"DeviceDailySummary.findUnique\",\"DeviceDailySummary.findUniqueOrThrow\",\"DeviceDailySummary.findFirst\",\"DeviceDailySummary.findFirstOrThrow\",\"DeviceDailySummary.findMany\",\"DeviceDailySummary.createOne\",\"DeviceDailySummary.createMany\",\"DeviceDailySummary.createManyAndReturn\",\"DeviceDailySummary.updateOne\",\"DeviceDailySummary.updateMany\",\"DeviceDailySummary.updateManyAndReturn\",\"DeviceDailySummary.upsertOne\",\"DeviceDailySummary.deleteOne\",\"DeviceDailySummary.deleteMany\",\"DeviceDailySummary.groupBy\",\"DeviceDailySummary.aggregate\",\"DeviceDailySummaryPerLineChart.findUnique\",\"DeviceDailySummaryPerLineChart.findUniqueOrThrow\",\"DeviceDailySummaryPerLineChart.findFirst\",\"DeviceDailySummaryPerLineChart.findFirstOrThrow\",\"DeviceDailySummaryPerLineChart.findMany\",\"DeviceDailySummaryPerLineChart.createOne\",\"DeviceDailySummaryPerLineChart.createMany\",\"DeviceDailySummaryPerLineChart.createManyAndReturn\",\"DeviceDailySummaryPerLineChart.updateOne\",\"DeviceDailySummaryPerLineChart.updateMany\",\"DeviceDailySummaryPerLineChart.updateManyAndReturn\",\"DeviceDailySummaryPerLineChart.upsertOne\",\"DeviceDailySummaryPerLineChart.deleteOne\",\"DeviceDailySummaryPerLineChart.deleteMany\",\"DeviceDailySummaryPerLineChart.groupBy\",\"DeviceDailySummaryPerLineChart.aggregate\",\"information_data.findUnique\",\"information_data.findUniqueOrThrow\",\"information_data.findFirst\",\"information_data.findFirstOrThrow\",\"information_data.findMany\",\"information_data.createOne\",\"information_data.createMany\",\"information_data.createManyAndReturn\",\"information_data.updateOne\",\"information_data.updateMany\",\"information_data.updateManyAndReturn\",\"information_data.upsertOne\",\"information_data.deleteOne\",\"information_data.deleteMany\",\"information_data.groupBy\",\"information_data.aggregate\",\"DeviceConnectionStatus.findUnique\",\"DeviceConnectionStatus.findUniqueOrThrow\",\"DeviceConnectionStatus.findFirst\",\"DeviceConnectionStatus.findFirstOrThrow\",\"DeviceConnectionStatus.findMany\",\"DeviceConnectionStatus.createOne\",\"DeviceConnectionStatus.createMany\",\"DeviceConnectionStatus.createManyAndReturn\",\"DeviceConnectionStatus.updateOne\",\"DeviceConnectionStatus.updateMany\",\"DeviceConnectionStatus.updateManyAndReturn\",\"DeviceConnectionStatus.upsertOne\",\"DeviceConnectionStatus.deleteOne\",\"DeviceConnectionStatus.deleteMany\",\"DeviceConnectionStatus.groupBy\",\"DeviceConnectionStatus.aggregate\",\"fota.findUnique\",\"fota.findUniqueOrThrow\",\"fota.findFirst\",\"fota.findFirstOrThrow\",\"fota.findMany\",\"fota.createOne\",\"fota.createMany\",\"fota.createManyAndReturn\",\"fota.updateOne\",\"fota.updateMany\",\"fota.updateManyAndReturn\",\"fota.upsertOne\",\"fota.deleteOne\",\"fota.deleteMany\",\"fota.groupBy\",\"fota.aggregate\",\"DeviceCurrentStatus.findUnique\",\"DeviceCurrentStatus.findUniqueOrThrow\",\"DeviceCurrentStatus.findFirst\",\"DeviceCurrentStatus.findFirstOrThrow\",\"DeviceCurrentStatus.findMany\",\"DeviceCurrentStatus.createOne\",\"DeviceCurrentStatus.createMany\",\"DeviceCurrentStatus.createManyAndReturn\",\"DeviceCurrentStatus.updateOne\",\"DeviceCurrentStatus.updateMany\",\"DeviceCurrentStatus.updateManyAndReturn\",\"DeviceCurrentStatus.upsertOne\",\"DeviceCurrentStatus.deleteOne\",\"DeviceCurrentStatus.deleteMany\",\"DeviceCurrentStatus.groupBy\",\"DeviceCurrentStatus.aggregate\",\"DeviceStatusHistory.findUnique\",\"DeviceStatusHistory.findUniqueOrThrow\",\"DeviceStatusHistory.findFirst\",\"DeviceStatusHistory.findFirstOrThrow\",\"DeviceStatusHistory.findMany\",\"DeviceStatusHistory.createOne\",\"DeviceStatusHistory.createMany\",\"DeviceStatusHistory.createManyAndReturn\",\"DeviceStatusHistory.updateOne\",\"DeviceStatusHistory.updateMany\",\"DeviceStatusHistory.updateManyAndReturn\",\"DeviceStatusHistory.upsertOne\",\"DeviceStatusHistory.deleteOne\",\"DeviceStatusHistory.deleteMany\",\"DeviceStatusHistory.groupBy\",\"DeviceStatusHistory.aggregate\",\"PlantCurrentStatus.findUnique\",\"PlantCurrentStatus.findUniqueOrThrow\",\"PlantCurrentStatus.findFirst\",\"PlantCurrentStatus.findFirstOrThrow\",\"PlantCurrentStatus.findMany\",\"PlantCurrentStatus.createOne\",\"PlantCurrentStatus.createMany\",\"PlantCurrentStatus.createManyAndReturn\",\"PlantCurrentStatus.updateOne\",\"PlantCurrentStatus.updateMany\",\"PlantCurrentStatus.updateManyAndReturn\",\"PlantCurrentStatus.upsertOne\",\"PlantCurrentStatus.deleteOne\",\"PlantCurrentStatus.deleteMany\",\"PlantCurrentStatus.groupBy\",\"PlantCurrentStatus.aggregate\",\"DeviceAlertState.findUnique\",\"DeviceAlertState.findUniqueOrThrow\",\"DeviceAlertState.findFirst\",\"DeviceAlertState.findFirstOrThrow\",\"DeviceAlertState.findMany\",\"DeviceAlertState.createOne\",\"DeviceAlertState.createMany\",\"DeviceAlertState.createManyAndReturn\",\"DeviceAlertState.updateOne\",\"DeviceAlertState.updateMany\",\"DeviceAlertState.updateManyAndReturn\",\"DeviceAlertState.upsertOne\",\"DeviceAlertState.deleteOne\",\"DeviceAlertState.deleteMany\",\"DeviceAlertState.groupBy\",\"DeviceAlertState.aggregate\",\"AlertEvent.findUnique\",\"AlertEvent.findUniqueOrThrow\",\"AlertEvent.findFirst\",\"AlertEvent.findFirstOrThrow\",\"AlertEvent.findMany\",\"AlertEvent.createOne\",\"AlertEvent.createMany\",\"AlertEvent.createManyAndReturn\",\"AlertEvent.updateOne\",\"AlertEvent.updateMany\",\"AlertEvent.updateManyAndReturn\",\"AlertEvent.upsertOne\",\"AlertEvent.deleteOne\",\"AlertEvent.deleteMany\",\"AlertEvent.groupBy\",\"AlertEvent.aggregate\",\"FaultDictionary.findUnique\",\"FaultDictionary.findUniqueOrThrow\",\"FaultDictionary.findFirst\",\"FaultDictionary.findFirstOrThrow\",\"FaultDictionary.findMany\",\"FaultDictionary.createOne\",\"FaultDictionary.createMany\",\"FaultDictionary.createManyAndReturn\",\"FaultDictionary.updateOne\",\"FaultDictionary.updateMany\",\"FaultDictionary.updateManyAndReturn\",\"FaultDictionary.upsertOne\",\"FaultDictionary.deleteOne\",\"FaultDictionary.deleteMany\",\"FaultDictionary.groupBy\",\"FaultDictionary.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"registerName\",\"registerAddr\",\"registerNo\",\"bitPosition\",\"faultCode\",\"faultMessage\",\"createdAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"registerNo_bitPosition\",\"serialNumber\",\"plantId\",\"AlertStatus\",\"status\",\"raisedAt\",\"clearedAt\",\"alertMatrix\",\"activeAlertCount\",\"lastTelemetryAt\",\"updatedAt\",\"string_contains\",\"string_starts_with\",\"string_ends_with\",\"array_starts_with\",\"array_ends_with\",\"array_contains\",\"PlantStatus\",\"totalDevices\",\"normalCount\",\"abnormalCount\",\"standbyCount\",\"offlineCount\",\"sno\",\"mac_address\",\"firmware\",\"link\",\"macAddress\",\"lastSeenTime\",\"input_power\",\"co2\",\"tree_planting\",\"efficiency\",\"weather\",\"irradiance\",\"cell_temperature\",\"plantid\",\"created_at\",\"updated_at\",\"dayDate\",\"timestamp\",\"sourceLogId\",\"lineWindowMinutes\",\"maxPoints\",\"loggerStatus\",\"connectedPlant\",\"moduleVersionNo\",\"extendedSystemVersion\",\"dataAcquisitionPeriod\",\"maxConnectedDevices\",\"signalStrength\",\"moduleMacAddress\",\"routerSsid\",\"inverterType\",\"productionComplianceCountry\",\"ratedPower\",\"mpptNo\",\"protocolVersion\",\"commSoftwareVersion1\",\"commSoftwareVersion2\",\"controlSoftwareVersion\",\"deviceModel\",\"firmwareVersion\",\"productionType\",\"dcVoltage1\",\"dcVoltage2\",\"dcVoltage3\",\"dcVoltage4\",\"dcVoltage5\",\"dcVoltage6\",\"dcVoltage7\",\"dcVoltage8\",\"dcCurrent1\",\"dcCurrent2\",\"dcCurrent3\",\"dcCurrent4\",\"dcCurrent5\",\"dcCurrent6\",\"dcCurrent7\",\"dcCurrent8\",\"dcPower1\",\"dcPower2\",\"dcPower3\",\"dcPower4\",\"dcPower5\",\"dcPower6\",\"dcPower7\",\"dcPower8\",\"acVoltageA\",\"acVoltageB\",\"acVoltageC\",\"acCurrentA\",\"acCurrentB\",\"acCurrentC\",\"acPowerA\",\"acPowerB\",\"acPowerC\",\"fault1\",\"fault2\",\"fault3\",\"fault4\",\"fault5\",\"totalInputPower\",\"gridTotalActivePower\",\"gridTotalReactivePower\",\"dailyProduction\",\"gridStatus\",\"inverterStatus\",\"acOutputFrequency\",\"temperature1\",\"temperature2\",\"temperature3\",\"totalProduction\",\"totalGenerationTime\",\"messageType\",\"hybridJson\",\"dcVoltage9\",\"currentPower\",\"eToday\",\"eTotal\",\"hTotal\",\"inverterName\",\"latestTimestamp\",\"batchKey\",\"totalEnergy\",\"totalHours\",\"sno_dayDate\",\"logger_status\",\"connected_plant\",\"module_version_no\",\"extended_system_version\",\"data_acquisition_period\",\"max_connected_devices\",\"signal_strength\",\"module_mac_address\",\"router_ssid\",\"inverter_type\",\"production_compliance_country\",\"device_model\",\"firmware_version\",\"production_type\",\"rated_power\",\"phases\",\"mppt_no\",\"inverter_parameter_count\",\"logger_parameter_count\",\"protocol_version\",\"comm_software_version_1\",\"comm_software_version_2\",\"control_software_version\",\"dc_voltage_1\",\"dc_voltage_2\",\"dc_voltage_3\",\"dc_voltage_4\",\"dc_voltage_5\",\"dc_voltage_6\",\"dc_voltage_7\",\"dc_voltage_8\",\"dc_voltage_9\",\"dc_current_1\",\"dc_current_2\",\"dc_current_3\",\"dc_current_4\",\"dc_current_5\",\"dc_current_6\",\"dc_current_7\",\"dc_current_8\",\"dc_current_9\",\"dc_power_1\",\"dc_power_2\",\"dc_power_3\",\"dc_power_4\",\"dc_power_5\",\"dc_power_6\",\"dc_power_7\",\"dc_power_8\",\"dc_power_9\",\"total_input_power\",\"grid_total_active_power\",\"grid_total_reactive_power\",\"ac_voltage_a\",\"ac_voltage_b\",\"ac_voltage_c\",\"ac_current_a\",\"ac_current_b\",\"ac_current_c\",\"ac_power_a\",\"ac_power_b\",\"ac_power_c\",\"daily_production\",\"ac_output_frequency\",\"temperature_1\",\"temperature_2\",\"temperature_3\",\"total_production\",\"fault_registers\",\"fault_1\",\"fault_2\",\"fault_3\",\"fault_4\",\"fault_5\",\"grid_status\",\"inverter_status\",\"temperature_count\",\"total_generation_time\",\"message_type\",\"hybrid_json\",\"name\",\"type\",\"online\",\"updateTime\",\"inverterId\",\"deletedAt\",\"deviceSno\",\"latestTimeState\",\"userId\",\"isDeleted\",\"commandKey\",\"label\",\"endpointPath\",\"displayOrder\",\"count\",\"registerAddress\",\"registerType\",\"tab\",\"tabLabel\",\"fieldKey\",\"dataType\",\"unitOrOptions\",\"tab_fieldKey\",\"deviceInverterId\",\"RemoteSettingsTaskKind\",\"kind\",\"RemoteSettingsTab\",\"payload\",\"RemoteSettingsTaskStatus\",\"createdById\",\"settings\",\"updatedById\",\"installed\",\"lastUpdatedAt\",\"kwp\",\"price\",\"priceUnit\",\"longitude\",\"latitude\",\"address\",\"pictureFileId\",\"userAccount\",\"account\",\"email\",\"passwordHash\",\"UserPortal\",\"portal\",\"UserRole\",\"role\",\"UserStatus\",\"assignedById\",\"timezone\",\"phone\",\"emailVerifiedAt\",\"lastLoginAt\",\"every\",\"some\",\"none\",\"sno_dayDate_timestamp\",\"deviceInverterId_tab\",\"portal_email\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"disconnect\",\"delete\",\"connect\",\"createMany\",\"set\",\"updateMany\",\"deleteMany\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "_QnrAfACGRAAAOUFACAYAADmBQAgGQAA5wUAIBoAAOgFACCTAwAA4QUAMJQDAABEABCVAwAA4QUAMJYDBAAAAAGdA0AA_AQAIa0DAADkBaoFIrMDQAD8BAAh_QRAAJkFACGBBSAAvwUAIZ8FAQCfBQAhogUBAAAAAaMFAQCfBQAhpAUBAPoEACGmBQAA4gWmBSKoBQAA4wWoBSKqBQQAlgUAIasFAQCfBQAhrAUBAJ8FACGtBUAAmQUAIa4FQACZBQAhtAUAAI0GACABAAAAAQAgGgMAAPoFACAKAACIBgAgCwAAiQYAIAwAAPEFACANAACKBgAgDgAAiwYAIA8AAIwGACCTAwAAhwYAMJQDAAADABCVAwAAhwYAMJYDBAD5BAAhnQNAAPwEACGzA0AA_AQAIfgEAQD6BAAh-QQBAPoEACH9BEAAmQUAIZgFQACZBQAhmQVAAJkFACGaBQgA-AUAIZsFCAD4BQAhnAUBAJ8FACGdBQEAnwUAIZ4FAQCfBQAhnwUBAJ8FACGgBQEAnwUAIaEFAQD6BAAhEQMAAJMJACAKAACXCQAgCwAAmAkAIAwAAI4JACANAACZCQAgDgAAmgkAIA8AAJsJACD9BAAAlwYAIJgFAACXBgAgmQUAAJcGACCaBQAAlwYAIJsFAACXBgAgnAUAAJcGACCdBQAAlwYAIJ4FAACXBgAgnwUAAJcGACCgBQAAlwYAIBoDAAD6BQAgCgAAiAYAIAsAAIkGACAMAADxBQAgDQAAigYAIA4AAIsGACAPAACMBgAgkwMAAIcGADCUAwAAAwAQlQMAAIcGADCWAwQAAAABnQNAAPwEACGzA0AA_AQAIfgEAQD6BAAh-QQBAPoEACH9BEAAmQUAIZgFQACZBQAhmQVAAJkFACGaBQgA-AUAIZsFCAD4BQAhnAUBAJ8FACGdBQEAnwUAIZ4FAQCfBQAhnwUBAJ8FACGgBQEAnwUAIaEFAQD6BAAhAwAAAAMAIAEAAAQAMAIAAAUAIBEEAACTBQAgCQAAhgYAIJMDAACFBgAwlAMAAAcAEJUDAACFBgAwlgMEAPkEACGdA0AA_AQAIaoDAQD6BAAhqwMEAPkEACGtAwEAnwUAIbMDQAD8BAAh-AQBAJ8FACH5BAEA-gQAIfoEIAC_BQAh-wRAAJkFACH8BAQAlgUAIf0EQACZBQAhBwQAALEGACAJAACWCQAgrQMAAJcGACD4BAAAlwYAIPsEAACXBgAg_AQAAJcGACD9BAAAlwYAIBEEAACTBQAgCQAAhgYAIJMDAACFBgAwlAMAAAcAEJUDAACFBgAwlgMEAAAAAZ0DQAD8BAAhqgMBAAAAAasDBAD5BAAhrQMBAJ8FACGzA0AA_AQAIfgEAQCfBQAh-QQBAPoEACH6BCAAvwUAIfsEQACZBQAh_AQEAJYFACH9BEAAmQUAIQMAAAAHACABAAAIADACAAAJACAQAwAA-gUAIAQAAJMFACAGAAD7BQAgBwAA_AUAIJMDAAD5BQAwlAMAAAsAEJUDAAD5BQAwlgMEAPkEACGdA0AA_AQAIaoDAQD6BAAhqwMEAPkEACGzA0AA_AQAIfgEAQCfBQAh-QQBAPoEACH7BEAAmQUAIf0EQACZBQAhAQAAAAsAIAMAAAAHACABAAAIADACAAAJACALBQAAgQYAIJMDAACDBgAwlAMAAA4AEJUDAACDBgAwlgMEAPkEACGdA0AA_AQAIbMDQAD8BAAhiQUAAIQGkwUijwUEAPkEACGWBQAA9gUAIJcFBACWBQAhAgUAAJYJACCXBQAAlwYAIAwFAACBBgAgkwMAAIMGADCUAwAADgAQlQMAAIMGADCWAwQAAAABnQNAAPwEACGzA0AA_AQAIYkFAACEBpMFIo8FBAD5BAAhlgUAAPYFACCXBQQAlgUAIbMFAACCBgAgAwAAAA4AIAEAAA8AMAIAABAAIA0FAACBBgAgkwMAAP0FADCUAwAAEgAQlQMAAP0FADCWAwQA-QQAIZ0DQAD8BAAhrQMAAIAGlQUiswNAAPwEACGJBQAA_wWTBSOPBQQA-QQAIZEFAAD-BZEFIpMFAAD2BQAglQUEAJYFACEDBQAAlgkAIIkFAACXBgAglQUAAJcGACANBQAAgQYAIJMDAAD9BQAwlAMAABIAEJUDAAD9BQAwlgMEAAAAAZ0DQAD8BAAhrQMAAIAGlQUiswNAAPwEACGJBQAA_wWTBSOPBQQA-QQAIZEFAAD-BZEFIpMFAAD2BQAglQUEAJYFACEDAAAAEgAgAQAAEwAwAgAAFAAgAQAAAAcAIAEAAAAOACABAAAAEgAgBwMAAJMJACAEAACxBgAgBgAAlAkAIAcAAJUJACD4BAAAlwYAIPsEAACXBgAg_QQAAJcGACAQAwAA-gUAIAQAAJMFACAGAAD7BQAgBwAA_AUAIJMDAAD5BQAwlAMAAAsAEJUDAAD5BQAwlgMEAAAAAZ0DQAD8BAAhqgMBAAAAAasDBAD5BAAhswNAAPwEACH4BAEAnwUAIfkEAQD6BAAh-wRAAJkFACH9BEAAmQUAIQMAAAALACABAAAZADACAAAaACAPBAAAkwUAIJMDAAD3BQAwlAMAABwAEJUDAAD3BQAwlgMEAPkEACHGAwgA-AUAIccDCAD4BQAhyAMIAPgFACHJAwgA-AUAIcoDAQCfBQAhywMIAPgFACHMAwgA-AUAIc0DBAD5BAAhzgNAAPwEACHPA0AA_AQAIQgEAACxBgAgxgMAAJcGACDHAwAAlwYAIMgDAACXBgAgyQMAAJcGACDKAwAAlwYAIMsDAACXBgAgzAMAAJcGACAPBAAAkwUAIJMDAAD3BQAwlAMAABwAEJUDAAD3BQAwlgMEAAAAAcYDCAD4BQAhxwMIAPgFACHIAwgA-AUAIckDCAD4BQAhygMBAJ8FACHLAwgA-AUAIcwDCAD4BQAhzQMEAPkEACHOA0AA_AQAIc8DQAD8BAAhAwAAABwAIAEAAB0AMAIAAB4AIA0EAACTBQAgkwMAAJEFADCUAwAAIAAQlQMAAJEFADCWAwQA-QQAIasDBAD5BAAhrQMAAJIFuwMiswNAAPwEACG7AwIA-wQAIbwDAgD7BAAhvQMCAPsEACG-AwIA-wQAIb8DAgD7BAAhAQAAACAAIAwEAAD0BQAgkwMAAPUFADCUAwAAIgAQlQMAAPUFADCWAwQA-QQAIZ0DQAD8BAAhqgMBAPoEACGrAwQAlgUAIbADAAD2BQAgsQMCAPsEACGyA0AA_AQAIbMDQAD8BAAhAgQAALEGACCrAwAAlwYAIAwEAAD0BQAgkwMAAPUFADCUAwAAIgAQlQMAAPUFADCWAwQAAAABnQNAAPwEACGqAwEAAAABqwMEAJYFACGwAwAA9gUAILEDAgD7BAAhsgNAAPwEACGzA0AA_AQAIQMAAAAiACABAAAjADACAAAkACABAAAAAwAgDwQAAPQFACCTAwAA8gUAMJQDAAAnABCVAwAA8gUAMJYDBAD5BAAhmQMCAPsEACGaAwIA-wQAIZsDAQD6BAAhnAMBAPoEACGdA0AA_AQAIaoDAQD6BAAhqwMEAJYFACGtAwAA8wWtAyKuA0AAmQUAIa8DQACZBQAhBAQAALEGACCrAwAAlwYAIK4DAACXBgAgrwMAAJcGACAPBAAA9AUAIJMDAADyBQAwlAMAACcAEJUDAADyBQAwlgMEAAAAAZkDAgD7BAAhmgMCAPsEACGbAwEA-gQAIZwDAQD6BAAhnQNAAPwEACGqAwEA-gQAIasDBACWBQAhrQMAAPMFrQMirgNAAJkFACGvA0AAmQUAIQMAAAAnACABAAAoADACAAApACABAAAAAwAgAQAAAAcAIAEAAAALACABAAAAHAAgAQAAACIAIAEAAAAnACAPDAAA8QUAIBIAAO4FACAWAADvBQAgFwAA8AUAIJMDAADtBQAwlAMAADEAEJUDAADtBQAwlgMEAPkEACGdA0AA_AQAIaoDAQD6BAAhqwMEAJYFACGzA0AA_AQAIf0EQACZBQAhgAUEAPkEACGBBSAAvwUAIQYMAACOCQAgEgAAkAkAIBYAAJEJACAXAACSCQAgqwMAAJcGACD9BAAAlwYAIA8MAADxBQAgEgAA7gUAIBYAAO8FACAXAADwBQAgkwMAAO0FADCUAwAAMQAQlQMAAO0FADCWAwQAAAABnQNAAPwEACGqAwEAAAABqwMEAJYFACGzA0AA_AQAIf0EQACZBQAhgAUEAPkEACGBBSAAvwUAIQMAAAAxACABAAAyADACAAAzACANEQAAwAUAIJMDAADsBQAwlAMAADUAEJUDAADsBQAwlgMEAPkEACGdA0AA_AQAIbMDQAD8BAAhwAMBAPoEACHQA0AA_AQAIZ4EEACxBQAhnwQQALEFACGgBBAAsQUAIaEEAgCyBQAhBREAAI8HACCeBAAAlwYAIJ8EAACXBgAgoAQAAJcGACChBAAAlwYAIA4RAADABQAgkwMAAOwFADCUAwAANQAQlQMAAOwFADCWAwQAAAABnQNAAPwEACGzA0AA_AQAIcADAQD6BAAh0ANAAPwEACGeBBAAsQUAIZ8EEACxBQAhoAQQALEFACGhBAIAsgUAIacEAADrBQAgAwAAADUAIAEAADYAMAIAADcAIFgRAADABQAgFAAAswUAIJMDAADqBQAwlAMAADkAEJUDAADqBQAwlgMEAPkEACGdA0AA_AQAIbMDQAD8BAAhwAMBAPoEACHEAwEAnwUAIdADQAD8BAAh0QNAAPwEACHSAwQA-QQAIdMDAgD7BAAh1AMCAPsEACHVAwEAnwUAIdYDAQCfBQAh1wMBAJ8FACHYAwEAnwUAIdkDQACZBQAh2gMCALIFACHbAwIAsgUAIdwDAQCfBQAh3QMBAJ8FACHeAwIAsgUAId8DAgCyBQAh4AMCALIFACHhAwIAsgUAIeIDAgCyBQAh4wMCALIFACHkAwIAsgUAIeUDAgCyBQAh5gMBAJ8FACHnAwEAnwUAIegDAgCyBQAh6QMCALIFACHqAwIAsgUAIesDAgCyBQAh7AMCALIFACHtAwIAsgUAIe4DAgCyBQAh7wMCALIFACHwAwIAsgUAIfEDAgCyBQAh8gMCALIFACHzAwIAsgUAIfQDAgCyBQAh9QMCALIFACH2AwIAsgUAIfcDAgCyBQAh-AMCALIFACH5AwIAsgUAIfoDAgCyBQAh-wMCALIFACH8AwIAsgUAIf0DAgCyBQAh_gMCALIFACH_AwIAsgUAIYAEAgCyBQAhgQQCALIFACGCBAIAsgUAIYMEAgCyBQAhhAQCALIFACGFBAIAsgUAIYYEAgCyBQAhhwQCALIFACGIBAIAsgUAIYkEAgCyBQAhigQCALIFACGLBAIAsgUAIYwEAgCyBQAhjQQCALIFACGOBAIAsgUAIY8EAgCyBQAhkAQCALIFACGRBAIAsgUAIZIEAgCyBQAhkwQCALIFACGUBAIAsgUAIZUEAgCyBQAhlgQCALIFACGXBAIAsgUAIZgEAgCyBQAhmQQCALIFACGaBAIAsgUAIZsEAgCyBQAhnAQAALYFACCdBAIAsgUAIUwRAACPBwAgFAAA6AYAIMQDAACXBgAg1QMAAJcGACDWAwAAlwYAINcDAACXBgAg2AMAAJcGACDZAwAAlwYAINoDAACXBgAg2wMAAJcGACDcAwAAlwYAIN0DAACXBgAg3gMAAJcGACDfAwAAlwYAIOADAACXBgAg4QMAAJcGACDiAwAAlwYAIOMDAACXBgAg5AMAAJcGACDlAwAAlwYAIOYDAACXBgAg5wMAAJcGACDoAwAAlwYAIOkDAACXBgAg6gMAAJcGACDrAwAAlwYAIOwDAACXBgAg7QMAAJcGACDuAwAAlwYAIO8DAACXBgAg8AMAAJcGACDxAwAAlwYAIPIDAACXBgAg8wMAAJcGACD0AwAAlwYAIPUDAACXBgAg9gMAAJcGACD3AwAAlwYAIPgDAACXBgAg-QMAAJcGACD6AwAAlwYAIPsDAACXBgAg_AMAAJcGACD9AwAAlwYAIP4DAACXBgAg_wMAAJcGACCABAAAlwYAIIEEAACXBgAgggQAAJcGACCDBAAAlwYAIIQEAACXBgAghQQAAJcGACCGBAAAlwYAIIcEAACXBgAgiAQAAJcGACCJBAAAlwYAIIoEAACXBgAgiwQAAJcGACCMBAAAlwYAII0EAACXBgAgjgQAAJcGACCPBAAAlwYAIJAEAACXBgAgkQQAAJcGACCSBAAAlwYAIJMEAACXBgAglAQAAJcGACCVBAAAlwYAIJYEAACXBgAglwQAAJcGACCYBAAAlwYAIJkEAACXBgAgmgQAAJcGACCbBAAAlwYAIJwEAACXBgAgnQQAAJcGACBZEQAAwAUAIBQAALMFACCTAwAA6gUAMJQDAAA5ABCVAwAA6gUAMJYDBAAAAAGdA0AA_AQAIbMDQAD8BAAhwAMBAPoEACHEAwEAnwUAIdADQAD8BAAh0QNAAPwEACHSAwQAAAAB0wMCAPsEACHUAwIA-wQAIdUDAQCfBQAh1gMBAJ8FACHXAwEAnwUAIdgDAQCfBQAh2QNAAJkFACHaAwIAsgUAIdsDAgCyBQAh3AMBAJ8FACHdAwEAnwUAId4DAgCyBQAh3wMCALIFACHgAwIAsgUAIeEDAgCyBQAh4gMCALIFACHjAwIAsgUAIeQDAgCyBQAh5QMCALIFACHmAwEAnwUAIecDAQCfBQAh6AMCALIFACHpAwIAsgUAIeoDAgCyBQAh6wMCALIFACHsAwIAsgUAIe0DAgCyBQAh7gMCALIFACHvAwIAsgUAIfADAgCyBQAh8QMCALIFACHyAwIAsgUAIfMDAgCyBQAh9AMCALIFACH1AwIAsgUAIfYDAgCyBQAh9wMCALIFACH4AwIAsgUAIfkDAgCyBQAh-gMCALIFACH7AwIAsgUAIfwDAgCyBQAh_QMCALIFACH-AwIAsgUAIf8DAgCyBQAhgAQCALIFACGBBAIAsgUAIYIEAgCyBQAhgwQCALIFACGEBAIAsgUAIYUEAgCyBQAhhgQCALIFACGHBAIAsgUAIYgEAgCyBQAhiQQCALIFACGKBAIAsgUAIYsEAgCyBQAhjAQCALIFACGNBAIAsgUAIY4EAgCyBQAhjwQCALIFACGQBAIAsgUAIZEEAgCyBQAhkgQCALIFACGTBAIAsgUAIZQEAgCyBQAhlQQCALIFACGWBAIAsgUAIZcEAgCyBQAhmAQCALIFACGZBAIAsgUAIZoEAgCyBQAhmwQCALIFACGcBAAAtgUAIJ0EAgCyBQAhsgUAAOkFACADAAAAOQAgAQAAOgAwAgAAOwAgAQAAADkAIBEUAACzBQAgkwMAALAFADCUAwAAPgAQlQMAALAFADCWAwQA-QQAIZ0DQAD8BAAhswNAAPwEACHAAwEA-gQAIdADQAD8BAAh0gMEAPkEACGSBBAAsQUAIZ4EEACxBQAhogQBAJ8FACGjBEAA_AQAIaQEAQD6BAAhpQQQALEFACGmBAIAsgUAIQEAAAA-ACAKEQAAwAUAIJMDAAC-BQAwlAMAAEAAEJUDAAC-BQAwlgMEAPkEACGdA0AA_AQAIa0DIAC_BQAhswNAAPwEACH-BAEA-gQAIf8EQAD8BAAhAQAAAEAAIAEAAAA1ACABAAAAOQAgGBAAAOUFACAYAADmBQAgGQAA5wUAIBoAAOgFACCTAwAA4QUAMJQDAABEABCVAwAA4QUAMJYDBAD5BAAhnQNAAPwEACGtAwAA5AWqBSKzA0AA_AQAIf0EQACZBQAhgQUgAL8FACGfBQEAnwUAIaIFAQD6BAAhowUBAJ8FACGkBQEA-gQAIaYFAADiBaYFIqgFAADjBagFIqoFBACWBQAhqwUBAJ8FACGsBQEAnwUAIa0FQACZBQAhrgVAAJkFACEBAAAARAAgDBAAAIwJACAYAACNCQAgGQAAjgkAIBoAAI8JACD9BAAAlwYAIJ8FAACXBgAgowUAAJcGACCqBQAAlwYAIKsFAACXBgAgrAUAAJcGACCtBQAAlwYAIK4FAACXBgAgAwAAAEQAIAEAAEYAMAIAAAEAIAEAAAADACABAAAAMQAgAQAAAEQAIAEAAAABACADAAAARAAgAQAARgAwAgAAAQAgAwAAAEQAIAEAAEYAMAIAAAEAIAMAAABEACABAABGADACAAABACAVEAAA8AgAIBgAAPEIACAZAACLCQAgGgAA8ggAIJYDBAAAAAGdA0AAAAABrQMAAACqBQKzA0AAAAAB_QRAAAAAAYEFIAAAAAGfBQEAAAABogUBAAAAAaMFAQAAAAGkBQEAAAABpgUAAACmBQKoBQAAAKgFAqoFBAAAAAGrBQEAAAABrAUBAAAAAa0FQAAAAAGuBUAAAAABASAAAE8AIBGWAwQAAAABnQNAAAAAAa0DAAAAqgUCswNAAAAAAf0EQAAAAAGBBSAAAAABnwUBAAAAAaIFAQAAAAGjBQEAAAABpAUBAAAAAaYFAAAApgUCqAUAAACoBQKqBQQAAAABqwUBAAAAAawFAQAAAAGtBUAAAAABrgVAAAAAAQEgAABRADABIAAAUQAwAQAAAEQAIBUQAADgCAAgGAAA4QgAIBkAAOIIACAaAADjCAAglgMEAJMGACGdA0AAlgYAIa0DAADfCKoFIrMDQACWBgAh_QRAAJ4GACGBBSAAgwcAIZ8FAQDBBgAhogUBAJQGACGjBQEAwQYAIaQFAQCUBgAhpgUAAN0IpgUiqAUAAN4IqAUiqgUEAJ8GACGrBQEAwQYAIawFAQDBBgAhrQVAAJ4GACGuBUAAngYAIQIAAAABACAgAABVACARlgMEAJMGACGdA0AAlgYAIa0DAADfCKoFIrMDQACWBgAh_QRAAJ4GACGBBSAAgwcAIZ8FAQDBBgAhogUBAJQGACGjBQEAwQYAIaQFAQCUBgAhpgUAAN0IpgUiqAUAAN4IqAUiqgUEAJ8GACGrBQEAwQYAIawFAQDBBgAhrQVAAJ4GACGuBUAAngYAIQIAAABEACAgAABXACACAAAARAAgIAAAVwAgAQAAAEQAIAMAAAABACAnAABPACAoAABVACABAAAAAQAgAQAAAEQAIA0IAADYCAAgLQAA2QgAIC4AANwIACAvAADbCAAgMAAA2ggAIP0EAACXBgAgnwUAAJcGACCjBQAAlwYAIKoFAACXBgAgqwUAAJcGACCsBQAAlwYAIK0FAACXBgAgrgUAAJcGACAUkwMAANcFADCUAwAAXwAQlQMAANcFADCWAwQA6wQAIZ0DQADuBAAhrQMAANoFqgUiswNAAO4EACH9BEAAgQUAIYEFIAC6BQAhnwUBAJsFACGiBQEA7AQAIaMFAQCbBQAhpAUBAOwEACGmBQAA2AWmBSKoBQAA2QWoBSKqBQQA_wQAIasFAQCbBQAhrAUBAJsFACGtBUAAgQUAIa4FQACBBQAhAwAAAEQAIAEAAF4AMCwAAF8AIAMAAABEACABAABGADACAAABACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIBcDAADRCAAgCgAA0ggAIAsAANMIACAMAADUCAAgDQAA1QgAIA4AANYIACAPAADXCAAglgMEAAAAAZ0DQAAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH9BEAAAAABmAVAAAAAAZkFQAAAAAGaBQgAAAABmwUIAAAAAZwFAQAAAAGdBQEAAAABngUBAAAAAZ8FAQAAAAGgBQEAAAABoQUBAAAAAQEgAABnACAQlgMEAAAAAZ0DQAAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH9BEAAAAABmAVAAAAAAZkFQAAAAAGaBQgAAAABmwUIAAAAAZwFAQAAAAGdBQEAAAABngUBAAAAAZ8FAQAAAAGgBQEAAAABoQUBAAAAAQEgAABpADABIAAAaQAwFwMAAIwIACAKAACNCAAgCwAAjggAIAwAAI8IACANAACQCAAgDgAAkQgAIA8AAJIIACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACGhBQEAlAYAIQIAAAAFACAgAABsACAQlgMEAJMGACGdA0AAlgYAIbMDQACWBgAh-AQBAJQGACH5BAEAlAYAIf0EQACeBgAhmAVAAJ4GACGZBUAAngYAIZoFCADMBgAhmwUIAMwGACGcBQEAwQYAIZ0FAQDBBgAhngUBAMEGACGfBQEAwQYAIaAFAQDBBgAhoQUBAJQGACECAAAAAwAgIAAAbgAgAgAAAAMAICAAAG4AIAMAAAAFACAnAABnACAoAABsACABAAAABQAgAQAAAAMAIA8IAACHCAAgLQAAiAgAIC4AAIsIACAvAACKCAAgMAAAiQgAIP0EAACXBgAgmAUAAJcGACCZBQAAlwYAIJoFAACXBgAgmwUAAJcGACCcBQAAlwYAIJ0FAACXBgAgngUAAJcGACCfBQAAlwYAIKAFAACXBgAgE5MDAADWBQAwlAMAAHUAEJUDAADWBQAwlgMEAOsEACGdA0AA7gQAIbMDQADuBAAh-AQBAOwEACH5BAEA7AQAIf0EQACBBQAhmAVAAIEFACGZBUAAgQUAIZoFCACjBQAhmwUIAKMFACGcBQEAmwUAIZ0FAQCbBQAhngUBAJsFACGfBQEAmwUAIaAFAQCbBQAhoQUBAOwEACEDAAAAAwAgAQAAdAAwLAAAdQAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAaACABAAAAGgAgAwAAAAsAIAEAABkAMAIAABoAIAMAAAALACABAAAZADACAAAaACADAAAACwAgAQAAGQAwAgAAGgAgDQMAAIMIACAEAACECAAgBgAAhQgAIAcAAIYIACCWAwQAAAABnQNAAAAAAaoDAQAAAAGrAwQAAAABswNAAAAAAfgEAQAAAAH5BAEAAAAB-wRAAAAAAf0EQAAAAAEBIAAAfQAgCZYDBAAAAAGdA0AAAAABqgMBAAAAAasDBAAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH7BEAAAAAB_QRAAAAAAQEgAAB_ADABIAAAfwAwDQMAANsHACAEAADcBwAgBgAA3QcAIAcAAN4HACCWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAkwYAIbMDQACWBgAh-AQBAMEGACH5BAEAlAYAIfsEQACeBgAh_QRAAJ4GACECAAAAGgAgIAAAggEAIAmWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAkwYAIbMDQACWBgAh-AQBAMEGACH5BAEAlAYAIfsEQACeBgAh_QRAAJ4GACECAAAACwAgIAAAhAEAIAIAAAALACAgAACEAQAgAwAAABoAICcAAH0AICgAAIIBACABAAAAGgAgAQAAAAsAIAgIAADWBwAgLQAA1wcAIC4AANoHACAvAADZBwAgMAAA2AcAIPgEAACXBgAg-wQAAJcGACD9BAAAlwYAIAyTAwAA1QUAMJQDAACLAQAQlQMAANUFADCWAwQA6wQAIZ0DQADuBAAhqgMBAOwEACGrAwQA6wQAIbMDQADuBAAh-AQBAJsFACH5BAEA7AQAIfsEQACBBQAh_QRAAIEFACEDAAAACwAgAQAAigEAMCwAAIsBACADAAAACwAgAQAAGQAwAgAAGgAgAQAAABAAIAEAAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAAAOACABAAAPADACAAAQACAIBQAA1QcAIJYDBAAAAAGdA0AAAAABswNAAAAAAYkFAAAAkwUCjwUEAAAAAZYFgAAAAAGXBQQAAAABASAAAJMBACAHlgMEAAAAAZ0DQAAAAAGzA0AAAAABiQUAAACTBQKPBQQAAAABlgWAAAAAAZcFBAAAAAEBIAAAlQEAMAEgAACVAQAwCAUAANQHACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACGJBQAA0weTBSKPBQQAkwYAIZYFgAAAAAGXBQQAnwYAIQIAAAAQACAgAACYAQAgB5YDBACTBgAhnQNAAJYGACGzA0AAlgYAIYkFAADTB5MFIo8FBACTBgAhlgWAAAAAAZcFBACfBgAhAgAAAA4AICAAAJoBACACAAAADgAgIAAAmgEAIAMAAAAQACAnAACTAQAgKAAAmAEAIAEAAAAQACABAAAADgAgBggAAM4HACAtAADPBwAgLgAA0gcAIC8AANEHACAwAADQBwAglwUAAJcGACAKkwMAANEFADCUAwAAoQEAEJUDAADRBQAwlgMEAOsEACGdA0AA7gQAIbMDQADuBAAhiQUAANIFkwUijwUEAOsEACGWBQAAiwUAIJcFBAD_BAAhAwAAAA4AIAEAAKABADAsAAChAQAgAwAAAA4AIAEAAA8AMAIAABAAIAEAAAAUACABAAAAFAAgAwAAABIAIAEAABMAMAIAABQAIAMAAAASACABAAATADACAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgCgUAAM0HACCWAwQAAAABnQNAAAAAAa0DAAAAlQUCswNAAAAAAYkFAAAAkwUDjwUEAAAAAZEFAAAAkQUCkwWAAAAAAZUFBAAAAAEBIAAAqQEAIAmWAwQAAAABnQNAAAAAAa0DAAAAlQUCswNAAAAAAYkFAAAAkwUDjwUEAAAAAZEFAAAAkQUCkwWAAAAAAZUFBAAAAAEBIAAAqwEAMAEgAACrAQAwCgUAAMwHACCWAwQAkwYAIZ0DQACWBgAhrQMAAMsHlQUiswNAAJYGACGJBQAAygeTBSOPBQQAkwYAIZEFAADJB5EFIpMFgAAAAAGVBQQAnwYAIQIAAAAUACAgAACuAQAgCZYDBACTBgAhnQNAAJYGACGtAwAAyweVBSKzA0AAlgYAIYkFAADKB5MFI48FBACTBgAhkQUAAMkHkQUikwWAAAAAAZUFBACfBgAhAgAAABIAICAAALABACACAAAAEgAgIAAAsAEAIAMAAAAUACAnAACpAQAgKAAArgEAIAEAAAAUACABAAAAEgAgBwgAAMQHACAtAADFBwAgLgAAyAcAIC8AAMcHACAwAADGBwAgiQUAAJcGACCVBQAAlwYAIAyTAwAAxwUAMJQDAAC3AQAQlQMAAMcFADCWAwQA6wQAIZ0DQADuBAAhrQMAAMoFlQUiswNAAO4EACGJBQAAyQWTBSOPBQQA6wQAIZEFAADIBZEFIpMFAACLBQAglQUEAP8EACEDAAAAEgAgAQAAtgEAMCwAALcBACADAAAAEgAgAQAAEwAwAgAAFAAgEpMDAADFBQAwlAMAAL0BABCVAwAAxQUAMJYDBAAAAAGdA0AA_AQAIbMDQAD8BAAhgwUBAPoEACGEBQEA-gQAIYUFAgD7BAAhhgUCAPsEACGHBQEAnwUAIYgFAQCfBQAhiQUBAPoEACGKBQEA-gQAIYsFAQD6BAAhjAUBAPoEACGNBQEAnwUAIY4FAADGBQAgAQAAALoBACABAAAAugEAIBGTAwAAxQUAMJQDAAC9AQAQlQMAAMUFADCWAwQA-QQAIZ0DQAD8BAAhswNAAPwEACGDBQEA-gQAIYQFAQD6BAAhhQUCAPsEACGGBQIA-wQAIYcFAQCfBQAhiAUBAJ8FACGJBQEA-gQAIYoFAQD6BAAhiwUBAPoEACGMBQEA-gQAIY0FAQCfBQAhA4cFAACXBgAgiAUAAJcGACCNBQAAlwYAIAMAAAC9AQAgAQAAvgEAMAIAALoBACADAAAAvQEAIAEAAL4BADACAAC6AQAgAwAAAL0BACABAAC-AQAwAgAAugEAIA6WAwQAAAABnQNAAAAAAbMDQAAAAAGDBQEAAAABhAUBAAAAAYUFAgAAAAGGBQIAAAABhwUBAAAAAYgFAQAAAAGJBQEAAAABigUBAAAAAYsFAQAAAAGMBQEAAAABjQUBAAAAAQEgAADCAQAgDpYDBAAAAAGdA0AAAAABswNAAAAAAYMFAQAAAAGEBQEAAAABhQUCAAAAAYYFAgAAAAGHBQEAAAABiAUBAAAAAYkFAQAAAAGKBQEAAAABiwUBAAAAAYwFAQAAAAGNBQEAAAABASAAAMQBADABIAAAxAEAMA6WAwQAkwYAIZ0DQACWBgAhswNAAJYGACGDBQEAlAYAIYQFAQCUBgAhhQUCAJUGACGGBQIAlQYAIYcFAQDBBgAhiAUBAMEGACGJBQEAlAYAIYoFAQCUBgAhiwUBAJQGACGMBQEAlAYAIY0FAQDBBgAhAgAAALoBACAgAADHAQAgDpYDBACTBgAhnQNAAJYGACGzA0AAlgYAIYMFAQCUBgAhhAUBAJQGACGFBQIAlQYAIYYFAgCVBgAhhwUBAMEGACGIBQEAwQYAIYkFAQCUBgAhigUBAJQGACGLBQEAlAYAIYwFAQCUBgAhjQUBAMEGACECAAAAvQEAICAAAMkBACACAAAAvQEAICAAAMkBACADAAAAugEAICcAAMIBACAoAADHAQAgAQAAALoBACABAAAAvQEAIAgIAAC_BwAgLQAAwAcAIC4AAMMHACAvAADCBwAgMAAAwQcAIIcFAACXBgAgiAUAAJcGACCNBQAAlwYAIBGTAwAAxAUAMJQDAADQAQAQlQMAAMQFADCWAwQA6wQAIZ0DQADuBAAhswNAAO4EACGDBQEA7AQAIYQFAQDsBAAhhQUCAO0EACGGBQIA7QQAIYcFAQCbBQAhiAUBAJsFACGJBQEA7AQAIYoFAQDsBAAhiwUBAOwEACGMBQEA7AQAIY0FAQCbBQAhAwAAAL0BACABAADPAQAwLAAA0AEAIAMAAAC9AQAgAQAAvgEAMAIAALoBACAMkwMAAMMFADCUAwAA1gEAEJUDAADDBQAwlgMEAAAAAZ0DQAD8BAAhggUBAAAAAYMFAQD6BAAhhAUBAPoEACGFBQIA-wQAIYYFAgD7BAAhhwUBAJ8FACGIBQEAnwUAIQEAAADTAQAgAQAAANMBACAMkwMAAMMFADCUAwAA1gEAEJUDAADDBQAwlgMEAPkEACGdA0AA_AQAIYIFAQD6BAAhgwUBAPoEACGEBQEA-gQAIYUFAgD7BAAhhgUCAPsEACGHBQEAnwUAIYgFAQCfBQAhAocFAACXBgAgiAUAAJcGACADAAAA1gEAIAEAANcBADACAADTAQAgAwAAANYBACABAADXAQAwAgAA0wEAIAMAAADWAQAgAQAA1wEAMAIAANMBACAJlgMEAAAAAZ0DQAAAAAGCBQEAAAABgwUBAAAAAYQFAQAAAAGFBQIAAAABhgUCAAAAAYcFAQAAAAGIBQEAAAABASAAANsBACAJlgMEAAAAAZ0DQAAAAAGCBQEAAAABgwUBAAAAAYQFAQAAAAGFBQIAAAABhgUCAAAAAYcFAQAAAAGIBQEAAAABASAAAN0BADABIAAA3QEAMAmWAwQAkwYAIZ0DQACWBgAhggUBAJQGACGDBQEAlAYAIYQFAQCUBgAhhQUCAJUGACGGBQIAlQYAIYcFAQDBBgAhiAUBAMEGACECAAAA0wEAICAAAOABACAJlgMEAJMGACGdA0AAlgYAIYIFAQCUBgAhgwUBAJQGACGEBQEAlAYAIYUFAgCVBgAhhgUCAJUGACGHBQEAwQYAIYgFAQDBBgAhAgAAANYBACAgAADiAQAgAgAAANYBACAgAADiAQAgAwAAANMBACAnAADbAQAgKAAA4AEAIAEAAADTAQAgAQAAANYBACAHCAAAugcAIC0AALsHACAuAAC-BwAgLwAAvQcAIDAAALwHACCHBQAAlwYAIIgFAACXBgAgDJMDAADCBQAwlAMAAOkBABCVAwAAwgUAMJYDBADrBAAhnQNAAO4EACGCBQEA7AQAIYMFAQDsBAAhhAUBAOwEACGFBQIA7QQAIYYFAgDtBAAhhwUBAJsFACGIBQEAmwUAIQMAAADWAQAgAQAA6AEAMCwAAOkBACADAAAA1gEAIAEAANcBADACAADTAQAgAQAAADMAIAEAAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAxACABAAAyADACAAAzACAMDAAAuQcAIBIAALYHACAWAAC3BwAgFwAAuAcAIJYDBAAAAAGdA0AAAAABqgMBAAAAAasDBAAAAAGzA0AAAAAB_QRAAAAAAYAFBAAAAAGBBSAAAAABASAAAPEBACAIlgMEAAAAAZ0DQAAAAAGqAwEAAAABqwMEAAAAAbMDQAAAAAH9BEAAAAABgAUEAAAAAYEFIAAAAAEBIAAA8wEAMAEgAADzAQAwDAwAAJgHACASAACVBwAgFgAAlgcAIBcAAJcHACCWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAnwYAIbMDQACWBgAh_QRAAJ4GACGABQQAkwYAIYEFIACDBwAhAgAAADMAICAAAPYBACAIlgMEAJMGACGdA0AAlgYAIaoDAQCUBgAhqwMEAJ8GACGzA0AAlgYAIf0EQACeBgAhgAUEAJMGACGBBSAAgwcAIQIAAAAxACAgAAD4AQAgAgAAADEAICAAAPgBACADAAAAMwAgJwAA8QEAICgAAPYBACABAAAAMwAgAQAAADEAIAcIAACQBwAgLQAAkQcAIC4AAJQHACAvAACTBwAgMAAAkgcAIKsDAACXBgAg_QQAAJcGACALkwMAAMEFADCUAwAA_wEAEJUDAADBBQAwlgMEAOsEACGdA0AA7gQAIaoDAQDsBAAhqwMEAP8EACGzA0AA7gQAIf0EQACBBQAhgAUEAOsEACGBBSAAugUAIQMAAAAxACABAAD-AQAwLAAA_wEAIAMAAAAxACABAAAyADACAAAzACAKEQAAwAUAIJMDAAC-BQAwlAMAAEAAEJUDAAC-BQAwlgMEAAAAAZ0DQAD8BAAhrQMgAL8FACGzA0AA_AQAIf4EAQAAAAH_BEAA_AQAIQEAAACCAgAgAQAAAIICACABEQAAjwcAIAMAAABAACABAACFAgAwAgAAggIAIAMAAABAACABAACFAgAwAgAAggIAIAMAAABAACABAACFAgAwAgAAggIAIAcRAACOBwAglgMEAAAAAZ0DQAAAAAGtAyAAAAABswNAAAAAAf4EAQAAAAH_BEAAAAABASAAAIkCACAGlgMEAAAAAZ0DQAAAAAGtAyAAAAABswNAAAAAAf4EAQAAAAH_BEAAAAABASAAAIsCADABIAAAiwIAMAcRAACNBwAglgMEAJMGACGdA0AAlgYAIa0DIACDBwAhswNAAJYGACH-BAEAlAYAIf8EQACWBgAhAgAAAIICACAgAACOAgAgBpYDBACTBgAhnQNAAJYGACGtAyAAgwcAIbMDQACWBgAh_gQBAJQGACH_BEAAlgYAIQIAAABAACAgAACQAgAgAgAAAEAAICAAAJACACADAAAAggIAICcAAIkCACAoAACOAgAgAQAAAIICACABAAAAQAAgBQgAAIgHACAtAACJBwAgLgAAjAcAIC8AAIsHACAwAACKBwAgCZMDAAC9BQAwlAMAAJcCABCVAwAAvQUAMJYDBADrBAAhnQNAAO4EACGtAyAAugUAIbMDQADuBAAh_gQBAOwEACH_BEAA7gQAIQMAAABAACABAACWAgAwLAAAlwIAIAMAAABAACABAACFAgAwAgAAggIAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgQAAIcHACAJAACGBwAglgMEAAAAAZ0DQAAAAAGqAwEAAAABqwMEAAAAAa0DAQAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH6BCAAAAAB-wRAAAAAAfwEBAAAAAH9BEAAAAABASAAAJ8CACAMlgMEAAAAAZ0DQAAAAAGqAwEAAAABqwMEAAAAAa0DAQAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH6BCAAAAAB-wRAAAAAAfwEBAAAAAH9BEAAAAABASAAAKECADABIAAAoQIAMAEAAAALACAOBAAAhQcAIAkAAIQHACCWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAkwYAIa0DAQDBBgAhswNAAJYGACH4BAEAwQYAIfkEAQCUBgAh-gQgAIMHACH7BEAAngYAIfwEBACfBgAh_QRAAJ4GACECAAAACQAgIAAApQIAIAyWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAkwYAIa0DAQDBBgAhswNAAJYGACH4BAEAwQYAIfkEAQCUBgAh-gQgAIMHACH7BEAAngYAIfwEBACfBgAh_QRAAJ4GACECAAAABwAgIAAApwIAIAIAAAAHACAgAACnAgAgAQAAAAsAIAMAAAAJACAnAACfAgAgKAAApQIAIAEAAAAJACABAAAABwAgCggAAP4GACAtAAD_BgAgLgAAggcAIC8AAIEHACAwAACABwAgrQMAAJcGACD4BAAAlwYAIPsEAACXBgAg_AQAAJcGACD9BAAAlwYAIA-TAwAAuQUAMJQDAACvAgAQlQMAALkFADCWAwQA6wQAIZ0DQADuBAAhqgMBAOwEACGrAwQA6wQAIa0DAQCbBQAhswNAAO4EACH4BAEAmwUAIfkEAQDsBAAh-gQgALoFACH7BEAAgQUAIfwEBAD_BAAh_QRAAIEFACEDAAAABwAgAQAArgIAMCwAAK8CACADAAAABwAgAQAACAAwAgAACQAgWRMAALcFACAVAAC4BQAgkwMAALUFADCUAwAAtQIAEJUDAAC1BQAwlgMEAAAAAcADAQCfBQAhwQMBAJ8FACHRA0AA_AQAIagEAQCfBQAhqQQBAJ8FACGqBAEAnwUAIasEAQCfBQAhrARAAJkFACGtBAIAsgUAIa4EBACWBQAhrwQBAJ8FACGwBAEAnwUAIbEEAgCyBQAhsgQCALIFACGzBAEAnwUAIbQEAQCfBQAhtQQCALIFACG2BAIAsgUAIbcEAgCyBQAhuAQCALIFACG5BAIAsgUAIboEAgCyBQAhuwQCALIFACG8BAIAsgUAIb0EAgCyBQAhvgQCALIFACG_BBAAsQUAIcAEEACxBQAhwQQQALEFACHCBBAAsQUAIcMEEACxBQAhxAQQALEFACHFBBAAsQUAIcYEEACxBQAhxwQQALEFACHIBBAAsQUAIckEEACxBQAhygQQALEFACHLBBAAsQUAIcwEEACxBQAhzQQQALEFACHOBBAAsQUAIc8EEACxBQAh0AQQALEFACHRBBAAsQUAIdIEEACxBQAh0wQQALEFACHUBBAAsQUAIdUEEACxBQAh1gQQALEFACHXBBAAsQUAIdgEEACxBQAh2QQQALEFACHaBBAAsQUAIdsEEACxBQAh3AQQALEFACHdBBAAsQUAId4EEACxBQAh3wQQALEFACHgBBAAsQUAIeEEEACxBQAh4gQQALEFACHjBBAAsQUAIeQEEACxBQAh5QQQALEFACHmBBAAsQUAIecEEACxBQAh6AQQALEFACHpBBAAsQUAIeoEEACxBQAh6wQQALEFACHsBAIAsgUAIe0EAgCyBQAh7gQCALIFACHvBAIAsgUAIfAEAgCyBQAh8QQCALIFACHyBAIAsgUAIfMEAgCyBQAh9AQCALIFACH1BAIAsgUAIfYEAgCyBQAh9wQAALYFACABAAAAsgIAIAEAAACyAgAgWRMAALcFACAVAAC4BQAgkwMAALUFADCUAwAAtQIAEJUDAAC1BQAwlgMEAPkEACHAAwEAnwUAIcEDAQCfBQAh0QNAAPwEACGoBAEAnwUAIakEAQCfBQAhqgQBAJ8FACGrBAEAnwUAIawEQACZBQAhrQQCALIFACGuBAQAlgUAIa8EAQCfBQAhsAQBAJ8FACGxBAIAsgUAIbIEAgCyBQAhswQBAJ8FACG0BAEAnwUAIbUEAgCyBQAhtgQCALIFACG3BAIAsgUAIbgEAgCyBQAhuQQCALIFACG6BAIAsgUAIbsEAgCyBQAhvAQCALIFACG9BAIAsgUAIb4EAgCyBQAhvwQQALEFACHABBAAsQUAIcEEEACxBQAhwgQQALEFACHDBBAAsQUAIcQEEACxBQAhxQQQALEFACHGBBAAsQUAIccEEACxBQAhyAQQALEFACHJBBAAsQUAIcoEEACxBQAhywQQALEFACHMBBAAsQUAIc0EEACxBQAhzgQQALEFACHPBBAAsQUAIdAEEACxBQAh0QQQALEFACHSBBAAsQUAIdMEEACxBQAh1AQQALEFACHVBBAAsQUAIdYEEACxBQAh1wQQALEFACHYBBAAsQUAIdkEEACxBQAh2gQQALEFACHbBBAAsQUAIdwEEACxBQAh3QQQALEFACHeBBAAsQUAId8EEACxBQAh4AQQALEFACHhBBAAsQUAIeIEEACxBQAh4wQQALEFACHkBBAAsQUAIeUEEACxBQAh5gQQALEFACHnBBAAsQUAIegEEACxBQAh6QQQALEFACHqBBAAsQUAIesEEACxBQAh7AQCALIFACHtBAIAsgUAIe4EAgCyBQAh7wQCALIFACHwBAIAsgUAIfEEAgCyBQAh8gQCALIFACHzBAIAsgUAIfQEAgCyBQAh9QQCALIFACH2BAIAsgUAIfcEAAC2BQAgVBMAAPwGACAVAAD9BgAgwAMAAJcGACDBAwAAlwYAIKgEAACXBgAgqQQAAJcGACCqBAAAlwYAIKsEAACXBgAgrAQAAJcGACCtBAAAlwYAIK4EAACXBgAgrwQAAJcGACCwBAAAlwYAILEEAACXBgAgsgQAAJcGACCzBAAAlwYAILQEAACXBgAgtQQAAJcGACC2BAAAlwYAILcEAACXBgAguAQAAJcGACC5BAAAlwYAILoEAACXBgAguwQAAJcGACC8BAAAlwYAIL0EAACXBgAgvgQAAJcGACC_BAAAlwYAIMAEAACXBgAgwQQAAJcGACDCBAAAlwYAIMMEAACXBgAgxAQAAJcGACDFBAAAlwYAIMYEAACXBgAgxwQAAJcGACDIBAAAlwYAIMkEAACXBgAgygQAAJcGACDLBAAAlwYAIMwEAACXBgAgzQQAAJcGACDOBAAAlwYAIM8EAACXBgAg0AQAAJcGACDRBAAAlwYAINIEAACXBgAg0wQAAJcGACDUBAAAlwYAINUEAACXBgAg1gQAAJcGACDXBAAAlwYAINgEAACXBgAg2QQAAJcGACDaBAAAlwYAINsEAACXBgAg3AQAAJcGACDdBAAAlwYAIN4EAACXBgAg3wQAAJcGACDgBAAAlwYAIOEEAACXBgAg4gQAAJcGACDjBAAAlwYAIOQEAACXBgAg5QQAAJcGACDmBAAAlwYAIOcEAACXBgAg6AQAAJcGACDpBAAAlwYAIOoEAACXBgAg6wQAAJcGACDsBAAAlwYAIO0EAACXBgAg7gQAAJcGACDvBAAAlwYAIPAEAACXBgAg8QQAAJcGACDyBAAAlwYAIPMEAACXBgAg9AQAAJcGACD1BAAAlwYAIPYEAACXBgAg9wQAAJcGACADAAAAtQIAIAEAALYCADACAACyAgAgAwAAALUCACABAAC2AgAwAgAAsgIAIAMAAAC1AgAgAQAAtgIAMAIAALICACBWEwAA-gYAIBUAAPsGACCWAwQAAAABwAMBAAAAAcEDAQAAAAHRA0AAAAABqAQBAAAAAakEAQAAAAGqBAEAAAABqwQBAAAAAawEQAAAAAGtBAIAAAABrgQEAAAAAa8EAQAAAAGwBAEAAAABsQQCAAAAAbIEAgAAAAGzBAEAAAABtAQBAAAAAbUEAgAAAAG2BAIAAAABtwQCAAAAAbgEAgAAAAG5BAIAAAABugQCAAAAAbsEAgAAAAG8BAIAAAABvQQCAAAAAb4EAgAAAAG_BBAAAAABwAQQAAAAAcEEEAAAAAHCBBAAAAABwwQQAAAAAcQEEAAAAAHFBBAAAAABxgQQAAAAAccEEAAAAAHIBBAAAAAByQQQAAAAAcoEEAAAAAHLBBAAAAABzAQQAAAAAc0EEAAAAAHOBBAAAAABzwQQAAAAAdAEEAAAAAHRBBAAAAAB0gQQAAAAAdMEEAAAAAHUBBAAAAAB1QQQAAAAAdYEEAAAAAHXBBAAAAAB2AQQAAAAAdkEEAAAAAHaBBAAAAAB2wQQAAAAAdwEEAAAAAHdBBAAAAAB3gQQAAAAAd8EEAAAAAHgBBAAAAAB4QQQAAAAAeIEEAAAAAHjBBAAAAAB5AQQAAAAAeUEEAAAAAHmBBAAAAAB5wQQAAAAAegEEAAAAAHpBBAAAAAB6gQQAAAAAesEEAAAAAHsBAIAAAAB7QQCAAAAAe4EAgAAAAHvBAIAAAAB8AQCAAAAAfEEAgAAAAHyBAIAAAAB8wQCAAAAAfQEAgAAAAH1BAIAAAAB9gQCAAAAAfcEgAAAAAEBIAAAugIAIFSWAwQAAAABwAMBAAAAAcEDAQAAAAHRA0AAAAABqAQBAAAAAakEAQAAAAGqBAEAAAABqwQBAAAAAawEQAAAAAGtBAIAAAABrgQEAAAAAa8EAQAAAAGwBAEAAAABsQQCAAAAAbIEAgAAAAGzBAEAAAABtAQBAAAAAbUEAgAAAAG2BAIAAAABtwQCAAAAAbgEAgAAAAG5BAIAAAABugQCAAAAAbsEAgAAAAG8BAIAAAABvQQCAAAAAb4EAgAAAAG_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_AgAgAQAAALICACABAAAAtQIAIFcIAADpBgAgLQAA6gYAIC4AAO0GACAvAADsBgAgMAAA6wYAIMADAACXBgAgwQMAAJcGACCoBAAAlwYAIKkEAACXBgAgqgQAAJcGACCrBAAAlwYAIKwEAACXBgAgrQQAAJcGACCuBAAAlwYAIK8EAACXBgAgsAQAAJcGACCxBAAAlwYAILIEAACXBgAgswQAAJcGACC0BAAAlwYAILUEAACXBgAgtgQAAJcGACC3BAAAlwYAILgEAACXBgAguQQAAJcGACC6BAAAlwYAILsEAACXBgAgvAQAAJcGACC9BAAAlwYAIL4EAACXBgAgvwQAAJcGACDABAAAlwYAIMEEAACXBgAgwgQAAJcGACDDBAAAlwYAIMQEAACXBgAgxQQAAJcGACDGBAAAlwYAIMcEAACXBgAgyAQAAJcGACDJBAAAlwYAIMoEAACXBgAgywQAAJcGACDMBAAAlwYAIM0EAACXBgAgzgQAAJcGACDPBAAAlwYAINAEAACXBgAg0QQAAJcGACDSBAAAlwYAINMEAACXBgAg1AQAAJcGACDVBAAAlwYAINYEAACXBgAg1wQAAJcGACDYBAAAlwYAINkEAACXBgAg2gQAAJcGACDbBAAAlwYAINwEAACXBgAg3QQAAJcGACDeBAAAlwYAIN8EAACXBgAg4AQAAJcGACDhBAAAlwYAIOIEAACXBgAg4wQAAJcGACDkBAAAlwYAIOUEAACXBgAg5gQAAJcGACDnBAAAlwYAIOgEAACXBgAg6QQAAJcGACDqBAAAlwYAIOsEAACXBgAg7AQAAJcGACDtBAAAlwYAIO4EAACXBgAg7wQAAJcGACDwBAAAlwYAIPEEAACXBgAg8gQAAJcGACDzBAAAlwYAIPQEAACXBgAg9QQAAJcGACD2BAAAlwYAIPcEAACXBgAgV5MDAAC0BQAwlAMAAMgCABCVAwAAtAUAMJYDBADrBAAhwAMBAJsFACHBAwEAmwUAIdEDQADuBAAhqAQBAJsFACGpBAEAmwUAIaoEAQCbBQAhqwQBAJsFACGsBEAAgQUAIa0EAgCmBQAhrgQEAP8EACGvBAEAmwUAIbAEAQCbBQAhsQQCAKYFACGyBAIApgUAIbMEAQCbBQAhtAQBAJsFACG1BAIApgUAIbYEAgCmBQAhtwQCAKYFACG4BAIApgUAIbkEAgCmBQAhugQCAKYFACG7BAIApgUAIbwEAgCmBQAhvQQCAKYFACG-BAIApgUAIb8EEACrBQAhwAQQAKsFACHBBBAAqwUAIcIEEACrBQAhwwQQAKsFACHEBBAAqwUAIcUEEACrBQAhxgQQAKsFACHHBBAAqwUAIcgEEACrBQAhyQQQAKsFACHKBBAAqwUAIcsEEACrBQAhzAQQAKsFACHNBBAAqwUAIc4EEACrBQAhzwQQAKsFACHQBBAAqwUAIdEEEACrBQAh0gQQAKsFACHTBBAAqwUAIdQEEACrBQAh1QQQAKsFACHWBBAAqwUAIdcEEACrBQAh2AQQAKsFACHZBBAAqwUAIdoEEACrBQAh2wQQAKsFACHcBBAAqwUAId0EEACrBQAh3gQQAKsFACHfBBAAqwUAIeAEEACrBQAh4QQQAKsFACHiBBAAqwUAIeMEEACrBQAh5AQQAKsFACHlBBAAqwUAIeYEEACrBQAh5wQQAKsFACHoBBAAqwUAIekEEACrBQAh6gQQAKsFACHrBBAAqwUAIewEAgCmBQAh7QQCAKYFACHuBAIApgUAIe8EAgCmBQAh8AQCAKYFACHxBAIApgUAIfIEAgCmBQAh8wQCAKYFACH0BAIApgUAIfUEAgCmBQAh9gQCAKYFACH3BAAApwUAIAMAAAC1AgAgAQAAxwIAMCwAAMgCACADAAAAtQIAIAEAALYCADACAACyAgAgEhQAALMFACCTAwAAsAUAMJQDAAA-ABCVAwAAsAUAMJYDBAAAAAGdA0AA_AQAIbMDQAD8BAAhwAMBAPoEACHQA0AA_AQAIdIDBAAAAAGSBBAAsQUAIZ4EEACxBQAhogQBAJ8FACGjBEAA_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-gMCAAAAAfsDAgAAAAH8AwIAAAAB_QMCAAAAAf4DAgAAAAH_AwIAAAABgAQCAAAAAYEEAgAAAAGCBAIAAAABgwQCAAAAAYQEAgAAAAGFBAIAAAABhgQCAAAAAYcEAgAAAAGIBAIAAAABiQQCAAAAAYoEAgAAAAGLBAIAAAABjAQCAAAAAY0EAgAAAAGOBAIAAAABjwQCAAAAAZAEAgAAAAGRBAIAAAABkgQCAAAAAZMEAgAAAAGUBAIAAAABlQQCAAAAAZYEAgAAAAGXBAIAAAABmAQCAAAAAZkEAgAAAAGaBAIAAAABmwQCAAAAAZwEgAAAAAGdBAIAAAABASAAAP4CACBTlgMEAAAAAZ0DQAAAAAGzA0AAAAABwAMBAAAAAcQDAQAAAAHQA0AAAAAB0QNAAAAAAdIDBAAAAAHTAwIAAAAB1AMCAAAAAdUDAQAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZA0AAAAAB2gMCAAAAAdsDAgAAAAHcAwEAAAAB3QMBAAAAAd4DAgAAAAHfAwIAAAAB4AMCAAAAAeEDAgAAAAHiAwIAAAAB4wMCAAAAAeQDAgAAAAHlAwIAAAAB5gMBAAAAAecDAQAAAAHoAwIAAAAB6QMCAAAAAeoDAgAAAAHrAwIAAAAB7AMCAAAAAe0DAgAAAAHuAwIAAAAB7wMCAAAAAfADAgAAAAHxAwIAAAAB8gMCAAAAAfMDAgAAAAH0AwIAAAAB9QMCAAAAAfYDAgAAAAH3AwIAAAAB-AMCAAAAAfkDAgAAAAH6AwIAAAAB-wMCAAAAAfwDAgAAAAH9AwIAAAAB_gMCAAAAAf8DAgAAAAGABAIAAAABgQQCAAAAAYIEAgAAAAGDBAIAAAABhAQCAAAAAYUEAgAAAAGGBAIAAAABhwQCAAAAAYgEAgAAAAGJBAIAAAABigQCAAAAAYsEAgAAAAGMBAIAAAABjQQCAAAAAY4EAgAAAAGPBAIAAAABkAQCAAAAAZEEAgAAAAGSBAIAAAABkwQCAAAAAZQEAgAAAAGVBAIAAAABlgQCAAAAAZcEAgAAAAGYBAIAAAABmQQCAAAAAZoEAgAAAAGbBAIAAAABnASAAAAAAZ0EAgAAAAEBIAAAgAMAMAEgAACAAwAwVREAANUGACAUAADWBgAglgMEAJMGACGdA0AAlgYAIbMDQACWBgAhwAMBAJQGACHEAwEAwQYAIdADQACWBgAh0QNAAJYGACHSAwQAkwYAIdMDAgCVBgAh1AMCAJUGACHVAwEAwQYAIdYDAQDBBgAh1wMBAMEGACHYAwEAwQYAIdkDQACeBgAh2gMCANQGACHbAwIA1AYAIdwDAQDBBgAh3QMBAMEGACHeAwIA1AYAId8DAgDUBgAh4AMCANQGACHhAwIA1AYAIeIDAgDUBgAh4wMCANQGACHkAwIA1AYAIeUDAgDUBgAh5gMBAMEGACHnAwEAwQYAIegDAgDUBgAh6QMCANQGACHqAwIA1AYAIesDAgDUBgAh7AMCANQGACHtAwIA1AYAIe4DAgDUBgAh7wMCANQGACHwAwIA1AYAIfEDAgDUBgAh8gMCANQGACHzAwIA1AYAIfQDAgDUBgAh9QMCANQGACH2AwIA1AYAIfcDAgDUBgAh-AMCANQGACH5AwIA1AYAIfoDAgDUBgAh-wMCANQGACH8AwIA1AYAIf0DAgDUBgAh_gMCANQGACH_AwIA1AYAIYAEAgDUBgAhgQQCANQGACGCBAIA1AYAIYMEAgDUBgAhhAQCANQGACGFBAIA1AYAIYYEAgDUBgAhhwQCANQGACGIBAIA1AYAIYkEAgDUBgAhigQCANQGACGLBAIA1AYAIYwEAgDUBgAhjQQCANQGACGOBAIA1AYAIY8EAgDUBgAhkAQCANQGACGRBAIA1AYAIZIEAgDUBgAhkwQCANQGACGUBAIA1AYAIZUEAgDUBgAhlgQCANQGACGXBAIA1AYAIZgEAgDUBgAhmQQCANQGACGaBAIA1AYAIZsEAgDUBgAhnASAAAAAAZ0EAgDUBgAhAgAAADsAICAAAIMDACBTlgMEAJMGACGdA0AAlgYAIbMDQACWBgAhwAMBAJQGACHEAwEAwQYAIdADQACWBgAh0QNAAJYGACHSAwQAkwYAIdMDAgCVBgAh1AMCAJUGACHVAwEAwQYAIdYDAQDBBgAh1wMBAMEGACHYAwEAwQYAIdkDQACeBgAh2gMCANQGACHbAwIA1AYAIdwDAQDBBgAh3QMBAMEGACHeAwIA1AYAId8DAgDUBgAh4AMCANQGACHhAwIA1AYAIeIDAgDUBgAh4wMCANQGACHkAwIA1AYAIeUDAgDUBgAh5gMBAMEGACHnAwEAwQYAIegDAgDUBgAh6QMCANQGACHqAwIA1AYAIesDAgDUBgAh7AMCANQGACHtAwIA1AYAIe4DAgDUBgAh7wMCANQGACHwAwIA1AYAIfEDAgDUBgAh8gMCANQGACHzAwIA1AYAIfQDAgDUBgAh9QMCANQGACH2AwIA1AYAIfcDAgDUBgAh-AMCANQGACH5AwIA1AYAIfoDAgDUBgAh-wMCANQGACH8AwIA1AYAIf0DAgDUBgAh_gMCANQGACH_AwIA1AYAIYAEAgDUBgAhgQQCANQGACGCBAIA1AYAIYMEAgDUBgAhhAQCANQGACGFBAIA1AYAIYYEAgDUBgAhhwQCANQGACGIBAIA1AYAIYkEAgDUBgAhigQCANQGACGLBAIA1AYAIYwEAgDUBgAhjQQCANQGACGOBAIA1AYAIY8EAgDUBgAhkAQCANQGACGRBAIA1AYAIZIEAgDUBgAhkwQCANQGACGUBAIA1AYAIZUEAgDUBgAhlgQCANQGACGXBAIA1AYAIZgEAgDUBgAhmQQCANQGACGaBAIA1AYAIZsEAgDUBgAhnASAAAAAAZ0EAgDUBgAhAgAAADkAICAAAIUDACACAAAAOQAgIAAAhQMAIAMAAAA7ACAnAAD-AgAgKAAAgwMAIAEAAAA7ACABAAAAOQAgTwgAAM8GACAtAADQBgAgLgAA0wYAIC8AANIGACAwAADRBgAgxAMAAJcGACDVAwAAlwYAINYDAACXBgAg1wMAAJcGACDYAwAAlwYAINkDAACXBgAg2gMAAJcGACDbAwAAlwYAINwDAACXBgAg3QMAAJcGACDeAwAAlwYAIN8DAACXBgAg4AMAAJcGACDhAwAAlwYAIOIDAACXBgAg4wMAAJcGACDkAwAAlwYAIOUDAACXBgAg5gMAAJcGACDnAwAAlwYAIOgDAACXBgAg6QMAAJcGACDqAwAAlwYAIOsDAACXBgAg7AMAAJcGACDtAwAAlwYAIO4DAACXBgAg7wMAAJcGACDwAwAAlwYAIPEDAACXBgAg8gMAAJcGACDzAwAAlwYAIPQDAACXBgAg9QMAAJcGACD2AwAAlwYAIPcDAACXBgAg-AMAAJcGACD5AwAAlwYAIPoDAACXBgAg-wMAAJcGACD8AwAAlwYAIP0DAACXBgAg_gMAAJcGACD_AwAAlwYAIIAEAACXBgAggQQAAJcGACCCBAAAlwYAIIMEAACXBgAghAQAAJcGACCFBAAAlwYAIIYEAACXBgAghwQAAJcGACCIBAAAlwYAIIkEAACXBgAgigQAAJcGACCLBAAAlwYAIIwEAACXBgAgjQQAAJcGACCOBAAAlwYAII8EAACXBgAgkAQAAJcGACCRBAAAlwYAIJIEAACXBgAgkwQAAJcGACCUBAAAlwYAIJUEAACXBgAglgQAAJcGACCXBAAAlwYAIJgEAACXBgAgmQQAAJcGACCaBAAAlwYAIJsEAACXBgAgnAQAAJcGACCdBAAAlwYAIFaTAwAApQUAMJQDAACMAwAQlQMAAKUFADCWAwQA6wQAIZ0DQADuBAAhswNAAO4EACHAAwEA7AQAIcQDAQCbBQAh0ANAAO4EACHRA0AA7gQAIdIDBADrBAAh0wMCAO0EACHUAwIA7QQAIdUDAQCbBQAh1gMBAJsFACHXAwEAmwUAIdgDAQCbBQAh2QNAAIEFACHaAwIApgUAIdsDAgCmBQAh3AMBAJsFACHdAwEAmwUAId4DAgCmBQAh3wMCAKYFACHgAwIApgUAIeEDAgCmBQAh4gMCAKYFACHjAwIApgUAIeQDAgCmBQAh5QMCAKYFACHmAwEAmwUAIecDAQCbBQAh6AMCAKYFACHpAwIApgUAIeoDAgCmBQAh6wMCAKYFACHsAwIApgUAIe0DAgCmBQAh7gMCAKYFACHvAwIApgUAIfADAgCmBQAh8QMCAKYFACHyAwIApgUAIfMDAgCmBQAh9AMCAKYFACH1AwIApgUAIfYDAgCmBQAh9wMCAKYFACH4AwIApgUAIfkDAgCmBQAh-gMCAKYFACH7AwIApgUAIfwDAgCmBQAh_QMCAKYFACH-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_AwAgAgAAAPMDACAgAAD_AwAgAwAAAPADACAnAAD4AwAgKAAA_QMAIAEAAADwAwAgAQAAAPMDACAGCAAAsgYAIC0AALMGACAuAAC2BgAgLwAAtQYAIDAAALQGACCrAwAAlwYAIAiTAwAAlAUAMJQDAACGBAAQlQMAAJQFADCWAwQA6wQAIZ0DQADuBAAhqwMEAP8EACGtAwAAjgW7AyLAAwEA7AQAIQMAAADzAwAgAQAAhQQAMCwAAIYEACADAAAA8wMAIAEAAPQDADACAADwAwAgDQQAAJMFACCTAwAAkQUAMJQDAAAgABCVAwAAkQUAMJYDBAAAAAGrAwQAAAABrQMAAJIFuwMiswNAAPwEACG7AwIA-wQAIbwDAgD7BAAhvQMCAPsEACG-AwIA-wQAIb8DAgD7BAAhAQAAAIkEACABAAAAiQQAIAEEAACxBgAgAwAAACAAIAEAAIwEADACAACJBAAgAwAAACAAIAEAAIwEADACAACJBAAgAwAAACAAIAEAAIwEADACAACJBAAgCgQAALAGACCWAwQAAAABqwMEAAAAAa0DAAAAuwMCswNAAAAAAbsDAgAAAAG8AwIAAAABvQMCAAAAAb4DAgAAAAG_AwIAAAABASAAAJAEACAJlgMEAAAAAasDBAAAAAGtAwAAALsDArMDQAAAAAG7AwIAAAABvAMCAAAAAb0DAgAAAAG-AwIAAAABvwMCAAAAAQEgAACSBAAwASAAAJIEADAKBAAArwYAIJYDBACTBgAhqwMEAJMGACGtAwAArga7AyKzA0AAlgYAIbsDAgCVBgAhvAMCAJUGACG9AwIAlQYAIb4DAgCVBgAhvwMCAJUGACECAAAAiQQAICAAAJUEACAJlgMEAJMGACGrAwQAkwYAIa0DAACuBrsDIrMDQACWBgAhuwMCAJUGACG8AwIAlQYAIb0DAgCVBgAhvgMCAJUGACG_AwIAlQYAIQIAAAAgACAgAACXBAAgAgAAACAAICAAAJcEACADAAAAiQQAICcAAJAEACAoAACVBAAgAQAAAIkEACABAAAAIAAgBQgAAKkGACAtAACqBgAgLgAArQYAIC8AAKwGACAwAACrBgAgDJMDAACNBQAwlAMAAJ4EABCVAwAAjQUAMJYDBADrBAAhqwMEAOsEACGtAwAAjgW7AyKzA0AA7gQAIbsDAgDtBAAhvAMCAO0EACG9AwIA7QQAIb4DAgDtBAAhvwMCAO0EACEDAAAAIAAgAQAAnQQAMCwAAJ4EACADAAAAIAAgAQAAjAQAMAIAAIkEACABAAAAJAAgAQAAACQAIAMAAAAiACABAAAjADACAAAkACADAAAAIgAgAQAAIwAwAgAAJAAgAwAAACIAIAEAACMAMAIAACQAIAkEAACoBgAglgMEAAAAAZ0DQAAAAAGqAwEAAAABqwMEAAAAAbADgAAAAAGxAwIAAAABsgNAAAAAAbMDQAAAAAEBIAAApgQAIAiWAwQAAAABnQNAAAAAAaoDAQAAAAGrAwQAAAABsAOAAAAAAbEDAgAAAAGyA0AAAAABswNAAAAAAQEgAACoBAAwASAAAKgEADABAAAAAwAgCQQAAKcGACCWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAnwYAIbADgAAAAAGxAwIAlQYAIbIDQACWBgAhswNAAJYGACECAAAAJAAgIAAArAQAIAiWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAnwYAIbADgAAAAAGxAwIAlQYAIbIDQACWBgAhswNAAJYGACECAAAAIgAgIAAArgQAIAIAAAAiACAgAACuBAAgAQAAAAMAIAMAAAAkACAnAACmBAAgKAAArAQAIAEAAAAkACABAAAAIgAgBggAAKIGACAtAACjBgAgLgAApgYAIC8AAKUGACAwAACkBgAgqwMAAJcGACALkwMAAIoFADCUAwAAtgQAEJUDAACKBQAwlgMEAOsEACGdA0AA7gQAIaoDAQDsBAAhqwMEAP8EACGwAwAAiwUAILEDAgDtBAAhsgNAAO4EACGzA0AA7gQAIQMAAAAiACABAAC1BAAwLAAAtgQAIAMAAAAiACABAAAjADACAAAkACABAAAAKQAgAQAAACkAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIAwEAAChBgAglgMEAAAAAZkDAgAAAAGaAwIAAAABmwMBAAAAAZwDAQAAAAGdA0AAAAABqgMBAAAAAasDBAAAAAGtAwAAAK0DAq4DQAAAAAGvA0AAAAABASAAAL4EACALlgMEAAAAAZkDAgAAAAGaAwIAAAABmwMBAAAAAZwDAQAAAAGdA0AAAAABqgMBAAAAAasDBAAAAAGtAwAAAK0DAq4DQAAAAAGvA0AAAAABASAAAMAEADABIAAAwAQAMAEAAAADACAMBAAAoAYAIJYDBACTBgAhmQMCAJUGACGaAwIAlQYAIZsDAQCUBgAhnAMBAJQGACGdA0AAlgYAIaoDAQCUBgAhqwMEAJ8GACGtAwAAnQatAyKuA0AAngYAIa8DQACeBgAhAgAAACkAICAAAMQEACALlgMEAJMGACGZAwIAlQYAIZoDAgCVBgAhmwMBAJQGACGcAwEAlAYAIZ0DQACWBgAhqgMBAJQGACGrAwQAnwYAIa0DAACdBq0DIq4DQACeBgAhrwNAAJ4GACECAAAAJwAgIAAAxgQAIAIAAAAnACAgAADGBAAgAQAAAAMAIAMAAAApACAnAAC-BAAgKAAAxAQAIAEAAAApACABAAAAJwAgCAgAAJgGACAtAACZBgAgLgAAnAYAIC8AAJsGACAwAACaBgAgqwMAAJcGACCuAwAAlwYAIK8DAACXBgAgDpMDAAD-BAAwlAMAAM4EABCVAwAA_gQAMJYDBADrBAAhmQMCAO0EACGaAwIA7QQAIZsDAQDsBAAhnAMBAOwEACGdA0AA7gQAIaoDAQDsBAAhqwMEAP8EACGtAwAAgAWtAyKuA0AAgQUAIa8DQACBBQAhAwAAACcAIAEAAM0EADAsAADOBAAgAwAAACcAIAEAACgAMAIAACkAIAyTAwAA-AQAMJQDAADUBAAQlQMAAPgEADCWAwQAAAABlwMBAPoEACGYAwEA-gQAIZkDAgD7BAAhmgMCAPsEACGbAwEA-gQAIZwDAQD6BAAhnQNAAPwEACGpAwAA_QQAIAEAAADRBAAgAQAAANEEACALkwMAAPgEADCUAwAA1AQAEJUDAAD4BAAwlgMEAPkEACGXAwEA-gQAIZgDAQD6BAAhmQMCAPsEACGaAwIA-wQAIZsDAQD6BAAhnAMBAPoEACGdA0AA_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-gQAIZgDAQD6BAAhmQMCAPsEACGaAwIA-wQAIZsDAQD6BAAhnAMBAPoEACGdA0AA_AQAIQieAwQAAAABnwMEAAAABKADBAAAAAShAwQAAAABogMEAAAAAaMDBAAAAAGkAwQAAAABpQMEAPcEACELngMBAAAAAZ8DAQAAAASgAwEAAAAEoQMBAAAAAaIDAQAAAAGjAwEAAAABpAMBAAAAAaUDAQD1BAAhpgMBAAAAAacDAQAAAAGoAwEAAAABCJ4DAgAAAAGfAwIAAAAEoAMCAAAABKEDAgAAAAGiAwIAAAABowMCAAAAAaQDAgAAAAGlAwIA8AQAIQieA0AAAAABnwNAAAAABKADQAAAAAShA0AAAAABogNAAAAAAaMDQAAAAAGkA0AAAAABpQNAAPEEACECmQMCAAAAAZoDAgAAAAEOkwMAAP4EADCUAwAAzgQAEJUDAAD-BAAwlgMEAOsEACGZAwIA7QQAIZoDAgDtBAAhmwMBAOwEACGcAwEA7AQAIZ0DQADuBAAhqgMBAOwEACGrAwQA_wQAIa0DAACABa0DIq4DQACBBQAhrwNAAIEFACENCAAAgwUAIC0AAIgFACAuAACJBQAgLwAAiQUAIDAAAIkFACCeAwQAAAABnwMEAAAABaADBAAAAAWhAwQAAAABogMEAAAAAaMDBAAAAAGkAwQAAAABpQMEAIcFACEHCAAA8AQAIC8AAIYFACAwAACGBQAgngMAAACtAwKfAwAAAK0DCKADAAAArQMIpQMAAIUFrQMiCwgAAIMFACAvAACEBQAgMAAAhAUAIJ4DQAAAAAGfA0AAAAAFoANAAAAABaEDQAAAAAGiA0AAAAABowNAAAAAAaQDQAAAAAGlA0AAggUAIQsIAACDBQAgLwAAhAUAIDAAAIQFACCeA0AAAAABnwNAAAAABaADQAAAAAWhA0AAAAABogNAAAAAAaMDQAAAAAGkA0AAAAABpQNAAIIFACEIngMCAAAAAZ8DAgAAAAWgAwIAAAAFoQMCAAAAAaIDAgAAAAGjAwIAAAABpAMCAAAAAaUDAgCDBQAhCJ4DQAAAAAGfA0AAAAAFoANAAAAABaEDQAAAAAGiA0AAAAABowNAAAAAAaQDQAAAAAGlA0AAhAUAIQcIAADwBAAgLwAAhgUAIDAAAIYFACCeAwAAAK0DAp8DAAAArQMIoAMAAACtAwilAwAAhQWtAyIEngMAAACtAwKfAwAAAK0DCKADAAAArQMIpQMAAIYFrQMiDQgAAIMFACAtAACIBQAgLgAAiQUAIC8AAIkFACAwAACJBQAgngMEAAAAAZ8DBAAAAAWgAwQAAAAFoQMEAAAAAaIDBAAAAAGjAwQAAAABpAMEAAAAAaUDBACHBQAhCJ4DCAAAAAGfAwgAAAAFoAMIAAAABaEDCAAAAAGiAwgAAAABowMIAAAAAaQDCAAAAAGlAwgAiAUAIQieAwQAAAABnwMEAAAABaADBAAAAAWhAwQAAAABogMEAAAAAaMDBAAAAAGkAwQAAAABpQMEAIkFACELkwMAAIoFADCUAwAAtgQAEJUDAACKBQAwlgMEAOsEACGdA0AA7gQAIaoDAQDsBAAhqwMEAP8EACGwAwAAiwUAILEDAgDtBAAhsgNAAO4EACGzA0AA7gQAIQ8IAADwBAAgLwAAjAUAIDAAAIwFACCeA4AAAAABoQOAAAAAAaIDgAAAAAGjA4AAAAABpAOAAAAAAaUDgAAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG3A4AAAAABuAOAAAAAAbkDgAAAAAEMngOAAAAAAaEDgAAAAAGiA4AAAAABowOAAAAAAaQDgAAAAAGlA4AAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABtwOAAAAAAbgDgAAAAAG5A4AAAAABDJMDAACNBQAwlAMAAJ4EABCVAwAAjQUAMJYDBADrBAAhqwMEAOsEACGtAwAAjgW7AyKzA0AA7gQAIbsDAgDtBAAhvAMCAO0EACG9AwIA7QQAIb4DAgDtBAAhvwMCAO0EACEHCAAA8AQAIC8AAJAFACAwAACQBQAgngMAAAC7AwKfAwAAALsDCKADAAAAuwMIpQMAAI8FuwMiBwgAAPAEACAvAACQBQAgMAAAkAUAIJ4DAAAAuwMCnwMAAAC7AwigAwAAALsDCKUDAACPBbsDIgSeAwAAALsDAp8DAAAAuwMIoAMAAAC7AwilAwAAkAW7AyINBAAAkwUAIJMDAACRBQAwlAMAACAAEJUDAACRBQAwlgMEAPkEACGrAwQA-QQAIa0DAACSBbsDIrMDQAD8BAAhuwMCAPsEACG8AwIA-wQAIb0DAgD7BAAhvgMCAPsEACG_AwIA-wQAIQSeAwAAALsDAp8DAAAAuwMIoAMAAAC7AwilAwAAkAW7AyIcAwAA-gUAIAoAAIgGACALAACJBgAgDAAA8QUAIA0AAIoGACAOAACLBgAgDwAAjAYAIJMDAACHBgAwlAMAAAMAEJUDAACHBgAwlgMEAPkEACGdA0AA_AQAIbMDQAD8BAAh-AQBAPoEACH5BAEA-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-gMCAKYFACH7AwIApgUAIfwDAgCmBQAh_QMCAKYFACH-AwIApgUAIf8DAgCmBQAhgAQCAKYFACGBBAIApgUAIYIEAgCmBQAhgwQCAKYFACGEBAIApgUAIYUEAgCmBQAhhgQCAKYFACGHBAIApgUAIYgEAgCmBQAhiQQCAKYFACGKBAIApgUAIYsEAgCmBQAhjAQCAKYFACGNBAIApgUAIY4EAgCmBQAhjwQCAKYFACGQBAIApgUAIZEEAgCmBQAhkgQCAKYFACGTBAIApgUAIZQEAgCmBQAhlQQCAKYFACGWBAIApgUAIZcEAgCmBQAhmAQCAKYFACGZBAIApgUAIZoEAgCmBQAhmwQCAKYFACGcBAAApwUAIJ0EAgCmBQAhDQgAAIMFACAtAACIBQAgLgAAgwUAIC8AAIMFACAwAACDBQAgngMCAAAAAZ8DAgAAAAWgAwIAAAAFoQMCAAAAAaIDAgAAAAGjAwIAAAABpAMCAAAAAaUDAgCpBQAhDwgAAIMFACAvAACoBQAgMAAAqAUAIJ4DgAAAAAGhA4AAAAABogOAAAAAAaMDgAAAAAGkA4AAAAABpQOAAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbcDgAAAAAG4A4AAAAABuQOAAAAAAQyeA4AAAAABoQOAAAAAAaIDgAAAAAGjA4AAAAABpAOAAAAAAaUDgAAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG3A4AAAAABuAOAAAAAAbkDgAAAAAENCAAAgwUAIC0AAIgFACAuAACDBQAgLwAAgwUAIDAAAIMFACCeAwIAAAABnwMCAAAABaADAgAAAAWhAwIAAAABogMCAAAAAaMDAgAAAAGkAwIAAAABpQMCAKkFACEMkwMAAKoFADCUAwAA9gIAEJUDAACqBQAwlgMEAOsEACGdA0AA7gQAIbMDQADuBAAhwAMBAOwEACHQA0AA7gQAIZ4EEACrBQAhnwQQAKsFACGgBBAAqwUAIaEEAgCmBQAhDQgAAIMFACAtAACtBQAgLgAArQUAIC8AAK0FACAwAACtBQAgngMQAAAAAZ8DEAAAAAWgAxAAAAAFoQMQAAAAAaIDEAAAAAGjAxAAAAABpAMQAAAAAaUDEACsBQAhDQgAAIMFACAtAACtBQAgLgAArQUAIC8AAK0FACAwAACtBQAgngMQAAAAAZ8DEAAAAAWgAxAAAAAFoQMQAAAAAaIDEAAAAAGjAxAAAAABpAMQAAAAAaUDEACsBQAhCJ4DEAAAAAGfAxAAAAAFoAMQAAAABaEDEAAAAAGiAxAAAAABowMQAAAAAaQDEAAAAAGlAxAArQUAIRCTAwAArgUAMJQDAADgAgAQlQMAAK4FADCWAwQA6wQAIZ0DQADuBAAhswNAAO4EACHAAwEA7AQAIdADQADuBAAh0gMEAOsEACGSBBAAqwUAIZ4EEACrBQAhogQBAJsFACGjBEAA7gQAIaQEAQDsBAAhpQQQAKsFACGmBAIApgUAIQLAAwEAAAAB0ANAAAAAAREUAACzBQAgkwMAALAFADCUAwAAPgAQlQMAALAFADCWAwQA-QQAIZ0DQAD8BAAhswNAAPwEACHAAwEA-gQAIdADQAD8BAAh0gMEAPkEACGSBBAAsQUAIZ4EEACxBQAhogQBAJ8FACGjBEAA_AQAIaQEAQD6BAAhpQQQALEFACGmBAIAsgUAIQieAxAAAAABnwMQAAAABaADEAAAAAWhAxAAAAABogMQAAAAAaMDEAAAAAGkAxAAAAABpQMQAK0FACEIngMCAAAAAZ8DAgAAAAWgAwIAAAAFoQMCAAAAAaIDAgAAAAGjAwIAAAABpAMCAAAAAaUDAgCDBQAhWxMAALcFACAVAAC4BQAgkwMAALUFADCUAwAAtQIAEJUDAAC1BQAwlgMEAPkEACHAAwEAnwUAIcEDAQCfBQAh0QNAAPwEACGoBAEAnwUAIakEAQCfBQAhqgQBAJ8FACGrBAEAnwUAIawEQACZBQAhrQQCALIFACGuBAQAlgUAIa8EAQCfBQAhsAQBAJ8FACGxBAIAsgUAIbIEAgCyBQAhswQBAJ8FACG0BAEAnwUAIbUEAgCyBQAhtgQCALIFACG3BAIAsgUAIbgEAgCyBQAhuQQCALIFACG6BAIAsgUAIbsEAgCyBQAhvAQCALIFACG9BAIAsgUAIb4EAgCyBQAhvwQQALEFACHABBAAsQUAIcEEEACxBQAhwgQQALEFACHDBBAAsQUAIcQEEACxBQAhxQQQALEFACHGBBAAsQUAIccEEACxBQAhyAQQALEFACHJBBAAsQUAIcoEEACxBQAhywQQALEFACHMBBAAsQUAIc0EEACxBQAhzgQQALEFACHPBBAAsQUAIdAEEACxBQAh0QQQALEFACHSBBAAsQUAIdMEEACxBQAh1AQQALEFACHVBBAAsQUAIdYEEACxBQAh1wQQALEFACHYBBAAsQUAIdkEEACxBQAh2gQQALEFACHbBBAAsQUAIdwEEACxBQAh3QQQALEFACHeBBAAsQUAId8EEACxBQAh4AQQALEFACHhBBAAsQUAIeIEEACxBQAh4wQQALEFACHkBBAAsQUAIeUEEACxBQAh5gQQALEFACHnBBAAsQUAIegEEACxBQAh6QQQALEFACHqBBAAsQUAIesEEACxBQAh7AQCALIFACHtBAIAsgUAIe4EAgCyBQAh7wQCALIFACHwBAIAsgUAIfEEAgCyBQAh8gQCALIFACHzBAIAsgUAIfQEAgCyBQAh9QQCALIFACH2BAIAsgUAIfcEAAC2BQAgtQUAALUCACC2BQAAtQIAIFeTAwAAtAUAMJQDAADIAgAQlQMAALQFADCWAwQA6wQAIcADAQCbBQAhwQMBAJsFACHRA0AA7gQAIagEAQCbBQAhqQQBAJsFACGqBAEAmwUAIasEAQCbBQAhrARAAIEFACGtBAIApgUAIa4EBAD_BAAhrwQBAJsFACGwBAEAmwUAIbEEAgCmBQAhsgQCAKYFACGzBAEAmwUAIbQEAQCbBQAhtQQCAKYFACG2BAIApgUAIbcEAgCmBQAhuAQCAKYFACG5BAIApgUAIboEAgCmBQAhuwQCAKYFACG8BAIApgUAIb0EAgCmBQAhvgQCAKYFACG_BBAAqwUAIcAEEACrBQAhwQQQAKsFACHCBBAAqwUAIcMEEACrBQAhxAQQAKsFACHFBBAAqwUAIcYEEACrBQAhxwQQAKsFACHIBBAAqwUAIckEEACrBQAhygQQAKsFACHLBBAAqwUAIcwEEACrBQAhzQQQAKsFACHOBBAAqwUAIc8EEACrBQAh0AQQAKsFACHRBBAAqwUAIdIEEACrBQAh0wQQAKsFACHUBBAAqwUAIdUEEACrBQAh1gQQAKsFACHXBBAAqwUAIdgEEACrBQAh2QQQAKsFACHaBBAAqwUAIdsEEACrBQAh3AQQAKsFACHdBBAAqwUAId4EEACrBQAh3wQQAKsFACHgBBAAqwUAIeEEEACrBQAh4gQQAKsFACHjBBAAqwUAIeQEEACrBQAh5QQQAKsFACHmBBAAqwUAIecEEACrBQAh6AQQAKsFACHpBBAAqwUAIeoEEACrBQAh6wQQAKsFACHsBAIApgUAIe0EAgCmBQAh7gQCAKYFACHvBAIApgUAIfAEAgCmBQAh8QQCAKYFACHyBAIApgUAIfMEAgCmBQAh9AQCAKYFACH1BAIApgUAIfYEAgCmBQAh9wQAAKcFACBZEwAAtwUAIBUAALgFACCTAwAAtQUAMJQDAAC1AgAQlQMAALUFADCWAwQA-QQAIcADAQCfBQAhwQMBAJ8FACHRA0AA_AQAIagEAQCfBQAhqQQBAJ8FACGqBAEAnwUAIasEAQCfBQAhrARAAJkFACGtBAIAsgUAIa4EBACWBQAhrwQBAJ8FACGwBAEAnwUAIbEEAgCyBQAhsgQCALIFACGzBAEAnwUAIbQEAQCfBQAhtQQCALIFACG2BAIAsgUAIbcEAgCyBQAhuAQCALIFACG5BAIAsgUAIboEAgCyBQAhuwQCALIFACG8BAIAsgUAIb0EAgCyBQAhvgQCALIFACG_BBAAsQUAIcAEEACxBQAhwQQQALEFACHCBBAAsQUAIcMEEACxBQAhxAQQALEFACHFBBAAsQUAIcYEEACxBQAhxwQQALEFACHIBBAAsQUAIckEEACxBQAhygQQALEFACHLBBAAsQUAIcwEEACxBQAhzQQQALEFACHOBBAAsQUAIc8EEACxBQAh0AQQALEFACHRBBAAsQUAIdIEEACxBQAh0wQQALEFACHUBBAAsQUAIdUEEACxBQAh1gQQALEFACHXBBAAsQUAIdgEEACxBQAh2QQQALEFACHaBBAAsQUAIdsEEACxBQAh3AQQALEFACHdBBAAsQUAId4EEACxBQAh3wQQALEFACHgBBAAsQUAIeEEEACxBQAh4gQQALEFACHjBBAAsQUAIeQEEACxBQAh5QQQALEFACHmBBAAsQUAIecEEACxBQAh6AQQALEFACHpBBAAsQUAIeoEEACxBQAh6wQQALEFACHsBAIAsgUAIe0EAgCyBQAh7gQCALIFACHvBAIAsgUAIfAEAgCyBQAh8QQCALIFACHyBAIAsgUAIfMEAgCyBQAh9AQCALIFACH1BAIAsgUAIfYEAgCyBQAh9wQAALYFACAMngOAAAAAAaEDgAAAAAGiA4AAAAABowOAAAAAAaQDgAAAAAGlA4AAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABtwOAAAAAAbgDgAAAAAG5A4AAAAABWhEAAMAFACAUAACzBQAgkwMAAOoFADCUAwAAOQAQlQMAAOoFADCWAwQA-QQAIZ0DQAD8BAAhswNAAPwEACHAAwEA-gQAIcQDAQCfBQAh0ANAAPwEACHRA0AA_AQAIdIDBAD5BAAh0wMCAPsEACHUAwIA-wQAIdUDAQCfBQAh1gMBAJ8FACHXAwEAnwUAIdgDAQCfBQAh2QNAAJkFACHaAwIAsgUAIdsDAgCyBQAh3AMBAJ8FACHdAwEAnwUAId4DAgCyBQAh3wMCALIFACHgAwIAsgUAIeEDAgCyBQAh4gMCALIFACHjAwIAsgUAIeQDAgCyBQAh5QMCALIFACHmAwEAnwUAIecDAQCfBQAh6AMCALIFACHpAwIAsgUAIeoDAgCyBQAh6wMCALIFACHsAwIAsgUAIe0DAgCyBQAh7gMCALIFACHvAwIAsgUAIfADAgCyBQAh8QMCALIFACHyAwIAsgUAIfMDAgCyBQAh9AMCALIFACH1AwIAsgUAIfYDAgCyBQAh9wMCALIFACH4AwIAsgUAIfkDAgCyBQAh-gMCALIFACH7AwIAsgUAIfwDAgCyBQAh_QMCALIFACH-AwIAsgUAIf8DAgCyBQAhgAQCALIFACGBBAIAsgUAIYIEAgCyBQAhgwQCALIFACGEBAIAsgUAIYUEAgCyBQAhhgQCALIFACGHBAIAsgUAIYgEAgCyBQAhiQQCALIFACGKBAIAsgUAIYsEAgCyBQAhjAQCALIFACGNBAIAsgUAIY4EAgCyBQAhjwQCALIFACGQBAIAsgUAIZEEAgCyBQAhkgQCALIFACGTBAIAsgUAIZQEAgCyBQAhlQQCALIFACGWBAIAsgUAIZcEAgCyBQAhmAQCALIFACGZBAIAsgUAIZoEAgCyBQAhmwQCALIFACGcBAAAtgUAIJ0EAgCyBQAhtQUAADkAILYFAAA5ACATFAAAswUAIJMDAACwBQAwlAMAAD4AEJUDAACwBQAwlgMEAPkEACGdA0AA_AQAIbMDQAD8BAAhwAMBAPoEACHQA0AA_AQAIdIDBAD5BAAhkgQQALEFACGeBBAAsQUAIaIEAQCfBQAhowRAAPwEACGkBAEA-gQAIaUEEACxBQAhpgQCALIFACG1BQAAPgAgtgUAAD4AIA-TAwAAuQUAMJQDAACvAgAQlQMAALkFADCWAwQA6wQAIZ0DQADuBAAhqgMBAOwEACGrAwQA6wQAIa0DAQCbBQAhswNAAO4EACH4BAEAmwUAIfkEAQDsBAAh-gQgALoFACH7BEAAgQUAIfwEBAD_BAAh_QRAAIEFACEFCAAA8AQAIC8AALwFACAwAAC8BQAgngMgAAAAAaUDIAC7BQAhBQgAAPAEACAvAAC8BQAgMAAAvAUAIJ4DIAAAAAGlAyAAuwUAIQKeAyAAAAABpQMgALwFACEJkwMAAL0FADCUAwAAlwIAEJUDAAC9BQAwlgMEAOsEACGdA0AA7gQAIa0DIAC6BQAhswNAAO4EACH-BAEA7AQAIf8EQADuBAAhChEAAMAFACCTAwAAvgUAMJQDAABAABCVAwAAvgUAMJYDBAD5BAAhnQNAAPwEACGtAyAAvwUAIbMDQAD8BAAh_gQBAPoEACH_BEAA_AQAIQKeAyAAAAABpQMgALwFACERDAAA8QUAIBIAAO4FACAWAADvBQAgFwAA8AUAIJMDAADtBQAwlAMAADEAEJUDAADtBQAwlgMEAPkEACGdA0AA_AQAIaoDAQD6BAAhqwMEAJYFACGzA0AA_AQAIf0EQACZBQAhgAUEAPkEACGBBSAAvwUAIbUFAAAxACC2BQAAMQAgC5MDAADBBQAwlAMAAP8BABCVAwAAwQUAMJYDBADrBAAhnQNAAO4EACGqAwEA7AQAIasDBAD_BAAhswNAAO4EACH9BEAAgQUAIYAFBADrBAAhgQUgALoFACEMkwMAAMIFADCUAwAA6QEAEJUDAADCBQAwlgMEAOsEACGdA0AA7gQAIYIFAQDsBAAhgwUBAOwEACGEBQEA7AQAIYUFAgDtBAAhhgUCAO0EACGHBQEAmwUAIYgFAQCbBQAhDJMDAADDBQAwlAMAANYBABCVAwAAwwUAMJYDBAD5BAAhnQNAAPwEACGCBQEA-gQAIYMFAQD6BAAhhAUBAPoEACGFBQIA-wQAIYYFAgD7BAAhhwUBAJ8FACGIBQEAnwUAIRGTAwAAxAUAMJQDAADQAQAQlQMAAMQFADCWAwQA6wQAIZ0DQADuBAAhswNAAO4EACGDBQEA7AQAIYQFAQDsBAAhhQUCAO0EACGGBQIA7QQAIYcFAQCbBQAhiAUBAJsFACGJBQEA7AQAIYoFAQDsBAAhiwUBAOwEACGMBQEA7AQAIY0FAQCbBQAhEZMDAADFBQAwlAMAAL0BABCVAwAAxQUAMJYDBAD5BAAhnQNAAPwEACGzA0AA_AQAIYMFAQD6BAAhhAUBAPoEACGFBQIA-wQAIYYFAgD7BAAhhwUBAJ8FACGIBQEAnwUAIYkFAQD6BAAhigUBAPoEACGLBQEA-gQAIYwFAQD6BAAhjQUBAJ8FACECiQUBAAAAAYsFAQAAAAEMkwMAAMcFADCUAwAAtwEAEJUDAADHBQAwlgMEAOsEACGdA0AA7gQAIa0DAADKBZUFIrMDQADuBAAhiQUAAMkFkwUjjwUEAOsEACGRBQAAyAWRBSKTBQAAiwUAIJUFBAD_BAAhBwgAAPAEACAvAADQBQAgMAAA0AUAIJ4DAAAAkQUCnwMAAACRBQigAwAAAJEFCKUDAADPBZEFIgcIAACDBQAgLwAAzgUAIDAAAM4FACCeAwAAAJMFA58DAAAAkwUJoAMAAACTBQmlAwAAzQWTBSMHCAAA8AQAIC8AAMwFACAwAADMBQAgngMAAACVBQKfAwAAAJUFCKADAAAAlQUIpQMAAMsFlQUiBwgAAPAEACAvAADMBQAgMAAAzAUAIJ4DAAAAlQUCnwMAAACVBQigAwAAAJUFCKUDAADLBZUFIgSeAwAAAJUFAp8DAAAAlQUIoAMAAACVBQilAwAAzAWVBSIHCAAAgwUAIC8AAM4FACAwAADOBQAgngMAAACTBQOfAwAAAJMFCaADAAAAkwUJpQMAAM0FkwUjBJ4DAAAAkwUDnwMAAACTBQmgAwAAAJMFCaUDAADOBZMFIwcIAADwBAAgLwAA0AUAIDAAANAFACCeAwAAAJEFAp8DAAAAkQUIoAMAAACRBQilAwAAzwWRBSIEngMAAACRBQKfAwAAAJEFCKADAAAAkQUIpQMAANAFkQUiCpMDAADRBQAwlAMAAKEBABCVAwAA0QUAMJYDBADrBAAhnQNAAO4EACGzA0AA7gQAIYkFAADSBZMFIo8FBADrBAAhlgUAAIsFACCXBQQA_wQAIQcIAADwBAAgLwAA1AUAIDAAANQFACCeAwAAAJMFAp8DAAAAkwUIoAMAAACTBQilAwAA0wWTBSIHCAAA8AQAIC8AANQFACAwAADUBQAgngMAAACTBQKfAwAAAJMFCKADAAAAkwUIpQMAANMFkwUiBJ4DAAAAkwUCnwMAAACTBQigAwAAAJMFCKUDAADUBZMFIgyTAwAA1QUAMJQDAACLAQAQlQMAANUFADCWAwQA6wQAIZ0DQADuBAAhqgMBAOwEACGrAwQA6wQAIbMDQADuBAAh-AQBAJsFACH5BAEA7AQAIfsEQACBBQAh_QRAAIEFACETkwMAANYFADCUAwAAdQAQlQMAANYFADCWAwQA6wQAIZ0DQADuBAAhswNAAO4EACH4BAEA7AQAIfkEAQDsBAAh_QRAAIEFACGYBUAAgQUAIZkFQACBBQAhmgUIAKMFACGbBQgAowUAIZwFAQCbBQAhnQUBAJsFACGeBQEAmwUAIZ8FAQCbBQAhoAUBAJsFACGhBQEA7AQAIRSTAwAA1wUAMJQDAABfABCVAwAA1wUAMJYDBADrBAAhnQNAAO4EACGtAwAA2gWqBSKzA0AA7gQAIf0EQACBBQAhgQUgALoFACGfBQEAmwUAIaIFAQDsBAAhowUBAJsFACGkBQEA7AQAIaYFAADYBaYFIqgFAADZBagFIqoFBAD_BAAhqwUBAJsFACGsBQEAmwUAIa0FQACBBQAhrgVAAIEFACEHCAAA8AQAIC8AAOAFACAwAADgBQAgngMAAACmBQKfAwAAAKYFCKADAAAApgUIpQMAAN8FpgUiBwgAAPAEACAvAADeBQAgMAAA3gUAIJ4DAAAAqAUCnwMAAACoBQigAwAAAKgFCKUDAADdBagFIgcIAADwBAAgLwAA3AUAIDAAANwFACCeAwAAAKoFAp8DAAAAqgUIoAMAAACqBQilAwAA2wWqBSIHCAAA8AQAIC8AANwFACAwAADcBQAgngMAAACqBQKfAwAAAKoFCKADAAAAqgUIpQMAANsFqgUiBJ4DAAAAqgUCnwMAAACqBQigAwAAAKoFCKUDAADcBaoFIgcIAADwBAAgLwAA3gUAIDAAAN4FACCeAwAAAKgFAp8DAAAAqAUIoAMAAACoBQilAwAA3QWoBSIEngMAAACoBQKfAwAAAKgFCKADAAAAqAUIpQMAAN4FqAUiBwgAAPAEACAvAADgBQAgMAAA4AUAIJ4DAAAApgUCnwMAAACmBQigAwAAAKYFCKUDAADfBaYFIgSeAwAAAKYFAp8DAAAApgUIoAMAAACmBQilAwAA4AWmBSIYEAAA5QUAIBgAAOYFACAZAADnBQAgGgAA6AUAIJMDAADhBQAwlAMAAEQAEJUDAADhBQAwlgMEAPkEACGdA0AA_AQAIa0DAADkBaoFIrMDQAD8BAAh_QRAAJkFACGBBSAAvwUAIZ8FAQCfBQAhogUBAPoEACGjBQEAnwUAIaQFAQD6BAAhpgUAAOIFpgUiqAUAAOMFqAUiqgUEAJYFACGrBQEAnwUAIawFAQCfBQAhrQVAAJkFACGuBUAAmQUAIQSeAwAAAKYFAp8DAAAApgUIoAMAAACmBQilAwAA4AWmBSIEngMAAACoBQKfAwAAAKgFCKADAAAAqAUIpQMAAN4FqAUiBJ4DAAAAqgUCnwMAAACqBQigAwAAAKoFCKUDAADcBaoFIgOvBQAAAwAgsAUAAAMAILEFAAADACADrwUAADEAILAFAAAxACCxBQAAMQAgGhAAAOUFACAYAADmBQAgGQAA5wUAIBoAAOgFACCTAwAA4QUAMJQDAABEABCVAwAA4QUAMJYDBAD5BAAhnQNAAPwEACGtAwAA5AWqBSKzA0AA_AQAIf0EQACZBQAhgQUgAL8FACGfBQEAnwUAIaIFAQD6BAAhowUBAJ8FACGkBQEA-gQAIaYFAADiBaYFIqgFAADjBagFIqoFBACWBQAhqwUBAJ8FACGsBQEAnwUAIa0FQACZBQAhrgVAAJkFACG1BQAARAAgtgUAAEQAIAOvBQAARAAgsAUAAEQAILEFAABEACADwAMBAAAAAdADQAAAAAHRA0AAAAABWBEAAMAFACAUAACzBQAgkwMAAOoFADCUAwAAOQAQlQMAAOoFADCWAwQA-QQAIZ0DQAD8BAAhswNAAPwEACHAAwEA-gQAIcQDAQCfBQAh0ANAAPwEACHRA0AA_AQAIdIDBAD5BAAh0wMCAPsEACHUAwIA-wQAIdUDAQCfBQAh1gMBAJ8FACHXAwEAnwUAIdgDAQCfBQAh2QNAAJkFACHaAwIAsgUAIdsDAgCyBQAh3AMBAJ8FACHdAwEAnwUAId4DAgCyBQAh3wMCALIFACHgAwIAsgUAIeEDAgCyBQAh4gMCALIFACHjAwIAsgUAIeQDAgCyBQAh5QMCALIFACHmAwEAnwUAIecDAQCfBQAh6AMCALIFACHpAwIAsgUAIeoDAgCyBQAh6wMCALIFACHsAwIAsgUAIe0DAgCyBQAh7gMCALIFACHvAwIAsgUAIfADAgCyBQAh8QMCALIFACHyAwIAsgUAIfMDAgCyBQAh9AMCALIFACH1AwIAsgUAIfYDAgCyBQAh9wMCALIFACH4AwIAsgUAIfkDAgCyBQAh-gMCALIFACH7AwIAsgUAIfwDAgCyBQAh_QMCALIFACH-AwIAsgUAIf8DAgCyBQAhgAQCALIFACGBBAIAsgUAIYIEAgCyBQAhgwQCALIFACGEBAIAsgUAIYUEAgCyBQAhhgQCALIFACGHBAIAsgUAIYgEAgCyBQAhiQQCALIFACGKBAIAsgUAIYsEAgCyBQAhjAQCALIFACGNBAIAsgUAIY4EAgCyBQAhjwQCALIFACGQBAIAsgUAIZEEAgCyBQAhkgQCALIFACGTBAIAsgUAIZQEAgCyBQAhlQQCALIFACGWBAIAsgUAIZcEAgCyBQAhmAQCALIFACGZBAIAsgUAIZoEAgCyBQAhmwQCALIFACGcBAAAtgUAIJ0EAgCyBQAhAsADAQAAAAHQA0AAAAABDREAAMAFACCTAwAA7AUAMJQDAAA1ABCVAwAA7AUAMJYDBAD5BAAhnQNAAPwEACGzA0AA_AQAIcADAQD6BAAh0ANAAPwEACGeBBAAsQUAIZ8EEACxBQAhoAQQALEFACGhBAIAsgUAIQ8MAADxBQAgEgAA7gUAIBYAAO8FACAXAADwBQAgkwMAAO0FADCUAwAAMQAQlQMAAO0FADCWAwQA-QQAIZ0DQAD8BAAhqgMBAPoEACGrAwQAlgUAIbMDQAD8BAAh_QRAAJkFACGABQQA-QQAIYEFIAC_BQAhA68FAAA1ACCwBQAANQAgsQUAADUAIAOvBQAAOQAgsAUAADkAILEFAAA5ACAMEQAAwAUAIJMDAAC-BQAwlAMAAEAAEJUDAAC-BQAwlgMEAPkEACGdA0AA_AQAIa0DIAC_BQAhswNAAPwEACH-BAEA-gQAIf8EQAD8BAAhtQUAAEAAILYFAABAACAaEAAA5QUAIBgAAOYFACAZAADnBQAgGgAA6AUAIJMDAADhBQAwlAMAAEQAEJUDAADhBQAwlgMEAPkEACGdA0AA_AQAIa0DAADkBaoFIrMDQAD8BAAh_QRAAJkFACGBBSAAvwUAIZ8FAQCfBQAhogUBAPoEACGjBQEAnwUAIaQFAQD6BAAhpgUAAOIFpgUiqAUAAOMFqAUiqgUEAJYFACGrBQEAnwUAIawFAQCfBQAhrQVAAJkFACGuBUAAmQUAIbUFAABEACC2BQAARAAgDwQAAPQFACCTAwAA8gUAMJQDAAAnABCVAwAA8gUAMJYDBAD5BAAhmQMCAPsEACGaAwIA-wQAIZsDAQD6BAAhnAMBAPoEACGdA0AA_AQAIaoDAQD6BAAhqwMEAJYFACGtAwAA8wWtAyKuA0AAmQUAIa8DQACZBQAhBJ4DAAAArQMCnwMAAACtAwigAwAAAK0DCKUDAACGBa0DIhwDAAD6BQAgCgAAiAYAIAsAAIkGACAMAADxBQAgDQAAigYAIA4AAIsGACAPAACMBgAgkwMAAIcGADCUAwAAAwAQlQMAAIcGADCWAwQA-QQAIZ0DQAD8BAAhswNAAPwEACH4BAEA-gQAIfkEAQD6BAAh_QRAAJkFACGYBUAAmQUAIZkFQACZBQAhmgUIAPgFACGbBQgA-AUAIZwFAQCfBQAhnQUBAJ8FACGeBQEAnwUAIZ8FAQCfBQAhoAUBAJ8FACGhBQEA-gQAIbUFAAADACC2BQAAAwAgDAQAAPQFACCTAwAA9QUAMJQDAAAiABCVAwAA9QUAMJYDBAD5BAAhnQNAAPwEACGqAwEA-gQAIasDBACWBQAhsAMAAPYFACCxAwIA-wQAIbIDQAD8BAAhswNAAPwEACEMngOAAAAAAaEDgAAAAAGiA4AAAAABowOAAAAAAaQDgAAAAAGlA4AAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABtwOAAAAAAbgDgAAAAAG5A4AAAAABDwQAAJMFACCTAwAA9wUAMJQDAAAcABCVAwAA9wUAMJYDBAD5BAAhxgMIAPgFACHHAwgA-AUAIcgDCAD4BQAhyQMIAPgFACHKAwEAnwUAIcsDCAD4BQAhzAMIAPgFACHNAwQA-QQAIc4DQAD8BAAhzwNAAPwEACEIngMIAAAAAZ8DCAAAAAWgAwgAAAAFoQMIAAAAAaIDCAAAAAGjAwgAAAABpAMIAAAAAaUDCACIBQAhEAMAAPoFACAEAACTBQAgBgAA-wUAIAcAAPwFACCTAwAA-QUAMJQDAAALABCVAwAA-QUAMJYDBAD5BAAhnQNAAPwEACGqAwEA-gQAIasDBAD5BAAhswNAAPwEACH4BAEAnwUAIfkEAQD6BAAh-wRAAJkFACH9BEAAmQUAIQOvBQAABwAgsAUAAAcAILEFAAAHACADrwUAAA4AILAFAAAOACCxBQAADgAgA68FAAASACCwBQAAEgAgsQUAABIAIA0FAACBBgAgkwMAAP0FADCUAwAAEgAQlQMAAP0FADCWAwQA-QQAIZ0DQAD8BAAhrQMAAIAGlQUiswNAAPwEACGJBQAA_wWTBSOPBQQA-QQAIZEFAAD-BZEFIpMFAAD2BQAglQUEAJYFACEEngMAAACRBQKfAwAAAJEFCKADAAAAkQUIpQMAANAFkQUiBJ4DAAAAkwUDnwMAAACTBQmgAwAAAJMFCaUDAADOBZMFIwSeAwAAAJUFAp8DAAAAlQUIoAMAAACVBQilAwAAzAWVBSISAwAA-gUAIAQAAJMFACAGAAD7BQAgBwAA_AUAIJMDAAD5BQAwlAMAAAsAEJUDAAD5BQAwlgMEAPkEACGdA0AA_AQAIaoDAQD6BAAhqwMEAPkEACGzA0AA_AQAIfgEAQCfBQAh-QQBAPoEACH7BEAAmQUAIf0EQACZBQAhtQUAAAsAILYFAAALACACiQUAAACTBQKPBQQAAAABCwUAAIEGACCTAwAAgwYAMJQDAAAOABCVAwAAgwYAMJYDBAD5BAAhnQNAAPwEACGzA0AA_AQAIYkFAACEBpMFIo8FBAD5BAAhlgUAAPYFACCXBQQAlgUAIQSeAwAAAJMFAp8DAAAAkwUIoAMAAACTBQilAwAA1AWTBSIRBAAAkwUAIAkAAIYGACCTAwAAhQYAMJQDAAAHABCVAwAAhQYAMJYDBAD5BAAhnQNAAPwEACGqAwEA-gQAIasDBAD5BAAhrQMBAJ8FACGzA0AA_AQAIfgEAQCfBQAh-QQBAPoEACH6BCAAvwUAIfsEQACZBQAh_AQEAJYFACH9BEAAmQUAIRIDAAD6BQAgBAAAkwUAIAYAAPsFACAHAAD8BQAgkwMAAPkFADCUAwAACwAQlQMAAPkFADCWAwQA-QQAIZ0DQAD8BAAhqgMBAPoEACGrAwQA-QQAIbMDQAD8BAAh-AQBAJ8FACH5BAEA-gQAIfsEQACZBQAh_QRAAJkFACG1BQAACwAgtgUAAAsAIBoDAAD6BQAgCgAAiAYAIAsAAIkGACAMAADxBQAgDQAAigYAIA4AAIsGACAPAACMBgAgkwMAAIcGADCUAwAAAwAQlQMAAIcGADCWAwQA-QQAIZ0DQAD8BAAhswNAAPwEACH4BAEA-gQAIfkEAQD6BAAh_QRAAJkFACGYBUAAmQUAIZkFQACZBQAhmgUIAPgFACGbBQgA-AUAIZwFAQCfBQAhnQUBAJ8FACGeBQEAnwUAIZ8FAQCfBQAhoAUBAJ8FACGhBQEA-gQAIQOvBQAACwAgsAUAAAsAILEFAAALACADrwUAABwAILAFAAAcACCxBQAAHAAgDwQAAJMFACCTAwAAkQUAMJQDAAAgABCVAwAAkQUAMJYDBAD5BAAhqwMEAPkEACGtAwAAkgW7AyKzA0AA_AQAIbsDAgD7BAAhvAMCAPsEACG9AwIA-wQAIb4DAgD7BAAhvwMCAPsEACG1BQAAIAAgtgUAACAAIAOvBQAAIgAgsAUAACIAILEFAAAiACADrwUAACcAILAFAAAnACCxBQAAJwAgAqMFAQAAAAGmBQAAAKYFAgAAAAAABb0FBAAAAAHABQQAAAABwQUEAAAAAcIFBAAAAAHDBQQAAAABAb0FAQAAAAEFvQUCAAAAAcAFAgAAAAHBBQIAAAABwgUCAAAAAcMFAgAAAAEBvQVAAAAAAQAAAAAAAAG9BQAAAK0DAgG9BUAAAAABBb0FBAAAAAHABQQAAAABwQUEAAAAAcIFBAAAAAHDBQQAAAABBycAAPkJACAoAAD8CQAgtwUAAPoJACC4BQAA-wkAILkFAAADACC6BQAAAwAguwUAAAUAIAMnAAD5CQAgtwUAAPoJACC7BQAABQAgAAAAAAAHJwAA9AkAICgAAPcJACC3BQAA9QkAILgFAAD2CQAguQUAAAMAILoFAAADACC7BQAABQAgAycAAPQJACC3BQAA9QkAILsFAAAFACAAAAAAAAG9BQAAALsDAgUnAADvCQAgKAAA8gkAILcFAADwCQAguAUAAPEJACC7BQAABQAgAycAAO8JACC3BQAA8AkAILsFAAAFACARAwAAkwkAIAoAAJcJACALAACYCQAgDAAAjgkAIA0AAJkJACAOAACaCQAgDwAAmwkAIP0EAACXBgAgmAUAAJcGACCZBQAAlwYAIJoFAACXBgAgmwUAAJcGACCcBQAAlwYAIJ0FAACXBgAgngUAAJcGACCfBQAAlwYAIKAFAACXBgAgAAAAAAAAAAAAAAAAAAAAAb0FAQAAAAEAAAAAAAAAAAAABb0FCAAAAAHABQgAAAABwQUIAAAAAcIFCAAAAAHDBQgAAAABBScAAOoJACAoAADtCQAgtwUAAOsJACC4BQAA7AkAILsFAAAFACADJwAA6gkAILcFAADrCQAguwUAAAUAIAAAAAAABb0FAgAAAAHABQIAAAABwQUCAAAAAcIFAgAAAAHDBQIAAAABBScAAOIJACAoAADoCQAgtwUAAOMJACC4BQAA5wkAILsFAAAzACAFJwAA4AkAICgAAOUJACC3BQAA4QkAILgFAADkCQAguwUAALICACADJwAA4gkAILcFAADjCQAguwUAADMAIAMnAADgCQAgtwUAAOEJACC7BQAAsgIAIAAAAAAABb0FEAAAAAHABRAAAAABwQUQAAAAAcIFEAAAAAHDBRAAAAABBScAANsJACAoAADeCQAgtwUAANwJACC4BQAA3QkAILsFAAAzACADJwAA2wkAILcFAADcCQAguwUAADMAIAAAAAAABScAANYJACAoAADZCQAgtwUAANcJACC4BQAA2AkAILsFAACyAgAgAycAANYJACC3BQAA1wkAILsFAACyAgAgVBMAAPwGACAVAAD9BgAgwAMAAJcGACDBAwAAlwYAIKgEAACXBgAgqQQAAJcGACCqBAAAlwYAIKsEAACXBgAgrAQAAJcGACCtBAAAlwYAIK4EAACXBgAgrwQAAJcGACCwBAAAlwYAILEEAACXBgAgsgQAAJcGACCzBAAAlwYAILQEAACXBgAgtQQAAJcGACC2BAAAlwYAILcEAACXBgAguAQAAJcGACC5BAAAlwYAILoEAACXBgAguwQAAJcGACC8BAAAlwYAIL0EAACXBgAgvgQAAJcGACC_BAAAlwYAIMAEAACXBgAgwQQAAJcGACDCBAAAlwYAIMMEAACXBgAgxAQAAJcGACDFBAAAlwYAIMYEAACXBgAgxwQAAJcGACDIBAAAlwYAIMkEAACXBgAgygQAAJcGACDLBAAAlwYAIMwEAACXBgAgzQQAAJcGACDOBAAAlwYAIM8EAACXBgAg0AQAAJcGACDRBAAAlwYAINIEAACXBgAg0wQAAJcGACDUBAAAlwYAINUEAACXBgAg1gQAAJcGACDXBAAAlwYAINgEAACXBgAg2QQAAJcGACDaBAAAlwYAINsEAACXBgAg3AQAAJcGACDdBAAAlwYAIN4EAACXBgAg3wQAAJcGACDgBAAAlwYAIOEEAACXBgAg4gQAAJcGACDjBAAAlwYAIOQEAACXBgAg5QQAAJcGACDmBAAAlwYAIOcEAACXBgAg6AQAAJcGACDpBAAAlwYAIOoEAACXBgAg6wQAAJcGACDsBAAAlwYAIO0EAACXBgAg7gQAAJcGACDvBAAAlwYAIPAEAACXBgAg8QQAAJcGACDyBAAAlwYAIPMEAACXBgAg9AQAAJcGACD1BAAAlwYAIPYEAACXBgAg9wQAAJcGACAAAAAAAAcnAAD1BgAgKAAA-AYAILcFAAD2BgAguAUAAPcGACC5BQAAOQAgugUAADkAILsFAAA7ACAHJwAA8AYAICgAAPMGACC3BQAA8QYAILgFAADyBgAguQUAAD4AILoFAAA-ACC7BQAAywIAIAyWAwQAAAABnQNAAAAAAbMDQAAAAAHAAwEAAAAB0ANAAAAAAZIEEAAAAAGeBBAAAAABogQBAAAAAaMEQAAAAAGkBAEAAAABpQQQAAAAAaYEAgAAAAECAAAAywIAICcAAPAGACADAAAAPgAgJwAA8AYAICgAAPQGACAOAAAAPgAgIAAA9AYAIJYDBACTBgAhnQNAAJYGACGzA0AAlgYAIcADAQCUBgAh0ANAAJYGACGSBBAA3gYAIZ4EEADeBgAhogQBAMEGACGjBEAAlgYAIaQEAQCUBgAhpQQQAN4GACGmBAIA1AYAIQyWAwQAkwYAIZ0DQACWBgAhswNAAJYGACHAAwEAlAYAIdADQACWBgAhkgQQAN4GACGeBBAA3gYAIaIEAQDBBgAhowRAAJYGACGkBAEAlAYAIaUEEADeBgAhpgQCANQGACFTEQAA1wYAIJYDBAAAAAGdA0AAAAABswNAAAAAAcADAQAAAAHEAwEAAAAB0ANAAAAAAdEDQAAAAAHTAwIAAAAB1AMCAAAAAdUDAQAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZA0AAAAAB2gMCAAAAAdsDAgAAAAHcAwEAAAAB3QMBAAAAAd4DAgAAAAHfAwIAAAAB4AMCAAAAAeEDAgAAAAHiAwIAAAAB4wMCAAAAAeQDAgAAAAHlAwIAAAAB5gMBAAAAAecDAQAAAAHoAwIAAAAB6QMCAAAAAeoDAgAAAAHrAwIAAAAB7AMCAAAAAe0DAgAAAAHuAwIAAAAB7wMCAAAAAfADAgAAAAHxAwIAAAAB8gMCAAAAAfMDAgAAAAH0AwIAAAAB9QMCAAAAAfYDAgAAAAH3AwIAAAAB-AMCAAAAAfkDAgAAAAH6AwIAAAAB-wMCAAAAAfwDAgAAAAH9AwIAAAAB_gMCAAAAAf8DAgAAAAGABAIAAAABgQQCAAAAAYIEAgAAAAGDBAIAAAABhAQCAAAAAYUEAgAAAAGGBAIAAAABhwQCAAAAAYgEAgAAAAGJBAIAAAABigQCAAAAAYsEAgAAAAGMBAIAAAABjQQCAAAAAY4EAgAAAAGPBAIAAAABkAQCAAAAAZEEAgAAAAGSBAIAAAABkwQCAAAAAZQEAgAAAAGVBAIAAAABlgQCAAAAAZcEAgAAAAGYBAIAAAABmQQCAAAAAZoEAgAAAAGbBAIAAAABnASAAAAAAZ0EAgAAAAECAAAAOwAgJwAA9QYAIAMAAAA5ACAnAAD1BgAgKAAA-QYAIFUAAAA5ACARAADVBgAgIAAA-QYAIJYDBACTBgAhnQNAAJYGACGzA0AAlgYAIcADAQCUBgAhxAMBAMEGACHQA0AAlgYAIdEDQACWBgAh0wMCAJUGACHUAwIAlQYAIdUDAQDBBgAh1gMBAMEGACHXAwEAwQYAIdgDAQDBBgAh2QNAAJ4GACHaAwIA1AYAIdsDAgDUBgAh3AMBAMEGACHdAwEAwQYAId4DAgDUBgAh3wMCANQGACHgAwIA1AYAIeEDAgDUBgAh4gMCANQGACHjAwIA1AYAIeQDAgDUBgAh5QMCANQGACHmAwEAwQYAIecDAQDBBgAh6AMCANQGACHpAwIA1AYAIeoDAgDUBgAh6wMCANQGACHsAwIA1AYAIe0DAgDUBgAh7gMCANQGACHvAwIA1AYAIfADAgDUBgAh8QMCANQGACHyAwIA1AYAIfMDAgDUBgAh9AMCANQGACH1AwIA1AYAIfYDAgDUBgAh9wMCANQGACH4AwIA1AYAIfkDAgDUBgAh-gMCANQGACH7AwIA1AYAIfwDAgDUBgAh_QMCANQGACH-AwIA1AYAIf8DAgDUBgAhgAQCANQGACGBBAIA1AYAIYIEAgDUBgAhgwQCANQGACGEBAIA1AYAIYUEAgDUBgAhhgQCANQGACGHBAIA1AYAIYgEAgDUBgAhiQQCANQGACGKBAIA1AYAIYsEAgDUBgAhjAQCANQGACGNBAIA1AYAIY4EAgDUBgAhjwQCANQGACGQBAIA1AYAIZEEAgDUBgAhkgQCANQGACGTBAIA1AYAIZQEAgDUBgAhlQQCANQGACGWBAIA1AYAIZcEAgDUBgAhmAQCANQGACGZBAIA1AYAIZoEAgDUBgAhmwQCANQGACGcBIAAAAABnQQCANQGACFTEQAA1QYAIJYDBACTBgAhnQNAAJYGACGzA0AAlgYAIcADAQCUBgAhxAMBAMEGACHQA0AAlgYAIdEDQACWBgAh0wMCAJUGACHUAwIAlQYAIdUDAQDBBgAh1gMBAMEGACHXAwEAwQYAIdgDAQDBBgAh2QNAAJ4GACHaAwIA1AYAIdsDAgDUBgAh3AMBAMEGACHdAwEAwQYAId4DAgDUBgAh3wMCANQGACHgAwIA1AYAIeEDAgDUBgAh4gMCANQGACHjAwIA1AYAIeQDAgDUBgAh5QMCANQGACHmAwEAwQYAIecDAQDBBgAh6AMCANQGACHpAwIA1AYAIeoDAgDUBgAh6wMCANQGACHsAwIA1AYAIe0DAgDUBgAh7gMCANQGACHvAwIA1AYAIfADAgDUBgAh8QMCANQGACHyAwIA1AYAIfMDAgDUBgAh9AMCANQGACH1AwIA1AYAIfYDAgDUBgAh9wMCANQGACH4AwIA1AYAIfkDAgDUBgAh-gMCANQGACH7AwIA1AYAIfwDAgDUBgAh_QMCANQGACH-AwIA1AYAIf8DAgDUBgAhgAQCANQGACGBBAIA1AYAIYIEAgDUBgAhgwQCANQGACGEBAIA1AYAIYUEAgDUBgAhhgQCANQGACGHBAIA1AYAIYgEAgDUBgAhiQQCANQGACGKBAIA1AYAIYsEAgDUBgAhjAQCANQGACGNBAIA1AYAIY4EAgDUBgAhjwQCANQGACGQBAIA1AYAIZEEAgDUBgAhkgQCANQGACGTBAIA1AYAIZQEAgDUBgAhlQQCANQGACGWBAIA1AYAIZcEAgDUBgAhmAQCANQGACGZBAIA1AYAIZoEAgDUBgAhmwQCANQGACGcBIAAAAABnQQCANQGACEDJwAA9QYAILcFAAD2BgAguwUAADsAIAMnAADwBgAgtwUAAPEGACC7BQAAywIAIEwRAACPBwAgFAAA6AYAIMQDAACXBgAg1QMAAJcGACDWAwAAlwYAINcDAACXBgAg2AMAAJcGACDZAwAAlwYAINoDAACXBgAg2wMAAJcGACDcAwAAlwYAIN0DAACXBgAg3gMAAJcGACDfAwAAlwYAIOADAACXBgAg4QMAAJcGACDiAwAAlwYAIOMDAACXBgAg5AMAAJcGACDlAwAAlwYAIOYDAACXBgAg5wMAAJcGACDoAwAAlwYAIOkDAACXBgAg6gMAAJcGACDrAwAAlwYAIOwDAACXBgAg7QMAAJcGACDuAwAAlwYAIO8DAACXBgAg8AMAAJcGACDxAwAAlwYAIPIDAACXBgAg8wMAAJcGACD0AwAAlwYAIPUDAACXBgAg9gMAAJcGACD3AwAAlwYAIPgDAACXBgAg-QMAAJcGACD6AwAAlwYAIPsDAACXBgAg_AMAAJcGACD9AwAAlwYAIP4DAACXBgAg_wMAAJcGACCABAAAlwYAIIEEAACXBgAgggQAAJcGACCDBAAAlwYAIIQEAACXBgAghQQAAJcGACCGBAAAlwYAIIcEAACXBgAgiAQAAJcGACCJBAAAlwYAIIoEAACXBgAgiwQAAJcGACCMBAAAlwYAII0EAACXBgAgjgQAAJcGACCPBAAAlwYAIJAEAACXBgAgkQQAAJcGACCSBAAAlwYAIJMEAACXBgAglAQAAJcGACCVBAAAlwYAIJYEAACXBgAglwQAAJcGACCYBAAAlwYAIJkEAACXBgAgmgQAAJcGACCbBAAAlwYAIJwEAACXBgAgnQQAAJcGACAGFAAA6AYAIJIEAACXBgAgngQAAJcGACCiBAAAlwYAIKUEAACXBgAgpgQAAJcGACAAAAAAAAG9BSAAAAABBycAAM4JACAoAADUCQAgtwUAAM8JACC4BQAA0wkAILkFAAALACC6BQAACwAguwUAABoAIAUnAADMCQAgKAAA0QkAILcFAADNCQAguAUAANAJACC7BQAABQAgAycAAM4JACC3BQAAzwkAILsFAAAaACADJwAAzAkAILcFAADNCQAguwUAAAUAIAAAAAAABScAAMcJACAoAADKCQAgtwUAAMgJACC4BQAAyQkAILsFAAAzACADJwAAxwkAILcFAADICQAguwUAADMAIAYMAACOCQAgEgAAkAkAIBYAAJEJACAXAACSCQAgqwMAAJcGACD9BAAAlwYAIAAAAAAACycAAKoHADAoAACvBwAwtwUAAKsHADC4BQAArAcAMLkFAACuBwAwugUAAK4HADC7BQAArgcAMLwFAACtBwAgvQUAAK4HADC-BQAAsAcAML8FAACxBwAwCycAAJ4HADAoAACjBwAwtwUAAJ8HADC4BQAAoAcAMLkFAACiBwAwugUAAKIHADC7BQAAogcAMLwFAAChBwAgvQUAAKIHADC-BQAApAcAML8FAAClBwAwBycAAJkHACAoAACcBwAgtwUAAJoHACC4BQAAmwcAILkFAABAACC6BQAAQAAguwUAAIICACAFJwAAwAkAICgAAMUJACC3BQAAwQkAILgFAADECQAguwUAAAEAIAWWAwQAAAABnQNAAAAAAa0DIAAAAAGzA0AAAAAB_wRAAAAAAQIAAACCAgAgJwAAmQcAIAMAAABAACAnAACZBwAgKAAAnQcAIAcAAABAACAgAACdBwAglgMEAJMGACGdA0AAlgYAIa0DIACDBwAhswNAAJYGACH_BEAAlgYAIQWWAwQAkwYAIZ0DQACWBgAhrQMgAIMHACGzA0AAlgYAIf8EQACWBgAhUxQAANgGACCWAwQAAAABnQNAAAAAAbMDQAAAAAHEAwEAAAAB0ANAAAAAAdEDQAAAAAHSAwQAAAAB0wMCAAAAAdQDAgAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QNAAAAAAdoDAgAAAAHbAwIAAAAB3AMBAAAAAd0DAQAAAAHeAwIAAAAB3wMCAAAAAeADAgAAAAHhAwIAAAAB4gMCAAAAAeMDAgAAAAHkAwIAAAAB5QMCAAAAAeYDAQAAAAHnAwEAAAAB6AMCAAAAAekDAgAAAAHqAwIAAAAB6wMCAAAAAewDAgAAAAHtAwIAAAAB7gMCAAAAAe8DAgAAAAHwAwIAAAAB8QMCAAAAAfIDAgAAAAHzAwIAAAAB9AMCAAAAAfUDAgAAAAH2AwIAAAAB9wMCAAAAAfgDAgAAAAH5AwIAAAAB-gMCAAAAAfsDAgAAAAH8AwIAAAAB_QMCAAAAAf4DAgAAAAH_AwIAAAABgAQCAAAAAYEEAgAAAAGCBAIAAAABgwQCAAAAAYQEAgAAAAGFBAIAAAABhgQCAAAAAYcEAgAAAAGIBAIAAAABiQQCAAAAAYoEAgAAAAGLBAIAAAABjAQCAAAAAY0EAgAAAAGOBAIAAAABjwQCAAAAAZAEAgAAAAGRBAIAAAABkgQCAAAAAZMEAgAAAAGUBAIAAAABlQQCAAAAAZYEAgAAAAGXBAIAAAABmAQCAAAAAZkEAgAAAAGaBAIAAAABmwQCAAAAAZwEgAAAAAGdBAIAAAABAgAAADsAICcAAKkHACADAAAAOwAgJwAAqQcAICgAAKgHACABIAAAwwkAMFkRAADABQAgFAAAswUAIJMDAADqBQAwlAMAADkAEJUDAADqBQAwlgMEAAAAAZ0DQAD8BAAhswNAAPwEACHAAwEA-gQAIcQDAQCfBQAh0ANAAPwEACHRA0AA_AQAIdIDBAAAAAHTAwIA-wQAIdQDAgD7BAAh1QMBAJ8FACHWAwEAnwUAIdcDAQCfBQAh2AMBAJ8FACHZA0AAmQUAIdoDAgCyBQAh2wMCALIFACHcAwEAnwUAId0DAQCfBQAh3gMCALIFACHfAwIAsgUAIeADAgCyBQAh4QMCALIFACHiAwIAsgUAIeMDAgCyBQAh5AMCALIFACHlAwIAsgUAIeYDAQCfBQAh5wMBAJ8FACHoAwIAsgUAIekDAgCyBQAh6gMCALIFACHrAwIAsgUAIewDAgCyBQAh7QMCALIFACHuAwIAsgUAIe8DAgCyBQAh8AMCALIFACHxAwIAsgUAIfIDAgCyBQAh8wMCALIFACH0AwIAsgUAIfUDAgCyBQAh9gMCALIFACH3AwIAsgUAIfgDAgCyBQAh-QMCALIFACH6AwIAsgUAIfsDAgCyBQAh_AMCALIFACH9AwIAsgUAIf4DAgCyBQAh_wMCALIFACGABAIAsgUAIYEEAgCyBQAhggQCALIFACGDBAIAsgUAIYQEAgCyBQAhhQQCALIFACGGBAIAsgUAIYcEAgCyBQAhiAQCALIFACGJBAIAsgUAIYoEAgCyBQAhiwQCALIFACGMBAIAsgUAIY0EAgCyBQAhjgQCALIFACGPBAIAsgUAIZAEAgCyBQAhkQQCALIFACGSBAIAsgUAIZMEAgCyBQAhlAQCALIFACGVBAIAsgUAIZYEAgCyBQAhlwQCALIFACGYBAIAsgUAIZkEAgCyBQAhmgQCALIFACGbBAIAsgUAIZwEAAC2BQAgnQQCALIFACGyBQAA6QUAIAIAAAA7ACAgAACoBwAgAgAAAKYHACAgAACnBwAgVpMDAAClBwAwlAMAAKYHABCVAwAApQcAMJYDBAD5BAAhnQNAAPwEACGzA0AA_AQAIcADAQD6BAAhxAMBAJ8FACHQA0AA_AQAIdEDQAD8BAAh0gMEAPkEACHTAwIA-wQAIdQDAgD7BAAh1QMBAJ8FACHWAwEAnwUAIdcDAQCfBQAh2AMBAJ8FACHZA0AAmQUAIdoDAgCyBQAh2wMCALIFACHcAwEAnwUAId0DAQCfBQAh3gMCALIFACHfAwIAsgUAIeADAgCyBQAh4QMCALIFACHiAwIAsgUAIeMDAgCyBQAh5AMCALIFACHlAwIAsgUAIeYDAQCfBQAh5wMBAJ8FACHoAwIAsgUAIekDAgCyBQAh6gMCALIFACHrAwIAsgUAIewDAgCyBQAh7QMCALIFACHuAwIAsgUAIe8DAgCyBQAh8AMCALIFACHxAwIAsgUAIfIDAgCyBQAh8wMCALIFACH0AwIAsgUAIfUDAgCyBQAh9gMCALIFACH3AwIAsgUAIfgDAgCyBQAh-QMCALIFACH6AwIAsgUAIfsDAgCyBQAh_AMCALIFACH9AwIAsgUAIf4DAgCyBQAh_wMCALIFACGABAIAsgUAIYEEAgCyBQAhggQCALIFACGDBAIAsgUAIYQEAgCyBQAhhQQCALIFACGGBAIAsgUAIYcEAgCyBQAhiAQCALIFACGJBAIAsgUAIYoEAgCyBQAhiwQCALIFACGMBAIAsgUAIY0EAgCyBQAhjgQCALIFACGPBAIAsgUAIZAEAgCyBQAhkQQCALIFACGSBAIAsgUAIZMEAgCyBQAhlAQCALIFACGVBAIAsgUAIZYEAgCyBQAhlwQCALIFACGYBAIAsgUAIZkEAgCyBQAhmgQCALIFACGbBAIAsgUAIZwEAAC2BQAgnQQCALIFACFWkwMAAKUHADCUAwAApgcAEJUDAAClBwAwlgMEAPkEACGdA0AA_AQAIbMDQAD8BAAhwAMBAPoEACHEAwEAnwUAIdADQAD8BAAh0QNAAPwEACHSAwQA-QQAIdMDAgD7BAAh1AMCAPsEACHVAwEAnwUAIdYDAQCfBQAh1wMBAJ8FACHYAwEAnwUAIdkDQACZBQAh2gMCALIFACHbAwIAsgUAIdwDAQCfBQAh3QMBAJ8FACHeAwIAsgUAId8DAgCyBQAh4AMCALIFACHhAwIAsgUAIeIDAgCyBQAh4wMCALIFACHkAwIAsgUAIeUDAgCyBQAh5gMBAJ8FACHnAwEAnwUAIegDAgCyBQAh6QMCALIFACHqAwIAsgUAIesDAgCyBQAh7AMCALIFACHtAwIAsgUAIe4DAgCyBQAh7wMCALIFACHwAwIAsgUAIfEDAgCyBQAh8gMCALIFACHzAwIAsgUAIfQDAgCyBQAh9QMCALIFACH2AwIAsgUAIfcDAgCyBQAh-AMCALIFACH5AwIAsgUAIfoDAgCyBQAh-wMCALIFACH8AwIAsgUAIf0DAgCyBQAh_gMCALIFACH_AwIAsgUAIYAEAgCyBQAhgQQCALIFACGCBAIAsgUAIYMEAgCyBQAhhAQCALIFACGFBAIAsgUAIYYEAgCyBQAhhwQCALIFACGIBAIAsgUAIYkEAgCyBQAhigQCALIFACGLBAIAsgUAIYwEAgCyBQAhjQQCALIFACGOBAIAsgUAIY8EAgCyBQAhkAQCALIFACGRBAIAsgUAIZIEAgCyBQAhkwQCALIFACGUBAIAsgUAIZUEAgCyBQAhlgQCALIFACGXBAIAsgUAIZgEAgCyBQAhmQQCALIFACGaBAIAsgUAIZsEAgCyBQAhnAQAALYFACCdBAIAsgUAIVKWAwQAkwYAIZ0DQACWBgAhswNAAJYGACHEAwEAwQYAIdADQACWBgAh0QNAAJYGACHSAwQAkwYAIdMDAgCVBgAh1AMCAJUGACHVAwEAwQYAIdYDAQDBBgAh1wMBAMEGACHYAwEAwQYAIdkDQACeBgAh2gMCANQGACHbAwIA1AYAIdwDAQDBBgAh3QMBAMEGACHeAwIA1AYAId8DAgDUBgAh4AMCANQGACHhAwIA1AYAIeIDAgDUBgAh4wMCANQGACHkAwIA1AYAIeUDAgDUBgAh5gMBAMEGACHnAwEAwQYAIegDAgDUBgAh6QMCANQGACHqAwIA1AYAIesDAgDUBgAh7AMCANQGACHtAwIA1AYAIe4DAgDUBgAh7wMCANQGACHwAwIA1AYAIfEDAgDUBgAh8gMCANQGACHzAwIA1AYAIfQDAgDUBgAh9QMCANQGACH2AwIA1AYAIfcDAgDUBgAh-AMCANQGACH5AwIA1AYAIfoDAgDUBgAh-wMCANQGACH8AwIA1AYAIf0DAgDUBgAh_gMCANQGACH_AwIA1AYAIYAEAgDUBgAhgQQCANQGACGCBAIA1AYAIYMEAgDUBgAhhAQCANQGACGFBAIA1AYAIYYEAgDUBgAhhwQCANQGACGIBAIA1AYAIYkEAgDUBgAhigQCANQGACGLBAIA1AYAIYwEAgDUBgAhjQQCANQGACGOBAIA1AYAIY8EAgDUBgAhkAQCANQGACGRBAIA1AYAIZIEAgDUBgAhkwQCANQGACGUBAIA1AYAIZUEAgDUBgAhlgQCANQGACGXBAIA1AYAIZgEAgDUBgAhmQQCANQGACGaBAIA1AYAIZsEAgDUBgAhnASAAAAAAZ0EAgDUBgAhUxQAANYGACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACHEAwEAwQYAIdADQACWBgAh0QNAAJYGACHSAwQAkwYAIdMDAgCVBgAh1AMCAJUGACHVAwEAwQYAIdYDAQDBBgAh1wMBAMEGACHYAwEAwQYAIdkDQACeBgAh2gMCANQGACHbAwIA1AYAIdwDAQDBBgAh3QMBAMEGACHeAwIA1AYAId8DAgDUBgAh4AMCANQGACHhAwIA1AYAIeIDAgDUBgAh4wMCANQGACHkAwIA1AYAIeUDAgDUBgAh5gMBAMEGACHnAwEAwQYAIegDAgDUBgAh6QMCANQGACHqAwIA1AYAIesDAgDUBgAh7AMCANQGACHtAwIA1AYAIe4DAgDUBgAh7wMCANQGACHwAwIA1AYAIfEDAgDUBgAh8gMCANQGACHzAwIA1AYAIfQDAgDUBgAh9QMCANQGACH2AwIA1AYAIfcDAgDUBgAh-AMCANQGACH5AwIA1AYAIfoDAgDUBgAh-wMCANQGACH8AwIA1AYAIf0DAgDUBgAh_gMCANQGACH_AwIA1AYAIYAEAgDUBgAhgQQCANQGACGCBAIA1AYAIYMEAgDUBgAhhAQCANQGACGFBAIA1AYAIYYEAgDUBgAhhwQCANQGACGIBAIA1AYAIYkEAgDUBgAhigQCANQGACGLBAIA1AYAIYwEAgDUBgAhjQQCANQGACGOBAIA1AYAIY8EAgDUBgAhkAQCANQGACGRBAIA1AYAIZIEAgDUBgAhkwQCANQGACGUBAIA1AYAIZUEAgDUBgAhlgQCANQGACGXBAIA1AYAIZgEAgDUBgAhmQQCANQGACGaBAIA1AYAIZsEAgDUBgAhnASAAAAAAZ0EAgDUBgAhUxQAANgGACCWAwQAAAABnQNAAAAAAbMDQAAAAAHEAwEAAAAB0ANAAAAAAdEDQAAAAAHSAwQAAAAB0wMCAAAAAdQDAgAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QNAAAAAAdoDAgAAAAHbAwIAAAAB3AMBAAAAAd0DAQAAAAHeAwIAAAAB3wMCAAAAAeADAgAAAAHhAwIAAAAB4gMCAAAAAeMDAgAAAAHkAwIAAAAB5QMCAAAAAeYDAQAAAAHnAwEAAAAB6AMCAAAAAekDAgAAAAHqAwIAAAAB6wMCAAAAAewDAgAAAAHtAwIAAAAB7gMCAAAAAe8DAgAAAAHwAwIAAAAB8QMCAAAAAfIDAgAAAAHzAwIAAAAB9AMCAAAAAfUDAgAAAAH2AwIAAAAB9wMCAAAAAfgDAgAAAAH5AwIAAAAB-gMCAAAAAfsDAgAAAAH8AwIAAAAB_QMCAAAAAf4DAgAAAAH_AwIAAAABgAQCAAAAAYEEAgAAAAGCBAIAAAABgwQCAAAAAYQEAgAAAAGFBAIAAAABhgQCAAAAAYcEAgAAAAGIBAIAAAABiQQCAAAAAYoEAgAAAAGLBAIAAAABjAQCAAAAAY0EAgAAAAGOBAIAAAABjwQCAAAAAZAEAgAAAAGRBAIAAAABkgQCAAAAAZMEAgAAAAGUBAIAAAABlQQCAAAAAZYEAgAAAAGXBAIAAAABmAQCAAAAAZkEAgAAAAGaBAIAAAABmwQCAAAAAZwEgAAAAAGdBAIAAAABCJYDBAAAAAGdA0AAAAABswNAAAAAAdADQAAAAAGeBBAAAAABnwQQAAAAAaAEEAAAAAGhBAIAAAABAgAAADcAICcAALUHACADAAAANwAgJwAAtQcAICgAALQHACABIAAAwgkAMA4RAADABQAgkwMAAOwFADCUAwAANQAQlQMAAOwFADCWAwQAAAABnQNAAPwEACGzA0AA_AQAIcADAQD6BAAh0ANAAPwEACGeBBAAsQUAIZ8EEACxBQAhoAQQALEFACGhBAIAsgUAIacEAADrBQAgAgAAADcAICAAALQHACACAAAAsgcAICAAALMHACAMkwMAALEHADCUAwAAsgcAEJUDAACxBwAwlgMEAPkEACGdA0AA_AQAIbMDQAD8BAAhwAMBAPoEACHQA0AA_AQAIZ4EEACxBQAhnwQQALEFACGgBBAAsQUAIaEEAgCyBQAhDJMDAACxBwAwlAMAALIHABCVAwAAsQcAMJYDBAD5BAAhnQNAAPwEACGzA0AA_AQAIcADAQD6BAAh0ANAAPwEACGeBBAAsQUAIZ8EEACxBQAhoAQQALEFACGhBAIAsgUAIQiWAwQAkwYAIZ0DQACWBgAhswNAAJYGACHQA0AAlgYAIZ4EEADeBgAhnwQQAN4GACGgBBAA3gYAIaEEAgDUBgAhCJYDBACTBgAhnQNAAJYGACGzA0AAlgYAIdADQACWBgAhngQQAN4GACGfBBAA3gYAIaAEEADeBgAhoQQCANQGACEIlgMEAAAAAZ0DQAAAAAGzA0AAAAAB0ANAAAAAAZ4EEAAAAAGfBBAAAAABoAQQAAAAAaEEAgAAAAEEJwAAqgcAMLcFAACrBwAwuwUAAK4HADC8BQAArQcAIAQnAACeBwAwtwUAAJ8HADC7BQAAogcAMLwFAAChBwAgAycAAJkHACC3BQAAmgcAILsFAACCAgAgAycAAMAJACC3BQAAwQkAILsFAAABACAAAAAAAAAAAAAAAAAAAAABvQUAAACRBQIBvQUAAACTBQMBvQUAAACVBQIFJwAAuwkAICgAAL4JACC3BQAAvAkAILgFAAC9CQAguwUAABoAIAMnAAC7CQAgtwUAALwJACC7BQAAGgAgAAAAAAABvQUAAACTBQIFJwAAtgkAICgAALkJACC3BQAAtwkAILgFAAC4CQAguwUAABoAIAMnAAC2CQAgtwUAALcJACC7BQAAGgAgAAAAAAALJwAA9wcAMCgAAPwHADC3BQAA-AcAMLgFAAD5BwAwuQUAAPsHADC6BQAA-wcAMLsFAAD7BwAwvAUAAPoHACC9BQAA-wcAML4FAAD9BwAwvwUAAP4HADAFJwAArgkAICgAALQJACC3BQAArwkAILgFAACzCQAguwUAAAUAIAsnAADrBwAwKAAA8AcAMLcFAADsBwAwuAUAAO0HADC5BQAA7wcAMLoFAADvBwAwuwUAAO8HADC8BQAA7gcAIL0FAADvBwAwvgUAAPEHADC_BQAA8gcAMAsnAADfBwAwKAAA5AcAMLcFAADgBwAwuAUAAOEHADC5BQAA4wcAMLoFAADjBwAwuwUAAOMHADC8BQAA4gcAIL0FAADjBwAwvgUAAOUHADC_BQAA5gcAMAiWAwQAAAABnQNAAAAAAa0DAAAAlQUCswNAAAAAAYkFAAAAkwUDkQUAAACRBQKTBYAAAAABlQUEAAAAAQIAAAAUACAnAADqBwAgAwAAABQAICcAAOoHACAoAADpBwAgASAAALIJADANBQAAgQYAIJMDAAD9BQAwlAMAABIAEJUDAAD9BQAwlgMEAAAAAZ0DQAD8BAAhrQMAAIAGlQUiswNAAPwEACGJBQAA_wWTBSOPBQQA-QQAIZEFAAD-BZEFIpMFAAD2BQAglQUEAJYFACECAAAAFAAgIAAA6QcAIAIAAADnBwAgIAAA6AcAIAyTAwAA5gcAMJQDAADnBwAQlQMAAOYHADCWAwQA-QQAIZ0DQAD8BAAhrQMAAIAGlQUiswNAAPwEACGJBQAA_wWTBSOPBQQA-QQAIZEFAAD-BZEFIpMFAAD2BQAglQUEAJYFACEMkwMAAOYHADCUAwAA5wcAEJUDAADmBwAwlgMEAPkEACGdA0AA_AQAIa0DAACABpUFIrMDQAD8BAAhiQUAAP8FkwUjjwUEAPkEACGRBQAA_gWRBSKTBQAA9gUAIJUFBACWBQAhCJYDBACTBgAhnQNAAJYGACGtAwAAyweVBSKzA0AAlgYAIYkFAADKB5MFI5EFAADJB5EFIpMFgAAAAAGVBQQAnwYAIQiWAwQAkwYAIZ0DQACWBgAhrQMAAMsHlQUiswNAAJYGACGJBQAAygeTBSORBQAAyQeRBSKTBYAAAAABlQUEAJ8GACEIlgMEAAAAAZ0DQAAAAAGtAwAAAJUFArMDQAAAAAGJBQAAAJMFA5EFAAAAkQUCkwWAAAAAAZUFBAAAAAEGlgMEAAAAAZ0DQAAAAAGzA0AAAAABiQUAAACTBQKWBYAAAAABlwUEAAAAAQIAAAAQACAnAAD2BwAgAwAAABAAICcAAPYHACAoAAD1BwAgASAAALEJADAMBQAAgQYAIJMDAACDBgAwlAMAAA4AEJUDAACDBgAwlgMEAAAAAZ0DQAD8BAAhswNAAPwEACGJBQAAhAaTBSKPBQQA-QQAIZYFAAD2BQAglwUEAJYFACGzBQAAggYAIAIAAAAQACAgAAD1BwAgAgAAAPMHACAgAAD0BwAgCpMDAADyBwAwlAMAAPMHABCVAwAA8gcAMJYDBAD5BAAhnQNAAPwEACGzA0AA_AQAIYkFAACEBpMFIo8FBAD5BAAhlgUAAPYFACCXBQQAlgUAIQqTAwAA8gcAMJQDAADzBwAQlQMAAPIHADCWAwQA-QQAIZ0DQAD8BAAhswNAAPwEACGJBQAAhAaTBSKPBQQA-QQAIZYFAAD2BQAglwUEAJYFACEGlgMEAJMGACGdA0AAlgYAIbMDQACWBgAhiQUAANMHkwUilgWAAAAAAZcFBACfBgAhBpYDBACTBgAhnQNAAJYGACGzA0AAlgYAIYkFAADTB5MFIpYFgAAAAAGXBQQAnwYAIQaWAwQAAAABnQNAAAAAAbMDQAAAAAGJBQAAAJMFApYFgAAAAAGXBQQAAAABDAQAAIcHACCWAwQAAAABnQNAAAAAAaoDAQAAAAGrAwQAAAABrQMBAAAAAbMDQAAAAAH4BAEAAAAB-QQBAAAAAfoEIAAAAAH7BEAAAAAB_QRAAAAAAQIAAAAJACAnAACCCAAgAwAAAAkAICcAAIIIACAoAACBCAAgASAAALAJADARBAAAkwUAIAkAAIYGACCTAwAAhQYAMJQDAAAHABCVAwAAhQYAMJYDBAAAAAGdA0AA_AQAIaoDAQAAAAGrAwQA-QQAIa0DAQCfBQAhswNAAPwEACH4BAEAnwUAIfkEAQD6BAAh-gQgAL8FACH7BEAAmQUAIfwEBACWBQAh_QRAAJkFACECAAAACQAgIAAAgQgAIAIAAAD_BwAgIAAAgAgAIA-TAwAA_gcAMJQDAAD_BwAQlQMAAP4HADCWAwQA-QQAIZ0DQAD8BAAhqgMBAPoEACGrAwQA-QQAIa0DAQCfBQAhswNAAPwEACH4BAEAnwUAIfkEAQD6BAAh-gQgAL8FACH7BEAAmQUAIfwEBACWBQAh_QRAAJkFACEPkwMAAP4HADCUAwAA_wcAEJUDAAD-BwAwlgMEAPkEACGdA0AA_AQAIaoDAQD6BAAhqwMEAPkEACGtAwEAnwUAIbMDQAD8BAAh-AQBAJ8FACH5BAEA-gQAIfoEIAC_BQAh-wRAAJkFACH8BAQAlgUAIf0EQACZBQAhC5YDBACTBgAhnQNAAJYGACGqAwEAlAYAIasDBACTBgAhrQMBAMEGACGzA0AAlgYAIfgEAQDBBgAh-QQBAJQGACH6BCAAgwcAIfsEQACeBgAh_QRAAJ4GACEMBAAAhQcAIJYDBACTBgAhnQNAAJYGACGqAwEAlAYAIasDBACTBgAhrQMBAMEGACGzA0AAlgYAIfgEAQDBBgAh-QQBAJQGACH6BCAAgwcAIfsEQACeBgAh_QRAAJ4GACEMBAAAhwcAIJYDBAAAAAGdA0AAAAABqgMBAAAAAasDBAAAAAGtAwEAAAABswNAAAAAAfgEAQAAAAH5BAEAAAAB-gQgAAAAAfsEQAAAAAH9BEAAAAABBCcAAPcHADC3BQAA-AcAMLsFAAD7BwAwvAUAAPoHACADJwAArgkAILcFAACvCQAguwUAAAUAIAQnAADrBwAwtwUAAOwHADC7BQAA7wcAMLwFAADuBwAgBCcAAN8HADC3BQAA4AcAMLsFAADjBwAwvAUAAOIHACAAAAAAAAsnAADICAAwKAAAzAgAMLcFAADJCAAwuAUAAMoIADC5BQAA-wcAMLoFAAD7BwAwuwUAAPsHADC8BQAAywgAIL0FAAD7BwAwvgUAAM0IADC_BQAA_gcAMAsnAAC8CAAwKAAAwQgAMLcFAAC9CAAwuAUAAL4IADC5BQAAwAgAMLoFAADACAAwuwUAAMAIADC8BQAAvwgAIL0FAADACAAwvgUAAMIIADC_BQAAwwgAMAsnAACwCAAwKAAAtQgAMLcFAACxCAAwuAUAALIIADC5BQAAtAgAMLoFAAC0CAAwuwUAALQIADC8BQAAswgAIL0FAAC0CAAwvgUAALYIADC_BQAAtwgAMAUnAACkCQAgKAAArAkAILcFAAClCQAguAUAAKsJACC7BQAAAQAgBycAAKsIACAoAACuCAAgtwUAAKwIACC4BQAArQgAILkFAAAgACC6BQAAIAAguwUAAIkEACALJwAAnwgAMCgAAKQIADC3BQAAoAgAMLgFAAChCAAwuQUAAKMIADC6BQAAowgAMLsFAACjCAAwvAUAAKIIACC9BQAAowgAML4FAAClCAAwvwUAAKYIADALJwAAkwgAMCgAAJgIADC3BQAAlAgAMLgFAACVCAAwuQUAAJcIADC6BQAAlwgAMLsFAACXCAAwvAUAAJYIACC9BQAAlwgAML4FAACZCAAwvwUAAJoIADAKlgMEAAAAAZkDAgAAAAGaAwIAAAABmwMBAAAAAZwDAQAAAAGdA0AAAAABqgMBAAAAAa0DAAAArQMCrgNAAAAAAa8DQAAAAAECAAAAKQAgJwAAnggAIAMAAAApACAnAACeCAAgKAAAnQgAIAEgAACqCQAwDwQAAPQFACCTAwAA8gUAMJQDAAAnABCVAwAA8gUAMJYDBAAAAAGZAwIA-wQAIZoDAgD7BAAhmwMBAPoEACGcAwEA-gQAIZ0DQAD8BAAhqgMBAPoEACGrAwQAlgUAIa0DAADzBa0DIq4DQACZBQAhrwNAAJkFACECAAAAKQAgIAAAnQgAIAIAAACbCAAgIAAAnAgAIA6TAwAAmggAMJQDAACbCAAQlQMAAJoIADCWAwQA-QQAIZkDAgD7BAAhmgMCAPsEACGbAwEA-gQAIZwDAQD6BAAhnQNAAPwEACGqAwEA-gQAIasDBACWBQAhrQMAAPMFrQMirgNAAJkFACGvA0AAmQUAIQ6TAwAAmggAMJQDAACbCAAQlQMAAJoIADCWAwQA-QQAIZkDAgD7BAAhmgMCAPsEACGbAwEA-gQAIZwDAQD6BAAhnQNAAPwEACGqAwEA-gQAIasDBACWBQAhrQMAAPMFrQMirgNAAJkFACGvA0AAmQUAIQqWAwQAkwYAIZkDAgCVBgAhmgMCAJUGACGbAwEAlAYAIZwDAQCUBgAhnQNAAJYGACGqAwEAlAYAIa0DAACdBq0DIq4DQACeBgAhrwNAAJ4GACEKlgMEAJMGACGZAwIAlQYAIZoDAgCVBgAhmwMBAJQGACGcAwEAlAYAIZ0DQACWBgAhqgMBAJQGACGtAwAAnQatAyKuA0AAngYAIa8DQACeBgAhCpYDBAAAAAGZAwIAAAABmgMCAAAAAZsDAQAAAAGcAwEAAAABnQNAAAAAAaoDAQAAAAGtAwAAAK0DAq4DQAAAAAGvA0AAAAABB5YDBAAAAAGdA0AAAAABqgMBAAAAAbADgAAAAAGxAwIAAAABsgNAAAAAAbMDQAAAAAECAAAAJAAgJwAAqggAIAMAAAAkACAnAACqCAAgKAAAqQgAIAEgAACpCQAwDAQAAPQFACCTAwAA9QUAMJQDAAAiABCVAwAA9QUAMJYDBAAAAAGdA0AA_AQAIaoDAQAAAAGrAwQAlgUAIbADAAD2BQAgsQMCAPsEACGyA0AA_AQAIbMDQAD8BAAhAgAAACQAICAAAKkIACACAAAApwgAICAAAKgIACALkwMAAKYIADCUAwAApwgAEJUDAACmCAAwlgMEAPkEACGdA0AA_AQAIaoDAQD6BAAhqwMEAJYFACGwAwAA9gUAILEDAgD7BAAhsgNAAPwEACGzA0AA_AQAIQuTAwAApggAMJQDAACnCAAQlQMAAKYIADCWAwQA-QQAIZ0DQAD8BAAhqgMBAPoEACGrAwQAlgUAIbADAAD2BQAgsQMCAPsEACGyA0AA_AQAIbMDQAD8BAAhB5YDBACTBgAhnQNAAJYGACGqAwEAlAYAIbADgAAAAAGxAwIAlQYAIbIDQACWBgAhswNAAJYGACEHlgMEAJMGACGdA0AAlgYAIaoDAQCUBgAhsAOAAAAAAbEDAgCVBgAhsgNAAJYGACGzA0AAlgYAIQeWAwQAAAABnQNAAAAAAaoDAQAAAAGwA4AAAAABsQMCAAAAAbIDQAAAAAGzA0AAAAABCJYDBAAAAAGtAwAAALsDArMDQAAAAAG7AwIAAAABvAMCAAAAAb0DAgAAAAG-AwIAAAABvwMCAAAAAQIAAACJBAAgJwAAqwgAIAMAAAAgACAnAACrCAAgKAAArwgAIAoAAAAgACAgAACvCAAglgMEAJMGACGtAwAArga7AyKzA0AAlgYAIbsDAgCVBgAhvAMCAJUGACG9AwIAlQYAIb4DAgCVBgAhvwMCAJUGACEIlgMEAJMGACGtAwAArga7AyKzA0AAlgYAIbsDAgCVBgAhvAMCAJUGACG9AwIAlQYAIb4DAgCVBgAhvwMCAJUGACEKlgMEAAAAAcYDCAAAAAHHAwgAAAAByAMIAAAAAckDCAAAAAHKAwEAAAABywMIAAAAAcwDCAAAAAHOA0AAAAABzwNAAAAAAQIAAAAeACAnAAC7CAAgAwAAAB4AICcAALsIACAoAAC6CAAgASAAAKgJADAPBAAAkwUAIJMDAAD3BQAwlAMAABwAEJUDAAD3BQAwlgMEAAAAAcYDCAD4BQAhxwMIAPgFACHIAwgA-AUAIckDCAD4BQAhygMBAJ8FACHLAwgA-AUAIcwDCAD4BQAhzQMEAPkEACHOA0AA_AQAIc8DQAD8BAAhAgAAAB4AICAAALoIACACAAAAuAgAICAAALkIACAOkwMAALcIADCUAwAAuAgAEJUDAAC3CAAwlgMEAPkEACHGAwgA-AUAIccDCAD4BQAhyAMIAPgFACHJAwgA-AUAIcoDAQCfBQAhywMIAPgFACHMAwgA-AUAIc0DBAD5BAAhzgNAAPwEACHPA0AA_AQAIQ6TAwAAtwgAMJQDAAC4CAAQlQMAALcIADCWAwQA-QQAIcYDCAD4BQAhxwMIAPgFACHIAwgA-AUAIckDCAD4BQAhygMBAJ8FACHLAwgA-AUAIcwDCAD4BQAhzQMEAPkEACHOA0AA_AQAIc8DQAD8BAAhCpYDBACTBgAhxgMIAMwGACHHAwgAzAYAIcgDCADMBgAhyQMIAMwGACHKAwEAwQYAIcsDCADMBgAhzAMIAMwGACHOA0AAlgYAIc8DQACWBgAhCpYDBACTBgAhxgMIAMwGACHHAwgAzAYAIcgDCADMBgAhyQMIAMwGACHKAwEAwQYAIcsDCADMBgAhzAMIAMwGACHOA0AAlgYAIc8DQACWBgAhCpYDBAAAAAHGAwgAAAABxwMIAAAAAcgDCAAAAAHJAwgAAAABygMBAAAAAcsDCAAAAAHMAwgAAAABzgNAAAAAAc8DQAAAAAELAwAAgwgAIAYAAIUIACAHAACGCAAglgMEAAAAAZ0DQAAAAAGqAwEAAAABswNAAAAAAfgEAQAAAAH5BAEAAAAB-wRAAAAAAf0EQAAAAAECAAAAGgAgJwAAxwgAIAMAAAAaACAnAADHCAAgKAAAxggAIAEgAACnCQAwEAMAAPoFACAEAACTBQAgBgAA-wUAIAcAAPwFACCTAwAA-QUAMJQDAAALABCVAwAA-QUAMJYDBAAAAAGdA0AA_AQAIaoDAQAAAAGrAwQA-QQAIbMDQAD8BAAh-AQBAJ8FACH5BAEA-gQAIfsEQACZBQAh_QRAAJkFACECAAAAGgAgIAAAxggAIAIAAADECAAgIAAAxQgAIAyTAwAAwwgAMJQDAADECAAQlQMAAMMIADCWAwQA-QQAIZ0DQAD8BAAhqgMBAPoEACGrAwQA-QQAIbMDQAD8BAAh-AQBAJ8FACH5BAEA-gQAIfsEQACZBQAh_QRAAJkFACEMkwMAAMMIADCUAwAAxAgAEJUDAADDCAAwlgMEAPkEACGdA0AA_AQAIaoDAQD6BAAhqwMEAPkEACGzA0AA_AQAIfgEAQCfBQAh-QQBAPoEACH7BEAAmQUAIf0EQACZBQAhCJYDBACTBgAhnQNAAJYGACGqAwEAlAYAIbMDQACWBgAh-AQBAMEGACH5BAEAlAYAIfsEQACeBgAh_QRAAJ4GACELAwAA2wcAIAYAAN0HACAHAADeBwAglgMEAJMGACGdA0AAlgYAIaoDAQCUBgAhswNAAJYGACH4BAEAwQYAIfkEAQCUBgAh-wRAAJ4GACH9BEAAngYAIQsDAACDCAAgBgAAhQgAIAcAAIYIACCWAwQAAAABnQNAAAAAAaoDAQAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH7BEAAAAAB_QRAAAAAAQwJAACGBwAglgMEAAAAAZ0DQAAAAAGqAwEAAAABrQMBAAAAAbMDQAAAAAH4BAEAAAAB-QQBAAAAAfoEIAAAAAH7BEAAAAAB_AQEAAAAAf0EQAAAAAECAAAACQAgJwAA0AgAIAMAAAAJACAnAADQCAAgKAAAzwgAIAEgAACmCQAwAgAAAAkAICAAAM8IACACAAAA_wcAICAAAM4IACALlgMEAJMGACGdA0AAlgYAIaoDAQCUBgAhrQMBAMEGACGzA0AAlgYAIfgEAQDBBgAh-QQBAJQGACH6BCAAgwcAIfsEQACeBgAh_AQEAJ8GACH9BEAAngYAIQwJAACEBwAglgMEAJMGACGdA0AAlgYAIaoDAQCUBgAhrQMBAMEGACGzA0AAlgYAIfgEAQDBBgAh-QQBAJQGACH6BCAAgwcAIfsEQACeBgAh_AQEAJ8GACH9BEAAngYAIQwJAACGBwAglgMEAAAAAZ0DQAAAAAGqAwEAAAABrQMBAAAAAbMDQAAAAAH4BAEAAAAB-QQBAAAAAfoEIAAAAAH7BEAAAAAB_AQEAAAAAf0EQAAAAAEEJwAAyAgAMLcFAADJCAAwuwUAAPsHADC8BQAAywgAIAQnAAC8CAAwtwUAAL0IADC7BQAAwAgAMLwFAAC_CAAgBCcAALAIADC3BQAAsQgAMLsFAAC0CAAwvAUAALMIACADJwAApAkAILcFAAClCQAguwUAAAEAIAMnAACrCAAgtwUAAKwIACC7BQAAiQQAIAQnAACfCAAwtwUAAKAIADC7BQAAowgAMLwFAACiCAAgBCcAAJMIADC3BQAAlAgAMLsFAACXCAAwvAUAAJYIACAAAAAAAAG9BQAAAKYFAgG9BQAAAKgFAgG9BQAAAKoFAgsnAAD4CAAwKAAAhQkAMLcFAAD5CAAwuAUAAIQJADC5BQAA-wgAMLoFAAD7CAAwuwUAAPsIADC8BQAA-ggAIL0FAAD7CAAwvgUAAIYJADC_BQAAhwkAMAsnAADzCAAwKAAA_ggAMLcFAAD0CAAwuAUAAP0IADC5BQAA9ggAMLoFAAD2CAAwuwUAAPYIADC8BQAA9QgAIL0FAAD2CAAwvgUAAP8IADC_BQAAgAkAMAcnAACcCQAgKAAAogkAILcFAACdCQAguAUAAKEJACC5BQAARAAgugUAAEQAILsFAAABACALJwAA5AgAMCgAAOkIADC3BQAA5QgAMLgFAADmCAAwuQUAAOgIADC6BQAA6AgAMLsFAADoCAAwvAUAAOcIACC9BQAA6AgAML4FAADqCAAwvwUAAOsIADATEAAA8AgAIBgAAPEIACAaAADyCAAglgMEAAAAAZ0DQAAAAAGtAwAAAKoFArMDQAAAAAH9BEAAAAABgQUgAAAAAZ8FAQAAAAGiBQEAAAABowUBAAAAAaQFAQAAAAGmBQAAAKYFAqgFAAAAqAUCqwUBAAAAAawFAQAAAAGtBUAAAAABrgVAAAAAAQIAAAABACAnAADvCAAgAwAAAAEAICcAAO8IACAoAADuCAAgASAAAKAJADAZEAAA5QUAIBgAAOYFACAZAADnBQAgGgAA6AUAIJMDAADhBQAwlAMAAEQAEJUDAADhBQAwlgMEAAAAAZ0DQAD8BAAhrQMAAOQFqgUiswNAAPwEACH9BEAAmQUAIYEFIAC_BQAhnwUBAJ8FACGiBQEAAAABowUBAJ8FACGkBQEA-gQAIaYFAADiBaYFIqgFAADjBagFIqoFBACWBQAhqwUBAJ8FACGsBQEAnwUAIa0FQACZBQAhrgVAAJkFACG0BQAAjQYAIAIAAAABACAgAADuCAAgAgAAAOwIACAgAADtCAAgFJMDAADrCAAwlAMAAOwIABCVAwAA6wgAMJYDBAD5BAAhnQNAAPwEACGtAwAA5AWqBSKzA0AA_AQAIf0EQACZBQAhgQUgAL8FACGfBQEAnwUAIaIFAQD6BAAhowUBAJ8FACGkBQEA-gQAIaYFAADiBaYFIqgFAADjBagFIqoFBACWBQAhqwUBAJ8FACGsBQEAnwUAIa0FQACZBQAhrgVAAJkFACEUkwMAAOsIADCUAwAA7AgAEJUDAADrCAAwlgMEAPkEACGdA0AA_AQAIa0DAADkBaoFIrMDQAD8BAAh_QRAAJkFACGBBSAAvwUAIZ8FAQCfBQAhogUBAPoEACGjBQEAnwUAIaQFAQD6BAAhpgUAAOIFpgUiqAUAAOMFqAUiqgUEAJYFACGrBQEAnwUAIawFAQCfBQAhrQVAAJkFACGuBUAAmQUAIRCWAwQAkwYAIZ0DQACWBgAhrQMAAN8IqgUiswNAAJYGACH9BEAAngYAIYEFIACDBwAhnwUBAMEGACGiBQEAlAYAIaMFAQDBBgAhpAUBAJQGACGmBQAA3QimBSKoBQAA3gioBSKrBQEAwQYAIawFAQDBBgAhrQVAAJ4GACGuBUAAngYAIRMQAADgCAAgGAAA4QgAIBoAAOMIACCWAwQAkwYAIZ0DQACWBgAhrQMAAN8IqgUiswNAAJYGACH9BEAAngYAIYEFIACDBwAhnwUBAMEGACGiBQEAlAYAIaMFAQDBBgAhpAUBAJQGACGmBQAA3QimBSKoBQAA3gioBSKrBQEAwQYAIawFAQDBBgAhrQVAAJ4GACGuBUAAngYAIRMQAADwCAAgGAAA8QgAIBoAAPIIACCWAwQAAAABnQNAAAAAAa0DAAAAqgUCswNAAAAAAf0EQAAAAAGBBSAAAAABnwUBAAAAAaIFAQAAAAGjBQEAAAABpAUBAAAAAaYFAAAApgUCqAUAAACoBQKrBQEAAAABrAUBAAAAAa0FQAAAAAGuBUAAAAABBCcAAPgIADC3BQAA-QgAMLsFAAD7CAAwvAUAAPoIACAEJwAA8wgAMLcFAAD0CAAwuwUAAPYIADC8BQAA9QgAIAQnAADkCAAwtwUAAOUIADC7BQAA6AgAMLwFAADnCAAgChIAALYHACAWAAC3BwAgFwAAuAcAIJYDBAAAAAGdA0AAAAABqgMBAAAAAasDBAAAAAGzA0AAAAAB_QRAAAAAAYEFIAAAAAECAAAAMwAgJwAA9wgAIAEgAACfCQAwDwwAAPEFACASAADuBQAgFgAA7wUAIBcAAPAFACCTAwAA7QUAMJQDAAAxABCVAwAA7QUAMJYDBAAAAAGdA0AA_AQAIaoDAQAAAAGrAwQAlgUAIbMDQAD8BAAh_QRAAJkFACGABQQA-QQAIYEFIAC_BQAhChIAALYHACAWAAC3BwAgFwAAuAcAIJYDBAAAAAGdA0AAAAABqgMBAAAAAasDBAAAAAGzA0AAAAAB_QRAAAAAAYEFIAAAAAEVAwAA0QgAIAoAANIIACALAADTCAAgDQAA1QgAIA4AANYIACAPAADXCAAglgMEAAAAAZ0DQAAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH9BEAAAAABmAVAAAAAAZkFQAAAAAGaBQgAAAABmwUIAAAAAZwFAQAAAAGdBQEAAAABngUBAAAAAZ8FAQAAAAGgBQEAAAABAgAAAAUAICcAAPwIACABIAAAngkAMBoDAAD6BQAgCgAAiAYAIAsAAIkGACAMAADxBQAgDQAAigYAIA4AAIsGACAPAACMBgAgkwMAAIcGADCUAwAAAwAQlQMAAIcGADCWAwQAAAABnQNAAPwEACGzA0AA_AQAIfgEAQD6BAAh-QQBAPoEACH9BEAAmQUAIZgFQACZBQAhmQVAAJkFACGaBQgA-AUAIZsFCAD4BQAhnAUBAJ8FACGdBQEAnwUAIZ4FAQCfBQAhnwUBAJ8FACGgBQEAnwUAIaEFAQD6BAAhFQMAANEIACAKAADSCAAgCwAA0wgAIA0AANUIACAOAADWCAAgDwAA1wgAIJYDBAAAAAGdA0AAAAABswNAAAAAAfgEAQAAAAH5BAEAAAAB_QRAAAAAAZgFQAAAAAGZBUAAAAABmgUIAAAAAZsFCAAAAAGcBQEAAAABnQUBAAAAAZ4FAQAAAAGfBQEAAAABoAUBAAAAAQMAAAAzACAnAAD3CAAgKAAAgwkAIAIAAAAzACAgAACDCQAgAgAAAIEJACAgAACCCQAgC5MDAACACQAwlAMAAIEJABCVAwAAgAkAMJYDBAD5BAAhnQNAAPwEACGqAwEA-gQAIasDBACWBQAhswNAAPwEACH9BEAAmQUAIYAFBAD5BAAhgQUgAL8FACELkwMAAIAJADCUAwAAgQkAEJUDAACACQAwlgMEAPkEACGdA0AA_AQAIaoDAQD6BAAhqwMEAJYFACGzA0AA_AQAIf0EQACZBQAhgAUEAPkEACGBBSAAvwUAIQeWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAnwYAIbMDQACWBgAh_QRAAJ4GACGBBSAAgwcAIQoSAACVBwAgFgAAlgcAIBcAAJcHACCWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAnwYAIbMDQACWBgAh_QRAAJ4GACGBBSAAgwcAIQMAAAAFACAnAAD8CAAgKAAAigkAIAIAAAAFACAgAACKCQAgAgAAAIgJACAgAACJCQAgE5MDAACHCQAwlAMAAIgJABCVAwAAhwkAMJYDBAD5BAAhnQNAAPwEACGzA0AA_AQAIfgEAQD6BAAh-QQBAPoEACH9BEAAmQUAIZgFQACZBQAhmQVAAJkFACGaBQgA-AUAIZsFCAD4BQAhnAUBAJ8FACGdBQEAnwUAIZ4FAQCfBQAhnwUBAJ8FACGgBQEAnwUAIaEFAQD6BAAhE5MDAACHCQAwlAMAAIgJABCVAwAAhwkAMJYDBAD5BAAhnQNAAPwEACGzA0AA_AQAIfgEAQD6BAAh-QQBAPoEACH9BEAAmQUAIZgFQACZBQAhmQVAAJkFACGaBQgA-AUAIZsFCAD4BQAhnAUBAJ8FACGdBQEAnwUAIZ4FAQCfBQAhnwUBAJ8FACGgBQEAnwUAIaEFAQD6BAAhD5YDBACTBgAhnQNAAJYGACGzA0AAlgYAIfgEAQCUBgAh-QQBAJQGACH9BEAAngYAIZgFQACeBgAhmQVAAJ4GACGaBQgAzAYAIZsFCADMBgAhnAUBAMEGACGdBQEAwQYAIZ4FAQDBBgAhnwUBAMEGACGgBQEAwQYAIRUDAACMCAAgCgAAjQgAIAsAAI4IACANAACQCAAgDgAAkQgAIA8AAJIIACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACEDJwAAnAkAILcFAACdCQAguwUAAAEAIAAADBAAAIwJACAYAACNCQAgGQAAjgkAIBoAAI8JACD9BAAAlwYAIJ8FAACXBgAgowUAAJcGACCqBQAAlwYAIKsFAACXBgAgrAUAAJcGACCtBQAAlwYAIK4FAACXBgAgAAAAAREAAI8HACAAAAAHAwAAkwkAIAQAALEGACAGAACUCQAgBwAAlQkAIPgEAACXBgAg-wQAAJcGACD9BAAAlwYAIAAAAQQAALEGACAAABQQAADwCAAgGAAA8QgAIBkAAIsJACCWAwQAAAABnQNAAAAAAa0DAAAAqgUCswNAAAAAAf0EQAAAAAGBBSAAAAABnwUBAAAAAaIFAQAAAAGjBQEAAAABpAUBAAAAAaYFAAAApgUCqAUAAACoBQKqBQQAAAABqwUBAAAAAawFAQAAAAGtBUAAAAABrgVAAAAAAQIAAAABACAnAACcCQAgD5YDBAAAAAGdA0AAAAABswNAAAAAAfgEAQAAAAH5BAEAAAAB_QRAAAAAAZgFQAAAAAGZBUAAAAABmgUIAAAAAZsFCAAAAAGcBQEAAAABnQUBAAAAAZ4FAQAAAAGfBQEAAAABoAUBAAAAAQeWAwQAAAABnQNAAAAAAaoDAQAAAAGrAwQAAAABswNAAAAAAf0EQAAAAAGBBSAAAAABEJYDBAAAAAGdA0AAAAABrQMAAACqBQKzA0AAAAAB_QRAAAAAAYEFIAAAAAGfBQEAAAABogUBAAAAAaMFAQAAAAGkBQEAAAABpgUAAACmBQKoBQAAAKgFAqsFAQAAAAGsBQEAAAABrQVAAAAAAa4FQAAAAAEDAAAARAAgJwAAnAkAICgAAKMJACAWAAAARAAgEAAA4AgAIBgAAOEIACAZAADiCAAgIAAAowkAIJYDBACTBgAhnQNAAJYGACGtAwAA3wiqBSKzA0AAlgYAIf0EQACeBgAhgQUgAIMHACGfBQEAwQYAIaIFAQCUBgAhowUBAMEGACGkBQEAlAYAIaYFAADdCKYFIqgFAADeCKgFIqoFBACfBgAhqwUBAMEGACGsBQEAwQYAIa0FQACeBgAhrgVAAJ4GACEUEAAA4AgAIBgAAOEIACAZAADiCAAglgMEAJMGACGdA0AAlgYAIa0DAADfCKoFIrMDQACWBgAh_QRAAJ4GACGBBSAAgwcAIZ8FAQDBBgAhogUBAJQGACGjBQEAwQYAIaQFAQCUBgAhpgUAAN0IpgUiqAUAAN4IqAUiqgUEAJ8GACGrBQEAwQYAIawFAQDBBgAhrQVAAJ4GACGuBUAAngYAIRQYAADxCAAgGQAAiwkAIBoAAPIIACCWAwQAAAABnQNAAAAAAa0DAAAAqgUCswNAAAAAAf0EQAAAAAGBBSAAAAABnwUBAAAAAaIFAQAAAAGjBQEAAAABpAUBAAAAAaYFAAAApgUCqAUAAACoBQKqBQQAAAABqwUBAAAAAawFAQAAAAGtBUAAAAABrgVAAAAAAQIAAAABACAnAACkCQAgC5YDBAAAAAGdA0AAAAABqgMBAAAAAa0DAQAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH6BCAAAAAB-wRAAAAAAfwEBAAAAAH9BEAAAAABCJYDBAAAAAGdA0AAAAABqgMBAAAAAbMDQAAAAAH4BAEAAAAB-QQBAAAAAfsEQAAAAAH9BEAAAAABCpYDBAAAAAHGAwgAAAABxwMIAAAAAcgDCAAAAAHJAwgAAAABygMBAAAAAcsDCAAAAAHMAwgAAAABzgNAAAAAAc8DQAAAAAEHlgMEAAAAAZ0DQAAAAAGqAwEAAAABsAOAAAAAAbEDAgAAAAGyA0AAAAABswNAAAAAAQqWAwQAAAABmQMCAAAAAZoDAgAAAAGbAwEAAAABnAMBAAAAAZ0DQAAAAAGqAwEAAAABrQMAAACtAwKuA0AAAAABrwNAAAAAAQMAAABEACAnAACkCQAgKAAArQkAIBYAAABEACAYAADhCAAgGQAA4ggAIBoAAOMIACAgAACtCQAglgMEAJMGACGdA0AAlgYAIa0DAADfCKoFIrMDQACWBgAh_QRAAJ4GACGBBSAAgwcAIZ8FAQDBBgAhogUBAJQGACGjBQEAwQYAIaQFAQCUBgAhpgUAAN0IpgUiqAUAAN4IqAUiqgUEAJ8GACGrBQEAwQYAIawFAQDBBgAhrQVAAJ4GACGuBUAAngYAIRQYAADhCAAgGQAA4ggAIBoAAOMIACCWAwQAkwYAIZ0DQACWBgAhrQMAAN8IqgUiswNAAJYGACH9BEAAngYAIYEFIACDBwAhnwUBAMEGACGiBQEAlAYAIaMFAQDBBgAhpAUBAJQGACGmBQAA3QimBSKoBQAA3gioBSKqBQQAnwYAIasFAQDBBgAhrAUBAMEGACGtBUAAngYAIa4FQACeBgAhFgMAANEIACALAADTCAAgDAAA1AgAIA0AANUIACAOAADWCAAgDwAA1wgAIJYDBAAAAAGdA0AAAAABswNAAAAAAfgEAQAAAAH5BAEAAAAB_QRAAAAAAZgFQAAAAAGZBUAAAAABmgUIAAAAAZsFCAAAAAGcBQEAAAABnQUBAAAAAZ4FAQAAAAGfBQEAAAABoAUBAAAAAaEFAQAAAAECAAAABQAgJwAArgkAIAuWAwQAAAABnQNAAAAAAaoDAQAAAAGrAwQAAAABrQMBAAAAAbMDQAAAAAH4BAEAAAAB-QQBAAAAAfoEIAAAAAH7BEAAAAAB_QRAAAAAAQaWAwQAAAABnQNAAAAAAbMDQAAAAAGJBQAAAJMFApYFgAAAAAGXBQQAAAABCJYDBAAAAAGdA0AAAAABrQMAAACVBQKzA0AAAAABiQUAAACTBQORBQAAAJEFApMFgAAAAAGVBQQAAAABAwAAAAMAICcAAK4JACAoAAC1CQAgGAAAAAMAIAMAAIwIACALAACOCAAgDAAAjwgAIA0AAJAIACAOAACRCAAgDwAAkggAICAAALUJACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACGhBQEAlAYAIRYDAACMCAAgCwAAjggAIAwAAI8IACANAACQCAAgDgAAkQgAIA8AAJIIACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACGhBQEAlAYAIQwDAACDCAAgBAAAhAgAIAcAAIYIACCWAwQAAAABnQNAAAAAAaoDAQAAAAGrAwQAAAABswNAAAAAAfgEAQAAAAH5BAEAAAAB-wRAAAAAAf0EQAAAAAECAAAAGgAgJwAAtgkAIAMAAAALACAnAAC2CQAgKAAAugkAIA4AAAALACADAADbBwAgBAAA3AcAIAcAAN4HACAgAAC6CQAglgMEAJMGACGdA0AAlgYAIaoDAQCUBgAhqwMEAJMGACGzA0AAlgYAIfgEAQDBBgAh-QQBAJQGACH7BEAAngYAIf0EQACeBgAhDAMAANsHACAEAADcBwAgBwAA3gcAIJYDBACTBgAhnQNAAJYGACGqAwEAlAYAIasDBACTBgAhswNAAJYGACH4BAEAwQYAIfkEAQCUBgAh-wRAAJ4GACH9BEAAngYAIQwDAACDCAAgBAAAhAgAIAYAAIUIACCWAwQAAAABnQNAAAAAAaoDAQAAAAGrAwQAAAABswNAAAAAAfgEAQAAAAH5BAEAAAAB-wRAAAAAAf0EQAAAAAECAAAAGgAgJwAAuwkAIAMAAAALACAnAAC7CQAgKAAAvwkAIA4AAAALACADAADbBwAgBAAA3AcAIAYAAN0HACAgAAC_CQAglgMEAJMGACGdA0AAlgYAIaoDAQCUBgAhqwMEAJMGACGzA0AAlgYAIfgEAQDBBgAh-QQBAJQGACH7BEAAngYAIf0EQACeBgAhDAMAANsHACAEAADcBwAgBgAA3QcAIJYDBACTBgAhnQNAAJYGACGqAwEAlAYAIasDBACTBgAhswNAAJYGACH4BAEAwQYAIfkEAQCUBgAh-wRAAJ4GACH9BEAAngYAIRQQAADwCAAgGQAAiwkAIBoAAPIIACCWAwQAAAABnQNAAAAAAa0DAAAAqgUCswNAAAAAAf0EQAAAAAGBBSAAAAABnwUBAAAAAaIFAQAAAAGjBQEAAAABpAUBAAAAAaYFAAAApgUCqAUAAACoBQKqBQQAAAABqwUBAAAAAawFAQAAAAGtBUAAAAABrgVAAAAAAQIAAAABACAnAADACQAgCJYDBAAAAAGdA0AAAAABswNAAAAAAdADQAAAAAGeBBAAAAABnwQQAAAAAaAEEAAAAAGhBAIAAAABUpYDBAAAAAGdA0AAAAABswNAAAAAAcQDAQAAAAHQA0AAAAAB0QNAAAAAAdIDBAAAAAHTAwIAAAAB1AMCAAAAAdUDAQAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZA0AAAAAB2gMCAAAAAdsDAgAAAAHcAwEAAAAB3QMBAAAAAd4DAgAAAAHfAwIAAAAB4AMCAAAAAeEDAgAAAAHiAwIAAAAB4wMCAAAAAeQDAgAAAAHlAwIAAAAB5gMBAAAAAecDAQAAAAHoAwIAAAAB6QMCAAAAAeoDAgAAAAHrAwIAAAAB7AMCAAAAAe0DAgAAAAHuAwIAAAAB7wMCAAAAAfADAgAAAAHxAwIAAAAB8gMCAAAAAfMDAgAAAAH0AwIAAAAB9QMCAAAAAfYDAgAAAAH3AwIAAAAB-AMCAAAAAfkDAgAAAAH6AwIAAAAB-wMCAAAAAfwDAgAAAAH9AwIAAAAB_gMCAAAAAf8DAgAAAAGABAIAAAABgQQCAAAAAYIEAgAAAAGDBAIAAAABhAQCAAAAAYUEAgAAAAGGBAIAAAABhwQCAAAAAYgEAgAAAAGJBAIAAAABigQCAAAAAYsEAgAAAAGMBAIAAAABjQQCAAAAAY4EAgAAAAGPBAIAAAABkAQCAAAAAZEEAgAAAAGSBAIAAAABkwQCAAAAAZQEAgAAAAGVBAIAAAABlgQCAAAAAZcEAgAAAAGYBAIAAAABmQQCAAAAAZoEAgAAAAGbBAIAAAABnASAAAAAAZ0EAgAAAAEDAAAARAAgJwAAwAkAICgAAMYJACAWAAAARAAgEAAA4AgAIBkAAOIIACAaAADjCAAgIAAAxgkAIJYDBACTBgAhnQNAAJYGACGtAwAA3wiqBSKzA0AAlgYAIf0EQACeBgAhgQUgAIMHACGfBQEAwQYAIaIFAQCUBgAhowUBAMEGACGkBQEAlAYAIaYFAADdCKYFIqgFAADeCKgFIqoFBACfBgAhqwUBAMEGACGsBQEAwQYAIa0FQACeBgAhrgVAAJ4GACEUEAAA4AgAIBkAAOIIACAaAADjCAAglgMEAJMGACGdA0AAlgYAIa0DAADfCKoFIrMDQACWBgAh_QRAAJ4GACGBBSAAgwcAIZ8FAQDBBgAhogUBAJQGACGjBQEAwQYAIaQFAQCUBgAhpgUAAN0IpgUiqAUAAN4IqAUiqgUEAJ8GACGrBQEAwQYAIawFAQDBBgAhrQVAAJ4GACGuBUAAngYAIQsMAAC5BwAgEgAAtgcAIBYAALcHACCWAwQAAAABnQNAAAAAAaoDAQAAAAGrAwQAAAABswNAAAAAAf0EQAAAAAGABQQAAAABgQUgAAAAAQIAAAAzACAnAADHCQAgAwAAADEAICcAAMcJACAoAADLCQAgDQAAADEAIAwAAJgHACASAACVBwAgFgAAlgcAICAAAMsJACCWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAnwYAIbMDQACWBgAh_QRAAJ4GACGABQQAkwYAIYEFIACDBwAhCwwAAJgHACASAACVBwAgFgAAlgcAIJYDBACTBgAhnQNAAJYGACGqAwEAlAYAIasDBACfBgAhswNAAJYGACH9BEAAngYAIYAFBACTBgAhgQUgAIMHACEWCgAA0ggAIAsAANMIACAMAADUCAAgDQAA1QgAIA4AANYIACAPAADXCAAglgMEAAAAAZ0DQAAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH9BEAAAAABmAVAAAAAAZkFQAAAAAGaBQgAAAABmwUIAAAAAZwFAQAAAAGdBQEAAAABngUBAAAAAZ8FAQAAAAGgBQEAAAABoQUBAAAAAQIAAAAFACAnAADMCQAgDAQAAIQIACAGAACFCAAgBwAAhggAIJYDBAAAAAGdA0AAAAABqgMBAAAAAasDBAAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH7BEAAAAAB_QRAAAAAAQIAAAAaACAnAADOCQAgAwAAAAMAICcAAMwJACAoAADSCQAgGAAAAAMAIAoAAI0IACALAACOCAAgDAAAjwgAIA0AAJAIACAOAACRCAAgDwAAkggAICAAANIJACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACGhBQEAlAYAIRYKAACNCAAgCwAAjggAIAwAAI8IACANAACQCAAgDgAAkQgAIA8AAJIIACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACGhBQEAlAYAIQMAAAALACAnAADOCQAgKAAA1QkAIA4AAAALACAEAADcBwAgBgAA3QcAIAcAAN4HACAgAADVCQAglgMEAJMGACGdA0AAlgYAIaoDAQCUBgAhqwMEAJMGACGzA0AAlgYAIfgEAQDBBgAh-QQBAJQGACH7BEAAngYAIf0EQACeBgAhDAQAANwHACAGAADdBwAgBwAA3gcAIJYDBACTBgAhnQNAAJYGACGqAwEAlAYAIasDBACTBgAhswNAAJYGACH4BAEAwQYAIfkEAQCUBgAh-wRAAJ4GACH9BEAAngYAIVUTAAD6BgAglgMEAAAAAcADAQAAAAHBAwEAAAAB0QNAAAAAAagEAQAAAAGpBAEAAAABqgQBAAAAAasEAQAAAAGsBEAAAAABrQQCAAAAAa4EBAAAAAGvBAEAAAABsAQBAAAAAbEEAgAAAAGyBAIAAAABswQBAAAAAbQEAQAAAAG1BAIAAAABtgQCAAAAAbcEAgAAAAG4BAIAAAABuQQCAAAAAboEAgAAAAG7BAIAAAABvAQCAAAAAb0EAgAAAAG-BAIAAAABvwQQAAAAAcAEEAAAAAHBBBAAAAABwgQQAAAAAcMEEAAAAAHEBBAAAAABxQQQAAAAAcYEEAAAAAHHBBAAAAAByAQQAAAAAckEEAAAAAHKBBAAAAABywQQAAAAAcwEEAAAAAHNBBAAAAABzgQQAAAAAc8EEAAAAAHQBBAAAAAB0QQQAAAAAdIEEAAAAAHTBBAAAAAB1AQQAAAAAdUEEAAAAAHWBBAAAAAB1wQQAAAAAdgEEAAAAAHZBBAAAAAB2gQQAAAAAdsEEAAAAAHcBBAAAAAB3QQQAAAAAd4EEAAAAAHfBBAAAAAB4AQQAAAAAeEEEAAAAAHiBBAAAAAB4wQQAAAAAeQEEAAAAAHlBBAAAAAB5gQQAAAAAecEEAAAAAHoBBAAAAAB6QQQAAAAAeoEEAAAAAHrBBAAAAAB7AQCAAAAAe0EAgAAAAHuBAIAAAAB7wQCAAAAAfAEAgAAAAHxBAIAAAAB8gQCAAAAAfMEAgAAAAH0BAIAAAAB9QQCAAAAAfYEAgAAAAH3BIAAAAABAgAAALICACAnAADWCQAgAwAAALUCACAnAADWCQAgKAAA2gkAIFcAAAC1AgAgEwAA7gYAICAAANoJACCWAwQAkwYAIcADAQDBBgAhwQMBAMEGACHRA0AAlgYAIagEAQDBBgAhqQQBAMEGACGqBAEAwQYAIasEAQDBBgAhrARAAJ4GACGtBAIA1AYAIa4EBACfBgAhrwQBAMEGACGwBAEAwQYAIbEEAgDUBgAhsgQCANQGACGzBAEAwQYAIbQEAQDBBgAhtQQCANQGACG2BAIA1AYAIbcEAgDUBgAhuAQCANQGACG5BAIA1AYAIboEAgDUBgAhuwQCANQGACG8BAIA1AYAIb0EAgDUBgAhvgQCANQGACG_BBAA3gYAIcAEEADeBgAhwQQQAN4GACHCBBAA3gYAIcMEEADeBgAhxAQQAN4GACHFBBAA3gYAIcYEEADeBgAhxwQQAN4GACHIBBAA3gYAIckEEADeBgAhygQQAN4GACHLBBAA3gYAIcwEEADeBgAhzQQQAN4GACHOBBAA3gYAIc8EEADeBgAh0AQQAN4GACHRBBAA3gYAIdIEEADeBgAh0wQQAN4GACHUBBAA3gYAIdUEEADeBgAh1gQQAN4GACHXBBAA3gYAIdgEEADeBgAh2QQQAN4GACHaBBAA3gYAIdsEEADeBgAh3AQQAN4GACHdBBAA3gYAId4EEADeBgAh3wQQAN4GACHgBBAA3gYAIeEEEADeBgAh4gQQAN4GACHjBBAA3gYAIeQEEADeBgAh5QQQAN4GACHmBBAA3gYAIecEEADeBgAh6AQQAN4GACHpBBAA3gYAIeoEEADeBgAh6wQQAN4GACHsBAIA1AYAIe0EAgDUBgAh7gQCANQGACHvBAIA1AYAIfAEAgDUBgAh8QQCANQGACHyBAIA1AYAIfMEAgDUBgAh9AQCANQGACH1BAIA1AYAIfYEAgDUBgAh9wSAAAAAAVUTAADuBgAglgMEAJMGACHAAwEAwQYAIcEDAQDBBgAh0QNAAJYGACGoBAEAwQYAIakEAQDBBgAhqgQBAMEGACGrBAEAwQYAIawEQACeBgAhrQQCANQGACGuBAQAnwYAIa8EAQDBBgAhsAQBAMEGACGxBAIA1AYAIbIEAgDUBgAhswQBAMEGACG0BAEAwQYAIbUEAgDUBgAhtgQCANQGACG3BAIA1AYAIbgEAgDUBgAhuQQCANQGACG6BAIA1AYAIbsEAgDUBgAhvAQCANQGACG9BAIA1AYAIb4EAgDUBgAhvwQQAN4GACHABBAA3gYAIcEEEADeBgAhwgQQAN4GACHDBBAA3gYAIcQEEADeBgAhxQQQAN4GACHGBBAA3gYAIccEEADeBgAhyAQQAN4GACHJBBAA3gYAIcoEEADeBgAhywQQAN4GACHMBBAA3gYAIc0EEADeBgAhzgQQAN4GACHPBBAA3gYAIdAEEADeBgAh0QQQAN4GACHSBBAA3gYAIdMEEADeBgAh1AQQAN4GACHVBBAA3gYAIdYEEADeBgAh1wQQAN4GACHYBBAA3gYAIdkEEADeBgAh2gQQAN4GACHbBBAA3gYAIdwEEADeBgAh3QQQAN4GACHeBBAA3gYAId8EEADeBgAh4AQQAN4GACHhBBAA3gYAIeIEEADeBgAh4wQQAN4GACHkBBAA3gYAIeUEEADeBgAh5gQQAN4GACHnBBAA3gYAIegEEADeBgAh6QQQAN4GACHqBBAA3gYAIesEEADeBgAh7AQCANQGACHtBAIA1AYAIe4EAgDUBgAh7wQCANQGACHwBAIA1AYAIfEEAgDUBgAh8gQCANQGACHzBAIA1AYAIfQEAgDUBgAh9QQCANQGACH2BAIA1AYAIfcEgAAAAAELDAAAuQcAIBYAALcHACAXAAC4BwAglgMEAAAAAZ0DQAAAAAGqAwEAAAABqwMEAAAAAbMDQAAAAAH9BEAAAAABgAUEAAAAAYEFIAAAAAECAAAAMwAgJwAA2wkAIAMAAAAxACAnAADbCQAgKAAA3wkAIA0AAAAxACAMAACYBwAgFgAAlgcAIBcAAJcHACAgAADfCQAglgMEAJMGACGdA0AAlgYAIaoDAQCUBgAhqwMEAJ8GACGzA0AAlgYAIf0EQACeBgAhgAUEAJMGACGBBSAAgwcAIQsMAACYBwAgFgAAlgcAIBcAAJcHACCWAwQAkwYAIZ0DQACWBgAhqgMBAJQGACGrAwQAnwYAIbMDQACWBgAh_QRAAJ4GACGABQQAkwYAIYEFIACDBwAhVRUAAPsGACCWAwQAAAABwAMBAAAAAcEDAQAAAAHRA0AAAAABqAQBAAAAAakEAQAAAAGqBAEAAAABqwQBAAAAAawEQAAAAAGtBAIAAAABrgQEAAAAAa8EAQAAAAGwBAEAAAABsQQCAAAAAbIEAgAAAAGzBAEAAAABtAQBAAAAAbUEAgAAAAG2BAIAAAABtwQCAAAAAbgEAgAAAAG5BAIAAAABugQCAAAAAbsEAgAAAAG8BAIAAAABvQQCAAAAAb4EAgAAAAG_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_QRAAJ4GACGABQQAkwYAIYEFIACDBwAhCwwAAJgHACASAACVBwAgFwAAlwcAIJYDBACTBgAhnQNAAJYGACGqAwEAlAYAIasDBACfBgAhswNAAJYGACH9BEAAngYAIYAFBACTBgAhgQUgAIMHACEWAwAA0QgAIAoAANIIACAMAADUCAAgDQAA1QgAIA4AANYIACAPAADXCAAglgMEAAAAAZ0DQAAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH9BEAAAAABmAVAAAAAAZkFQAAAAAGaBQgAAAABmwUIAAAAAZwFAQAAAAGdBQEAAAABngUBAAAAAZ8FAQAAAAGgBQEAAAABoQUBAAAAAQIAAAAFACAnAADqCQAgAwAAAAMAICcAAOoJACAoAADuCQAgGAAAAAMAIAMAAIwIACAKAACNCAAgDAAAjwgAIA0AAJAIACAOAACRCAAgDwAAkggAICAAAO4JACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACGhBQEAlAYAIRYDAACMCAAgCgAAjQgAIAwAAI8IACANAACQCAAgDgAAkQgAIA8AAJIIACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACGhBQEAlAYAIRYDAADRCAAgCgAA0ggAIAsAANMIACAMAADUCAAgDgAA1ggAIA8AANcIACCWAwQAAAABnQNAAAAAAbMDQAAAAAH4BAEAAAAB-QQBAAAAAf0EQAAAAAGYBUAAAAABmQVAAAAAAZoFCAAAAAGbBQgAAAABnAUBAAAAAZ0FAQAAAAGeBQEAAAABnwUBAAAAAaAFAQAAAAGhBQEAAAABAgAAAAUAICcAAO8JACADAAAAAwAgJwAA7wkAICgAAPMJACAYAAAAAwAgAwAAjAgAIAoAAI0IACALAACOCAAgDAAAjwgAIA4AAJEIACAPAACSCAAgIAAA8wkAIJYDBACTBgAhnQNAAJYGACGzA0AAlgYAIfgEAQCUBgAh-QQBAJQGACH9BEAAngYAIZgFQACeBgAhmQVAAJ4GACGaBQgAzAYAIZsFCADMBgAhnAUBAMEGACGdBQEAwQYAIZ4FAQDBBgAhnwUBAMEGACGgBQEAwQYAIaEFAQCUBgAhFgMAAIwIACAKAACNCAAgCwAAjggAIAwAAI8IACAOAACRCAAgDwAAkggAIJYDBACTBgAhnQNAAJYGACGzA0AAlgYAIfgEAQCUBgAh-QQBAJQGACH9BEAAngYAIZgFQACeBgAhmQVAAJ4GACGaBQgAzAYAIZsFCADMBgAhnAUBAMEGACGdBQEAwQYAIZ4FAQDBBgAhnwUBAMEGACGgBQEAwQYAIaEFAQCUBgAhFgMAANEIACAKAADSCAAgCwAA0wgAIAwAANQIACANAADVCAAgDwAA1wgAIJYDBAAAAAGdA0AAAAABswNAAAAAAfgEAQAAAAH5BAEAAAAB_QRAAAAAAZgFQAAAAAGZBUAAAAABmgUIAAAAAZsFCAAAAAGcBQEAAAABnQUBAAAAAZ4FAQAAAAGfBQEAAAABoAUBAAAAAaEFAQAAAAECAAAABQAgJwAA9AkAIAMAAAADACAnAAD0CQAgKAAA-AkAIBgAAAADACADAACMCAAgCgAAjQgAIAsAAI4IACAMAACPCAAgDQAAkAgAIA8AAJIIACAgAAD4CQAglgMEAJMGACGdA0AAlgYAIbMDQACWBgAh-AQBAJQGACH5BAEAlAYAIf0EQACeBgAhmAVAAJ4GACGZBUAAngYAIZoFCADMBgAhmwUIAMwGACGcBQEAwQYAIZ0FAQDBBgAhngUBAMEGACGfBQEAwQYAIaAFAQDBBgAhoQUBAJQGACEWAwAAjAgAIAoAAI0IACALAACOCAAgDAAAjwgAIA0AAJAIACAPAACSCAAglgMEAJMGACGdA0AAlgYAIbMDQACWBgAh-AQBAJQGACH5BAEAlAYAIf0EQACeBgAhmAVAAJ4GACGZBUAAngYAIZoFCADMBgAhmwUIAMwGACGcBQEAwQYAIZ0FAQDBBgAhngUBAMEGACGfBQEAwQYAIaAFAQDBBgAhoQUBAJQGACEWAwAA0QgAIAoAANIIACALAADTCAAgDAAA1AgAIA0AANUIACAOAADWCAAglgMEAAAAAZ0DQAAAAAGzA0AAAAAB-AQBAAAAAfkEAQAAAAH9BEAAAAABmAVAAAAAAZkFQAAAAAGaBQgAAAABmwUIAAAAAZwFAQAAAAGdBQEAAAABngUBAAAAAZ8FAQAAAAGgBQEAAAABoQUBAAAAAQIAAAAFACAnAAD5CQAgAwAAAAMAICcAAPkJACAoAAD9CQAgGAAAAAMAIAMAAIwIACAKAACNCAAgCwAAjggAIAwAAI8IACANAACQCAAgDgAAkQgAICAAAP0JACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACGhBQEAlAYAIRYDAACMCAAgCgAAjQgAIAsAAI4IACAMAACPCAAgDQAAkAgAIA4AAJEIACCWAwQAkwYAIZ0DQACWBgAhswNAAJYGACH4BAEAlAYAIfkEAQCUBgAh_QRAAJ4GACGYBUAAngYAIZkFQACeBgAhmgUIAMwGACGbBQgAzAYAIZwFAQDBBgAhnQUBAMEGACGeBQEAwQYAIZ8FAQDBBgAhoAUBAMEGACGhBQEAlAYAIQUIABQQBgIYNA0ZRQEaRwEIAwoDCAAMChsECx8IDAABDSEJDiUKDyoLAgQAAgkMBAUDDQMEAAIGEQUHFQYIAAcBBQAEAQUABAMDFgAGFwAHGAABBAACAQQAAgEEJgIBBCsCBQMsAAotAAsuAA4vAA8wAAUIABMMAAESOA4WPA8XQRIBEQANAhEADRQAEAITPQ8VPxEBFAAQAREADQISQgAWQwADEEgAGEkAGkoAAAEZVAEBGVoBBQgAGS0AGi4AGy8AHDAAHQAAAAAABQgAGS0AGi4AGy8AHDAAHQEMAAEBDAABBQgAIi0AIy4AJC8AJTAAJgAAAAAABQgAIi0AIy4AJC8AJTAAJgEEAAIBBAACBQgAKy0ALC4ALS8ALjAALwAAAAAABQgAKy0ALC4ALS8ALjAALwEFAAQBBQAEBQgANC0ANS4ANi8ANzAAOAAAAAAABQgANC0ANS4ANi8ANzAAOAEFAAQBBQAEBQgAPS0APi4APy8AQDAAQQAAAAAABQgAPS0APi4APy8AQDAAQQAAAAUIAEctAEguAEkvAEowAEsAAAAAAAUIAEctAEguAEkvAEowAEsAAAAFCABRLQBSLgBTLwBUMABVAAAAAAAFCABRLQBSLgBTLwBUMABVAQwAAQEMAAEFCABaLQBbLgBcLwBdMABeAAAAAAAFCABaLQBbLgBcLwBdMABeAREADQERAA0FCABjLQBkLgBlLwBmMABnAAAAAAAFCABjLQBkLgBlLwBmMABnAgQAAgmkAgQCBAACCaoCBAUIAGwtAG0uAG4vAG8wAHAAAAAAAAUIAGwtAG0uAG4vAG8wAHAAAAUIAHUtAHYuAHcvAHgwAHkAAAAAAAUIAHUtAHYuAHcvAHgwAHkBFAAQARQAEAUIAH4tAH8uAIABLwCBATAAggEAAAAAAAUIAH4tAH8uAIABLwCBATAAggEBEQANAREADQUIAIcBLQCIAS4AiQEvAIoBMACLAQAAAAAABQgAhwEtAIgBLgCJAS8AigEwAIsBAhEADRQAEAIRAA0UABAFCACQAS0AkQEuAJIBLwCTATAAlAEAAAAAAAUIAJABLQCRAS4AkgEvAJMBMACUAQEEAAIBBAACBQgAmQEtAJoBLgCbAS8AnAEwAJ0BAAAAAAAFCACZAS0AmgEuAJsBLwCcATAAnQEAAAAFCACjAS0ApAEuAKUBLwCmATAApwEAAAAAAAUIAKMBLQCkAS4ApQEvAKYBMACnAQAAAAUIAK0BLQCuAS4ArwEvALABMACxAQAAAAAABQgArQEtAK4BLgCvAS8AsAEwALEBAAAABQgAtwEtALgBLgC5AS8AugEwALsBAAAAAAAFCAC3AS0AuAEuALkBLwC6ATAAuwEAAAAFCADBAS0AwgEuAMMBLwDEATAAxQEAAAAAAAUIAMEBLQDCAS4AwwEvAMQBMADFAQEEAAIBBAACBQgAygEtAMsBLgDMAS8AzQEwAM4BAAAAAAAFCADKAS0AywEuAMwBLwDNATAAzgEBBKsEAgEEsQQCBQgA0wEtANQBLgDVAS8A1gEwANcBAAAAAAAFCADTAS0A1AEuANUBLwDWATAA1wEBBMMEAgEEyQQCBQgA3AEtAN0BLgDeAS8A3wEwAOABAAAAAAAFCADcAS0A3QEuAN4BLwDfATAA4AEAAAAFCADmAS0A5wEuAOgBLwDpATAA6gEAAAAAAAUIAOYBLQDnAS4A6AEvAOkBMADqARsCARxLAR1MAR5NAR9OASFQASJSFSNTFiRWASVYFSZZFylbASpcAStdFTFgGDJhHjNiAjRjAjVkAjZlAjdmAjhoAjlqFTprHzttAjxvFT1wID5xAj9yAkBzFUF2IUJ3J0N4BER5BEV6BEZ7BEd8BEh-BEmAARVKgQEoS4MBBEyFARVNhgEpTocBBE-IAQRQiQEVUYwBKlKNATBTjgEFVI8BBVWQAQVWkQEFV5IBBViUAQVZlgEVWpcBMVuZAQVcmwEVXZwBMl6dAQVfngEFYJ8BFWGiATNiowE5Y6QBBmSlAQZlpgEGZqcBBmeoAQZoqgEGaawBFWqtATprrwEGbLEBFW2yATtuswEGb7QBBnC1ARVxuAE8crkBQnO7AUN0vAFDdb8BQ3bAAUN3wQFDeMMBQ3nFARV6xgFEe8gBQ3zKARV9ywFFfswBQ3_NAUOAAc4BFYEB0QFGggHSAUyDAdQBTYQB1QFNhQHYAU2GAdkBTYcB2gFNiAHcAU2JAd4BFYoB3wFOiwHhAU2MAeMBFY0B5AFPjgHlAU2PAeYBTZAB5wEVkQHqAVCSAesBVpMB7AENlAHtAQ2VAe4BDZYB7wENlwHwAQ2YAfIBDZkB9AEVmgH1AVebAfcBDZwB-QEVnQH6AVieAfsBDZ8B_AENoAH9ARWhAYACWaIBgQJfowGDAhKkAYQCEqUBhgISpgGHAhKnAYgCEqgBigISqQGMAhWqAY0CYKsBjwISrAGRAhWtAZICYa4BkwISrwGUAhKwAZUCFbEBmAJisgGZAmizAZoCA7QBmwIDtQGcAgO2AZ0CA7cBngIDuAGgAgO5AaICFboBowJpuwGmAgO8AagCFb0BqQJqvgGrAgO_AawCA8ABrQIVwQGwAmvCAbECccMBswIQxAG0AhDFAbcCEMYBuAIQxwG5AhDIAbsCEMkBvQIVygG-AnLLAcACEMwBwgIVzQHDAnPOAcQCEM8BxQIQ0AHGAhXRAckCdNIBygJ60wHMAhHUAc0CEdUBzwIR1gHQAhHXAdECEdgB0wIR2QHVAhXaAdYCe9sB2AIR3AHaAhXdAdsCfN4B3AIR3wHdAhHgAd4CFeEB4QJ94gHiAoMB4wHjAg7kAeQCDuUB5QIO5gHmAg7nAecCDugB6QIO6QHrAhXqAewChAHrAe4CDuwB8AIV7QHxAoUB7gHyAg7vAfMCDvAB9AIV8QH3AoYB8gH4AowB8wH5Ag_0AfoCD_UB-wIP9gH8Ag_3Af0CD_gB_wIP-QGBAxX6AYIDjQH7AYQDD_wBhgMV_QGHA44B_gGIAw__AYkDD4ACigMVgQKNA48BggKOA5UBgwKPAwiEApADCIUCkQMIhgKSAwiHApMDCIgClQMIiQKXAxWKApgDlgGLApoDCIwCnAMVjQKdA5cBjgKeAwiPAp8DCJACoAMVkQKjA5gBkgKkA54BkwKmA58BlAKnA58BlQKqA58BlgKrA58BlwKsA58BmAKuA58BmQKwAxWaArEDoAGbArMDnwGcArUDFZ0CtgOhAZ4CtwOfAZ8CuAOfAaACuQMVoQK8A6IBogK9A6gBowK_A6kBpALAA6kBpQLDA6kBpgLEA6kBpwLFA6kBqALHA6kBqQLJAxWqAsoDqgGrAswDqQGsAs4DFa0CzwOrAa4C0AOpAa8C0QOpAbAC0gMVsQLVA6wBsgLWA7IBswLYA7MBtALZA7MBtQLcA7MBtgLdA7MBtwLeA7MBuALgA7MBuQLiAxW6AuMDtAG7AuUDswG8AucDFb0C6AO1Ab4C6QOzAb8C6gOzAcAC6wMVwQLuA7YBwgLvA7wBwwLxA70BxALyA70BxQL1A70BxgL2A70BxwL3A70ByAL5A70ByQL7AxXKAvwDvgHLAv4DvQHMAoAEFc0CgQS_Ac4CggS9Ac8CgwS9AdAChAQV0QKHBMAB0gKIBMYB0wKKBAnUAosECdUCjQQJ1gKOBAnXAo8ECdgCkQQJ2QKTBBXaApQExwHbApYECdwCmAQV3QKZBMgB3gKaBAnfApsECeACnAQV4QKfBMkB4gKgBM8B4wKhBArkAqIECuUCowQK5gKkBArnAqUECugCpwQK6QKpBBXqAqoE0AHrAq0ECuwCrwQV7QKwBNEB7gKyBArvArMECvACtAQV8QK3BNIB8gK4BNgB8wK5BAv0AroEC_UCuwQL9gK8BAv3Ar0EC_gCvwQL-QLBBBX6AsIE2QH7AsUEC_wCxwQV_QLIBNoB_gLKBAv_AssEC4ADzAQVgQPPBNsBggPQBOEBgwPSBOIBhAPTBOIBhQPWBOIBhgPXBOIBhwPYBOIBiAPaBOIBiQPcBBWKA90E4wGLA98E4gGMA-EEFY0D4gTkAY4D4wTiAY8D5ATiAZAD5QQVkQPoBOUBkgPpBOsB"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await __turbopack_context__.A("[externals]/node:buffer [external] (node:buffer, cjs, async loader)");
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async ()=>await __turbopack_context__.A("[externals]/@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs [external] (@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs, esm_import, [project]/node_modules/@prisma/client, async loader)"),
    getQueryCompilerWasmModule: async ()=>{
        const { wasm } = await __turbopack_context__.A("[externals]/@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs [external] (@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs, esm_import, [project]/node_modules/@prisma/client, async loader)");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["getPrismaClient"](config);
}
}),
"[project]/src/server/db/generated/prisma/internal/prismaNamespace.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertEventScalarFieldEnum",
    ()=>AlertEventScalarFieldEnum,
    "AnyNull",
    ()=>AnyNull,
    "DbNull",
    ()=>DbNull,
    "Decimal",
    ()=>Decimal,
    "DeviceAlertStateScalarFieldEnum",
    ()=>DeviceAlertStateScalarFieldEnum,
    "DeviceConnectionStatusScalarFieldEnum",
    ()=>DeviceConnectionStatusScalarFieldEnum,
    "DeviceCurrentStatusScalarFieldEnum",
    ()=>DeviceCurrentStatusScalarFieldEnum,
    "DeviceDailySummaryPerLineChartScalarFieldEnum",
    ()=>DeviceDailySummaryPerLineChartScalarFieldEnum,
    "DeviceDailySummaryScalarFieldEnum",
    ()=>DeviceDailySummaryScalarFieldEnum,
    "DeviceDataloggerScalarFieldEnum",
    ()=>DeviceDataloggerScalarFieldEnum,
    "DeviceInverterScalarFieldEnum",
    ()=>DeviceInverterScalarFieldEnum,
    "DeviceInvertorStatusScalarFieldEnum",
    ()=>DeviceInvertorStatusScalarFieldEnum,
    "DeviceLogsLatestScalarFieldEnum",
    ()=>DeviceLogsLatestScalarFieldEnum,
    "DeviceLogsScalarFieldEnum",
    ()=>DeviceLogsScalarFieldEnum,
    "DeviceRemoteSettingScalarFieldEnum",
    ()=>DeviceRemoteSettingScalarFieldEnum,
    "DeviceRemoteSettingTaskScalarFieldEnum",
    ()=>DeviceRemoteSettingTaskScalarFieldEnum,
    "DeviceStatusHistoryScalarFieldEnum",
    ()=>DeviceStatusHistoryScalarFieldEnum,
    "FaultDictionaryScalarFieldEnum",
    ()=>FaultDictionaryScalarFieldEnum,
    "FotaScalarFieldEnum",
    ()=>FotaScalarFieldEnum,
    "Information_dataScalarFieldEnum",
    ()=>Information_dataScalarFieldEnum,
    "JsonNull",
    ()=>JsonNull,
    "JsonNullValueFilter",
    ()=>JsonNullValueFilter,
    "JsonNullValueInput",
    ()=>JsonNullValueInput,
    "ModelName",
    ()=>ModelName,
    "NullTypes",
    ()=>NullTypes,
    "NullableJsonNullValueInput",
    ()=>NullableJsonNullValueInput,
    "NullsOrder",
    ()=>NullsOrder,
    "PlantCurrentStatusScalarFieldEnum",
    ()=>PlantCurrentStatusScalarFieldEnum,
    "PlantScalarFieldEnum",
    ()=>PlantScalarFieldEnum,
    "PrismaClientInitializationError",
    ()=>PrismaClientInitializationError,
    "PrismaClientKnownRequestError",
    ()=>PrismaClientKnownRequestError,
    "PrismaClientRustPanicError",
    ()=>PrismaClientRustPanicError,
    "PrismaClientUnknownRequestError",
    ()=>PrismaClientUnknownRequestError,
    "PrismaClientValidationError",
    ()=>PrismaClientValidationError,
    "QueryMode",
    ()=>QueryMode,
    "RemoteSettingCommandMasterScalarFieldEnum",
    ()=>RemoteSettingCommandMasterScalarFieldEnum,
    "RemoteSettingParameterMasterScalarFieldEnum",
    ()=>RemoteSettingParameterMasterScalarFieldEnum,
    "SortOrder",
    ()=>SortOrder,
    "Sql",
    ()=>Sql,
    "TransactionIsolationLevel",
    ()=>TransactionIsolationLevel,
    "UserPlantInverterMapScalarFieldEnum",
    ()=>UserPlantInverterMapScalarFieldEnum,
    "UserScalarFieldEnum",
    ()=>UserScalarFieldEnum,
    "defineExtension",
    ()=>defineExtension,
    "empty",
    ()=>empty,
    "getExtensionContext",
    ()=>getExtensionContext,
    "join",
    ()=>join,
    "prismaVersion",
    ()=>prismaVersion,
    "raw",
    ()=>raw,
    "sql",
    ()=>sql
]);
/* !!! This is code generated by Prisma. Do not edit directly. !!! */ /* eslint-disable */ // biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * WARNING: This is an internal file that is subject to change!
 *
 * 🛑 Under no circumstances should you import this file directly! 🛑
 *
 * All exports from this file are wrapped under a `Prisma` namespace object in the client.ts file.
 * While this enables partial backward compatibility, it is not part of the stable public API.
 *
 * If you are looking for your Models, Enums, and Input Types, please import them from the respective
 * model files in the `model` directory!
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client/runtime/client [external] (@prisma/client/runtime/client, cjs, [project]/node_modules/@prisma/client)");
;
const PrismaClientKnownRequestError = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClientKnownRequestError"];
const PrismaClientUnknownRequestError = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClientUnknownRequestError"];
const PrismaClientRustPanicError = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClientRustPanicError"];
const PrismaClientInitializationError = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClientInitializationError"];
const PrismaClientValidationError = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClientValidationError"];
const sql = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["sqltag"];
const empty = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["empty"];
const join = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["join"];
const raw = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["raw"];
const Sql = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Sql"];
const Decimal = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"];
const getExtensionContext = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Extensions"].getExtensionContext;
const prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
const NullTypes = {
    DbNull: __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["NullTypes"].DbNull,
    JsonNull: __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["NullTypes"].JsonNull,
    AnyNull: __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["NullTypes"].AnyNull
};
const DbNull = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["DbNull"];
const JsonNull = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["JsonNull"];
const AnyNull = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["AnyNull"];
const ModelName = {
    User: 'User',
    Plant: 'Plant',
    DeviceInverter: 'DeviceInverter',
    DeviceRemoteSetting: 'DeviceRemoteSetting',
    DeviceRemoteSettingTask: 'DeviceRemoteSettingTask',
    RemoteSettingParameterMaster: 'RemoteSettingParameterMaster',
    RemoteSettingCommandMaster: 'RemoteSettingCommandMaster',
    UserPlantInverterMap: 'UserPlantInverterMap',
    DeviceInvertorStatus: 'DeviceInvertorStatus',
    DeviceDatalogger: 'DeviceDatalogger',
    DeviceLogs: 'DeviceLogs',
    DeviceLogsLatest: 'DeviceLogsLatest',
    DeviceDailySummary: 'DeviceDailySummary',
    DeviceDailySummaryPerLineChart: 'DeviceDailySummaryPerLineChart',
    information_data: 'information_data',
    DeviceConnectionStatus: 'DeviceConnectionStatus',
    fota: 'fota',
    DeviceCurrentStatus: 'DeviceCurrentStatus',
    DeviceStatusHistory: 'DeviceStatusHistory',
    PlantCurrentStatus: 'PlantCurrentStatus',
    DeviceAlertState: 'DeviceAlertState',
    AlertEvent: 'AlertEvent',
    FaultDictionary: 'FaultDictionary'
};
const TransactionIsolationLevel = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["makeStrictEnum"]({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
const UserScalarFieldEnum = {
    id: 'id',
    account: 'account',
    email: 'email',
    passwordHash: 'passwordHash',
    portal: 'portal',
    role: 'role',
    status: 'status',
    assignedById: 'assignedById',
    timezone: 'timezone',
    phone: 'phone',
    address: 'address',
    emailVerifiedAt: 'emailVerifiedAt',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isDeleted: 'isDeleted',
    deletedAt: 'deletedAt'
};
const PlantScalarFieldEnum = {
    id: 'id',
    name: 'name',
    type: 'type',
    installed: 'installed',
    lastUpdatedAt: 'lastUpdatedAt',
    kwp: 'kwp',
    price: 'price',
    priceUnit: 'priceUnit',
    longitude: 'longitude',
    latitude: 'latitude',
    address: 'address',
    pictureFileId: 'pictureFileId',
    userAccount: 'userAccount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
const DeviceInverterScalarFieldEnum = {
    id: 'id',
    name: 'name',
    type: 'type',
    serialNumber: 'serialNumber',
    updateTime: 'updateTime',
    plantId: 'plantId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
const DeviceRemoteSettingScalarFieldEnum = {
    id: 'id',
    deviceInverterId: 'deviceInverterId',
    tab: 'tab',
    settings: 'settings',
    updatedById: 'updatedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
const DeviceRemoteSettingTaskScalarFieldEnum = {
    id: 'id',
    deviceInverterId: 'deviceInverterId',
    kind: 'kind',
    tab: 'tab',
    payload: 'payload',
    status: 'status',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
const RemoteSettingParameterMasterScalarFieldEnum = {
    id: 'id',
    tab: 'tab',
    tabLabel: 'tabLabel',
    fieldKey: 'fieldKey',
    label: 'label',
    dataType: 'dataType',
    unitOrOptions: 'unitOrOptions',
    endpointPath: 'endpointPath',
    displayOrder: 'displayOrder',
    count: 'count',
    registerAddress: 'registerAddress',
    registerType: 'registerType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
const RemoteSettingCommandMasterScalarFieldEnum = {
    id: 'id',
    commandKey: 'commandKey',
    label: 'label',
    endpointPath: 'endpointPath',
    displayOrder: 'displayOrder',
    count: 'count',
    registerAddress: 'registerAddress',
    registerType: 'registerType',
    createdAt: 'createdAt'
};
const UserPlantInverterMapScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    plantId: 'plantId',
    serialNumber: 'serialNumber',
    isDeleted: 'isDeleted',
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
const DeviceInvertorStatusScalarFieldEnum = {
    id: 'id',
    deviceSno: 'deviceSno',
    latestTimeState: 'latestTimeState',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
const DeviceDataloggerScalarFieldEnum = {
    id: 'id',
    name: 'name',
    type: 'type',
    serialNumber: 'serialNumber',
    online: 'online',
    status: 'status',
    updateTime: 'updateTime',
    plantId: 'plantId',
    inverterId: 'inverterId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
const DeviceLogsScalarFieldEnum = {
    id: 'id',
    sno: 'sno',
    logger_status: 'logger_status',
    connected_plant: 'connected_plant',
    module_version_no: 'module_version_no',
    extended_system_version: 'extended_system_version',
    data_acquisition_period: 'data_acquisition_period',
    max_connected_devices: 'max_connected_devices',
    signal_strength: 'signal_strength',
    module_mac_address: 'module_mac_address',
    router_ssid: 'router_ssid',
    inverter_type: 'inverter_type',
    production_compliance_country: 'production_compliance_country',
    device_model: 'device_model',
    firmware_version: 'firmware_version',
    production_type: 'production_type',
    rated_power: 'rated_power',
    phases: 'phases',
    mppt_no: 'mppt_no',
    inverter_parameter_count: 'inverter_parameter_count',
    logger_parameter_count: 'logger_parameter_count',
    protocol_version: 'protocol_version',
    comm_software_version_1: 'comm_software_version_1',
    comm_software_version_2: 'comm_software_version_2',
    control_software_version: 'control_software_version',
    dc_voltage_1: 'dc_voltage_1',
    dc_voltage_2: 'dc_voltage_2',
    dc_voltage_3: 'dc_voltage_3',
    dc_voltage_4: 'dc_voltage_4',
    dc_voltage_5: 'dc_voltage_5',
    dc_voltage_6: 'dc_voltage_6',
    dc_voltage_7: 'dc_voltage_7',
    dc_voltage_8: 'dc_voltage_8',
    dc_voltage_9: 'dc_voltage_9',
    dc_current_1: 'dc_current_1',
    dc_current_2: 'dc_current_2',
    dc_current_3: 'dc_current_3',
    dc_current_4: 'dc_current_4',
    dc_current_5: 'dc_current_5',
    dc_current_6: 'dc_current_6',
    dc_current_7: 'dc_current_7',
    dc_current_8: 'dc_current_8',
    dc_current_9: 'dc_current_9',
    dc_power_1: 'dc_power_1',
    dc_power_2: 'dc_power_2',
    dc_power_3: 'dc_power_3',
    dc_power_4: 'dc_power_4',
    dc_power_5: 'dc_power_5',
    dc_power_6: 'dc_power_6',
    dc_power_7: 'dc_power_7',
    dc_power_8: 'dc_power_8',
    dc_power_9: 'dc_power_9',
    total_input_power: 'total_input_power',
    grid_total_active_power: 'grid_total_active_power',
    grid_total_reactive_power: 'grid_total_reactive_power',
    ac_voltage_a: 'ac_voltage_a',
    ac_voltage_b: 'ac_voltage_b',
    ac_voltage_c: 'ac_voltage_c',
    ac_current_a: 'ac_current_a',
    ac_current_b: 'ac_current_b',
    ac_current_c: 'ac_current_c',
    ac_power_a: 'ac_power_a',
    ac_power_b: 'ac_power_b',
    ac_power_c: 'ac_power_c',
    daily_production: 'daily_production',
    ac_output_frequency: 'ac_output_frequency',
    temperature_1: 'temperature_1',
    temperature_2: 'temperature_2',
    temperature_3: 'temperature_3',
    total_production: 'total_production',
    fault_registers: 'fault_registers',
    fault_1: 'fault_1',
    fault_2: 'fault_2',
    fault_3: 'fault_3',
    fault_4: 'fault_4',
    fault_5: 'fault_5',
    grid_status: 'grid_status',
    inverter_status: 'inverter_status',
    temperature_count: 'temperature_count',
    total_generation_time: 'total_generation_time',
    timestamp: 'timestamp',
    mac_address: 'mac_address',
    message_type: 'message_type',
    hybrid_json: 'hybrid_json'
};
const DeviceLogsLatestScalarFieldEnum = {
    id: 'id',
    sno: 'sno',
    inverterName: 'inverterName',
    dayDate: 'dayDate',
    latestTimestamp: 'latestTimestamp',
    sourceLogId: 'sourceLogId',
    batchKey: 'batchKey',
    dailyProduction: 'dailyProduction',
    totalEnergy: 'totalEnergy',
    totalHours: 'totalHours',
    currentPower: 'currentPower',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
const DeviceDailySummaryScalarFieldEnum = {
    id: 'id',
    sno: 'sno',
    dayDate: 'dayDate',
    currentPower: 'currentPower',
    eToday: 'eToday',
    eTotal: 'eTotal',
    hTotal: 'hTotal',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
const DeviceDailySummaryPerLineChartScalarFieldEnum = {
    id: 'id',
    sno: 'sno',
    dayDate: 'dayDate',
    timestamp: 'timestamp',
    sourceLogId: 'sourceLogId',
    lineWindowMinutes: 'lineWindowMinutes',
    maxPoints: 'maxPoints',
    loggerStatus: 'loggerStatus',
    connectedPlant: 'connectedPlant',
    moduleVersionNo: 'moduleVersionNo',
    extendedSystemVersion: 'extendedSystemVersion',
    dataAcquisitionPeriod: 'dataAcquisitionPeriod',
    maxConnectedDevices: 'maxConnectedDevices',
    signalStrength: 'signalStrength',
    moduleMacAddress: 'moduleMacAddress',
    routerSsid: 'routerSsid',
    inverterType: 'inverterType',
    productionComplianceCountry: 'productionComplianceCountry',
    ratedPower: 'ratedPower',
    mpptNo: 'mpptNo',
    protocolVersion: 'protocolVersion',
    commSoftwareVersion1: 'commSoftwareVersion1',
    commSoftwareVersion2: 'commSoftwareVersion2',
    controlSoftwareVersion: 'controlSoftwareVersion',
    deviceModel: 'deviceModel',
    firmwareVersion: 'firmwareVersion',
    productionType: 'productionType',
    dcVoltage1: 'dcVoltage1',
    dcVoltage2: 'dcVoltage2',
    dcVoltage3: 'dcVoltage3',
    dcVoltage4: 'dcVoltage4',
    dcVoltage5: 'dcVoltage5',
    dcVoltage6: 'dcVoltage6',
    dcVoltage7: 'dcVoltage7',
    dcVoltage8: 'dcVoltage8',
    dcCurrent1: 'dcCurrent1',
    dcCurrent2: 'dcCurrent2',
    dcCurrent3: 'dcCurrent3',
    dcCurrent4: 'dcCurrent4',
    dcCurrent5: 'dcCurrent5',
    dcCurrent6: 'dcCurrent6',
    dcCurrent7: 'dcCurrent7',
    dcCurrent8: 'dcCurrent8',
    dcPower1: 'dcPower1',
    dcPower2: 'dcPower2',
    dcPower3: 'dcPower3',
    dcPower4: 'dcPower4',
    dcPower5: 'dcPower5',
    dcPower6: 'dcPower6',
    dcPower7: 'dcPower7',
    dcPower8: 'dcPower8',
    acVoltageA: 'acVoltageA',
    acVoltageB: 'acVoltageB',
    acVoltageC: 'acVoltageC',
    acCurrentA: 'acCurrentA',
    acCurrentB: 'acCurrentB',
    acCurrentC: 'acCurrentC',
    acPowerA: 'acPowerA',
    acPowerB: 'acPowerB',
    acPowerC: 'acPowerC',
    fault1: 'fault1',
    fault2: 'fault2',
    fault3: 'fault3',
    fault4: 'fault4',
    fault5: 'fault5',
    totalInputPower: 'totalInputPower',
    gridTotalActivePower: 'gridTotalActivePower',
    gridTotalReactivePower: 'gridTotalReactivePower',
    dailyProduction: 'dailyProduction',
    gridStatus: 'gridStatus',
    inverterStatus: 'inverterStatus',
    acOutputFrequency: 'acOutputFrequency',
    temperature1: 'temperature1',
    temperature2: 'temperature2',
    temperature3: 'temperature3',
    totalProduction: 'totalProduction',
    totalGenerationTime: 'totalGenerationTime',
    macAddress: 'macAddress',
    messageType: 'messageType',
    hybridJson: 'hybridJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    dcVoltage9: 'dcVoltage9'
};
const Information_dataScalarFieldEnum = {
    id: 'id',
    input_power: 'input_power',
    co2: 'co2',
    tree_planting: 'tree_planting',
    efficiency: 'efficiency',
    weather: 'weather',
    irradiance: 'irradiance',
    cell_temperature: 'cell_temperature',
    plantid: 'plantid',
    created_at: 'created_at',
    updated_at: 'updated_at'
};
const DeviceConnectionStatusScalarFieldEnum = {
    id: 'id',
    serialNumber: 'serialNumber',
    macAddress: 'macAddress',
    status: 'status',
    lastSeenTime: 'lastSeenTime'
};
const FotaScalarFieldEnum = {
    id: 'id',
    mac_address: 'mac_address',
    firmware: 'firmware',
    link: 'link'
};
const DeviceCurrentStatusScalarFieldEnum = {
    id: 'id',
    sno: 'sno',
    status: 'status',
    lastTelemetryAt: 'lastTelemetryAt',
    updatedAt: 'updatedAt'
};
const DeviceStatusHistoryScalarFieldEnum = {
    id: 'id',
    sno: 'sno',
    plantId: 'plantId',
    status: 'status',
    createdAt: 'createdAt'
};
const PlantCurrentStatusScalarFieldEnum = {
    id: 'id',
    plantId: 'plantId',
    status: 'status',
    totalDevices: 'totalDevices',
    normalCount: 'normalCount',
    abnormalCount: 'abnormalCount',
    standbyCount: 'standbyCount',
    offlineCount: 'offlineCount',
    updatedAt: 'updatedAt'
};
const DeviceAlertStateScalarFieldEnum = {
    id: 'id',
    serialNumber: 'serialNumber',
    plantId: 'plantId',
    alertMatrix: 'alertMatrix',
    activeAlertCount: 'activeAlertCount',
    lastTelemetryAt: 'lastTelemetryAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
const AlertEventScalarFieldEnum = {
    id: 'id',
    serialNumber: 'serialNumber',
    plantId: 'plantId',
    registerNo: 'registerNo',
    bitPosition: 'bitPosition',
    faultCode: 'faultCode',
    faultMessage: 'faultMessage',
    status: 'status',
    raisedAt: 'raisedAt',
    clearedAt: 'clearedAt',
    createdAt: 'createdAt'
};
const FaultDictionaryScalarFieldEnum = {
    id: 'id',
    registerName: 'registerName',
    registerAddr: 'registerAddr',
    registerNo: 'registerNo',
    bitPosition: 'bitPosition',
    faultCode: 'faultCode',
    faultMessage: 'faultMessage',
    createdAt: 'createdAt'
};
const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
const JsonNullValueInput = {
    JsonNull: JsonNull
};
const NullableJsonNullValueInput = {
    DbNull: DbNull,
    JsonNull: JsonNull
};
const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
const NullsOrder = {
    first: 'first',
    last: 'last'
};
const JsonNullValueFilter = {
    DbNull: DbNull,
    JsonNull: JsonNull,
    AnyNull: AnyNull
};
const defineExtension = __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Extensions"].defineExtension;
}),
"[project]/src/server/db/generated/prisma/client.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/* !!! This is code generated by Prisma. Do not edit directly. !!! */ /* eslint-disable */ // biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file should be your main import to use Prisma. Through it you get access to all the models, enums, and input types.
 * If you're looking for something you can import in the client-side of your application, please refer to the `browser.ts` file instead.
 *
 * 🟢 You can import this file directly.
 */ __turbopack_context__.s([
    "PrismaClient",
    ()=>PrismaClient
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:url [external] (node:url, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$internal$2f$class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/generated/prisma/internal/class.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/generated/prisma/internal/prismaNamespace.ts [app-route] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("src/server/db/generated/prisma/client.ts")}`;
    },
    get turbopackHot () {
        return __turbopack_context__.m.hot;
    }
};
;
;
globalThis['__dirname'] = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["dirname"]((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__["fileURLToPath"])(__TURBOPACK__import$2e$meta__.url));
;
;
;
;
const PrismaClient = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$internal$2f$class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPrismaClientClass"]();
;
}),
"[project]/src/server/db/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/adapter-pg/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/server/db/generated/prisma/client.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/request-context.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is not configured');
    }
    const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PrismaClient"]({
        adapter: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaPg"]({
            connectionString
        }),
        log: [
            {
                level: 'query',
                emit: 'event'
            }
        ]
    });
    // Capture raw SQL query details (query text, params, duration)
    client.$on('query', (event)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["trackDbQuery"])({
            query: event.query,
            params: event.params,
            durationMs: event.duration,
            target: event.target,
            type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectQueryType"])(event.query)
        });
    });
    // Capture ORM operation results (rows returned, affected count, etc.)
    return client.$extends({
        query: {
            $allModels: {
                async $allOperations ({ args, query }) {
                    const startIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["beginDbOperation"])();
                    try {
                        const result = await query(args);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["attachResultToOperation"])(startIndex, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractQueryResult"])(result));
                        return result;
                    } catch (error) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$request$2d$context$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["attachResultToOperation"])(startIndex, {
                            error: error instanceof Error ? error.message : String(error)
                        });
                        throw error;
                    }
                }
            }
        }
    });
}
const prisma = globalThis.__prisma ?? createPrismaClient();
if ("TURBOPACK compile-time truthy", 1) {
    globalThis.__prisma = prisma;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/server/db/generated/prisma/enums.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* !!! This is code generated by Prisma. Do not edit directly. !!! */ /* eslint-disable */ // biome-ignore-all lint: generated file
// @ts-nocheck 
/*
* This file exports all enum related types from the schema.
*
* 🟢 You can import this file directly.
*/ __turbopack_context__.s([
    "AlertStatus",
    ()=>AlertStatus,
    "PlantStatus",
    ()=>PlantStatus,
    "RemoteSettingsTab",
    ()=>RemoteSettingsTab,
    "RemoteSettingsTaskKind",
    ()=>RemoteSettingsTaskKind,
    "RemoteSettingsTaskStatus",
    ()=>RemoteSettingsTaskStatus,
    "UserPortal",
    ()=>UserPortal,
    "UserRole",
    ()=>UserRole,
    "UserStatus",
    ()=>UserStatus
]);
const RemoteSettingsTab = {
    gridParameters: 'gridParameters',
    featureParameters: 'featureParameters',
    reactivePowerControl: 'reactivePowerControl',
    powerLimit: 'powerLimit',
    otherSetting: 'otherSetting',
    maskingFaultDetection: 'maskingFaultDetection'
};
const RemoteSettingsTaskKind = {
    settings: 'settings',
    command: 'command'
};
const RemoteSettingsTaskStatus = {
    pending: 'pending',
    completed: 'completed',
    failed: 'failed'
};
const AlertStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
};
const UserPortal = {
    monitoring: 'monitoring',
    service: 'service'
};
const UserRole = {
    monitoring_user: 'monitoring_user',
    service_admin: 'service_admin',
    service_super_admin: 'service_super_admin'
};
const UserStatus = {
    active: 'active',
    disabled: 'disabled',
    pending_verification: 'pending_verification'
};
const PlantStatus = {
    Offline: 'Offline',
    Online: 'Online',
    Abnormal: 'Abnormal',
    Standby: 'Standby'
};
}),
"[project]/src/server/db/generated/prisma/internal/prismaNamespace.ts [app-route] (ecmascript) <export * as Prisma>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Prisma",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/generated/prisma/internal/prismaNamespace.ts [app-route] (ecmascript)");
}),
"[project]/src/server/repositories/plant.repository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "PlantRepository",
    ()=>PlantRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/api-error.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/server/db/generated/prisma/client.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$enums$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/generated/prisma/enums.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Prisma$3e$__ = __turbopack_context__.i("[project]/src/server/db/generated/prisma/internal/prismaNamespace.ts [app-route] (ecmascript) <export * as Prisma>");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
class PlantRepository {
    formatDateTime(value) {
        const date = value ?? new Date();
        const iso = date.toISOString();
        return iso.replace("T", " ").slice(0, 19);
    }
    decimalToNumber(value) {
        if (value == null) return 0;
        return value instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Prisma$3e$__["Prisma"].Decimal ? value.toNumber() : value;
    }
    toMode(status) {
        if (status === "Online") return "Normal";
        return status;
    }
    parseDeviceIdOrThrow(deviceId) {
        const normalized = deviceId.startsWith("device-") ? deviceId.slice("device-".length) : deviceId;
        if (!/^\d+$/.test(normalized)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](400, "Invalid device id");
        }
        return BigInt(normalized);
    }
    getAnalysisParameterCatalog() {
        // const voltageAC = Array.from({ length: 9 }, (_, i) => ({
        // 	key: `Vac${i + 1}`,
        // 	label: `Vac${i + 1}`,
        // 	unit: 'V',
        // 	axis: 'V',
        // 	group: 'Voltage',
        // }));
        const voltage = Array.from({
            length: 9
        }, (_, i)=>({
                key: `Voltage${i + 1}`,
                label: `Voltage${i + 1}`,
                unit: "V",
                axis: "V",
                group: "Voltage"
            }));
        const current = Array.from({
            length: 9
        }, (_, i)=>({
                key: `Current${i + 1}`,
                label: `Current${i + 1}`,
                unit: "A",
                axis: "A",
                group: "Current"
            }));
        const power = Array.from({
            length: 9
        }, (_, i)=>({
                key: `Power${i + 1}`,
                label: `Power${i + 1}`,
                unit: "kW",
                axis: "kW",
                group: "Power"
            }));
        return [
            ...voltage,
            ...current,
            ...power
        ];
    }
    getAnalysisValueByKey(key, powerValue) {
        if (key === "Pac1") {
            return Number(powerValue.toFixed(2));
        }
        if (key === "Iac1") {
            const current = powerValue > 0 ? powerValue * 1000 / 230 : 0;
            return Number(current.toFixed(2));
        }
        if (key === "Vdc1") {
            return 650;
        }
        if (key === "Vac1") {
            return 230;
        }
        return 0;
    }
    parseRangeDate(range, date) {
        if (range === "day") {
            return new Date(`${date}T00:00:00.000Z`);
        }
        if (range === "month") {
            return new Date(`${date}-01T00:00:00.000Z`);
        }
        return new Date(`${date}-01-01T00:00:00.000Z`);
    }
    buildChartSeries(mode, devices) {
        if (mode === "total") {
            return [
                {
                    key: "total",
                    label: "Total",
                    color: "#2f80ed"
                }
            ];
        }
        const palette = [
            "#54AF3A",
            "#FAB832",
            "#D32224",
            "#7E57C2",
            "#009688"
        ];
        return devices.map((device, index)=>({
                key: `inverter${index + 1}`,
                label: device.name ?? `inverter${index + 1}`,
                color: palette[index % palette.length]
            }));
    }
    buildChartBuckets(range, baseDate) {
        if (range === "day") {
            return [
                "07:00",
                "10:00",
                "13:00",
                "16:00",
                "19:00"
            ];
        }
        if (range === "month") {
            const daysInMonth = new Date(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, 0).getUTCDate();
            return Array.from({
                length: Math.min(daysInMonth, 6)
            }, (_, index)=>`Day ${index + 1}`);
        }
        return [
            "Jan",
            "Mar",
            "May",
            "Jul",
            "Sep",
            "Nov"
        ];
    }
    buildChartValue(seed, bucketIndex, range) {
        const rangeMultiplier = range === "day" ? 1 : range === "month" ? 8 : 40;
        const value = seed * rangeMultiplier + bucketIndex * (range === "day" ? 0.5 : range === "month" ? 3 : 12);
        return Number(value.toFixed(2));
    }
    normalizeStatusLabel(status, online) {
        if (!status) {
            return online ? "online" : "offline";
        }
        return status.toLowerCase();
    }
    buildAlertSeverity(statusLabel) {
        if (statusLabel.includes("offline") || statusLabel.includes("fault")) {
            return "critical";
        }
        return "warning";
    }
    buildAlertEvent(statusLabel) {
        if (statusLabel.includes("offline")) {
            return "Device offline";
        }
        if (statusLabel.includes("under voltage")) {
            return "Grid under voltage";
        }
        if (statusLabel.includes("under frequency")) {
            return "Grid under frequency";
        }
        if (statusLabel.includes("fault") || statusLabel.includes("abnormal")) {
            return "Device fault";
        }
        return "Device alert";
    }
    async getChartContext(scope, plantId) {
        const plant = await this.getScopedPlantOrThrow(scope, plantId);
        const devices = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
            where: {
                plantId: plant.id,
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                serialNumber: true,
                type: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return {
            plant,
            devices
        };
    }
    async getCurrentAlertsContext(scope, plantId) {
        const { plant, devices } = await this.getChartContext(scope, plantId);
        const dataloggers = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceDatalogger.findMany({
            where: {
                plantId: plant.id,
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                serialNumber: true,
                type: true,
                online: true,
                status: true,
                updatedAt: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return {
            plant,
            devices: [
                ...devices,
                ...dataloggers
            ]
        };
    }
    async getScopedPlantOrThrow(scope, plantId) {
        if (!scope || scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to plants");
        }
        let plantIdNum;
        try {
            plantIdNum = BigInt(plantId);
        } catch  {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](400, "Invalid plant id");
        }
        const plant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.findFirst({
            where: {
                id: plantIdNum,
                deletedAt: null
            },
            select: {
                id: true,
                userAccount: true,
                name: true,
                type: true,
                // status: true,
                installed: true,
                lastUpdatedAt: true,
                price: true,
                kwp: true
            }
        });
        if (!plant) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, "Plant not found.");
        }
        if (!scope.includes(plant.userAccount)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "You do not have access to this plant.");
        }
        return plant;
    }
    // async getPlantOverview(params: PlantOverviewParams) {
    // 	const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
    // 	const inverters = await prisma.deviceInverter.findMany({
    // 		where: {
    // 			plantId: plant.id,
    // 			deletedAt: null,
    // 		},
    // 		// select: {
    // 		// 	powerValue: true,
    // 		// 	eTodayValue: true,
    // 		// 	hTotalValue: true,
    // 		// },
    // 	});
    // 	const inverterPower = inverters.reduce((sum, inverter) => sum + inverter.powerValue, 0);
    // 	const inverterToday = inverters.reduce((sum, inverter) => sum + inverter.eTodayValue, 0);
    // 	const totalHours = inverters.reduce((sum, inverter) => sum + inverter.hTotalValue, 0);
    // 	const currentPower = inverters.length > 0 ? inverterPower : plant.powerValue;
    // 	const todayEnergy = inverters.length > 0 ? inverterToday : plant.eTodayValue;
    // 	const totalEnergy = plant.eTotalValue;
    // 	const totalEnergyInMWh = totalEnergy >= 1000 ? totalEnergy / 1000 : totalEnergy;
    // 	const totalEnergyUnit = totalEnergy >= 1000 ? 'MWh' : plant.eTotalUnit;
    // 	const income = (plant.price ?? 0) * totalEnergy;
    // 	const capacity = Math.round((plant.kwp ?? 0) * 1000);
    // 	return {
    // 		plant: {
    // 			id: String(plant.id),
    // 			name: plant.name,
    // 			mode: this.toMode(plant.status),
    // 			status: plant.status.toLowerCase(),
    // 			installDate: plant.installed ? plant.installed.toISOString().slice(0, 10) : null,
    // 		},
    // 		metrics: {
    // 			currentPower: {
    // 				value: Number(currentPower.toFixed(2)),
    // 				unit: plant.powerUnit || 'kW',
    // 				dataType: 'live',
    // 			},
    // 			todayEnergy: {
    // 				value: Number(todayEnergy.toFixed(2)),
    // 				unit: plant.eTodayUnit || 'kWh',
    // 				dataType: 'live',
    // 			},
    // 			totalEnergy: {
    // 				value: Number(totalEnergyInMWh.toFixed(2)),
    // 				unit: totalEnergyUnit || 'kWh',
    // 				dataType: 'summary',
    // 			},
    // 			income: {
    // 				value: Number(income.toFixed(2)),
    // 				unit: plant.price ? 'INR' : 'NA',
    // 				dataType: 'calculated',
    // 			},
    // 			hours: {
    // 				value: Number(totalHours.toFixed(2)),
    // 				unit: 'h',
    // 				dataType: 'summary',
    // 			},
    // 			capacity: {
    // 				value: capacity,
    // 				unit: 'W',
    // 				dataType: 'configuration',
    // 			},
    // 		},
    // 		lastUpdatedAt: this.formatDateTime(plant.lastUpdatedAt),
    // 	};
    // }
    async getPlantOverview(params) {
        const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
        // Get inverter serial numbers
        const inverters = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
            where: {
                plantId: plant.id,
                deletedAt: null
            },
            select: {
                serialNumber: true
            }
        });
        const serialNumbers = inverters.map((inv)=>inv.serialNumber).filter(Boolean);
        let aggregates = {
            currentPower: 0,
            dailyProduction: 0,
            totalEnergy: 0,
            totalHours: 0,
            latestTimestamp: null
        };
        if (serialNumbers.length) {
            // latest timestamp per inverter
            const latestPerInverter = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.groupBy({
                by: [
                    "sno"
                ],
                where: {
                    sno: {
                        in: serialNumbers
                    }
                },
                _max: {
                    latestTimestamp: true
                }
            });
            const latestConditions = latestPerInverter.filter((item)=>item._max.latestTimestamp).map((item)=>({
                    sno: item.sno,
                    latestTimestamp: item._max.latestTimestamp
                }));
            const latestLogs = latestConditions.length ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.findMany({
                where: {
                    OR: latestConditions
                },
                select: {
                    currentPower: true,
                    dailyProduction: true,
                    totalEnergy: true,
                    totalHours: true,
                    latestTimestamp: true
                }
            }) : [];
            aggregates = latestLogs.reduce((acc, row)=>{
                acc.currentPower += this.decimalToNumber(row.currentPower);
                acc.dailyProduction += this.decimalToNumber(row.dailyProduction);
                acc.totalEnergy += this.decimalToNumber(row.totalEnergy);
                acc.totalHours += this.decimalToNumber(row.totalHours);
                if (!acc.latestTimestamp || row.latestTimestamp && row.latestTimestamp > acc.latestTimestamp) {
                    acc.latestTimestamp = row.latestTimestamp;
                }
                return acc;
            }, {
                currentPower: 0,
                dailyProduction: 0,
                totalEnergy: 0,
                totalHours: 0,
                latestTimestamp: null
            });
        }
        const income = plant.price ?? 0;
        const totalEnergyValue = aggregates.totalEnergy >= 1000 ? aggregates.totalEnergy / 1000 : aggregates.totalEnergy;
        const totalEnergyUnit = aggregates.totalEnergy >= 1000 ? "MWh" : "kWh";
        return {
            plant: {
                id: String(plant.id),
                name: plant.name,
                type: plant.type ?? null,
                kwp: plant.kwp ?? 0,
                installationDate: plant.installed ? plant.installed.toISOString().slice(0, 10) : null,
                income: {
                    value: Number(income.toFixed(2)),
                    unit: plant.price ? "RS." : "NA"
                }
            },
            metrics: {
                currentPower: {
                    value: Number(aggregates.currentPower.toFixed(2)),
                    unit: "kW",
                    dataType: "live"
                },
                eToday: {
                    value: Number(aggregates.dailyProduction.toFixed(2)),
                    unit: "kWh",
                    dataType: "live"
                },
                eTotal: {
                    value: Number(totalEnergyValue.toFixed(2)),
                    unit: totalEnergyUnit,
                    dataType: "summary"
                },
                hTotal: {
                    value: Number(aggregates.totalHours.toFixed(2)),
                    unit: "h",
                    dataType: "summary"
                },
                capacity: {
                    value: Math.round(plant.kwp ?? 0),
                    unit: "kW",
                    dataType: "configuration"
                }
            },
            lastUpdatedAt: this.formatDateTime(aggregates.latestTimestamp ?? plant.lastUpdatedAt)
        };
    }
    // async getPlantOverviewLive(params: PlantOverviewParams) {
    // 	const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
    // 	const inverters = await prisma.deviceInverter.findMany({
    // 		where: {
    // 			plantId: plant.id,
    // 			deletedAt: null,
    // 		},
    // 		select: {
    // 			powerValue: true,
    // 			eTodayValue: true,
    // 		},
    // 	});
    // 	const currentPower =
    // 		inverters.length > 0
    // 			? inverters.reduce((sum, inverter) => sum + inverter.powerValue, 0)
    // 			: plant.powerValue;
    // 	const todayEnergy =
    // 		inverters.length > 0
    // 			? inverters.reduce((sum, inverter) => sum + inverter.eTodayValue, 0)
    // 			: plant.eTodayValue;
    // 	return {
    // 		plant: {
    // 			id: String(plant.id),
    // 			mode: this.toMode(plant.status),
    // 			status: plant.status.toLowerCase(),
    // 		},
    // 		metrics: {
    // 			currentPower: {
    // 				value: Number(currentPower.toFixed(2)),
    // 				unit: plant.powerUnit || 'kW',
    // 			},
    // 			todayEnergy: {
    // 				value: Number(todayEnergy.toFixed(2)),
    // 				unit: plant.eTodayUnit || 'kWh',
    // 			},
    // 		},
    // 		lastUpdatedAt: this.formatDateTime(plant.lastUpdatedAt),
    // 	};
    // }
    async getPlantOverviewLive(params) {
        const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
        // Get inverter serial numbers
        const inverters = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
            where: {
                plantId: plant.id,
                deletedAt: null
            },
            select: {
                serialNumber: true
            }
        });
        const serialNumbers = inverters.map((inv)=>inv.serialNumber).filter(Boolean);
        // Aggregate all required values
        const aggregates = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.aggregate({
            where: {
                sno: {
                    in: serialNumbers
                }
            },
            _sum: {
                currentPower: true,
                dailyProduction: true,
                totalEnergy: true,
                totalHours: true
            }
        });
        // Latest timestamp
        const latestLog = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.findFirst({
            where: {
                sno: {
                    in: serialNumbers
                }
            },
            orderBy: {
                latestTimestamp: "desc"
            },
            select: {
                latestTimestamp: true
            }
        });
        const currentPower = Number(aggregates._sum.currentPower ?? 0);
        const totalEToday = Number(aggregates._sum.dailyProduction ?? 0);
        const totalETotal = Number(aggregates._sum.totalEnergy ?? 0);
        const totalHTotal = Number(aggregates._sum.totalHours ?? 0);
        const totalEnergyValue = totalETotal >= 1000 ? totalETotal / 1000 : totalETotal;
        const totalEnergyUnit = totalETotal >= 1000 ? "MWh" : "kWh";
        return {
            plant: {
                id: String(plant.id),
                name: plant.name,
                type: plant.type
            },
            metrics: {
                currentPower: {
                    value: Number(currentPower.toFixed(2)),
                    unit: "kW",
                    dataType: "live"
                },
                eToday: {
                    value: Number(totalEToday.toFixed(2)),
                    unit: "kWh",
                    dataType: "live"
                },
                eTotal: {
                    value: Number(totalEnergyValue.toFixed(2)),
                    unit: totalEnergyUnit,
                    dataType: "summary"
                },
                hTotal: {
                    value: Number(totalHTotal.toFixed(2)),
                    unit: "h",
                    dataType: "summary"
                },
                capacity: {
                    value: Number((plant.kwp ?? 0).toFixed(2)),
                    unit: "kW",
                    dataType: "configuration"
                }
            },
            lastUpdatedAt: latestLog?.latestTimestamp ? this.formatDateTime(latestLog.latestTimestamp) : null
        };
    }
    async getPlantAnalysisDevices(params) {
        const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
        const devices = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
            where: {
                plantId: plant.id,
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                serialNumber: true,
                type: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return {
            totalDevices: devices.length,
            items: devices.map((device)=>({
                    id: `device-${String(device.id)}`,
                    name: device.name ?? `${device.type} ${device.serialNumber}`,
                    sn: device.serialNumber,
                    type: device.type
                }))
        };
    }
    async getPlantAnalysisParameters(params) {
        const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
        const deviceId = this.parseDeviceIdOrThrow(params.deviceId);
        const device = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findFirst({
            where: {
                id: deviceId,
                plantId: plant.id,
                deletedAt: null
            },
            select: {
                id: true,
                serialNumber: true,
                type: true
            }
        });
        if (!device) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, "Device not found for plant");
        }
        const catalog = this.getAnalysisParameterCatalog();
        const groups = Array.from(new Set(catalog.map((item)=>item.group))).map((group)=>({
                label: group,
                parameters: catalog.filter((item)=>item.group === group).map((item)=>({
                        key: item.key,
                        label: item.label,
                        unit: item.unit,
                        axis: item.axis
                    }))
            }));
        return {
            device: {
                id: `device-${String(device.id)}`,
                sn: device.serialNumber,
                type: device.type
            },
            groups
        };
    }
    // async getPlantAnalysis(params: PlantAnalysisParams) {
    // 	const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
    // 	const deviceId = this.parseDeviceIdOrThrow(params.deviceId);
    // 	const device = await prisma.deviceInverter.findFirst({
    // 		where: {
    // 			id: deviceId,
    // 			plantId: plant.id,
    // 			deletedAt: null,
    // 		},
    // 		select: {
    // 			id: true,
    // 			name: true,
    // 			serialNumber: true,
    // 			type: true,
    // 			// powerValue: true,
    // 		},
    // 	});
    // 	if (!device) {
    // 		throw new ApiError(404, 'Device not found for plant');
    // 	}
    // 	const catalog = this.getAnalysisParameterCatalog();
    // 	const selectedParameters = params.parameters
    // 		.map((key) => key.trim())
    // 		.filter((key, index, array) => key.length > 0 && array.indexOf(key) === index)
    // 		.map((key) => catalog.find((item) => item.key === key))
    // 		.filter((item): item is (typeof catalog)[number] => Boolean(item))
    // 		.map((item) => ({
    // 			key: item.key,
    // 			label: item.label,
    // 			group: item.group,
    // 			unit: item.unit,
    // 			axis: item.axis,
    // 		}));
    // 	if (selectedParameters.length === 0) {
    // 		throw new ApiError(400, 'No valid analysis parameters selected');
    // 	}
    // 	const baseDateTime = new Date(`${params.date}T07:00:00.000Z`);
    // 	// const points: Array<Record<string, string | number>> = [0, 1].map((offsetIndex) => {
    // 	// 	const pointTime = new Date(baseDateTime.getTime() + offsetIndex * 15 * 60 * 1000);
    // 	// 	const point: Record<string, string | number> = {
    // 	// 		time: pointTime.toISOString().slice(11, 16),
    // 	// 	};
    // 	// 	for (const parameter of selectedParameters) {
    // 	// 		const baseValue = this.getAnalysisValueByKey(parameter.key, device.powerValue);
    // 	// 		const value = baseValue + offsetIndex * (parameter.key === 'Pac1' ? 0.1 : parameter.key === 'Iac1' ? 0.2 : 1);
    // 	// 		point[parameter.key] = Number(value.toFixed(2));
    // 	// 	}
    // 	// 	return point;
    // 	// });
    // 	return {
    // 		date: params.date,
    // 		interval: params.interval,
    // 		device: {
    // 			id: `device-${String(device.id)}`,
    // 			name: device.name ?? `${device.type} ${device.serialNumber}`,
    // 			sn: device.serialNumber,
    // 			type: device.type,
    // 		},
    // 		selectedParameters,
    // 		// points,
    // 	};
    // }
    async getPlantChart(params) {
        const { devices } = await this.getChartContext(params.scope, params.plantId);
        // const baseDate =
        // 	this.parseRangeDate(
        // 		params.range,
        // 		params.date,
        // 	);
        // console.log({
        // 	date: params.date,
        // 	range: params.range,
        // 	baseDate,
        // 	baseDateType: typeof baseDate,
        // });
        const baseDate = new Date(params.date);
        if (isNaN(baseDate.getTime())) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](400, "Invalid date");
        }
        const series = this.buildChartSeries(params.mode, devices);
        const serialNumbers = devices.map((device)=>device.serialNumber);
        let points = [];
        /* ---------------- DAY ---------------- */ if (params.range === "day") {
            const logs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogs.findMany({
                where: {
                    sno: {
                        in: serialNumbers
                    },
                    timestamp: {
                        gte: new Date(`${params.date}T00:00:00`),
                        lte: new Date(`${params.date}T23:59:59.999`)
                    }
                },
                orderBy: {
                    timestamp: "asc"
                }
            });
            points = logs.map((log)=>{
                const point = {
                    time: this.formatDateTime(log.timestamp)
                };
                if (params.mode === "total") {
                    point.total = Number(log.total_input_power ?? 0);
                    return point;
                }
                const loggerIndex = devices.findIndex((device)=>device.serialNumber === log.sno);
                point[`inverter${loggerIndex + 1}`] = Number(log.total_input_power ?? 0);
                return point;
            });
        } else if (params.range === "month") {
            /* ---------------- MONTH ---------------- */ const latestLogs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.findMany({
                where: {
                    sno: {
                        in: serialNumbers
                    },
                    dayDate: {
                        gte: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
                        lte: new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0)
                    }
                },
                orderBy: {
                    dayDate: "asc"
                }
            });
            console.log({
                baseDate,
                latestLogsCount: latestLogs.length,
                firstLog: latestLogs[0]
            });
            const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
            points = Array.from({
                length: daysInMonth
            }, (_, index)=>{
                const day = index + 1;
                const dayLogs = latestLogs.filter((log)=>new Date(log.dayDate).getDate() === day);
                const point = {
                    time: `Day ${day}`
                };
                if (params.mode === "total") {
                    point.total = dayLogs.reduce((sum, log)=>sum + this.decimalToNumber(log.dailyProduction), 0);
                    return point;
                }
                devices.forEach((device, index)=>{
                    const row = dayLogs.find((log)=>log.sno === device.serialNumber);
                    point[`inverter${index + 1}`] = this.decimalToNumber(row?.dailyProduction);
                });
                return point;
            });
        } else {
            /* ---------------- YEAR ---------------- */ const latestLogs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.findMany({
                where: {
                    sno: {
                        in: serialNumbers
                    },
                    dayDate: {
                        gte: new Date(baseDate.getFullYear(), 0, 1),
                        lte: new Date(baseDate.getFullYear(), 11, 31)
                    }
                }
            });
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];
            points = months.map((month, monthIndex)=>{
                const point = {
                    time: month
                };
                const monthLogs = latestLogs.filter((log)=>{
                    const istDate = new Date(new Date(log.dayDate).toLocaleString("en-US", {
                        timeZone: "Asia/Kolkata"
                    }));
                    return istDate.getMonth() === monthIndex;
                });
                if (params.mode === "total") {
                    point.total = monthLogs.reduce((sum, log)=>sum + this.decimalToNumber(log.dailyProduction ?? 0), 0);
                    return point;
                }
                devices.forEach((device, index)=>{
                    point[`inverter${index + 1}`] = monthLogs.filter((log)=>log.sno === device.serialNumber).reduce((sum, log)=>sum + this.decimalToNumber(log.dailyProduction ?? 0), 0);
                });
                return point;
            });
        }
        return {
            chartType: params.range === "day" ? "area" : "bar",
            range: params.range,
            mode: params.mode,
            unit: params.range === "day" ? "kW" : "kWh",
            series,
            points
        };
    }
    async exportPlantChart(params) {
        const chart = await this.getPlantChart(params);
        const fileName = "plant-chart.csv";
        const headers = [
            "time",
            ...chart.series.map((item)=>item.key)
        ];
        const rows = [
            headers.join(",")
        ];
        for (const point of chart.points){
            rows.push(headers.map((header)=>String(point[header] ?? "")).join(","));
        }
        const query = new URLSearchParams({
            range: params.range,
            mode: params.mode,
            date: params.date
        });
        if (params.scope.length) {
            query.set("scope", params.scope.join(","));
        }
        if (params.fromService) {
            query.set("fromService", "true");
        }
        if (params.targetEndUserId) {
            query.set("targetEndUserId", params.targetEndUserId);
        }
        return {
            fileName,
            csv: rows.join("\n"),
            downloadUrl: `/api/v1/monitor/plants/${params.plantId}/chart/export/files/${fileName}?${query.toString()}`,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        };
    }
    async getPlantAnalysis(params) {
        console.log("getPlantAnalysis scope =>", params.scope);
        console.log("getPlantAnalysis plantId =>", params.plantId);
        const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
        const deviceId = this.parseDeviceIdOrThrow(params.deviceId);
        const device = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findFirst({
            where: {
                id: deviceId,
                plantId: plant.id,
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                serialNumber: true,
                type: true
            }
        });
        if (!device) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, "Device not found for plant");
        }
        const catalog = this.getAnalysisParameterCatalog();
        const selectedParameters = params.parameters.map((key)=>key.trim()).filter((key, index, array)=>key.length > 0 && array.indexOf(key) === index).map((key)=>catalog.find((item)=>item.key === key)).filter((item)=>Boolean(item)).map((item)=>({
                key: item.key,
                label: item.label,
                group: item.group,
                unit: item.unit,
                axis: item.axis
            }));
        if (selectedParameters.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](400, "No valid analysis parameters selected");
        }
        const startDate = new Date(`${params.date}T00:00:00`);
        const endDate = new Date(`${params.date}T23:59:59.999`);
        const logs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogs.findMany({
            where: {
                sno: device.serialNumber,
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                timestamp: "asc"
            }
        });
        const points = logs.map((log)=>{
            const point = {
                time: this.formatDateTime(log.timestamp)
            };
            for (const parameter of selectedParameters){
                let value;
                if (parameter.key.startsWith("Voltage")) {
                    const index = parameter.key.replace("Voltage", "");
                    value = log[`dc_voltage_${index}`];
                } else if (parameter.key.startsWith("Current")) {
                    const index = parameter.key.replace("Current", "");
                    value = log[`dc_current_${index}`];
                } else if (parameter.key.startsWith("Power")) {
                    const index = parameter.key.replace("Power", "");
                    value = log[`dc_power_${index}`];
                }
                point[parameter.key] = typeof value === "bigint" ? Number(value) : value ?? null;
            }
            return point;
        });
        return {
            date: params.date,
            interval: params.interval,
            device: {
                id: `device-${String(device.id)}`,
                name: device.name ?? `${device.type} ${device.serialNumber}`,
                sn: device.serialNumber,
                type: device.type
            },
            selectedParameters,
            points
        };
    }
    // async getPlantChart(params: PlantChartParams) {
    // 	const { plant, devices } = await this.getChartContext(params.scope, params.plantId);
    // 	const baseDate = this.parseRangeDate(params.range, params.date);
    // 	const series = this.buildChartSeries(params.mode, devices);
    // 	const buckets = this.buildChartBuckets(params.range, baseDate);
    // 	const points = buckets.map((bucket, bucketIndex) => {
    // 		const point: Record<string, string | number> = { time: bucket };
    // 		if (params.mode === 'total') {
    // 			const seed = plant.powerValue || devices.reduce((sum, device) => sum + (device.powerValue || 0), 0);
    // 			point.total = this.buildChartValue(seed, bucketIndex, params.range);
    // 			return point;
    // 		}
    // 		devices.forEach((device, index) => {
    // 			const key = `logger${index + 1}`;
    // 			point[key] = this.buildChartValue(device.powerValue || (index + 1), bucketIndex, params.range);
    // 		});
    // 		return point;
    // 	});
    // 	return {
    // 		chartType: params.range === 'day' ? 'area' : 'bar',
    // 		range: params.range,
    // 		mode: params.mode,
    // 		unit: params.range === 'day' ? 'kW' : 'kWh',
    // 		series,
    // 		points,
    // 	};
    // }
    // async exportPlantChart(params: PlantChartExportParams) {
    // 	const chart = await this.getPlantChart(params);
    // 	const fileName = 'plant-chart.csv';
    // 	const headers = ['time', ...chart.series.map((item) => item.key)];
    // 	const rows = [headers.join(',')];
    // 	for (const point of chart.points as Array<Record<string, string | number>>) {
    // 		rows.push(headers.map((header) => String(point[header] ?? '')).join(','));
    // 	}
    // 	return {
    // 		fileName,
    // 		csv: rows.join('\n'),
    // 		downloadUrl: `/api/v1/monitor/plants/${params.plantId}/chart/export/files/${fileName}?range=${params.range}&mode=${params.mode}&date=${encodeURIComponent(params.date)}${params.scope.length ? `&scope=${encodeURIComponent(params.scope.join(','))}` : ''}`,
    // 		expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    // 	};
    // }
    async getPlantCurrentAlerts(params) {
        const { plant, devices } = await this.getCurrentAlertsContext(params.scope, params.plantId);
        const alerts = devices.map((device)=>{
            const statusLabel = this.normalizeStatusLabel(device.status ?? null, device.online ?? false);
            if (statusLabel === "online" || statusLabel === "active") {
                return null;
            }
            return {
                id: `alert-${String(device.id)}`,
                name: device.name ?? device.type,
                sn: device.serialNumber,
                event: this.buildAlertEvent(statusLabel),
                severity: this.buildAlertSeverity(statusLabel),
                status: "active",
                startedAt: this.formatDateTime(device.updatedAt ?? plant.lastUpdatedAt),
                lastUpdatedAt: this.formatDateTime(device.updatedAt ?? plant.lastUpdatedAt)
            };
        }).filter((item)=>Boolean(item));
        const totalItems = alerts.length;
        const totalPages = totalItems > 0 ? Math.ceil(totalItems / params.pageSize) : 0;
        const safePage = totalPages > 0 ? Math.min(params.page, totalPages) : 1;
        const start = (safePage - 1) * params.pageSize;
        const items = alerts.slice(start, start + params.pageSize);
        const summary = {
            active: alerts.length,
            critical: alerts.filter((item)=>item.severity === "critical").length,
            warning: alerts.filter((item)=>item.severity === "warning").length
        };
        return {
            items,
            pagination: {
                page: totalItems > 0 ? safePage : 1,
                pageSize: params.pageSize,
                totalItems,
                totalPages
            },
            summary: params.since ? summary : undefined
        };
    }
    async listPlantInverterSerials(plantId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
            where: {
                plantId,
                deletedAt: null
            },
            select: {
                serialNumber: true
            }
        });
    }
    async getLatestTelemetryBySerials(serialNumbers) {
        const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.findMany({
            where: {
                sno: {
                    in: serialNumbers
                }
            },
            select: {
                sno: true,
                currentPower: true,
                totalEnergy: true,
                totalHours: true,
                latestTimestamp: true,
                updatedAt: true
            },
            orderBy: [
                {
                    sno: "asc"
                },
                {
                    latestTimestamp: "desc"
                }
            ]
        });
        const latestRows = new Map();
        for (const row of rows){
            if (!latestRows.has(row.sno)) {
                latestRows.set(row.sno, row);
            }
        }
        return Array.from(latestRows.values());
    }
    async findPlantInformationById(plantId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.findFirst({
            where: {
                id: BigInt(plantId),
                deletedAt: null
            },
            select: {
                id: true,
                userAccount: true,
                installed: true,
                address: true,
                kwp: true,
                latitude: true,
                longitude: true,
                price: true,
                lastUpdatedAt: true
            }
        });
    }
    async listPlantDataloggers(plantId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceDatalogger.findMany({
            where: {
                plantId: BigInt(plantId),
                deletedAt: null
            },
            select: {
                id: true,
                serialNumber: true,
                updatedAt: true
            },
            orderBy: {
                id: "asc"
            }
        });
    }
    async listPlantInverterTelemetry(plantId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
            where: {
                plantId: BigInt(plantId),
                deletedAt: null
            }
        });
    }
    async findDataloggerBySerialNumber(serialNumber) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceDatalogger.findUnique({
            where: {
                serialNumber
            },
            select: {
                id: true,
                plantId: true,
                deletedAt: true
            }
        });
    }
    async createPlantLogger(plantId, serialNumber) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceDatalogger.create({
            data: {
                plantId: BigInt(plantId),
                serialNumber,
                type: "datalogger",
                name: `Datalogger ${serialNumber}`,
                online: false,
                status: "offline"
            },
            select: {
                id: true,
                serialNumber: true,
                createdAt: true
            }
        });
    }
    async restorePlantLogger(dataloggerId, plantId, serialNumber) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceDatalogger.update({
            where: {
                id: dataloggerId
            },
            data: {
                plantId: BigInt(plantId),
                serialNumber,
                deletedAt: null,
                name: `Datalogger ${serialNumber}`,
                online: false,
                status: "offline",
                updatedAt: new Date()
            },
            select: {
                id: true,
                serialNumber: true,
                updatedAt: true
            }
        });
    }
    // async getPlantList(params: PlantListParams) {
    // 	const { scope, search, status, page, pageSize, sortBy = 'updatedAt', sortOrder = 'desc' } = params;
    // 	if (!scope || scope.length === 0) {
    // 		throw new ApiError(403, 'Unauthorized access to plants');
    // 	}
    // 	const filters: any = {
    // 		userAccount: { in: scope },
    // 		deletedAt: null,
    // 	};
    // 	if (search && search.trim()) {
    // 		filters.OR = [
    // 			{ name: { contains: search, mode: 'insensitive' } },
    // 			{ serialNumber: { contains: search, mode: 'insensitive' } },
    // 		];
    // 	}
    // 	if (status && status !== 'All') {
    // 		const statusMap: Record<string, string> = {
    // 			Normal: 'Online',
    // 			Abnormal: 'Abnormal',
    // 			Standby: 'Standby',
    // 			Offline: 'Offline',
    // 		};
    // 		filters.status = statusMap[status] || status;
    // 	}
    // 	try {
    // 		const [plants, total] = await Promise.all([
    // 			prisma.plant.findMany({
    // 				where: filters,
    // 				skip: (page - 1) * pageSize,
    // 				take: pageSize,
    // 				orderBy: { [sortBy]: sortOrder },
    // 				select: {
    // 					id: true,
    // 					userAccount: true,
    // 					name: true,
    // 					type: true,
    // 					// eTodayValue: true,
    // 					// eTodayUnit: true,
    // 					// eTotalValue: true,
    // 					// eTotalUnit: true,
    // 					// powerValue: true,
    // 					// powerUnit: true,
    // 					// effect: true,
    // 					installed: true,
    // 					lastUpdatedAt: true,
    // 					// status: true,
    // 				},
    // 			}),
    // 			prisma.plant.count({ where: filters }),
    // 		]);
    // 		// const statusCountsRaw = await prisma.plant.groupBy({
    // 		// 	by: ['status'],
    // 		// 	_count: { id: true },
    // 		// 	where: { userAccount: { in: scope }, deletedAt: null },
    // 		// });
    // 		// const statusCounts: Record<string, number> = {
    // 		// 	All: total,
    // 		// 	Normal: 0,
    // 		// 	Abnormal: 0,
    // 		// 	Standby: 0,
    // 		// 	Offline: 0,
    // 		// };
    // 		// statusCountsRaw.forEach((count) => {
    // 		// 	if (count.status === 'Online') statusCounts.Normal = count._count.id;
    // 		// 	else if (count.status === 'Abnormal') statusCounts.Abnormal = count._count.id;
    // 		// 	else if (count.status === 'Standby') statusCounts.Standby = count._count.id;
    // 		// 	else if (count.status === 'Offline') statusCounts.Offline = count._count.id;
    // 		// });
    // 		const items = plants.map((plant) => ({
    // 			id: String(plant.id),
    // 			ownerUserId: plant.userAccount,
    // 			name: plant.name,
    // 			type: plant.type,
    // 			// eToday: {
    // 			// 	value: plant.eTodayValue || 0,
    // 			// 	unit: plant.eTodayUnit || 'Wh',
    // 			// },
    // 			// eTotal: {
    // 			// 	value: plant.eTotalValue || 0,
    // 			// 	unit: plant.eTotalUnit || 'kWh',
    // 			// },
    // 			// power: {
    // 			// 	value: plant.powerValue || 0,
    // 			// 	unit: plant.powerUnit || 'W',
    // 			// },
    // 			// effect: plant.effect || '0',
    // 			installed: plant.installed ? plant.installed.toISOString().split('T')[0] : null,
    // 			updated: plant.lastUpdatedAt
    // 				? plant.lastUpdatedAt.toISOString().replace('T', ' ').split('.')[0]
    // 				: new Date().toISOString().replace('T', ' ').split('.')[0],
    // 			// status: plant.status === 'Online' ? 'Normal' : plant.status,
    // 			statusCount: 1,
    // 			matched: {
    // 				plantName: plant.name,
    // 				serialNumber: '',
    // 			},
    // 		}));
    // 		return {
    // 			items,
    // 			// statusCounts,
    // 			pagination: {
    // 				page,
    // 				pageSize,
    // 				totalItems: total,
    // 				totalPages: Math.ceil(total / pageSize),
    // 			},
    // 		};
    // 	} catch (error) {
    // 		console.error('Error fetching plant list:', error);
    // 		throw new ApiError(500, 'Failed to fetch plant list');
    // 	}
    // }
    async getPlantList(params) {
        const { user, scope, selectedEndUserId, search, page, pageSize } = params;
        if (!scope?.length) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to plants");
        }
        let userAccountFilter = {
            in: scope
        };
        if (selectedEndUserId && user.role && [
            "service_super_admin",
            "service_admin"
        ].includes(user.role)) {
            const endUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: BigInt(selectedEndUserId)
                },
                select: {
                    account: true
                }
            });
            if (!endUser) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, "Selected end user not found");
            }
            userAccountFilter = endUser.account;
        }
        const filters = {
            userAccount: userAccountFilter,
            deletedAt: null
        };
        try {
            // fetch plants first
            const plants = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.findMany({
                where: filters,
                select: {
                    id: true,
                    userAccount: true,
                    name: true,
                    type: true,
                    price: true,
                    priceUnit: true,
                    kwp: true,
                    installed: true,
                    longitude: true,
                    latitude: true,
                    address: true,
                    currentStatus: {
                        select: {
                            status: true,
                            totalDevices: true,
                            normalCount: true,
                            abnormalCount: true,
                            standbyCount: true,
                            offlineCount: true,
                            updatedAt: true
                        }
                    }
                }
            });
            const total = plants.length;
            const plantIds = plants.map((p)=>p.id);
            // fetch inverters
            const inverters = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
                where: {
                    plantId: {
                        in: plantIds
                    },
                    deletedAt: null
                },
                select: {
                    plantId: true,
                    serialNumber: true
                }
            });
            const plantSerialMap = new Map();
            inverters.forEach((inv)=>{
                const key = String(inv.plantId);
                if (!plantSerialMap.has(key)) {
                    plantSerialMap.set(key, []);
                }
                plantSerialMap.get(key).push(inv.serialNumber);
            });
            const serials = inverters.map((i)=>i.serialNumber);
            // get ALL logs ordered by newest timestamp first
            const logs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.findMany({
                where: {
                    sno: {
                        in: serials
                    }
                },
                orderBy: [
                    {
                        sno: "asc"
                    },
                    {
                        latestTimestamp: "desc"
                    }
                ],
                select: {
                    sno: true,
                    dailyProduction: true,
                    totalEnergy: true,
                    currentPower: true,
                    latestTimestamp: true
                }
            });
            // keep only latest row per inverter serial
            const logMap = new Map();
            for (const log of logs){
                if (!logMap.has(log.sno)) {
                    logMap.set(log.sno, log);
                }
            }
            let items = plants.map((plant)=>{
                const serials = plantSerialMap.get(String(plant.id)) ?? [];
                let eToday = 0;
                let eTotal = 0;
                let power = 0;
                let latestUpdate = null;
                for (const serial of serials){
                    const log = logMap.get(serial);
                    if (!log) continue;
                    eToday += Number(log.dailyProduction ?? 0);
                    eTotal += Number(log.totalEnergy ?? 0);
                    power += Number(log.currentPower ?? 0);
                    if (log.latestTimestamp && (!latestUpdate || log.latestTimestamp > latestUpdate)) {
                        latestUpdate = log.latestTimestamp;
                    }
                }
                const effect = plant.kwp && plant.kwp > 0 ? Number((eToday / plant.kwp).toFixed(2)) : 0;
                return {
                    id: String(plant.id),
                    ownerUserId: plant.userAccount,
                    name: plant.name,
                    type: plant.type,
                    price: plant.price,
                    priceUnit: plant.priceUnit,
                    kwp: plant.kwp,
                    address: plant.address,
                    latitude: plant.latitude,
                    longitude: plant.longitude,
                    eToday: {
                        value: eToday,
                        unit: "kWh"
                    },
                    eTotal: {
                        value: eTotal,
                        unit: eTotal >= 1000 ? "MWh" : "kWh"
                    },
                    effect: {
                        value: effect
                    },
                    power: {
                        value: power,
                        unit: "kW"
                    },
                    // Plant Current Status
                    plantStatus: {
                        status: plant.currentStatus?.status ?? "Offline",
                        totalDevices: plant.currentStatus?.totalDevices ?? 0,
                        normalCount: plant.currentStatus?.normalCount ?? 0,
                        abnormalCount: plant.currentStatus?.abnormalCount ?? 0,
                        standbyCount: plant.currentStatus?.standbyCount ?? 0,
                        offlineCount: plant.currentStatus?.offlineCount ?? 0,
                        updatedAt: plant.currentStatus?.updatedAt ?? null
                    },
                    installed: plant.installed ? plant.installed.toISOString().split("T")[0] : null,
                    latestUpdate,
                    updated: latestUpdate ? this.formatDateTime(latestUpdate) : plant.installed ? plant.installed.toISOString().split("T")[0] : null
                };
            });
            // newest inverter timestamp first
            items.sort((a, b)=>{
                if (!a.latestUpdate) return 1;
                if (!b.latestUpdate) return -1;
                return b.latestUpdate.getTime() - a.latestUpdate.getTime();
            });
            const statusCounts = {
                All: plants.length,
                Online: 0,
                Offline: 0,
                Abnormal: 0,
                Standby: 0
            };
            for (const plant of plants){
                const current = plant.currentStatus;
                // If there is no current status, treat it as Offline
                if (!current) {
                    statusCounts.Offline++;
                    continue;
                }
                switch(current.status){
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$enums$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlantStatus"].Online:
                        statusCounts.Online++;
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$enums$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlantStatus"].Offline:
                        statusCounts.Offline++;
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$enums$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlantStatus"].Abnormal:
                        statusCounts.Abnormal++;
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$enums$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlantStatus"].Standby:
                        statusCounts.Standby++;
                        break;
                }
            }
            // paginate AFTER sorting
            const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize).map(({ latestUpdate, ...rest })=>rest);
            return {
                items: paginatedItems,
                statusCounts,
                pagination: {
                    page,
                    pageSize,
                    totalItems: total,
                    totalPages: Math.ceil(total / pageSize)
                }
            };
        } catch (err) {
            console.error(err);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](500, "Failed to fetch plant list");
        }
    }
    async exportPlantList(user, scope, fromService, targetEndUserId) {
        const data = await this.getPlantList({
            user,
            scope,
            page: 1,
            pageSize: 100000
        });
        const query = new URLSearchParams();
        if (fromService) {
            query.set("fromService", "true");
        }
        if (targetEndUserId) {
            query.set("targetEndUserId", targetEndUserId);
        }
        return {
            fileName: "plant-list.csv",
            downloadUrl: `/api/v1/monitor/plants/list/export/files/plant-list.csv${query.toString() ? `?${query.toString()}` : ""}`,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            items: data.items
        };
    }
    // async getPlantSummary(params: PlantSummaryParams) {
    // 	const { scope, search } = params;
    // 	if (!scope || scope.length === 0) {
    // 		throw new ApiError(403, 'Unauthorized access to plants');
    // 	}
    // 	try {
    // 		const filters: any = {
    // 			userAccount: { in: scope },
    // 			deletedAt: null,
    // 		};
    // 		if (search && search.trim()) {
    // 			filters.OR = [
    // 				{ name: { contains: search, mode: 'insensitive' } },
    // 				{ serialNumber: { contains: search, mode: 'insensitive' } },
    // 			];
    // 		}
    // 		// const [metrics, statusCountsRaw, allPlants] = await Promise.all([
    // 		// 	prisma.plant.aggregate({
    // 		// 		// _sum: {
    // 		// 		// 	eTodayValue: true,
    // 		// 		// 	eTotalValue: true,
    // 		// 		// 	powerValue: true,
    // 		// 		// },
    // 		// 		where: filters,
    // 		// 	}),
    // 		// 	prisma.plant.groupBy({
    // 		// 		by: ['status'],
    // 		// 		_count: { id: true },
    // 		// 		where: filters,
    // 		// 	}),
    // 		// 	prisma.plant.findMany({
    // 		// 		where: filters,
    // 		// 		select: { id: true },
    // 		// 	}),
    // 		// ]);
    // 		// const statusCounts: Record<string, number> = {
    // 		// 	All: allPlants.length,
    // 		// 	Normal: 0,
    // 		// 	Abnormal: 0,
    // 		// 	Standby: 0,
    // 		// 	Offline: 0,
    // 		// };
    // 		// statusCountsRaw.forEach((count) => {
    // 		// 	if (count.status === 'Online') statusCounts.Normal = count._count.id;
    // 		// 	else if (count.status === 'Abnormal') statusCounts.Abnormal = count._count.id;
    // 		// 	else if (count.status === 'Standby') statusCounts.Standby = count._count.id;
    // 		// 	else if (count.status === 'Offline') statusCounts.Offline = count._count.id;
    // 		// });
    // 		return {
    // 			// currentPower: {
    // 			// 	value: metrics._sum?.powerValue || 0,
    // 			// 	unit: 'kW',
    // 			// },
    // 			// eToday: {
    // 			// 	value: metrics._sum?.eTodayValue || 0,
    // 			// 	unit: 'kWh',
    // 			// },
    // 			// eTotal: {
    // 			// 	value: metrics._sum?.eTotalValue || 0,
    // 			// 	unit: 'kWh',
    // 			// },
    // 			// hTotal: {
    // 			// 	value: 0,
    // 			// 	unit: 'Hrs',
    // 			// },
    // 			capacity: {
    // 				value: 0,
    // 				unit: 'kW',
    // 			},
    // 			// statusCounts,
    // 			listRefreshRequired: true,
    // 			changedPlantIds: [],
    // 			updatedAt: new Date().toISOString(),
    // 		};
    // 	} catch (error) {
    // 		console.error('Error fetching plant summary:', error);
    // 		throw new ApiError(500, 'Failed to fetch plant summary');
    // 	}
    // }
    async getPlantSummary(params) {
        const { scope, search } = params;
        if (!scope?.length) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to plants");
        }
        try {
            const filters = {
                userAccount: {
                    in: scope
                },
                deletedAt: null
            };
            if (search?.trim()) {
                filters.OR = [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                ];
            }
            // plants
            const plants = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.findMany({
                where: filters,
                select: {
                    id: true,
                    kwp: true
                }
            });
            const plantIds = plants.map((p)=>p.id);
            if (!plantIds.length) {
                return {
                    currentPower: {
                        value: 0,
                        unit: "kW"
                    },
                    eToday: {
                        value: 0,
                        unit: "kWh"
                    },
                    eTotal: {
                        value: 0,
                        unit: "kWh"
                    },
                    hTotal: {
                        value: 0,
                        unit: "h"
                    },
                    capacity: {
                        value: 0,
                        unit: "kW"
                    },
                    listRefreshRequired: true,
                    changedPlantIds: [],
                    updatedAt: new Date().toISOString()
                };
            }
            // inverters
            const inverters = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
                where: {
                    plantId: {
                        in: plantIds
                    },
                    deletedAt: null
                },
                select: {
                    serialNumber: true
                }
            });
            const serialNumbers = inverters.map((i)=>i.serialNumber);
            if (!serialNumbers.length) {
                return {
                    currentPower: {
                        value: 0,
                        unit: "kW"
                    },
                    eToday: {
                        value: 0,
                        unit: "kWh"
                    },
                    eTotal: {
                        value: 0,
                        unit: "kWh"
                    },
                    hTotal: {
                        value: 0,
                        unit: "h"
                    },
                    capacity: {
                        value: Number(plants.reduce((sum, p)=>sum + (p.kwp ?? 0), 0).toFixed(2)),
                        unit: "kW"
                    },
                    listRefreshRequired: true,
                    changedPlantIds: [],
                    updatedAt: new Date().toISOString()
                };
            }
            // Get latest timestamp per inverter
            const latestPerInverter = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.groupBy({
                by: [
                    "sno"
                ],
                where: {
                    sno: {
                        in: serialNumbers
                    }
                },
                _max: {
                    latestTimestamp: true
                }
            });
            const latestConditions = latestPerInverter.filter((item)=>item._max.latestTimestamp).map((item)=>({
                    sno: item.sno,
                    latestTimestamp: item._max.latestTimestamp
                }));
            let latestLogs = [];
            if (latestConditions.length) {
                latestLogs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceLogsLatest.findMany({
                    where: {
                        OR: latestConditions
                    },
                    select: {
                        currentPower: true,
                        dailyProduction: true,
                        totalEnergy: true,
                        totalHours: true,
                        latestTimestamp: true
                    }
                });
            }
            // Aggregate latest rows only
            const aggregates = latestLogs.reduce((acc, row)=>{
                acc.currentPower += this.decimalToNumber(row.currentPower);
                acc.dailyProduction += this.decimalToNumber(row.dailyProduction);
                acc.totalEnergy += this.decimalToNumber(row.totalEnergy);
                acc.totalHours += this.decimalToNumber(row.totalHours);
                if (!acc.latestTimestamp || row.latestTimestamp && row.latestTimestamp > acc.latestTimestamp) {
                    acc.latestTimestamp = row.latestTimestamp;
                }
                return acc;
            }, {
                currentPower: 0,
                dailyProduction: 0,
                totalEnergy: 0,
                totalHours: 0,
                latestTimestamp: null
            });
            const capacity = plants.reduce((sum, p)=>sum + (p.kwp ?? 0), 0);
            const totalEnergy = aggregates.totalEnergy;
            return {
                currentPower: {
                    value: Number(aggregates.currentPower.toFixed(2)),
                    unit: "kW"
                },
                eToday: {
                    value: Number(aggregates.dailyProduction.toFixed(2)),
                    unit: "kWh"
                },
                eTotal: {
                    value: Number((totalEnergy >= 1000 ? totalEnergy / 1000 : totalEnergy).toFixed(2)),
                    unit: totalEnergy >= 1000 ? "MWh" : "kWh"
                },
                hTotal: {
                    value: Number(aggregates.totalHours.toFixed(2)),
                    unit: "h"
                },
                capacity: {
                    value: Number(capacity.toFixed(2)),
                    unit: "kW"
                },
                listRefreshRequired: true,
                changedPlantIds: [],
                updatedAt: this.formatDateTime(aggregates.latestTimestamp)
            };
        } catch (error) {
            console.error(error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](500, "Failed to fetch plant summary");
        }
    }
    async getLiveRows(params) {
        const { scope, plantIds, status, page, pageSize } = params;
        if (!scope || scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to plants");
        }
        try {
            const plantIdNumbers = plantIds.map((id)=>BigInt(id));
            const filters = {
                userAccount: {
                    in: scope
                },
                deletedAt: null
            };
            if (plantIds?.length > 0) {
                filters.id = {
                    in: plantIds.map((id)=>BigInt(id))
                };
            }
            if (status && status !== "All") {
                const statusMap = {
                    Normal: "Online",
                    Abnormal: "Abnormal",
                    Standby: "Standby",
                    Offline: "Offline"
                };
                filters.status = statusMap[status] || status;
            }
            const plants = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.findMany({
                where: filters,
                skip: (page - 1) * pageSize,
                take: pageSize,
                select: {
                    id: true,
                    userAccount: true,
                    // eTodayValue: true,
                    // eTodayUnit: true,
                    // eTotalValue: true,
                    // eTotalUnit: true,
                    // powerValue: true,
                    // powerUnit: true,
                    // effect: true,
                    lastUpdatedAt: true
                }
            });
            const items = plants.map((plant)=>({
                    id: String(plant.id),
                    ownerUserId: plant.userAccount,
                    // eToday: {
                    // 	value: plant.eTodayValue || 0,
                    // 	unit: plant.eTodayUnit || 'kWh',
                    // },
                    // eTotal: {
                    // 	value: plant.eTotalValue || 0,
                    // 	unit: plant.eTotalUnit || 'kWh',
                    // },
                    // power: {
                    // 	value: plant.powerValue || 0,
                    // 	unit: plant.powerUnit || 'kW',
                    // },
                    // effect: plant.effect || '0%',
                    updated: plant.lastUpdatedAt ? plant.lastUpdatedAt.toISOString().replace("T", " ").split(".")[0] : new Date().toISOString().replace("T", " ").split(".")[0],
                    oldStatus: "Offline",
                    // status: plant.status === 'Online' ? 'Normal' : plant.status,
                    statusCount: 1,
                    rowStillMatchesActiveStatus: true
                }));
            return {
                items,
                listRefreshRequired: false,
                updatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error("Error fetching live rows:", error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](500, "Failed to fetch live rows");
        }
    }
    async getPlantDetails(scope, plantId) {
        if (!scope || scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to plants");
        }
        try {
            const plantIdNum = BigInt(plantId);
            const plant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.findUnique({
                where: {
                    id: plantIdNum
                },
                select: {
                    id: true,
                    userAccount: true,
                    name: true,
                    type: true,
                    installed: true,
                    kwp: true,
                    price: true,
                    priceUnit: true,
                    longitude: true,
                    latitude: true,
                    address: true
                }
            });
            if (!plant) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, "Plant not found");
            }
            if (!scope.includes(plant.userAccount)) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to plant");
            }
            return {
                id: String(plant.id),
                ownerUserId: plant.userAccount,
                plantName: plant.name,
                plantType: plant.type,
                installedDate: plant.installed ? plant.installed.toISOString().split("T")[0] : null,
                kwp: plant.kwp || 0,
                price: plant.price || 0,
                priceUnit: plant.priceUnit || "INR",
                longitude: plant.longitude || "",
                latitude: plant.latitude || "",
                address: plant.address || ""
            };
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"]) throw error;
            console.error("Error fetching plant details:", error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](500, "Failed to fetch plant details");
        }
    }
    async createPlant(user, scope, plantData) {
        if (!scope || scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to create plant");
        }
        if (!user.account) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](401, "User account not found in token");
        }
        let plantOwnerAccount = user.account;
        if (plantData.selectedEndUserId) {
            const endUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: BigInt(plantData.selectedEndUserId)
                },
                select: {
                    account: true
                }
            });
            if (!endUser) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, "Selected end user not found");
            }
            plantOwnerAccount = endUser.account;
        }
        try {
            const newPlant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.create({
                data: {
                    name: plantData.plantName,
                    type: plantData.plantType,
                    userAccount: plantOwnerAccount,
                    // userAccount: user.account as string,
                    installed: plantData.installedDate ? new Date(plantData.installedDate) : null,
                    kwp: plantData.kwp || null,
                    price: plantData.price || null,
                    priceUnit: plantData.priceUnit || null,
                    longitude: plantData.longitude || null,
                    latitude: plantData.latitude || null,
                    address: plantData.address || null,
                    pictureFileId: plantData.pictureFileId || null
                },
                select: {
                    id: true,
                    userAccount: true,
                    createdAt: true
                }
            });
            return {
                id: String(newPlant.id),
                ownerUserId: newPlant.userAccount,
                createdAt: newPlant.createdAt.toISOString()
            };
        } catch (error) {
            console.error("Error creating plant:", error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](500, "Failed to create plant");
        }
    }
    async editPlant(scope, plantId, plantData) {
        if (!scope || scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to edit plant");
        }
        try {
            const plantIdNum = BigInt(plantId);
            const plant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.findUnique({
                where: {
                    id: plantIdNum
                },
                select: {
                    userAccount: true
                }
            });
            if (!plant) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, "Plant not found");
            }
            if (!scope.includes(plant.userAccount)) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to edit plant");
            }
            const updatedPlant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.update({
                where: {
                    id: plantIdNum
                },
                data: {
                    name: plantData.plantName,
                    type: plantData.plantType,
                    installed: plantData.installedDate ? new Date(plantData.installedDate) : undefined,
                    kwp: plantData.kwp || null,
                    price: plantData.price || null,
                    priceUnit: plantData.priceUnit || null,
                    longitude: plantData.longitude || null,
                    latitude: plantData.latitude || null,
                    address: plantData.address || null,
                    pictureFileId: plantData.pictureFileId || null,
                    updatedAt: new Date()
                },
                select: {
                    id: true,
                    userAccount: true,
                    updatedAt: true
                }
            });
            return {
                id: String(updatedPlant.id),
                ownerUserId: updatedPlant.userAccount,
                updatedAt: updatedPlant.updatedAt.toISOString()
            };
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"]) throw error;
            console.error("Error editing plant:", error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](500, "Failed to edit plant");
        }
    }
    async deletePlant(scope, plantId) {
        if (!scope || scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to delete plant");
        }
        try {
            const plantIdNum = BigInt(plantId);
            const plant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.findUnique({
                where: {
                    id: plantIdNum
                },
                select: {
                    userAccount: true
                }
            });
            if (!plant) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, "Plant not found");
            }
            if (!scope.includes(plant.userAccount)) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, "Unauthorized access to delete plant");
            }
            const deletedPlant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.update({
                where: {
                    id: plantIdNum
                },
                data: {
                    // status: 'Offline',
                    deletedAt: new Date()
                },
                select: {
                    id: true,
                    userAccount: true,
                    deletedAt: true
                }
            });
            return {
                id: String(deletedPlant.id),
                ownerUserId: deletedPlant.userAccount,
                status: "deleted",
                deletedAt: deletedPlant.deletedAt?.toISOString()
            };
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"]) throw error;
            console.error("Error deleting plant:", error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](500, "Failed to delete plant");
        }
    }
    buildLogEvent(status, online, type) {
        const statusLabel = (status ?? "").toLowerCase();
        if (!online) {
            return "Device offline";
        }
        if (statusLabel.includes("voltage")) {
            return "A1-Grid under voltage";
        }
        if (statusLabel.includes("frequency")) {
            return "A2-Grid under frequency";
        }
        if (statusLabel.includes("fault")) {
            return "A3-Device fault";
        }
        return "A4-Device event";
    }
    buildLogStatus(online, statusLabel) {
        if (!online) {
            return "Inactive";
        }
        if (statusLabel.includes("fault")) {
            return "Abnormal";
        }
        return "Active";
    }
    parsePlantIdOrThrow(plantId) {
        if (!/^\d+$/.test(plantId)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](400, "Invalid plant id");
        }
        return BigInt(plantId);
    }
    // private toDeviceSnapshotFromInverter(inverter: {
    // 	id: bigint;
    // 	name: string | null;
    // 	type: string;
    // 	serialNumber: string;
    // 	online: boolean;
    // 	status: string | null;
    // 	powerValue: number;
    // 	eTodayValue: number;
    // 	eTotalValue: number;
    // 	hTotalValue: number;
    // 	updatedAt: Date;
    // 	updateTime: Date | null;
    // }): PlantDeviceOverviewSnapshot {
    // 	return {
    // 		id: inverter.id,
    // 		name: inverter.name ?? `${inverter.type} ${inverter.serialNumber}`,
    // 		type: inverter.type,
    // 		sn: inverter.serialNumber,
    // 		online: inverter.online,
    // 		status: (inverter.status ?? '').toLowerCase(),
    // 		currentPowerKw: inverter.powerValue ?? 0,
    // 		todayEnergyKwh: inverter.eTodayValue ?? 0,
    // 		totalEnergyKwh: inverter.eTotalValue ?? 0,
    // 		totalHours: inverter.hTotalValue ?? 0,
    // 		lastUpdateAt: inverter.updateTime ?? inverter.updatedAt,
    // 	};
    // }
    // private toDeviceSnapshotFromDatalogger(datalogger: {
    // 	id: bigint;
    // 	name: string | null;
    // 	type: string;
    // 	serialNumber: string;
    // 	online: boolean;
    // 	status: string | null;
    // 	updatedAt: Date;
    // 	updateTime: Date | null;
    // 	inverter: {
    // 		powerValue: number;
    // 		eTodayValue: number;
    // 		eTotalValue: number;
    // 		hTotalValue: number;
    // 		updatedAt: Date;
    // 		updateTime: Date | null;
    // 	} | null;
    // }): PlantDeviceOverviewSnapshot {
    // 	const linkedInverter = datalogger.inverter;
    // 	const inverterUpdatedAt = linkedInverter?.updateTime ?? linkedInverter?.updatedAt;
    // 	const dataloggerUpdatedAt = datalogger.updateTime ?? datalogger.updatedAt;
    // 	const lastUpdateAt = inverterUpdatedAt && inverterUpdatedAt > dataloggerUpdatedAt ? inverterUpdatedAt : dataloggerUpdatedAt;
    // 	return {
    // 		id: datalogger.id,
    // 		name: datalogger.name ?? `${datalogger.type} ${datalogger.serialNumber}`,
    // 		type: datalogger.type,
    // 		sn: datalogger.serialNumber,
    // 		online: datalogger.online,
    // 		status: (datalogger.status ?? '').toLowerCase(),
    // 		currentPowerKw: linkedInverter?.powerValue ?? 0,
    // 		todayEnergyKwh: linkedInverter?.eTodayValue ?? 0,
    // 		totalEnergyKwh: linkedInverter?.eTotalValue ?? 0,
    // 		totalHours: linkedInverter?.hTotalValue ?? 0,
    // 		lastUpdateAt,
    // 	};
    // }
    // async getPlantDeviceOverviewSnapshot(params: PlantDeviceOverviewParams): Promise<PlantDeviceOverviewSnapshot> {
    // 	const plantIdNum = this.parsePlantIdOrThrow(params.plantId);
    // 	const deviceIdNum = this.parseDeviceIdOrThrow(params.deviceId);
    // 	const plantExists = await prisma.plant.findFirst({
    // 		where: {
    // 			id: plantIdNum,
    // 			deletedAt: null,
    // 		},
    // 		select: {
    // 			id: true,
    // 		},
    // 	});
    // 	if (!plantExists) {
    // 		throw new ApiError(404, 'Plant not found.');
    // 	}
    // 	const inverter = await prisma.deviceInverter.findFirst({
    // 		where: {
    // 			id: deviceIdNum,
    // 			plantId: plantIdNum,
    // 			deletedAt: null,
    // 		},
    // 		select: {
    // 			id: true,
    // 			name: true,
    // 			type: true,
    // 			serialNumber: true,
    // 			// online: true,
    // 			// status: true,
    // 			// powerValue: true,
    // 			// eTodayValue: true,
    // 			// eTotalValue: true,
    // 			// hTotalValue: true,
    // 			updatedAt: true,
    // 			updateTime: true,
    // 		},
    // 	});
    // 	if (inverter) {
    // 		return this.toDeviceSnapshotFromInverter(inverter);
    // 	}
    // 	const datalogger = await prisma.deviceDatalogger.findFirst({
    // 		where: {
    // 			id: deviceIdNum,
    // 			plantId: plantIdNum,
    // 			deletedAt: null,
    // 		},
    // 		select: {
    // 			id: true,
    // 			name: true,
    // 			type: true,
    // 			serialNumber: true,
    // 			online: true,
    // 			status: true,
    // 			updatedAt: true,
    // 			updateTime: true,
    // 			inverter: {
    // 				// select: {
    // 				// 	powerValue: true,
    // 				// 	eTodayValue: true,
    // 				// 	eTotalValue: true,
    // 				// 	hTotalValue: true,
    // 				// 	updatedAt: true,
    // 				// 	updateTime: true,
    // 				// },
    // 			},
    // 		},
    // 	});
    // 	if (!datalogger) {
    // 		throw new ApiError(404, 'Device not found for this plant.');
    // 	}
    // 	return this.toDeviceSnapshotFromDatalogger(datalogger);
    // }
    async getPlantLogs(params) {
        const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
        const dateFromObj = params.dateFrom ? new Date(`${params.dateFrom}T00:00:00.000Z`) : new Date("2025-01-01T00:00:00.000Z");
        const dateToObj = params.dateTo ? new Date(`${params.dateTo}T23:59:59.999Z`) : new Date();
        const [inverters, dataloggers] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
                where: {
                    plantId: plant.id,
                    deletedAt: null
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    serialNumber: true,
                    // online: true,
                    // status: true,
                    updatedAt: true
                },
                orderBy: {
                    id: "asc"
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceDatalogger.findMany({
                where: {
                    plantId: plant.id,
                    deletedAt: null
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    serialNumber: true,
                    online: true,
                    status: true,
                    updatedAt: true
                },
                orderBy: {
                    id: "asc"
                }
            })
        ]);
        const allDevices = [
            ...inverters.map((inv)=>({
                    id: String(inv.id),
                    name: inv.name ?? `${inv.type} ${inv.serialNumber}`,
                    type: inv.type,
                    sn: inv.serialNumber,
                    online: null,
                    status: null,
                    updatedAt: inv.updatedAt
                })),
            ...dataloggers.map((log)=>({
                    id: String(log.id),
                    name: log.name ?? `${log.type} ${log.serialNumber}`,
                    type: log.type,
                    sn: log.serialNumber,
                    online: log.online,
                    status: log.status,
                    updatedAt: log.updatedAt
                }))
        ];
        let logs = allDevices.filter((device)=>{
            if (params.search && params.search.trim()) {
                const searchLower = params.search.toLowerCase();
                return device.name.toLowerCase().includes(searchLower) || device.sn.toLowerCase().includes(searchLower);
            }
            return true;
        }).map((device)=>({
                id: `log-${device.id}`,
                name: device.name,
                type: device.type,
                sn: device.sn,
                time: this.formatDateTime(device.updatedAt)
            }));
        // .filter((log) => {
        // 	if (params.event && params.event !== 'All') {
        // 		return log.event === params.event || log.event.startsWith(`${params.event}-`);
        // 	}
        // 	return true;
        // });
        const totalItems = logs.length;
        const totalPages = totalItems > 0 ? Math.ceil(totalItems / params.pageSize) : 0;
        const safePage = totalPages > 0 ? Math.min(params.page, totalPages) : 1;
        const start = (safePage - 1) * params.pageSize;
        return {
            items: logs.slice(start, start + params.pageSize),
            pagination: {
                page: totalItems > 0 ? safePage : 1,
                pageSize: params.pageSize,
                totalItems,
                totalPages
            }
        };
    }
    async exportPlantLogs(params) {
        const plant = await this.getScopedPlantOrThrow(params.scope, params.plantId);
        const [inverters, dataloggers] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
                where: {
                    plantId: plant.id,
                    deletedAt: null
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    serialNumber: true,
                    // online: true,
                    // status: true,
                    updatedAt: true
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceDatalogger.findMany({
                where: {
                    plantId: plant.id,
                    deletedAt: null
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    serialNumber: true,
                    online: true,
                    status: true,
                    updatedAt: true
                }
            })
        ]);
        const allDevices = [
            ...inverters.map((inv)=>({
                    id: String(inv.id),
                    name: inv.name ?? `${inv.type} ${inv.serialNumber}`,
                    type: inv.type,
                    sn: inv.serialNumber,
                    // online: inv.online,
                    // status: inv.status,
                    updatedAt: inv.updatedAt
                })),
            ...dataloggers.map((log)=>({
                    id: String(log.id),
                    name: log.name ?? `${log.type} ${log.serialNumber}`,
                    type: log.type,
                    sn: log.serialNumber,
                    online: log.online,
                    status: log.status,
                    updatedAt: log.updatedAt
                }))
        ];
        const logs = allDevices.filter((device)=>{
            if (params.search && params.search.trim()) {
                const searchLower = params.search.toLowerCase();
                return device.name.toLowerCase().includes(searchLower) || device.sn.toLowerCase().includes(searchLower);
            }
            return true;
        }).map((device)=>({
                id: `log-${device.id}`,
                name: device.name,
                type: device.type,
                sn: device.sn,
                time: this.formatDateTime(device.updatedAt)
            }));
        // .filter((log) => {
        // 	if (params.event && params.event !== 'All') {
        // 		return log.event === params.event || log.event.startsWith(`${params.event}-`);
        // 	}
        // 	return true;
        // });
        if (params.format === "csv") {
            const headers = [
                "ID",
                "Name",
                "Type",
                "S/N",
                "Time",
                "Status",
                "Event"
            ];
            const rows = [
                headers.join(",")
            ];
            for (const log of logs){
                rows.push([
                    log.id,
                    `"${log.name.replace(/"/g, '""')}"`,
                    log.type,
                    log.sn,
                    log.time
                ].join(","));
            }
            const fileName = "plant-logs.csv";
            return {
                fileName,
                csv: rows.join("\n"),
                downloadUrl: `/api/v1/monitor/plants/${params.plantId}/logs/export/files/${fileName}`,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
            };
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](400, `Unsupported export format: ${params.format}`);
    }
    async getUserLogs(params) {
        const dateFromObj = params.dateFrom ? new Date(`${params.dateFrom}T00:00:00.000Z`) : new Date("2025-01-01T00:00:00.000Z");
        const dateToObj = params.dateTo ? new Date(`${params.dateTo}T23:59:59.999Z`) : new Date();
        const plants = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].plant.findMany({
            where: {
                userAccount: {
                    in: params.scope
                },
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                user: {
                    select: {
                        account: true
                    }
                }
            }
        });
        const plantMap = new Map(plants.map((plant)=>[
                plant.id.toString(),
                {
                    plantName: plant.name,
                    account: plant.user.account
                }
            ]));
        const plantIds = plants.map((plant)=>plant.id);
        console.log("plants =>", plants.length);
        console.log(plants);
        const inverters = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deviceInverter.findMany({
            where: {
                plantId: {
                    in: plantIds
                },
                deletedAt: null,
                updatedAt: {
                    gte: dateFromObj,
                    lte: dateToObj
                }
            },
            select: {
                id: true,
                plantId: true,
                serialNumber: true,
                updatedAt: true,
                type: true
            }
        });
        console.log("inverters =>", inverters.length);
        console.log(inverters.slice(0, 5));
        let logs = inverters.map((inv)=>{
            const plantInfo = plantMap.get(inv.plantId.toString());
            return {
                id: `inv-${inv.id}`,
                name: plantInfo?.plantName ?? "",
                account: plantInfo?.account ?? "",
                type: inv.type,
                sn: inv.serialNumber,
                time: this.formatDateTime(inv.updatedAt),
                status: "Active",
                event: "",
                updatedAt: inv.updatedAt
            };
        });
        if (params.search?.trim()) {
            const search = params.search.toLowerCase();
            logs = logs.filter((log)=>log.name.toLowerCase().includes(search) || log.account.toLowerCase().includes(search) || log.sn.toLowerCase().includes(search));
        }
        const totalItems = logs.length;
        const totalPages = totalItems > 0 ? Math.ceil(totalItems / params.pageSize) : 0;
        const safePage = totalPages > 0 ? Math.min(params.page, totalPages) : 1;
        const start = (safePage - 1) * params.pageSize;
        return {
            items: logs.slice(start, start + params.pageSize).map(({ updatedAt, ...log })=>log),
            pagination: {
                page: totalItems > 0 ? safePage : 1,
                pageSize: params.pageSize,
                totalItems,
                totalPages
            }
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/server/repositories/user.repository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "UserRepository",
    ()=>UserRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/server/db/generated/prisma/client.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$enums$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/generated/prisma/enums.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
class UserRepository {
    dbClient;
    constructor(dbClient = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"]){
        this.dbClient = dbClient;
    }
    buildWhere(roleType, filters) {
        const where = {};
        if (roleType !== "all") {
            where.role = roleType;
        }
        where.isDeleted = filters.isDeleted ?? false;
        if (filters.portal) {
            where.portal = filters.portal;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.account) {
            where.account = {
                contains: filters.account,
                mode: "insensitive"
            };
        }
        if (filters.email) {
            where.email = {
                contains: filters.email,
                mode: "insensitive"
            };
        }
        if (filters.phone) {
            where.phone = {
                contains: filters.phone,
                mode: "insensitive"
            };
        }
        if (filters.search) {
            where.OR = [
                {
                    account: {
                        contains: filters.search,
                        mode: "insensitive"
                    }
                },
                {
                    email: {
                        contains: filters.search,
                        mode: "insensitive"
                    }
                },
                {
                    phone: {
                        contains: filters.search,
                        mode: "insensitive"
                    }
                }
            ];
        }
        return where;
    }
    mapDetailRecord(record) {
        return {
            id: record.id,
            account: record.account,
            email: record.email,
            portal: record.portal,
            role: record.role,
            status: record.status,
            timezone: record.timezone,
            phone: record.phone,
            address: record.address,
            assignedById: record.assignedById,
            isDeleted: record.isDeleted,
            emailVerifiedAt: record.emailVerifiedAt,
            lastLoginAt: record.lastLoginAt,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            deletedAt: record.deletedAt
        };
    }
    async findMonitoringUserByAccount(account) {
        const user = await this.dbClient.user.findFirst({
            where: {
                account,
                role: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$generated$2f$prisma$2f$enums$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UserRole"].monitoring_user,
                isDeleted: false
            },
            select: {
                id: true,
                account: true,
                email: true,
                portal: true,
                role: true,
                status: true,
                timezone: true,
                phone: true,
                address: true,
                assignedById: true,
                isDeleted: true,
                emailVerifiedAt: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        });
        return user ? this.mapDetailRecord(user) : null;
    }
    async findLatestDeviceBySN(sno) {
        const device = await this.dbClient.deviceLogsLatest.findFirst({
            where: {
                sno
            },
            orderBy: {
                latestTimestamp: "desc"
            },
            select: {
                id: true,
                sno: true,
                inverterName: true,
                dayDate: true,
                latestTimestamp: true,
                dailyProduction: true,
                totalEnergy: true,
                totalHours: true,
                currentPower: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!device) {
            return null;
        }
        const currentStatus = await this.dbClient.deviceCurrentStatus.findUnique({
            where: {
                sno
            },
            select: {
                status: true
            }
        });
        const userMapping = await this.dbClient.userPlantInverterMap.findFirst({
            where: {
                serialNumber: sno,
                isDeleted: false
            },
            select: {
                userId: true,
                user: {
                    select: {
                        account: true
                    }
                }
            }
        });
        return {
            ...device,
            status: currentStatus?.status ?? "Offline",
            userId: userMapping?.userId?.toString() ?? null,
            account: userMapping?.user.account ?? null
        };
    }
    async updateProfile(userId, payload) {
        return this.dbClient.user.update({
            where: {
                id: userId
            },
            data: {
                email: payload.email,
                phone: payload.phone ?? null,
                address: payload.address ?? null,
                timezone: payload.timezone ?? null
            },
            select: {
                account: true,
                email: true,
                phone: true,
                address: true,
                timezone: true,
                updatedAt: true
            }
        });
    }
    async getProfile(userId) {
        return this.dbClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                account: true,
                email: true,
                phone: true,
                address: true,
                timezone: true
            }
        });
    }
    async getAccountScopeByUserId(userId) {
        const user = await this.dbClient.user.findUnique({
            where: {
                id: BigInt(userId)
            },
            select: {
                account: true
            }
        });
        return user ? [
            user.account
        ] : null;
    }
    async findByPortalAndAccount(portal, account) {
        const record = await this.dbClient.user.findFirst({
            where: {
                portal: portal,
                account: {
                    equals: account,
                    mode: "insensitive"
                }
            },
            select: {
                id: true
            }
        });
        return record ?? null;
    }
    async findByPortalAndEmail(portal, email) {
        const record = await this.dbClient.user.findFirst({
            where: {
                portal: portal,
                email: {
                    equals: email,
                    mode: "insensitive"
                }
            },
            select: {
                id: true
            }
        });
        return record ?? null;
    }
    async findById(id) {
        const record = await this.dbClient.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                isDeleted: true
            }
        });
        if (!record) {
            return null;
        }
        return {
            id: record.id,
            isDeleted: record.isDeleted
        };
    }
    async findDetailById(id) {
        const record = await this.dbClient.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                account: true,
                email: true,
                portal: true,
                role: true,
                status: true,
                timezone: true,
                phone: true,
                address: true,
                assignedById: true,
                isDeleted: true,
                emailVerifiedAt: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        });
        if (!record) {
            return null;
        }
        return this.mapDetailRecord(record);
    }
    async listByRole(roleType, filters) {
        const where = this.buildWhere(roleType, filters);
        const page = filters.page;
        const limit = filters.limit;
        const skip = (page - 1) * limit;
        const [total, records] = await Promise.all([
            this.dbClient.user.count({
                where
            }),
            this.dbClient.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    account: true,
                    email: true,
                    portal: true,
                    role: true,
                    status: true,
                    timezone: true,
                    phone: true,
                    address: true,
                    assignedById: true,
                    isDeleted: true,
                    emailVerifiedAt: true,
                    lastLoginAt: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true
                }
            })
        ]);
        return {
            total,
            items: records.map((record)=>this.mapDetailRecord(record))
        };
    }
    async softDeleteById(id) {
        const user = await this.dbClient.user.findUnique({
            where: {
                id
            },
            select: {
                account: true,
                email: true
            }
        });
        console.log("user", user);
        if (!user) {
            return false;
        }
        const result = await this.dbClient.user.updateMany({
            where: {
                id,
                isDeleted: false
            },
            data: {
                account: `${user.account}_deleted`,
                email: `${user.email}_deleted`,
                isDeleted: true,
                deletedAt: new Date()
            }
        });
        return result.count > 0;
    }
    async createServiceUser(input) {
        const record = await this.dbClient.user.create({
            data: {
                portal: "service",
                role: input.role,
                account: input.account,
                email: input.email,
                timezone: input.timezone,
                passwordHash: input.passwordHash,
                phone: input.phone,
                assignedById: input.assignedById
            },
            select: {
                id: true,
                account: true,
                email: true,
                portal: true,
                role: true,
                status: true,
                timezone: true,
                phone: true,
                address: true,
                assignedById: true,
                isDeleted: true,
                emailVerifiedAt: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        });
        return this.mapDetailRecord(record);
    }
    async findActorById(id) {
        const record = await this.dbClient.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                portal: true,
                role: true,
                isDeleted: true
            }
        });
        if (!record) {
            return null;
        }
        return {
            id: record.id,
            portal: record.portal,
            role: record.role,
            isDeleted: record.isDeleted
        };
    }
    async listScopedServiceAdmins(assignedById, filters) {
        const where = {
            portal: "service",
            role: "service_admin",
            assignedById,
            isDeleted: filters.includeDeleted
        };
        if (filters.search.length > 0) {
            where.OR = [
                {
                    account: {
                        contains: filters.search,
                        mode: "insensitive"
                    }
                },
                {
                    email: {
                        contains: filters.search,
                        mode: "insensitive"
                    }
                },
                {
                    phone: {
                        contains: filters.search,
                        mode: "insensitive"
                    }
                }
            ];
        }
        const skip = (filters.page - 1) * filters.pageSize;
        const [totalItems, records] = await Promise.all([
            this.dbClient.user.count({
                where
            }),
            this.dbClient.user.findMany({
                where,
                skip,
                take: filters.pageSize,
                orderBy: {
                    [filters.sortBy]: filters.sortOrder
                },
                select: {
                    id: true,
                    account: true,
                    email: true,
                    portal: true,
                    role: true,
                    status: true,
                    timezone: true,
                    phone: true,
                    address: true,
                    assignedById: true,
                    isDeleted: true,
                    emailVerifiedAt: true,
                    lastLoginAt: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true
                }
            })
        ]);
        return {
            totalItems,
            items: records.map((record)=>this.mapDetailRecord(record))
        };
    }
    async findScopedServiceAdminById(id, assignedById) {
        const record = await this.dbClient.user.findFirst({
            where: {
                id,
                portal: "service",
                role: "service_admin",
                assignedById
            },
            select: {
                id: true,
                account: true,
                email: true,
                portal: true,
                role: true,
                status: true,
                timezone: true,
                phone: true,
                address: true,
                assignedById: true,
                isDeleted: true,
                emailVerifiedAt: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        });
        if (!record) {
            return null;
        }
        return this.mapDetailRecord(record);
    }
    async findScopedServiceAdmins(actorId) {
        return this.dbClient.user.findMany({
            where: {
                // id: actorId,
                role: "service_admin",
                isDeleted: false
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    async findServiceAdminByEmailExcludingId(email, excludeId) {
        const record = await this.dbClient.user.findFirst({
            where: {
                portal: "service",
                email: {
                    equals: email,
                    mode: "insensitive"
                },
                id: {
                    not: excludeId
                },
                isDeleted: false
            },
            select: {
                id: true
            }
        });
        return record ?? null;
    }
    async updateScopedServiceAdminById(id, assignedById, input, passwordHash) {
        const data = {
            phone: input.phone,
            email: input.email,
            timezone: input.timezone
        };
        if (passwordHash) {
            data.passwordHash = passwordHash;
        }
        const updated = await this.dbClient.user.updateManyAndReturn({
            where: {
                id,
                portal: "service",
                role: "service_admin",
                assignedById,
                isDeleted: false
            },
            data,
            select: {
                id: true,
                account: true,
                email: true,
                portal: true,
                role: true,
                status: true,
                timezone: true,
                phone: true,
                address: true,
                assignedById: true,
                isDeleted: true,
                emailVerifiedAt: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        });
        if (updated.length === 0) {
            return null;
        }
        return this.mapDetailRecord(updated[0]);
    }
    async softDeleteScopedServiceAdminById(id, assignedById) {
        const deleted = await this.dbClient.user.updateManyAndReturn({
            where: {
                id,
                portal: "service",
                role: "service_admin",
                assignedById,
                isDeleted: false
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            },
            select: {
                id: true,
                account: true,
                email: true,
                portal: true,
                role: true,
                status: true,
                timezone: true,
                phone: true,
                address: true,
                assignedById: true,
                isDeleted: true,
                emailVerifiedAt: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        });
        if (deleted.length === 0) {
            return null;
        }
        return this.mapDetailRecord(deleted[0]);
    }
    async getDeviceCountsByAccounts(accounts) {
        if (accounts.length === 0) {
            return new Map();
        }
        const plants = await this.dbClient.plant.findMany({
            where: {
                userAccount: {
                    in: accounts
                },
                deletedAt: null
            },
            select: {
                id: true,
                userAccount: true
            }
        });
        const deviceCountByAccount = new Map();
        for (const account of accounts){
            deviceCountByAccount.set(account, 0);
        }
        if (plants.length === 0) {
            return deviceCountByAccount;
        }
        const plantIds = plants.map((plant)=>plant.id);
        const accountByPlantId = new Map();
        for (const plant of plants){
            accountByPlantId.set(String(plant.id), plant.userAccount);
        }
        const [inverterCounts, dataloggerCounts] = await Promise.all([
            this.dbClient.deviceInverter.groupBy({
                by: [
                    "plantId"
                ],
                where: {
                    plantId: {
                        in: plantIds
                    },
                    deletedAt: null
                },
                _count: {
                    _all: true
                }
            }),
            this.dbClient.deviceDatalogger.groupBy({
                by: [
                    "plantId"
                ],
                where: {
                    plantId: {
                        in: plantIds
                    },
                    deletedAt: null
                },
                _count: {
                    _all: true
                }
            })
        ]);
        for (const item of inverterCounts){
            const account = accountByPlantId.get(String(item.plantId));
            if (!account) {
                continue;
            }
            const current = deviceCountByAccount.get(account) ?? 0;
            deviceCountByAccount.set(account, current + item._count._all);
        }
        for (const item of dataloggerCounts){
            const account = accountByPlantId.get(String(item.plantId));
            if (!account) {
                continue;
            }
            const current = deviceCountByAccount.get(account) ?? 0;
            deviceCountByAccount.set(account, current + item._count._all);
        }
        return deviceCountByAccount;
    }
    async findPasswordById(id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                passwordHash: true,
                isDeleted: true
            }
        });
    }
    async updatePassword(id, passwordHash) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.update({
            where: {
                id
            },
            data: {
                passwordHash
            }
        });
    }
    async findPasswordByAccount(account) {
        return this.dbClient.user.findFirst({
            where: {
                account
            },
            select: {
                id: true,
                isDeleted: true,
                passwordHash: true
            }
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/server/services/plant.service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "addPlantLogger",
    ()=>addPlantLogger,
    "createPlant",
    ()=>createPlant,
    "deletePlant",
    ()=>deletePlant,
    "editPlant",
    ()=>editPlant,
    "exportPlantChart",
    ()=>exportPlantChart,
    "exportPlantList",
    ()=>exportPlantList,
    "exportPlantLogs",
    ()=>exportPlantLogs,
    "getLiveRows",
    ()=>getLiveRows,
    "getPlantAnalysis",
    ()=>getPlantAnalysis,
    "getPlantAnalysisDevices",
    ()=>getPlantAnalysisDevices,
    "getPlantAnalysisParameters",
    ()=>getPlantAnalysisParameters,
    "getPlantChart",
    ()=>getPlantChart,
    "getPlantCurrentAlerts",
    ()=>getPlantCurrentAlerts,
    "getPlantDetails",
    ()=>getPlantDetails,
    "getPlantDeviceOverview",
    ()=>getPlantDeviceOverview,
    "getPlantDeviceOverviewLive",
    ()=>getPlantDeviceOverviewLive,
    "getPlantInformation",
    ()=>getPlantInformation,
    "getPlantInformationLive",
    ()=>getPlantInformationLive,
    "getPlantList",
    ()=>getPlantList,
    "getPlantLogs",
    ()=>getPlantLogs,
    "getPlantOverview",
    ()=>getPlantOverview,
    "getPlantOverviewLive",
    ()=>getPlantOverviewLive,
    "getPlantSummary",
    ()=>getPlantSummary,
    "getUserLogs",
    ()=>getUserLogs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/api-error.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$scope$2d$resolver$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/scope-resolver.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$plant$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/repositories/plant.repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$user$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/repositories/user.repository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$plant$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$user$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$plant$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$user$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
class PlantService {
    plantRepository;
    constructor(plantRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$plant$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlantRepository"]()){
        this.plantRepository = plantRepository;
    }
    formatDateTime(value) {
        return value.toISOString().replace('T', ' ').slice(0, 19);
    }
    resolveDeviceStatus(online, status) {
        if (!online) {
            return 'offline';
        }
        if (status.includes('fault') || status.includes('abnormal')) {
            return 'abnormal';
        }
        return 'online';
    }
    // private toOverviewResponse(snapshot: PlantDeviceOverviewSnapshot) {
    //   const resolvedStatus = this.resolveDeviceStatus(snapshot.online, snapshot.status);
    //   return {
    //     device: {
    //       id: `device-${String(snapshot.id)}`,
    //       name: snapshot.name,
    //       type: snapshot.type,
    //       sn: snapshot.sn,
    //       status: resolvedStatus,
    //       icon: snapshot.online,
    //     },
    //     metrics: {
    //       currentPower: {
    //         value: Number(snapshot.currentPowerKw.toFixed(2)),
    //         unit: 'kW',
    //         dataType: 'live',
    //       },
    //       todayEnergy: {
    //         value: Number(snapshot.todayEnergyKwh.toFixed(2)),
    //         unit: 'kWh',
    //         dataType: 'daily_aggregation',
    //       },
    //       totalEnergy: {
    //         value: Number((snapshot.totalEnergyKwh / 1000).toFixed(2)),
    //         unit: 'MWh',
    //         dataType: 'total_aggregation',
    //       },
    //       hours: {
    //         value: Number(snapshot.totalHours.toFixed(2)),
    //         unit: 'Hrs',
    //         dataType: 'total_aggregation',
    //       },
    //     },
    //     lastUpdate: {
    //       value: this.formatDateTime(snapshot.lastUpdateAt),
    //       dataType: 'live',
    //     },
    //   };
    // }
    // private toOverviewLiveResponse(snapshot: PlantDeviceOverviewSnapshot) {
    //   const resolvedStatus = this.resolveDeviceStatus(snapshot.online, snapshot.status);
    //   return {
    //     device: {
    //       id: `device-${String(snapshot.id)}`,
    //       status: resolvedStatus,
    //       icon: snapshot.online,
    //     },
    //     metrics: {
    //       currentPower: {
    //         value: Number(snapshot.currentPowerKw.toFixed(2)),
    //         unit: 'kW',
    //       },
    //       todayEnergy: {
    //         value: Number(snapshot.todayEnergyKwh.toFixed(2)),
    //         unit: 'kWh',
    //       },
    //       hours: {
    //         value: Number(snapshot.totalHours.toFixed(2)),
    //         unit: 'Hrs',
    //       },
    //     },
    //     lastUpdate: {
    //       value: this.formatDateTime(snapshot.lastUpdateAt),
    //     },
    //   };
    // }
    async resolveScope(user, fromService, targetEndUserId) {
        const baseScope = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$scope$2d$resolver$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveUserScope"])(user);
        const userRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$user$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UserRepository"]();
        const hasServiceRole = user.role === 'service_admin' || user.role === 'service_super_admin';
        if (fromService && hasServiceRole && targetEndUserId) {
            const accountScope = await userRepository.getAccountScopeByUserId(targetEndUserId);
            console.log('accountScope =>', accountScope);
            if (!accountScope) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, 'Selected end user not found');
            }
            return accountScope;
        }
        return baseScope;
    }
    assertPlantAccess(scope, plant) {
        if (!scope || scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, 'Unauthorized access to plants');
        }
        if (!scope.includes(plant.userAccount)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, 'You do not have access to this plant.');
        }
    }
    async calculateTelemetryStats(plant, telemetryRows) {
        const lat = Number(plant.latitude ?? 0);
        const lon = Number(plant.longitude ?? 0);
        /* ==========================
       Latest Telemetry Values
    ========================== */ const inputPowerKw = telemetryRows.reduce((sum, row)=>sum + Number(row.currentPower ?? 0), 0) / 1000;
        const totalEnergyKwh = telemetryRows.reduce((sum, row)=>sum + Number(row.totalEnergy ?? 0), 0);
        const totalHours = telemetryRows.reduce((sum, row)=>sum + Number(row.totalHours ?? 0), 0);
        /* ==========================
       External APIs
    ========================== */ const weatherUrl = `${process.env.OPEN_WEATHER_URL}` + `?lat=${lat}` + `&lon=${lon}` + `&appid=${process.env.OPENWEATHER_API_KEY}` + `&units=metric`;
        const irradianceUrl = `${process.env.SOLAR_IRRADIANCE_URL}` + `?latitude=${lat}` + `&longitude=${lon}` + `&hourly=shortwave_radiation_instant` + `&models=satellite_radiation_seamless` + `&temporal_resolution=native`;
        let weatherData = {
            main: {},
            weather: []
        };
        let irradianceData = {
            hourly: {
                time: [],
                shortwave_radiation_instant: []
            }
        };
        try {
            const [weatherRes, irradianceRes] = await Promise.all([
                fetch(weatherUrl, {
                    next: {
                        revalidate: 300
                    },
                    signal: AbortSignal.timeout(5000)
                }),
                fetch(irradianceUrl, {
                    next: {
                        revalidate: 300
                    },
                    signal: AbortSignal.timeout(5000)
                })
            ]);
            weatherData = weatherRes.ok ? await weatherRes.json() : weatherData;
            irradianceData = irradianceRes.ok ? await irradianceRes.json() : irradianceData;
        } catch (err) {
            console.error("Telemetry API error", err);
        }
        /* ==========================
       Irradiance
    ========================== */ const times = irradianceData?.hourly?.time ?? [];
        const values = irradianceData?.hourly?.shortwave_radiation_instant ?? [];
        const now = new Date();
        now.setSeconds(0, 0);
        now.setMinutes(Math.floor(now.getMinutes() / 15) * 15);
        const currentTime = now.toISOString().slice(0, 16);
        const index = times.indexOf(currentTime);
        const irradianceWm2 = index !== -1 ? Number(values[index] ?? 0) : 0;
        /* ==========================
       Temperature
    ========================== */ const ambientTemp = Number(weatherData?.main?.temp ?? 0);
        const noct = Number(process.env.NOCT ?? 45);
        const cellTemperatureC = ambientTemp + irradianceWm2 / 800 * (noct - 20);
        /* ==========================
       Efficiency
    ========================== */ let currentEfficiency = 0;
        if (totalHours > 0 && plant.kwp && plant.kwp > 0) {
            const avgPower = totalEnergyKwh / totalHours;
            currentEfficiency = avgPower / plant.kwp * 100;
            currentEfficiency = Math.min(Math.max(currentEfficiency, 0), 100);
        }
        /* ==========================
       CO2
    ========================== */ const gef = Number(process.env.GRID_EMISSION_FACTOR ?? 0.82);
        const co2Ton = totalEnergyKwh * gef / 1000;
        const treePlanting = co2Ton * 1000 / Number(process.env.CO2_ABSORPTION_FACTOR ?? 22);
        /* ==========================
       Latest Timestamp
    ========================== */ const latestUpdatedAt = telemetryRows.sort((a, b)=>b.latestTimestamp.getTime() - a.latestTimestamp.getTime())[0]?.latestTimestamp ?? new Date();
        return {
            inputPowerKw,
            co2Ton,
            treePlanting,
            currentEfficiency,
            weather: weatherData?.weather?.[0]?.description ?? "N/A",
            irradianceWm2,
            cellTemperatureC,
            updatedAt: this.formatDateTime(latestUpdatedAt)
        };
    }
    getPlantList(params) {
        return this.plantRepository.getPlantList(params);
    }
    getPlantSummary(params) {
        return this.plantRepository.getPlantSummary(params);
    }
    getLiveRows(params) {
        return this.plantRepository.getLiveRows(params);
    }
    getPlantOverview(params) {
        return this.plantRepository.getPlantOverview(params);
    }
    getPlantOverviewLive(params) {
        return this.plantRepository.getPlantOverviewLive(params);
    }
    getPlantAnalysisDevices(params) {
        return this.plantRepository.getPlantAnalysisDevices(params);
    }
    getPlantAnalysisParameters(params) {
        return this.plantRepository.getPlantAnalysisParameters(params);
    }
    getPlantAnalysis(params) {
        return this.plantRepository.getPlantAnalysis(params);
    }
    getPlantChart(params) {
        return this.plantRepository.getPlantChart(params);
    }
    exportPlantChart(params) {
        return this.plantRepository.exportPlantChart(params);
    }
    exportPlantList(params) {
        return this.plantRepository.exportPlantList(params.user, params.scope, params.fromService, params.targetEndUserId);
    }
    getPlantCurrentAlerts(params) {
        return this.plantRepository.getPlantCurrentAlerts(params);
    }
    async getPlantInformation(params) {
        const scope = await this.resolveScope(params.user, params.fromService, params.targetEndUserId);
        if (scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, 'Unauthorized access to plants');
        }
        const plant = await this.plantRepository.findPlantInformationById(params.plantId);
        if (!plant) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, 'Plant not found.');
        }
        this.assertPlantAccess(scope, plant);
        const [dataloggers, inverterSerials] = await Promise.all([
            this.plantRepository.listPlantDataloggers(params.plantId),
            this.plantRepository.listPlantInverterSerials(BigInt(params.plantId))
        ]);
        const serialNumbers = inverterSerials.map((x)=>x.serialNumber);
        const telemetryRows = await this.plantRepository.getLatestTelemetryBySerials(serialNumbers);
        const telemetry = await this.calculateTelemetryStats(plant, telemetryRows);
        return {
            installationDate: plant.installed ? plant.installed.toISOString().slice(0, 10) : null,
            capacity: `${Number((plant.kwp ?? 0).toFixed(2))} kW`,
            address: plant.address ?? null,
            dataloggerSn: dataloggers.map((item)=>item.serialNumber),
            stats: [
                {
                    label: 'Input Power',
                    value: `${telemetry.inputPowerKw.toFixed(2)} kW`,
                    icon: '/images/information-tab/info-img-1.png'
                },
                {
                    label: 'CO2',
                    value: `${telemetry.co2Ton.toFixed(2)}t`,
                    icon: '/images/information-tab/info-img-2.png'
                },
                {
                    label: 'Tree Planting',
                    value: `${telemetry.treePlanting.toFixed(2)}`,
                    icon: '/images/information-tab/info-img-3.png'
                },
                {
                    label: 'Efficiency',
                    value: `${telemetry.currentEfficiency.toFixed(2)}`,
                    icon: '/images/information-tab/info-img-4.png'
                },
                {
                    label: 'Weather',
                    value: telemetry.weather,
                    icon: '/images/information-tab/info-img-5.png'
                },
                {
                    label: 'Irradiance',
                    value: `${telemetry.irradianceWm2} W/m2`,
                    icon: '/images/information-tab/info-img-6.png'
                },
                {
                    label: 'Cell Temperature',
                    value: `${telemetry.cellTemperatureC} C`,
                    icon: '/images/information-tab/info-img-7.png'
                }
            ],
            updatedAt: telemetry.updatedAt
        };
    }
    async addPlantLogger(params) {
        const scope = await this.resolveScope(params.user, params.fromService, params.targetEndUserId);
        if (scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, 'Unauthorized access to plants');
        }
        const plant = await this.plantRepository.findPlantInformationById(params.plantId);
        if (!plant) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, 'Plant not found.');
        }
        this.assertPlantAccess(scope, plant);
        const normalizedSerialNumber = params.serialNumber.trim();
        const existingLogger = await this.plantRepository.findDataloggerBySerialNumber(normalizedSerialNumber);
        if (existingLogger && !existingLogger.deletedAt) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](409, 'Logger serial number is already linked.');
        }
        const linked = existingLogger ? await this.plantRepository.restorePlantLogger(existingLogger.id, params.plantId, normalizedSerialNumber) : await this.plantRepository.createPlantLogger(params.plantId, normalizedSerialNumber);
        const linkedAt = 'updatedAt' in linked ? linked.updatedAt : linked.createdAt;
        return {
            deviceId: `logger-${String(linked.id)}`,
            serialNumber: linked.serialNumber,
            linkedAt: linkedAt.toISOString()
        };
    }
    // async getPlantInformationLive(params: PlantInformationLiveParams) {
    //   const scope = await this.resolveScope(params.user, params.fromService, params.targetEndUserId);
    //   if (scope.length === 0) {
    //     throw new ApiError(403, 'Unauthorized access to plants');
    //   }
    //   const plant = await this.plantRepository.findPlantInformationById(params.plantId);
    //   if (!plant) {
    //     throw new ApiError(404, 'Plant not found.');
    //   }
    //   this.assertPlantAccess(scope, plant);
    //   const inverters = await this.plantRepository.listPlantInverterTelemetry(params.plantId);
    //   const telemetry = this.calculateTelemetryStats(plant, inverters);
    //   if (params.since) {
    //     const sinceDate = new Date(params.since);
    //     if (!Number.isNaN(sinceDate.getTime()) && telemetry.updatedAt <= sinceDate) {
    //       return {
    //         stats: [],
    //         updatedAt: telemetry.updatedAt.toISOString(),
    //       };
    //     }
    //   }
    //   return {
    //     stats: [
    //       {
    //         label: 'Input Power',
    //         value: `${telemetry.inputPowerKw.toFixed(2)} kW`,
    //       },
    //       {
    //         label: 'Efficiency',
    //         value: `${telemetry.currentEfficiency.toFixed(2)}`,
    //       },
    //       {
    //         label: 'Weather',
    //         value: telemetry.weather,
    //       },
    //       {
    //         label: 'Irradiance',
    //         value: `${telemetry.irradianceWm2} W/m2`,
    //       },
    //       {
    //         label: 'Cell Temperature',
    //         value: `${telemetry.cellTemperatureC} C`,
    //       },
    //     ],
    //     updatedAt: telemetry.updatedAt.toISOString(),
    //   };
    // }
    // async getPlantDeviceOverview(params: PlantDeviceOverviewServiceParams) {
    //   const scope = await this.resolveScope(params.user, params.fromService, params.targetEndUserId);
    //   if (scope.length === 0) {
    //     throw new ApiError(403, 'Unauthorized access to plants');
    //   }
    //   const plant = await this.plantRepository.findPlantInformationById(params.plantId);
    //   if (!plant) {
    //     throw new ApiError(404, 'Plant not found.');
    //   }
    //   this.assertPlantAccess(scope, plant);
    //   const repoParams: PlantDeviceOverviewParams = {
    //     plantId: params.plantId,
    //     deviceId: params.deviceId,
    //   };
    //   const snapshot = await this.plantRepository.getPlantDeviceOverviewSnapshot(repoParams);
    //   return this.toOverviewResponse(snapshot);
    // }
    // async getPlantDeviceOverviewLive(params: PlantDeviceOverviewLiveServiceParams) {
    //   const scope = await this.resolveScope(params.user, params.fromService, params.targetEndUserId);
    //   if (scope.length === 0) {
    //     throw new ApiError(403, 'Unauthorized access to plants');
    //   }
    //   const plant = await this.plantRepository.findPlantInformationById(params.plantId);
    //   if (!plant) {
    //     throw new ApiError(404, 'Plant not found.');
    //   }
    //   this.assertPlantAccess(scope, plant);
    //   const repoParams: PlantDeviceOverviewLiveParams = {
    //     plantId: params.plantId,
    //     deviceId: params.deviceId,
    //     since: params.since,
    //   };
    //   const snapshot = await this.plantRepository.getPlantDeviceOverviewSnapshot(repoParams);
    //   return this.toOverviewLiveResponse(snapshot);
    // }
    getPlantDetails(user, scope, plantId) {
        void user;
        return this.plantRepository.getPlantDetails(scope, plantId);
    }
    createPlant(user, scope, plantData) {
        return this.plantRepository.createPlant(user, scope, plantData);
    }
    editPlant(user, scope, plantId, plantData) {
        void user;
        return this.plantRepository.editPlant(scope, plantId, plantData);
    }
    deletePlant(user, scope, plantId) {
        void user;
        return this.plantRepository.deletePlant(scope, plantId);
    }
    async getPlantLogs(params) {
        const scope = await this.resolveScope(params.user, params.fromService, params.targetEndUserId);
        console.log({
            role: params.user.role,
            fromService: params.fromService,
            targetEndUserId: params.targetEndUserId,
            scope
        });
        if (scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, 'Unauthorized access to plants');
        }
        const plant = await this.plantRepository.findPlantInformationById(params.plantId);
        if (!plant) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, 'Plant not found.');
        }
        this.assertPlantAccess(scope, plant);
        const logsParams = {
            scope,
            plantId: params.plantId,
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
            event: params.event,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo
        };
        return this.plantRepository.getPlantLogs(logsParams);
    }
    async exportPlantLogs(params) {
        const scope = await this.resolveScope(params.user, params.fromService, params.targetEndUserId);
        if (scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, 'Unauthorized access to plants');
        }
        const plant = await this.plantRepository.findPlantInformationById(params.plantId);
        if (!plant) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](404, 'Plant not found.');
        }
        this.assertPlantAccess(scope, plant);
        const exportParams = {
            scope,
            plantId: params.plantId,
            search: params.search,
            event: params.event,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            format: params.format
        };
        return this.plantRepository.exportPlantLogs(exportParams);
    }
    async getUserLogs(params) {
        console.log('getUserLogs params:', {
            userId: params.user.userId,
            role: params.user.role,
            fromService: params.fromService,
            targetEndUserId: params.targetEndUserId
        });
        const scope = await this.resolveScope(params.user, params.fromService, params.targetEndUserId);
        console.log('scope =>', scope);
        if (scope.length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"](403, 'Unauthorized access to plants');
        }
        return this.plantRepository.getUserLogs({
            scope,
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
            event: params.event,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo
        });
    }
}
const plantService = new PlantService();
async function getPlantList(params) {
    return plantService.getPlantList(params);
}
async function getPlantSummary(params) {
    return plantService.getPlantSummary(params);
}
async function getLiveRows(params) {
    return plantService.getLiveRows(params);
}
async function getPlantOverview(params) {
    return plantService.getPlantOverview(params);
}
async function getPlantOverviewLive(params) {
    return plantService.getPlantOverviewLive(params);
}
async function getPlantAnalysisDevices(params) {
    return plantService.getPlantAnalysisDevices(params);
}
async function getPlantAnalysisParameters(params) {
    return plantService.getPlantAnalysisParameters(params);
}
async function getPlantAnalysis(params) {
    return plantService.getPlantAnalysis(params);
}
async function getPlantChart(params) {
    return plantService.getPlantChart(params);
}
async function exportPlantChart(params) {
    return plantService.exportPlantChart(params);
}
async function exportPlantList(user, scope, fromService, targetEndUserId) {
    return plantService.exportPlantList({
        user,
        scope,
        page: 1,
        pageSize: 100000,
        fromService,
        targetEndUserId
    });
}
async function getPlantCurrentAlerts(params) {
    return plantService.getPlantCurrentAlerts(params);
}
async function getPlantInformation(params) {
    return plantService.getPlantInformation(params);
}
async function addPlantLogger(params) {
    return plantService.addPlantLogger(params);
}
async function getPlantInformationLive(params) {
// return plantService.getPlantInformationLive(params);
}
async function getPlantDeviceOverview(params) {
// return plantService.getPlantDeviceOverview(params);
}
async function getPlantDeviceOverviewLive(params) {
// return plantService.getPlantDeviceOverviewLive(params);
}
async function getPlantDetails(user, scope, plantId) {
    return plantService.getPlantDetails(user, scope, plantId);
}
async function createPlant(user, scope, plantData) {
    return plantService.createPlant(user, scope, plantData);
}
async function editPlant(user, scope, plantId, plantData) {
    return plantService.editPlant(user, scope, plantId, plantData);
}
async function deletePlant(user, scope, plantId) {
    return plantService.deletePlant(user, scope, plantId);
}
async function getPlantLogs(params) {
    return plantService.getPlantLogs(params);
}
async function getUserLogs(params) {
    return plantService.getUserLogs(params);
}
async function exportPlantLogs(params) {
    return plantService.exportPlantLogs(params);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
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
"[project]/src/server/validators/plant.validator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogsQueryValidator",
    ()=>LogsQueryValidator,
    "PlantAddLoggerBodyValidator",
    ()=>PlantAddLoggerBodyValidator,
    "PlantAnalysisDevicesQueryValidator",
    ()=>PlantAnalysisDevicesQueryValidator,
    "PlantAnalysisParametersQueryValidator",
    ()=>PlantAnalysisParametersQueryValidator,
    "PlantAnalysisQueryValidator",
    ()=>PlantAnalysisQueryValidator,
    "PlantChartExportQueryValidator",
    ()=>PlantChartExportQueryValidator,
    "PlantChartQueryValidator",
    ()=>PlantChartQueryValidator,
    "PlantCreateValidator",
    ()=>PlantCreateValidator,
    "PlantCurrentAlertsQueryValidator",
    ()=>PlantCurrentAlertsQueryValidator,
    "PlantDeleteValidator",
    ()=>PlantDeleteValidator,
    "PlantDeviceOverviewLiveQueryValidator",
    ()=>PlantDeviceOverviewLiveQueryValidator,
    "PlantDeviceOverviewQueryValidator",
    ()=>PlantDeviceOverviewQueryValidator,
    "PlantEditValidator",
    ()=>PlantEditValidator,
    "PlantInformationLiveQueryValidator",
    ()=>PlantInformationLiveQueryValidator,
    "PlantInformationQueryValidator",
    ()=>PlantInformationQueryValidator,
    "PlantListValidator",
    ()=>PlantListValidator,
    "PlantLiveRowsValidator",
    ()=>PlantLiveRowsValidator,
    "PlantLogsExportQueryValidator",
    ()=>PlantLogsExportQueryValidator,
    "PlantLogsQueryValidator",
    ()=>PlantLogsQueryValidator,
    "PlantOverviewLiveQueryValidator",
    ()=>PlantOverviewLiveQueryValidator,
    "PlantOverviewQueryValidator",
    ()=>PlantOverviewQueryValidator,
    "PlantSummaryValidator",
    ()=>PlantSummaryValidator,
    "PlantViewValidator",
    ()=>PlantViewValidator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const PlantListValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    selectedEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    monitorUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'All',
        'Normal',
        'Abnormal',
        'Standby',
        'Offline'
    ]).default('All'),
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).default(1),
    pageSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(100).default(10),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default(''),
    sortBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    sortOrder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'asc',
        'desc'
    ]).default('asc')
});
const PlantSummaryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    selectedEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    monitorUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('')
});
const PlantLiveRowsValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    selectedEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    monitorUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'All',
        'Normal',
        'Abnormal',
        'Standby',
        'Offline'
    ]).default('All'),
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).default(1),
    pageSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(100).default(10),
    plantIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
    ]))
});
const PlantViewValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional()
});
const PlantCreateValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    selectedEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    monitorUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    plantName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Plant name is required'),
    plantType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Plant type is required'),
    installedDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Installed Date is required'),
    kwp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1, 'Plant capacity is required'),
    price: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1, 'Plant Price is required'),
    priceUnit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    longitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'longitude is required'),
    latitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'latitude is required'),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Address is required'),
    pictureFileId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantEditValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    plantName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Plant name is required'),
    plantType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Plant type is required'),
    installedDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Installed Date is required'),
    kwp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1, 'Plant capacity is required'),
    price: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1, 'Plant Price is required'),
    priceUnit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    longitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'longitude is required'),
    latitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'latitude is required'),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Address is required'),
    pictureFileId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantDeleteValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantOverviewQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantOverviewLiveQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    since: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantAnalysisDevicesQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantAnalysisParametersQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    deviceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'deviceId is required')
});
const PlantAnalysisQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    deviceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'deviceId is required'),
    date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'parameters are required'),
    interval: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        '5m',
        '15m',
        '30m',
        '60m'
    ]).default('15m')
});
const PlantChartQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'date is required'),
    range: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'day',
        'month',
        'year'
    ]),
    mode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'total',
        'single'
    ]).default('total')
});
const PlantChartExportQueryValidator = PlantChartQueryValidator.extend({
    format: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'csv'
    ]).default('csv')
});
const PlantCurrentAlertsQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'active'
    ]).default('active'),
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).default(1),
    pageSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(100).default(10),
    since: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantInformationQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantInformationLiveQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    since: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantDeviceOverviewQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantDeviceOverviewLiveQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    since: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlantAddLoggerBodyValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    serialNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, 'serialNumber is required')
});
const PlantLogsQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).default(1),
    pageSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(100).default(10),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default(''),
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('All'),
    dateFrom: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dateFrom must be YYYY-MM-DD'),
    dateTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dateTo must be YYYY-MM-DD')
});
const PlantLogsExportQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default(''),
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('All'),
    dateFrom: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dateFrom must be YYYY-MM-DD'),
    dateTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dateTo must be YYYY-MM-DD'),
    format: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'csv'
    ]).default('csv')
});
const LogsQueryValidator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1).default(1),
    pageSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1).max(100).default(10),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default(''),
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('All'),
    dateFrom: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    dateTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    fromService: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    targetEndUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
}),
"[project]/src/app/api/v1/monitor/plants/list/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$middleware$2f$auth$2e$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/middleware/auth.middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$middleware$2f$request$2d$log$2e$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/middleware/request-log.middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$plant$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/plant.service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/api-error.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/api-response.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$scope$2d$resolver$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/utils/scope-resolver.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$validators$2f$plant$2e$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/validators/plant.validator.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$plant$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$plant$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
async function getPlantListRoute(request) {
    const authenticatedRequest = request;
    const auth = authenticatedRequest.auth;
    if (!auth?.userId) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])('Unauthorized', 401);
    }
    const user = {
        userId: auth.userId,
        account: typeof auth.account === 'string' ? auth.account : auth.userId,
        role: auth.role
    };
    const scope = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$scope$2d$resolver$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveUserScope"])(user);
    if (scope.length === 0) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])('Unauthorized access to plants', 403);
    }
    const searchParams = new URL(request.url).searchParams;
    const parsedQuery = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$validators$2f$plant$2e$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlantListValidator"].safeParse({
        role: searchParams.get('role') ?? undefined,
        fromService: searchParams.get('fromService') ? searchParams.get('fromService') === 'true' : undefined,
        selectedEndUserId: searchParams.get('userid') ?? searchParams.get('selectedEndUserId') ?? undefined,
        monitorUserId: searchParams.get('monitorUserId') ?? undefined,
        status: searchParams.get('status') ?? undefined,
        page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : undefined,
        search: searchParams.get('search') ?? undefined,
        sortBy: searchParams.get('sortBy') ?? undefined,
        sortOrder: searchParams.get('sortOrder') ?? undefined
    });
    if (!parsedQuery.success) {
        const firstIssue = parsedQuery.error.issues[0];
        const message = firstIssue ? `${firstIssue.path.join('.') || 'query'}: ${firstIssue.message}` : 'Invalid query parameters';
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])(message, 400);
    }
    try {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$plant$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPlantList"])({
            user,
            scope,
            selectedEndUserId: parsedQuery.data.selectedEndUserId,
            search: parsedQuery.data.search,
            status: parsedQuery.data.status,
            page: parsedQuery.data.page,
            pageSize: parsedQuery.data.pageSize,
            sortBy: parsedQuery.data.sortBy,
            sortOrder: parsedQuery.data.sortOrder
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])('Plant list fetched successfully.', data);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"]) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])(error.message, error.statusCode);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])('Failed to fetch plant list', 500);
    }
}
const GET = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$middleware$2f$request$2d$log$2e$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withRequestLogging"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$middleware$2f$auth$2e$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(getPlantListRoute), {
    routeName: 'monitor.plants.list'
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__026vul4._.js.map