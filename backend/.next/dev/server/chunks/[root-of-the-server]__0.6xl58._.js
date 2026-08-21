module.exports = [
"[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ /* eslint-disable node/no-deprecated-api */ var buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
var Buffer = buffer.Buffer;
// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
    for(var key in src){
        dst[key] = src[key];
    }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
} else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
}
SafeBuffer.prototype = Object.create(Buffer.prototype);
// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
        throw new TypeError('Argument must not be a number');
    }
    return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
        if (typeof encoding === 'string') {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
    } else {
        buf.fill(0);
    }
    return buf;
};
SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return buffer.SlowBuffer(size);
};
}),
"[project]/node_modules/jws/lib/data-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module, process*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
function DataStream(data) {
    this.buffer = null;
    this.writable = true;
    this.readable = true;
    // No input
    if (!data) {
        this.buffer = Buffer.alloc(0);
        return this;
    }
    // Stream
    if (typeof data.pipe === 'function') {
        this.buffer = Buffer.alloc(0);
        data.pipe(this);
        return this;
    }
    // Buffer or String
    // or Object (assumedly a passworded key)
    if (data.length || typeof data === 'object') {
        this.buffer = data;
        this.writable = false;
        process.nextTick((function() {
            this.emit('end', data);
            this.readable = false;
            this.emit('close');
        }).bind(this));
        return this;
    }
    throw new TypeError('Unexpected data type (' + typeof data + ')');
}
util.inherits(DataStream, Stream);
DataStream.prototype.write = function write(data) {
    this.buffer = Buffer.concat([
        this.buffer,
        Buffer.from(data)
    ]);
    this.emit('data', data);
};
DataStream.prototype.end = function end(data) {
    if (data) this.write(data);
    this.emit('end', data);
    this.emit('close');
    this.writable = false;
    this.readable = false;
};
module.exports = DataStream;
}),
"[project]/node_modules/jws/lib/tostring.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module*/ var Buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer;
module.exports = function toString(obj) {
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || Buffer.isBuffer(obj)) return obj.toString();
    return JSON.stringify(obj);
};
}),
"[project]/node_modules/jws/lib/sign-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var DataStream = __turbopack_context__.r("[project]/node_modules/jws/lib/data-stream.js [app-route] (ecmascript)");
var jwa = __turbopack_context__.r("[project]/node_modules/jwa/index.js [app-route] (ecmascript)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var toString = __turbopack_context__.r("[project]/node_modules/jws/lib/tostring.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
function base64url(string, encoding) {
    return Buffer.from(string, encoding).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function jwsSecuredInput(header, payload, encoding) {
    encoding = encoding || 'utf8';
    var encodedHeader = base64url(toString(header), 'binary');
    var encodedPayload = base64url(toString(payload), encoding);
    return util.format('%s.%s', encodedHeader, encodedPayload);
}
function jwsSign(opts) {
    var header = opts.header;
    var payload = opts.payload;
    var secretOrKey = opts.secret || opts.privateKey;
    var encoding = opts.encoding;
    var algo = jwa(header.alg);
    var securedInput = jwsSecuredInput(header, payload, encoding);
    var signature = algo.sign(securedInput, secretOrKey);
    return util.format('%s.%s', securedInput, signature);
}
function SignStream(opts) {
    var secret = opts.secret;
    secret = secret == null ? opts.privateKey : secret;
    secret = secret == null ? opts.key : secret;
    if (/^hs/i.test(opts.header.alg) === true && secret == null) {
        throw new TypeError('secret must be a string or buffer or a KeyObject');
    }
    var secretStream = new DataStream(secret);
    this.readable = true;
    this.header = opts.header;
    this.encoding = opts.encoding;
    this.secret = this.privateKey = this.key = secretStream;
    this.payload = new DataStream(opts.payload);
    this.secret.once('close', (function() {
        if (!this.payload.writable && this.readable) this.sign();
    }).bind(this));
    this.payload.once('close', (function() {
        if (!this.secret.writable && this.readable) this.sign();
    }).bind(this));
}
util.inherits(SignStream, Stream);
SignStream.prototype.sign = function sign() {
    try {
        var signature = jwsSign({
            header: this.header,
            payload: this.payload.buffer,
            secret: this.secret.buffer,
            encoding: this.encoding
        });
        this.emit('done', signature);
        this.emit('data', signature);
        this.emit('end');
        this.readable = false;
        return signature;
    } catch (e) {
        this.readable = false;
        this.emit('error', e);
        this.emit('close');
    }
};
SignStream.sign = jwsSign;
module.exports = SignStream;
}),
"[project]/node_modules/jws/lib/verify-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var DataStream = __turbopack_context__.r("[project]/node_modules/jws/lib/data-stream.js [app-route] (ecmascript)");
var jwa = __turbopack_context__.r("[project]/node_modules/jwa/index.js [app-route] (ecmascript)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var toString = __turbopack_context__.r("[project]/node_modules/jws/lib/tostring.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
function isObject(thing) {
    return Object.prototype.toString.call(thing) === '[object Object]';
}
function safeJsonParse(thing) {
    if (isObject(thing)) return thing;
    try {
        return JSON.parse(thing);
    } catch (e) {
        return undefined;
    }
}
function headerFromJWS(jwsSig) {
    var encodedHeader = jwsSig.split('.', 1)[0];
    return safeJsonParse(Buffer.from(encodedHeader, 'base64').toString('binary'));
}
function securedInputFromJWS(jwsSig) {
    return jwsSig.split('.', 2).join('.');
}
function signatureFromJWS(jwsSig) {
    return jwsSig.split('.')[2];
}
function payloadFromJWS(jwsSig, encoding) {
    encoding = encoding || 'utf8';
    var payload = jwsSig.split('.')[1];
    return Buffer.from(payload, 'base64').toString(encoding);
}
function isValidJws(string) {
    return JWS_REGEX.test(string) && !!headerFromJWS(string);
}
function jwsVerify(jwsSig, algorithm, secretOrKey) {
    if (!algorithm) {
        var err = new Error("Missing algorithm parameter for jws.verify");
        err.code = "MISSING_ALGORITHM";
        throw err;
    }
    jwsSig = toString(jwsSig);
    var signature = signatureFromJWS(jwsSig);
    var securedInput = securedInputFromJWS(jwsSig);
    var algo = jwa(algorithm);
    return algo.verify(securedInput, signature, secretOrKey);
}
function jwsDecode(jwsSig, opts) {
    opts = opts || {};
    jwsSig = toString(jwsSig);
    if (!isValidJws(jwsSig)) return null;
    var header = headerFromJWS(jwsSig);
    if (!header) return null;
    var payload = payloadFromJWS(jwsSig);
    if (header.typ === 'JWT' || opts.json) payload = JSON.parse(payload, opts.encoding);
    return {
        header: header,
        payload: payload,
        signature: signatureFromJWS(jwsSig)
    };
}
function VerifyStream(opts) {
    opts = opts || {};
    var secretOrKey = opts.secret;
    secretOrKey = secretOrKey == null ? opts.publicKey : secretOrKey;
    secretOrKey = secretOrKey == null ? opts.key : secretOrKey;
    if (/^hs/i.test(opts.algorithm) === true && secretOrKey == null) {
        throw new TypeError('secret must be a string or buffer or a KeyObject');
    }
    var secretStream = new DataStream(secretOrKey);
    this.readable = true;
    this.algorithm = opts.algorithm;
    this.encoding = opts.encoding;
    this.secret = this.publicKey = this.key = secretStream;
    this.signature = new DataStream(opts.signature);
    this.secret.once('close', (function() {
        if (!this.signature.writable && this.readable) this.verify();
    }).bind(this));
    this.signature.once('close', (function() {
        if (!this.secret.writable && this.readable) this.verify();
    }).bind(this));
}
util.inherits(VerifyStream, Stream);
VerifyStream.prototype.verify = function verify() {
    try {
        var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
        var obj = jwsDecode(this.signature.buffer, this.encoding);
        this.emit('done', valid, obj);
        this.emit('data', valid);
        this.emit('end');
        this.readable = false;
        return valid;
    } catch (e) {
        this.readable = false;
        this.emit('error', e);
        this.emit('close');
    }
};
VerifyStream.decode = jwsDecode;
VerifyStream.isValid = isValidJws;
VerifyStream.verify = jwsVerify;
module.exports = VerifyStream;
}),
"[project]/node_modules/jws/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global exports*/ var SignStream = __turbopack_context__.r("[project]/node_modules/jws/lib/sign-stream.js [app-route] (ecmascript)");
var VerifyStream = __turbopack_context__.r("[project]/node_modules/jws/lib/verify-stream.js [app-route] (ecmascript)");
var ALGORITHMS = [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512'
];
exports.ALGORITHMS = ALGORITHMS;
exports.sign = SignStream.sign;
exports.verify = VerifyStream.verify;
exports.decode = VerifyStream.decode;
exports.isValid = VerifyStream.isValid;
exports.createSign = function createSign(opts) {
    return new SignStream(opts);
};
exports.createVerify = function createVerify(opts) {
    return new VerifyStream(opts);
};
}),
"[project]/node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function getParamSize(keySize) {
    var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
    return result;
}
var paramBytesForAlg = {
    ES256: getParamSize(256),
    ES384: getParamSize(384),
    ES512: getParamSize(521)
};
function getParamBytesForAlg(alg) {
    var paramBytes = paramBytesForAlg[alg];
    if (paramBytes) {
        return paramBytes;
    }
    throw new Error('Unknown algorithm "' + alg + '"');
}
module.exports = getParamBytesForAlg;
}),
"[project]/node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var getParamBytesForAlg = __turbopack_context__.r("[project]/node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js [app-route] (ecmascript)");
var MAX_OCTET = 0x80, CLASS_UNIVERSAL = 0, PRIMITIVE_BIT = 0x20, TAG_SEQ = 0x10, TAG_INT = 0x02, ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6, ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
function base64Url(base64) {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function signatureAsBuffer(signature) {
    if (Buffer.isBuffer(signature)) {
        return signature;
    } else if ('string' === typeof signature) {
        return Buffer.from(signature, 'base64');
    }
    throw new TypeError('ECDSA signature must be a Base64 string or a Buffer');
}
function derToJose(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    // the DER encoded param should at most be the param size, plus a padding
    // zero, since due to being a signed integer
    var maxEncodedParamLength = paramBytes + 1;
    var inputLength = signature.length;
    var offset = 0;
    if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
    }
    var seqLength = signature[offset++];
    if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
    }
    if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
    }
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
    }
    var rLength = signature[offset++];
    if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
    }
    if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var rOffset = offset;
    offset += rLength;
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
    }
    var sLength = signature[offset++];
    if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
    }
    if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var sOffset = offset;
    offset += sLength;
    if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
    }
    var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
    var dst = Buffer.allocUnsafe(rPadding + rLength + sPadding + sLength);
    for(offset = 0; offset < rPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
    offset = paramBytes;
    for(var o = offset; offset < o + sPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
    dst = dst.toString('base64');
    dst = base64Url(dst);
    return dst;
}
function countPadding(buf, start, stop) {
    var padding = 0;
    while(start + padding < stop && buf[start + padding] === 0){
        ++padding;
    }
    var needsSign = buf[start + padding] >= MAX_OCTET;
    if (needsSign) {
        --padding;
    }
    return padding;
}
function joseToDer(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    var signatureBytes = signature.length;
    if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
    }
    var rPadding = countPadding(signature, 0, paramBytes);
    var sPadding = countPadding(signature, paramBytes, signature.length);
    var rLength = paramBytes - rPadding;
    var sLength = paramBytes - sPadding;
    var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
    var shortLength = rsBytes < MAX_OCTET;
    var dst = Buffer.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
    var offset = 0;
    dst[offset++] = ENCODED_TAG_SEQ;
    if (shortLength) {
        // Bit 8 has value "0"
        // bits 7-1 give the length.
        dst[offset++] = rsBytes;
    } else {
        // Bit 8 of first octet has value "1"
        // bits 7-1 give the number of additional length octets.
        dst[offset++] = MAX_OCTET | 1;
        // length, base 256
        dst[offset++] = rsBytes & 0xff;
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = rLength;
    if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
    } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = sLength;
    if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
    } else {
        signature.copy(dst, offset, paramBytes + sPadding);
    }
    return dst;
}
module.exports = {
    derToJose: derToJose,
    joseToDer: joseToDer
};
}),
"[project]/node_modules/buffer-equal-constant-time/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*jshint node:true */ var Buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer; // browserify
var SlowBuffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").SlowBuffer;
module.exports = bufferEq;
function bufferEq(a, b) {
    // shortcutting on type is necessary for correctness
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        return false;
    }
    // buffer sizes should be well-known information, so despite this
    // shortcutting, it doesn't leak any information about the *contents* of the
    // buffers.
    if (a.length !== b.length) {
        return false;
    }
    var c = 0;
    for(var i = 0; i < a.length; i++){
        /*jshint bitwise:false */ c |= a[i] ^ b[i]; // XOR
    }
    return c === 0;
}
bufferEq.install = function() {
    Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
        return bufferEq(this, that);
    };
};
var origBufEqual = Buffer.prototype.equal;
var origSlowBufEqual = SlowBuffer.prototype.equal;
bufferEq.restore = function() {
    Buffer.prototype.equal = origBufEqual;
    SlowBuffer.prototype.equal = origSlowBufEqual;
};
}),
"[project]/node_modules/jwa/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
var formatEcdsa = __turbopack_context__.r("[project]/node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
var MSG_INVALID_SECRET = 'secret must be a string or buffer';
var MSG_INVALID_VERIFIER_KEY = 'key must be a string or a buffer';
var MSG_INVALID_SIGNER_KEY = 'key must be a string, a buffer or an object';
var supportsKeyObjects = typeof crypto.createPublicKey === 'function';
if (supportsKeyObjects) {
    MSG_INVALID_VERIFIER_KEY += ' or a KeyObject';
    MSG_INVALID_SECRET += 'or a KeyObject';
}
function checkIsPublicKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === 'string') {
        return;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key !== 'object') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.type !== 'string') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.asymmetricKeyType !== 'string') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.export !== 'function') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
}
;
function checkIsPrivateKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === 'string') {
        return;
    }
    if (typeof key === 'object') {
        return;
    }
    throw typeError(MSG_INVALID_SIGNER_KEY);
}
;
function checkIsSecretKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === 'string') {
        return key;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key !== 'object') {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (key.type !== 'secret') {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key.export !== 'function') {
        throw typeError(MSG_INVALID_SECRET);
    }
}
function fromBase64(base64) {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function toBase64(base64url) {
    base64url = base64url.toString();
    var padding = 4 - base64url.length % 4;
    if (padding !== 4) {
        for(var i = 0; i < padding; ++i){
            base64url += '=';
        }
    }
    return base64url.replace(/\-/g, '+').replace(/_/g, '/');
}
function typeError(template) {
    var args = [].slice.call(arguments, 1);
    var errMsg = util.format.bind(util, template).apply(null, args);
    return new TypeError(errMsg);
}
function bufferOrString(obj) {
    return Buffer.isBuffer(obj) || typeof obj === 'string';
}
function normalizeInput(thing) {
    if (!bufferOrString(thing)) thing = JSON.stringify(thing);
    return thing;
}
function createHmacSigner(bits) {
    return function sign(thing, secret) {
        checkIsSecretKey(secret);
        thing = normalizeInput(thing);
        var hmac = crypto.createHmac('sha' + bits, secret);
        var sig = (hmac.update(thing), hmac.digest('base64'));
        return fromBase64(sig);
    };
}
var bufferEqual;
var timingSafeEqual = 'timingSafeEqual' in crypto ? function timingSafeEqual(a, b) {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    return crypto.timingSafeEqual(a, b);
} : function timingSafeEqual(a, b) {
    if (!bufferEqual) {
        bufferEqual = __turbopack_context__.r("[project]/node_modules/buffer-equal-constant-time/index.js [app-route] (ecmascript)");
    }
    return bufferEqual(a, b);
};
function createHmacVerifier(bits) {
    return function verify(thing, signature, secret) {
        var computedSig = createHmacSigner(bits)(thing, secret);
        return timingSafeEqual(Buffer.from(signature), Buffer.from(computedSig));
    };
}
function createKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        // Even though we are specifying "RSA" here, this works with ECDSA
        // keys as well.
        var signer = crypto.createSign('RSA-SHA' + bits);
        var sig = (signer.update(thing), signer.sign(privateKey, 'base64'));
        return fromBase64(sig);
    };
}
function createKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify('RSA-SHA' + bits);
        verifier.update(thing);
        return verifier.verify(publicKey, signature, 'base64');
    };
}
function createPSSKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto.createSign('RSA-SHA' + bits);
        var sig = (signer.update(thing), signer.sign({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, 'base64'));
        return fromBase64(sig);
    };
}
function createPSSKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify('RSA-SHA' + bits);
        verifier.update(thing);
        return verifier.verify({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, signature, 'base64');
    };
}
function createECDSASigner(bits) {
    var inner = createKeySigner(bits);
    return function sign() {
        var signature = inner.apply(null, arguments);
        signature = formatEcdsa.derToJose(signature, 'ES' + bits);
        return signature;
    };
}
function createECDSAVerifer(bits) {
    var inner = createKeyVerifier(bits);
    return function verify(thing, signature, publicKey) {
        signature = formatEcdsa.joseToDer(signature, 'ES' + bits).toString('base64');
        var result = inner(thing, signature, publicKey);
        return result;
    };
}
function createNoneSigner() {
    return function sign() {
        return '';
    };
}
function createNoneVerifier() {
    return function verify(thing, signature) {
        return signature === '';
    };
}
module.exports = function jwa(algorithm) {
    var signerFactories = {
        hs: createHmacSigner,
        rs: createKeySigner,
        ps: createPSSKeySigner,
        es: createECDSASigner,
        none: createNoneSigner
    };
    var verifierFactories = {
        hs: createHmacVerifier,
        rs: createKeyVerifier,
        ps: createPSSKeyVerifier,
        es: createECDSAVerifer,
        none: createNoneVerifier
    };
    var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
    if (!match) throw typeError(MSG_INVALID_ALGORITHM, algorithm);
    var algo = (match[1] || match[3]).toLowerCase();
    var bits = match[2];
    return {
        sign: signerFactories[algo](bits),
        verify: verifierFactories[algo](bits)
    };
};
}),
"[project]/node_modules/jsonwebtoken/decode.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var jws = __turbopack_context__.r("[project]/node_modules/jws/index.js [app-route] (ecmascript)");
module.exports = function(jwt, options) {
    options = options || {};
    var decoded = jws.decode(jwt, options);
    if (!decoded) {
        return null;
    }
    var payload = decoded.payload;
    //try parse the payload
    if (typeof payload === 'string') {
        try {
            var obj = JSON.parse(payload);
            if (obj !== null && typeof obj === 'object') {
                payload = obj;
            }
        } catch (e) {}
    }
    //return header if `complete` option is enabled.  header includes claims
    //such as `kid` and `alg` used to select the key within a JWKS needed to
    //verify the signature
    if (options.complete === true) {
        return {
            header: decoded.header,
            payload: payload,
            signature: decoded.signature
        };
    }
    return payload;
};
}),
"[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var JsonWebTokenError = function(message, error) {
    Error.call(this, message);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = 'JsonWebTokenError';
    this.message = message;
    if (error) this.inner = error;
};
JsonWebTokenError.prototype = Object.create(Error.prototype);
JsonWebTokenError.prototype.constructor = JsonWebTokenError;
module.exports = JsonWebTokenError;
}),
"[project]/node_modules/jsonwebtoken/lib/NotBeforeError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var JsonWebTokenError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)");
var NotBeforeError = function(message, date) {
    JsonWebTokenError.call(this, message);
    this.name = 'NotBeforeError';
    this.date = date;
};
NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
NotBeforeError.prototype.constructor = NotBeforeError;
module.exports = NotBeforeError;
}),
"[project]/node_modules/jsonwebtoken/lib/TokenExpiredError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var JsonWebTokenError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)");
var TokenExpiredError = function(message, expiredAt) {
    JsonWebTokenError.call(this, message);
    this.name = 'TokenExpiredError';
    this.expiredAt = expiredAt;
};
TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
TokenExpiredError.prototype.constructor = TokenExpiredError;
module.exports = TokenExpiredError;
}),
"[project]/node_modules/jsonwebtoken/lib/timespan.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var ms = __turbopack_context__.r("[project]/node_modules/ms/index.js [app-route] (ecmascript)");
module.exports = function(time, iat) {
    var timestamp = iat || Math.floor(Date.now() / 1000);
    if (typeof time === 'string') {
        var milliseconds = ms(time);
        if (typeof milliseconds === 'undefined') {
            return;
        }
        return Math.floor(timestamp + milliseconds / 1000);
    } else if (typeof time === 'number') {
        return timestamp + time;
    } else {
        return;
    }
};
}),
"[project]/node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const semver = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/index.js [app-route] (ecmascript)");
module.exports = semver.satisfies(process.version, '>=15.7.0');
}),
"[project]/node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const semver = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/index.js [app-route] (ecmascript)");
module.exports = semver.satisfies(process.version, '>=16.9.0');
}),
"[project]/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const ASYMMETRIC_KEY_DETAILS_SUPPORTED = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js [app-route] (ecmascript)");
const RSA_PSS_KEY_DETAILS_SUPPORTED = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js [app-route] (ecmascript)");
const allowedAlgorithmsForKeys = {
    'ec': [
        'ES256',
        'ES384',
        'ES512'
    ],
    'rsa': [
        'RS256',
        'PS256',
        'RS384',
        'PS384',
        'RS512',
        'PS512'
    ],
    'rsa-pss': [
        'PS256',
        'PS384',
        'PS512'
    ]
};
const allowedCurves = {
    ES256: 'prime256v1',
    ES384: 'secp384r1',
    ES512: 'secp521r1'
};
module.exports = function(algorithm, key) {
    if (!algorithm || !key) return;
    const keyType = key.asymmetricKeyType;
    if (!keyType) return;
    const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
    if (!allowedAlgorithms) {
        throw new Error(`Unknown key type "${keyType}".`);
    }
    if (!allowedAlgorithms.includes(algorithm)) {
        throw new Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(', ')}.`);
    }
    /*
   * Ignore the next block from test coverage because it gets executed
   * conditionally depending on the Node version. Not ignoring it would
   * prevent us from reaching the target % of coverage for versions of
   * Node under 15.7.0.
   */ /* istanbul ignore next */ if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
        switch(keyType){
            case 'ec':
                const keyCurve = key.asymmetricKeyDetails.namedCurve;
                const allowedCurve = allowedCurves[algorithm];
                if (keyCurve !== allowedCurve) {
                    throw new Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
                }
                break;
            case 'rsa-pss':
                if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
                    const length = parseInt(algorithm.slice(-3), 10);
                    const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
                    if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
                    }
                    if (saltLength !== undefined && saltLength > length >> 3) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
                    }
                }
                break;
        }
    }
};
}),
"[project]/node_modules/jsonwebtoken/lib/psSupported.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var semver = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/index.js [app-route] (ecmascript)");
module.exports = semver.satisfies(process.version, '^6.12.0 || >=8.0.0');
}),
"[project]/node_modules/jsonwebtoken/verify.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const JsonWebTokenError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)");
const NotBeforeError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/NotBeforeError.js [app-route] (ecmascript)");
const TokenExpiredError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/TokenExpiredError.js [app-route] (ecmascript)");
const decode = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/decode.js [app-route] (ecmascript)");
const timespan = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/timespan.js [app-route] (ecmascript)");
const validateAsymmetricKey = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js [app-route] (ecmascript)");
const PS_SUPPORTED = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/psSupported.js [app-route] (ecmascript)");
const jws = __turbopack_context__.r("[project]/node_modules/jws/index.js [app-route] (ecmascript)");
const { KeyObject, createSecretKey, createPublicKey } = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const PUB_KEY_ALGS = [
    'RS256',
    'RS384',
    'RS512'
];
const EC_KEY_ALGS = [
    'ES256',
    'ES384',
    'ES512'
];
const RSA_KEY_ALGS = [
    'RS256',
    'RS384',
    'RS512'
];
const HS_ALGS = [
    'HS256',
    'HS384',
    'HS512'
];
if (PS_SUPPORTED) {
    PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, 'PS256', 'PS384', 'PS512');
    RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, 'PS256', 'PS384', 'PS512');
}
module.exports = function(jwtString, secretOrPublicKey, options, callback) {
    if (typeof options === 'function' && !callback) {
        callback = options;
        options = {};
    }
    if (!options) {
        options = {};
    }
    //clone this object since we are going to mutate it.
    options = Object.assign({}, options);
    let done;
    if (callback) {
        done = callback;
    } else {
        done = function(err, data) {
            if (err) throw err;
            return data;
        };
    }
    if (options.clockTimestamp && typeof options.clockTimestamp !== 'number') {
        return done(new JsonWebTokenError('clockTimestamp must be a number'));
    }
    if (options.nonce !== undefined && (typeof options.nonce !== 'string' || options.nonce.trim() === '')) {
        return done(new JsonWebTokenError('nonce must be a non-empty string'));
    }
    if (options.allowInvalidAsymmetricKeyTypes !== undefined && typeof options.allowInvalidAsymmetricKeyTypes !== 'boolean') {
        return done(new JsonWebTokenError('allowInvalidAsymmetricKeyTypes must be a boolean'));
    }
    const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1000);
    if (!jwtString) {
        return done(new JsonWebTokenError('jwt must be provided'));
    }
    if (typeof jwtString !== 'string') {
        return done(new JsonWebTokenError('jwt must be a string'));
    }
    const parts = jwtString.split('.');
    if (parts.length !== 3) {
        return done(new JsonWebTokenError('jwt malformed'));
    }
    let decodedToken;
    try {
        decodedToken = decode(jwtString, {
            complete: true
        });
    } catch (err) {
        return done(err);
    }
    if (!decodedToken) {
        return done(new JsonWebTokenError('invalid token'));
    }
    const header = decodedToken.header;
    let getSecret;
    if (typeof secretOrPublicKey === 'function') {
        if (!callback) {
            return done(new JsonWebTokenError('verify must be called asynchronous if secret or public key is provided as a callback'));
        }
        getSecret = secretOrPublicKey;
    } else {
        getSecret = function(header, secretCallback) {
            return secretCallback(null, secretOrPublicKey);
        };
    }
    return getSecret(header, function(err, secretOrPublicKey) {
        if (err) {
            return done(new JsonWebTokenError('error in secret or public key callback: ' + err.message));
        }
        const hasSignature = parts[2].trim() !== '';
        if (!hasSignature && secretOrPublicKey) {
            return done(new JsonWebTokenError('jwt signature is required'));
        }
        if (hasSignature && !secretOrPublicKey) {
            return done(new JsonWebTokenError('secret or public key must be provided'));
        }
        if (!hasSignature && !options.algorithms) {
            return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
        }
        if (secretOrPublicKey != null && !(secretOrPublicKey instanceof KeyObject)) {
            try {
                secretOrPublicKey = createPublicKey(secretOrPublicKey);
            } catch (_) {
                try {
                    secretOrPublicKey = createSecretKey(typeof secretOrPublicKey === 'string' ? Buffer.from(secretOrPublicKey) : secretOrPublicKey);
                } catch (_) {
                    return done(new JsonWebTokenError('secretOrPublicKey is not valid key material'));
                }
            }
        }
        if (!options.algorithms) {
            if (secretOrPublicKey.type === 'secret') {
                options.algorithms = HS_ALGS;
            } else if ([
                'rsa',
                'rsa-pss'
            ].includes(secretOrPublicKey.asymmetricKeyType)) {
                options.algorithms = RSA_KEY_ALGS;
            } else if (secretOrPublicKey.asymmetricKeyType === 'ec') {
                options.algorithms = EC_KEY_ALGS;
            } else {
                options.algorithms = PUB_KEY_ALGS;
            }
        }
        if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
            return done(new JsonWebTokenError('invalid algorithm'));
        }
        if (header.alg.startsWith('HS') && secretOrPublicKey.type !== 'secret') {
            return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
        } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey.type !== 'public') {
            return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInvalidAsymmetricKeyTypes) {
            try {
                validateAsymmetricKey(header.alg, secretOrPublicKey);
            } catch (e) {
                return done(e);
            }
        }
        let valid;
        try {
            valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey);
        } catch (e) {
            return done(e);
        }
        if (!valid) {
            return done(new JsonWebTokenError('invalid signature'));
        }
        const payload = decodedToken.payload;
        if (typeof payload.nbf !== 'undefined' && !options.ignoreNotBefore) {
            if (typeof payload.nbf !== 'number') {
                return done(new JsonWebTokenError('invalid nbf value'));
            }
            if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
                return done(new NotBeforeError('jwt not active', new Date(payload.nbf * 1000)));
            }
        }
        if (typeof payload.exp !== 'undefined' && !options.ignoreExpiration) {
            if (typeof payload.exp !== 'number') {
                return done(new JsonWebTokenError('invalid exp value'));
            }
            if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError('jwt expired', new Date(payload.exp * 1000)));
            }
        }
        if (options.audience) {
            const audiences = Array.isArray(options.audience) ? options.audience : [
                options.audience
            ];
            const target = Array.isArray(payload.aud) ? payload.aud : [
                payload.aud
            ];
            const match = target.some(function(targetAudience) {
                return audiences.some(function(audience) {
                    return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
                });
            });
            if (!match) {
                return done(new JsonWebTokenError('jwt audience invalid. expected: ' + audiences.join(' or ')));
            }
        }
        if (options.issuer) {
            const invalid_issuer = typeof options.issuer === 'string' && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1;
            if (invalid_issuer) {
                return done(new JsonWebTokenError('jwt issuer invalid. expected: ' + options.issuer));
            }
        }
        if (options.subject) {
            if (payload.sub !== options.subject) {
                return done(new JsonWebTokenError('jwt subject invalid. expected: ' + options.subject));
            }
        }
        if (options.jwtid) {
            if (payload.jti !== options.jwtid) {
                return done(new JsonWebTokenError('jwt jwtid invalid. expected: ' + options.jwtid));
            }
        }
        if (options.nonce) {
            if (payload.nonce !== options.nonce) {
                return done(new JsonWebTokenError('jwt nonce invalid. expected: ' + options.nonce));
            }
        }
        if (options.maxAge) {
            if (typeof payload.iat !== 'number') {
                return done(new JsonWebTokenError('iat required when maxAge is specified'));
            }
            const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
            if (typeof maxAgeTimestamp === 'undefined') {
                return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
            }
            if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError('maxAge exceeded', new Date(maxAgeTimestamp * 1000)));
            }
        }
        if (options.complete === true) {
            const signature = decodedToken.signature;
            return done(null, {
                header: header,
                payload: payload,
                signature: signature
            });
        }
        return done(null, payload);
    });
};
}),
"[project]/node_modules/jsonwebtoken/sign.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const timespan = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/timespan.js [app-route] (ecmascript)");
const PS_SUPPORTED = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/psSupported.js [app-route] (ecmascript)");
const validateAsymmetricKey = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js [app-route] (ecmascript)");
const jws = __turbopack_context__.r("[project]/node_modules/jws/index.js [app-route] (ecmascript)");
const includes = __turbopack_context__.r("[project]/node_modules/lodash.includes/index.js [app-route] (ecmascript)");
const isBoolean = __turbopack_context__.r("[project]/node_modules/lodash.isboolean/index.js [app-route] (ecmascript)");
const isInteger = __turbopack_context__.r("[project]/node_modules/lodash.isinteger/index.js [app-route] (ecmascript)");
const isNumber = __turbopack_context__.r("[project]/node_modules/lodash.isnumber/index.js [app-route] (ecmascript)");
const isPlainObject = __turbopack_context__.r("[project]/node_modules/lodash.isplainobject/index.js [app-route] (ecmascript)");
const isString = __turbopack_context__.r("[project]/node_modules/lodash.isstring/index.js [app-route] (ecmascript)");
const once = __turbopack_context__.r("[project]/node_modules/lodash.once/index.js [app-route] (ecmascript)");
const { KeyObject, createSecretKey, createPrivateKey } = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const SUPPORTED_ALGS = [
    'RS256',
    'RS384',
    'RS512',
    'ES256',
    'ES384',
    'ES512',
    'HS256',
    'HS384',
    'HS512',
    'none'
];
if (PS_SUPPORTED) {
    SUPPORTED_ALGS.splice(3, 0, 'PS256', 'PS384', 'PS512');
}
const sign_options_schema = {
    expiresIn: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"expiresIn" should be a number of seconds or string representing a timespan'
    },
    notBefore: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"notBefore" should be a number of seconds or string representing a timespan'
    },
    audience: {
        isValid: function(value) {
            return isString(value) || Array.isArray(value);
        },
        message: '"audience" must be a string or array'
    },
    algorithm: {
        isValid: includes.bind(null, SUPPORTED_ALGS),
        message: '"algorithm" must be a valid string enum value'
    },
    header: {
        isValid: isPlainObject,
        message: '"header" must be an object'
    },
    encoding: {
        isValid: isString,
        message: '"encoding" must be a string'
    },
    issuer: {
        isValid: isString,
        message: '"issuer" must be a string'
    },
    subject: {
        isValid: isString,
        message: '"subject" must be a string'
    },
    jwtid: {
        isValid: isString,
        message: '"jwtid" must be a string'
    },
    noTimestamp: {
        isValid: isBoolean,
        message: '"noTimestamp" must be a boolean'
    },
    keyid: {
        isValid: isString,
        message: '"keyid" must be a string'
    },
    mutatePayload: {
        isValid: isBoolean,
        message: '"mutatePayload" must be a boolean'
    },
    allowInsecureKeySizes: {
        isValid: isBoolean,
        message: '"allowInsecureKeySizes" must be a boolean'
    },
    allowInvalidAsymmetricKeyTypes: {
        isValid: isBoolean,
        message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
    }
};
const registered_claims_schema = {
    iat: {
        isValid: isNumber,
        message: '"iat" should be a number of seconds'
    },
    exp: {
        isValid: isNumber,
        message: '"exp" should be a number of seconds'
    },
    nbf: {
        isValid: isNumber,
        message: '"nbf" should be a number of seconds'
    }
};
function validate(schema, allowUnknown, object, parameterName) {
    if (!isPlainObject(object)) {
        throw new Error('Expected "' + parameterName + '" to be a plain object.');
    }
    Object.keys(object).forEach(function(key) {
        const validator = schema[key];
        if (!validator) {
            if (!allowUnknown) {
                throw new Error('"' + key + '" is not allowed in "' + parameterName + '"');
            }
            return;
        }
        if (!validator.isValid(object[key])) {
            throw new Error(validator.message);
        }
    });
}
function validateOptions(options) {
    return validate(sign_options_schema, false, options, 'options');
}
function validatePayload(payload) {
    return validate(registered_claims_schema, true, payload, 'payload');
}
const options_to_payload = {
    'audience': 'aud',
    'issuer': 'iss',
    'subject': 'sub',
    'jwtid': 'jti'
};
const options_for_objects = [
    'expiresIn',
    'notBefore',
    'noTimestamp',
    'audience',
    'issuer',
    'subject',
    'jwtid'
];
module.exports = function(payload, secretOrPrivateKey, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }
    const isObjectPayload = typeof payload === 'object' && !Buffer.isBuffer(payload);
    const header = Object.assign({
        alg: options.algorithm || 'HS256',
        typ: isObjectPayload ? 'JWT' : undefined,
        kid: options.keyid
    }, options.header);
    function failure(err) {
        if (callback) {
            return callback(err);
        }
        throw err;
    }
    if (!secretOrPrivateKey && options.algorithm !== 'none') {
        return failure(new Error('secretOrPrivateKey must have a value'));
    }
    if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject)) {
        try {
            secretOrPrivateKey = createPrivateKey(secretOrPrivateKey);
        } catch (_) {
            try {
                secretOrPrivateKey = createSecretKey(typeof secretOrPrivateKey === 'string' ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
            } catch (_) {
                return failure(new Error('secretOrPrivateKey is not valid key material'));
            }
        }
    }
    if (header.alg.startsWith('HS') && secretOrPrivateKey.type !== 'secret') {
        return failure(new Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
    } else if (/^(?:RS|PS|ES)/.test(header.alg)) {
        if (secretOrPrivateKey.type !== 'private') {
            return failure(new Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInsecureKeySizes && !header.alg.startsWith('ES') && secretOrPrivateKey.asymmetricKeyDetails !== undefined && //KeyObject.asymmetricKeyDetails is supported in Node 15+
        secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048) {
            return failure(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        }
    }
    if (typeof payload === 'undefined') {
        return failure(new Error('payload is required'));
    } else if (isObjectPayload) {
        try {
            validatePayload(payload);
        } catch (error) {
            return failure(error);
        }
        if (!options.mutatePayload) {
            payload = Object.assign({}, payload);
        }
    } else {
        const invalid_options = options_for_objects.filter(function(opt) {
            return typeof options[opt] !== 'undefined';
        });
        if (invalid_options.length > 0) {
            return failure(new Error('invalid ' + invalid_options.join(',') + ' option for ' + typeof payload + ' payload'));
        }
    }
    if (typeof payload.exp !== 'undefined' && typeof options.expiresIn !== 'undefined') {
        return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
    }
    if (typeof payload.nbf !== 'undefined' && typeof options.notBefore !== 'undefined') {
        return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
    }
    try {
        validateOptions(options);
    } catch (error) {
        return failure(error);
    }
    if (!options.allowInvalidAsymmetricKeyTypes) {
        try {
            validateAsymmetricKey(header.alg, secretOrPrivateKey);
        } catch (error) {
            return failure(error);
        }
    }
    const timestamp = payload.iat || Math.floor(Date.now() / 1000);
    if (options.noTimestamp) {
        delete payload.iat;
    } else if (isObjectPayload) {
        payload.iat = timestamp;
    }
    if (typeof options.notBefore !== 'undefined') {
        try {
            payload.nbf = timespan(options.notBefore, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.nbf === 'undefined') {
            return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    if (typeof options.expiresIn !== 'undefined' && typeof payload === 'object') {
        try {
            payload.exp = timespan(options.expiresIn, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.exp === 'undefined') {
            return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    Object.keys(options_to_payload).forEach(function(key) {
        const claim = options_to_payload[key];
        if (typeof options[key] !== 'undefined') {
            if (typeof payload[claim] !== 'undefined') {
                return failure(new Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
            }
            payload[claim] = options[key];
        }
    });
    const encoding = options.encoding || 'utf8';
    if (typeof callback === 'function') {
        callback = callback && once(callback);
        jws.createSign({
            header: header,
            privateKey: secretOrPrivateKey,
            payload: payload,
            encoding: encoding
        }).once('error', callback).once('done', function(signature) {
            // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
            if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
                return callback(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
            }
            callback(null, signature);
        });
    } else {
        let signature = jws.sign({
            header: header,
            payload: payload,
            secret: secretOrPrivateKey,
            encoding: encoding
        });
        // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
            throw new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
        }
        return signature;
    }
};
}),
"[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    decode: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/decode.js [app-route] (ecmascript)"),
    verify: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/verify.js [app-route] (ecmascript)"),
    sign: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/sign.js [app-route] (ecmascript)"),
    JsonWebTokenError: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)"),
    NotBeforeError: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/NotBeforeError.js [app-route] (ecmascript)"),
    TokenExpiredError: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/TokenExpiredError.js [app-route] (ecmascript)")
};
}),
"[project]/node_modules/ms/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Helpers.
 */ var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */ module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
        return parse(val);
    } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */ function parse(str) {
    str = String(str);
    if (str.length > 100) {
        return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch(type){
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y;
        case 'weeks':
        case 'week':
        case 'w':
            return n * w;
        case 'days':
        case 'day':
        case 'd':
            return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n;
        default:
            return undefined;
    }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
}
/**
 * Pluralization helper.
 */ function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/internal/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0';
const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;
// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;
// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
const RELEASE_TYPES = [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease'
];
module.exports = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 0b001,
    FLAG_LOOSE: 0b010
};
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/internal/debug.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const debug = typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args)=>console.error('SEMVER', ...args) : ()=>{};
module.exports = debug;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/internal/re.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
exports = module.exports = {};
// The actual regexps go on exports.re
const re = exports.re = [];
const safeRe = exports.safeRe = [];
const src = exports.src = [];
const safeSrc = exports.safeSrc = [];
const t = exports.t = {};
let R = 0;
const LETTERDASHNUMBER = '[a-zA-Z0-9-]';
// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
    [
        '\\s',
        1
    ],
    [
        '\\d',
        MAX_LENGTH
    ],
    [
        LETTERDASHNUMBER,
        MAX_SAFE_BUILD_LENGTH
    ]
];
const makeSafeRegex = (value)=>{
    for (const [token, max] of safeRegexReplacements){
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
};
const createToken = (name, value, isGlobal)=>{
    const safe = makeSafeRegex(value);
    const index = R++;
    debug(name, index, value);
    t[name] = index;
    src[index] = value;
    safeSrc[index] = safe;
    re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
    safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined);
};
// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
createToken('NUMERICIDENTIFIERLOOSE', '\\d+');
// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.
createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
// ## Main Version
// Three dot-separated numeric identifiers.
createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`);
createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
// Non-numeric identifiers include numeric identifiers but can be longer.
// Therefore non-numeric identifiers must go first.
createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.
createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`);
// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.
createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.
createToken('FULLPLAIN', `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
createToken('FULL', `^${src[t.FULLPLAIN]}$`);
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);
createToken('GTLT', '((?:<|>)?=?)');
// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifier, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCEPLAIN', `${'(^|[^\\d])' + '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
createToken('COERCEFULL', src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?` + `(?:${src[t.BUILD]})?` + `(?:$|[^\\d])`);
createToken('COERCERTL', src[t.COERCE], true);
createToken('COERCERTLFULL', src[t.COERCEFULL], true);
// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)');
createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = '$1~';
createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)');
createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = '$1^';
createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = '$1$2$3';
// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);
createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`);
// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*');
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$');
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$');
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// parse out just the options we care about
const looseOption = Object.freeze({
    loose: true
});
const emptyOpts = Object.freeze({});
const parseOptions = (options)=>{
    if (!options) {
        return emptyOpts;
    }
    if (typeof options !== 'object') {
        return looseOption;
    }
    return options;
};
module.exports = parseOptions;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const numeric = /^[0-9]+$/;
const compareIdentifiers = (a, b)=>{
    if (typeof a === 'number' && typeof b === 'number') {
        return a === b ? 0 : a < b ? -1 : 1;
    }
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
        a = +a;
        b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const rcompareIdentifiers = (a, b)=>compareIdentifiers(b, a);
module.exports = {
    compareIdentifiers,
    rcompareIdentifiers
};
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const debug = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const parseOptions = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const { compareIdentifiers } = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)");
class SemVer {
    constructor(version, options){
        options = parseOptions(options);
        if (version instanceof SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
                return version;
            } else {
                version = version.version;
            }
        } else if (typeof version !== 'string') {
            throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
            throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug('SemVer', version, options);
        this.options = options;
        this.loose = !!options.loose;
        // this isn't actually relevant for versions, but keep it so that we
        // don't run into trouble passing this.options around.
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        // these are actually numbers
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError('Invalid major version');
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError('Invalid minor version');
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError('Invalid patch version');
        }
        // numberify any prerelease numeric ids
        if (!m[4]) {
            this.prerelease = [];
        } else {
            this.prerelease = m[4].split('.').map((id)=>{
                if (/^[0-9]+$/.test(id)) {
                    const num = +id;
                    if (num >= 0 && num < MAX_SAFE_INTEGER) {
                        return num;
                    }
                }
                return id;
            });
        }
        this.build = m[5] ? m[5].split('.') : [];
        this.format();
    }
    format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
            this.version += `-${this.prerelease.join('.')}`;
        }
        return this.version;
    }
    toString() {
        return this.version;
    }
    compare(other) {
        debug('SemVer.compare', this.version, this.options, other);
        if (!(other instanceof SemVer)) {
            if (typeof other === 'string' && other === this.version) {
                return 0;
            }
            other = new SemVer(other, this.options);
        }
        if (other.version === this.version) {
            return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        if (this.major < other.major) {
            return -1;
        }
        if (this.major > other.major) {
            return 1;
        }
        if (this.minor < other.minor) {
            return -1;
        }
        if (this.minor > other.minor) {
            return 1;
        }
        if (this.patch < other.patch) {
            return -1;
        }
        if (this.patch > other.patch) {
            return 1;
        }
        return 0;
    }
    comparePre(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        // NOT having a prerelease is > having one
        if (this.prerelease.length && !other.prerelease.length) {
            return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
        }
        let i = 0;
        do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            debug('prerelease compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i)
    }
    compareBuild(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        let i = 0;
        do {
            const a = this.build[i];
            const b = other.build[i];
            debug('build compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i)
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
        if (release.startsWith('pre')) {
            if (!identifier && identifierBase === false) {
                throw new Error('invalid increment argument: identifier is empty');
            }
            // Avoid an invalid semver results
            if (identifier) {
                const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
                if (!match || match[1] !== identifier) {
                    throw new Error(`invalid identifier: ${identifier}`);
                }
            }
        }
        switch(release){
            case 'premajor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor = 0;
                this.major++;
                this.inc('pre', identifier, identifierBase);
                break;
            case 'preminor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor++;
                this.inc('pre', identifier, identifierBase);
                break;
            case 'prepatch':
                // If this is already a prerelease, it will bump to the next version
                // drop any prereleases that might already exist, since they are not
                // relevant at this point.
                this.prerelease.length = 0;
                this.inc('patch', identifier, identifierBase);
                this.inc('pre', identifier, identifierBase);
                break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case 'prerelease':
                if (this.prerelease.length === 0) {
                    this.inc('patch', identifier, identifierBase);
                }
                this.inc('pre', identifier, identifierBase);
                break;
            case 'release':
                if (this.prerelease.length === 0) {
                    throw new Error(`version ${this.raw} is not a prerelease`);
                }
                this.prerelease.length = 0;
                break;
            case 'major':
                // If this is a pre-major version, bump up to the same major version.
                // Otherwise increment major.
                // 1.0.0-5 bumps to 1.0.0
                // 1.1.0 bumps to 2.0.0
                if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                    this.major++;
                }
                this.minor = 0;
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'minor':
                // If this is a pre-minor version, bump up to the same minor version.
                // Otherwise increment minor.
                // 1.2.0-5 bumps to 1.2.0
                // 1.2.1 bumps to 1.3.0
                if (this.patch !== 0 || this.prerelease.length === 0) {
                    this.minor++;
                }
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'patch':
                // If this is not a pre-release version, it will increment the patch.
                // If it is a pre-release it will bump up to the same patch version.
                // 1.2.0-5 patches to 1.2.0
                // 1.2.0 patches to 1.2.1
                if (this.prerelease.length === 0) {
                    this.patch++;
                }
                this.prerelease = [];
                break;
            // This probably shouldn't be used publicly.
            // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
            case 'pre':
                {
                    const base = Number(identifierBase) ? 1 : 0;
                    if (this.prerelease.length === 0) {
                        this.prerelease = [
                            base
                        ];
                    } else {
                        let i = this.prerelease.length;
                        while(--i >= 0){
                            if (typeof this.prerelease[i] === 'number') {
                                this.prerelease[i]++;
                                i = -2;
                            }
                        }
                        if (i === -1) {
                            // didn't increment anything
                            if (identifier === this.prerelease.join('.') && identifierBase === false) {
                                throw new Error('invalid increment argument: identifier already exists');
                            }
                            this.prerelease.push(base);
                        }
                    }
                    if (identifier) {
                        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                        let prerelease = [
                            identifier,
                            base
                        ];
                        if (identifierBase === false) {
                            prerelease = [
                                identifier
                            ];
                        }
                        if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                            if (isNaN(this.prerelease[1])) {
                                this.prerelease = prerelease;
                            }
                        } else {
                            this.prerelease = prerelease;
                        }
                    }
                    break;
                }
            default:
                throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
            this.raw += `+${this.build.join('.')}`;
        }
        return this;
    }
}
module.exports = SemVer;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/parse.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const parse = (version, options, throwErrors = false)=>{
    if (version instanceof SemVer) {
        return version;
    }
    try {
        return new SemVer(version, options);
    } catch (er) {
        if (!throwErrors) {
            return null;
        }
        throw er;
    }
};
module.exports = parse;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/valid.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const valid = (version, options)=>{
    const v = parse(version, options);
    return v ? v.version : null;
};
module.exports = valid;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/clean.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const clean = (version, options)=>{
    const s = parse(version.trim().replace(/^[=v]+/, ''), options);
    return s ? s.version : null;
};
module.exports = clean;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/inc.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const inc = (version, release, options, identifier, identifierBase)=>{
    if (typeof options === 'string') {
        identifierBase = identifier;
        identifier = options;
        options = undefined;
    }
    try {
        return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
    } catch (er) {
        return null;
    }
};
module.exports = inc;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/diff.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const diff = (version1, version2)=>{
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
        return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
        // Going from prerelease -> no prerelease requires some special casing
        // If the low version has only a major, then it will always be a major
        // Some examples:
        // 1.0.0-1 -> 1.0.0
        // 1.0.0-1 -> 1.1.1
        // 1.0.0-1 -> 2.0.0
        if (!lowVersion.patch && !lowVersion.minor) {
            return 'major';
        }
        // If the main part has no difference
        if (lowVersion.compareMain(highVersion) === 0) {
            if (lowVersion.minor && !lowVersion.patch) {
                return 'minor';
            }
            return 'patch';
        }
    }
    // add the `pre` prefix if we are going to a prerelease version
    const prefix = highHasPre ? 'pre' : '';
    if (v1.major !== v2.major) {
        return prefix + 'major';
    }
    if (v1.minor !== v2.minor) {
        return prefix + 'minor';
    }
    if (v1.patch !== v2.patch) {
        return prefix + 'patch';
    }
    // high and low are prereleases
    return 'prerelease';
};
module.exports = diff;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/major.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const major = (a, loose)=>new SemVer(a, loose).major;
module.exports = major;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/minor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const minor = (a, loose)=>new SemVer(a, loose).minor;
module.exports = minor;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/patch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const patch = (a, loose)=>new SemVer(a, loose).patch;
module.exports = patch;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/prerelease.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const prerelease = (version, options)=>{
    const parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
module.exports = prerelease;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const compare = (a, b, loose)=>new SemVer(a, loose).compare(new SemVer(b, loose));
module.exports = compare;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/rcompare.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const rcompare = (a, b, loose)=>compare(b, a, loose);
module.exports = rcompare;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare-loose.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const compareLoose = (a, b)=>compare(a, b, true);
module.exports = compareLoose;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const compareBuild = (a, b, loose)=>{
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
module.exports = compareBuild;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/sort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compareBuild = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const sort = (list, loose)=>list.sort((a, b)=>compareBuild(a, b, loose));
module.exports = sort;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/rsort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compareBuild = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const rsort = (list, loose)=>list.sort((a, b)=>compareBuild(b, a, loose));
module.exports = rsort;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/gt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const gt = (a, b, loose)=>compare(a, b, loose) > 0;
module.exports = gt;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/lt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const lt = (a, b, loose)=>compare(a, b, loose) < 0;
module.exports = lt;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/eq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const eq = (a, b, loose)=>compare(a, b, loose) === 0;
module.exports = eq;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/neq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const neq = (a, b, loose)=>compare(a, b, loose) !== 0;
module.exports = neq;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/gte.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const gte = (a, b, loose)=>compare(a, b, loose) >= 0;
module.exports = gte;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/lte.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const lte = (a, b, loose)=>compare(a, b, loose) <= 0;
module.exports = lte;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/cmp.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const eq = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/eq.js [app-route] (ecmascript)");
const neq = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/neq.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const cmp = (a, op, b, loose)=>{
    switch(op){
        case '===':
            if (typeof a === 'object') {
                a = a.version;
            }
            if (typeof b === 'object') {
                b = b.version;
            }
            return a === b;
        case '!==':
            if (typeof a === 'object') {
                a = a.version;
            }
            if (typeof b === 'object') {
                b = b.version;
            }
            return a !== b;
        case '':
        case '=':
        case '==':
            return eq(a, b, loose);
        case '!=':
            return neq(a, b, loose);
        case '>':
            return gt(a, b, loose);
        case '>=':
            return gte(a, b, loose);
        case '<':
            return lt(a, b, loose);
        case '<=':
            return lte(a, b, loose);
        default:
            throw new TypeError(`Invalid operator: ${op}`);
    }
};
module.exports = cmp;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/coerce.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const parse = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const coerce = (version, options)=>{
    if (version instanceof SemVer) {
        return version;
    }
    if (typeof version === 'number') {
        version = String(version);
    }
    if (typeof version !== 'string') {
        return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
    } else {
        // Find the right-most coercible string that does not share
        // a terminus with a more left-ward coercible string.
        // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
        // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
        //
        // Walk through the string checking with a /g regexp
        // Manually set the index so as to pick up overlapping matches.
        // Stop when we get a match that ends at the string end, since no
        // coercible string can be more right-ward without the same terminus.
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)){
            if (!match || next.index + next[0].length !== match.index + match[0].length) {
                match = next;
            }
            coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        // leave it in a clean state
        coerceRtlRegex.lastIndex = -1;
    }
    if (match === null) {
        return null;
    }
    const major = match[2];
    const minor = match[3] || '0';
    const patch = match[4] || '0';
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : '';
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : '';
    return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
};
module.exports = coerce;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/truncate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const truncate = (version, truncation, options)=>{
    if (!constants.RELEASE_TYPES.includes(truncation)) {
        return null;
    }
    const clonedVersion = cloneInputVersion(version, options);
    return clonedVersion && doTruncation(clonedVersion, truncation);
};
const cloneInputVersion = (version, options)=>{
    const versionStringToParse = version instanceof SemVer ? version.version : version;
    return parse(versionStringToParse, options);
};
const doTruncation = (version, truncation)=>{
    if (isPrerelease(truncation)) {
        return version.version;
    }
    version.prerelease = [];
    switch(truncation){
        case 'major':
            version.minor = 0;
            version.patch = 0;
            break;
        case 'minor':
            version.patch = 0;
            break;
    }
    return version.format();
};
const isPrerelease = (type)=>{
    return type.startsWith('pre');
};
module.exports = truncate;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/internal/lrucache.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

class LRUCache {
    constructor(){
        this.max = 1000;
        this.map = new Map();
    }
    get(key) {
        const value = this.map.get(key);
        if (value === undefined) {
            return undefined;
        } else {
            // Remove the key from the map and add it to the end
            this.map.delete(key);
            this.map.set(key, value);
            return value;
        }
    }
    delete(key) {
        return this.map.delete(key);
    }
    set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== undefined) {
            // If cache is full, delete the least recently used item
            if (this.map.size >= this.max) {
                const firstKey = this.map.keys().next().value;
                this.delete(firstKey);
            }
            this.map.set(key, value);
        }
        return this;
    }
}
module.exports = LRUCache;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SPACE_CHARACTERS = /\s+/g;
// hoisted class for cyclic dependency
class Range {
    constructor(range, options){
        options = parseOptions(options);
        if (range instanceof Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
                return range;
            } else {
                return new Range(range.raw, options);
            }
        }
        if (range instanceof Comparator) {
            // just put it in the set and return
            this.raw = range.value;
            this.set = [
                [
                    range
                ]
            ];
            this.formatted = undefined;
            return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        // First reduce all whitespace as much as possible so we do not have to rely
        // on potentially slow regexes like \s*. This is then stored and used for
        // future error messages as well.
        this.raw = range.trim().replace(SPACE_CHARACTERS, ' ');
        // First, split on ||
        this.set = this.raw.split('||')// map the range to a 2d array of comparators
        .map((r)=>this.parseRange(r.trim()))// throw out any comparator lists that are empty
        // this generally means that it was not a valid range, which is allowed
        // in loose mode, but will still throw if the WHOLE range is invalid.
        .filter((c)=>c.length);
        if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        // if we have any that are not the null set, throw out null sets.
        if (this.set.length > 1) {
            // keep the first one, in case they're all null sets
            const first = this.set[0];
            this.set = this.set.filter((c)=>!isNullSet(c[0]));
            if (this.set.length === 0) {
                this.set = [
                    first
                ];
            } else if (this.set.length > 1) {
                // if we have any that are *, then the range is just *
                for (const c of this.set){
                    if (c.length === 1 && isAny(c[0])) {
                        this.set = [
                            c
                        ];
                        break;
                    }
                }
            }
        }
        this.formatted = undefined;
    }
    get range() {
        if (this.formatted === undefined) {
            this.formatted = '';
            for(let i = 0; i < this.set.length; i++){
                if (i > 0) {
                    this.formatted += '||';
                }
                const comps = this.set[i];
                for(let k = 0; k < comps.length; k++){
                    if (k > 0) {
                        this.formatted += ' ';
                    }
                    this.formatted += comps[k].toString().trim();
                }
            }
        }
        return this.formatted;
    }
    format() {
        return this.range;
    }
    toString() {
        return this.range;
    }
    parseRange(range) {
        // memoize range parsing for performance.
        // this is a very hot path, and fully deterministic.
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ':' + range;
        const cached = cache.get(memoKey);
        if (cached) {
            return cached;
        }
        const loose = this.options.loose;
        // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug('hyphen replace', range);
        // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug('comparator trim', range);
        // `~ 1.2.3` => `~1.2.3`
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug('tilde trim', range);
        // `^ 1.2.3` => `^1.2.3`
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug('caret trim', range);
        // At this point, the range is completely trimmed and
        // ready to be split into comparators.
        let rangeList = range.split(' ').map((comp)=>parseComparator(comp, this.options)).join(' ').split(/\s+/)// >=0.0.0 is equivalent to *
        .map((comp)=>replaceGTE0(comp, this.options));
        if (loose) {
            // in loose mode, throw out any that are not valid comparators
            rangeList = rangeList.filter((comp)=>{
                debug('loose invalid filter', comp, this.options);
                return !!comp.match(re[t.COMPARATORLOOSE]);
            });
        }
        debug('range list', rangeList);
        // if any comparators are the null set, then replace with JUST null set
        // if more than one comparator, remove any * comparators
        // also, don't include the same comparator more than once
        const rangeMap = new Map();
        const comparators = rangeList.map((comp)=>new Comparator(comp, this.options));
        for (const comp of comparators){
            if (isNullSet(comp)) {
                return [
                    comp
                ];
            }
            rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has('')) {
            rangeMap.delete('');
        }
        const result = [
            ...rangeMap.values()
        ];
        cache.set(memoKey, result);
        return result;
    }
    intersects(range, options) {
        if (!(range instanceof Range)) {
            throw new TypeError('a Range is required');
        }
        return this.set.some((thisComparators)=>{
            return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators)=>{
                return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator)=>{
                    return rangeComparators.every((rangeComparator)=>{
                        return thisComparator.intersects(rangeComparator, options);
                    });
                });
            });
        });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
        if (!version) {
            return false;
        }
        if (typeof version === 'string') {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        for(let i = 0; i < this.set.length; i++){
            if (testSet(this.set[i], version, this.options)) {
                return true;
            }
        }
        return false;
    }
}
module.exports = Range;
const LRU = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/lrucache.js [app-route] (ecmascript)");
const cache = new LRU();
const parseOptions = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const { safeRe: re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const isNullSet = (c)=>c.value === '<0.0.0-0';
const isAny = (c)=>c.value === '';
// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options)=>{
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while(result && remainingComparators.length){
        result = remainingComparators.every((otherComparator)=>{
            return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
    }
    return result;
};
// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options)=>{
    comp = comp.replace(re[t.BUILD], '');
    debug('comp', comp, options);
    comp = replaceCarets(comp, options);
    debug('caret', comp);
    comp = replaceTildes(comp, options);
    debug('tildes', comp);
    comp = replaceXRanges(comp, options);
    debug('xrange', comp);
    comp = replaceStars(comp, options);
    debug('stars', comp);
    return comp;
};
const isX = (id)=>!id || id.toLowerCase() === 'x' || id === '*';
// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceTilde(c, options)).join(' ');
};
const replaceTilde = (comp, options)=>{
    const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug('tilde', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            // ~1.2 == >=1.2.0 <1.3.0-0
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
            debug('replaceTilde pr', pr);
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
            // ~1.2.3 == >=1.2.3 <1.3.0-0
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug('tilde return', ret);
        return ret;
    });
};
// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceCaret(c, options)).join(' ');
};
const replaceCaret = (comp, options)=>{
    debug('caret', comp, options);
    const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    const z = options.includePrerelease ? '-0' : '';
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug('caret', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            if (M === '0') {
                ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
                ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
        } else if (pr) {
            debug('replaceCaret pr', pr);
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
        } else {
            debug('no pr');
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
        }
        debug('caret return', ret);
        return ret;
    });
};
const replaceXRanges = (comp, options)=>{
    debug('replaceXRanges', comp, options);
    return comp.split(/\s+/).map((c)=>replaceXRange(c, options)).join(' ');
};
const replaceXRange = (comp, options)=>{
    comp = comp.trim();
    const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr)=>{
        debug('xRange', comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === '=' && anyX) {
            gtlt = '';
        }
        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options.includePrerelease ? '-0' : '';
        if (xM) {
            if (gtlt === '>' || gtlt === '<') {
                // nothing is allowed
                ret = '<0.0.0-0';
            } else {
                // nothing is forbidden
                ret = '*';
            }
        } else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) {
                m = 0;
            }
            p = 0;
            if (gtlt === '>') {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                gtlt = '>=';
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                } else {
                    m = +m + 1;
                    p = 0;
                }
            } else if (gtlt === '<=') {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = '<';
                if (xm) {
                    M = +M + 1;
                } else {
                    m = +m + 1;
                }
            }
            if (gtlt === '<') {
                pr = '-0';
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug('xRange return', ret);
        return ret;
    });
};
// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options)=>{
    debug('replaceStars', comp, options);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[t.STAR], '');
};
const replaceGTE0 = (comp, options)=>{
    debug('replaceGTE0', comp, options);
    return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '');
};
// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
// TODO build?
const hyphenReplace = (incPr)=>($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr)=>{
        if (isX(fM)) {
            from = '';
        } else if (isX(fm)) {
            from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
        } else if (isX(fp)) {
            from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
        } else if (fpr) {
            from = `>=${from}`;
        } else {
            from = `>=${from}${incPr ? '-0' : ''}`;
        }
        if (isX(tM)) {
            to = '';
        } else if (isX(tm)) {
            to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
            to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
            to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (incPr) {
            to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
            to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
    };
const testSet = (set, version, options)=>{
    for(let i = 0; i < set.length; i++){
        if (!set[i].test(version)) {
            return false;
        }
    }
    if (version.prerelease.length && !options.includePrerelease) {
        // Find the set of versions that are allowed to have prereleases
        // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
        // That should allow `1.2.3-pr.2` to pass.
        // However, `1.2.4-alpha.notready` should NOT be allowed,
        // even though it's within the range set by the comparators.
        for(let i = 0; i < set.length; i++){
            debug(set[i].semver);
            if (set[i].semver === Comparator.ANY) {
                continue;
            }
            if (set[i].semver.prerelease.length > 0) {
                const allowed = set[i].semver;
                if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
                    return true;
                }
            }
        }
        // Version has a -pre, but it's not one of the ones we like.
        return false;
    }
    return true;
};
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/classes/comparator.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const ANY = Symbol('SemVer ANY');
// hoisted class for cyclic dependency
class Comparator {
    static get ANY() {
        return ANY;
    }
    constructor(comp, options){
        options = parseOptions(options);
        if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
                return comp;
            } else {
                comp = comp.value;
            }
        }
        comp = comp.trim().split(/\s+/).join(' ');
        debug('comparator', comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
            this.value = '';
        } else {
            this.value = this.operator + this.semver.version;
        }
        debug('comp', this);
    }
    parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== undefined ? m[1] : '';
        if (this.operator === '=') {
            this.operator = '';
        }
        // if it literally is just '>' or '' then allow anything.
        if (!m[2]) {
            this.semver = ANY;
        } else {
            this.semver = new SemVer(m[2], this.options.loose);
        }
    }
    toString() {
        return this.value;
    }
    test(version) {
        debug('Comparator.test', version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
            return true;
        }
        if (typeof version === 'string') {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        return cmp(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
            throw new TypeError('a Comparator is required');
        }
        if (this.operator === '') {
            if (this.value === '') {
                return true;
            }
            return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === '') {
            if (comp.value === '') {
                return true;
            }
            return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        // Special cases where nothing can possibly be lower
        if (options.includePrerelease && (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
            return false;
        }
        if (!options.includePrerelease && (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
            return false;
        }
        // Same direction increasing (> or >=)
        if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
            return true;
        }
        // Same direction decreasing (< or <=)
        if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
            return true;
        }
        // same SemVer and both sides are inclusive (<= or >=)
        if (this.semver.version === comp.semver.version && this.operator.includes('=') && comp.operator.includes('=')) {
            return true;
        }
        // opposite directions less than
        if (cmp(this.semver, '<', comp.semver, options) && this.operator.startsWith('>') && comp.operator.startsWith('<')) {
            return true;
        }
        // opposite directions greater than
        if (cmp(this.semver, '>', comp.semver, options) && this.operator.startsWith('<') && comp.operator.startsWith('>')) {
            return true;
        }
        return false;
    }
}
module.exports = Comparator;
const parseOptions = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const cmp = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/cmp.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = (version, range, options)=>{
    try {
        range = new Range(range, options);
    } catch (er) {
        return false;
    }
    return range.test(version);
};
module.exports = satisfies;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/to-comparators.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
// Mostly just for testing and legacy API reasons
const toComparators = (range, options)=>new Range(range, options).set.map((comp)=>comp.map((c)=>c.value).join(' ').trim().split(' '));
module.exports = toComparators;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/max-satisfying.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const maxSatisfying = (versions, range, options)=>{
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!max || maxSV.compare(v) === -1) {
                // compare(max, v, true)
                max = v;
                maxSV = new SemVer(max, options);
            }
        }
    });
    return max;
};
module.exports = maxSatisfying;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/min-satisfying.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const minSatisfying = (versions, range, options)=>{
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!min || minSV.compare(v) === 1) {
                // compare(min, v, true)
                min = v;
                minSV = new SemVer(min, options);
            }
        }
    });
    return min;
};
module.exports = minSatisfying;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/min-version.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const minVersion = (range, loose)=>{
    range = new Range(range, loose);
    let minver = new SemVer('0.0.0');
    if (range.test(minver)) {
        return minver;
    }
    minver = new SemVer('0.0.0-0');
    if (range.test(minver)) {
        return minver;
    }
    minver = null;
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator)=>{
            // Clone to avoid manipulating the comparator's semver object.
            const compver = new SemVer(comparator.semver.version);
            switch(comparator.operator){
                case '>':
                    if (compver.prerelease.length === 0) {
                        compver.patch++;
                    } else {
                        compver.prerelease.push(0);
                    }
                    compver.raw = compver.format();
                /* fallthrough */ case '':
                case '>=':
                    if (!setMin || gt(compver, setMin)) {
                        setMin = compver;
                    }
                    break;
                case '<':
                case '<=':
                    break;
                /* istanbul ignore next */ default:
                    throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
            minver = setMin;
        }
    }
    if (minver && range.test(minver)) {
        return minver;
    }
    return null;
};
module.exports = minVersion;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/valid.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const validRange = (range, options)=>{
    try {
        // Return '*' instead of '' so that truthiness works.
        // This will throw if it's invalid anyway
        return new Range(range, options).range || '*';
    } catch (er) {
        return null;
    }
};
module.exports = validRange;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/outside.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const { ANY } = Comparator;
const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const outside = (version, range, hilo, options)=>{
    version = new SemVer(version, options);
    range = new Range(range, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch(hilo){
        case '>':
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = '>';
            ecomp = '>=';
            break;
        case '<':
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = '<';
            ecomp = '<=';
            break;
        default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    // If it satisfies the range it is not outside
    if (satisfies(version, range, options)) {
        return false;
    }
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator)=>{
            if (comparator.semver === ANY) {
                comparator = new Comparator('>=0.0.0');
            }
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) {
                high = comparator;
            } else if (ltfn(comparator.semver, low.semver, options)) {
                low = comparator;
            }
        });
        // If the edge version comparator has a operator then our version
        // isn't outside it
        if (high.operator === comp || high.operator === ecomp) {
            return false;
        }
        // If the lowest version comparator has an operator and our version
        // is less than it then it isn't higher than the range
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
            return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
        }
    }
    return true;
};
module.exports = outside;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/gtr.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Determine if version is greater than all the versions possible in the range.
const outside = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
const gtr = (version, range, options)=>outside(version, range, '>', options);
module.exports = gtr;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/ltr.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const outside = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options)=>outside(version, range, '<', options);
module.exports = ltr;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/intersects.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const intersects = (r1, r2, options)=>{
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
};
module.exports = intersects;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/simplify.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
module.exports = (versions, range, options)=>{
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b)=>compare(a, b, options));
    for (const version of v){
        const included = satisfies(version, range, options);
        if (included) {
            prev = version;
            if (!first) {
                first = version;
            }
        } else {
            if (prev) {
                set.push([
                    first,
                    prev
                ]);
            }
            prev = null;
            first = null;
        }
    }
    if (first) {
        set.push([
            first,
            null
        ]);
    }
    const ranges = [];
    for (const [min, max] of set){
        if (min === max) {
            ranges.push(min);
        } else if (!max && min === v[0]) {
            ranges.push('*');
        } else if (!max) {
            ranges.push(`>=${min}`);
        } else if (min === v[0]) {
            ranges.push(`<=${max}`);
        } else {
            ranges.push(`${min} - ${max}`);
        }
    }
    const simplified = ranges.join(' || ');
    const original = typeof range.raw === 'string' ? range.raw : String(range);
    return simplified.length < original.length ? simplified : range;
};
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/subset.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const { ANY } = Comparator;
const satisfies = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If LT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true
const subset = (sub, dom, options = {})=>{
    if (sub === dom) {
        return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set){
        for (const simpleDom of dom.set){
            const isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub) {
                continue OUTER;
            }
        }
        // the null set is a subset of everything, but null simple ranges in
        // a complex range should be ignored.  so if we saw a non-null range,
        // then we know this isn't a subset, but if EVERY simple range was null,
        // then it is a subset.
        if (sawNonNull) {
            return false;
        }
    }
    return true;
};
const minimumVersionWithPreRelease = [
    new Comparator('>=0.0.0-0')
];
const minimumVersion = [
    new Comparator('>=0.0.0')
];
const simpleSubset = (sub, dom, options)=>{
    if (sub === dom) {
        return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
            return true;
        } else if (options.includePrerelease) {
            sub = minimumVersionWithPreRelease;
        } else {
            sub = minimumVersion;
        }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
            return true;
        } else {
            dom = minimumVersion;
        }
    }
    const eqSet = new Set();
    let gt, lt;
    for (const c of sub){
        if (c.operator === '>' || c.operator === '>=') {
            gt = higherGT(gt, c, options);
        } else if (c.operator === '<' || c.operator === '<=') {
            lt = lowerLT(lt, c, options);
        } else {
            eqSet.add(c.semver);
        }
    }
    if (eqSet.size > 1) {
        return null;
    }
    let gtltComp;
    if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
            return null;
        } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
            return null;
        }
    }
    // will iterate one or zero times
    for (const eq of eqSet){
        if (gt && !satisfies(eq, String(gt), options)) {
            return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
            return null;
        }
        for (const c of dom){
            if (!satisfies(eq, String(c), options)) {
                return false;
            }
        }
        return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    // if the subset has a prerelease, we need a comparator in the superset
    // with the same tuple and a prerelease, or it's not a subset
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    // exception: <1.2.3-0 is the same as <1.2.3
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
    }
    for (const c of dom){
        hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
        hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
        if (gt) {
            if (needDomGTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
                    needDomGTPre = false;
                }
            }
            if (c.operator === '>' || c.operator === '>=') {
                higher = higherGT(gt, c, options);
                if (higher === c && higher !== gt) {
                    return false;
                }
            } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
                return false;
            }
        }
        if (lt) {
            if (needDomLTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
                    needDomLTPre = false;
                }
            }
            if (c.operator === '<' || c.operator === '<=') {
                lower = lowerLT(lt, c, options);
                if (lower === c && lower !== lt) {
                    return false;
                }
            } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
                return false;
            }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
            return false;
        }
    }
    // if there was a < or >, and nothing in the dom, then must be false
    // UNLESS it was limited by another range in the other direction.
    // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
    }
    // we needed a prerelease range in a specific tuple, but didn't get one
    // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
    // because it includes prereleases in the 1.2.3 tuple
    if (needDomGTPre || needDomLTPre) {
        return false;
    }
    return true;
};
// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === '>' && a.operator === '>=' ? b : a;
};
// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === '<' && a.operator === '<=' ? b : a;
};
module.exports = subset;
}),
"[project]/node_modules/jsonwebtoken/node_modules/semver/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// just pre-load all the stuff that index.js lazily exports
const internalRe = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const identifiers = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)");
const parse = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const valid = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/valid.js [app-route] (ecmascript)");
const clean = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/clean.js [app-route] (ecmascript)");
const inc = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/inc.js [app-route] (ecmascript)");
const diff = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/diff.js [app-route] (ecmascript)");
const major = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/major.js [app-route] (ecmascript)");
const minor = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/minor.js [app-route] (ecmascript)");
const patch = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/patch.js [app-route] (ecmascript)");
const prerelease = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/prerelease.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const rcompare = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/rcompare.js [app-route] (ecmascript)");
const compareLoose = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare-loose.js [app-route] (ecmascript)");
const compareBuild = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const sort = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/sort.js [app-route] (ecmascript)");
const rsort = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/rsort.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const eq = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/eq.js [app-route] (ecmascript)");
const neq = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/neq.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const cmp = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/cmp.js [app-route] (ecmascript)");
const coerce = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/coerce.js [app-route] (ecmascript)");
const truncate = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/truncate.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const toComparators = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/to-comparators.js [app-route] (ecmascript)");
const maxSatisfying = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/max-satisfying.js [app-route] (ecmascript)");
const minSatisfying = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/min-satisfying.js [app-route] (ecmascript)");
const minVersion = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/min-version.js [app-route] (ecmascript)");
const validRange = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/valid.js [app-route] (ecmascript)");
const outside = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
const gtr = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/gtr.js [app-route] (ecmascript)");
const ltr = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/ltr.js [app-route] (ecmascript)");
const intersects = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/intersects.js [app-route] (ecmascript)");
const simplifyRange = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/simplify.js [app-route] (ecmascript)");
const subset = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/node_modules/semver/ranges/subset.js [app-route] (ecmascript)");
module.exports = {
    parse,
    valid,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    truncate,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants.RELEASE_TYPES,
    compareIdentifiers: identifiers.compareIdentifiers,
    rcompareIdentifiers: identifiers.rcompareIdentifiers
};
}),
"[project]/node_modules/lodash.includes/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var argsTag = '[object Arguments]', funcTag = '[object Function]', genTag = '[object GeneratorFunction]', stringTag = '[object String]', symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Used to detect unsigned integer values. */ var reIsUint = /^(?:0|[1-9]\d*)$/;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */ function arrayMap(array, iteratee) {
    var index = -1, length = array ? array.length : 0, result = Array(length);
    while(++index < length){
        result[index] = iteratee(array[index], index, array);
    }
    return result;
}
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while(fromRight ? index-- : ++index < length){
        if (predicate(array[index], index, array)) {
            return index;
        }
    }
    return -1;
}
/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
    }
    var index = fromIndex - 1, length = array.length;
    while(++index < length){
        if (array[index] === value) {
            return index;
        }
    }
    return -1;
}
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */ function baseIsNaN(value) {
    return value !== value;
}
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */ function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while(++index < n){
        result[index] = iteratee(index);
    }
    return result;
}
/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */ function baseValues(object, props) {
    return arrayMap(props, function(key) {
        return object[key];
    });
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Built-in value references. */ var propertyIsEnumerable = objectProto.propertyIsEnumerable;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeKeys = overArg(Object.keys, Object), nativeMax = Math.max;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */ function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for(var key in value){
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
            result.push(key);
        }
    }
    return result;
}
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */ function baseKeys(object) {
    if (!isPrototype(object)) {
        return nativeKeys(object);
    }
    var result = [];
    for(var key in Object(object)){
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
        }
    }
    return result;
}
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */ function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */ function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
}
/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */ function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection.length;
    if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
    }
    return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */ function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */ function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */ function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */ function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
}
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */ function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */ function isString(value) {
    return typeof value == 'string' || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */ function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */ function values(object) {
    return object ? baseValues(object, keys(object)) : [];
}
module.exports = includes;
}),
"[project]/node_modules/lodash.isboolean/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ var boolTag = '[object Boolean]';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isBoolean(false);
 * // => true
 *
 * _.isBoolean(null);
 * // => false
 */ function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
module.exports = isBoolean;
}),
"[project]/node_modules/lodash.isinteger/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */ function isInteger(value) {
    return typeof value == 'number' && value == toInteger(value);
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = isInteger;
}),
"[project]/node_modules/lodash.isnumber/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ var numberTag = '[object Number]';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
 * as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */ function isNumber(value) {
    return typeof value == 'number' || isObjectLike(value) && objectToString.call(value) == numberTag;
}
module.exports = isNumber;
}),
"[project]/node_modules/lodash.isplainobject/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** `Object#toString` result references. */ var objectTag = '[object Object]';
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */ function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
        try {
            result = !!(value + '');
        } catch (e) {}
    }
    return result;
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/** Used for built-in method references. */ var funcProto = Function.prototype, objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */ var objectCtorString = funcToString.call(Object);
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Built-in value references. */ var getPrototype = overArg(Object.getPrototypeOf, Object);
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */ function isPlainObject(value) {
    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
        return true;
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
module.exports = isPlainObject;
}),
"[project]/node_modules/lodash.isstring/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash 4.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ var stringTag = '[object String]';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */ function isString(value) {
    return typeof value == 'string' || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
module.exports = isString;
}),
"[project]/node_modules/lodash.once/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as the `TypeError` message for "Functions" methods. */ var FUNC_ERROR_TEXT = 'Expected a function';
/** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */ function before(n, func) {
    var result;
    if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    n = toInteger(n);
    return function() {
        if (--n > 0) {
            result = func.apply(this, arguments);
        }
        if (n <= 1) {
            func = undefined;
        }
        return result;
    };
}
/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 */ function once(func) {
    return before(2, func);
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = once;
}),
"[project]/node_modules/process/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// for now just expose the builtin process global from node.js
module.exports = /*TURBOPACK member replacement*/ __turbopack_context__.g.process;
}),
"[project]/node_modules/event-target-shim/dist/event-target-shim.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */ Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * @typedef {object} PrivateData
 * @property {EventTarget} eventTarget The event target.
 * @property {{type:string}} event The original event object.
 * @property {number} eventPhase The current event phase.
 * @property {EventTarget|null} currentTarget The current event target.
 * @property {boolean} canceled The flag to prevent default.
 * @property {boolean} stopped The flag to stop propagation.
 * @property {boolean} immediateStopped The flag to stop propagation immediately.
 * @property {Function|null} passiveListener The listener if the current listener is passive. Otherwise this is null.
 * @property {number} timeStamp The unix time.
 * @private
 */ /**
 * Private data for event wrappers.
 * @type {WeakMap<Event, PrivateData>}
 * @private
 */ const privateData = new WeakMap();
/**
 * Cache for wrapper classes.
 * @type {WeakMap<Object, Function>}
 * @private
 */ const wrappers = new WeakMap();
/**
 * Get private data.
 * @param {Event} event The event object to get private data.
 * @returns {PrivateData} The private data of the event.
 * @private
 */ function pd(event) {
    const retv = privateData.get(event);
    console.assert(retv != null, "'this' is expected an Event object, but got", event);
    return retv;
}
/**
 * https://dom.spec.whatwg.org/#set-the-canceled-flag
 * @param data {PrivateData} private data.
 */ function setCancelFlag(data) {
    if (data.passiveListener != null) {
        if (typeof console !== "undefined" && typeof console.error === "function") {
            console.error("Unable to preventDefault inside passive event listener invocation.", data.passiveListener);
        }
        return;
    }
    if (!data.event.cancelable) {
        return;
    }
    data.canceled = true;
    if (typeof data.event.preventDefault === "function") {
        data.event.preventDefault();
    }
}
/**
 * @see https://dom.spec.whatwg.org/#interface-event
 * @private
 */ /**
 * The event wrapper.
 * @constructor
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Event|{type:string}} event The original event to wrap.
 */ function Event(eventTarget, event) {
    privateData.set(this, {
        eventTarget,
        event,
        eventPhase: 2,
        currentTarget: eventTarget,
        canceled: false,
        stopped: false,
        immediateStopped: false,
        passiveListener: null,
        timeStamp: event.timeStamp || Date.now()
    });
    // https://heycam.github.io/webidl/#Unforgeable
    Object.defineProperty(this, "isTrusted", {
        value: false,
        enumerable: true
    });
    // Define accessors
    const keys = Object.keys(event);
    for(let i = 0; i < keys.length; ++i){
        const key = keys[i];
        if (!(key in this)) {
            Object.defineProperty(this, key, defineRedirectDescriptor(key));
        }
    }
}
// Should be enumerable, but class methods are not enumerable.
Event.prototype = {
    /**
     * The type of this event.
     * @type {string}
     */ get type () {
        return pd(this).event.type;
    },
    /**
     * The target of this event.
     * @type {EventTarget}
     */ get target () {
        return pd(this).eventTarget;
    },
    /**
     * The target of this event.
     * @type {EventTarget}
     */ get currentTarget () {
        return pd(this).currentTarget;
    },
    /**
     * @returns {EventTarget[]} The composed path of this event.
     */ composedPath () {
        const currentTarget = pd(this).currentTarget;
        if (currentTarget == null) {
            return [];
        }
        return [
            currentTarget
        ];
    },
    /**
     * Constant of NONE.
     * @type {number}
     */ get NONE () {
        return 0;
    },
    /**
     * Constant of CAPTURING_PHASE.
     * @type {number}
     */ get CAPTURING_PHASE () {
        return 1;
    },
    /**
     * Constant of AT_TARGET.
     * @type {number}
     */ get AT_TARGET () {
        return 2;
    },
    /**
     * Constant of BUBBLING_PHASE.
     * @type {number}
     */ get BUBBLING_PHASE () {
        return 3;
    },
    /**
     * The target of this event.
     * @type {number}
     */ get eventPhase () {
        return pd(this).eventPhase;
    },
    /**
     * Stop event bubbling.
     * @returns {void}
     */ stopPropagation () {
        const data = pd(this);
        data.stopped = true;
        if (typeof data.event.stopPropagation === "function") {
            data.event.stopPropagation();
        }
    },
    /**
     * Stop event bubbling.
     * @returns {void}
     */ stopImmediatePropagation () {
        const data = pd(this);
        data.stopped = true;
        data.immediateStopped = true;
        if (typeof data.event.stopImmediatePropagation === "function") {
            data.event.stopImmediatePropagation();
        }
    },
    /**
     * The flag to be bubbling.
     * @type {boolean}
     */ get bubbles () {
        return Boolean(pd(this).event.bubbles);
    },
    /**
     * The flag to be cancelable.
     * @type {boolean}
     */ get cancelable () {
        return Boolean(pd(this).event.cancelable);
    },
    /**
     * Cancel this event.
     * @returns {void}
     */ preventDefault () {
        setCancelFlag(pd(this));
    },
    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     */ get defaultPrevented () {
        return pd(this).canceled;
    },
    /**
     * The flag to be composed.
     * @type {boolean}
     */ get composed () {
        return Boolean(pd(this).event.composed);
    },
    /**
     * The unix time of this event.
     * @type {number}
     */ get timeStamp () {
        return pd(this).timeStamp;
    },
    /**
     * The target of this event.
     * @type {EventTarget}
     * @deprecated
     */ get srcElement () {
        return pd(this).eventTarget;
    },
    /**
     * The flag to stop event bubbling.
     * @type {boolean}
     * @deprecated
     */ get cancelBubble () {
        return pd(this).stopped;
    },
    set cancelBubble (value){
        if (!value) {
            return;
        }
        const data = pd(this);
        data.stopped = true;
        if (typeof data.event.cancelBubble === "boolean") {
            data.event.cancelBubble = true;
        }
    },
    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     * @deprecated
     */ get returnValue () {
        return !pd(this).canceled;
    },
    set returnValue (value){
        if (!value) {
            setCancelFlag(pd(this));
        }
    },
    /**
     * Initialize this event object. But do nothing under event dispatching.
     * @param {string} type The event type.
     * @param {boolean} [bubbles=false] The flag to be possible to bubble up.
     * @param {boolean} [cancelable=false] The flag to be possible to cancel.
     * @deprecated
     */ initEvent () {
    // Do nothing.
    }
};
// `constructor` is not enumerable.
Object.defineProperty(Event.prototype, "constructor", {
    value: Event,
    configurable: true,
    writable: true
});
// Ensure `event instanceof window.Event` is `true`.
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
/**
 * Get the property descriptor to redirect a given property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to redirect the property.
 * @private
 */ function defineRedirectDescriptor(key) {
    return {
        get () {
            return pd(this).event[key];
        },
        set (value1) {
            pd(this).event[key] = value1;
        },
        configurable: true,
        enumerable: true
    };
}
/**
 * Get the property descriptor to call a given method property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to call the method property.
 * @private
 */ function defineCallDescriptor(key) {
    return {
        value () {
            const event = pd(this).event;
            return event[key].apply(event, arguments);
        },
        configurable: true,
        enumerable: true
    };
}
/**
 * Define new wrapper class.
 * @param {Function} BaseEvent The base wrapper class.
 * @param {Object} proto The prototype of the original event.
 * @returns {Function} The defined wrapper class.
 * @private
 */ function defineWrapper(BaseEvent, proto) {
    const keys = Object.keys(proto);
    if (keys.length === 0) {
        return BaseEvent;
    }
    /** CustomEvent */ function CustomEvent(eventTarget, event) {
        BaseEvent.call(this, eventTarget, event);
    }
    CustomEvent.prototype = Object.create(BaseEvent.prototype, {
        constructor: {
            value: CustomEvent,
            configurable: true,
            writable: true
        }
    });
    // Define accessors.
    for(let i = 0; i < keys.length; ++i){
        const key = keys[i];
        if (!(key in BaseEvent.prototype)) {
            const descriptor = Object.getOwnPropertyDescriptor(proto, key);
            const isFunc = typeof descriptor.value === "function";
            Object.defineProperty(CustomEvent.prototype, key, isFunc ? defineCallDescriptor(key) : defineRedirectDescriptor(key));
        }
    }
    return CustomEvent;
}
/**
 * Get the wrapper class of a given prototype.
 * @param {Object} proto The prototype of the original event to get its wrapper.
 * @returns {Function} The wrapper class.
 * @private
 */ function getWrapper(proto) {
    if (proto == null || proto === Object.prototype) {
        return Event;
    }
    let wrapper = wrappers.get(proto);
    if (wrapper == null) {
        wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
        wrappers.set(proto, wrapper);
    }
    return wrapper;
}
/**
 * Wrap a given event to management a dispatching.
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Object} event The event to wrap.
 * @returns {Event} The wrapper instance.
 * @private
 */ function wrapEvent(eventTarget, event) {
    const Wrapper = getWrapper(Object.getPrototypeOf(event));
    return new Wrapper(eventTarget, event);
}
/**
 * Get the immediateStopped flag of a given event.
 * @param {Event} event The event to get.
 * @returns {boolean} The flag to stop propagation immediately.
 * @private
 */ function isStopped(event) {
    return pd(event).immediateStopped;
}
/**
 * Set the current event phase of a given event.
 * @param {Event} event The event to set current target.
 * @param {number} eventPhase New event phase.
 * @returns {void}
 * @private
 */ function setEventPhase(event, eventPhase) {
    pd(event).eventPhase = eventPhase;
}
/**
 * Set the current target of a given event.
 * @param {Event} event The event to set current target.
 * @param {EventTarget|null} currentTarget New current target.
 * @returns {void}
 * @private
 */ function setCurrentTarget(event, currentTarget) {
    pd(event).currentTarget = currentTarget;
}
/**
 * Set a passive listener of a given event.
 * @param {Event} event The event to set current target.
 * @param {Function|null} passiveListener New passive listener.
 * @returns {void}
 * @private
 */ function setPassiveListener(event, passiveListener) {
    pd(event).passiveListener = passiveListener;
}
/**
 * @typedef {object} ListenerNode
 * @property {Function} listener
 * @property {1|2|3} listenerType
 * @property {boolean} passive
 * @property {boolean} once
 * @property {ListenerNode|null} next
 * @private
 */ /**
 * @type {WeakMap<object, Map<string, ListenerNode>>}
 * @private
 */ const listenersMap = new WeakMap();
// Listener types
const CAPTURE = 1;
const BUBBLE = 2;
const ATTRIBUTE = 3;
/**
 * Check whether a given value is an object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an object.
 */ function isObject(x) {
    return x !== null && typeof x === "object" //eslint-disable-line no-restricted-syntax
    ;
}
/**
 * Get listeners.
 * @param {EventTarget} eventTarget The event target to get.
 * @returns {Map<string, ListenerNode>} The listeners.
 * @private
 */ function getListeners(eventTarget) {
    const listeners = listenersMap.get(eventTarget);
    if (listeners == null) {
        throw new TypeError("'this' is expected an EventTarget object, but got another value.");
    }
    return listeners;
}
/**
 * Get the property descriptor for the event attribute of a given event.
 * @param {string} eventName The event name to get property descriptor.
 * @returns {PropertyDescriptor} The property descriptor.
 * @private
 */ function defineEventAttributeDescriptor(eventName) {
    return {
        get () {
            const listeners = getListeners(this);
            let node = listeners.get(eventName);
            while(node != null){
                if (node.listenerType === ATTRIBUTE) {
                    return node.listener;
                }
                node = node.next;
            }
            return null;
        },
        set (listener) {
            if (typeof listener !== "function" && !isObject(listener)) {
                listener = null; // eslint-disable-line no-param-reassign
            }
            const listeners = getListeners(this);
            // Traverse to the tail while removing old value.
            let prev = null;
            let node = listeners.get(eventName);
            while(node != null){
                if (node.listenerType === ATTRIBUTE) {
                    // Remove old value.
                    if (prev !== null) {
                        prev.next = node.next;
                    } else if (node.next !== null) {
                        listeners.set(eventName, node.next);
                    } else {
                        listeners.delete(eventName);
                    }
                } else {
                    prev = node;
                }
                node = node.next;
            }
            // Add new value.
            if (listener !== null) {
                const newNode = {
                    listener,
                    listenerType: ATTRIBUTE,
                    passive: false,
                    once: false,
                    next: null
                };
                if (prev === null) {
                    listeners.set(eventName, newNode);
                } else {
                    prev.next = newNode;
                }
            }
        },
        configurable: true,
        enumerable: true
    };
}
/**
 * Define an event attribute (e.g. `eventTarget.onclick`).
 * @param {Object} eventTargetPrototype The event target prototype to define an event attrbite.
 * @param {string} eventName The event name to define.
 * @returns {void}
 */ function defineEventAttribute(eventTargetPrototype, eventName) {
    Object.defineProperty(eventTargetPrototype, `on${eventName}`, defineEventAttributeDescriptor(eventName));
}
/**
 * Define a custom EventTarget with event attributes.
 * @param {string[]} eventNames Event names for event attributes.
 * @returns {EventTarget} The custom EventTarget.
 * @private
 */ function defineCustomEventTarget(eventNames) {
    /** CustomEventTarget */ function CustomEventTarget() {
        EventTarget.call(this);
    }
    CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
        constructor: {
            value: CustomEventTarget,
            configurable: true,
            writable: true
        }
    });
    for(let i = 0; i < eventNames.length; ++i){
        defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
    }
    return CustomEventTarget;
}
/**
 * EventTarget.
 *
 * - This is constructor if no arguments.
 * - This is a function which returns a CustomEventTarget constructor if there are arguments.
 *
 * For example:
 *
 *     class A extends EventTarget {}
 *     class B extends EventTarget("message") {}
 *     class C extends EventTarget("message", "error") {}
 *     class D extends EventTarget(["message", "error"]) {}
 */ function EventTarget() {
    /*eslint-disable consistent-return */ if (this instanceof EventTarget) {
        listenersMap.set(this, new Map());
        return;
    }
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return defineCustomEventTarget(arguments[0]);
    }
    if (arguments.length > 0) {
        const types = new Array(arguments.length);
        for(let i = 0; i < arguments.length; ++i){
            types[i] = arguments[i];
        }
        return defineCustomEventTarget(types);
    }
    throw new TypeError("Cannot call a class as a function");
/*eslint-enable consistent-return */ }
// Should be enumerable, but class methods are not enumerable.
EventTarget.prototype = {
    /**
     * Add a given listener to this event target.
     * @param {string} eventName The event name to add.
     * @param {Function} listener The listener to add.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {void}
     */ addEventListener (eventName, listener, options) {
        if (listener == null) {
            return;
        }
        if (typeof listener !== "function" && !isObject(listener)) {
            throw new TypeError("'listener' should be a function or an object.");
        }
        const listeners = getListeners(this);
        const optionsIsObj = isObject(options);
        const capture = optionsIsObj ? Boolean(options.capture) : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        const newNode = {
            listener,
            listenerType,
            passive: optionsIsObj && Boolean(options.passive),
            once: optionsIsObj && Boolean(options.once),
            next: null
        };
        // Set it as the first node if the first node is null.
        let node = listeners.get(eventName);
        if (node === undefined) {
            listeners.set(eventName, newNode);
            return;
        }
        // Traverse to the tail while checking duplication..
        let prev = null;
        while(node != null){
            if (node.listener === listener && node.listenerType === listenerType) {
                // Should ignore duplication.
                return;
            }
            prev = node;
            node = node.next;
        }
        // Add it.
        prev.next = newNode;
    },
    /**
     * Remove a given listener from this event target.
     * @param {string} eventName The event name to remove.
     * @param {Function} listener The listener to remove.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {void}
     */ removeEventListener (eventName, listener, options) {
        if (listener == null) {
            return;
        }
        const listeners = getListeners(this);
        const capture = isObject(options) ? Boolean(options.capture) : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        let prev = null;
        let node = listeners.get(eventName);
        while(node != null){
            if (node.listener === listener && node.listenerType === listenerType) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
                return;
            }
            prev = node;
            node = node.next;
        }
    },
    /**
     * Dispatch a given event.
     * @param {Event|{type:string}} event The event to dispatch.
     * @returns {boolean} `false` if canceled.
     */ dispatchEvent (event) {
        if (event == null || typeof event.type !== "string") {
            throw new TypeError('"event.type" should be a string.');
        }
        // If listeners aren't registered, terminate.
        const listeners = getListeners(this);
        const eventName = event.type;
        let node = listeners.get(eventName);
        if (node == null) {
            return true;
        }
        // Since we cannot rewrite several properties, so wrap object.
        const wrappedEvent = wrapEvent(this, event);
        // This doesn't process capturing phase and bubbling phase.
        // This isn't participating in a tree.
        let prev = null;
        while(node != null){
            // Remove this listener if it's once
            if (node.once) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
            } else {
                prev = node;
            }
            // Call this listener
            setPassiveListener(wrappedEvent, node.passive ? node.listener : null);
            if (typeof node.listener === "function") {
                try {
                    node.listener.call(this, wrappedEvent);
                } catch (err) {
                    if (typeof console !== "undefined" && typeof console.error === "function") {
                        console.error(err);
                    }
                }
            } else if (node.listenerType !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
                node.listener.handleEvent(wrappedEvent);
            }
            // Break if `event.stopImmediatePropagation` was called.
            if (isStopped(wrappedEvent)) {
                break;
            }
            node = node.next;
        }
        setPassiveListener(wrappedEvent, null);
        setEventPhase(wrappedEvent, 0);
        setCurrentTarget(wrappedEvent, null);
        return !wrappedEvent.defaultPrevented;
    }
};
// `constructor` is not enumerable.
Object.defineProperty(EventTarget.prototype, "constructor", {
    value: EventTarget,
    configurable: true,
    writable: true
});
// Ensure `eventTarget instanceof window.EventTarget` is `true`.
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
exports.defineEventAttribute = defineEventAttribute;
exports.EventTarget = EventTarget;
exports.default = EventTarget;
module.exports = EventTarget;
module.exports.EventTarget = module.exports["default"] = EventTarget;
module.exports.defineEventAttribute = defineEventAttribute;
}),
"[project]/node_modules/abort-controller/dist/abort-controller.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */ Object.defineProperty(exports, '__esModule', {
    value: true
});
var eventTargetShim = __turbopack_context__.r("[project]/node_modules/event-target-shim/dist/event-target-shim.js [app-route] (ecmascript)");
/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */ class AbortSignal extends eventTargetShim.EventTarget {
    /**
     * AbortSignal cannot be constructed directly.
     */ constructor(){
        super();
        throw new TypeError("AbortSignal cannot be constructed directly");
    }
    /**
     * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
     */ get aborted() {
        const aborted = abortedFlags.get(this);
        if (typeof aborted !== "boolean") {
            throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
        }
        return aborted;
    }
}
eventTargetShim.defineEventAttribute(AbortSignal.prototype, "abort");
/**
 * Create an AbortSignal object.
 */ function createAbortSignal() {
    const signal = Object.create(AbortSignal.prototype);
    eventTargetShim.EventTarget.call(signal);
    abortedFlags.set(signal, false);
    return signal;
}
/**
 * Abort a given signal.
 */ function abortSignal(signal) {
    if (abortedFlags.get(signal) !== false) {
        return;
    }
    abortedFlags.set(signal, true);
    signal.dispatchEvent({
        type: "abort"
    });
}
/**
 * Aborted flag for each instances.
 */ const abortedFlags = new WeakMap();
// Properties should be enumerable.
Object.defineProperties(AbortSignal.prototype, {
    aborted: {
        enumerable: true
    }
});
// `toString()` should return `"[object AbortSignal]"`
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortSignal"
    });
}
/**
 * The AbortController.
 * @see https://dom.spec.whatwg.org/#abortcontroller
 */ class AbortController {
    /**
     * Initialize this controller.
     */ constructor(){
        signals.set(this, createAbortSignal());
    }
    /**
     * Returns the `AbortSignal` object associated with this object.
     */ get signal() {
        return getSignal(this);
    }
    /**
     * Abort and signal to any observers that the associated activity is to be aborted.
     */ abort() {
        abortSignal(getSignal(this));
    }
}
/**
 * Associated signals.
 */ const signals = new WeakMap();
/**
 * Get the associated signal of a given controller.
 */ function getSignal(controller) {
    const signal = signals.get(controller);
    if (signal == null) {
        throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${controller === null ? "null" : typeof controller}`);
    }
    return signal;
}
// Properties should be enumerable.
Object.defineProperties(AbortController.prototype, {
    signal: {
        enumerable: true
    },
    abort: {
        enumerable: true
    }
});
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortController.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortController"
    });
}
exports.AbortController = AbortController;
exports.AbortSignal = AbortSignal;
exports.default = AbortController;
module.exports = AbortController;
module.exports.AbortController = module.exports["default"] = AbortController;
module.exports.AbortSignal = AbortSignal;
}),
"[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
/*<replacement>*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
/*</replacement>*/ var isEncoding = Buffer.isEncoding || function(encoding) {
    encoding = '' + encoding;
    switch(encoding && encoding.toLowerCase()){
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
        case 'raw':
            return true;
        default:
            return false;
    }
};
function _normalizeEncoding(enc) {
    if (!enc) return 'utf8';
    var retried;
    while(true){
        switch(enc){
            case 'utf8':
            case 'utf-8':
                return 'utf8';
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return 'utf16le';
            case 'latin1':
            case 'binary':
                return 'latin1';
            case 'base64':
            case 'ascii':
            case 'hex':
                return enc;
            default:
                if (retried) return; // undefined
                enc = ('' + enc).toLowerCase();
                retried = true;
        }
    }
}
;
// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
    return nenc || enc;
}
// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch(this.encoding){
        case 'utf16le':
            this.text = utf16Text;
            this.end = utf16End;
            nb = 4;
            break;
        case 'utf8':
            this.fillLast = utf8FillLast;
            nb = 4;
            break;
        case 'base64':
            this.text = base64Text;
            this.end = base64End;
            nb = 3;
            break;
        default:
            this.write = simpleWrite;
            this.end = simpleEnd;
            return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer.allocUnsafe(nb);
}
StringDecoder.prototype.write = function(buf) {
    if (buf.length === 0) return '';
    var r;
    var i;
    if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === undefined) return '';
        i = this.lastNeed;
        this.lastNeed = 0;
    } else {
        i = 0;
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || '';
};
StringDecoder.prototype.end = utf8End;
// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;
// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function(buf) {
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
};
// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
    if (byte <= 0x7F) return 0;
    else if (byte >> 5 === 0x06) return 2;
    else if (byte >> 4 === 0x0E) return 3;
    else if (byte >> 3 === 0x1E) return 4;
    return byte >> 6 === 0x02 ? -1 : -2;
}
// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
    var j = buf.length - 1;
    if (j < i) return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 1;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 2;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) {
            if (nb === 2) nb = 0;
            else self.lastNeed = nb - 3;
        }
        return nb;
    }
    return 0;
}
// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
    if ((buf[0] & 0xC0) !== 0x80) {
        self.lastNeed = 0;
        return '\ufffd';
    }
    if (self.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 0xC0) !== 0x80) {
            self.lastNeed = 1;
            return '\ufffd';
        }
        if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 0xC0) !== 0x80) {
                self.lastNeed = 2;
                return '\ufffd';
            }
        }
    }
}
// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf, p);
    if (r !== undefined) return r;
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
}
// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed) return buf.toString('utf8', i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString('utf8', i, end);
}
// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + '\ufffd';
    return r;
}
// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
        var r = buf.toString('utf16le', i);
        if (r) {
            var c = r.charCodeAt(r.length - 1);
            if (c >= 0xD800 && c <= 0xDBFF) {
                this.lastNeed = 2;
                this.lastTotal = 4;
                this.lastChar[0] = buf[buf.length - 2];
                this.lastChar[1] = buf[buf.length - 1];
                return r.slice(0, -1);
            }
        }
        return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString('utf16le', i, buf.length - 1);
}
// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString('utf16le', 0, end);
    }
    return r;
}
function base64Text(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0) return buf.toString('base64', i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
    } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString('base64', i, buf.length - n);
}
function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
    return r;
}
// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
    return buf.toString(this.encoding);
}
function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : '';
}
}),
"[project]/node_modules/inherits/inherits_browser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
        }
    };
} else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
        }
    };
}
}),
"[project]/node_modules/inherits/inherits.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

try {
    var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
    /* istanbul ignore next */ if (typeof util.inherits !== 'function') throw '';
    module.exports = util.inherits;
} catch (e) {
    /* istanbul ignore next */ module.exports = __turbopack_context__.r("[project]/node_modules/inherits/inherits_browser.js [app-route] (ecmascript)");
}
}),
"[project]/node_modules/bl/BufferList.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { Buffer } = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
const symbol = Symbol.for('BufferList');
function BufferList(buf) {
    if (!(this instanceof BufferList)) {
        return new BufferList(buf);
    }
    BufferList._init.call(this, buf);
}
BufferList._init = function _init(buf) {
    Object.defineProperty(this, symbol, {
        value: true
    });
    this._bufs = [];
    this.length = 0;
    if (buf) {
        this.append(buf);
    }
};
BufferList.prototype._new = function _new(buf) {
    return new BufferList(buf);
};
BufferList.prototype._offset = function _offset(offset) {
    if (offset === 0) {
        return [
            0,
            0
        ];
    }
    let tot = 0;
    for(let i = 0; i < this._bufs.length; i++){
        const _t = tot + this._bufs[i].length;
        if (offset < _t || i === this._bufs.length - 1) {
            return [
                i,
                offset - tot
            ];
        }
        tot = _t;
    }
};
BufferList.prototype._reverseOffset = function(blOffset) {
    const bufferId = blOffset[0];
    let offset = blOffset[1];
    for(let i = 0; i < bufferId; i++){
        offset += this._bufs[i].length;
    }
    return offset;
};
BufferList.prototype.getBuffers = function getBuffers() {
    return this._bufs;
};
BufferList.prototype.get = function get(index) {
    if (index > this.length || index < 0) {
        return undefined;
    }
    const offset = this._offset(index);
    return this._bufs[offset[0]][offset[1]];
};
BufferList.prototype.slice = function slice(start, end) {
    if (typeof start === 'number' && start < 0) {
        start += this.length;
    }
    if (typeof end === 'number' && end < 0) {
        end += this.length;
    }
    return this.copy(null, 0, start, end);
};
BufferList.prototype.copy = function copy(dst, dstStart, srcStart, srcEnd) {
    if (typeof srcStart !== 'number' || srcStart < 0) {
        srcStart = 0;
    }
    if (typeof srcEnd !== 'number' || srcEnd > this.length) {
        srcEnd = this.length;
    }
    if (srcStart >= this.length) {
        return dst || Buffer.alloc(0);
    }
    if (srcEnd <= 0) {
        return dst || Buffer.alloc(0);
    }
    const copy = !!dst;
    const off = this._offset(srcStart);
    const len = srcEnd - srcStart;
    let bytes = len;
    let bufoff = copy && dstStart || 0;
    let start = off[1];
    // copy/slice everything
    if (srcStart === 0 && srcEnd === this.length) {
        if (!copy) {
            // slice, but full concat if multiple buffers
            return this._bufs.length === 1 ? this._bufs[0] : Buffer.concat(this._bufs, this.length);
        }
        // copy, need to copy individual buffers
        for(let i = 0; i < this._bufs.length; i++){
            this._bufs[i].copy(dst, bufoff);
            bufoff += this._bufs[i].length;
        }
        return dst;
    }
    // easy, cheap case where it's a subset of one of the buffers
    if (bytes <= this._bufs[off[0]].length - start) {
        return copy ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes) : this._bufs[off[0]].slice(start, start + bytes);
    }
    if (!copy) {
        // a slice, we need something to copy in to
        dst = Buffer.allocUnsafe(len);
    }
    for(let i = off[0]; i < this._bufs.length; i++){
        const l = this._bufs[i].length - start;
        if (bytes > l) {
            this._bufs[i].copy(dst, bufoff, start);
            bufoff += l;
        } else {
            this._bufs[i].copy(dst, bufoff, start, start + bytes);
            bufoff += l;
            break;
        }
        bytes -= l;
        if (start) {
            start = 0;
        }
    }
    // safeguard so that we don't return uninitialized memory
    if (dst.length > bufoff) return dst.slice(0, bufoff);
    return dst;
};
BufferList.prototype.shallowSlice = function shallowSlice(start, end) {
    start = start || 0;
    end = typeof end !== 'number' ? this.length : end;
    if (start < 0) {
        start += this.length;
    }
    if (end < 0) {
        end += this.length;
    }
    if (start === end) {
        return this._new();
    }
    const startOffset = this._offset(start);
    const endOffset = this._offset(end);
    const buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1);
    if (endOffset[1] === 0) {
        buffers.pop();
    } else {
        buffers[buffers.length - 1] = buffers[buffers.length - 1].slice(0, endOffset[1]);
    }
    if (startOffset[1] !== 0) {
        buffers[0] = buffers[0].slice(startOffset[1]);
    }
    return this._new(buffers);
};
BufferList.prototype.toString = function toString(encoding, start, end) {
    return this.slice(start, end).toString(encoding);
};
BufferList.prototype.consume = function consume(bytes) {
    // first, normalize the argument, in accordance with how Buffer does it
    bytes = Math.trunc(bytes);
    // do nothing if not a positive number
    if (Number.isNaN(bytes) || bytes <= 0) return this;
    while(this._bufs.length){
        if (bytes >= this._bufs[0].length) {
            bytes -= this._bufs[0].length;
            this.length -= this._bufs[0].length;
            this._bufs.shift();
        } else {
            this._bufs[0] = this._bufs[0].slice(bytes);
            this.length -= bytes;
            break;
        }
    }
    return this;
};
BufferList.prototype.duplicate = function duplicate() {
    const copy = this._new();
    for(let i = 0; i < this._bufs.length; i++){
        copy.append(this._bufs[i]);
    }
    return copy;
};
BufferList.prototype.append = function append(buf) {
    return this._attach(buf, BufferList.prototype._appendBuffer);
};
BufferList.prototype.prepend = function prepend(buf) {
    return this._attach(buf, BufferList.prototype._prependBuffer, true);
};
BufferList.prototype._attach = function _attach(buf, attacher, prepend) {
    if (buf == null) {
        return this;
    }
    if (buf.buffer) {
        // append/prepend a view of the underlying ArrayBuffer
        attacher.call(this, Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength));
    } else if (Array.isArray(buf)) {
        const [starting, modifier] = prepend ? [
            buf.length - 1,
            -1
        ] : [
            0,
            1
        ];
        for(let i = starting; i >= 0 && i < buf.length; i += modifier){
            this._attach(buf[i], attacher, prepend);
        }
    } else if (this._isBufferList(buf)) {
        // unwrap argument into individual BufferLists
        const [starting, modifier] = prepend ? [
            buf._bufs.length - 1,
            -1
        ] : [
            0,
            1
        ];
        for(let i = starting; i >= 0 && i < buf._bufs.length; i += modifier){
            this._attach(buf._bufs[i], attacher, prepend);
        }
    } else {
        // coerce number arguments to strings, since Buffer(number) does
        // uninitialized memory allocation
        if (typeof buf === 'number') {
            buf = buf.toString();
        }
        attacher.call(this, Buffer.from(buf));
    }
    return this;
};
BufferList.prototype._appendBuffer = function appendBuffer(buf) {
    this._bufs.push(buf);
    this.length += buf.length;
};
BufferList.prototype._prependBuffer = function prependBuffer(buf) {
    this._bufs.unshift(buf);
    this.length += buf.length;
};
BufferList.prototype.indexOf = function(search, offset, encoding) {
    if (encoding === undefined && typeof offset === 'string') {
        encoding = offset;
        offset = undefined;
    }
    if (typeof search === 'function' || Array.isArray(search)) {
        throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.');
    } else if (typeof search === 'number') {
        search = Buffer.from([
            search
        ]);
    } else if (typeof search === 'string') {
        search = Buffer.from(search, encoding);
    } else if (this._isBufferList(search)) {
        search = search.slice();
    } else if (Array.isArray(search.buffer)) {
        search = Buffer.from(search.buffer, search.byteOffset, search.byteLength);
    } else if (!Buffer.isBuffer(search)) {
        search = Buffer.from(search);
    }
    offset = Number(offset || 0);
    if (isNaN(offset)) {
        offset = 0;
    }
    if (offset < 0) {
        offset = this.length + offset;
    }
    if (offset < 0) {
        offset = 0;
    }
    if (search.length === 0) {
        return offset > this.length ? this.length : offset;
    }
    const blOffset = this._offset(offset);
    let blIndex = blOffset[0] // index of which internal buffer we're working on
    ;
    let buffOffset = blOffset[1] // offset of the internal buffer we're working on
    ;
    // scan over each buffer
    for(; blIndex < this._bufs.length; blIndex++){
        const buff = this._bufs[blIndex];
        while(buffOffset < buff.length){
            const availableWindow = buff.length - buffOffset;
            if (availableWindow >= search.length) {
                const nativeSearchResult = buff.indexOf(search, buffOffset);
                if (nativeSearchResult !== -1) {
                    return this._reverseOffset([
                        blIndex,
                        nativeSearchResult
                    ]);
                }
                buffOffset = buff.length - search.length + 1; // end of native search window
            } else {
                const revOffset = this._reverseOffset([
                    blIndex,
                    buffOffset
                ]);
                if (this._match(revOffset, search)) {
                    return revOffset;
                }
                buffOffset++;
            }
        }
        buffOffset = 0;
    }
    return -1;
};
BufferList.prototype._match = function(offset, search) {
    if (this.length - offset < search.length) {
        return false;
    }
    for(let searchOffset = 0; searchOffset < search.length; searchOffset++){
        if (this.get(offset + searchOffset) !== search[searchOffset]) {
            return false;
        }
    }
    return true;
};
(function() {
    const methods = {
        readDoubleBE: 8,
        readDoubleLE: 8,
        readFloatBE: 4,
        readFloatLE: 4,
        readBigInt64BE: 8,
        readBigInt64LE: 8,
        readBigUInt64BE: 8,
        readBigUInt64LE: 8,
        readInt32BE: 4,
        readInt32LE: 4,
        readUInt32BE: 4,
        readUInt32LE: 4,
        readInt16BE: 2,
        readInt16LE: 2,
        readUInt16BE: 2,
        readUInt16LE: 2,
        readInt8: 1,
        readUInt8: 1,
        readIntBE: null,
        readIntLE: null,
        readUIntBE: null,
        readUIntLE: null
    };
    for(const m in methods){
        (function(m) {
            if (methods[m] === null) {
                BufferList.prototype[m] = function(offset, byteLength) {
                    return this.slice(offset, offset + byteLength)[m](0, byteLength);
                };
            } else {
                BufferList.prototype[m] = function(offset = 0) {
                    return this.slice(offset, offset + methods[m])[m](0);
                };
            }
        })(m);
    }
})();
// Used internally by the class and also as an indicator of this object being
// a `BufferList`. It's not possible to use `instanceof BufferList` in a browser
// environment because there could be multiple different copies of the
// BufferList class and some `BufferList`s might be `BufferList`s.
BufferList.prototype._isBufferList = function _isBufferList(b) {
    return b instanceof BufferList || BufferList.isBufferList(b);
};
BufferList.isBufferList = function isBufferList(b) {
    return b != null && b[symbol];
};
module.exports = BufferList;
}),
"[project]/node_modules/bl/bl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const DuplexStream = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/ours/index.js [app-route] (ecmascript)").Duplex;
const inherits = __turbopack_context__.r("[project]/node_modules/inherits/inherits.js [app-route] (ecmascript)");
const BufferList = __turbopack_context__.r("[project]/node_modules/bl/BufferList.js [app-route] (ecmascript)");
function BufferListStream(callback) {
    if (!(this instanceof BufferListStream)) {
        return new BufferListStream(callback);
    }
    if (typeof callback === 'function') {
        this._callback = callback;
        const piper = (function piper(err) {
            if (this._callback) {
                this._callback(err);
                this._callback = null;
            }
        }).bind(this);
        this.on('pipe', function onPipe(src) {
            src.on('error', piper);
        });
        this.on('unpipe', function onUnpipe(src) {
            src.removeListener('error', piper);
        });
        callback = null;
    }
    BufferList._init.call(this, callback);
    DuplexStream.call(this);
}
inherits(BufferListStream, DuplexStream);
Object.assign(BufferListStream.prototype, BufferList.prototype);
BufferListStream.prototype._new = function _new(callback) {
    return new BufferListStream(callback);
};
BufferListStream.prototype._write = function _write(buf, encoding, callback) {
    this._appendBuffer(buf);
    if (typeof callback === 'function') {
        callback();
    }
};
BufferListStream.prototype._read = function _read(size) {
    if (!this.length) {
        return this.push(null);
    }
    size = Math.min(size, this.length);
    this.push(this.slice(0, size));
    this.consume(size);
};
BufferListStream.prototype.end = function end(chunk) {
    DuplexStream.prototype.end.call(this, chunk);
    if (this._callback) {
        this._callback(null, this.slice());
        this._callback = null;
    }
};
BufferListStream.prototype._destroy = function _destroy(err, cb) {
    this._bufs.length = 0;
    this.length = 0;
    cb(err);
};
BufferListStream.prototype._isBufferList = function _isBufferList(b) {
    return b instanceof BufferListStream || b instanceof BufferList || BufferListStream.isBufferList(b);
};
BufferListStream.isBufferList = BufferList.isBufferList;
module.exports = BufferListStream;
module.exports.BufferListStream = BufferListStream;
module.exports.BufferList = BufferList;
}),
"[project]/node_modules/mqtt-packet/packet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

class Packet {
    constructor(){
        this.cmd = null;
        this.retain = false;
        this.qos = 0;
        this.dup = false;
        this.length = -1;
        this.topic = null;
        this.payload = null;
    }
}
module.exports = Packet;
}),
"[project]/node_modules/mqtt-packet/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* Protocol - protocol constants */ const protocol = module.exports;
const { Buffer } = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
/* Command code => mnemonic */ protocol.types = {
    0: 'reserved',
    1: 'connect',
    2: 'connack',
    3: 'publish',
    4: 'puback',
    5: 'pubrec',
    6: 'pubrel',
    7: 'pubcomp',
    8: 'subscribe',
    9: 'suback',
    10: 'unsubscribe',
    11: 'unsuback',
    12: 'pingreq',
    13: 'pingresp',
    14: 'disconnect',
    15: 'auth'
};
protocol.requiredHeaderFlags = {
    1: 0,
    2: 0,
    4: 0,
    5: 0,
    6: 2,
    7: 0,
    8: 2,
    9: 0,
    10: 2,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0 // 'auth'
};
protocol.requiredHeaderFlagsErrors = {};
for(const k in protocol.requiredHeaderFlags){
    const v = protocol.requiredHeaderFlags[k];
    protocol.requiredHeaderFlagsErrors[k] = 'Invalid header flag bits, must be 0x' + v.toString(16) + ' for ' + protocol.types[k] + ' packet';
}
/* Mnemonic => Command code */ protocol.codes = {};
for(const k in protocol.types){
    const v = protocol.types[k];
    protocol.codes[v] = k;
}
/* Header */ protocol.CMD_SHIFT = 4;
protocol.CMD_MASK = 0xF0;
protocol.DUP_MASK = 0x08;
protocol.QOS_MASK = 0x03;
protocol.QOS_SHIFT = 1;
protocol.RETAIN_MASK = 0x01;
/* Length */ protocol.VARBYTEINT_MASK = 0x7F;
protocol.VARBYTEINT_FIN_MASK = 0x80;
protocol.VARBYTEINT_MAX = 268435455;
/* Connack */ protocol.SESSIONPRESENT_MASK = 0x01;
protocol.SESSIONPRESENT_HEADER = Buffer.from([
    protocol.SESSIONPRESENT_MASK
]);
protocol.CONNACK_HEADER = Buffer.from([
    protocol.codes.connack << protocol.CMD_SHIFT
]);
/* Connect */ protocol.USERNAME_MASK = 0x80;
protocol.PASSWORD_MASK = 0x40;
protocol.WILL_RETAIN_MASK = 0x20;
protocol.WILL_QOS_MASK = 0x18;
protocol.WILL_QOS_SHIFT = 3;
protocol.WILL_FLAG_MASK = 0x04;
protocol.CLEAN_SESSION_MASK = 0x02;
protocol.CONNECT_HEADER = Buffer.from([
    protocol.codes.connect << protocol.CMD_SHIFT
]);
/* Properties */ protocol.properties = {
    sessionExpiryInterval: 17,
    willDelayInterval: 24,
    receiveMaximum: 33,
    maximumPacketSize: 39,
    topicAliasMaximum: 34,
    requestResponseInformation: 25,
    requestProblemInformation: 23,
    userProperties: 38,
    authenticationMethod: 21,
    authenticationData: 22,
    payloadFormatIndicator: 1,
    messageExpiryInterval: 2,
    contentType: 3,
    responseTopic: 8,
    correlationData: 9,
    maximumQoS: 36,
    retainAvailable: 37,
    assignedClientIdentifier: 18,
    reasonString: 31,
    wildcardSubscriptionAvailable: 40,
    subscriptionIdentifiersAvailable: 41,
    sharedSubscriptionAvailable: 42,
    serverKeepAlive: 19,
    responseInformation: 26,
    serverReference: 28,
    topicAlias: 35,
    subscriptionIdentifier: 11
};
protocol.propertiesCodes = {};
for(const prop in protocol.properties){
    const id = protocol.properties[prop];
    protocol.propertiesCodes[id] = prop;
}
protocol.propertiesTypes = {
    sessionExpiryInterval: 'int32',
    willDelayInterval: 'int32',
    receiveMaximum: 'int16',
    maximumPacketSize: 'int32',
    topicAliasMaximum: 'int16',
    requestResponseInformation: 'byte',
    requestProblemInformation: 'byte',
    userProperties: 'pair',
    authenticationMethod: 'string',
    authenticationData: 'binary',
    payloadFormatIndicator: 'byte',
    messageExpiryInterval: 'int32',
    contentType: 'string',
    responseTopic: 'string',
    correlationData: 'binary',
    maximumQoS: 'int8',
    retainAvailable: 'byte',
    assignedClientIdentifier: 'string',
    reasonString: 'string',
    wildcardSubscriptionAvailable: 'byte',
    subscriptionIdentifiersAvailable: 'byte',
    sharedSubscriptionAvailable: 'byte',
    serverKeepAlive: 'int16',
    responseInformation: 'string',
    serverReference: 'string',
    topicAlias: 'int16',
    subscriptionIdentifier: 'var'
};
function genHeader(type) {
    return [
        0,
        1,
        2
    ].map((qos)=>{
        return [
            0,
            1
        ].map((dup)=>{
            return [
                0,
                1
            ].map((retain)=>{
                const buf = Buffer.alloc(1);
                buf.writeUInt8(protocol.codes[type] << protocol.CMD_SHIFT | (dup ? protocol.DUP_MASK : 0) | qos << protocol.QOS_SHIFT | retain, 0, true);
                return buf;
            });
        });
    });
}
/* Publish */ protocol.PUBLISH_HEADER = genHeader('publish');
/* Subscribe */ protocol.SUBSCRIBE_HEADER = genHeader('subscribe');
protocol.SUBSCRIBE_OPTIONS_QOS_MASK = 0x03;
protocol.SUBSCRIBE_OPTIONS_NL_MASK = 0x01;
protocol.SUBSCRIBE_OPTIONS_NL_SHIFT = 2;
protocol.SUBSCRIBE_OPTIONS_RAP_MASK = 0x01;
protocol.SUBSCRIBE_OPTIONS_RAP_SHIFT = 3;
protocol.SUBSCRIBE_OPTIONS_RH_MASK = 0x03;
protocol.SUBSCRIBE_OPTIONS_RH_SHIFT = 4;
protocol.SUBSCRIBE_OPTIONS_RH = [
    0x00,
    0x10,
    0x20
];
protocol.SUBSCRIBE_OPTIONS_NL = 0x04;
protocol.SUBSCRIBE_OPTIONS_RAP = 0x08;
protocol.SUBSCRIBE_OPTIONS_QOS = [
    0x00,
    0x01,
    0x02
];
/* Unsubscribe */ protocol.UNSUBSCRIBE_HEADER = genHeader('unsubscribe');
/* Confirmations */ protocol.ACKS = {
    unsuback: genHeader('unsuback'),
    puback: genHeader('puback'),
    pubcomp: genHeader('pubcomp'),
    pubrel: genHeader('pubrel'),
    pubrec: genHeader('pubrec')
};
protocol.SUBACK_HEADER = Buffer.from([
    protocol.codes.suback << protocol.CMD_SHIFT
]);
/* Protocol versions */ protocol.VERSION3 = Buffer.from([
    3
]);
protocol.VERSION4 = Buffer.from([
    4
]);
protocol.VERSION5 = Buffer.from([
    5
]);
protocol.VERSION131 = Buffer.from([
    131
]);
protocol.VERSION132 = Buffer.from([
    132
]);
/* QoS */ protocol.QOS = [
    0,
    1,
    2
].map((qos)=>{
    return Buffer.from([
        qos
    ]);
});
/* Empty packets */ protocol.EMPTY = {
    pingreq: Buffer.from([
        protocol.codes.pingreq << 4,
        0
    ]),
    pingresp: Buffer.from([
        protocol.codes.pingresp << 4,
        0
    ]),
    disconnect: Buffer.from([
        protocol.codes.disconnect << 4,
        0
    ])
};
protocol.MQTT5_PUBACK_PUBREC_CODES = {
    0x00: 'Success',
    0x10: 'No matching subscribers',
    0x80: 'Unspecified error',
    0x83: 'Implementation specific error',
    0x87: 'Not authorized',
    0x90: 'Topic Name invalid',
    0x91: 'Packet identifier in use',
    0x97: 'Quota exceeded',
    0x99: 'Payload format invalid'
};
protocol.MQTT5_PUBREL_PUBCOMP_CODES = {
    0x00: 'Success',
    0x92: 'Packet Identifier not found'
};
protocol.MQTT5_SUBACK_CODES = {
    0x00: 'Granted QoS 0',
    0x01: 'Granted QoS 1',
    0x02: 'Granted QoS 2',
    0x80: 'Unspecified error',
    0x83: 'Implementation specific error',
    0x87: 'Not authorized',
    0x8F: 'Topic Filter invalid',
    0x91: 'Packet Identifier in use',
    0x97: 'Quota exceeded',
    0x9E: 'Shared Subscriptions not supported',
    0xA1: 'Subscription Identifiers not supported',
    0xA2: 'Wildcard Subscriptions not supported'
};
protocol.MQTT5_UNSUBACK_CODES = {
    0x00: 'Success',
    0x11: 'No subscription existed',
    0x80: 'Unspecified error',
    0x83: 'Implementation specific error',
    0x87: 'Not authorized',
    0x8F: 'Topic Filter invalid',
    0x91: 'Packet Identifier in use'
};
protocol.MQTT5_DISCONNECT_CODES = {
    0x00: 'Normal disconnection',
    0x04: 'Disconnect with Will Message',
    0x80: 'Unspecified error',
    0x81: 'Malformed Packet',
    0x82: 'Protocol Error',
    0x83: 'Implementation specific error',
    0x87: 'Not authorized',
    0x89: 'Server busy',
    0x8B: 'Server shutting down',
    0x8D: 'Keep Alive timeout',
    0x8E: 'Session taken over',
    0x8F: 'Topic Filter invalid',
    0x90: 'Topic Name invalid',
    0x93: 'Receive Maximum exceeded',
    0x94: 'Topic Alias invalid',
    0x95: 'Packet too large',
    0x96: 'Message rate too high',
    0x97: 'Quota exceeded',
    0x98: 'Administrative action',
    0x99: 'Payload format invalid',
    0x9A: 'Retain not supported',
    0x9B: 'QoS not supported',
    0x9C: 'Use another server',
    0x9D: 'Server moved',
    0x9E: 'Shared Subscriptions not supported',
    0x9F: 'Connection rate exceeded',
    0xA0: 'Maximum connect time',
    0xA1: 'Subscription Identifiers not supported',
    0xA2: 'Wildcard Subscriptions not supported'
};
protocol.MQTT5_AUTH_CODES = {
    0x00: 'Success',
    0x18: 'Continue authentication',
    0x19: 'Re-authenticate'
};
}),
"[project]/node_modules/mqtt-packet/parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const bl = __turbopack_context__.r("[project]/node_modules/bl/bl.js [app-route] (ecmascript)");
const { EventEmitter } = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const Packet = __turbopack_context__.r("[project]/node_modules/mqtt-packet/packet.js [app-route] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/mqtt-packet/constants.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)")('mqtt-packet:parser');
class Parser extends EventEmitter {
    constructor(){
        super();
        this.parser = this.constructor.parser;
    }
    static parser(opt) {
        if (!(this instanceof Parser)) return new Parser().parser(opt);
        this.settings = opt || {};
        this._states = [
            '_parseHeader',
            '_parseLength',
            '_parsePayload',
            '_newPacket'
        ];
        this._resetState();
        return this;
    }
    _resetState() {
        debug('_resetState: resetting packet, error, _list, and _stateCounter');
        this.packet = new Packet();
        this.error = null;
        this._list = bl();
        this._stateCounter = 0;
    }
    parse(buf) {
        if (this.error) this._resetState();
        this._list.append(buf);
        debug('parse: current state: %s', this._states[this._stateCounter]);
        while((this.packet.length !== -1 || this._list.length > 0) && this[this._states[this._stateCounter]]() && !this.error){
            this._stateCounter++;
            debug('parse: state complete. _stateCounter is now: %d', this._stateCounter);
            debug('parse: packet.length: %d, buffer list length: %d', this.packet.length, this._list.length);
            if (this._stateCounter >= this._states.length) this._stateCounter = 0;
        }
        debug('parse: exited while loop. packet: %d, buffer list length: %d', this.packet.length, this._list.length);
        return this._list.length;
    }
    _parseHeader() {
        // There is at least one byte in the buffer
        const zero = this._list.readUInt8(0);
        const cmdIndex = zero >> constants.CMD_SHIFT;
        this.packet.cmd = constants.types[cmdIndex];
        const headerFlags = zero & 0xf;
        const requiredHeaderFlags = constants.requiredHeaderFlags[cmdIndex];
        if (requiredHeaderFlags != null && headerFlags !== requiredHeaderFlags) {
            // Where a flag bit is marked as “Reserved” in Table 2.2 - Flag Bits, it is reserved for future use and MUST be set to the value listed in that table [MQTT-2.2.2-1]. If invalid flags are received, the receiver MUST close the Network Connection [MQTT-2.2.2-2]
            return this._emitError(new Error(constants.requiredHeaderFlagsErrors[cmdIndex]));
        }
        this.packet.retain = (zero & constants.RETAIN_MASK) !== 0;
        this.packet.qos = zero >> constants.QOS_SHIFT & constants.QOS_MASK;
        if (this.packet.qos > 2) {
            return this._emitError(new Error('Packet must not have both QoS bits set to 1'));
        }
        this.packet.dup = (zero & constants.DUP_MASK) !== 0;
        debug('_parseHeader: packet: %o', this.packet);
        this._list.consume(1);
        return true;
    }
    _parseLength() {
        // There is at least one byte in the list
        const result = this._parseVarByteNum(true);
        if (result) {
            this.packet.length = result.value;
            this._list.consume(result.bytes);
        }
        debug('_parseLength %d', result.value);
        return !!result;
    }
    _parsePayload() {
        debug('_parsePayload: payload %O', this._list);
        let result = false;
        // Do we have a payload? Do we have enough data to complete the payload?
        // PINGs have no payload
        if (this.packet.length === 0 || this._list.length >= this.packet.length) {
            this._pos = 0;
            switch(this.packet.cmd){
                case 'connect':
                    this._parseConnect();
                    break;
                case 'connack':
                    this._parseConnack();
                    break;
                case 'publish':
                    this._parsePublish();
                    break;
                case 'puback':
                case 'pubrec':
                case 'pubrel':
                case 'pubcomp':
                    this._parseConfirmation();
                    break;
                case 'subscribe':
                    this._parseSubscribe();
                    break;
                case 'suback':
                    this._parseSuback();
                    break;
                case 'unsubscribe':
                    this._parseUnsubscribe();
                    break;
                case 'unsuback':
                    this._parseUnsuback();
                    break;
                case 'pingreq':
                case 'pingresp':
                    break;
                case 'disconnect':
                    this._parseDisconnect();
                    break;
                case 'auth':
                    this._parseAuth();
                    break;
                default:
                    this._emitError(new Error('Not supported'));
            }
            result = true;
        }
        debug('_parsePayload complete result: %s', result);
        return result;
    }
    _parseConnect() {
        debug('_parseConnect');
        let topic // Will topic
        ;
        let payload // Will payload
        ;
        let password // Password
        ;
        let username // Username
        ;
        const flags = {};
        const packet = this.packet;
        // Parse protocolId
        const protocolId = this._parseString();
        if (protocolId === null) return this._emitError(new Error('Cannot parse protocolId'));
        if (protocolId !== 'MQTT' && protocolId !== 'MQIsdp') {
            return this._emitError(new Error('Invalid protocolId'));
        }
        packet.protocolId = protocolId;
        // Parse constants version number
        if (this._pos >= this._list.length) return this._emitError(new Error('Packet too short'));
        packet.protocolVersion = this._list.readUInt8(this._pos);
        if (packet.protocolVersion >= 128) {
            packet.bridgeMode = true;
            packet.protocolVersion = packet.protocolVersion - 128;
        }
        if (packet.protocolVersion !== 3 && packet.protocolVersion !== 4 && packet.protocolVersion !== 5) {
            return this._emitError(new Error('Invalid protocol version'));
        }
        this._pos++;
        if (this._pos >= this._list.length) {
            return this._emitError(new Error('Packet too short'));
        }
        if (this._list.readUInt8(this._pos) & 0x1) {
            // The Server MUST validate that the reserved flag in the CONNECT Control Packet is set to zero and disconnect the Client if it is not zero [MQTT-3.1.2-3]
            return this._emitError(new Error('Connect flag bit 0 must be 0, but got 1'));
        }
        // Parse connect flags
        flags.username = this._list.readUInt8(this._pos) & constants.USERNAME_MASK;
        flags.password = this._list.readUInt8(this._pos) & constants.PASSWORD_MASK;
        flags.will = this._list.readUInt8(this._pos) & constants.WILL_FLAG_MASK;
        const willRetain = !!(this._list.readUInt8(this._pos) & constants.WILL_RETAIN_MASK);
        const willQos = (this._list.readUInt8(this._pos) & constants.WILL_QOS_MASK) >> constants.WILL_QOS_SHIFT;
        if (flags.will) {
            packet.will = {};
            packet.will.retain = willRetain;
            packet.will.qos = willQos;
        } else {
            if (willRetain) {
                return this._emitError(new Error('Will Retain Flag must be set to zero when Will Flag is set to 0'));
            }
            if (willQos) {
                return this._emitError(new Error('Will QoS must be set to zero when Will Flag is set to 0'));
            }
        }
        packet.clean = (this._list.readUInt8(this._pos) & constants.CLEAN_SESSION_MASK) !== 0;
        this._pos++;
        // Parse keepalive
        packet.keepalive = this._parseNum();
        if (packet.keepalive === -1) return this._emitError(new Error('Packet too short'));
        // parse properties
        if (packet.protocolVersion === 5) {
            const properties = this._parseProperties();
            if (Object.getOwnPropertyNames(properties).length) {
                packet.properties = properties;
            }
        }
        // Parse clientId
        const clientId = this._parseString();
        if (clientId === null) return this._emitError(new Error('Packet too short'));
        packet.clientId = clientId;
        debug('_parseConnect: packet.clientId: %s', packet.clientId);
        if (flags.will) {
            if (packet.protocolVersion === 5) {
                const willProperties = this._parseProperties();
                if (Object.getOwnPropertyNames(willProperties).length) {
                    packet.will.properties = willProperties;
                }
            }
            // Parse will topic
            topic = this._parseString();
            if (topic === null) return this._emitError(new Error('Cannot parse will topic'));
            packet.will.topic = topic;
            debug('_parseConnect: packet.will.topic: %s', packet.will.topic);
            // Parse will payload
            payload = this._parseBuffer();
            if (payload === null) return this._emitError(new Error('Cannot parse will payload'));
            packet.will.payload = payload;
            debug('_parseConnect: packet.will.paylaod: %s', packet.will.payload);
        }
        // Parse username
        if (flags.username) {
            username = this._parseString();
            if (username === null) return this._emitError(new Error('Cannot parse username'));
            packet.username = username;
            debug('_parseConnect: packet.username: %s', packet.username);
        }
        // Parse password
        if (flags.password) {
            password = this._parseBuffer();
            if (password === null) return this._emitError(new Error('Cannot parse password'));
            packet.password = password;
        }
        // need for right parse auth packet and self set up
        this.settings = packet;
        debug('_parseConnect: complete');
        return packet;
    }
    _parseConnack() {
        debug('_parseConnack');
        const packet = this.packet;
        if (this._list.length < 1) return null;
        const flags = this._list.readUInt8(this._pos++);
        if (flags > 1) {
            return this._emitError(new Error('Invalid connack flags, bits 7-1 must be set to 0'));
        }
        packet.sessionPresent = !!(flags & constants.SESSIONPRESENT_MASK);
        if (this.settings.protocolVersion === 5) {
            if (this._list.length >= 2) {
                packet.reasonCode = this._list.readUInt8(this._pos++);
            } else {
                packet.reasonCode = 0;
            }
        } else {
            if (this._list.length < 2) return null;
            packet.returnCode = this._list.readUInt8(this._pos++);
        }
        if (packet.returnCode === -1 || packet.reasonCode === -1) return this._emitError(new Error('Cannot parse return code'));
        // mqtt 5 properties
        if (this.settings.protocolVersion === 5) {
            const properties = this._parseProperties();
            if (Object.getOwnPropertyNames(properties).length) {
                packet.properties = properties;
            }
        }
        debug('_parseConnack: complete');
    }
    _parsePublish() {
        debug('_parsePublish');
        const packet = this.packet;
        packet.topic = this._parseString();
        if (packet.topic === null) return this._emitError(new Error('Cannot parse topic'));
        // Parse messageId
        if (packet.qos > 0) {
            if (!this._parseMessageId()) {
                return;
            }
        }
        // Properties mqtt 5
        if (this.settings.protocolVersion === 5) {
            const properties = this._parseProperties();
            if (Object.getOwnPropertyNames(properties).length) {
                packet.properties = properties;
            }
        }
        packet.payload = this._list.slice(this._pos, packet.length);
        debug('_parsePublish: payload from buffer list: %o', packet.payload);
    }
    _parseSubscribe() {
        debug('_parseSubscribe');
        const packet = this.packet;
        let topic;
        let options;
        let qos;
        let rh;
        let rap;
        let nl;
        let subscription;
        packet.subscriptions = [];
        if (!this._parseMessageId()) {
            return;
        }
        // Properties mqtt 5
        if (this.settings.protocolVersion === 5) {
            const properties = this._parseProperties();
            if (Object.getOwnPropertyNames(properties).length) {
                packet.properties = properties;
            }
        }
        if (packet.length <= 0) {
            return this._emitError(new Error('Malformed subscribe, no payload specified'));
        }
        while(this._pos < packet.length){
            // Parse topic
            topic = this._parseString();
            if (topic === null) return this._emitError(new Error('Cannot parse topic'));
            if (this._pos >= packet.length) return this._emitError(new Error('Malformed Subscribe Payload'));
            options = this._parseByte();
            if (this.settings.protocolVersion === 5) {
                if (options & 0xc0) {
                    return this._emitError(new Error('Invalid subscribe topic flag bits, bits 7-6 must be 0'));
                }
            } else {
                if (options & 0xfc) {
                    return this._emitError(new Error('Invalid subscribe topic flag bits, bits 7-2 must be 0'));
                }
            }
            qos = options & constants.SUBSCRIBE_OPTIONS_QOS_MASK;
            if (qos > 2) {
                return this._emitError(new Error('Invalid subscribe QoS, must be <= 2'));
            }
            nl = (options >> constants.SUBSCRIBE_OPTIONS_NL_SHIFT & constants.SUBSCRIBE_OPTIONS_NL_MASK) !== 0;
            rap = (options >> constants.SUBSCRIBE_OPTIONS_RAP_SHIFT & constants.SUBSCRIBE_OPTIONS_RAP_MASK) !== 0;
            rh = options >> constants.SUBSCRIBE_OPTIONS_RH_SHIFT & constants.SUBSCRIBE_OPTIONS_RH_MASK;
            if (rh > 2) {
                return this._emitError(new Error('Invalid retain handling, must be <= 2'));
            }
            subscription = {
                topic,
                qos
            };
            // mqtt 5 options
            if (this.settings.protocolVersion === 5) {
                subscription.nl = nl;
                subscription.rap = rap;
                subscription.rh = rh;
            } else if (this.settings.bridgeMode) {
                subscription.rh = 0;
                subscription.rap = true;
                subscription.nl = true;
            }
            // Push pair to subscriptions
            debug('_parseSubscribe: push subscription `%s` to subscription', subscription);
            packet.subscriptions.push(subscription);
        }
    }
    _parseSuback() {
        debug('_parseSuback');
        const packet = this.packet;
        this.packet.granted = [];
        if (!this._parseMessageId()) {
            return;
        }
        // Properties mqtt 5
        if (this.settings.protocolVersion === 5) {
            const properties = this._parseProperties();
            if (Object.getOwnPropertyNames(properties).length) {
                packet.properties = properties;
            }
        }
        if (packet.length <= 0) {
            return this._emitError(new Error('Malformed suback, no payload specified'));
        }
        // Parse granted QoSes
        while(this._pos < this.packet.length){
            const code = this._list.readUInt8(this._pos++);
            if (this.settings.protocolVersion === 5) {
                if (!constants.MQTT5_SUBACK_CODES[code]) {
                    return this._emitError(new Error('Invalid suback code'));
                }
            } else {
                if (code > 2 && code !== 0x80) {
                    return this._emitError(new Error('Invalid suback QoS, must be 0, 1, 2 or 128'));
                }
            }
            this.packet.granted.push(code);
        }
    }
    _parseUnsubscribe() {
        debug('_parseUnsubscribe');
        const packet = this.packet;
        packet.unsubscriptions = [];
        // Parse messageId
        if (!this._parseMessageId()) {
            return;
        }
        // Properties mqtt 5
        if (this.settings.protocolVersion === 5) {
            const properties = this._parseProperties();
            if (Object.getOwnPropertyNames(properties).length) {
                packet.properties = properties;
            }
        }
        if (packet.length <= 0) {
            return this._emitError(new Error('Malformed unsubscribe, no payload specified'));
        }
        while(this._pos < packet.length){
            // Parse topic
            const topic = this._parseString();
            if (topic === null) return this._emitError(new Error('Cannot parse topic'));
            // Push topic to unsubscriptions
            debug('_parseUnsubscribe: push topic `%s` to unsubscriptions', topic);
            packet.unsubscriptions.push(topic);
        }
    }
    _parseUnsuback() {
        debug('_parseUnsuback');
        const packet = this.packet;
        if (!this._parseMessageId()) return this._emitError(new Error('Cannot parse messageId'));
        if ((this.settings.protocolVersion === 3 || this.settings.protocolVersion === 4) && packet.length !== 2) {
            return this._emitError(new Error('Malformed unsuback, payload length must be 2'));
        }
        if (packet.length <= 0) {
            return this._emitError(new Error('Malformed unsuback, no payload specified'));
        }
        // Properties mqtt 5
        if (this.settings.protocolVersion === 5) {
            const properties = this._parseProperties();
            if (Object.getOwnPropertyNames(properties).length) {
                packet.properties = properties;
            }
            // Parse granted QoSes
            packet.granted = [];
            while(this._pos < this.packet.length){
                const code = this._list.readUInt8(this._pos++);
                if (!constants.MQTT5_UNSUBACK_CODES[code]) {
                    return this._emitError(new Error('Invalid unsuback code'));
                }
                this.packet.granted.push(code);
            }
        }
    }
    // parse packets like puback, pubrec, pubrel, pubcomp
    _parseConfirmation() {
        debug('_parseConfirmation: packet.cmd: `%s`', this.packet.cmd);
        const packet = this.packet;
        this._parseMessageId();
        if (this.settings.protocolVersion === 5) {
            if (packet.length > 2) {
                // response code
                packet.reasonCode = this._parseByte();
                switch(this.packet.cmd){
                    case 'puback':
                    case 'pubrec':
                        if (!constants.MQTT5_PUBACK_PUBREC_CODES[packet.reasonCode]) {
                            return this._emitError(new Error('Invalid ' + this.packet.cmd + ' reason code'));
                        }
                        break;
                    case 'pubrel':
                    case 'pubcomp':
                        if (!constants.MQTT5_PUBREL_PUBCOMP_CODES[packet.reasonCode]) {
                            return this._emitError(new Error('Invalid ' + this.packet.cmd + ' reason code'));
                        }
                        break;
                }
                debug('_parseConfirmation: packet.reasonCode `%d`', packet.reasonCode);
            } else {
                packet.reasonCode = 0;
            }
            if (packet.length > 3) {
                // properies mqtt 5
                const properties = this._parseProperties();
                if (Object.getOwnPropertyNames(properties).length) {
                    packet.properties = properties;
                }
            }
        }
        return true;
    }
    // parse disconnect packet
    _parseDisconnect() {
        const packet = this.packet;
        debug('_parseDisconnect');
        if (this.settings.protocolVersion === 5) {
            // response code
            if (this._list.length > 0) {
                packet.reasonCode = this._parseByte();
                if (!constants.MQTT5_DISCONNECT_CODES[packet.reasonCode]) {
                    this._emitError(new Error('Invalid disconnect reason code'));
                }
            } else {
                packet.reasonCode = 0;
            }
            // properies mqtt 5
            const properties = this._parseProperties();
            if (Object.getOwnPropertyNames(properties).length) {
                packet.properties = properties;
            }
        }
        debug('_parseDisconnect result: true');
        return true;
    }
    // parse auth packet
    _parseAuth() {
        debug('_parseAuth');
        const packet = this.packet;
        if (this.settings.protocolVersion !== 5) {
            return this._emitError(new Error('Not supported auth packet for this version MQTT'));
        }
        // response code
        packet.reasonCode = this._parseByte();
        if (!constants.MQTT5_AUTH_CODES[packet.reasonCode]) {
            return this._emitError(new Error('Invalid auth reason code'));
        }
        // properies mqtt 5
        const properties = this._parseProperties();
        if (Object.getOwnPropertyNames(properties).length) {
            packet.properties = properties;
        }
        debug('_parseAuth: result: true');
        return true;
    }
    _parseMessageId() {
        const packet = this.packet;
        packet.messageId = this._parseNum();
        if (packet.messageId === null) {
            this._emitError(new Error('Cannot parse messageId'));
            return false;
        }
        debug('_parseMessageId: packet.messageId %d', packet.messageId);
        return true;
    }
    _parseString(maybeBuffer) {
        const length = this._parseNum();
        const end = length + this._pos;
        if (length === -1 || end > this._list.length || end > this.packet.length) return null;
        const result = this._list.toString('utf8', this._pos, end);
        this._pos += length;
        debug('_parseString: result: %s', result);
        return result;
    }
    _parseStringPair() {
        debug('_parseStringPair');
        return {
            name: this._parseString(),
            value: this._parseString()
        };
    }
    _parseBuffer() {
        const length = this._parseNum();
        const end = length + this._pos;
        if (length === -1 || end > this._list.length || end > this.packet.length) return null;
        const result = this._list.slice(this._pos, end);
        this._pos += length;
        debug('_parseBuffer: result: %o', result);
        return result;
    }
    _parseNum() {
        if (this._list.length - this._pos < 2) return -1;
        const result = this._list.readUInt16BE(this._pos);
        this._pos += 2;
        debug('_parseNum: result: %s', result);
        return result;
    }
    _parse4ByteNum() {
        if (this._list.length - this._pos < 4) return -1;
        const result = this._list.readUInt32BE(this._pos);
        this._pos += 4;
        debug('_parse4ByteNum: result: %s', result);
        return result;
    }
    _parseVarByteNum(fullInfoFlag) {
        debug('_parseVarByteNum');
        const maxBytes = 4;
        let bytes = 0;
        let mul = 1;
        let value = 0;
        let result = false;
        let current;
        const padding = this._pos ? this._pos : 0;
        while(bytes < maxBytes && padding + bytes < this._list.length){
            current = this._list.readUInt8(padding + bytes++);
            value += mul * (current & constants.VARBYTEINT_MASK);
            mul *= 0x80;
            if ((current & constants.VARBYTEINT_FIN_MASK) === 0) {
                result = true;
                break;
            }
            if (this._list.length <= bytes) {
                break;
            }
        }
        if (!result && bytes === maxBytes && this._list.length >= bytes) {
            this._emitError(new Error('Invalid variable byte integer'));
        }
        if (padding) {
            this._pos += bytes;
        }
        if (result) {
            if (fullInfoFlag) {
                result = {
                    bytes,
                    value
                };
            } else {
                result = value;
            }
        } else {
            result = false;
        }
        debug('_parseVarByteNum: result: %o', result);
        return result;
    }
    _parseByte() {
        let result;
        if (this._pos < this._list.length) {
            result = this._list.readUInt8(this._pos);
            this._pos++;
        }
        debug('_parseByte: result: %o', result);
        return result;
    }
    _parseByType(type) {
        debug('_parseByType: type: %s', type);
        switch(type){
            case 'byte':
                {
                    return this._parseByte() !== 0;
                }
            case 'int8':
                {
                    return this._parseByte();
                }
            case 'int16':
                {
                    return this._parseNum();
                }
            case 'int32':
                {
                    return this._parse4ByteNum();
                }
            case 'var':
                {
                    return this._parseVarByteNum();
                }
            case 'string':
                {
                    return this._parseString();
                }
            case 'pair':
                {
                    return this._parseStringPair();
                }
            case 'binary':
                {
                    return this._parseBuffer();
                }
        }
    }
    _parseProperties() {
        debug('_parseProperties');
        const length = this._parseVarByteNum();
        const start = this._pos;
        const end = start + length;
        const result = {};
        while(this._pos < end){
            const type = this._parseByte();
            if (!type) {
                this._emitError(new Error('Cannot parse property code type'));
                return false;
            }
            const name = constants.propertiesCodes[type];
            if (!name) {
                this._emitError(new Error('Unknown property'));
                return false;
            }
            // user properties process
            if (name === 'userProperties') {
                if (!result[name]) {
                    result[name] = Object.create(null);
                }
                const currentUserProperty = this._parseByType(constants.propertiesTypes[name]);
                if (result[name][currentUserProperty.name]) {
                    if (Array.isArray(result[name][currentUserProperty.name])) {
                        result[name][currentUserProperty.name].push(currentUserProperty.value);
                    } else {
                        const currentValue = result[name][currentUserProperty.name];
                        result[name][currentUserProperty.name] = [
                            currentValue
                        ];
                        result[name][currentUserProperty.name].push(currentUserProperty.value);
                    }
                } else {
                    result[name][currentUserProperty.name] = currentUserProperty.value;
                }
                continue;
            }
            if (result[name]) {
                if (Array.isArray(result[name])) {
                    result[name].push(this._parseByType(constants.propertiesTypes[name]));
                } else {
                    result[name] = [
                        result[name]
                    ];
                    result[name].push(this._parseByType(constants.propertiesTypes[name]));
                }
            } else {
                result[name] = this._parseByType(constants.propertiesTypes[name]);
            }
        }
        return result;
    }
    _newPacket() {
        debug('_newPacket');
        if (this.packet) {
            this._list.consume(this.packet.length);
            debug('_newPacket: parser emit packet: packet.cmd: %s, packet.payload: %s, packet.length: %d', this.packet.cmd, this.packet.payload, this.packet.length);
            this.emit('packet', this.packet);
        }
        debug('_newPacket: new packet');
        this.packet = new Packet();
        this._pos = 0;
        return true;
    }
    _emitError(err) {
        debug('_emitError', err);
        this.error = err;
        this.emit('error', err);
    }
}
module.exports = Parser;
}),
"[project]/node_modules/mqtt-packet/numbers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { Buffer } = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
const max = 65536;
const cache = {};
// in node 6 Buffer.subarray returns a Uint8Array instead of a Buffer
// later versions return a Buffer
// alternative is Buffer.slice but that creates a new buffer
// creating new buffers takes time
// SubOk is only false on node < 8
const SubOk = Buffer.isBuffer(Buffer.from([
    1,
    2
]).subarray(0, 1));
function generateBuffer(i) {
    const buffer = Buffer.allocUnsafe(2);
    buffer.writeUInt8(i >> 8, 0);
    buffer.writeUInt8(i & 0x00FF, 0 + 1);
    return buffer;
}
function generateCache() {
    for(let i = 0; i < max; i++){
        cache[i] = generateBuffer(i);
    }
}
function genBufVariableByteInt(num) {
    const maxLength = 4 // max 4 bytes
    ;
    let digit = 0;
    let pos = 0;
    const buffer = Buffer.allocUnsafe(maxLength);
    do {
        digit = num % 128 | 0;
        num = num / 128 | 0;
        if (num > 0) digit = digit | 0x80;
        buffer.writeUInt8(digit, pos++);
    }while (num > 0 && pos < maxLength)
    if (num > 0) {
        pos = 0;
    }
    return SubOk ? buffer.subarray(0, pos) : buffer.slice(0, pos);
}
function generate4ByteBuffer(num) {
    const buffer = Buffer.allocUnsafe(4);
    buffer.writeUInt32BE(num, 0);
    return buffer;
}
module.exports = {
    cache,
    generateCache,
    generateNumber: generateBuffer,
    genBufVariableByteInt,
    generate4ByteBuffer
};
}),
"[project]/node_modules/mqtt-packet/writeToStream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const protocol = __turbopack_context__.r("[project]/node_modules/mqtt-packet/constants.js [app-route] (ecmascript)");
const { Buffer } = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
const empty = Buffer.allocUnsafe(0);
const zeroBuf = Buffer.from([
    0
]);
const numbers = __turbopack_context__.r("[project]/node_modules/mqtt-packet/numbers.js [app-route] (ecmascript)");
const nextTick = __turbopack_context__.r("[project]/node_modules/process-nextick-args/index.js [app-route] (ecmascript)").nextTick;
const debug = __turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)")('mqtt-packet:writeToStream');
const numCache = numbers.cache;
const generateNumber = numbers.generateNumber;
const generateCache = numbers.generateCache;
const genBufVariableByteInt = numbers.genBufVariableByteInt;
const generate4ByteBuffer = numbers.generate4ByteBuffer;
let writeNumber = writeNumberCached;
let toGenerate = true;
function generate(packet, stream, opts) {
    debug('generate called');
    if (stream.cork) {
        stream.cork();
        nextTick(uncork, stream);
    }
    if (toGenerate) {
        toGenerate = false;
        generateCache();
    }
    debug('generate: packet.cmd: %s', packet.cmd);
    switch(packet.cmd){
        case 'connect':
            return connect(packet, stream, opts);
        case 'connack':
            return connack(packet, stream, opts);
        case 'publish':
            return publish(packet, stream, opts);
        case 'puback':
        case 'pubrec':
        case 'pubrel':
        case 'pubcomp':
            return confirmation(packet, stream, opts);
        case 'subscribe':
            return subscribe(packet, stream, opts);
        case 'suback':
            return suback(packet, stream, opts);
        case 'unsubscribe':
            return unsubscribe(packet, stream, opts);
        case 'unsuback':
            return unsuback(packet, stream, opts);
        case 'pingreq':
        case 'pingresp':
            return emptyPacket(packet, stream, opts);
        case 'disconnect':
            return disconnect(packet, stream, opts);
        case 'auth':
            return auth(packet, stream, opts);
        default:
            stream.destroy(new Error('Unknown command'));
            return false;
    }
}
/**
 * Controls numbers cache.
 * Set to "false" to allocate buffers on-the-flight instead of pre-generated cache
 */ Object.defineProperty(generate, 'cacheNumbers', {
    get () {
        return writeNumber === writeNumberCached;
    },
    set (value) {
        if (value) {
            if (!numCache || Object.keys(numCache).length === 0) toGenerate = true;
            writeNumber = writeNumberCached;
        } else {
            toGenerate = false;
            writeNumber = writeNumberGenerated;
        }
    }
});
function uncork(stream) {
    stream.uncork();
}
function connect(packet, stream, opts) {
    const settings = packet || {};
    const protocolId = settings.protocolId || 'MQTT';
    let protocolVersion = settings.protocolVersion || 4;
    const will = settings.will;
    let clean = settings.clean;
    const keepalive = settings.keepalive || 0;
    const clientId = settings.clientId || '';
    const username = settings.username;
    const password = settings.password;
    /* mqtt5 new oprions */ const properties = settings.properties;
    if (clean === undefined) clean = true;
    let length = 0;
    // Must be a string and non-falsy
    if (!protocolId || typeof protocolId !== 'string' && !Buffer.isBuffer(protocolId)) {
        stream.destroy(new Error('Invalid protocolId'));
        return false;
    } else length += protocolId.length + 2;
    // Must be 3 or 4 or 5
    if (protocolVersion !== 3 && protocolVersion !== 4 && protocolVersion !== 5) {
        stream.destroy(new Error('Invalid protocol version'));
        return false;
    } else length += 1;
    // ClientId might be omitted in 3.1.1 and 5, but only if cleanSession is set to 1
    if ((typeof clientId === 'string' || Buffer.isBuffer(clientId)) && (clientId || protocolVersion >= 4) && (clientId || clean)) {
        length += Buffer.byteLength(clientId) + 2;
    } else {
        if (protocolVersion < 4) {
            stream.destroy(new Error('clientId must be supplied before 3.1.1'));
            return false;
        }
        if (clean * 1 === 0) {
            stream.destroy(new Error('clientId must be given if cleanSession set to 0'));
            return false;
        }
    }
    // Must be a two byte number
    if (typeof keepalive !== 'number' || keepalive < 0 || keepalive > 65535 || keepalive % 1 !== 0) {
        stream.destroy(new Error('Invalid keepalive'));
        return false;
    } else length += 2;
    // Connect flags
    length += 1;
    let propertiesData;
    let willProperties;
    // Properties
    if (protocolVersion === 5) {
        propertiesData = getProperties(stream, properties);
        if (!propertiesData) {
            return false;
        }
        length += propertiesData.length;
    }
    // If will exists...
    if (will) {
        // It must be an object
        if (typeof will !== 'object') {
            stream.destroy(new Error('Invalid will'));
            return false;
        }
        // It must have topic typeof string
        if (!will.topic || typeof will.topic !== 'string') {
            stream.destroy(new Error('Invalid will topic'));
            return false;
        } else {
            length += Buffer.byteLength(will.topic) + 2;
        }
        // Payload
        length += 2; // payload length
        if (will.payload) {
            if (will.payload.length >= 0) {
                if (typeof will.payload === 'string') {
                    length += Buffer.byteLength(will.payload);
                } else {
                    length += will.payload.length;
                }
            } else {
                stream.destroy(new Error('Invalid will payload'));
                return false;
            }
        }
        // will properties
        willProperties = {};
        if (protocolVersion === 5) {
            willProperties = getProperties(stream, will.properties);
            if (!willProperties) {
                return false;
            }
            length += willProperties.length;
        }
    }
    // Username
    let providedUsername = false;
    if (username != null) {
        if (isStringOrBuffer(username)) {
            providedUsername = true;
            length += Buffer.byteLength(username) + 2;
        } else {
            stream.destroy(new Error('Invalid username'));
            return false;
        }
    }
    // Password
    if (password != null) {
        if (!providedUsername) {
            stream.destroy(new Error('Username is required to use password'));
            return false;
        }
        if (isStringOrBuffer(password)) {
            length += byteLength(password) + 2;
        } else {
            stream.destroy(new Error('Invalid password'));
            return false;
        }
    }
    // Generate header
    stream.write(protocol.CONNECT_HEADER);
    // Generate length
    writeVarByteInt(stream, length);
    // Generate protocol ID
    writeStringOrBuffer(stream, protocolId);
    if (settings.bridgeMode) {
        protocolVersion += 128;
    }
    stream.write(protocolVersion === 131 ? protocol.VERSION131 : protocolVersion === 132 ? protocol.VERSION132 : protocolVersion === 4 ? protocol.VERSION4 : protocolVersion === 5 ? protocol.VERSION5 : protocol.VERSION3);
    // Connect flags
    let flags = 0;
    flags |= username != null ? protocol.USERNAME_MASK : 0;
    flags |= password != null ? protocol.PASSWORD_MASK : 0;
    flags |= will && will.retain ? protocol.WILL_RETAIN_MASK : 0;
    flags |= will && will.qos ? will.qos << protocol.WILL_QOS_SHIFT : 0;
    flags |= will ? protocol.WILL_FLAG_MASK : 0;
    flags |= clean ? protocol.CLEAN_SESSION_MASK : 0;
    stream.write(Buffer.from([
        flags
    ]));
    // Keepalive
    writeNumber(stream, keepalive);
    // Properties
    if (protocolVersion === 5) {
        propertiesData.write();
    }
    // Client ID
    writeStringOrBuffer(stream, clientId);
    // Will
    if (will) {
        if (protocolVersion === 5) {
            willProperties.write();
        }
        writeString(stream, will.topic);
        writeStringOrBuffer(stream, will.payload);
    }
    // Username and password
    if (username != null) {
        writeStringOrBuffer(stream, username);
    }
    if (password != null) {
        writeStringOrBuffer(stream, password);
    }
    // This is a small packet that happens only once on a stream
    // We assume the stream is always free to receive more data after this
    return true;
}
function connack(packet, stream, opts) {
    const version = opts ? opts.protocolVersion : 4;
    const settings = packet || {};
    const rc = version === 5 ? settings.reasonCode : settings.returnCode;
    const properties = settings.properties;
    let length = 2 // length of rc and sessionHeader
    ;
    // Check return code
    if (typeof rc !== 'number') {
        stream.destroy(new Error('Invalid return code'));
        return false;
    }
    // mqtt5 properties
    let propertiesData = null;
    if (version === 5) {
        propertiesData = getProperties(stream, properties);
        if (!propertiesData) {
            return false;
        }
        length += propertiesData.length;
    }
    stream.write(protocol.CONNACK_HEADER);
    // length
    writeVarByteInt(stream, length);
    stream.write(settings.sessionPresent ? protocol.SESSIONPRESENT_HEADER : zeroBuf);
    stream.write(Buffer.from([
        rc
    ]));
    if (propertiesData != null) {
        propertiesData.write();
    }
    return true;
}
function publish(packet, stream, opts) {
    debug('publish: packet: %o', packet);
    const version = opts ? opts.protocolVersion : 4;
    const settings = packet || {};
    const qos = settings.qos || 0;
    const retain = settings.retain ? protocol.RETAIN_MASK : 0;
    const topic = settings.topic;
    const payload = settings.payload || empty;
    const id = settings.messageId;
    const properties = settings.properties;
    let length = 0;
    // Topic must be a non-empty string or Buffer
    if (typeof topic === 'string') length += Buffer.byteLength(topic) + 2;
    else if (Buffer.isBuffer(topic)) length += topic.length + 2;
    else {
        stream.destroy(new Error('Invalid topic'));
        return false;
    }
    // Get the payload length
    if (!Buffer.isBuffer(payload)) length += Buffer.byteLength(payload);
    else length += payload.length;
    // Message ID must a number if qos > 0
    if (qos && typeof id !== 'number') {
        stream.destroy(new Error('Invalid messageId'));
        return false;
    } else if (qos) length += 2;
    // mqtt5 properties
    let propertiesData = null;
    if (version === 5) {
        propertiesData = getProperties(stream, properties);
        if (!propertiesData) {
            return false;
        }
        length += propertiesData.length;
    }
    // Header
    stream.write(protocol.PUBLISH_HEADER[qos][settings.dup ? 1 : 0][retain ? 1 : 0]);
    // Remaining length
    writeVarByteInt(stream, length);
    // Topic
    writeNumber(stream, byteLength(topic));
    stream.write(topic);
    // Message ID
    if (qos > 0) writeNumber(stream, id);
    // Properties
    if (propertiesData != null) {
        propertiesData.write();
    }
    // Payload
    debug('publish: payload: %o', payload);
    return stream.write(payload);
}
/* Puback, pubrec, pubrel and pubcomp */ function confirmation(packet, stream, opts) {
    const version = opts ? opts.protocolVersion : 4;
    const settings = packet || {};
    const type = settings.cmd || 'puback';
    const id = settings.messageId;
    const dup = settings.dup && type === 'pubrel' ? protocol.DUP_MASK : 0;
    let qos = 0;
    const reasonCode = settings.reasonCode;
    const properties = settings.properties;
    let length = version === 5 ? 3 : 2;
    if (type === 'pubrel') qos = 1;
    // Check message ID
    if (typeof id !== 'number') {
        stream.destroy(new Error('Invalid messageId'));
        return false;
    }
    // properies mqtt 5
    let propertiesData = null;
    if (version === 5) {
        // Confirm should not add empty property length with no properties (rfc 3.4.2.2.1)
        if (typeof properties === 'object') {
            propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length);
            if (!propertiesData) {
                return false;
            }
            length += propertiesData.length;
        }
    }
    // Header
    stream.write(protocol.ACKS[type][qos][dup][0]);
    // Length === 3 is only true of version === 5 and no properties; therefore if reasonCode === 0 we are allowed to skip both bytes - but if we write the reason code we also have to write property length [MQTT-3.4.2-1].
    if (length === 3) length += reasonCode !== 0 ? 1 : -1;
    writeVarByteInt(stream, length);
    // Message ID
    writeNumber(stream, id);
    // reason code in header - but only if it couldn't be omitted - indicated by length !== 2.
    if (version === 5 && length !== 2) {
        stream.write(Buffer.from([
            reasonCode
        ]));
    }
    // properties mqtt 5
    if (propertiesData !== null) {
        propertiesData.write();
    } else {
        if (length === 4) {
            // we have no properties but have written a reason code - so we need to indicate empty properties by filling in a zero.
            stream.write(Buffer.from([
                0
            ]));
        }
    }
    return true;
}
function subscribe(packet, stream, opts) {
    debug('subscribe: packet: ');
    const version = opts ? opts.protocolVersion : 4;
    const settings = packet || {};
    const dup = settings.dup ? protocol.DUP_MASK : 0;
    const id = settings.messageId;
    const subs = settings.subscriptions;
    const properties = settings.properties;
    let length = 0;
    // Check message ID
    if (typeof id !== 'number') {
        stream.destroy(new Error('Invalid messageId'));
        return false;
    } else length += 2;
    // properies mqtt 5
    let propertiesData = null;
    if (version === 5) {
        propertiesData = getProperties(stream, properties);
        if (!propertiesData) {
            return false;
        }
        length += propertiesData.length;
    }
    // Check subscriptions
    if (typeof subs === 'object' && subs.length) {
        for(let i = 0; i < subs.length; i += 1){
            const itopic = subs[i].topic;
            const iqos = subs[i].qos;
            if (typeof itopic !== 'string') {
                stream.destroy(new Error('Invalid subscriptions - invalid topic'));
                return false;
            }
            if (typeof iqos !== 'number') {
                stream.destroy(new Error('Invalid subscriptions - invalid qos'));
                return false;
            }
            if (version === 5) {
                const nl = subs[i].nl || false;
                if (typeof nl !== 'boolean') {
                    stream.destroy(new Error('Invalid subscriptions - invalid No Local'));
                    return false;
                }
                const rap = subs[i].rap || false;
                if (typeof rap !== 'boolean') {
                    stream.destroy(new Error('Invalid subscriptions - invalid Retain as Published'));
                    return false;
                }
                const rh = subs[i].rh || 0;
                if (typeof rh !== 'number' || rh > 2) {
                    stream.destroy(new Error('Invalid subscriptions - invalid Retain Handling'));
                    return false;
                }
            }
            length += Buffer.byteLength(itopic) + 2 + 1;
        }
    } else {
        stream.destroy(new Error('Invalid subscriptions'));
        return false;
    }
    // Generate header
    debug('subscribe: writing to stream: %o', protocol.SUBSCRIBE_HEADER);
    stream.write(protocol.SUBSCRIBE_HEADER[1][dup ? 1 : 0][0]);
    // Generate length
    writeVarByteInt(stream, length);
    // Generate message ID
    writeNumber(stream, id);
    // properies mqtt 5
    if (propertiesData !== null) {
        propertiesData.write();
    }
    let result = true;
    // Generate subs
    for (const sub of subs){
        const jtopic = sub.topic;
        const jqos = sub.qos;
        const jnl = +sub.nl;
        const jrap = +sub.rap;
        const jrh = sub.rh;
        let joptions;
        // Write topic string
        writeString(stream, jtopic);
        // options process
        joptions = protocol.SUBSCRIBE_OPTIONS_QOS[jqos];
        if (version === 5) {
            joptions |= jnl ? protocol.SUBSCRIBE_OPTIONS_NL : 0;
            joptions |= jrap ? protocol.SUBSCRIBE_OPTIONS_RAP : 0;
            joptions |= jrh ? protocol.SUBSCRIBE_OPTIONS_RH[jrh] : 0;
        }
        // Write options
        result = stream.write(Buffer.from([
            joptions
        ]));
    }
    return result;
}
function suback(packet, stream, opts) {
    const version = opts ? opts.protocolVersion : 4;
    const settings = packet || {};
    const id = settings.messageId;
    const granted = settings.granted;
    const properties = settings.properties;
    let length = 0;
    // Check message ID
    if (typeof id !== 'number') {
        stream.destroy(new Error('Invalid messageId'));
        return false;
    } else length += 2;
    // Check granted qos vector
    if (typeof granted === 'object' && granted.length) {
        for(let i = 0; i < granted.length; i += 1){
            if (typeof granted[i] !== 'number') {
                stream.destroy(new Error('Invalid qos vector'));
                return false;
            }
            length += 1;
        }
    } else {
        stream.destroy(new Error('Invalid qos vector'));
        return false;
    }
    // properies mqtt 5
    let propertiesData = null;
    if (version === 5) {
        propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length);
        if (!propertiesData) {
            return false;
        }
        length += propertiesData.length;
    }
    // header
    stream.write(protocol.SUBACK_HEADER);
    // Length
    writeVarByteInt(stream, length);
    // Message ID
    writeNumber(stream, id);
    // properies mqtt 5
    if (propertiesData !== null) {
        propertiesData.write();
    }
    return stream.write(Buffer.from(granted));
}
function unsubscribe(packet, stream, opts) {
    const version = opts ? opts.protocolVersion : 4;
    const settings = packet || {};
    const id = settings.messageId;
    const dup = settings.dup ? protocol.DUP_MASK : 0;
    const unsubs = settings.unsubscriptions;
    const properties = settings.properties;
    let length = 0;
    // Check message ID
    if (typeof id !== 'number') {
        stream.destroy(new Error('Invalid messageId'));
        return false;
    } else {
        length += 2;
    }
    // Check unsubs
    if (typeof unsubs === 'object' && unsubs.length) {
        for(let i = 0; i < unsubs.length; i += 1){
            if (typeof unsubs[i] !== 'string') {
                stream.destroy(new Error('Invalid unsubscriptions'));
                return false;
            }
            length += Buffer.byteLength(unsubs[i]) + 2;
        }
    } else {
        stream.destroy(new Error('Invalid unsubscriptions'));
        return false;
    }
    // properies mqtt 5
    let propertiesData = null;
    if (version === 5) {
        propertiesData = getProperties(stream, properties);
        if (!propertiesData) {
            return false;
        }
        length += propertiesData.length;
    }
    // Header
    stream.write(protocol.UNSUBSCRIBE_HEADER[1][dup ? 1 : 0][0]);
    // Length
    writeVarByteInt(stream, length);
    // Message ID
    writeNumber(stream, id);
    // properies mqtt 5
    if (propertiesData !== null) {
        propertiesData.write();
    }
    // Unsubs
    let result = true;
    for(let j = 0; j < unsubs.length; j++){
        result = writeString(stream, unsubs[j]);
    }
    return result;
}
function unsuback(packet, stream, opts) {
    const version = opts ? opts.protocolVersion : 4;
    const settings = packet || {};
    const id = settings.messageId;
    const dup = settings.dup ? protocol.DUP_MASK : 0;
    const granted = settings.granted;
    const properties = settings.properties;
    const type = settings.cmd;
    const qos = 0;
    let length = 2;
    // Check message ID
    if (typeof id !== 'number') {
        stream.destroy(new Error('Invalid messageId'));
        return false;
    }
    // Check granted
    if (version === 5) {
        if (typeof granted === 'object' && granted.length) {
            for(let i = 0; i < granted.length; i += 1){
                if (typeof granted[i] !== 'number') {
                    stream.destroy(new Error('Invalid qos vector'));
                    return false;
                }
                length += 1;
            }
        } else {
            stream.destroy(new Error('Invalid qos vector'));
            return false;
        }
    }
    // properies mqtt 5
    let propertiesData = null;
    if (version === 5) {
        propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length);
        if (!propertiesData) {
            return false;
        }
        length += propertiesData.length;
    }
    // Header
    stream.write(protocol.ACKS[type][qos][dup][0]);
    // Length
    writeVarByteInt(stream, length);
    // Message ID
    writeNumber(stream, id);
    // properies mqtt 5
    if (propertiesData !== null) {
        propertiesData.write();
    }
    // payload
    if (version === 5) {
        stream.write(Buffer.from(granted));
    }
    return true;
}
function emptyPacket(packet, stream, opts) {
    return stream.write(protocol.EMPTY[packet.cmd]);
}
function disconnect(packet, stream, opts) {
    const version = opts ? opts.protocolVersion : 4;
    const settings = packet || {};
    const reasonCode = settings.reasonCode;
    const properties = settings.properties;
    let length = version === 5 ? 1 : 0;
    // properies mqtt 5
    let propertiesData = null;
    if (version === 5) {
        propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length);
        if (!propertiesData) {
            return false;
        }
        length += propertiesData.length;
    }
    // Header
    stream.write(Buffer.from([
        protocol.codes.disconnect << 4
    ]));
    // Length
    writeVarByteInt(stream, length);
    // reason code in header
    if (version === 5) {
        stream.write(Buffer.from([
            reasonCode
        ]));
    }
    // properies mqtt 5
    if (propertiesData !== null) {
        propertiesData.write();
    }
    return true;
}
function auth(packet, stream, opts) {
    const version = opts ? opts.protocolVersion : 4;
    const settings = packet || {};
    const reasonCode = settings.reasonCode;
    const properties = settings.properties;
    let length = version === 5 ? 1 : 0;
    if (version !== 5) stream.destroy(new Error('Invalid mqtt version for auth packet'));
    // properies mqtt 5
    const propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length);
    if (!propertiesData) {
        return false;
    }
    length += propertiesData.length;
    // Header
    stream.write(Buffer.from([
        protocol.codes.auth << 4
    ]));
    // Length
    writeVarByteInt(stream, length);
    // reason code in header
    stream.write(Buffer.from([
        reasonCode
    ]));
    // properies mqtt 5
    if (propertiesData !== null) {
        propertiesData.write();
    }
    return true;
}
/**
 * writeVarByteInt - write an MQTT style variable byte integer to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <Number> length - length (>0)
 * @returns <Number> number of bytes written
 *
 * @api private
 */ const varByteIntCache = {};
function writeVarByteInt(stream, num) {
    if (num > protocol.VARBYTEINT_MAX) {
        stream.destroy(new Error(`Invalid variable byte integer: ${num}`));
        return false;
    }
    let buffer = varByteIntCache[num];
    if (!buffer) {
        buffer = genBufVariableByteInt(num);
        if (num < 16384) varByteIntCache[num] = buffer;
    }
    debug('writeVarByteInt: writing to stream: %o', buffer);
    return stream.write(buffer);
}
/**
 * writeString - write a utf8 string to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <String> string - string to write
 * @return <Number> number of bytes written
 *
 * @api private
 */ function writeString(stream, string) {
    const strlen = Buffer.byteLength(string);
    writeNumber(stream, strlen);
    debug('writeString: %s', string);
    return stream.write(string, 'utf8');
}
/**
 * writeStringPair - write a utf8 string pairs to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <String> name - string name to write
 * @param <String> value - string value to write
 * @return <Number> number of bytes written
 *
 * @api private
 */ function writeStringPair(stream, name, value) {
    writeString(stream, name);
    writeString(stream, value);
}
/**
 * writeNumber - write a two byte number to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <String> number - number to write
 * @return <Number> number of bytes written
 *
 * @api private
 */ function writeNumberCached(stream, number) {
    debug('writeNumberCached: number: %d', number);
    debug('writeNumberCached: %o', numCache[number]);
    return stream.write(numCache[number]);
}
function writeNumberGenerated(stream, number) {
    const generatedNumber = generateNumber(number);
    debug('writeNumberGenerated: %o', generatedNumber);
    return stream.write(generatedNumber);
}
function write4ByteNumber(stream, number) {
    const generated4ByteBuffer = generate4ByteBuffer(number);
    debug('write4ByteNumber: %o', generated4ByteBuffer);
    return stream.write(generated4ByteBuffer);
}
/**
 * writeStringOrBuffer - write a String or Buffer with the its length prefix
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <String> toWrite - String or Buffer
 * @return <Number> number of bytes written
 */ function writeStringOrBuffer(stream, toWrite) {
    if (typeof toWrite === 'string') {
        writeString(stream, toWrite);
    } else if (toWrite) {
        writeNumber(stream, toWrite.length);
        stream.write(toWrite);
    } else writeNumber(stream, 0);
}
function getProperties(stream, properties) {
    /* connect properties */ if (typeof properties !== 'object' || properties.length != null) {
        return {
            length: 1,
            write () {
                writeProperties(stream, {}, 0);
            }
        };
    }
    let propertiesLength = 0;
    function getLengthProperty(name, value) {
        const type = protocol.propertiesTypes[name];
        let length = 0;
        switch(type){
            case 'byte':
                {
                    if (typeof value !== 'boolean') {
                        stream.destroy(new Error(`Invalid ${name}: ${value}`));
                        return false;
                    }
                    length += 1 + 1;
                    break;
                }
            case 'int8':
                {
                    if (typeof value !== 'number' || value < 0 || value > 0xff) {
                        stream.destroy(new Error(`Invalid ${name}: ${value}`));
                        return false;
                    }
                    length += 1 + 1;
                    break;
                }
            case 'binary':
                {
                    if (value && value === null) {
                        stream.destroy(new Error(`Invalid ${name}: ${value}`));
                        return false;
                    }
                    length += 1 + Buffer.byteLength(value) + 2;
                    break;
                }
            case 'int16':
                {
                    if (typeof value !== 'number' || value < 0 || value > 0xffff) {
                        stream.destroy(new Error(`Invalid ${name}: ${value}`));
                        return false;
                    }
                    length += 1 + 2;
                    break;
                }
            case 'int32':
                {
                    if (typeof value !== 'number' || value < 0 || value > 0xffffffff) {
                        stream.destroy(new Error(`Invalid ${name}: ${value}`));
                        return false;
                    }
                    length += 1 + 4;
                    break;
                }
            case 'var':
                {
                    // var byte integer is max 24 bits packed in 32 bits
                    if (typeof value !== 'number' || value < 0 || value > 0x0fffffff) {
                        stream.destroy(new Error(`Invalid ${name}: ${value}`));
                        return false;
                    }
                    length += 1 + Buffer.byteLength(genBufVariableByteInt(value));
                    break;
                }
            case 'string':
                {
                    if (typeof value !== 'string') {
                        stream.destroy(new Error(`Invalid ${name}: ${value}`));
                        return false;
                    }
                    length += 1 + 2 + Buffer.byteLength(value.toString());
                    break;
                }
            case 'pair':
                {
                    if (typeof value !== 'object') {
                        stream.destroy(new Error(`Invalid ${name}: ${value}`));
                        return false;
                    }
                    length += Object.getOwnPropertyNames(value).reduce((result, name)=>{
                        const currentValue = value[name];
                        if (Array.isArray(currentValue)) {
                            result += currentValue.reduce((currentLength, value)=>{
                                currentLength += 1 + 2 + Buffer.byteLength(name.toString()) + 2 + Buffer.byteLength(value.toString());
                                return currentLength;
                            }, 0);
                        } else {
                            result += 1 + 2 + Buffer.byteLength(name.toString()) + 2 + Buffer.byteLength(value[name].toString());
                        }
                        return result;
                    }, 0);
                    break;
                }
            default:
                {
                    stream.destroy(new Error(`Invalid property ${name}: ${value}`));
                    return false;
                }
        }
        return length;
    }
    if (properties) {
        for(const propName in properties){
            let propLength = 0;
            let propValueLength = 0;
            const propValue = properties[propName];
            if (propValue === undefined) {
                continue;
            } else if (Array.isArray(propValue)) {
                for(let valueIndex = 0; valueIndex < propValue.length; valueIndex++){
                    propValueLength = getLengthProperty(propName, propValue[valueIndex]);
                    if (!propValueLength) {
                        return false;
                    }
                    propLength += propValueLength;
                }
            } else {
                propValueLength = getLengthProperty(propName, propValue);
                if (!propValueLength) {
                    return false;
                }
                propLength = propValueLength;
            }
            if (!propLength) return false;
            propertiesLength += propLength;
        }
    }
    const propertiesLengthLength = Buffer.byteLength(genBufVariableByteInt(propertiesLength));
    return {
        length: propertiesLengthLength + propertiesLength,
        write () {
            writeProperties(stream, properties, propertiesLength);
        }
    };
}
function getPropertiesByMaximumPacketSize(stream, properties, opts, length) {
    const mayEmptyProps = [
        'reasonString',
        'userProperties'
    ];
    const maximumPacketSize = opts && opts.properties && opts.properties.maximumPacketSize ? opts.properties.maximumPacketSize : 0;
    let propertiesData = getProperties(stream, properties);
    if (maximumPacketSize) {
        while(length + propertiesData.length > maximumPacketSize){
            const currentMayEmptyProp = mayEmptyProps.shift();
            if (currentMayEmptyProp && properties[currentMayEmptyProp]) {
                delete properties[currentMayEmptyProp];
                propertiesData = getProperties(stream, properties);
            } else {
                return false;
            }
        }
    }
    return propertiesData;
}
function writeProperty(stream, propName, value) {
    const type = protocol.propertiesTypes[propName];
    switch(type){
        case 'byte':
            {
                stream.write(Buffer.from([
                    protocol.properties[propName]
                ]));
                stream.write(Buffer.from([
                    +value
                ]));
                break;
            }
        case 'int8':
            {
                stream.write(Buffer.from([
                    protocol.properties[propName]
                ]));
                stream.write(Buffer.from([
                    value
                ]));
                break;
            }
        case 'binary':
            {
                stream.write(Buffer.from([
                    protocol.properties[propName]
                ]));
                writeStringOrBuffer(stream, value);
                break;
            }
        case 'int16':
            {
                stream.write(Buffer.from([
                    protocol.properties[propName]
                ]));
                writeNumber(stream, value);
                break;
            }
        case 'int32':
            {
                stream.write(Buffer.from([
                    protocol.properties[propName]
                ]));
                write4ByteNumber(stream, value);
                break;
            }
        case 'var':
            {
                stream.write(Buffer.from([
                    protocol.properties[propName]
                ]));
                writeVarByteInt(stream, value);
                break;
            }
        case 'string':
            {
                stream.write(Buffer.from([
                    protocol.properties[propName]
                ]));
                writeString(stream, value);
                break;
            }
        case 'pair':
            {
                Object.getOwnPropertyNames(value).forEach((name)=>{
                    const currentValue = value[name];
                    if (Array.isArray(currentValue)) {
                        currentValue.forEach((value)=>{
                            stream.write(Buffer.from([
                                protocol.properties[propName]
                            ]));
                            writeStringPair(stream, name.toString(), value.toString());
                        });
                    } else {
                        stream.write(Buffer.from([
                            protocol.properties[propName]
                        ]));
                        writeStringPair(stream, name.toString(), currentValue.toString());
                    }
                });
                break;
            }
        default:
            {
                stream.destroy(new Error(`Invalid property ${propName} value: ${value}`));
                return false;
            }
    }
}
function writeProperties(stream, properties, propertiesLength) {
    /* write properties to stream */ writeVarByteInt(stream, propertiesLength);
    for(const propName in properties){
        if (Object.prototype.hasOwnProperty.call(properties, propName) && properties[propName] != null) {
            const value = properties[propName];
            if (Array.isArray(value)) {
                for(let valueIndex = 0; valueIndex < value.length; valueIndex++){
                    writeProperty(stream, propName, value[valueIndex]);
                }
            } else {
                writeProperty(stream, propName, value);
            }
        }
    }
}
function byteLength(bufOrString) {
    if (!bufOrString) return 0;
    else if (bufOrString instanceof Buffer) return bufOrString.length;
    else return Buffer.byteLength(bufOrString);
}
function isStringOrBuffer(field) {
    return typeof field === 'string' || field instanceof Buffer;
}
module.exports = generate;
}),
"[project]/node_modules/mqtt-packet/generate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const writeToStream = __turbopack_context__.r("[project]/node_modules/mqtt-packet/writeToStream.js [app-route] (ecmascript)");
const { EventEmitter } = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const { Buffer } = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
function generate(packet, opts) {
    const stream = new Accumulator();
    writeToStream(packet, stream, opts);
    return stream.concat();
}
class Accumulator extends EventEmitter {
    constructor(){
        super();
        this._array = new Array(20);
        this._i = 0;
    }
    write(chunk) {
        this._array[this._i++] = chunk;
        return true;
    }
    concat() {
        let length = 0;
        const lengths = new Array(this._array.length);
        const list = this._array;
        let pos = 0;
        let i;
        for(i = 0; i < list.length && list[i] !== undefined; i++){
            if (typeof list[i] !== 'string') lengths[i] = list[i].length;
            else lengths[i] = Buffer.byteLength(list[i]);
            length += lengths[i];
        }
        const result = Buffer.allocUnsafe(length);
        for(i = 0; i < list.length && list[i] !== undefined; i++){
            if (typeof list[i] !== 'string') {
                list[i].copy(result, pos);
                pos += lengths[i];
            } else {
                result.write(list[i], pos);
                pos += lengths[i];
            }
        }
        return result;
    }
    destroy(err) {
        if (err) this.emit('error', err);
    }
}
module.exports = generate;
}),
"[project]/node_modules/mqtt-packet/mqtt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

exports.parser = __turbopack_context__.r("[project]/node_modules/mqtt-packet/parser.js [app-route] (ecmascript)").parser;
exports.generate = __turbopack_context__.r("[project]/node_modules/mqtt-packet/generate.js [app-route] (ecmascript)");
exports.writeToStream = __turbopack_context__.r("[project]/node_modules/mqtt-packet/writeToStream.js [app-route] (ecmascript)");
}),
"[project]/node_modules/debug/src/common.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */ function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = __turbopack_context__.r("[project]/node_modules/ms/index.js [app-route] (ecmascript)");
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key)=>{
        createDebug[key] = env[key];
    });
    /**
	* The currently active debug mode names, and names to skip.
	*/ createDebug.names = [];
    createDebug.skips = [];
    /**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/ createDebug.formatters = {};
    /**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/ function selectColor(namespace) {
        let hash = 0;
        for(let i = 0; i < namespace.length; i++){
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    /**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/ function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
            // Disabled?
            if (!debug.enabled) {
                return;
            }
            const self = debug;
            // Set `diff` timestamp
            const curr = Number(new Date());
            const ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== 'string') {
                // Anything else let's inspect with %O
                args.unshift('%O');
            }
            // Apply any `formatters` transformations
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format)=>{
                // If we encounter an escaped % then don't increase the array index
                if (match === '%%') {
                    return '%';
                }
                index++;
                const formatter = createDebug.formatters[format];
                if (typeof formatter === 'function') {
                    const val = args[index];
                    match = formatter.call(self, val);
                    // Now we need to remove `args[index]` since it's inlined in the `format`
                    args.splice(index, 1);
                    index--;
                }
                return match;
            });
            // Apply env-specific formatting (colors, etc.)
            createDebug.formatArgs.call(self, args);
            const logFn = self.log || createDebug.log;
            logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.
        Object.defineProperty(debug, 'enabled', {
            enumerable: true,
            configurable: false,
            get: ()=>{
                if (enableOverride !== null) {
                    return enableOverride;
                }
                if (namespacesCache !== createDebug.namespaces) {
                    namespacesCache = createDebug.namespaces;
                    enabledCache = createDebug.enabled(namespace);
                }
                return enabledCache;
            },
            set: (v)=>{
                enableOverride = v;
            }
        });
        // Env-specific initialization logic for debug instances
        if (typeof createDebug.init === 'function') {
            createDebug.init(debug);
        }
        return debug;
    }
    function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
    }
    /**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/ function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === 'string' ? namespaces : '').trim().replace(/\s+/g, ',').split(',').filter(Boolean);
        for (const ns of split){
            if (ns[0] === '-') {
                createDebug.skips.push(ns.slice(1));
            } else {
                createDebug.names.push(ns);
            }
        }
    }
    /**
	 * Checks if the given string matches a namespace template, honoring
	 * asterisks as wildcards.
	 *
	 * @param {String} search
	 * @param {String} template
	 * @return {Boolean}
	 */ function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while(searchIndex < search.length){
            if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
                // Match character or proceed with wildcard
                if (template[templateIndex] === '*') {
                    starIndex = templateIndex;
                    matchIndex = searchIndex;
                    templateIndex++; // Skip the '*'
                } else {
                    searchIndex++;
                    templateIndex++;
                }
            } else if (starIndex !== -1) {
                // Backtrack to the last '*' and try to match more characters
                templateIndex = starIndex + 1;
                matchIndex++;
                searchIndex = matchIndex;
            } else {
                return false; // No match
            }
        }
        // Handle trailing '*' in template
        while(templateIndex < template.length && template[templateIndex] === '*'){
            templateIndex++;
        }
        return templateIndex === template.length;
    }
    /**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/ function disable() {
        const namespaces = [
            ...createDebug.names,
            ...createDebug.skips.map((namespace)=>'-' + namespace)
        ].join(',');
        createDebug.enable('');
        return namespaces;
    }
    /**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/ function enabled(name) {
        for (const skip of createDebug.skips){
            if (matchesTemplate(name, skip)) {
                return false;
            }
        }
        for (const ns of createDebug.names){
            if (matchesTemplate(name, ns)) {
                return true;
            }
        }
        return false;
    }
    /**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/ function coerce(val) {
        if (val instanceof Error) {
            return val.stack || val.message;
        }
        return val;
    }
    /**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/ function destroy() {
        console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
    createDebug.enable(createDebug.load());
    return createDebug;
}
module.exports = setup;
}),
"[project]/node_modules/debug/src/node.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Module dependencies.
 */ const tty = __turbopack_context__.r("[externals]/tty [external] (tty, cjs)");
const util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
/**
 * This is the Node.js implementation of `debug()`.
 */ exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(()=>{}, 'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
/**
 * Colors.
 */ exports.colors = [
    6,
    2,
    3,
    4,
    5,
    1
];
try {
    // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
    // eslint-disable-next-line import/no-extraneous-dependencies
    const supportsColor = __turbopack_context__.r("[project]/node_modules/supports-color/index.js [app-route] (ecmascript)");
    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
            20,
            21,
            26,
            27,
            32,
            33,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            56,
            57,
            62,
            63,
            68,
            69,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            92,
            93,
            98,
            99,
            112,
            113,
            128,
            129,
            134,
            135,
            148,
            149,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            178,
            179,
            184,
            185,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            214,
            215,
            220,
            221
        ];
    }
} catch (error) {
// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}
/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */ exports.inspectOpts = Object.keys(process.env).filter((key)=>{
    return /^debug_/i.test(key);
}).reduce((obj, key)=>{
    // Camel-case
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k)=>{
        return k.toUpperCase();
    });
    // Coerce string value into JS value
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
    } else if (val === 'null') {
        val = null;
    } else {
        val = Number(val);
    }
    obj[prop] = val;
    return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */ function useColors() {
    return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    const { namespace: name, useColors } = this;
    if (useColors) {
        const c = this.color;
        const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
        const prefix = `  ${colorCode};1m${name} \u001B[0m`;
        args[0] = prefix + args[0].split('\n').join('\n' + prefix);
        args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
    } else {
        args[0] = getDate() + name + ' ' + args[0];
    }
}
function getDate() {
    if (exports.inspectOpts.hideDate) {
        return '';
    }
    return new Date().toISOString() + ' ';
}
/**
 * Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
 */ function log(...args) {
    return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + '\n');
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    if (namespaces) {
        process.env.DEBUG = namespaces;
    } else {
        // If you set a process.env field to null or undefined, it gets cast to the
        // string 'null' or 'undefined'. Just delete instead.
        delete process.env.DEBUG;
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */ function init(debug) {
    debug.inspectOpts = {};
    const keys = Object.keys(exports.inspectOpts);
    for(let i = 0; i < keys.length; i++){
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
}
module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/common.js [app-route] (ecmascript)")(exports);
const { formatters } = module.exports;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */ formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split('\n').map((str)=>str.trim()).join(' ');
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */ formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
};
}),
"[project]/node_modules/debug/src/browser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* eslint-env browser */ /**
 * This is the web browser implementation of `debug()`.
 */ exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (()=>{
    let warned = false;
    return ()=>{
        if (!warned) {
            warned = true;
            console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
        }
    };
})();
/**
 * Colors.
 */ exports.colors = [
    '#0000CC',
    '#0000FF',
    '#0033CC',
    '#0033FF',
    '#0066CC',
    '#0066FF',
    '#0099CC',
    '#0099FF',
    '#00CC00',
    '#00CC33',
    '#00CC66',
    '#00CC99',
    '#00CCCC',
    '#00CCFF',
    '#3300CC',
    '#3300FF',
    '#3333CC',
    '#3333FF',
    '#3366CC',
    '#3366FF',
    '#3399CC',
    '#3399FF',
    '#33CC00',
    '#33CC33',
    '#33CC66',
    '#33CC99',
    '#33CCCC',
    '#33CCFF',
    '#6600CC',
    '#6600FF',
    '#6633CC',
    '#6633FF',
    '#66CC00',
    '#66CC33',
    '#9900CC',
    '#9900FF',
    '#9933CC',
    '#9933FF',
    '#99CC00',
    '#99CC33',
    '#CC0000',
    '#CC0033',
    '#CC0066',
    '#CC0099',
    '#CC00CC',
    '#CC00FF',
    '#CC3300',
    '#CC3333',
    '#CC3366',
    '#CC3399',
    '#CC33CC',
    '#CC33FF',
    '#CC6600',
    '#CC6633',
    '#CC9900',
    '#CC9933',
    '#CCCC00',
    '#CCCC33',
    '#FF0000',
    '#FF0033',
    '#FF0066',
    '#FF0099',
    '#FF00CC',
    '#FF00FF',
    '#FF3300',
    '#FF3333',
    '#FF3366',
    '#FF3399',
    '#FF33CC',
    '#FF33FF',
    '#FF6600',
    '#FF6633',
    '#FF9900',
    '#FF9933',
    '#FFCC00',
    '#FFCC33'
];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */ // eslint-disable-next-line complexity
function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Internet Explorer and Edge do not support colors.
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
    }
    let m;
    // Is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    // eslint-disable-next-line no-return-assign
    return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || ("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);
    if (!this.useColors) {
        return;
    }
    const c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit');
    // The final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match)=>{
        if (match === '%%') {
            return;
        }
        index++;
        if (match === '%c') {
            // We only are interested in the *last* %c
            // (the user may have provided their own)
            lastC = index;
        }
    });
    args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */ exports.log = console.debug || console.log || (()=>{});
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    try {
        if (namespaces) {
            exports.storage.setItem('debug', namespaces);
        } else {
            exports.storage.removeItem('debug');
        }
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    let r;
    try {
        r = exports.storage.getItem('debug') || exports.storage.getItem('DEBUG');
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
    }
    return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */ function localstorage() {
    try {
        // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
        // The Browser also has localStorage in the global context.
        return localStorage;
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/common.js [app-route] (ecmascript)")(exports);
const { formatters } = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */ formatters.j = function(v) {
    try {
        return JSON.stringify(v);
    } catch (error) {
        return '[UnexpectedJSONParseError]: ' + error.message;
    }
};
}),
"[project]/node_modules/debug/src/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */ if (typeof process === 'undefined' || process.type === 'renderer' || ("TURBOPACK compile-time value", false) === true || process.__nwjs) {
    module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/browser.js [app-route] (ecmascript)");
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/node.js [app-route] (ecmascript)");
}
}),
"[project]/node_modules/has-flag/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = (flag, argv = process.argv)=>{
    const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf('--');
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};
}),
"[project]/node_modules/supports-color/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const os = __turbopack_context__.r("[externals]/os [external] (os, cjs)");
const tty = __turbopack_context__.r("[externals]/tty [external] (tty, cjs)");
const hasFlag = __turbopack_context__.r("[project]/node_modules/has-flag/index.js [app-route] (ecmascript)");
const { env } = process;
let forceColor;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false') || hasFlag('color=never')) {
    forceColor = 0;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
    forceColor = 1;
}
if ('FORCE_COLOR' in env) {
    if (env.FORCE_COLOR === 'true') {
        forceColor = 1;
    } else if (env.FORCE_COLOR === 'false') {
        forceColor = 0;
    } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
}
function translateLevel(level) {
    if (level === 0) {
        return false;
    }
    return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
    };
}
function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
        return 0;
    }
    if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
        return 3;
    }
    if (hasFlag('color=256')) {
        return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === undefined) {
        return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === 'dumb') {
        return min;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        // Windows 10 build 10586 is the first Windows release that supports 256 colors.
        // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
        const osRelease = os.release().split('.');
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
            return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
    }
    //TURBOPACK unreachable
    ;
}
function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
}
module.exports = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};
}),
"[project]/node_modules/process-nextick-args/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if (typeof process === 'undefined' || !process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
    module.exports = {
        nextTick: nextTick
    };
} else {
    module.exports = process;
}
function nextTick(fn, arg1, arg2, arg3) {
    if (typeof fn !== 'function') {
        throw new TypeError('"callback" argument must be a function');
    }
    var len = arguments.length;
    var args, i;
    switch(len){
        case 0:
        case 1:
            return process.nextTick(fn);
        case 2:
            return process.nextTick(function afterTickOne() {
                fn.call(null, arg1);
            });
        case 3:
            return process.nextTick(function afterTickTwo() {
                fn.call(null, arg1, arg2);
            });
        case 4:
            return process.nextTick(function afterTickThree() {
                fn.call(null, arg1, arg2, arg3);
            });
        default:
            args = new Array(len - 1);
            i = 0;
            while(i < args.length){
                args[i++] = arguments[i];
            }
            return process.nextTick(function afterTick() {
                fn.apply(null, args);
            });
    }
}
}),
"[project]/node_modules/rfdc/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = rfdc;
function copyBuffer(cur) {
    if (cur instanceof Buffer) {
        return Buffer.from(cur);
    }
    return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
}
function rfdc(opts) {
    opts = opts || {};
    if (opts.circles) return rfdcCircles(opts);
    const constructorHandlers = new Map();
    constructorHandlers.set(Date, (o)=>new Date(o));
    constructorHandlers.set(Map, (o, fn)=>new Map(cloneArray(Array.from(o), fn)));
    constructorHandlers.set(Set, (o, fn)=>new Set(cloneArray(Array.from(o), fn)));
    if (opts.constructorHandlers) {
        for (const handler of opts.constructorHandlers){
            constructorHandlers.set(handler[0], handler[1]);
        }
    }
    let handler = null;
    return opts.proto ? cloneProto : clone;
    //TURBOPACK unreachable
    ;
    function cloneArray(a, fn) {
        const keys = Object.keys(a);
        const a2 = new Array(keys.length);
        for(let i = 0; i < keys.length; i++){
            const k = keys[i];
            const cur = a[k];
            if (typeof cur !== 'object' || cur === null) {
                a2[k] = cur;
            } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
                a2[k] = handler(cur, fn);
            } else if (ArrayBuffer.isView(cur)) {
                a2[k] = copyBuffer(cur);
            } else {
                a2[k] = fn(cur);
            }
        }
        return a2;
    }
    function clone(o) {
        if (typeof o !== 'object' || o === null) return o;
        if (Array.isArray(o)) return cloneArray(o, clone);
        if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
            return handler(o, clone);
        }
        const o2 = {};
        for(const k in o){
            if (Object.hasOwnProperty.call(o, k) === false) continue;
            const cur = o[k];
            if (typeof cur !== 'object' || cur === null) {
                o2[k] = cur;
            } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
                o2[k] = handler(cur, clone);
            } else if (ArrayBuffer.isView(cur)) {
                o2[k] = copyBuffer(cur);
            } else {
                o2[k] = clone(cur);
            }
        }
        return o2;
    }
    function cloneProto(o) {
        if (typeof o !== 'object' || o === null) return o;
        if (Array.isArray(o)) return cloneArray(o, cloneProto);
        if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
            return handler(o, cloneProto);
        }
        const o2 = {};
        for(const k in o){
            const cur = o[k];
            if (typeof cur !== 'object' || cur === null) {
                o2[k] = cur;
            } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
                o2[k] = handler(cur, cloneProto);
            } else if (ArrayBuffer.isView(cur)) {
                o2[k] = copyBuffer(cur);
            } else {
                o2[k] = cloneProto(cur);
            }
        }
        return o2;
    }
}
function rfdcCircles(opts) {
    const refs = [];
    const refsNew = [];
    const constructorHandlers = new Map();
    constructorHandlers.set(Date, (o)=>new Date(o));
    constructorHandlers.set(Map, (o, fn)=>new Map(cloneArray(Array.from(o), fn)));
    constructorHandlers.set(Set, (o, fn)=>new Set(cloneArray(Array.from(o), fn)));
    if (opts.constructorHandlers) {
        for (const handler of opts.constructorHandlers){
            constructorHandlers.set(handler[0], handler[1]);
        }
    }
    let handler = null;
    return opts.proto ? cloneProto : clone;
    //TURBOPACK unreachable
    ;
    function cloneArray(a, fn) {
        const keys = Object.keys(a);
        const a2 = new Array(keys.length);
        for(let i = 0; i < keys.length; i++){
            const k = keys[i];
            const cur = a[k];
            if (typeof cur !== 'object' || cur === null) {
                a2[k] = cur;
            } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
                a2[k] = handler(cur, fn);
            } else if (ArrayBuffer.isView(cur)) {
                a2[k] = copyBuffer(cur);
            } else {
                const index = refs.indexOf(cur);
                if (index !== -1) {
                    a2[k] = refsNew[index];
                } else {
                    a2[k] = fn(cur);
                }
            }
        }
        return a2;
    }
    function clone(o) {
        if (typeof o !== 'object' || o === null) return o;
        if (Array.isArray(o)) return cloneArray(o, clone);
        if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
            return handler(o, clone);
        }
        const o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for(const k in o){
            if (Object.hasOwnProperty.call(o, k) === false) continue;
            const cur = o[k];
            if (typeof cur !== 'object' || cur === null) {
                o2[k] = cur;
            } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
                o2[k] = handler(cur, clone);
            } else if (ArrayBuffer.isView(cur)) {
                o2[k] = copyBuffer(cur);
            } else {
                const i = refs.indexOf(cur);
                if (i !== -1) {
                    o2[k] = refsNew[i];
                } else {
                    o2[k] = clone(cur);
                }
            }
        }
        refs.pop();
        refsNew.pop();
        return o2;
    }
    function cloneProto(o) {
        if (typeof o !== 'object' || o === null) return o;
        if (Array.isArray(o)) return cloneArray(o, cloneProto);
        if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
            return handler(o, cloneProto);
        }
        const o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for(const k in o){
            const cur = o[k];
            if (typeof cur !== 'object' || cur === null) {
                o2[k] = cur;
            } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
                o2[k] = handler(cur, cloneProto);
            } else if (ArrayBuffer.isView(cur)) {
                o2[k] = copyBuffer(cur);
            } else {
                const i = refs.indexOf(cur);
                if (i !== -1) {
                    o2[k] = refsNew[i];
                } else {
                    o2[k] = cloneProto(cur);
                }
            }
        }
        refs.pop();
        refsNew.pop();
        return o2;
    }
}
}),
"[project]/node_modules/rfdc/default.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/rfdc/index.js [app-route] (ecmascript)")();
}),
"[project]/node_modules/mqtt/node_modules/lru-cache/dist/commonjs/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @module LRUCache
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LRUCache = void 0;
const perf = typeof performance === 'object' && performance && typeof performance.now === 'function' ? performance : Date;
const warned = new Set();
/* c8 ignore start */ const PROCESS = typeof process === 'object' && !!process ? process : {};
/* c8 ignore start */ const emitWarning = (msg, type, code, fn)=>{
    typeof PROCESS.emitWarning === 'function' ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
};
let AC = globalThis.AbortController;
let AS = globalThis.AbortSignal;
/* c8 ignore start */ if (typeof AC === 'undefined') {
    //@ts-ignore
    AS = class AbortSignal {
        onabort;
        _onabort = [];
        reason;
        aborted = false;
        addEventListener(_, fn) {
            this._onabort.push(fn);
        }
    };
    //@ts-ignore
    AC = class AbortController {
        constructor(){
            warnACPolyfill();
        }
        signal = new AS();
        abort(reason) {
            if (this.signal.aborted) return;
            //@ts-ignore
            this.signal.reason = reason;
            //@ts-ignore
            this.signal.aborted = true;
            //@ts-ignore
            for (const fn of this.signal._onabort){
                fn(reason);
            }
            this.signal.onabort?.(reason);
        }
    };
    let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== '1';
    const warnACPolyfill = ()=>{
        if (!printACPolyfillWarning) return;
        printACPolyfillWarning = false;
        emitWarning('AbortController is not defined. If using lru-cache in ' + 'node 14, load an AbortController polyfill from the ' + '`node-abort-controller` package. A minimal polyfill is ' + 'provided for use by LRUCache.fetch(), but it should not be ' + 'relied upon in other contexts (eg, passing it to other APIs that ' + 'use AbortController/AbortSignal might have undesirable effects). ' + 'You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.', 'NO_ABORT_CONTROLLER', 'ENOTSUP', warnACPolyfill);
    };
}
/* c8 ignore stop */ const shouldWarn = (code)=>!warned.has(code);
const TYPE = Symbol('type');
const isPosInt = (n)=>n && n === Math.floor(n) && n > 0 && isFinite(n);
/* c8 ignore start */ // This is a little bit ridiculous, tbh.
// The maximum array length is 2^32-1 or thereabouts on most JS impls.
// And well before that point, you're caching the entire world, I mean,
// that's ~32GB of just integers for the next/prev links, plus whatever
// else to hold that many keys and values.  Just filling the memory with
// zeroes at init time is brutal when you get that big.
// But why not be complete?
// Maybe in the future, these limits will have expanded.
const getUintArray = (max)=>!isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
/* c8 ignore stop */ class ZeroArray extends Array {
    constructor(size){
        super(size);
        this.fill(0);
    }
}
class Stack {
    heap;
    length;
    // private constructor
    static #constructing = false;
    static create(max) {
        const HeapCls = getUintArray(max);
        if (!HeapCls) return [];
        Stack.#constructing = true;
        const s = new Stack(max, HeapCls);
        Stack.#constructing = false;
        return s;
    }
    constructor(max, HeapCls){
        /* c8 ignore start */ if (!Stack.#constructing) {
            throw new TypeError('instantiate Stack using Stack.create(n)');
        }
        /* c8 ignore stop */ this.heap = new HeapCls(max);
        this.length = 0;
    }
    push(n) {
        this.heap[this.length++] = n;
    }
    pop() {
        return this.heap[--this.length];
    }
}
/**
 * Default export, the thing you're using this module to get.
 *
 * The `K` and `V` types define the key and value types, respectively. The
 * optional `FC` type defines the type of the `context` object passed to
 * `cache.fetch()` and `cache.memo()`.
 *
 * Keys and values **must not** be `null` or `undefined`.
 *
 * All properties from the options object (with the exception of `max`,
 * `maxSize`, `fetchMethod`, `memoMethod`, `dispose` and `disposeAfter`) are
 * added as normal public members. (The listed options are read-only getters.)
 *
 * Changing any of these will alter the defaults for subsequent method calls.
 */ class LRUCache {
    // options that cannot be changed without disaster
    #max;
    #maxSize;
    #dispose;
    #disposeAfter;
    #fetchMethod;
    #memoMethod;
    /**
     * {@link LRUCache.OptionsBase.ttl}
     */ ttl;
    /**
     * {@link LRUCache.OptionsBase.ttlResolution}
     */ ttlResolution;
    /**
     * {@link LRUCache.OptionsBase.ttlAutopurge}
     */ ttlAutopurge;
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnGet}
     */ updateAgeOnGet;
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnHas}
     */ updateAgeOnHas;
    /**
     * {@link LRUCache.OptionsBase.allowStale}
     */ allowStale;
    /**
     * {@link LRUCache.OptionsBase.noDisposeOnSet}
     */ noDisposeOnSet;
    /**
     * {@link LRUCache.OptionsBase.noUpdateTTL}
     */ noUpdateTTL;
    /**
     * {@link LRUCache.OptionsBase.maxEntrySize}
     */ maxEntrySize;
    /**
     * {@link LRUCache.OptionsBase.sizeCalculation}
     */ sizeCalculation;
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
     */ noDeleteOnFetchRejection;
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
     */ noDeleteOnStaleGet;
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
     */ allowStaleOnFetchAbort;
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
     */ allowStaleOnFetchRejection;
    /**
     * {@link LRUCache.OptionsBase.ignoreFetchAbort}
     */ ignoreFetchAbort;
    // computed properties
    #size;
    #calculatedSize;
    #keyMap;
    #keyList;
    #valList;
    #next;
    #prev;
    #head;
    #tail;
    #free;
    #disposed;
    #sizes;
    #starts;
    #ttls;
    #hasDispose;
    #hasFetchMethod;
    #hasDisposeAfter;
    /**
     * Do not call this method unless you need to inspect the
     * inner workings of the cache.  If anything returned by this
     * object is modified in any way, strange breakage may occur.
     *
     * These fields are private for a reason!
     *
     * @internal
     */ static unsafeExposeInternals(c) {
        return {
            // properties
            starts: c.#starts,
            ttls: c.#ttls,
            sizes: c.#sizes,
            keyMap: c.#keyMap,
            keyList: c.#keyList,
            valList: c.#valList,
            next: c.#next,
            prev: c.#prev,
            get head () {
                return c.#head;
            },
            get tail () {
                return c.#tail;
            },
            free: c.#free,
            // methods
            isBackgroundFetch: (p)=>c.#isBackgroundFetch(p),
            backgroundFetch: (k, index, options, context)=>c.#backgroundFetch(k, index, options, context),
            moveToTail: (index)=>c.#moveToTail(index),
            indexes: (options)=>c.#indexes(options),
            rindexes: (options)=>c.#rindexes(options),
            isStale: (index)=>c.#isStale(index)
        };
    }
    // Protected read-only members
    /**
     * {@link LRUCache.OptionsBase.max} (read-only)
     */ get max() {
        return this.#max;
    }
    /**
     * {@link LRUCache.OptionsBase.maxSize} (read-only)
     */ get maxSize() {
        return this.#maxSize;
    }
    /**
     * The total computed size of items in the cache (read-only)
     */ get calculatedSize() {
        return this.#calculatedSize;
    }
    /**
     * The number of items stored in the cache (read-only)
     */ get size() {
        return this.#size;
    }
    /**
     * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
     */ get fetchMethod() {
        return this.#fetchMethod;
    }
    get memoMethod() {
        return this.#memoMethod;
    }
    /**
     * {@link LRUCache.OptionsBase.dispose} (read-only)
     */ get dispose() {
        return this.#dispose;
    }
    /**
     * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
     */ get disposeAfter() {
        return this.#disposeAfter;
    }
    constructor(options){
        const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
        if (max !== 0 && !isPosInt(max)) {
            throw new TypeError('max option must be a nonnegative integer');
        }
        const UintArray = max ? getUintArray(max) : Array;
        if (!UintArray) {
            throw new Error('invalid max value: ' + max);
        }
        this.#max = max;
        this.#maxSize = maxSize;
        this.maxEntrySize = maxEntrySize || this.#maxSize;
        this.sizeCalculation = sizeCalculation;
        if (this.sizeCalculation) {
            if (!this.#maxSize && !this.maxEntrySize) {
                throw new TypeError('cannot set sizeCalculation without setting maxSize or maxEntrySize');
            }
            if (typeof this.sizeCalculation !== 'function') {
                throw new TypeError('sizeCalculation set to non-function');
            }
        }
        if (memoMethod !== undefined && typeof memoMethod !== 'function') {
            throw new TypeError('memoMethod must be a function if defined');
        }
        this.#memoMethod = memoMethod;
        if (fetchMethod !== undefined && typeof fetchMethod !== 'function') {
            throw new TypeError('fetchMethod must be a function if specified');
        }
        this.#fetchMethod = fetchMethod;
        this.#hasFetchMethod = !!fetchMethod;
        this.#keyMap = new Map();
        this.#keyList = new Array(max).fill(undefined);
        this.#valList = new Array(max).fill(undefined);
        this.#next = new UintArray(max);
        this.#prev = new UintArray(max);
        this.#head = 0;
        this.#tail = 0;
        this.#free = Stack.create(max);
        this.#size = 0;
        this.#calculatedSize = 0;
        if (typeof dispose === 'function') {
            this.#dispose = dispose;
        }
        if (typeof disposeAfter === 'function') {
            this.#disposeAfter = disposeAfter;
            this.#disposed = [];
        } else {
            this.#disposeAfter = undefined;
            this.#disposed = undefined;
        }
        this.#hasDispose = !!this.#dispose;
        this.#hasDisposeAfter = !!this.#disposeAfter;
        this.noDisposeOnSet = !!noDisposeOnSet;
        this.noUpdateTTL = !!noUpdateTTL;
        this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
        this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
        this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
        this.ignoreFetchAbort = !!ignoreFetchAbort;
        // NB: maxEntrySize is set to maxSize if it's set
        if (this.maxEntrySize !== 0) {
            if (this.#maxSize !== 0) {
                if (!isPosInt(this.#maxSize)) {
                    throw new TypeError('maxSize must be a positive integer if specified');
                }
            }
            if (!isPosInt(this.maxEntrySize)) {
                throw new TypeError('maxEntrySize must be a positive integer if specified');
            }
            this.#initializeSizeTracking();
        }
        this.allowStale = !!allowStale;
        this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
        this.updateAgeOnGet = !!updateAgeOnGet;
        this.updateAgeOnHas = !!updateAgeOnHas;
        this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
        this.ttlAutopurge = !!ttlAutopurge;
        this.ttl = ttl || 0;
        if (this.ttl) {
            if (!isPosInt(this.ttl)) {
                throw new TypeError('ttl must be a positive integer if specified');
            }
            this.#initializeTTLTracking();
        }
        // do not allow completely unbounded caches
        if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
            throw new TypeError('At least one of max, maxSize, or ttl is required');
        }
        if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
            const code = 'LRU_CACHE_UNBOUNDED';
            if (shouldWarn(code)) {
                warned.add(code);
                const msg = 'TTL caching without ttlAutopurge, max, or maxSize can ' + 'result in unbounded memory consumption.';
                emitWarning(msg, 'UnboundedCacheWarning', code, LRUCache);
            }
        }
    }
    /**
     * Return the number of ms left in the item's TTL. If item is not in cache,
     * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
     */ getRemainingTTL(key) {
        return this.#keyMap.has(key) ? Infinity : 0;
    }
    #initializeTTLTracking() {
        const ttls = new ZeroArray(this.#max);
        const starts = new ZeroArray(this.#max);
        this.#ttls = ttls;
        this.#starts = starts;
        this.#setItemTTL = (index, ttl, start = perf.now())=>{
            starts[index] = ttl !== 0 ? start : 0;
            ttls[index] = ttl;
            if (ttl !== 0 && this.ttlAutopurge) {
                const t = setTimeout(()=>{
                    if (this.#isStale(index)) {
                        this.#delete(this.#keyList[index], 'expire');
                    }
                }, ttl + 1);
                // unref() not supported on all platforms
                /* c8 ignore start */ if (t.unref) {
                    t.unref();
                }
            /* c8 ignore stop */ }
        };
        this.#updateItemAge = (index)=>{
            starts[index] = ttls[index] !== 0 ? perf.now() : 0;
        };
        this.#statusTTL = (status, index)=>{
            if (ttls[index]) {
                const ttl = ttls[index];
                const start = starts[index];
                /* c8 ignore next */ if (!ttl || !start) return;
                status.ttl = ttl;
                status.start = start;
                status.now = cachedNow || getNow();
                const age = status.now - start;
                status.remainingTTL = ttl - age;
            }
        };
        // debounce calls to perf.now() to 1s so we're not hitting
        // that costly call repeatedly.
        let cachedNow = 0;
        const getNow = ()=>{
            const n = perf.now();
            if (this.ttlResolution > 0) {
                cachedNow = n;
                const t = setTimeout(()=>cachedNow = 0, this.ttlResolution);
                // not available on all platforms
                /* c8 ignore start */ if (t.unref) {
                    t.unref();
                }
            /* c8 ignore stop */ }
            return n;
        };
        this.getRemainingTTL = (key)=>{
            const index = this.#keyMap.get(key);
            if (index === undefined) {
                return 0;
            }
            const ttl = ttls[index];
            const start = starts[index];
            if (!ttl || !start) {
                return Infinity;
            }
            const age = (cachedNow || getNow()) - start;
            return ttl - age;
        };
        this.#isStale = (index)=>{
            const s = starts[index];
            const t = ttls[index];
            return !!t && !!s && (cachedNow || getNow()) - s > t;
        };
    }
    // conditionally set private methods related to TTL
    #updateItemAge = ()=>{};
    #statusTTL = ()=>{};
    #setItemTTL = ()=>{};
    /* c8 ignore stop */ #isStale = ()=>false;
    #initializeSizeTracking() {
        const sizes = new ZeroArray(this.#max);
        this.#calculatedSize = 0;
        this.#sizes = sizes;
        this.#removeItemSize = (index)=>{
            this.#calculatedSize -= sizes[index];
            sizes[index] = 0;
        };
        this.#requireSize = (k, v, size, sizeCalculation)=>{
            // provisionally accept background fetches.
            // actual value size will be checked when they return.
            if (this.#isBackgroundFetch(v)) {
                return 0;
            }
            if (!isPosInt(size)) {
                if (sizeCalculation) {
                    if (typeof sizeCalculation !== 'function') {
                        throw new TypeError('sizeCalculation must be a function');
                    }
                    size = sizeCalculation(v, k);
                    if (!isPosInt(size)) {
                        throw new TypeError('sizeCalculation return invalid (expect positive integer)');
                    }
                } else {
                    throw new TypeError('invalid size value (must be positive integer). ' + 'When maxSize or maxEntrySize is used, sizeCalculation ' + 'or size must be set.');
                }
            }
            return size;
        };
        this.#addItemSize = (index, size, status)=>{
            sizes[index] = size;
            if (this.#maxSize) {
                const maxSize = this.#maxSize - sizes[index];
                while(this.#calculatedSize > maxSize){
                    this.#evict(true);
                }
            }
            this.#calculatedSize += sizes[index];
            if (status) {
                status.entrySize = size;
                status.totalCalculatedSize = this.#calculatedSize;
            }
        };
    }
    #removeItemSize = (_i)=>{};
    #addItemSize = (_i, _s, _st)=>{};
    #requireSize = (_k, _v, size, sizeCalculation)=>{
        if (size || sizeCalculation) {
            throw new TypeError('cannot set size without setting maxSize or maxEntrySize on cache');
        }
        return 0;
    };
    *#indexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for(let i = this.#tail; true;){
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#head) {
                    break;
                } else {
                    i = this.#prev[i];
                }
            }
        }
    }
    *#rindexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for(let i = this.#head; true;){
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#tail) {
                    break;
                } else {
                    i = this.#next[i];
                }
            }
        }
    }
    #isValidIndex(index) {
        return index !== undefined && this.#keyMap.get(this.#keyList[index]) === index;
    }
    /**
     * Return a generator yielding `[key, value]` pairs,
     * in order from most recently used to least recently used.
     */ *entries() {
        for (const i of this.#indexes()){
            if (this.#valList[i] !== undefined && this.#keyList[i] !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield [
                    this.#keyList[i],
                    this.#valList[i]
                ];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.entries}
     *
     * Return a generator yielding `[key, value]` pairs,
     * in order from least recently used to most recently used.
     */ *rentries() {
        for (const i of this.#rindexes()){
            if (this.#valList[i] !== undefined && this.#keyList[i] !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield [
                    this.#keyList[i],
                    this.#valList[i]
                ];
            }
        }
    }
    /**
     * Return a generator yielding the keys in the cache,
     * in order from most recently used to least recently used.
     */ *keys() {
        for (const i of this.#indexes()){
            const k = this.#keyList[i];
            if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.keys}
     *
     * Return a generator yielding the keys in the cache,
     * in order from least recently used to most recently used.
     */ *rkeys() {
        for (const i of this.#rindexes()){
            const k = this.#keyList[i];
            if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Return a generator yielding the values in the cache,
     * in order from most recently used to least recently used.
     */ *values() {
        for (const i of this.#indexes()){
            const v = this.#valList[i];
            if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.values}
     *
     * Return a generator yielding the values in the cache,
     * in order from least recently used to most recently used.
     */ *rvalues() {
        for (const i of this.#rindexes()){
            const v = this.#valList[i];
            if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Iterating over the cache itself yields the same results as
     * {@link LRUCache.entries}
     */ [Symbol.iterator]() {
        return this.entries();
    }
    /**
     * A String value that is used in the creation of the default string
     * description of an object. Called by the built-in method
     * `Object.prototype.toString`.
     */ [Symbol.toStringTag] = 'LRUCache';
    /**
     * Find a value for which the supplied fn method returns a truthy value,
     * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
     */ find(fn, getOptions = {}) {
        for (const i of this.#indexes()){
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined) continue;
            if (fn(value, this.#keyList[i], this)) {
                return this.get(this.#keyList[i], getOptions);
            }
        }
    }
    /**
     * Call the supplied function on each item in the cache, in order from most
     * recently used to least recently used.
     *
     * `fn` is called as `fn(value, key, cache)`.
     *
     * If `thisp` is provided, function will be called in the `this`-context of
     * the provided object, or the cache if no `thisp` object is provided.
     *
     * Does not update age or recenty of use, or iterate over stale values.
     */ forEach(fn, thisp = this) {
        for (const i of this.#indexes()){
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined) continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * The same as {@link LRUCache.forEach} but items are iterated over in
     * reverse order.  (ie, less recently used items are iterated over first.)
     */ rforEach(fn, thisp = this) {
        for (const i of this.#rindexes()){
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined) continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * Delete any stale entries. Returns true if anything was removed,
     * false otherwise.
     */ purgeStale() {
        let deleted = false;
        for (const i of this.#rindexes({
            allowStale: true
        })){
            if (this.#isStale(i)) {
                this.#delete(this.#keyList[i], 'expire');
                deleted = true;
            }
        }
        return deleted;
    }
    /**
     * Get the extended info about a given entry, to get its value, size, and
     * TTL info simultaneously. Returns `undefined` if the key is not present.
     *
     * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
     * serialization, the `start` value is always the current timestamp, and the
     * `ttl` is a calculated remaining time to live (negative if expired).
     *
     * Always returns stale values, if their info is found in the cache, so be
     * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
     * if relevant.
     */ info(key) {
        const i = this.#keyMap.get(key);
        if (i === undefined) return undefined;
        const v = this.#valList[i];
        const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
        if (value === undefined) return undefined;
        const entry = {
            value
        };
        if (this.#ttls && this.#starts) {
            const ttl = this.#ttls[i];
            const start = this.#starts[i];
            if (ttl && start) {
                const remain = ttl - (perf.now() - start);
                entry.ttl = remain;
                entry.start = Date.now();
            }
        }
        if (this.#sizes) {
            entry.size = this.#sizes[i];
        }
        return entry;
    }
    /**
     * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
     * passed to {@link LRLUCache#load}.
     *
     * The `start` fields are calculated relative to a portable `Date.now()`
     * timestamp, even if `performance.now()` is available.
     *
     * Stale entries are always included in the `dump`, even if
     * {@link LRUCache.OptionsBase.allowStale} is false.
     *
     * Note: this returns an actual array, not a generator, so it can be more
     * easily passed around.
     */ dump() {
        const arr = [];
        for (const i of this.#indexes({
            allowStale: true
        })){
            const key = this.#keyList[i];
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined || key === undefined) continue;
            const entry = {
                value
            };
            if (this.#ttls && this.#starts) {
                entry.ttl = this.#ttls[i];
                // always dump the start relative to a portable timestamp
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = perf.now() - this.#starts[i];
                entry.start = Math.floor(Date.now() - age);
            }
            if (this.#sizes) {
                entry.size = this.#sizes[i];
            }
            arr.unshift([
                key,
                entry
            ]);
        }
        return arr;
    }
    /**
     * Reset the cache and load in the items in entries in the order listed.
     *
     * The shape of the resulting cache may be different if the same options are
     * not used in both caches.
     *
     * The `start` fields are assumed to be calculated relative to a portable
     * `Date.now()` timestamp, even if `performance.now()` is available.
     */ load(arr) {
        this.clear();
        for (const [key, entry] of arr){
            if (entry.start) {
                // entry.start is a portable timestamp, but we may be using
                // node's performance.now(), so calculate the offset, so that
                // we get the intended remaining TTL, no matter how long it's
                // been on ice.
                //
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = Date.now() - entry.start;
                entry.start = perf.now() - age;
            }
            this.set(key, entry.value, entry);
        }
    }
    /**
     * Add a value to the cache.
     *
     * Note: if `undefined` is specified as a value, this is an alias for
     * {@link LRUCache#delete}
     *
     * Fields on the {@link LRUCache.SetOptions} options param will override
     * their corresponding values in the constructor options for the scope
     * of this single `set()` operation.
     *
     * If `start` is provided, then that will set the effective start
     * time for the TTL calculation. Note that this must be a previous
     * value of `performance.now()` if supported, or a previous value of
     * `Date.now()` if not.
     *
     * Options object may also include `size`, which will prevent
     * calling the `sizeCalculation` function and just use the specified
     * number if it is a positive integer, and `noDisposeOnSet` which
     * will prevent calling a `dispose` function in the case of
     * overwrites.
     *
     * If the `size` (or return value of `sizeCalculation`) for a given
     * entry is greater than `maxEntrySize`, then the item will not be
     * added to the cache.
     *
     * Will update the recency of the entry.
     *
     * If the value is `undefined`, then this is an alias for
     * `cache.delete(key)`. `undefined` is never stored in the cache.
     */ set(k, v, setOptions = {}) {
        if (v === undefined) {
            this.delete(k);
            return this;
        }
        const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
        let { noUpdateTTL = this.noUpdateTTL } = setOptions;
        const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
        // if the item doesn't fit, don't do anything
        // NB: maxEntrySize set to maxSize by default
        if (this.maxEntrySize && size > this.maxEntrySize) {
            if (status) {
                status.set = 'miss';
                status.maxEntrySizeExceeded = true;
            }
            // have to delete, in case something is there already.
            this.#delete(k, 'set');
            return this;
        }
        let index = this.#size === 0 ? undefined : this.#keyMap.get(k);
        if (index === undefined) {
            // addition
            index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
            this.#keyList[index] = k;
            this.#valList[index] = v;
            this.#keyMap.set(k, index);
            this.#next[this.#tail] = index;
            this.#prev[index] = this.#tail;
            this.#tail = index;
            this.#size++;
            this.#addItemSize(index, size, status);
            if (status) status.set = 'add';
            noUpdateTTL = false;
        } else {
            // update
            this.#moveToTail(index);
            const oldVal = this.#valList[index];
            if (v !== oldVal) {
                if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
                    oldVal.__abortController.abort(new Error('replaced'));
                    const { __staleWhileFetching: s } = oldVal;
                    if (s !== undefined && !noDisposeOnSet) {
                        if (this.#hasDispose) {
                            this.#dispose?.(s, k, 'set');
                        }
                        if (this.#hasDisposeAfter) {
                            this.#disposed?.push([
                                s,
                                k,
                                'set'
                            ]);
                        }
                    }
                } else if (!noDisposeOnSet) {
                    if (this.#hasDispose) {
                        this.#dispose?.(oldVal, k, 'set');
                    }
                    if (this.#hasDisposeAfter) {
                        this.#disposed?.push([
                            oldVal,
                            k,
                            'set'
                        ]);
                    }
                }
                this.#removeItemSize(index);
                this.#addItemSize(index, size, status);
                this.#valList[index] = v;
                if (status) {
                    status.set = 'replace';
                    const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
                    if (oldValue !== undefined) status.oldValue = oldValue;
                }
            } else if (status) {
                status.set = 'update';
            }
        }
        if (ttl !== 0 && !this.#ttls) {
            this.#initializeTTLTracking();
        }
        if (this.#ttls) {
            if (!noUpdateTTL) {
                this.#setItemTTL(index, ttl, start);
            }
            if (status) this.#statusTTL(status, index);
        }
        if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while(task = dt?.shift()){
                this.#disposeAfter?.(...task);
            }
        }
        return this;
    }
    /**
     * Evict the least recently used item, returning its value or
     * `undefined` if cache is empty.
     */ pop() {
        try {
            while(this.#size){
                const val = this.#valList[this.#head];
                this.#evict(true);
                if (this.#isBackgroundFetch(val)) {
                    if (val.__staleWhileFetching) {
                        return val.__staleWhileFetching;
                    }
                } else if (val !== undefined) {
                    return val;
                }
            }
        } finally{
            if (this.#hasDisposeAfter && this.#disposed) {
                const dt = this.#disposed;
                let task;
                while(task = dt?.shift()){
                    this.#disposeAfter?.(...task);
                }
            }
        }
    }
    #evict(free) {
        const head = this.#head;
        const k = this.#keyList[head];
        const v = this.#valList[head];
        if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error('evicted'));
        } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
                this.#dispose?.(v, k, 'evict');
            }
            if (this.#hasDisposeAfter) {
                this.#disposed?.push([
                    v,
                    k,
                    'evict'
                ]);
            }
        }
        this.#removeItemSize(head);
        // if we aren't about to use the index, then null these out
        if (free) {
            this.#keyList[head] = undefined;
            this.#valList[head] = undefined;
            this.#free.push(head);
        }
        if (this.#size === 1) {
            this.#head = this.#tail = 0;
            this.#free.length = 0;
        } else {
            this.#head = this.#next[head];
        }
        this.#keyMap.delete(k);
        this.#size--;
        return head;
    }
    /**
     * Check if a key is in the cache, without updating the recency of use.
     * Will return false if the item is stale, even though it is technically
     * in the cache.
     *
     * Check if a key is in the cache, without updating the recency of
     * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
     * to `true` in either the options or the constructor.
     *
     * Will return `false` if the item is stale, even though it is technically in
     * the cache. The difference can be determined (if it matters) by using a
     * `status` argument, and inspecting the `has` field.
     *
     * Will not update item age unless
     * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
     */ has(k, hasOptions = {}) {
        const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === undefined) {
                return false;
            }
            if (!this.#isStale(index)) {
                if (updateAgeOnHas) {
                    this.#updateItemAge(index);
                }
                if (status) {
                    status.has = 'hit';
                    this.#statusTTL(status, index);
                }
                return true;
            } else if (status) {
                status.has = 'stale';
                this.#statusTTL(status, index);
            }
        } else if (status) {
            status.has = 'miss';
        }
        return false;
    }
    /**
     * Like {@link LRUCache#get} but doesn't update recency or delete stale
     * items.
     *
     * Returns `undefined` if the item is stale, unless
     * {@link LRUCache.OptionsBase.allowStale} is set.
     */ peek(k, peekOptions = {}) {
        const { allowStale = this.allowStale } = peekOptions;
        const index = this.#keyMap.get(k);
        if (index === undefined || !allowStale && this.#isStale(index)) {
            return;
        }
        const v = this.#valList[index];
        // either stale and allowed, or forcing a refresh of non-stale value
        return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    }
    #backgroundFetch(k, index, options, context) {
        const v = index === undefined ? undefined : this.#valList[index];
        if (this.#isBackgroundFetch(v)) {
            return v;
        }
        const ac = new AC();
        const { signal } = options;
        // when/if our AC signals, then stop listening to theirs.
        signal?.addEventListener('abort', ()=>ac.abort(signal.reason), {
            signal: ac.signal
        });
        const fetchOpts = {
            signal: ac.signal,
            options,
            context
        };
        const cb = (v, updateCache = false)=>{
            const { aborted } = ac.signal;
            const ignoreAbort = options.ignoreFetchAbort && v !== undefined;
            if (options.status) {
                if (aborted && !updateCache) {
                    options.status.fetchAborted = true;
                    options.status.fetchError = ac.signal.reason;
                    if (ignoreAbort) options.status.fetchAbortIgnored = true;
                } else {
                    options.status.fetchResolved = true;
                }
            }
            if (aborted && !ignoreAbort && !updateCache) {
                return fetchFail(ac.signal.reason);
            }
            // either we didn't abort, and are still here, or we did, and ignored
            const bf = p;
            if (this.#valList[index] === p) {
                if (v === undefined) {
                    if (bf.__staleWhileFetching) {
                        this.#valList[index] = bf.__staleWhileFetching;
                    } else {
                        this.#delete(k, 'fetch');
                    }
                } else {
                    if (options.status) options.status.fetchUpdated = true;
                    this.set(k, v, fetchOpts.options);
                }
            }
            return v;
        };
        const eb = (er)=>{
            if (options.status) {
                options.status.fetchRejected = true;
                options.status.fetchError = er;
            }
            return fetchFail(er);
        };
        const fetchFail = (er)=>{
            const { aborted } = ac.signal;
            const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
            const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
            const noDelete = allowStale || options.noDeleteOnFetchRejection;
            const bf = p;
            if (this.#valList[index] === p) {
                // if we allow stale on fetch rejections, then we need to ensure that
                // the stale value is not removed from the cache when the fetch fails.
                const del = !noDelete || bf.__staleWhileFetching === undefined;
                if (del) {
                    this.#delete(k, 'fetch');
                } else if (!allowStaleAborted) {
                    // still replace the *promise* with the stale value,
                    // since we are done with the promise at this point.
                    // leave it untouched if we're still waiting for an
                    // aborted background fetch that hasn't yet returned.
                    this.#valList[index] = bf.__staleWhileFetching;
                }
            }
            if (allowStale) {
                if (options.status && bf.__staleWhileFetching !== undefined) {
                    options.status.returnedStale = true;
                }
                return bf.__staleWhileFetching;
            } else if (bf.__returned === bf) {
                throw er;
            }
        };
        const pcall = (res, rej)=>{
            const fmp = this.#fetchMethod?.(k, v, fetchOpts);
            if (fmp && fmp instanceof Promise) {
                fmp.then((v)=>res(v === undefined ? undefined : v), rej);
            }
            // ignored, we go until we finish, regardless.
            // defer check until we are actually aborting,
            // so fetchMethod can override.
            ac.signal.addEventListener('abort', ()=>{
                if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
                    res(undefined);
                    // when it eventually resolves, update the cache.
                    if (options.allowStaleOnFetchAbort) {
                        res = (v)=>cb(v, true);
                    }
                }
            });
        };
        if (options.status) options.status.fetchDispatched = true;
        const p = new Promise(pcall).then(cb, eb);
        const bf = Object.assign(p, {
            __abortController: ac,
            __staleWhileFetching: v,
            __returned: undefined
        });
        if (index === undefined) {
            // internal, don't expose status.
            this.set(k, bf, {
                ...fetchOpts.options,
                status: undefined
            });
            index = this.#keyMap.get(k);
        } else {
            this.#valList[index] = bf;
        }
        return bf;
    }
    #isBackgroundFetch(p) {
        if (!this.#hasFetchMethod) return false;
        const b = p;
        return !!b && b instanceof Promise && b.hasOwnProperty('__staleWhileFetching') && b.__abortController instanceof AC;
    }
    async fetch(k, fetchOptions = {}) {
        const { // get options
        allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, // set options
        ttl = this.ttl, noDisposeOnSet = this.noDisposeOnSet, size = 0, sizeCalculation = this.sizeCalculation, noUpdateTTL = this.noUpdateTTL, // fetch exclusive options
        noDeleteOnFetchRejection = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection = this.allowStaleOnFetchRejection, ignoreFetchAbort = this.ignoreFetchAbort, allowStaleOnFetchAbort = this.allowStaleOnFetchAbort, context, forceRefresh = false, status, signal } = fetchOptions;
        if (!this.#hasFetchMethod) {
            if (status) status.fetch = 'get';
            return this.get(k, {
                allowStale,
                updateAgeOnGet,
                noDeleteOnStaleGet,
                status
            });
        }
        const options = {
            allowStale,
            updateAgeOnGet,
            noDeleteOnStaleGet,
            ttl,
            noDisposeOnSet,
            size,
            sizeCalculation,
            noUpdateTTL,
            noDeleteOnFetchRejection,
            allowStaleOnFetchRejection,
            allowStaleOnFetchAbort,
            ignoreFetchAbort,
            status,
            signal
        };
        let index = this.#keyMap.get(k);
        if (index === undefined) {
            if (status) status.fetch = 'miss';
            const p = this.#backgroundFetch(k, index, options, context);
            return p.__returned = p;
        } else {
            // in cache, maybe already fetching
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                const stale = allowStale && v.__staleWhileFetching !== undefined;
                if (status) {
                    status.fetch = 'inflight';
                    if (stale) status.returnedStale = true;
                }
                return stale ? v.__staleWhileFetching : v.__returned = v;
            }
            // if we force a refresh, that means do NOT serve the cached value,
            // unless we are already in the process of refreshing the cache.
            const isStale = this.#isStale(index);
            if (!forceRefresh && !isStale) {
                if (status) status.fetch = 'hit';
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                if (status) this.#statusTTL(status, index);
                return v;
            }
            // ok, it is stale or a forced refresh, and not already fetching.
            // refresh the cache.
            const p = this.#backgroundFetch(k, index, options, context);
            const hasStale = p.__staleWhileFetching !== undefined;
            const staleVal = hasStale && allowStale;
            if (status) {
                status.fetch = isStale ? 'stale' : 'refresh';
                if (staleVal && isStale) status.returnedStale = true;
            }
            return staleVal ? p.__staleWhileFetching : p.__returned = p;
        }
    }
    async forceFetch(k, fetchOptions = {}) {
        const v = await this.fetch(k, fetchOptions);
        if (v === undefined) throw new Error('fetch() returned undefined');
        return v;
    }
    memo(k, memoOptions = {}) {
        const memoMethod = this.#memoMethod;
        if (!memoMethod) {
            throw new Error('no memoMethod provided to constructor');
        }
        const { context, forceRefresh, ...options } = memoOptions;
        const v = this.get(k, options);
        if (!forceRefresh && v !== undefined) return v;
        const vv = memoMethod(k, v, {
            options,
            context
        });
        this.set(k, vv, options);
        return vv;
    }
    /**
     * Return a value from the cache. Will update the recency of the cache
     * entry found.
     *
     * If the key is not found, get() will return `undefined`.
     */ get(k, getOptions = {}) {
        const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const value = this.#valList[index];
            const fetching = this.#isBackgroundFetch(value);
            if (status) this.#statusTTL(status, index);
            if (this.#isStale(index)) {
                if (status) status.get = 'stale';
                // delete only if not an in-flight background fetch
                if (!fetching) {
                    if (!noDeleteOnStaleGet) {
                        this.#delete(k, 'expire');
                    }
                    if (status && allowStale) status.returnedStale = true;
                    return allowStale ? value : undefined;
                } else {
                    if (status && allowStale && value.__staleWhileFetching !== undefined) {
                        status.returnedStale = true;
                    }
                    return allowStale ? value.__staleWhileFetching : undefined;
                }
            } else {
                if (status) status.get = 'hit';
                // if we're currently fetching it, we don't actually have it yet
                // it's not stale, which means this isn't a staleWhileRefetching.
                // If it's not stale, and fetching, AND has a __staleWhileFetching
                // value, then that means the user fetched with {forceRefresh:true},
                // so it's safe to return that value.
                if (fetching) {
                    return value.__staleWhileFetching;
                }
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                return value;
            }
        } else if (status) {
            status.get = 'miss';
        }
    }
    #connect(p, n) {
        this.#prev[n] = p;
        this.#next[p] = n;
    }
    #moveToTail(index) {
        // if tail already, nothing to do
        // if head, move head to next[index]
        // else
        //   move next[prev[index]] to next[index] (head has no prev)
        //   move prev[next[index]] to prev[index]
        // prev[index] = tail
        // next[tail] = index
        // tail = index
        if (index !== this.#tail) {
            if (index === this.#head) {
                this.#head = this.#next[index];
            } else {
                this.#connect(this.#prev[index], this.#next[index]);
            }
            this.#connect(this.#tail, index);
            this.#tail = index;
        }
    }
    /**
     * Deletes a key out of the cache.
     *
     * Returns true if the key was deleted, false otherwise.
     */ delete(k) {
        return this.#delete(k, 'delete');
    }
    #delete(k, reason) {
        let deleted = false;
        if (this.#size !== 0) {
            const index = this.#keyMap.get(k);
            if (index !== undefined) {
                deleted = true;
                if (this.#size === 1) {
                    this.#clear(reason);
                } else {
                    this.#removeItemSize(index);
                    const v = this.#valList[index];
                    if (this.#isBackgroundFetch(v)) {
                        v.__abortController.abort(new Error('deleted'));
                    } else if (this.#hasDispose || this.#hasDisposeAfter) {
                        if (this.#hasDispose) {
                            this.#dispose?.(v, k, reason);
                        }
                        if (this.#hasDisposeAfter) {
                            this.#disposed?.push([
                                v,
                                k,
                                reason
                            ]);
                        }
                    }
                    this.#keyMap.delete(k);
                    this.#keyList[index] = undefined;
                    this.#valList[index] = undefined;
                    if (index === this.#tail) {
                        this.#tail = this.#prev[index];
                    } else if (index === this.#head) {
                        this.#head = this.#next[index];
                    } else {
                        const pi = this.#prev[index];
                        this.#next[pi] = this.#next[index];
                        const ni = this.#next[index];
                        this.#prev[ni] = this.#prev[index];
                    }
                    this.#size--;
                    this.#free.push(index);
                }
            }
        }
        if (this.#hasDisposeAfter && this.#disposed?.length) {
            const dt = this.#disposed;
            let task;
            while(task = dt?.shift()){
                this.#disposeAfter?.(...task);
            }
        }
        return deleted;
    }
    /**
     * Clear the cache entirely, throwing away all values.
     */ clear() {
        return this.#clear('delete');
    }
    #clear(reason) {
        for (const index of this.#rindexes({
            allowStale: true
        })){
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                v.__abortController.abort(new Error('deleted'));
            } else {
                const k = this.#keyList[index];
                if (this.#hasDispose) {
                    this.#dispose?.(v, k, reason);
                }
                if (this.#hasDisposeAfter) {
                    this.#disposed?.push([
                        v,
                        k,
                        reason
                    ]);
                }
            }
        }
        this.#keyMap.clear();
        this.#valList.fill(undefined);
        this.#keyList.fill(undefined);
        if (this.#ttls && this.#starts) {
            this.#ttls.fill(0);
            this.#starts.fill(0);
        }
        if (this.#sizes) {
            this.#sizes.fill(0);
        }
        this.#head = 0;
        this.#tail = 0;
        this.#free.length = 0;
        this.#calculatedSize = 0;
        this.#size = 0;
        if (this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while(task = dt?.shift()){
                this.#disposeAfter?.(...task);
            }
        }
    }
}
exports.LRUCache = LRUCache;
}),
"[project]/node_modules/number-allocator/lib/number-allocator.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Takatoshi Kondo 2021
//
// Distributed under the MIT License
const SortedSet = __turbopack_context__.r("[project]/node_modules/js-sdsl/dist/esm/index.js [app-route] (ecmascript)").OrderedSet;
const debugTrace = __turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)")('number-allocator:trace');
const debugError = __turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)")('number-allocator:error');
/**
 * Interval constructor
 * @constructor
 * @param {Number} low  - The lowest value of the interval
 * @param {Number} high - The highest value of the interval
 */ function Interval(low, high) {
    this.low = low;
    this.high = high;
}
Interval.prototype.equals = function(other) {
    return this.low === other.low && this.high === other.high;
};
Interval.prototype.compare = function(other) {
    if (this.low < other.low && this.high < other.low) return -1;
    if (other.low < this.low && other.high < this.low) return 1;
    return 0;
};
/**
 * NumberAllocator constructor.
 * The all numbers are set to vacant status.
 * Time Complexity O(1)
 * @constructor
 * @param {Number} min  - The maximum number of allocatable. The number must be integer.
 * @param {Number} maxh - The minimum number of allocatable. The number must be integer.
 */ function NumberAllocator(min, max) {
    if (!(this instanceof NumberAllocator)) {
        return new NumberAllocator(min, max);
    }
    this.min = min;
    this.max = max;
    this.ss = new SortedSet([], (lhs, rhs)=>{
        return lhs.compare(rhs);
    });
    debugTrace('Create');
    this.clear();
}
/**
 * Get the first vacant number. The status of the number is not updated.
 * Time Complexity O(1)
 * @return {Number} - The first vacant number. If all numbers are occupied, return null.
 *                    When alloc() is called then the same value will be allocated.
 */ NumberAllocator.prototype.firstVacant = function() {
    if (this.ss.size() === 0) return null;
    return this.ss.front().low;
};
/**
 * Allocate the first vacant number. The number become occupied status.
 * Time Complexity O(1)
 * @return {Number} - The first vacant number. If all numbers are occupied, return null.
 */ NumberAllocator.prototype.alloc = function() {
    if (this.ss.size() === 0) {
        debugTrace('alloc():empty');
        return null;
    }
    const it = this.ss.begin();
    const low = it.pointer.low;
    const high = it.pointer.high;
    const num = low;
    if (num + 1 <= high) {
        // x|----|
        this.ss.updateKeyByIterator(it, new Interval(low + 1, high));
    } else {
        this.ss.eraseElementByPos(0);
    }
    debugTrace('alloc():' + num);
    return num;
};
/**
 * Use the number. The number become occupied status.
 * If the number has already been occupied, then return false.
 * Time Complexity O(logN) : N is the number of intervals (not numbers)
 * @param {Number} num - The number to request use.
 * @return {Boolean} - If `num` was not occupied, then return true, otherwise return false.
 */ NumberAllocator.prototype.use = function(num) {
    const key = new Interval(num, num);
    const it = this.ss.lowerBound(key);
    if (!it.equals(this.ss.end())) {
        const low = it.pointer.low;
        const high = it.pointer.high;
        if (it.pointer.equals(key)) {
            // |x|
            this.ss.eraseElementByIterator(it);
            debugTrace('use():' + num);
            return true;
        }
        // x |-----|
        if (low > num) return false;
        // |x----|
        if (low === num) {
            // x|----|
            this.ss.updateKeyByIterator(it, new Interval(low + 1, high));
            debugTrace('use():' + num);
            return true;
        }
        // |----x|
        if (high === num) {
            // |----|x
            this.ss.updateKeyByIterator(it, new Interval(low, high - 1));
            debugTrace('use():' + num);
            return true;
        }
        // |--x--|
        // x|--|
        this.ss.updateKeyByIterator(it, new Interval(num + 1, high));
        // |--|x|--|
        this.ss.insert(new Interval(low, num - 1));
        debugTrace('use():' + num);
        return true;
    }
    debugTrace('use():failed');
    return false;
};
/**
 * Deallocate the number. The number become vacant status.
 * Time Complexity O(logN) : N is the number of intervals (not numbers)
 * @param {Number} num - The number to deallocate. The number must be occupied status.
 *                       In other words, the number must be allocated by alloc() or occupied be use().
 */ NumberAllocator.prototype.free = function(num) {
    if (num < this.min || num > this.max) {
        debugError('free():' + num + ' is out of range');
        return;
    }
    const key = new Interval(num, num);
    const it = this.ss.upperBound(key);
    if (it.equals(this.ss.end())) {
        // ....v
        if (it.equals(this.ss.begin())) {
            // Insert new interval
            this.ss.insert(key);
            return;
        }
        it.pre();
        const low = it.pointer.high;
        const high = it.pointer.high;
        if (high + 1 === num) {
            // Concat to left
            this.ss.updateKeyByIterator(it, new Interval(low, num));
        } else {
            // Insert new interval
            this.ss.insert(key);
        }
    } else {
        if (it.equals(this.ss.begin())) {
            // v....
            if (num + 1 === it.pointer.low) {
                // Concat to right
                const high = it.pointer.high;
                this.ss.updateKeyByIterator(it, new Interval(num, high));
            } else {
                // Insert new interval
                this.ss.insert(key);
            }
        } else {
            // ..v..
            const rLow = it.pointer.low;
            const rHigh = it.pointer.high;
            it.pre();
            const lLow = it.pointer.low;
            const lHigh = it.pointer.high;
            if (lHigh + 1 === num) {
                if (num + 1 === rLow) {
                    // Concat to left and right
                    this.ss.eraseElementByIterator(it);
                    this.ss.updateKeyByIterator(it, new Interval(lLow, rHigh));
                } else {
                    // Concat to left
                    this.ss.updateKeyByIterator(it, new Interval(lLow, num));
                }
            } else {
                if (num + 1 === rLow) {
                    // Concat to right
                    this.ss.eraseElementByIterator(it.next());
                    this.ss.insert(new Interval(num, rHigh));
                } else {
                    // Insert new interval
                    this.ss.insert(key);
                }
            }
        }
    }
    debugTrace('free():' + num);
};
/**
 * Clear all occupied numbers.
 * The all numbers are set to vacant status.
 * Time Complexity O(1)
 */ NumberAllocator.prototype.clear = function() {
    debugTrace('clear()');
    this.ss.clear();
    this.ss.insert(new Interval(this.min, this.max));
};
/**
 * Get the number of intervals. Interval is internal structure of this library.
 * This function is for debugging.
 * Time Complexity O(1)
 * @return {Number} - The number of intervals.
 */ NumberAllocator.prototype.intervalCount = function() {
    return this.ss.size();
};
/**
 * Dump the internal structor of the library.
 * This function is for debugging.
 * Time Complexity O(N) : N is the number of intervals (not numbers)
 */ NumberAllocator.prototype.dump = function() {
    console.log('length:' + this.ss.size());
    for (const element of this.ss){
        console.log(element);
    }
};
module.exports = NumberAllocator;
}),
"[project]/node_modules/number-allocator/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Copyright Takatoshi Kondo 2021
//
// Distributed under the MIT License
const NumberAllocator = __turbopack_context__.r("[project]/node_modules/number-allocator/lib/number-allocator.js [app-route] (ecmascript)");
module.exports.NumberAllocator = NumberAllocator;
}),
"[project]/node_modules/fast-unique-numbers/build/es2019/factories/add-unique-number.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAddUniqueNumber",
    ()=>createAddUniqueNumber
]);
const createAddUniqueNumber = (generateUniqueNumber)=>{
    return (set)=>{
        const number = generateUniqueNumber(set);
        set.add(number);
        return number;
    };
};
}),
"[project]/node_modules/fast-unique-numbers/build/es2019/factories/cache.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCache",
    ()=>createCache
]);
const createCache = (lastNumberWeakMap)=>{
    return (collection, nextNumber)=>{
        lastNumberWeakMap.set(collection, nextNumber);
        return nextNumber;
    };
};
}),
"[project]/node_modules/fast-unique-numbers/build/es2019/factories/generate-unique-number.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createGenerateUniqueNumber",
    ()=>createGenerateUniqueNumber
]);
/*
 * The value of the constant Number.MAX_SAFE_INTEGER equals (2 ** 53 - 1) but it
 * is fairly new.
 */ const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER === undefined ? 9007199254740991 : Number.MAX_SAFE_INTEGER;
const TWO_TO_THE_POWER_OF_TWENTY_NINE = 536870912;
const TWO_TO_THE_POWER_OF_THIRTY = TWO_TO_THE_POWER_OF_TWENTY_NINE * 2;
const createGenerateUniqueNumber = (cache, lastNumberWeakMap)=>{
    return (collection)=>{
        const lastNumber = lastNumberWeakMap.get(collection);
        /*
         * Let's try the cheapest algorithm first. It might fail to produce a new
         * number, but it is so cheap that it is okay to take the risk. Just
         * increase the last number by one or reset it to 0 if we reached the upper
         * bound of SMIs (which stands for small integers). When the last number is
         * unknown it is assumed that the collection contains zero based consecutive
         * numbers.
         */ let nextNumber = lastNumber === undefined ? collection.size : lastNumber < TWO_TO_THE_POWER_OF_THIRTY ? lastNumber + 1 : 0;
        if (!collection.has(nextNumber)) {
            return cache(collection, nextNumber);
        }
        /*
         * If there are less than half of 2 ** 30 numbers stored in the collection,
         * the chance to generate a new random number in the range from 0 to 2 ** 30
         * is at least 50%. It's benifitial to use only SMIs because they perform
         * much better in any environment based on V8.
         */ if (collection.size < TWO_TO_THE_POWER_OF_TWENTY_NINE) {
            while(collection.has(nextNumber)){
                nextNumber = Math.floor(Math.random() * TWO_TO_THE_POWER_OF_THIRTY);
            }
            return cache(collection, nextNumber);
        }
        // Quickly check if there is a theoretical chance to generate a new number.
        if (collection.size > MAX_SAFE_INTEGER) {
            throw new Error('Congratulations, you created a collection of unique numbers which uses all available integers!');
        }
        // Otherwise use the full scale of safely usable integers.
        while(collection.has(nextNumber)){
            nextNumber = Math.floor(Math.random() * MAX_SAFE_INTEGER);
        }
        return cache(collection, nextNumber);
    };
};
}),
"[project]/node_modules/fast-unique-numbers/build/es2019/module.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addUniqueNumber",
    ()=>addUniqueNumber,
    "generateUniqueNumber",
    ()=>generateUniqueNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$factories$2f$add$2d$unique$2d$number$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fast-unique-numbers/build/es2019/factories/add-unique-number.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$factories$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fast-unique-numbers/build/es2019/factories/cache.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$factories$2f$generate$2d$unique$2d$number$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fast-unique-numbers/build/es2019/factories/generate-unique-number.js [app-route] (ecmascript)");
;
;
;
const LAST_NUMBER_WEAK_MAP = new WeakMap();
const cache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$factories$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createCache"])(LAST_NUMBER_WEAK_MAP);
const generateUniqueNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$factories$2f$generate$2d$unique$2d$number$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createGenerateUniqueNumber"])(cache, LAST_NUMBER_WEAK_MAP);
const addUniqueNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$factories$2f$add$2d$unique$2d$number$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAddUniqueNumber"])(generateUniqueNumber);
;
}),
"[project]/node_modules/broker-factory/build/es2019/factories/create-broker.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createBrokerFactory",
    ()=>createBrokerFactory
]);
const createBrokerFactory = (createOrGetOngoingRequests, extendBrokerImplementation, generateUniqueNumber, isMessagePort)=>(brokerImplementation)=>{
        const fullBrokerImplementation = extendBrokerImplementation(brokerImplementation);
        return (sender)=>{
            const ongoingRequests = createOrGetOngoingRequests(sender);
            sender.addEventListener('message', ({ data: message })=>{
                const { id } = message;
                if (id !== null && ongoingRequests.has(id)) {
                    const { reject, resolve } = ongoingRequests.get(id);
                    ongoingRequests.delete(id);
                    if (message.error === undefined) {
                        resolve(message.result);
                    } else {
                        reject(new Error(message.error.message));
                    }
                }
            });
            if (isMessagePort(sender)) {
                sender.start();
            }
            const call = (method, params = null, transferables = [])=>{
                return new Promise((resolve, reject)=>{
                    const id = generateUniqueNumber(ongoingRequests);
                    ongoingRequests.set(id, {
                        reject,
                        resolve
                    });
                    if (params === null) {
                        sender.postMessage({
                            id,
                            method
                        }, transferables);
                    } else {
                        sender.postMessage({
                            id,
                            method,
                            params
                        }, transferables);
                    }
                });
            };
            const notify = (method, params, transferables = [])=>{
                sender.postMessage({
                    id: null,
                    method,
                    params
                }, transferables);
            };
            let functions = {};
            for (const [key, handler] of Object.entries(fullBrokerImplementation)){
                functions = {
                    ...functions,
                    [key]: handler({
                        call,
                        notify
                    })
                };
            }
            return {
                ...functions
            };
        };
    };
}),
"[project]/node_modules/broker-factory/build/es2019/factories/create-or-get-ongoing-requests.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCreateOrGetOngoingRequests",
    ()=>createCreateOrGetOngoingRequests
]);
const createCreateOrGetOngoingRequests = (ongoingRequestsMap)=>(sender)=>{
        if (ongoingRequestsMap.has(sender)) {
            // @todo TypeScript needs to be convinced that has() works as expected.
            return ongoingRequestsMap.get(sender);
        }
        const ongoingRequests = new Map();
        ongoingRequestsMap.set(sender, ongoingRequests);
        return ongoingRequests;
    };
}),
"[project]/node_modules/broker-factory/build/es2019/factories/extend-broker-implementation.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createExtendBrokerImplementation",
    ()=>createExtendBrokerImplementation
]);
const createExtendBrokerImplementation = (portMap)=>(partialBrokerImplementation)=>({
            ...partialBrokerImplementation,
            connect: ({ call })=>{
                return async ()=>{
                    const { port1, port2 } = new MessageChannel();
                    const portId = await call('connect', {
                        port: port1
                    }, [
                        port1
                    ]);
                    portMap.set(port2, portId);
                    return port2;
                };
            },
            disconnect: ({ call })=>{
                return async (port)=>{
                    const portId = portMap.get(port);
                    if (portId === undefined) {
                        throw new Error('The given port is not connected.');
                    }
                    await call('disconnect', {
                        portId
                    });
                };
            },
            isSupported: ({ call })=>{
                return ()=>call('isSupported');
            }
        });
}),
"[project]/node_modules/broker-factory/build/es2019/guards/message-port.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isMessagePort",
    ()=>isMessagePort
]);
const isMessagePort = (sender)=>{
    return typeof sender.start === 'function';
};
}),
"[project]/node_modules/broker-factory/build/es2019/interfaces/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
}),
"[project]/node_modules/broker-factory/build/es2019/types/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
}),
"[project]/node_modules/broker-factory/build/es2019/module.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createBroker",
    ()=>createBroker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fast-unique-numbers/build/es2019/module.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$factories$2f$create$2d$broker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/broker-factory/build/es2019/factories/create-broker.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$factories$2f$create$2d$or$2d$get$2d$ongoing$2d$requests$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/broker-factory/build/es2019/factories/create-or-get-ongoing-requests.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$factories$2f$extend$2d$broker$2d$implementation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/broker-factory/build/es2019/factories/extend-broker-implementation.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$guards$2f$message$2d$port$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/broker-factory/build/es2019/guards/message-port.js [app-route] (ecmascript)");
/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$interfaces$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/broker-factory/build/es2019/interfaces/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$types$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/broker-factory/build/es2019/types/index.js [app-route] (ecmascript) <locals>");
;
;
;
;
;
;
;
const createBroker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$factories$2f$create$2d$broker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createBrokerFactory"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$factories$2f$create$2d$or$2d$get$2d$ongoing$2d$requests$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createCreateOrGetOngoingRequests"])(new WeakMap()), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$factories$2f$extend$2d$broker$2d$implementation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createExtendBrokerImplementation"])(new WeakMap()), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateUniqueNumber"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$guards$2f$message$2d$port$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isMessagePort"]);
}),
"[project]/node_modules/worker-timers-broker/build/es2019/factories/clear-interval-factory.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClearIntervalFactory",
    ()=>createClearIntervalFactory
]);
const createClearIntervalFactory = (scheduledIntervalsState)=>(clear)=>(timerId)=>{
            if (typeof scheduledIntervalsState.get(timerId) === 'symbol') {
                scheduledIntervalsState.set(timerId, null);
                clear(timerId).then(()=>{
                    scheduledIntervalsState.delete(timerId);
                });
            }
        };
}),
"[project]/node_modules/worker-timers-broker/build/es2019/factories/clear-timeout-factory.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClearTimeoutFactory",
    ()=>createClearTimeoutFactory
]);
const createClearTimeoutFactory = (scheduledTimeoutsState)=>(clear)=>(timerId)=>{
            if (typeof scheduledTimeoutsState.get(timerId) === 'symbol') {
                scheduledTimeoutsState.set(timerId, null);
                clear(timerId).then(()=>{
                    scheduledTimeoutsState.delete(timerId);
                });
            }
        };
}),
"[project]/node_modules/worker-timers-broker/build/es2019/factories/set-interval-factory.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSetIntervalFactory",
    ()=>createSetIntervalFactory
]);
const createSetIntervalFactory = (generateUniqueNumber, scheduledIntervalsState)=>(set)=>(func, delay = 0, ...args)=>{
            const symbol = Symbol();
            const timerId = generateUniqueNumber(scheduledIntervalsState);
            scheduledIntervalsState.set(timerId, symbol);
            const schedule = ()=>set(delay, timerId).then(()=>{
                    const state = scheduledIntervalsState.get(timerId);
                    if (state === undefined) {
                        throw new Error('The timer is in an undefined state.');
                    }
                    if (state === symbol) {
                        func(...args);
                        // Doublecheck if the interval should still be rescheduled because it could have been cleared inside of func().
                        if (scheduledIntervalsState.get(timerId) === symbol) {
                            schedule();
                        }
                    }
                });
            schedule();
            return timerId;
        };
}),
"[project]/node_modules/worker-timers-broker/build/es2019/factories/set-timeout-factory.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSetTimeoutFactory",
    ()=>createSetTimeoutFactory
]);
const createSetTimeoutFactory = (generateUniqueNumber, scheduledTimeoutsState)=>(set)=>(func, delay = 0, ...args)=>{
            const symbol = Symbol();
            const timerId = generateUniqueNumber(scheduledTimeoutsState);
            scheduledTimeoutsState.set(timerId, symbol);
            set(delay, timerId).then(()=>{
                const state = scheduledTimeoutsState.get(timerId);
                if (state === undefined) {
                    throw new Error('The timer is in an undefined state.');
                }
                if (state === symbol) {
                    // A timeout can be savely deleted because it is only called once.
                    scheduledTimeoutsState.delete(timerId);
                    func(...args);
                }
            });
            return timerId;
        };
}),
"[project]/node_modules/worker-timers-broker/build/es2019/interfaces/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
}),
"[project]/node_modules/worker-timers-broker/build/es2019/types/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
}),
"[project]/node_modules/worker-timers-broker/build/es2019/module.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "load",
    ()=>load,
    "wrap",
    ()=>wrap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/broker-factory/build/es2019/module.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fast-unique-numbers/build/es2019/module.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$factories$2f$clear$2d$interval$2d$factory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/worker-timers-broker/build/es2019/factories/clear-interval-factory.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$factories$2f$clear$2d$timeout$2d$factory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/worker-timers-broker/build/es2019/factories/clear-timeout-factory.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$factories$2f$set$2d$interval$2d$factory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/worker-timers-broker/build/es2019/factories/set-interval-factory.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$factories$2f$set$2d$timeout$2d$factory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/worker-timers-broker/build/es2019/factories/set-timeout-factory.js [app-route] (ecmascript)");
/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$interfaces$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/worker-timers-broker/build/es2019/interfaces/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$types$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/worker-timers-broker/build/es2019/types/index.js [app-route] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
// Prefilling the Maps with a function indexed by zero is necessary to be compliant with the specification.
const scheduledIntervalsState = new Map([
    [
        0,
        null
    ]
]); // tslint:disable-line no-empty
const scheduledTimeoutsState = new Map([
    [
        0,
        null
    ]
]); // tslint:disable-line no-empty
const createClearInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$factories$2f$clear$2d$interval$2d$factory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClearIntervalFactory"])(scheduledIntervalsState);
const createClearTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$factories$2f$clear$2d$timeout$2d$factory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClearTimeoutFactory"])(scheduledTimeoutsState);
const createSetInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$factories$2f$set$2d$interval$2d$factory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSetIntervalFactory"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateUniqueNumber"], scheduledIntervalsState);
const createSetTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$factories$2f$set$2d$timeout$2d$factory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSetTimeoutFactory"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fast$2d$unique$2d$numbers$2f$build$2f$es2019$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateUniqueNumber"], scheduledTimeoutsState);
const wrap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$broker$2d$factory$2f$build$2f$es2019$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createBroker"])({
    clearInterval: ({ call })=>createClearInterval((timerId)=>call('clear', {
                timerId,
                timerType: 'interval'
            })),
    clearTimeout: ({ call })=>createClearTimeout((timerId)=>call('clear', {
                timerId,
                timerType: 'timeout'
            })),
    setInterval: ({ call })=>createSetInterval((delay, timerId)=>call('set', {
                delay,
                now: performance.timeOrigin + performance.now(),
                timerId,
                timerType: 'interval'
            })),
    setTimeout: ({ call })=>createSetTimeout((delay, timerId)=>call('set', {
                delay,
                now: performance.timeOrigin + performance.now(),
                timerId,
                timerType: 'timeout'
            }))
});
const load = (url)=>{
    const worker = new Worker(url);
    return wrap(worker);
};
}),
"[project]/node_modules/worker-timers/build/es2019/factories/load-or-return-broker.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createLoadOrReturnBroker",
    ()=>createLoadOrReturnBroker
]);
const createLoadOrReturnBroker = (loadBroker, worker)=>{
    let broker = null;
    return ()=>{
        if (broker !== null) {
            return broker;
        }
        const blob = new Blob([
            worker
        ], {
            type: 'application/javascript; charset=utf-8'
        });
        const url = URL.createObjectURL(blob);
        broker = loadBroker(url);
        // Bug #1: Edge up until v18 didn't like the URL to be revoked directly.
        setTimeout(()=>URL.revokeObjectURL(url));
        return broker;
    };
};
}),
"[project]/node_modules/worker-timers/build/es2019/worker/worker.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// This is the minified and stringified code of the worker-timers-worker package.
__turbopack_context__.s([
    "worker",
    ()=>worker
]);
const worker = `(()=>{var e={455(e,t){!function(e){"use strict";var t=function(e){return function(t){var r=e(t);return t.add(r),r}},r=function(e){return function(t,r){return e.set(t,r),r}},n=void 0===Number.MAX_SAFE_INTEGER?9007199254740991:Number.MAX_SAFE_INTEGER,o=536870912,s=2*o,a=function(e,t){return function(r){var a=t.get(r),i=void 0===a?r.size:a<s?a+1:0;if(!r.has(i))return e(r,i);if(r.size<o){for(;r.has(i);)i=Math.floor(Math.random()*s);return e(r,i)}if(r.size>n)throw new Error("Congratulations, you created a collection of unique numbers which uses all available integers!");for(;r.has(i);)i=Math.floor(Math.random()*n);return e(r,i)}},i=new WeakMap,u=r(i),c=a(u,i),l=t(c);e.addUniqueNumber=l,e.generateUniqueNumber=c}(t)}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,r),s.exports}(()=>{"use strict";const e=-32603,t=-32602,n=-32601,o=(e,t)=>Object.assign(new Error(e),{status:t}),s=t=>o('The handler of the method called "'.concat(t,'" returned an unexpected result.'),e),a=(t,r)=>async({data:{id:a,method:i,params:u}})=>{const c=r[i];try{if(void 0===c)throw(e=>o('The requested method called "'.concat(e,'" is not supported.'),n))(i);const r=void 0===u?c():c(u);if(void 0===r)throw(t=>o('The handler of the method called "'.concat(t,'" returned no required result.'),e))(i);const l=r instanceof Promise?await r:r;if(null===a){if(void 0!==l.result)throw s(i)}else{if(void 0===l.result)throw s(i);const{result:e,transferables:r=[]}=l;t.postMessage({id:a,result:e},r)}}catch(e){const{message:r,status:n=-32603}=e;t.postMessage({error:{code:n,message:r},id:a})}};var i=r(455);const u=new Map,c=(e,r,n)=>({...r,connect:({port:t})=>{t.start();const n=e(t,r),o=(0,i.generateUniqueNumber)(u);return u.set(o,()=>{n(),t.close(),u.delete(o)}),{result:o}},disconnect:({portId:e})=>{const r=u.get(e);if(void 0===r)throw(e=>o('The specified parameter called "portId" with the given value "'.concat(e,'" does not identify a port connected to this worker.'),t))(e);return r(),{result:null}},isSupported:async()=>{if(await new Promise(e=>{const t=new ArrayBuffer(0),{port1:r,port2:n}=new MessageChannel;r.onmessage=({data:t})=>e(null!==t),n.postMessage(t,[t])})){const e=n();return{result:e instanceof Promise?await e:e}}return{result:!1}}}),l=(e,t,r=()=>!0)=>{const n=c(l,t,r),o=a(e,n);return e.addEventListener("message",o),()=>e.removeEventListener("message",o)},d=(e,t)=>r=>{const n=t.get(r);if(void 0===n)return Promise.resolve(!1);const[o,s]=n;return e(o),t.delete(r),s(!1),Promise.resolve(!0)},m=(e,t,r,n)=>(o,s,a)=>{const i=o+s-t.timeOrigin,u=i-t.now();return new Promise(t=>{e.set(a,[r(n,u,i,e,t,a),t])})},f=new Map,h=d(globalThis.clearTimeout,f),p=new Map,v=d(globalThis.clearTimeout,p),w=((e,t)=>{const r=(n,o,s,a)=>{const i=n-e.now();i>0?o.set(a,[t(r,i,n,o,s,a),s]):(o.delete(a),s(!0))};return r})(performance,globalThis.setTimeout),g=m(f,performance,globalThis.setTimeout,w),T=m(p,performance,globalThis.setTimeout,w);l(self,{clear:async({timerId:e,timerType:t})=>({result:await("interval"===t?h(e):v(e))}),set:async({delay:e,now:t,timerId:r,timerType:n})=>({result:await("interval"===n?g:T)(e,t,r)})})})()})();`; // tslint:disable-line:max-line-length
}),
"[project]/node_modules/worker-timers/build/es2019/module.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearInterval",
    ()=>clearInterval,
    "clearTimeout",
    ()=>clearTimeout,
    "setInterval",
    ()=>setInterval,
    "setTimeout",
    ()=>setTimeout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/worker-timers-broker/build/es2019/module.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2f$build$2f$es2019$2f$factories$2f$load$2d$or$2d$return$2d$broker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/worker-timers/build/es2019/factories/load-or-return-broker.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2f$build$2f$es2019$2f$worker$2f$worker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/worker-timers/build/es2019/worker/worker.js [app-route] (ecmascript)");
;
;
;
const loadOrReturnBroker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2f$build$2f$es2019$2f$factories$2f$load$2d$or$2d$return$2d$broker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createLoadOrReturnBroker"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2d$broker$2f$build$2f$es2019$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["load"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$worker$2d$timers$2f$build$2f$es2019$2f$worker$2f$worker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["worker"]);
const clearInterval = (timerId)=>loadOrReturnBroker().clearInterval(timerId);
const clearTimeout = (timerId)=>loadOrReturnBroker().clearTimeout(timerId);
const setInterval = (...args)=>loadOrReturnBroker().setInterval(...args);
const setTimeout = (...args)=>loadOrReturnBroker().setTimeout(...args);
}),
"[project]/node_modules/smart-buffer/build/utils.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const buffer_1 = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
/**
 * Error strings
 */ const ERRORS = {
    INVALID_ENCODING: 'Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.',
    INVALID_SMARTBUFFER_SIZE: 'Invalid size provided. Size must be a valid integer greater than zero.',
    INVALID_SMARTBUFFER_BUFFER: 'Invalid Buffer provided in SmartBufferOptions.',
    INVALID_SMARTBUFFER_OBJECT: 'Invalid SmartBufferOptions object supplied to SmartBuffer constructor or factory methods.',
    INVALID_OFFSET: 'An invalid offset value was provided.',
    INVALID_OFFSET_NON_NUMBER: 'An invalid offset value was provided. A numeric value is required.',
    INVALID_LENGTH: 'An invalid length value was provided.',
    INVALID_LENGTH_NON_NUMBER: 'An invalid length value was provived. A numeric value is required.',
    INVALID_TARGET_OFFSET: 'Target offset is beyond the bounds of the internal SmartBuffer data.',
    INVALID_TARGET_LENGTH: 'Specified length value moves cursor beyong the bounds of the internal SmartBuffer data.',
    INVALID_READ_BEYOND_BOUNDS: 'Attempted to read beyond the bounds of the managed data.',
    INVALID_WRITE_BEYOND_BOUNDS: 'Attempted to write beyond the bounds of the managed data.'
};
exports.ERRORS = ERRORS;
/**
 * Checks if a given encoding is a valid Buffer encoding. (Throws an exception if check fails)
 *
 * @param { String } encoding The encoding string to check.
 */ function checkEncoding(encoding) {
    if (!buffer_1.Buffer.isEncoding(encoding)) {
        throw new Error(ERRORS.INVALID_ENCODING);
    }
}
exports.checkEncoding = checkEncoding;
/**
 * Checks if a given number is a finite integer. (Throws an exception if check fails)
 *
 * @param { Number } value The number value to check.
 */ function isFiniteInteger(value) {
    return typeof value === 'number' && isFinite(value) && isInteger(value);
}
exports.isFiniteInteger = isFiniteInteger;
/**
 * Checks if an offset/length value is valid. (Throws an exception if check fails)
 *
 * @param value The value to check.
 * @param offset True if checking an offset, false if checking a length.
 */ function checkOffsetOrLengthValue(value, offset) {
    if (typeof value === 'number') {
        // Check for non finite/non integers
        if (!isFiniteInteger(value) || value < 0) {
            throw new Error(offset ? ERRORS.INVALID_OFFSET : ERRORS.INVALID_LENGTH);
        }
    } else {
        throw new Error(offset ? ERRORS.INVALID_OFFSET_NON_NUMBER : ERRORS.INVALID_LENGTH_NON_NUMBER);
    }
}
/**
 * Checks if a length value is valid. (Throws an exception if check fails)
 *
 * @param { Number } length The value to check.
 */ function checkLengthValue(length) {
    checkOffsetOrLengthValue(length, false);
}
exports.checkLengthValue = checkLengthValue;
/**
 * Checks if a offset value is valid. (Throws an exception if check fails)
 *
 * @param { Number } offset The value to check.
 */ function checkOffsetValue(offset) {
    checkOffsetOrLengthValue(offset, true);
}
exports.checkOffsetValue = checkOffsetValue;
/**
 * Checks if a target offset value is out of bounds. (Throws an exception if check fails)
 *
 * @param { Number } offset The offset value to check.
 * @param { SmartBuffer } buff The SmartBuffer instance to check against.
 */ function checkTargetOffset(offset, buff) {
    if (offset < 0 || offset > buff.length) {
        throw new Error(ERRORS.INVALID_TARGET_OFFSET);
    }
}
exports.checkTargetOffset = checkTargetOffset;
/**
 * Determines whether a given number is a integer.
 * @param value The number to check.
 */ function isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}
/**
 * Throws if Node.js version is too low to support bigint
 */ function bigIntAndBufferInt64Check(bufferMethod) {
    if (typeof BigInt === 'undefined') {
        throw new Error('Platform does not support JS BigInt type.');
    }
    if (typeof buffer_1.Buffer.prototype[bufferMethod] === 'undefined') {
        throw new Error(`Platform does not support Buffer.prototype.${bufferMethod}.`);
    }
}
exports.bigIntAndBufferInt64Check = bigIntAndBufferInt64Check;
}),
"[project]/node_modules/smart-buffer/build/smartbuffer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const utils_1 = __turbopack_context__.r("[project]/node_modules/smart-buffer/build/utils.js [app-route] (ecmascript)");
// The default Buffer size if one is not provided.
const DEFAULT_SMARTBUFFER_SIZE = 4096;
// The default string encoding to use for reading/writing strings.
const DEFAULT_SMARTBUFFER_ENCODING = 'utf8';
class SmartBuffer {
    /**
     * Creates a new SmartBuffer instance.
     *
     * @param options { SmartBufferOptions } The SmartBufferOptions to apply to this instance.
     */ constructor(options){
        this.length = 0;
        this._encoding = DEFAULT_SMARTBUFFER_ENCODING;
        this._writeOffset = 0;
        this._readOffset = 0;
        if (SmartBuffer.isSmartBufferOptions(options)) {
            // Checks for encoding
            if (options.encoding) {
                utils_1.checkEncoding(options.encoding);
                this._encoding = options.encoding;
            }
            // Checks for initial size length
            if (options.size) {
                if (utils_1.isFiniteInteger(options.size) && options.size > 0) {
                    this._buff = Buffer.allocUnsafe(options.size);
                } else {
                    throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_SIZE);
                }
            // Check for initial Buffer
            } else if (options.buff) {
                if (Buffer.isBuffer(options.buff)) {
                    this._buff = options.buff;
                    this.length = options.buff.length;
                } else {
                    throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_BUFFER);
                }
            } else {
                this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
            }
        } else {
            // If something was passed but it's not a SmartBufferOptions object
            if (typeof options !== 'undefined') {
                throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_OBJECT);
            }
            // Otherwise default to sane options
            this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
        }
    }
    /**
     * Creates a new SmartBuffer instance with the provided internal Buffer size and optional encoding.
     *
     * @param size { Number } The size of the internal Buffer.
     * @param encoding { String } The BufferEncoding to use for strings.
     *
     * @return { SmartBuffer }
     */ static fromSize(size, encoding) {
        return new this({
            size: size,
            encoding: encoding
        });
    }
    /**
     * Creates a new SmartBuffer instance with the provided Buffer and optional encoding.
     *
     * @param buffer { Buffer } The Buffer to use as the internal Buffer value.
     * @param encoding { String } The BufferEncoding to use for strings.
     *
     * @return { SmartBuffer }
     */ static fromBuffer(buff, encoding) {
        return new this({
            buff: buff,
            encoding: encoding
        });
    }
    /**
     * Creates a new SmartBuffer instance with the provided SmartBufferOptions options.
     *
     * @param options { SmartBufferOptions } The options to use when creating the SmartBuffer instance.
     */ static fromOptions(options) {
        return new this(options);
    }
    /**
     * Type checking function that determines if an object is a SmartBufferOptions object.
     */ static isSmartBufferOptions(options) {
        const castOptions = options;
        return castOptions && (castOptions.encoding !== undefined || castOptions.size !== undefined || castOptions.buff !== undefined);
    }
    // Signed integers
    /**
     * Reads an Int8 value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt8(offset) {
        return this._readNumberValue(Buffer.prototype.readInt8, 1, offset);
    }
    /**
     * Reads an Int16BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt16BE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt16BE, 2, offset);
    }
    /**
     * Reads an Int16LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt16LE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt16LE, 2, offset);
    }
    /**
     * Reads an Int32BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt32BE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt32BE, 4, offset);
    }
    /**
     * Reads an Int32LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt32LE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt32LE, 4, offset);
    }
    /**
     * Reads a BigInt64BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */ readBigInt64BE(offset) {
        utils_1.bigIntAndBufferInt64Check('readBigInt64BE');
        return this._readNumberValue(Buffer.prototype.readBigInt64BE, 8, offset);
    }
    /**
     * Reads a BigInt64LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */ readBigInt64LE(offset) {
        utils_1.bigIntAndBufferInt64Check('readBigInt64LE');
        return this._readNumberValue(Buffer.prototype.readBigInt64LE, 8, offset);
    }
    /**
     * Writes an Int8 value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt8(value, offset) {
        this._writeNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
        return this;
    }
    /**
     * Inserts an Int8 value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt8(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
    }
    /**
     * Writes an Int16BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt16BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
    }
    /**
     * Inserts an Int16BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt16BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
    }
    /**
     * Writes an Int16LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt16LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
    }
    /**
     * Inserts an Int16LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt16LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
    }
    /**
     * Writes an Int32BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt32BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
    }
    /**
     * Inserts an Int32BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt32BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
    }
    /**
     * Writes an Int32LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt32LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
    }
    /**
     * Inserts an Int32LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt32LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
    }
    /**
     * Writes a BigInt64BE value to the current write position (or at optional offset).
     *
     * @param value { BigInt } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeBigInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigInt64BE');
        return this._writeNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
    }
    /**
     * Inserts a BigInt64BE value at the given offset value.
     *
     * @param value { BigInt } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertBigInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigInt64BE');
        return this._insertNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
    }
    /**
     * Writes a BigInt64LE value to the current write position (or at optional offset).
     *
     * @param value { BigInt } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeBigInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigInt64LE');
        return this._writeNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
    }
    /**
     * Inserts a Int64LE value at the given offset value.
     *
     * @param value { BigInt } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertBigInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigInt64LE');
        return this._insertNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
    }
    // Unsigned Integers
    /**
     * Reads an UInt8 value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt8(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt8, 1, offset);
    }
    /**
     * Reads an UInt16BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt16BE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt16BE, 2, offset);
    }
    /**
     * Reads an UInt16LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt16LE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt16LE, 2, offset);
    }
    /**
     * Reads an UInt32BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt32BE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt32BE, 4, offset);
    }
    /**
     * Reads an UInt32LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt32LE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt32LE, 4, offset);
    }
    /**
     * Reads a BigUInt64BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */ readBigUInt64BE(offset) {
        utils_1.bigIntAndBufferInt64Check('readBigUInt64BE');
        return this._readNumberValue(Buffer.prototype.readBigUInt64BE, 8, offset);
    }
    /**
     * Reads a BigUInt64LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */ readBigUInt64LE(offset) {
        utils_1.bigIntAndBufferInt64Check('readBigUInt64LE');
        return this._readNumberValue(Buffer.prototype.readBigUInt64LE, 8, offset);
    }
    /**
     * Writes an UInt8 value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt8(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
    }
    /**
     * Inserts an UInt8 value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt8(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
    }
    /**
     * Writes an UInt16BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt16BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
    }
    /**
     * Inserts an UInt16BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt16BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
    }
    /**
     * Writes an UInt16LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt16LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
    }
    /**
     * Inserts an UInt16LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt16LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
    }
    /**
     * Writes an UInt32BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt32BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
    }
    /**
     * Inserts an UInt32BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt32BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
    }
    /**
     * Writes an UInt32LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt32LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
    }
    /**
     * Inserts an UInt32LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt32LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
    }
    /**
     * Writes a BigUInt64BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeBigUInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigUInt64BE');
        return this._writeNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
    }
    /**
     * Inserts a BigUInt64BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertBigUInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigUInt64BE');
        return this._insertNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
    }
    /**
     * Writes a BigUInt64LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeBigUInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigUInt64LE');
        return this._writeNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
    }
    /**
     * Inserts a BigUInt64LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertBigUInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigUInt64LE');
        return this._insertNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
    }
    // Floating Point
    /**
     * Reads an FloatBE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readFloatBE(offset) {
        return this._readNumberValue(Buffer.prototype.readFloatBE, 4, offset);
    }
    /**
     * Reads an FloatLE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readFloatLE(offset) {
        return this._readNumberValue(Buffer.prototype.readFloatLE, 4, offset);
    }
    /**
     * Writes a FloatBE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeFloatBE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
    }
    /**
     * Inserts a FloatBE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertFloatBE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
    }
    /**
     * Writes a FloatLE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeFloatLE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
    }
    /**
     * Inserts a FloatLE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertFloatLE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
    }
    // Double Floating Point
    /**
     * Reads an DoublEBE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readDoubleBE(offset) {
        return this._readNumberValue(Buffer.prototype.readDoubleBE, 8, offset);
    }
    /**
     * Reads an DoubleLE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readDoubleLE(offset) {
        return this._readNumberValue(Buffer.prototype.readDoubleLE, 8, offset);
    }
    /**
     * Writes a DoubleBE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeDoubleBE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
    }
    /**
     * Inserts a DoubleBE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertDoubleBE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
    }
    /**
     * Writes a DoubleLE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeDoubleLE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
    }
    /**
     * Inserts a DoubleLE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertDoubleLE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
    }
    // Strings
    /**
     * Reads a String from the current read position.
     *
     * @param arg1 { Number | String } The number of bytes to read as a String, or the BufferEncoding to use for
     *             the string (Defaults to instance level encoding).
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     *
     * @return { String }
     */ readString(arg1, encoding) {
        let lengthVal;
        // Length provided
        if (typeof arg1 === 'number') {
            utils_1.checkLengthValue(arg1);
            lengthVal = Math.min(arg1, this.length - this._readOffset);
        } else {
            encoding = arg1;
            lengthVal = this.length - this._readOffset;
        }
        // Check encoding
        if (typeof encoding !== 'undefined') {
            utils_1.checkEncoding(encoding);
        }
        const value = this._buff.slice(this._readOffset, this._readOffset + lengthVal).toString(encoding || this._encoding);
        this._readOffset += lengthVal;
        return value;
    }
    /**
     * Inserts a String
     *
     * @param value { String } The String value to insert.
     * @param offset { Number } The offset to insert the string at.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */ insertString(value, offset, encoding) {
        utils_1.checkOffsetValue(offset);
        return this._handleString(value, true, offset, encoding);
    }
    /**
     * Writes a String
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string at, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */ writeString(value, arg2, encoding) {
        return this._handleString(value, false, arg2, encoding);
    }
    /**
     * Reads a null-terminated String from the current read position.
     *
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     *
     * @return { String }
     */ readStringNT(encoding) {
        if (typeof encoding !== 'undefined') {
            utils_1.checkEncoding(encoding);
        }
        // Set null character position to the end SmartBuffer instance.
        let nullPos = this.length;
        // Find next null character (if one is not found, default from above is used)
        for(let i = this._readOffset; i < this.length; i++){
            if (this._buff[i] === 0x00) {
                nullPos = i;
                break;
            }
        }
        // Read string value
        const value = this._buff.slice(this._readOffset, nullPos);
        // Increment internal Buffer read offset
        this._readOffset = nullPos + 1;
        return value.toString(encoding || this._encoding);
    }
    /**
     * Inserts a null-terminated String.
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */ insertStringNT(value, offset, encoding) {
        utils_1.checkOffsetValue(offset);
        // Write Values
        this.insertString(value, offset, encoding);
        this.insertUInt8(0x00, offset + value.length);
        return this;
    }
    /**
     * Writes a null-terminated String.
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */ writeStringNT(value, arg2, encoding) {
        // Write Values
        this.writeString(value, arg2, encoding);
        this.writeUInt8(0x00, typeof arg2 === 'number' ? arg2 + value.length : this.writeOffset);
        return this;
    }
    // Buffers
    /**
     * Reads a Buffer from the internal read position.
     *
     * @param length { Number } The length of data to read as a Buffer.
     *
     * @return { Buffer }
     */ readBuffer(length) {
        if (typeof length !== 'undefined') {
            utils_1.checkLengthValue(length);
        }
        const lengthVal = typeof length === 'number' ? length : this.length;
        const endPoint = Math.min(this.length, this._readOffset + lengthVal);
        // Read buffer value
        const value = this._buff.slice(this._readOffset, endPoint);
        // Increment internal Buffer read offset
        this._readOffset = endPoint;
        return value;
    }
    /**
     * Writes a Buffer to the current write position.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */ insertBuffer(value, offset) {
        utils_1.checkOffsetValue(offset);
        return this._handleBuffer(value, true, offset);
    }
    /**
     * Writes a Buffer to the current write position.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */ writeBuffer(value, offset) {
        return this._handleBuffer(value, false, offset);
    }
    /**
     * Reads a null-terminated Buffer from the current read poisiton.
     *
     * @return { Buffer }
     */ readBufferNT() {
        // Set null character position to the end SmartBuffer instance.
        let nullPos = this.length;
        // Find next null character (if one is not found, default from above is used)
        for(let i = this._readOffset; i < this.length; i++){
            if (this._buff[i] === 0x00) {
                nullPos = i;
                break;
            }
        }
        // Read value
        const value = this._buff.slice(this._readOffset, nullPos);
        // Increment internal Buffer read offset
        this._readOffset = nullPos + 1;
        return value;
    }
    /**
     * Inserts a null-terminated Buffer.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */ insertBufferNT(value, offset) {
        utils_1.checkOffsetValue(offset);
        // Write Values
        this.insertBuffer(value, offset);
        this.insertUInt8(0x00, offset + value.length);
        return this;
    }
    /**
     * Writes a null-terminated Buffer.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */ writeBufferNT(value, offset) {
        // Checks for valid numberic value;
        if (typeof offset !== 'undefined') {
            utils_1.checkOffsetValue(offset);
        }
        // Write Values
        this.writeBuffer(value, offset);
        this.writeUInt8(0x00, typeof offset === 'number' ? offset + value.length : this._writeOffset);
        return this;
    }
    /**
     * Clears the SmartBuffer instance to its original empty state.
     */ clear() {
        this._writeOffset = 0;
        this._readOffset = 0;
        this.length = 0;
        return this;
    }
    /**
     * Gets the remaining data left to be read from the SmartBuffer instance.
     *
     * @return { Number }
     */ remaining() {
        return this.length - this._readOffset;
    }
    /**
     * Gets the current read offset value of the SmartBuffer instance.
     *
     * @return { Number }
     */ get readOffset() {
        return this._readOffset;
    }
    /**
     * Sets the read offset value of the SmartBuffer instance.
     *
     * @param offset { Number } - The offset value to set.
     */ set readOffset(offset) {
        utils_1.checkOffsetValue(offset);
        // Check for bounds.
        utils_1.checkTargetOffset(offset, this);
        this._readOffset = offset;
    }
    /**
     * Gets the current write offset value of the SmartBuffer instance.
     *
     * @return { Number }
     */ get writeOffset() {
        return this._writeOffset;
    }
    /**
     * Sets the write offset value of the SmartBuffer instance.
     *
     * @param offset { Number } - The offset value to set.
     */ set writeOffset(offset) {
        utils_1.checkOffsetValue(offset);
        // Check for bounds.
        utils_1.checkTargetOffset(offset, this);
        this._writeOffset = offset;
    }
    /**
     * Gets the currently set string encoding of the SmartBuffer instance.
     *
     * @return { BufferEncoding } The string Buffer encoding currently set.
     */ get encoding() {
        return this._encoding;
    }
    /**
     * Sets the string encoding of the SmartBuffer instance.
     *
     * @param encoding { BufferEncoding } The string Buffer encoding to set.
     */ set encoding(encoding) {
        utils_1.checkEncoding(encoding);
        this._encoding = encoding;
    }
    /**
     * Gets the underlying internal Buffer. (This includes unmanaged data in the Buffer)
     *
     * @return { Buffer } The Buffer value.
     */ get internalBuffer() {
        return this._buff;
    }
    /**
     * Gets the value of the internal managed Buffer (Includes managed data only)
     *
     * @param { Buffer }
     */ toBuffer() {
        return this._buff.slice(0, this.length);
    }
    /**
     * Gets the String value of the internal managed Buffer
     *
     * @param encoding { String } The BufferEncoding to display the Buffer as (defaults to instance level encoding).
     */ toString(encoding) {
        const encodingVal = typeof encoding === 'string' ? encoding : this._encoding;
        // Check for invalid encoding.
        utils_1.checkEncoding(encodingVal);
        return this._buff.toString(encodingVal, 0, this.length);
    }
    /**
     * Destroys the SmartBuffer instance.
     */ destroy() {
        this.clear();
        return this;
    }
    /**
     * Handles inserting and writing strings.
     *
     * @param value { String } The String value to insert.
     * @param isInsert { Boolean } True if inserting a string, false if writing.
     * @param arg2 { Number | String } The offset to insert the string at, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     */ _handleString(value, isInsert, arg3, encoding) {
        let offsetVal = this._writeOffset;
        let encodingVal = this._encoding;
        // Check for offset
        if (typeof arg3 === 'number') {
            offsetVal = arg3;
        // Check for encoding
        } else if (typeof arg3 === 'string') {
            utils_1.checkEncoding(arg3);
            encodingVal = arg3;
        }
        // Check for encoding (third param)
        if (typeof encoding === 'string') {
            utils_1.checkEncoding(encoding);
            encodingVal = encoding;
        }
        // Calculate bytelength of string.
        const byteLength = Buffer.byteLength(value, encodingVal);
        // Ensure there is enough internal Buffer capacity.
        if (isInsert) {
            this.ensureInsertable(byteLength, offsetVal);
        } else {
            this._ensureWriteable(byteLength, offsetVal);
        }
        // Write value
        this._buff.write(value, offsetVal, byteLength, encodingVal);
        // Increment internal Buffer write offset;
        if (isInsert) {
            this._writeOffset += byteLength;
        } else {
            // If an offset was given, check to see if we wrote beyond the current writeOffset.
            if (typeof arg3 === 'number') {
                this._writeOffset = Math.max(this._writeOffset, offsetVal + byteLength);
            } else {
                // If no offset was given, we wrote to the end of the SmartBuffer so increment writeOffset.
                this._writeOffset += byteLength;
            }
        }
        return this;
    }
    /**
     * Handles writing or insert of a Buffer.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     */ _handleBuffer(value, isInsert, offset) {
        const offsetVal = typeof offset === 'number' ? offset : this._writeOffset;
        // Ensure there is enough internal Buffer capacity.
        if (isInsert) {
            this.ensureInsertable(value.length, offsetVal);
        } else {
            this._ensureWriteable(value.length, offsetVal);
        }
        // Write buffer value
        value.copy(this._buff, offsetVal);
        // Increment internal Buffer write offset;
        if (isInsert) {
            this._writeOffset += value.length;
        } else {
            // If an offset was given, check to see if we wrote beyond the current writeOffset.
            if (typeof offset === 'number') {
                this._writeOffset = Math.max(this._writeOffset, offsetVal + value.length);
            } else {
                // If no offset was given, we wrote to the end of the SmartBuffer so increment writeOffset.
                this._writeOffset += value.length;
            }
        }
        return this;
    }
    /**
     * Ensures that the internal Buffer is large enough to read data.
     *
     * @param length { Number } The length of the data that needs to be read.
     * @param offset { Number } The offset of the data that needs to be read.
     */ ensureReadable(length, offset) {
        // Offset value defaults to managed read offset.
        let offsetVal = this._readOffset;
        // If an offset was provided, use it.
        if (typeof offset !== 'undefined') {
            // Checks for valid numberic value;
            utils_1.checkOffsetValue(offset);
            // Overide with custom offset.
            offsetVal = offset;
        }
        // Checks if offset is below zero, or the offset+length offset is beyond the total length of the managed data.
        if (offsetVal < 0 || offsetVal + length > this.length) {
            throw new Error(utils_1.ERRORS.INVALID_READ_BEYOND_BOUNDS);
        }
    }
    /**
     * Ensures that the internal Buffer is large enough to insert data.
     *
     * @param dataLength { Number } The length of the data that needs to be written.
     * @param offset { Number } The offset of the data to be written.
     */ ensureInsertable(dataLength, offset) {
        // Checks for valid numberic value;
        utils_1.checkOffsetValue(offset);
        // Ensure there is enough internal Buffer capacity.
        this._ensureCapacity(this.length + dataLength);
        // If an offset was provided and its not the very end of the buffer, copy data into appropriate location in regards to the offset.
        if (offset < this.length) {
            this._buff.copy(this._buff, offset + dataLength, offset, this._buff.length);
        }
        // Adjust tracked smart buffer length
        if (offset + dataLength > this.length) {
            this.length = offset + dataLength;
        } else {
            this.length += dataLength;
        }
    }
    /**
     * Ensures that the internal Buffer is large enough to write data.
     *
     * @param dataLength { Number } The length of the data that needs to be written.
     * @param offset { Number } The offset of the data to be written (defaults to writeOffset).
     */ _ensureWriteable(dataLength, offset) {
        const offsetVal = typeof offset === 'number' ? offset : this._writeOffset;
        // Ensure enough capacity to write data.
        this._ensureCapacity(offsetVal + dataLength);
        // Adjust SmartBuffer length (if offset + length is larger than managed length, adjust length)
        if (offsetVal + dataLength > this.length) {
            this.length = offsetVal + dataLength;
        }
    }
    /**
     * Ensures that the internal Buffer is large enough to write at least the given amount of data.
     *
     * @param minLength { Number } The minimum length of the data needs to be written.
     */ _ensureCapacity(minLength) {
        const oldLength = this._buff.length;
        if (minLength > oldLength) {
            let data = this._buff;
            let newLength = oldLength * 3 / 2 + 1;
            if (newLength < minLength) {
                newLength = minLength;
            }
            this._buff = Buffer.allocUnsafe(newLength);
            data.copy(this._buff, 0, 0, oldLength);
        }
    }
    /**
     * Reads a numeric number value using the provided function.
     *
     * @typeparam T { number | bigint } The type of the value to be read
     *
     * @param func { Function(offset: number) => number } The function to read data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes read.
     * @param offset { Number } The offset to read from (optional). When this is not provided, the managed readOffset is used instead.
     *
     * @returns { T } the number value
     */ _readNumberValue(func, byteSize, offset) {
        this.ensureReadable(byteSize, offset);
        // Call Buffer.readXXXX();
        const value = func.call(this._buff, typeof offset === 'number' ? offset : this._readOffset);
        // Adjust internal read offset if an optional read offset was not provided.
        if (typeof offset === 'undefined') {
            this._readOffset += byteSize;
        }
        return value;
    }
    /**
     * Inserts a numeric number value based on the given offset and value.
     *
     * @typeparam T { number | bigint } The type of the value to be written
     *
     * @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes written.
     * @param value { T } The number value to write.
     * @param offset { Number } the offset to write the number at (REQUIRED).
     *
     * @returns SmartBuffer this buffer
     */ _insertNumberValue(func, byteSize, value, offset) {
        // Check for invalid offset values.
        utils_1.checkOffsetValue(offset);
        // Ensure there is enough internal Buffer capacity. (raw offset is passed)
        this.ensureInsertable(byteSize, offset);
        // Call buffer.writeXXXX();
        func.call(this._buff, value, offset);
        // Adjusts internally managed write offset.
        this._writeOffset += byteSize;
        return this;
    }
    /**
     * Writes a numeric number value based on the given offset and value.
     *
     * @typeparam T { number | bigint } The type of the value to be written
     *
     * @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes written.
     * @param value { T } The number value to write.
     * @param offset { Number } the offset to write the number at (REQUIRED).
     *
     * @returns SmartBuffer this buffer
     */ _writeNumberValue(func, byteSize, value, offset) {
        // If an offset was provided, validate it.
        if (typeof offset === 'number') {
            // Check if we're writing beyond the bounds of the managed data.
            if (offset < 0) {
                throw new Error(utils_1.ERRORS.INVALID_WRITE_BEYOND_BOUNDS);
            }
            utils_1.checkOffsetValue(offset);
        }
        // Default to writeOffset if no offset value was given.
        const offsetVal = typeof offset === 'number' ? offset : this._writeOffset;
        // Ensure there is enough internal Buffer capacity. (raw offset is passed)
        this._ensureWriteable(byteSize, offsetVal);
        func.call(this._buff, value, offsetVal);
        // If an offset was given, check to see if we wrote beyond the current writeOffset.
        if (typeof offset === 'number') {
            this._writeOffset = Math.max(this._writeOffset, offsetVal + byteSize);
        } else {
            // If no numeric offset was given, we wrote to the end of the SmartBuffer so increment writeOffset.
            this._writeOffset += byteSize;
        }
        return this;
    }
}
exports.SmartBuffer = SmartBuffer;
}),
"[project]/node_modules/socks/build/common/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SOCKS5_NO_ACCEPTABLE_AUTH = exports.SOCKS5_CUSTOM_AUTH_END = exports.SOCKS5_CUSTOM_AUTH_START = exports.SOCKS_INCOMING_PACKET_SIZES = exports.SocksClientState = exports.Socks5Response = exports.Socks5HostType = exports.Socks5Auth = exports.Socks4Response = exports.SocksCommand = exports.ERRORS = exports.DEFAULT_TIMEOUT = void 0;
const DEFAULT_TIMEOUT = 30000;
exports.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;
// prettier-ignore
const ERRORS = {
    InvalidSocksCommand: 'An invalid SOCKS command was provided. Valid options are connect, bind, and associate.',
    InvalidSocksCommandForOperation: 'An invalid SOCKS command was provided. Only a subset of commands are supported for this operation.',
    InvalidSocksCommandChain: 'An invalid SOCKS command was provided. Chaining currently only supports the connect command.',
    InvalidSocksClientOptionsDestination: 'An invalid destination host was provided.',
    InvalidSocksClientOptionsExistingSocket: 'An invalid existing socket was provided. This should be an instance of stream.Duplex.',
    InvalidSocksClientOptionsProxy: 'Invalid SOCKS proxy details were provided.',
    InvalidSocksClientOptionsTimeout: 'An invalid timeout value was provided. Please enter a value above 0 (in ms).',
    InvalidSocksClientOptionsProxiesLength: 'At least two socks proxies must be provided for chaining.',
    InvalidSocksClientOptionsCustomAuthRange: 'Custom auth must be a value between 0x80 and 0xFE.',
    InvalidSocksClientOptionsCustomAuthOptions: 'When a custom_auth_method is provided, custom_auth_request_handler, custom_auth_response_size, and custom_auth_response_handler must also be provided and valid.',
    NegotiationError: 'Negotiation error',
    SocketClosed: 'Socket closed',
    ProxyConnectionTimedOut: 'Proxy connection timed out',
    InternalError: 'SocksClient internal error (this should not happen)',
    InvalidSocks4HandshakeResponse: 'Received invalid Socks4 handshake response',
    Socks4ProxyRejectedConnection: 'Socks4 Proxy rejected connection',
    InvalidSocks4IncomingConnectionResponse: 'Socks4 invalid incoming connection response',
    Socks4ProxyRejectedIncomingBoundConnection: 'Socks4 Proxy rejected incoming bound connection',
    InvalidSocks5InitialHandshakeResponse: 'Received invalid Socks5 initial handshake response',
    InvalidSocks5IntiailHandshakeSocksVersion: 'Received invalid Socks5 initial handshake (invalid socks version)',
    InvalidSocks5InitialHandshakeNoAcceptedAuthType: 'Received invalid Socks5 initial handshake (no accepted authentication type)',
    InvalidSocks5InitialHandshakeUnknownAuthType: 'Received invalid Socks5 initial handshake (unknown authentication type)',
    Socks5AuthenticationFailed: 'Socks5 Authentication failed',
    InvalidSocks5FinalHandshake: 'Received invalid Socks5 final handshake response',
    InvalidSocks5FinalHandshakeRejected: 'Socks5 proxy rejected connection',
    InvalidSocks5IncomingConnectionResponse: 'Received invalid Socks5 incoming connection response',
    Socks5ProxyRejectedIncomingBoundConnection: 'Socks5 Proxy rejected incoming bound connection'
};
exports.ERRORS = ERRORS;
const SOCKS_INCOMING_PACKET_SIZES = {
    Socks5InitialHandshakeResponse: 2,
    Socks5UserPassAuthenticationResponse: 2,
    // Command response + incoming connection (bind)
    Socks5ResponseHeader: 5,
    Socks5ResponseIPv4: 10,
    Socks5ResponseIPv6: 22,
    Socks5ResponseHostname: (hostNameLength)=>hostNameLength + 7,
    // Command response + incoming connection (bind)
    Socks4Response: 8
};
exports.SOCKS_INCOMING_PACKET_SIZES = SOCKS_INCOMING_PACKET_SIZES;
var SocksCommand;
(function(SocksCommand) {
    SocksCommand[SocksCommand["connect"] = 1] = "connect";
    SocksCommand[SocksCommand["bind"] = 2] = "bind";
    SocksCommand[SocksCommand["associate"] = 3] = "associate";
})(SocksCommand || (exports.SocksCommand = SocksCommand = {}));
var Socks4Response;
(function(Socks4Response) {
    Socks4Response[Socks4Response["Granted"] = 90] = "Granted";
    Socks4Response[Socks4Response["Failed"] = 91] = "Failed";
    Socks4Response[Socks4Response["Rejected"] = 92] = "Rejected";
    Socks4Response[Socks4Response["RejectedIdent"] = 93] = "RejectedIdent";
})(Socks4Response || (exports.Socks4Response = Socks4Response = {}));
var Socks5Auth;
(function(Socks5Auth) {
    Socks5Auth[Socks5Auth["NoAuth"] = 0] = "NoAuth";
    Socks5Auth[Socks5Auth["GSSApi"] = 1] = "GSSApi";
    Socks5Auth[Socks5Auth["UserPass"] = 2] = "UserPass";
})(Socks5Auth || (exports.Socks5Auth = Socks5Auth = {}));
const SOCKS5_CUSTOM_AUTH_START = 0x80;
exports.SOCKS5_CUSTOM_AUTH_START = SOCKS5_CUSTOM_AUTH_START;
const SOCKS5_CUSTOM_AUTH_END = 0xfe;
exports.SOCKS5_CUSTOM_AUTH_END = SOCKS5_CUSTOM_AUTH_END;
const SOCKS5_NO_ACCEPTABLE_AUTH = 0xff;
exports.SOCKS5_NO_ACCEPTABLE_AUTH = SOCKS5_NO_ACCEPTABLE_AUTH;
var Socks5Response;
(function(Socks5Response) {
    Socks5Response[Socks5Response["Granted"] = 0] = "Granted";
    Socks5Response[Socks5Response["Failure"] = 1] = "Failure";
    Socks5Response[Socks5Response["NotAllowed"] = 2] = "NotAllowed";
    Socks5Response[Socks5Response["NetworkUnreachable"] = 3] = "NetworkUnreachable";
    Socks5Response[Socks5Response["HostUnreachable"] = 4] = "HostUnreachable";
    Socks5Response[Socks5Response["ConnectionRefused"] = 5] = "ConnectionRefused";
    Socks5Response[Socks5Response["TTLExpired"] = 6] = "TTLExpired";
    Socks5Response[Socks5Response["CommandNotSupported"] = 7] = "CommandNotSupported";
    Socks5Response[Socks5Response["AddressNotSupported"] = 8] = "AddressNotSupported";
})(Socks5Response || (exports.Socks5Response = Socks5Response = {}));
var Socks5HostType;
(function(Socks5HostType) {
    Socks5HostType[Socks5HostType["IPv4"] = 1] = "IPv4";
    Socks5HostType[Socks5HostType["Hostname"] = 3] = "Hostname";
    Socks5HostType[Socks5HostType["IPv6"] = 4] = "IPv6";
})(Socks5HostType || (exports.Socks5HostType = Socks5HostType = {}));
var SocksClientState;
(function(SocksClientState) {
    SocksClientState[SocksClientState["Created"] = 0] = "Created";
    SocksClientState[SocksClientState["Connecting"] = 1] = "Connecting";
    SocksClientState[SocksClientState["Connected"] = 2] = "Connected";
    SocksClientState[SocksClientState["SentInitialHandshake"] = 3] = "SentInitialHandshake";
    SocksClientState[SocksClientState["ReceivedInitialHandshakeResponse"] = 4] = "ReceivedInitialHandshakeResponse";
    SocksClientState[SocksClientState["SentAuthentication"] = 5] = "SentAuthentication";
    SocksClientState[SocksClientState["ReceivedAuthenticationResponse"] = 6] = "ReceivedAuthenticationResponse";
    SocksClientState[SocksClientState["SentFinalHandshake"] = 7] = "SentFinalHandshake";
    SocksClientState[SocksClientState["ReceivedFinalResponse"] = 8] = "ReceivedFinalResponse";
    SocksClientState[SocksClientState["BoundWaitingForConnection"] = 9] = "BoundWaitingForConnection";
    SocksClientState[SocksClientState["Established"] = 10] = "Established";
    SocksClientState[SocksClientState["Disconnected"] = 11] = "Disconnected";
    SocksClientState[SocksClientState["Error"] = 99] = "Error";
})(SocksClientState || (exports.SocksClientState = SocksClientState = {}));
}),
"[project]/node_modules/socks/build/common/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.shuffleArray = exports.SocksClientError = void 0;
/**
 * Error wrapper for SocksClient
 */ class SocksClientError extends Error {
    constructor(message, options){
        super(message);
        this.options = options;
    }
}
exports.SocksClientError = SocksClientError;
/**
 * Shuffles a given array.
 * @param array The array to shuffle.
 */ function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [
            array[j],
            array[i]
        ];
    }
}
exports.shuffleArray = shuffleArray;
}),
"[project]/node_modules/socks/build/common/helpers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ipToBuffer = exports.int32ToIpv4 = exports.ipv4ToInt32 = exports.validateSocksClientChainOptions = exports.validateSocksClientOptions = void 0;
const util_1 = __turbopack_context__.r("[project]/node_modules/socks/build/common/util.js [app-route] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/socks/build/common/constants.js [app-route] (ecmascript)");
const stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
const ip_address_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/ip-address.js [app-route] (ecmascript)");
const net = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
/**
 * Validates the provided SocksClientOptions
 * @param options { SocksClientOptions }
 * @param acceptedCommands { string[] } A list of accepted SocksProxy commands.
 */ function validateSocksClientOptions(options, acceptedCommands = [
    'connect',
    'bind',
    'associate'
]) {
    // Check SOCKs command option.
    if (!constants_1.SocksCommand[options.command]) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommand, options);
    }
    // Check SocksCommand for acceptable command.
    if (acceptedCommands.indexOf(options.command) === -1) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandForOperation, options);
    }
    // Check destination
    if (!isValidSocksRemoteHost(options.destination)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
    }
    // Check SOCKS proxy to use
    if (!isValidSocksProxy(options.proxy)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
    }
    // Validate custom auth (if set)
    validateCustomProxyAuth(options.proxy, options);
    // Check timeout
    if (options.timeout && !isValidTimeoutValue(options.timeout)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
    }
    // Check existing_socket (if provided)
    if (options.existing_socket && !(options.existing_socket instanceof stream.Duplex)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsExistingSocket, options);
    }
}
exports.validateSocksClientOptions = validateSocksClientOptions;
/**
 * Validates the SocksClientChainOptions
 * @param options { SocksClientChainOptions }
 */ function validateSocksClientChainOptions(options) {
    // Only connect is supported when chaining.
    if (options.command !== 'connect') {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandChain, options);
    }
    // Check destination
    if (!isValidSocksRemoteHost(options.destination)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
    }
    // Validate proxies (length)
    if (!(options.proxies && Array.isArray(options.proxies) && options.proxies.length >= 2)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxiesLength, options);
    }
    // Validate proxies
    options.proxies.forEach((proxy)=>{
        if (!isValidSocksProxy(proxy)) {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
        }
        // Validate custom auth (if set)
        validateCustomProxyAuth(proxy, options);
    });
    // Check timeout
    if (options.timeout && !isValidTimeoutValue(options.timeout)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
    }
}
exports.validateSocksClientChainOptions = validateSocksClientChainOptions;
function validateCustomProxyAuth(proxy, options) {
    if (proxy.custom_auth_method !== undefined) {
        // Invalid auth method range
        if (proxy.custom_auth_method < constants_1.SOCKS5_CUSTOM_AUTH_START || proxy.custom_auth_method > constants_1.SOCKS5_CUSTOM_AUTH_END) {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthRange, options);
        }
        // Missing custom_auth_request_handler
        if (proxy.custom_auth_request_handler === undefined || typeof proxy.custom_auth_request_handler !== 'function') {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
        }
        // Missing custom_auth_response_size
        if (proxy.custom_auth_response_size === undefined) {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
        }
        // Missing/invalid custom_auth_response_handler
        if (proxy.custom_auth_response_handler === undefined || typeof proxy.custom_auth_response_handler !== 'function') {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
        }
    }
}
/**
 * Validates a SocksRemoteHost
 * @param remoteHost { SocksRemoteHost }
 */ function isValidSocksRemoteHost(remoteHost) {
    return remoteHost && typeof remoteHost.host === 'string' && Buffer.byteLength(remoteHost.host) < 256 && typeof remoteHost.port === 'number' && remoteHost.port >= 0 && remoteHost.port <= 65535;
}
/**
 * Validates a SocksProxy
 * @param proxy { SocksProxy }
 */ function isValidSocksProxy(proxy) {
    return proxy && (typeof proxy.host === 'string' || typeof proxy.ipaddress === 'string') && typeof proxy.port === 'number' && proxy.port >= 0 && proxy.port <= 65535 && (proxy.type === 4 || proxy.type === 5);
}
/**
 * Validates a timeout value.
 * @param value { Number }
 */ function isValidTimeoutValue(value) {
    return typeof value === 'number' && value > 0;
}
function ipv4ToInt32(ip) {
    const address = new ip_address_1.Address4(ip);
    // Convert the IPv4 address parts to an integer
    return address.toArray().reduce((acc, part)=>(acc << 8) + part, 0) >>> 0;
}
exports.ipv4ToInt32 = ipv4ToInt32;
function int32ToIpv4(int32) {
    // Extract each byte (octet) from the 32-bit integer
    const octet1 = int32 >>> 24 & 0xff;
    const octet2 = int32 >>> 16 & 0xff;
    const octet3 = int32 >>> 8 & 0xff;
    const octet4 = int32 & 0xff;
    // Combine the octets into a string in IPv4 format
    return [
        octet1,
        octet2,
        octet3,
        octet4
    ].join('.');
}
exports.int32ToIpv4 = int32ToIpv4;
function ipToBuffer(ip) {
    if (net.isIPv4(ip)) {
        // Handle IPv4 addresses
        const address = new ip_address_1.Address4(ip);
        return Buffer.from(address.toArray());
    } else if (net.isIPv6(ip)) {
        // Handle IPv6 addresses
        const address = new ip_address_1.Address6(ip);
        return Buffer.from(address.canonicalForm().split(':').map((segment)=>segment.padStart(4, '0')).join(''), 'hex');
    } else {
        throw new Error('Invalid IP address format');
    }
}
exports.ipToBuffer = ipToBuffer;
}),
"[project]/node_modules/socks/build/common/receivebuffer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReceiveBuffer = void 0;
class ReceiveBuffer {
    constructor(size = 4096){
        this.buffer = Buffer.allocUnsafe(size);
        this.offset = 0;
        this.originalSize = size;
    }
    get length() {
        return this.offset;
    }
    append(data) {
        if (!Buffer.isBuffer(data)) {
            throw new Error('Attempted to append a non-buffer instance to ReceiveBuffer.');
        }
        if (this.offset + data.length >= this.buffer.length) {
            const tmp = this.buffer;
            this.buffer = Buffer.allocUnsafe(Math.max(this.buffer.length + this.originalSize, this.buffer.length + data.length));
            tmp.copy(this.buffer);
        }
        data.copy(this.buffer, this.offset);
        return this.offset += data.length;
    }
    peek(length) {
        if (length > this.offset) {
            throw new Error('Attempted to read beyond the bounds of the managed internal data.');
        }
        return this.buffer.slice(0, length);
    }
    get(length) {
        if (length > this.offset) {
            throw new Error('Attempted to read beyond the bounds of the managed internal data.');
        }
        const value = Buffer.allocUnsafe(length);
        this.buffer.slice(0, length).copy(value);
        this.buffer.copyWithin(0, length, length + this.offset - length);
        this.offset -= length;
        return value;
    }
}
exports.ReceiveBuffer = ReceiveBuffer;
}),
"[project]/node_modules/socks/build/client/socksclient.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SocksClientError = exports.SocksClient = void 0;
const events_1 = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const net = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
const smart_buffer_1 = __turbopack_context__.r("[project]/node_modules/smart-buffer/build/smartbuffer.js [app-route] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/socks/build/common/constants.js [app-route] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/socks/build/common/helpers.js [app-route] (ecmascript)");
const receivebuffer_1 = __turbopack_context__.r("[project]/node_modules/socks/build/common/receivebuffer.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/socks/build/common/util.js [app-route] (ecmascript)");
Object.defineProperty(exports, "SocksClientError", {
    enumerable: true,
    get: function() {
        return util_1.SocksClientError;
    }
});
const ip_address_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/ip-address.js [app-route] (ecmascript)");
class SocksClient extends events_1.EventEmitter {
    constructor(options){
        super();
        this.options = Object.assign({}, options);
        // Validate SocksClientOptions
        (0, helpers_1.validateSocksClientOptions)(options);
        // Default state
        this.setState(constants_1.SocksClientState.Created);
    }
    /**
     * Creates a new SOCKS connection.
     *
     * Note: Supports callbacks and promises. Only supports the connect command.
     * @param options { SocksClientOptions } Options.
     * @param callback { Function } An optional callback function.
     * @returns { Promise }
     */ static createConnection(options, callback) {
        return new Promise((resolve, reject)=>{
            // Validate SocksClientOptions
            try {
                (0, helpers_1.validateSocksClientOptions)(options, [
                    'connect'
                ]);
            } catch (err) {
                if (typeof callback === 'function') {
                    callback(err);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return resolve(err); // Resolves pending promise (prevents memory leaks).
                } else {
                    return reject(err);
                }
            }
            const client = new SocksClient(options);
            client.connect(options.existing_socket);
            client.once('established', (info)=>{
                client.removeAllListeners();
                if (typeof callback === 'function') {
                    callback(null, info);
                    resolve(info); // Resolves pending promise (prevents memory leaks).
                } else {
                    resolve(info);
                }
            });
            // Error occurred, failed to establish connection.
            client.once('error', (err)=>{
                client.removeAllListeners();
                if (typeof callback === 'function') {
                    callback(err);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve(err); // Resolves pending promise (prevents memory leaks).
                } else {
                    reject(err);
                }
            });
        });
    }
    /**
     * Creates a new SOCKS connection chain to a destination host through 2 or more SOCKS proxies.
     *
     * Note: Supports callbacks and promises. Only supports the connect method.
     * Note: Implemented via createConnection() factory function.
     * @param options { SocksClientChainOptions } Options
     * @param callback { Function } An optional callback function.
     * @returns { Promise }
     */ static createConnectionChain(options, callback) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject)=>__awaiter(this, void 0, void 0, function*() {
                // Validate SocksClientChainOptions
                try {
                    (0, helpers_1.validateSocksClientChainOptions)(options);
                } catch (err) {
                    if (typeof callback === 'function') {
                        callback(err);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return resolve(err); // Resolves pending promise (prevents memory leaks).
                    } else {
                        return reject(err);
                    }
                }
                // Shuffle proxies
                if (options.randomizeChain) {
                    (0, util_1.shuffleArray)(options.proxies);
                }
                try {
                    let sock;
                    for(let i = 0; i < options.proxies.length; i++){
                        const nextProxy = options.proxies[i];
                        // If we've reached the last proxy in the chain, the destination is the actual destination, otherwise it's the next proxy.
                        const nextDestination = i === options.proxies.length - 1 ? options.destination : {
                            host: options.proxies[i + 1].host || options.proxies[i + 1].ipaddress,
                            port: options.proxies[i + 1].port
                        };
                        // Creates the next connection in the chain.
                        const result = yield SocksClient.createConnection({
                            command: 'connect',
                            proxy: nextProxy,
                            destination: nextDestination,
                            existing_socket: sock
                        });
                        // If sock is undefined, assign it here.
                        sock = sock || result.socket;
                    }
                    if (typeof callback === 'function') {
                        callback(null, {
                            socket: sock
                        });
                        resolve({
                            socket: sock
                        }); // Resolves pending promise (prevents memory leaks).
                    } else {
                        resolve({
                            socket: sock
                        });
                    }
                } catch (err) {
                    if (typeof callback === 'function') {
                        callback(err);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        resolve(err); // Resolves pending promise (prevents memory leaks).
                    } else {
                        reject(err);
                    }
                }
            }));
    }
    /**
     * Creates a SOCKS UDP Frame.
     * @param options
     */ static createUDPFrame(options) {
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt16BE(0);
        buff.writeUInt8(options.frameNumber || 0);
        // IPv4/IPv6/Hostname
        if (net.isIPv4(options.remoteHost.host)) {
            buff.writeUInt8(constants_1.Socks5HostType.IPv4);
            buff.writeUInt32BE((0, helpers_1.ipv4ToInt32)(options.remoteHost.host));
        } else if (net.isIPv6(options.remoteHost.host)) {
            buff.writeUInt8(constants_1.Socks5HostType.IPv6);
            buff.writeBuffer((0, helpers_1.ipToBuffer)(options.remoteHost.host));
        } else {
            buff.writeUInt8(constants_1.Socks5HostType.Hostname);
            buff.writeUInt8(Buffer.byteLength(options.remoteHost.host));
            buff.writeString(options.remoteHost.host);
        }
        // Port
        buff.writeUInt16BE(options.remoteHost.port);
        // Data
        buff.writeBuffer(options.data);
        return buff.toBuffer();
    }
    /**
     * Parses a SOCKS UDP frame.
     * @param data
     */ static parseUDPFrame(data) {
        const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
        buff.readOffset = 2;
        const frameNumber = buff.readUInt8();
        const hostType = buff.readUInt8();
        let remoteHost;
        if (hostType === constants_1.Socks5HostType.IPv4) {
            remoteHost = (0, helpers_1.int32ToIpv4)(buff.readUInt32BE());
        } else if (hostType === constants_1.Socks5HostType.IPv6) {
            remoteHost = ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm();
        } else {
            remoteHost = buff.readString(buff.readUInt8());
        }
        const remotePort = buff.readUInt16BE();
        return {
            frameNumber,
            remoteHost: {
                host: remoteHost,
                port: remotePort
            },
            data: buff.readBuffer()
        };
    }
    /**
     * Internal state setter. If the SocksClient is in an error state, it cannot be changed to a non error state.
     */ setState(newState) {
        if (this.state !== constants_1.SocksClientState.Error) {
            this.state = newState;
        }
    }
    /**
     * Starts the connection establishment to the proxy and destination.
     * @param existingSocket Connected socket to use instead of creating a new one (internal use).
     */ connect(existingSocket) {
        this.onDataReceived = (data)=>this.onDataReceivedHandler(data);
        this.onClose = ()=>this.onCloseHandler();
        this.onError = (err)=>this.onErrorHandler(err);
        this.onConnect = ()=>this.onConnectHandler();
        // Start timeout timer (defaults to 30 seconds)
        const timer = setTimeout(()=>this.onEstablishedTimeout(), this.options.timeout || constants_1.DEFAULT_TIMEOUT);
        // check whether unref is available as it differs from browser to NodeJS (#33)
        if (timer.unref && typeof timer.unref === 'function') {
            timer.unref();
        }
        // If an existing socket is provided, use it to negotiate SOCKS handshake. Otherwise create a new Socket.
        if (existingSocket) {
            this.socket = existingSocket;
        } else {
            this.socket = new net.Socket();
        }
        // Attach Socket error handlers.
        this.socket.once('close', this.onClose);
        this.socket.once('error', this.onError);
        this.socket.once('connect', this.onConnect);
        this.socket.on('data', this.onDataReceived);
        this.setState(constants_1.SocksClientState.Connecting);
        this.receiveBuffer = new receivebuffer_1.ReceiveBuffer();
        if (existingSocket) {
            this.socket.emit('connect');
        } else {
            this.socket.connect(this.getSocketOptions());
            if (this.options.set_tcp_nodelay !== undefined && this.options.set_tcp_nodelay !== null) {
                this.socket.setNoDelay(!!this.options.set_tcp_nodelay);
            }
        }
        // Listen for established event so we can re-emit any excess data received during handshakes.
        this.prependOnceListener('established', (info)=>{
            setImmediate(()=>{
                if (this.receiveBuffer.length > 0) {
                    const excessData = this.receiveBuffer.get(this.receiveBuffer.length);
                    info.socket.emit('data', excessData);
                }
                info.socket.resume();
            });
        });
    }
    // Socket options (defaults host/port to options.proxy.host/options.proxy.port)
    getSocketOptions() {
        return Object.assign(Object.assign({}, this.options.socket_options), {
            host: this.options.proxy.host || this.options.proxy.ipaddress,
            port: this.options.proxy.port
        });
    }
    /**
     * Handles internal Socks timeout callback.
     * Note: If the Socks client is not BoundWaitingForConnection or Established, the connection will be closed.
     */ onEstablishedTimeout() {
        if (this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.BoundWaitingForConnection) {
            this.closeSocket(constants_1.ERRORS.ProxyConnectionTimedOut);
        }
    }
    /**
     * Handles Socket connect event.
     */ onConnectHandler() {
        this.setState(constants_1.SocksClientState.Connected);
        // Send initial handshake.
        if (this.options.proxy.type === 4) {
            this.sendSocks4InitialHandshake();
        } else {
            this.sendSocks5InitialHandshake();
        }
        this.setState(constants_1.SocksClientState.SentInitialHandshake);
    }
    /**
     * Handles Socket data event.
     * @param data
     */ onDataReceivedHandler(data) {
        /*
          All received data is appended to a ReceiveBuffer.
          This makes sure that all the data we need is received before we attempt to process it.
        */ this.receiveBuffer.append(data);
        // Process data that we have.
        this.processData();
    }
    /**
     * Handles processing of the data we have received.
     */ processData() {
        // If we have enough data to process the next step in the SOCKS handshake, proceed.
        while(this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.Error && this.receiveBuffer.length >= this.nextRequiredPacketBufferSize){
            // Sent initial handshake, waiting for response.
            if (this.state === constants_1.SocksClientState.SentInitialHandshake) {
                if (this.options.proxy.type === 4) {
                    // Socks v4 only has one handshake response.
                    this.handleSocks4FinalHandshakeResponse();
                } else {
                    // Socks v5 has two handshakes, handle initial one here.
                    this.handleInitialSocks5HandshakeResponse();
                }
            // Sent auth request for Socks v5, waiting for response.
            } else if (this.state === constants_1.SocksClientState.SentAuthentication) {
                this.handleInitialSocks5AuthenticationHandshakeResponse();
            // Sent final Socks v5 handshake, waiting for final response.
            } else if (this.state === constants_1.SocksClientState.SentFinalHandshake) {
                this.handleSocks5FinalHandshakeResponse();
            // Socks BIND established. Waiting for remote connection via proxy.
            } else if (this.state === constants_1.SocksClientState.BoundWaitingForConnection) {
                if (this.options.proxy.type === 4) {
                    this.handleSocks4IncomingConnectionResponse();
                } else {
                    this.handleSocks5IncomingConnectionResponse();
                }
            } else {
                this.closeSocket(constants_1.ERRORS.InternalError);
                break;
            }
        }
    }
    /**
     * Handles Socket close event.
     * @param had_error
     */ onCloseHandler() {
        this.closeSocket(constants_1.ERRORS.SocketClosed);
    }
    /**
     * Handles Socket error event.
     * @param err
     */ onErrorHandler(err) {
        this.closeSocket(err.message);
    }
    /**
     * Removes internal event listeners on the underlying Socket.
     */ removeInternalSocketHandlers() {
        // Pauses data flow of the socket (this is internally resumed after 'established' is emitted)
        this.socket.pause();
        this.socket.removeListener('data', this.onDataReceived);
        this.socket.removeListener('close', this.onClose);
        this.socket.removeListener('error', this.onError);
        this.socket.removeListener('connect', this.onConnect);
    }
    /**
     * Closes and destroys the underlying Socket. Emits an error event.
     * @param err { String } An error string to include in error event.
     */ closeSocket(err) {
        // Make sure only one 'error' event is fired for the lifetime of this SocksClient instance.
        if (this.state !== constants_1.SocksClientState.Error) {
            // Set internal state to Error.
            this.setState(constants_1.SocksClientState.Error);
            // Destroy Socket
            this.socket.destroy();
            // Remove internal listeners
            this.removeInternalSocketHandlers();
            // Fire 'error' event.
            this.emit('error', new util_1.SocksClientError(err, this.options));
        }
    }
    /**
     * Sends initial Socks v4 handshake request.
     */ sendSocks4InitialHandshake() {
        const userId = this.options.proxy.userId || '';
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(0x04);
        buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
        buff.writeUInt16BE(this.options.destination.port);
        // Socks 4 (IPv4)
        if (net.isIPv4(this.options.destination.host)) {
            buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
            buff.writeStringNT(userId);
        // Socks 4a (hostname)
        } else {
            buff.writeUInt8(0x00);
            buff.writeUInt8(0x00);
            buff.writeUInt8(0x00);
            buff.writeUInt8(0x01);
            buff.writeStringNT(userId);
            buff.writeStringNT(this.options.destination.host);
        }
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks4Response;
        this.socket.write(buff.toBuffer());
    }
    /**
     * Handles Socks v4 handshake response.
     * @param data
     */ handleSocks4FinalHandshakeResponse() {
        const data = this.receiveBuffer.get(8);
        if (data[1] !== constants_1.Socks4Response.Granted) {
            this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedConnection} - (${constants_1.Socks4Response[data[1]]})`);
        } else {
            // Bind response
            if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
                const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
                buff.readOffset = 2;
                const remoteHost = {
                    port: buff.readUInt16BE(),
                    host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
                };
                // If host is 0.0.0.0, set to proxy host.
                if (remoteHost.host === '0.0.0.0') {
                    remoteHost.host = this.options.proxy.ipaddress;
                }
                this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
                this.emit('bound', {
                    remoteHost,
                    socket: this.socket
                });
            // Connect response
            } else {
                this.setState(constants_1.SocksClientState.Established);
                this.removeInternalSocketHandlers();
                this.emit('established', {
                    socket: this.socket
                });
            }
        }
    }
    /**
     * Handles Socks v4 incoming connection request (BIND)
     * @param data
     */ handleSocks4IncomingConnectionResponse() {
        const data = this.receiveBuffer.get(8);
        if (data[1] !== constants_1.Socks4Response.Granted) {
            this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedIncomingBoundConnection} - (${constants_1.Socks4Response[data[1]]})`);
        } else {
            const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
            buff.readOffset = 2;
            const remoteHost = {
                port: buff.readUInt16BE(),
                host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
            };
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit('established', {
                remoteHost,
                socket: this.socket
            });
        }
    }
    /**
     * Sends initial Socks v5 handshake request.
     */ sendSocks5InitialHandshake() {
        const buff = new smart_buffer_1.SmartBuffer();
        // By default we always support no auth.
        const supportedAuthMethods = [
            constants_1.Socks5Auth.NoAuth
        ];
        // We should only tell the proxy we support user/pass auth if auth info is actually provided.
        // Note: As of Tor v0.3.5.7+, if user/pass auth is an option from the client, by default it will always take priority.
        if (this.options.proxy.userId || this.options.proxy.password) {
            supportedAuthMethods.push(constants_1.Socks5Auth.UserPass);
        }
        // Custom auth method?
        if (this.options.proxy.custom_auth_method !== undefined) {
            supportedAuthMethods.push(this.options.proxy.custom_auth_method);
        }
        // Build handshake packet
        buff.writeUInt8(0x05);
        buff.writeUInt8(supportedAuthMethods.length);
        for (const authMethod of supportedAuthMethods){
            buff.writeUInt8(authMethod);
        }
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5InitialHandshakeResponse;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentInitialHandshake);
    }
    /**
     * Handles initial Socks v5 handshake response.
     * @param data
     */ handleInitialSocks5HandshakeResponse() {
        const data = this.receiveBuffer.get(2);
        if (data[0] !== 0x05) {
            this.closeSocket(constants_1.ERRORS.InvalidSocks5IntiailHandshakeSocksVersion);
        } else if (data[1] === constants_1.SOCKS5_NO_ACCEPTABLE_AUTH) {
            this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeNoAcceptedAuthType);
        } else {
            // If selected Socks v5 auth method is no auth, send final handshake request.
            if (data[1] === constants_1.Socks5Auth.NoAuth) {
                this.socks5ChosenAuthType = constants_1.Socks5Auth.NoAuth;
                this.sendSocks5CommandRequest();
            // If selected Socks v5 auth method is user/password, send auth handshake.
            } else if (data[1] === constants_1.Socks5Auth.UserPass) {
                this.socks5ChosenAuthType = constants_1.Socks5Auth.UserPass;
                this.sendSocks5UserPassAuthentication();
            // If selected Socks v5 auth method is the custom_auth_method, send custom handshake.
            } else if (data[1] === this.options.proxy.custom_auth_method) {
                this.socks5ChosenAuthType = this.options.proxy.custom_auth_method;
                this.sendSocks5CustomAuthentication();
            } else {
                this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeUnknownAuthType);
            }
        }
    }
    /**
     * Sends Socks v5 user & password auth handshake.
     *
     * Note: No auth and user/pass are currently supported.
     */ sendSocks5UserPassAuthentication() {
        const userId = this.options.proxy.userId || '';
        const password = this.options.proxy.password || '';
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(0x01);
        buff.writeUInt8(Buffer.byteLength(userId));
        buff.writeString(userId);
        buff.writeUInt8(Buffer.byteLength(password));
        buff.writeString(password);
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5UserPassAuthenticationResponse;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentAuthentication);
    }
    sendSocks5CustomAuthentication() {
        return __awaiter(this, void 0, void 0, function*() {
            this.nextRequiredPacketBufferSize = this.options.proxy.custom_auth_response_size;
            this.socket.write((yield this.options.proxy.custom_auth_request_handler()));
            this.setState(constants_1.SocksClientState.SentAuthentication);
        });
    }
    handleSocks5CustomAuthHandshakeResponse(data) {
        return __awaiter(this, void 0, void 0, function*() {
            return yield this.options.proxy.custom_auth_response_handler(data);
        });
    }
    handleSocks5AuthenticationNoAuthHandshakeResponse(data) {
        return __awaiter(this, void 0, void 0, function*() {
            return data[1] === 0x00;
        });
    }
    handleSocks5AuthenticationUserPassHandshakeResponse(data) {
        return __awaiter(this, void 0, void 0, function*() {
            return data[1] === 0x00;
        });
    }
    /**
     * Handles Socks v5 auth handshake response.
     * @param data
     */ handleInitialSocks5AuthenticationHandshakeResponse() {
        return __awaiter(this, void 0, void 0, function*() {
            this.setState(constants_1.SocksClientState.ReceivedAuthenticationResponse);
            let authResult = false;
            if (this.socks5ChosenAuthType === constants_1.Socks5Auth.NoAuth) {
                authResult = yield this.handleSocks5AuthenticationNoAuthHandshakeResponse(this.receiveBuffer.get(2));
            } else if (this.socks5ChosenAuthType === constants_1.Socks5Auth.UserPass) {
                authResult = yield this.handleSocks5AuthenticationUserPassHandshakeResponse(this.receiveBuffer.get(2));
            } else if (this.socks5ChosenAuthType === this.options.proxy.custom_auth_method) {
                authResult = yield this.handleSocks5CustomAuthHandshakeResponse(this.receiveBuffer.get(this.options.proxy.custom_auth_response_size));
            }
            if (!authResult) {
                this.closeSocket(constants_1.ERRORS.Socks5AuthenticationFailed);
            } else {
                this.sendSocks5CommandRequest();
            }
        });
    }
    /**
     * Sends Socks v5 final handshake request.
     */ sendSocks5CommandRequest() {
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(0x05);
        buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
        buff.writeUInt8(0x00);
        // ipv4, ipv6, domain?
        if (net.isIPv4(this.options.destination.host)) {
            buff.writeUInt8(constants_1.Socks5HostType.IPv4);
            buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
        } else if (net.isIPv6(this.options.destination.host)) {
            buff.writeUInt8(constants_1.Socks5HostType.IPv6);
            buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
        } else {
            buff.writeUInt8(constants_1.Socks5HostType.Hostname);
            buff.writeUInt8(this.options.destination.host.length);
            buff.writeString(this.options.destination.host);
        }
        buff.writeUInt16BE(this.options.destination.port);
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentFinalHandshake);
    }
    /**
     * Handles Socks v5 final handshake response.
     * @param data
     */ handleSocks5FinalHandshakeResponse() {
        // Peek at available data (we need at least 5 bytes to get the hostname length)
        const header = this.receiveBuffer.peek(5);
        if (header[0] !== 0x05 || header[1] !== constants_1.Socks5Response.Granted) {
            this.closeSocket(`${constants_1.ERRORS.InvalidSocks5FinalHandshakeRejected} - ${constants_1.Socks5Response[header[1]]}`);
        } else {
            // Read address type
            const addressType = header[3];
            let remoteHost;
            let buff;
            // IPv4
            if (addressType === constants_1.Socks5HostType.IPv4) {
                // Check if data is available.
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
                remoteHost = {
                    host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
                    port: buff.readUInt16BE()
                };
                // If given host is 0.0.0.0, assume remote proxy ip instead.
                if (remoteHost.host === '0.0.0.0') {
                    remoteHost.host = this.options.proxy.ipaddress;
                }
            // Hostname
            } else if (addressType === constants_1.Socks5HostType.Hostname) {
                const hostLength = header[4];
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength); // header + host length + host + port
                // Check if data is available.
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
                remoteHost = {
                    host: buff.readString(hostLength),
                    port: buff.readUInt16BE()
                };
            // IPv6
            } else if (addressType === constants_1.Socks5HostType.IPv6) {
                // Check if data is available.
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
                remoteHost = {
                    host: ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
                    port: buff.readUInt16BE()
                };
            }
            // We have everything we need
            this.setState(constants_1.SocksClientState.ReceivedFinalResponse);
            // If using CONNECT, the client is now in the established state.
            if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.connect) {
                this.setState(constants_1.SocksClientState.Established);
                this.removeInternalSocketHandlers();
                this.emit('established', {
                    remoteHost,
                    socket: this.socket
                });
            } else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
                /* If using BIND, the Socks client is now in BoundWaitingForConnection state.
                   This means that the remote proxy server is waiting for a remote connection to the bound port. */ this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
                this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
                this.emit('bound', {
                    remoteHost,
                    socket: this.socket
                });
            /*
                  If using Associate, the Socks client is now Established. And the proxy server is now accepting UDP packets at the
                  given bound port. This initial Socks TCP connection must remain open for the UDP relay to continue to work.
                */ } else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.associate) {
                this.setState(constants_1.SocksClientState.Established);
                this.removeInternalSocketHandlers();
                this.emit('established', {
                    remoteHost,
                    socket: this.socket
                });
            }
        }
    }
    /**
     * Handles Socks v5 incoming connection request (BIND).
     */ handleSocks5IncomingConnectionResponse() {
        // Peek at available data (we need at least 5 bytes to get the hostname length)
        const header = this.receiveBuffer.peek(5);
        if (header[0] !== 0x05 || header[1] !== constants_1.Socks5Response.Granted) {
            this.closeSocket(`${constants_1.ERRORS.Socks5ProxyRejectedIncomingBoundConnection} - ${constants_1.Socks5Response[header[1]]}`);
        } else {
            // Read address type
            const addressType = header[3];
            let remoteHost;
            let buff;
            // IPv4
            if (addressType === constants_1.Socks5HostType.IPv4) {
                // Check if data is available.
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
                remoteHost = {
                    host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
                    port: buff.readUInt16BE()
                };
                // If given host is 0.0.0.0, assume remote proxy ip instead.
                if (remoteHost.host === '0.0.0.0') {
                    remoteHost.host = this.options.proxy.ipaddress;
                }
            // Hostname
            } else if (addressType === constants_1.Socks5HostType.Hostname) {
                const hostLength = header[4];
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength); // header + host length + port
                // Check if data is available.
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
                remoteHost = {
                    host: buff.readString(hostLength),
                    port: buff.readUInt16BE()
                };
            // IPv6
            } else if (addressType === constants_1.Socks5HostType.IPv6) {
                // Check if data is available.
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
                remoteHost = {
                    host: ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
                    port: buff.readUInt16BE()
                };
            }
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit('established', {
                remoteHost,
                socket: this.socket
            });
        }
    }
    get socksClientOptions() {
        return Object.assign({}, this.options);
    }
}
exports.SocksClient = SocksClient;
}),
"[project]/node_modules/socks/build/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/node_modules/socks/build/client/socksclient.js [app-route] (ecmascript)"), exports);
}),
"[project]/node_modules/ip-address/dist/address-error.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AddressError = void 0;
class AddressError extends Error {
    constructor(message, parseMessage){
        super(message);
        this.name = 'AddressError';
        this.parseMessage = parseMessage;
    }
}
exports.AddressError = AddressError;
}),
"[project]/node_modules/ip-address/dist/common.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isInSubnet = isInSubnet;
exports.isCorrect = isCorrect;
exports.prefixLengthFromMask = prefixLengthFromMask;
exports.numberToPaddedHex = numberToPaddedHex;
exports.stringToPaddedHex = stringToPaddedHex;
exports.testBit = testBit;
const address_error_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/address-error.js [app-route] (ecmascript)");
function isInSubnet(address) {
    if (this.subnetMask < address.subnetMask) {
        return false;
    }
    if (this.mask(address.subnetMask) === address.mask()) {
        return true;
    }
    return false;
}
function isCorrect(defaultBits) {
    return function() {
        if (this.addressMinusSuffix !== this.correctForm()) {
            return false;
        }
        if (this.subnetMask === defaultBits && !this.parsedSubnet) {
            return true;
        }
        return this.parsedSubnet === String(this.subnetMask);
    };
}
/**
 * Returns the prefix length (number of leading 1 bits) of a contiguous
 * subnet mask. Throws `AddressError` if the mask is non-contiguous (e.g.
 * `255.0.255.0`).
 */ function prefixLengthFromMask(value, totalBits) {
    const binary = value.toString(2).padStart(totalBits, '0');
    if (binary.length > totalBits) {
        throw new address_error_1.AddressError('Invalid subnet mask.');
    }
    const firstZero = binary.indexOf('0');
    if (firstZero === -1) {
        return totalBits;
    }
    if (binary.slice(firstZero).includes('1')) {
        throw new address_error_1.AddressError('Invalid subnet mask.');
    }
    return firstZero;
}
function numberToPaddedHex(number) {
    return number.toString(16).padStart(2, '0');
}
function stringToPaddedHex(numberString) {
    return numberToPaddedHex(parseInt(numberString, 10));
}
/**
 * @param binaryValue Binary representation of a value (e.g. `10`)
 * @param position Byte position, where 0 is the least significant bit
 */ function testBit(binaryValue, position) {
    const { length } = binaryValue;
    if (position > length) {
        return false;
    }
    const positionInString = length - position;
    return binaryValue.substring(positionInString, positionInString + 1) === '1';
}
}),
"[project]/node_modules/ip-address/dist/v4/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RE_SUBNET_STRING = exports.RE_ADDRESS = exports.GROUPS = exports.BITS = void 0;
exports.BITS = 32;
exports.GROUPS = 4;
exports.RE_ADDRESS = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
exports.RE_SUBNET_STRING = /\/\d{1,2}$/;
}),
"[project]/node_modules/ip-address/dist/ipv4.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable no-param-reassign */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Address4 = void 0;
const common = __importStar(__turbopack_context__.r("[project]/node_modules/ip-address/dist/common.js [app-route] (ecmascript)"));
const constants = __importStar(__turbopack_context__.r("[project]/node_modules/ip-address/dist/v4/constants.js [app-route] (ecmascript)"));
const address_error_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/address-error.js [app-route] (ecmascript)");
const isCorrect4 = common.isCorrect(constants.BITS);
/**
 * Represents an IPv4 address
 * @param {string} address - An IPv4 address string
 */ class Address4 {
    constructor(address){
        this.groups = constants.GROUPS;
        this.parsedAddress = [];
        this.parsedSubnet = '';
        this.subnet = '/32';
        this.subnetMask = 32;
        this.v4 = true;
        /**
         * Returns true if the address is correct, false otherwise
         * @returns {Boolean}
         */ this.isCorrect = isCorrect4;
        /**
         * Returns true if the given address is in the subnet of the current address
         * @returns {boolean}
         */ this.isInSubnet = common.isInSubnet;
        this.address = address;
        const subnet = constants.RE_SUBNET_STRING.exec(address);
        if (subnet) {
            this.parsedSubnet = subnet[0].replace('/', '');
            this.subnetMask = parseInt(this.parsedSubnet, 10);
            this.subnet = `/${this.subnetMask}`;
            if (this.subnetMask < 0 || this.subnetMask > constants.BITS) {
                throw new address_error_1.AddressError('Invalid subnet mask.');
            }
            address = address.replace(constants.RE_SUBNET_STRING, '');
        }
        this.addressMinusSuffix = address;
        this.parsedAddress = this.parse(address);
    }
    /**
     * Returns true if the given string is a valid IPv4 address (with optional
     * CIDR subnet), false otherwise. Host bits in the subnet portion are
     * allowed (e.g. `192.168.1.5/24` is valid); for strict network-address
     * validation compare `correctForm()` to `startAddress().correctForm()`,
     * or use `networkForm()`.
     */ static isValid(address) {
        try {
            // eslint-disable-next-line no-new
            new Address4(address);
            return true;
        } catch (e) {
            return false;
        }
    }
    /**
     * Parses an IPv4 address string into its four octet groups and stores the
     * result on `this.parsedAddress`. Called automatically by the constructor;
     * you typically don't need to call it directly. Throws `AddressError` if
     * the input is not a valid IPv4 address.
     */ parse(address) {
        const groups = address.split('.');
        if (!address.match(constants.RE_ADDRESS)) {
            throw new address_error_1.AddressError('Invalid IPv4 address.');
        }
        return groups;
    }
    /**
     * Returns the address in correct form: octets joined with `.` and any
     * leading zeros stripped (e.g. `192.168.1.1`). For IPv4 this matches the
     * canonical dotted-decimal representation.
     */ correctForm() {
        return this.parsedAddress.map((part)=>parseInt(part, 10)).join('.');
    }
    /**
     * Construct an `Address4` from an address and a dotted-decimal subnet
     * mask given as separate strings (e.g. as returned by Node's
     * `os.networkInterfaces()`). Throws `AddressError` if the mask is
     * non-contiguous (e.g. `255.0.255.0`).
     * @example
     * var address = Address4.fromAddressAndMask('192.168.1.1', '255.255.255.0');
     * address.subnetMask; // 24
     */ static fromAddressAndMask(address, mask) {
        const bits = common.prefixLengthFromMask(new Address4(mask).bigInt(), constants.BITS);
        return new Address4(`${address}/${bits}`);
    }
    /**
     * Construct an `Address4` from an address and a Cisco-style wildcard mask
     * given as separate strings (e.g. `0.0.0.255` for a `/24`). The wildcard
     * mask is the bitwise inverse of the subnet mask. Throws `AddressError`
     * if the mask is non-contiguous (e.g. `0.255.0.255`).
     * @example
     * var address = Address4.fromAddressAndWildcardMask('10.0.0.1', '0.0.0.255');
     * address.subnetMask; // 24
     */ static fromAddressAndWildcardMask(address, wildcardMask) {
        const wildcard = new Address4(wildcardMask).bigInt();
        const allOnes = (BigInt(1) << BigInt(constants.BITS)) - BigInt(1);
        // eslint-disable-next-line no-bitwise
        const mask = wildcard ^ allOnes;
        const bits = common.prefixLengthFromMask(mask, constants.BITS);
        return new Address4(`${address}/${bits}`);
    }
    /**
     * Construct an `Address4` from a wildcard pattern with trailing `*`
     * octets. The number of trailing wildcards determines the prefix
     * length: each `*` represents 8 bits.
     *
     * Only trailing whole-octet wildcards are supported. Partial-octet
     * wildcards (e.g. `192.168.0.1*`) and interior wildcards (e.g.
     * `192.*.0.1`) throw `AddressError`.
     * @example
     * Address4.fromWildcard('192.168.0.*').subnet;   // '/24'
     * Address4.fromWildcard('192.168.*.*').subnet;   // '/16'
     * Address4.fromWildcard('*.*.*.*').subnet;       // '/0'
     */ static fromWildcard(input) {
        const groups = input.split('.');
        if (groups.length !== constants.GROUPS) {
            throw new address_error_1.AddressError('Wildcard pattern must have 4 octets');
        }
        let firstWildcard = -1;
        for(let i = 0; i < groups.length; i++){
            if (groups[i] === '*') {
                if (firstWildcard === -1) {
                    firstWildcard = i;
                }
            } else if (firstWildcard !== -1) {
                throw new address_error_1.AddressError('Wildcard `*` must only appear in trailing octets (e.g. `192.168.0.*`)');
            }
        }
        const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
        const replaced = groups.map((g)=>g === '*' ? '0' : g);
        const subnetBits = constants.BITS - trailing * 8;
        return new Address4(`${replaced.join('.')}/${subnetBits}`);
    }
    /**
     * Converts a hex string to an IPv4 address object. Accepts 8 hex digits
     * with optional `:` separators (e.g. `'7f000001'` or `'7f:00:00:01'`).
     * Throws `AddressError` for any other length or for non-hex characters.
     * @param {string} hex - a hex string to convert
     * @returns {Address4}
     */ static fromHex(hex) {
        const stripped = hex.replace(/:/g, '');
        if (!/^[0-9a-fA-F]{8}$/.test(stripped)) {
            throw new address_error_1.AddressError('IPv4 hex must be exactly 8 hex digits');
        }
        const groups = [];
        for(let i = 0; i < 8; i += 2){
            groups.push(parseInt(stripped.slice(i, i + 2), 16));
        }
        return new Address4(groups.join('.'));
    }
    /**
     * Converts an integer into a IPv4 address object. The integer must be a
     * non-negative safe integer in the range `[0, 2**32 - 1]`; otherwise
     * `AddressError` is thrown.
     * @param {integer} integer - a number to convert
     * @returns {Address4}
     */ static fromInteger(integer) {
        if (!Number.isInteger(integer) || integer < 0 || integer > 0xffffffff) {
            throw new address_error_1.AddressError('IPv4 integer must be in the range 0 to 2**32 - 1');
        }
        return Address4.fromHex(integer.toString(16).padStart(8, '0'));
    }
    /**
     * Return an address from in-addr.arpa form
     * @param {string} arpaFormAddress - an 'in-addr.arpa' form ipv4 address
     * @returns {Adress4}
     * @example
     * var address = Address4.fromArpa(42.2.0.192.in-addr.arpa.)
     * address.correctForm(); // '192.0.2.42'
     */ static fromArpa(arpaFormAddress) {
        // remove ending ".in-addr.arpa." or just "."
        const leader = arpaFormAddress.replace(/(\.in-addr\.arpa)?\.$/, '');
        const address = leader.split('.').reverse().join('.');
        return new Address4(address);
    }
    /**
     * Converts an IPv4 address object to a hex string
     * @returns {String}
     */ toHex() {
        return this.parsedAddress.map((part)=>common.stringToPaddedHex(part)).join(':');
    }
    /**
     * Converts an IPv4 address object to an array of bytes.
     *
     * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toArray())`.
     * @returns {Array}
     */ toArray() {
        return this.parsedAddress.map((part)=>parseInt(part, 10));
    }
    /**
     * Converts an IPv4 address object to an IPv6 address group
     * @returns {String}
     */ toGroup6() {
        const output = [];
        let i;
        for(i = 0; i < constants.GROUPS; i += 2){
            output.push(`${common.stringToPaddedHex(this.parsedAddress[i])}${common.stringToPaddedHex(this.parsedAddress[i + 1])}`);
        }
        return output.join(':');
    }
    /**
     * Returns the address as a `bigint`
     * @returns {bigint}
     */ bigInt() {
        return BigInt(`0x${this.parsedAddress.map((n)=>common.stringToPaddedHex(n)).join('')}`);
    }
    /**
     * Helper function getting start address.
     * @returns {bigint}
     */ _startAddress() {
        return BigInt(`0b${this.mask() + '0'.repeat(constants.BITS - this.subnetMask)}`);
    }
    /**
     * The first address in the range given by this address' subnet.
     * Often referred to as the Network Address.
     * @returns {Address4}
     */ startAddress() {
        return Address4.fromBigInt(this._startAddress());
    }
    /**
     * The first host address in the range given by this address's subnet ie
     * the first address after the Network Address
     * @returns {Address4}
     */ startAddressExclusive() {
        const adjust = BigInt('1');
        return Address4.fromBigInt(this._startAddress() + adjust);
    }
    /**
     * Helper function getting end address.
     * @returns {bigint}
     */ _endAddress() {
        return BigInt(`0b${this.mask() + '1'.repeat(constants.BITS - this.subnetMask)}`);
    }
    /**
     * The last address in the range given by this address' subnet
     * Often referred to as the Broadcast
     * @returns {Address4}
     */ endAddress() {
        return Address4.fromBigInt(this._endAddress());
    }
    /**
     * The last host address in the range given by this address's subnet ie
     * the last address prior to the Broadcast Address
     * @returns {Address4}
     */ endAddressExclusive() {
        const adjust = BigInt('1');
        return Address4.fromBigInt(this._endAddress() - adjust);
    }
    /**
     * The dotted-decimal form of the subnet mask, e.g. `255.255.240.0` for
     * a `/20`. Returns an `Address4`; call `.correctForm()` for the string.
     * @returns {Address4}
     */ subnetMaskAddress() {
        return Address4.fromBigInt(BigInt(`0b${'1'.repeat(this.subnetMask)}${'0'.repeat(constants.BITS - this.subnetMask)}`));
    }
    /**
     * The Cisco-style wildcard mask, e.g. `0.0.0.255` for a `/24`. This is
     * the bitwise inverse of `subnetMaskAddress()`. Returns an `Address4`;
     * call `.correctForm()` for the string.
     * @returns {Address4}
     */ wildcardMask() {
        return Address4.fromBigInt(BigInt(`0b${'0'.repeat(this.subnetMask)}${'1'.repeat(constants.BITS - this.subnetMask)}`));
    }
    /**
     * The network address in CIDR string form, e.g. `192.168.1.0/24` for
     * `192.168.1.5/24`. For an address with no explicit subnet the prefix is
     * `/32`, e.g. `networkForm()` on `192.168.1.5` returns `192.168.1.5/32`.
     * @returns {string}
     */ networkForm() {
        return `${this.startAddress().correctForm()}/${this.subnetMask}`;
    }
    /**
     * Converts a BigInt to a v4 address object. The value must be in the
     * range `[0, 2**32 - 1]`; otherwise `AddressError` is thrown.
     * @param {bigint} bigInt - a BigInt to convert
     * @returns {Address4}
     */ static fromBigInt(bigInt) {
        if (bigInt < 0n || bigInt > 0xffffffffn) {
            throw new address_error_1.AddressError('IPv4 BigInt must be in the range 0 to 2**32 - 1');
        }
        return Address4.fromHex(bigInt.toString(16).padStart(8, '0'));
    }
    /**
     * Convert a byte array to an Address4 object.
     *
     * To convert from a Node.js `Buffer`, spread it: `Address4.fromByteArray([...buf])`.
     * @param {Array<number>} bytes - an array of 4 bytes (0-255)
     * @returns {Address4}
     */ static fromByteArray(bytes) {
        if (bytes.length !== 4) {
            throw new address_error_1.AddressError('IPv4 addresses require exactly 4 bytes');
        }
        // Validate that all bytes are within valid range (0-255)
        for(let i = 0; i < bytes.length; i++){
            if (!Number.isInteger(bytes[i]) || bytes[i] < 0 || bytes[i] > 255) {
                throw new address_error_1.AddressError('All bytes must be integers between 0 and 255');
            }
        }
        return this.fromUnsignedByteArray(bytes);
    }
    /**
     * Convert an unsigned byte array to an Address4 object
     * @param {Array<number>} bytes - an array of 4 unsigned bytes (0-255)
     * @returns {Address4}
     */ static fromUnsignedByteArray(bytes) {
        if (bytes.length !== 4) {
            throw new address_error_1.AddressError('IPv4 addresses require exactly 4 bytes');
        }
        const address = bytes.join('.');
        return new Address4(address);
    }
    /**
     * Returns the first n bits of the address, defaulting to the
     * subnet mask
     * @returns {String}
     */ mask(mask) {
        if (mask === undefined) {
            mask = this.subnetMask;
        }
        return this.getBitsBase2(0, mask);
    }
    /**
     * Returns the bits in the given range as a base-2 string
     * @returns {string}
     */ getBitsBase2(start, end) {
        return this.binaryZeroPad().slice(start, end);
    }
    /**
     * Return the reversed ip6.arpa form of the address
     * @param {Object} options
     * @param {boolean} options.omitSuffix - omit the "in-addr.arpa" suffix
     * @returns {String}
     */ reverseForm(options) {
        if (!options) {
            options = {};
        }
        const reversed = this.correctForm().split('.').reverse().join('.');
        if (options.omitSuffix) {
            return reversed;
        }
        return `${reversed}.in-addr.arpa.`;
    }
    /**
     * Returns true if the given address is a multicast address
     * @returns {boolean}
     */ isMulticast() {
        return this.isInSubnet(MULTICAST_V4);
    }
    /**
     * Returns true if the address is in one of the [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private address ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
     * @returns {boolean}
     */ isPrivate() {
        return PRIVATE_V4.some((subnet)=>this.isInSubnet(subnet));
    }
    /**
     * Returns true if the address is in the loopback range `127.0.0.0/8` ([RFC 1122](https://datatracker.ietf.org/doc/html/rfc1122)).
     * @returns {boolean}
     */ isLoopback() {
        return this.isInSubnet(LOOPBACK_V4);
    }
    /**
     * Returns true if the address is in the link-local range `169.254.0.0/16` ([RFC 3927](https://datatracker.ietf.org/doc/html/rfc3927)).
     * @returns {boolean}
     */ isLinkLocal() {
        return this.isInSubnet(LINK_LOCAL_V4);
    }
    /**
     * Returns true if the address is the unspecified address `0.0.0.0`.
     * @returns {boolean}
     */ isUnspecified() {
        return this.isInSubnet(UNSPECIFIED_V4);
    }
    /**
     * Returns true if the address is the limited broadcast address `255.255.255.255` ([RFC 919](https://datatracker.ietf.org/doc/html/rfc919)).
     * @returns {boolean}
     */ isBroadcast() {
        return this.isInSubnet(BROADCAST_V4);
    }
    /**
     * Returns true if the address is in the carrier-grade NAT range `100.64.0.0/10` ([RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598)).
     * @returns {boolean}
     */ isCGNAT() {
        return this.isInSubnet(CGNAT_V4);
    }
    /**
     * Returns a zero-padded base-2 string representation of the address
     * @returns {string}
     */ binaryZeroPad() {
        if (this._binaryZeroPad === undefined) {
            this._binaryZeroPad = this.bigInt().toString(2).padStart(constants.BITS, '0');
        }
        return this._binaryZeroPad;
    }
    /**
     * Groups an IPv4 address for inclusion at the end of an IPv6 address
     * @returns {String}
     */ groupForV6() {
        const segments = this.parsedAddress;
        return this.address.replace(constants.RE_ADDRESS, `<span class="hover-group group-v4 group-6">${segments.slice(0, 2).join('.')}</span>.<span class="hover-group group-v4 group-7">${segments.slice(2, 4).join('.')}</span>`);
    }
}
exports.Address4 = Address4;
const MULTICAST_V4 = new Address4('224.0.0.0/4');
const PRIVATE_V4 = [
    new Address4('10.0.0.0/8'),
    new Address4('172.16.0.0/12'),
    new Address4('192.168.0.0/16')
];
const LOOPBACK_V4 = new Address4('127.0.0.0/8');
const LINK_LOCAL_V4 = new Address4('169.254.0.0/16');
const UNSPECIFIED_V4 = new Address4('0.0.0.0/32');
const BROADCAST_V4 = new Address4('255.255.255.255/32');
const CGNAT_V4 = new Address4('100.64.0.0/10');
}),
"[project]/node_modules/ip-address/dist/v6/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RE_URL_WITH_PORT = exports.RE_URL = exports.RE_ZONE_STRING = exports.RE_SUBNET_STRING = exports.RE_BAD_ADDRESS = exports.RE_BAD_CHARACTERS = exports.TYPES = exports.SCOPES = exports.GROUPS = exports.BITS = void 0;
exports.BITS = 128;
exports.GROUPS = 8;
/**
 * Represents IPv6 address scopes
 * @memberof Address6
 * @static
 */ exports.SCOPES = {
    0: 'Reserved',
    1: 'Interface local',
    2: 'Link local',
    4: 'Admin local',
    5: 'Site local',
    8: 'Organization local',
    14: 'Global',
    15: 'Reserved'
};
/**
 * Represents IPv6 address types
 * @memberof Address6
 * @static
 */ exports.TYPES = {
    'ff01::1/128': 'Multicast (All nodes on this interface)',
    'ff01::2/128': 'Multicast (All routers on this interface)',
    'ff02::1/128': 'Multicast (All nodes on this link)',
    'ff02::2/128': 'Multicast (All routers on this link)',
    'ff05::2/128': 'Multicast (All routers in this site)',
    'ff02::5/128': 'Multicast (OSPFv3 AllSPF routers)',
    'ff02::6/128': 'Multicast (OSPFv3 AllDR routers)',
    'ff02::9/128': 'Multicast (RIP routers)',
    'ff02::a/128': 'Multicast (EIGRP routers)',
    'ff02::d/128': 'Multicast (PIM routers)',
    'ff02::16/128': 'Multicast (MLDv2 reports)',
    'ff01::fb/128': 'Multicast (mDNSv6)',
    'ff02::fb/128': 'Multicast (mDNSv6)',
    'ff05::fb/128': 'Multicast (mDNSv6)',
    'ff02::1:2/128': 'Multicast (All DHCP servers and relay agents on this link)',
    'ff05::1:2/128': 'Multicast (All DHCP servers and relay agents in this site)',
    'ff02::1:3/128': 'Multicast (All DHCP servers on this link)',
    'ff05::1:3/128': 'Multicast (All DHCP servers in this site)',
    '::/128': 'Unspecified',
    '::1/128': 'Loopback',
    'ff00::/8': 'Multicast',
    'fe80::/10': 'Link-local unicast',
    'fc00::/7': 'Unique local',
    '2002::/16': '6to4',
    '2001:db8::/32': 'Documentation',
    '64:ff9b::/96': 'NAT64 (well-known)',
    '64:ff9b:1::/48': 'NAT64 (local-use)'
};
/**
 * A regular expression that matches bad characters in an IPv6 address
 * @memberof Address6
 * @static
 */ exports.RE_BAD_CHARACTERS = /([^0-9a-f:/%])/gi;
/**
 * A regular expression that matches an incorrect IPv6 address
 * @memberof Address6
 * @static
 */ exports.RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]|\/$)/gi;
/**
 * A regular expression that matches an IPv6 subnet
 * @memberof Address6
 * @static
 */ exports.RE_SUBNET_STRING = /\/\d{1,3}(?=%|$)/;
/**
 * A regular expression that matches an IPv6 zone
 * @memberof Address6
 * @static
 */ exports.RE_ZONE_STRING = /%.*$/;
exports.RE_URL = /^\[{0,1}([0-9a-f:]+)\]{0,1}/;
exports.RE_URL_WITH_PORT = /\[([0-9a-f:]+)\]:([0-9]{1,5})/;
}),
"[project]/node_modules/ip-address/dist/v6/helpers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.escapeHtml = escapeHtml;
exports.spanAllZeroes = spanAllZeroes;
exports.spanAll = spanAll;
exports.spanLeadingZeroes = spanLeadingZeroes;
exports.simpleGroup = simpleGroup;
function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
/**
 * @returns {String} the string with all zeroes contained in a <span>
 */ function spanAllZeroes(s) {
    return escapeHtml(s).replace(/(0+)/g, '<span class="zero">$1</span>');
}
/**
 * @returns {String} the string with each character contained in a <span>
 */ function spanAll(s, offset = 0) {
    const letters = s.split('');
    return letters.map((n, i)=>`<span class="digit value-${escapeHtml(n)} position-${i + offset}">${spanAllZeroes(n)}</span>`).join('');
}
function spanLeadingZeroesSimple(group) {
    return escapeHtml(group).replace(/^(0+)/, '<span class="zero">$1</span>');
}
/**
 * @returns {String} the string with leading zeroes contained in a <span>
 */ function spanLeadingZeroes(address) {
    const groups = address.split(':');
    return groups.map((g)=>spanLeadingZeroesSimple(g)).join(':');
}
/**
 * Groups an address
 * @returns {String} a grouped address
 */ function simpleGroup(addressString, offset = 0) {
    const groups = addressString.split(':');
    return groups.map((g, i)=>{
        if (/group-v4/.test(g)) {
            return g;
        }
        return `<span class="hover-group group-${i + offset}">${spanLeadingZeroesSimple(g)}</span>`;
    });
}
}),
"[project]/node_modules/ip-address/dist/v6/regular-expressions.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ADDRESS_BOUNDARY = void 0;
exports.groupPossibilities = groupPossibilities;
exports.padGroup = padGroup;
exports.simpleRegularExpression = simpleRegularExpression;
exports.possibleElisions = possibleElisions;
const v6 = __importStar(__turbopack_context__.r("[project]/node_modules/ip-address/dist/v6/constants.js [app-route] (ecmascript)"));
function groupPossibilities(possibilities) {
    return `(${possibilities.join('|')})`;
}
function padGroup(group) {
    if (group.length < 4) {
        return `0{0,${4 - group.length}}${group}`;
    }
    return group;
}
exports.ADDRESS_BOUNDARY = '[^A-Fa-f0-9:]';
function simpleRegularExpression(groups) {
    const zeroIndexes = [];
    groups.forEach((group, i)=>{
        const groupInteger = parseInt(group, 16);
        if (groupInteger === 0) {
            zeroIndexes.push(i);
        }
    });
    // You can technically elide a single 0, this creates the regular expressions
    // to match that eventuality
    const possibilities = zeroIndexes.map((zeroIndex)=>groups.map((group, i)=>{
            if (i === zeroIndex) {
                const elision = i === 0 || i === v6.GROUPS - 1 ? ':' : '';
                return groupPossibilities([
                    padGroup(group),
                    elision
                ]);
            }
            return padGroup(group);
        }).join(':'));
    // The simplest case
    possibilities.push(groups.map(padGroup).join(':'));
    return groupPossibilities(possibilities);
}
function possibleElisions(elidedGroups, moreLeft, moreRight) {
    const left = moreLeft ? '' : ':';
    const right = moreRight ? '' : ':';
    const possibilities = [];
    // 1. elision of everything (::)
    if (!moreLeft && !moreRight) {
        possibilities.push('::');
    }
    // 2. complete elision of the middle
    if (moreLeft && moreRight) {
        possibilities.push('');
    }
    if (moreRight && !moreLeft || !moreRight && moreLeft) {
        // 3. complete elision of one side
        possibilities.push(':');
    }
    // 4. elision from the left side
    possibilities.push(`${left}(:0{1,4}){1,${elidedGroups - 1}}`);
    // 5. elision from the right side
    possibilities.push(`(0{1,4}:){1,${elidedGroups - 1}}${right}`);
    // 6. no elision
    possibilities.push(`(0{1,4}:){${elidedGroups - 1}}0{1,4}`);
    // 7. elision (including sloppy elision) from the middle
    for(let groups = 1; groups < elidedGroups - 1; groups++){
        for(let position = 1; position < elidedGroups - groups; position++){
            possibilities.push(`(0{1,4}:){${position}}:(0{1,4}:){${elidedGroups - position - groups - 1}}0{1,4}`);
        }
    }
    return groupPossibilities(possibilities);
}
}),
"[project]/node_modules/ip-address/dist/ipv6.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable prefer-destructuring */ /* eslint-disable no-param-reassign */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Address6 = void 0;
const common = __importStar(__turbopack_context__.r("[project]/node_modules/ip-address/dist/common.js [app-route] (ecmascript)"));
const constants4 = __importStar(__turbopack_context__.r("[project]/node_modules/ip-address/dist/v4/constants.js [app-route] (ecmascript)"));
const constants6 = __importStar(__turbopack_context__.r("[project]/node_modules/ip-address/dist/v6/constants.js [app-route] (ecmascript)"));
const helpers = __importStar(__turbopack_context__.r("[project]/node_modules/ip-address/dist/v6/helpers.js [app-route] (ecmascript)"));
const ipv4_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/ipv4.js [app-route] (ecmascript)");
const regular_expressions_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/v6/regular-expressions.js [app-route] (ecmascript)");
const address_error_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/address-error.js [app-route] (ecmascript)");
const common_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/common.js [app-route] (ecmascript)");
const isCorrect6 = common.isCorrect(constants6.BITS);
function assert(condition) {
    if (!condition) {
        throw new Error('Assertion failed.');
    }
}
function addCommas(number) {
    const r = /(\d+)(\d{3})/;
    while(r.test(number)){
        number = number.replace(r, '$1,$2');
    }
    return number;
}
function spanLeadingZeroes4(n) {
    n = n.replace(/^(0{1,})([1-9]+)$/, '<span class="parse-error">$1</span>$2');
    n = n.replace(/^(0{1,})(0)$/, '<span class="parse-error">$1</span>$2');
    return n;
}
/*
 * A helper function to compact an array
 */ function compact(address, slice) {
    const s1 = [];
    const s2 = [];
    let i;
    for(i = 0; i < address.length; i++){
        if (i < slice[0]) {
            s1.push(address[i]);
        } else if (i > slice[1]) {
            s2.push(address[i]);
        }
    }
    return s1.concat([
        'compact'
    ]).concat(s2);
}
function paddedHex(octet) {
    return parseInt(octet, 16).toString(16).padStart(4, '0');
}
function unsignByte(b) {
    // eslint-disable-next-line no-bitwise
    return b & 0xff;
}
/**
 * Represents an IPv6 address
 * @param {string} address - An IPv6 address string
 * @param {number} [groups=8] - How many octets to parse
 * @example
 * var address = new Address6('2001::/32');
 */ class Address6 {
    constructor(address, optionalGroups){
        this.addressMinusSuffix = '';
        this.parsedSubnet = '';
        this.subnet = '/128';
        this.subnetMask = 128;
        this.v4 = false;
        this.zone = '';
        // #region Attributes
        /**
         * Returns true if the given address is in the subnet of the current address
         * @returns {boolean}
         */ this.isInSubnet = common.isInSubnet;
        /**
         * Returns true if the address is correct, false otherwise
         * @returns {boolean}
         */ this.isCorrect = isCorrect6;
        if (optionalGroups === undefined) {
            this.groups = constants6.GROUPS;
        } else {
            this.groups = optionalGroups;
        }
        this.address = address;
        const subnet = constants6.RE_SUBNET_STRING.exec(address);
        if (subnet) {
            this.parsedSubnet = subnet[0].replace('/', '');
            this.subnetMask = parseInt(this.parsedSubnet, 10);
            this.subnet = `/${this.subnetMask}`;
            if (Number.isNaN(this.subnetMask) || this.subnetMask < 0 || this.subnetMask > constants6.BITS) {
                throw new address_error_1.AddressError('Invalid subnet mask.');
            }
            address = address.replace(constants6.RE_SUBNET_STRING, '');
        } else if (/\//.test(address)) {
            throw new address_error_1.AddressError('Invalid subnet mask.');
        }
        const zone = constants6.RE_ZONE_STRING.exec(address);
        if (zone) {
            this.zone = zone[0];
            address = address.replace(constants6.RE_ZONE_STRING, '');
        }
        this.addressMinusSuffix = address;
        this.parsedAddress = this.parse(this.addressMinusSuffix);
    }
    /**
     * Returns true if the given string is a valid IPv6 address (with optional
     * CIDR subnet and zone identifier), false otherwise. Host bits in the
     * subnet portion are allowed (e.g. `2001:db8::1/32` is valid); for strict
     * network-address validation compare `correctForm()` to
     * `startAddress().correctForm()`, or use `networkForm()`.
     */ static isValid(address) {
        try {
            // eslint-disable-next-line no-new
            new Address6(address);
            return true;
        } catch (e) {
            return false;
        }
    }
    /**
     * Convert a BigInt to a v6 address object. The value must be in the
     * range `[0, 2**128 - 1]`; otherwise `AddressError` is thrown.
     * @param {bigint} bigInt - a BigInt to convert
     * @returns {Address6}
     * @example
     * var bigInt = BigInt('1000000000000');
     * var address = Address6.fromBigInt(bigInt);
     * address.correctForm(); // '::e8:d4a5:1000'
     */ static fromBigInt(bigInt) {
        if (bigInt < 0n || bigInt > (1n << BigInt(constants6.BITS)) - 1n) {
            throw new address_error_1.AddressError('IPv6 BigInt must be in the range 0 to 2**128 - 1');
        }
        const hex = bigInt.toString(16).padStart(32, '0');
        const groups = [];
        for(let i = 0; i < constants6.GROUPS; i++){
            groups.push(hex.slice(i * 4, (i + 1) * 4));
        }
        return new Address6(groups.join(':'));
    }
    /**
     * Parse a URL (with optional bracketed host and port) into an address and
     * port. Returns either `{ address, port }` on success or
     * `{ error, address: null, port: null }` if the URL could not be parsed.
     * Ports are returned as numbers (or `null` if absent or out of range).
     * @example
     * var addressAndPort = Address6.fromURL('http://[ffff::]:8080/foo/');
     * addressAndPort.address.correctForm(); // 'ffff::'
     * addressAndPort.port; // 8080
     */ static fromURL(url) {
        let host;
        let port = null;
        let result;
        // If we have brackets parse them and find a port
        if (url.indexOf('[') !== -1 && url.indexOf(']:') !== -1) {
            result = constants6.RE_URL_WITH_PORT.exec(url);
            if (result === null) {
                return {
                    error: 'failed to parse address with port',
                    address: null,
                    port: null
                };
            }
            host = result[1];
            port = result[2];
        // If there's a URL extract the address
        } else if (url.indexOf('/') !== -1) {
            // Remove the protocol prefix
            url = url.replace(/^[a-z0-9]+:\/\//, '');
            // Parse the address
            result = constants6.RE_URL.exec(url);
            if (result === null) {
                return {
                    error: 'failed to parse address from URL',
                    address: null,
                    port: null
                };
            }
            host = result[1];
        // Otherwise just assign the URL to the host and let the library parse it
        } else {
            host = url;
        }
        // If there's a port convert it to an integer
        if (port) {
            port = parseInt(port, 10);
            // squelch out of range ports
            if (port < 0 || port > 65536) {
                port = null;
            }
        } else {
            // Standardize `undefined` to `null`
            port = null;
        }
        return {
            address: new Address6(host),
            port
        };
    }
    /**
     * Construct an `Address6` from an address and a hex subnet mask given as
     * separate strings (e.g. as returned by Node's `os.networkInterfaces()`).
     * Throws `AddressError` if the mask is non-contiguous (e.g.
     * `ffff::ffff`).
     * @example
     * var address = Address6.fromAddressAndMask('fe80::1', 'ffff:ffff:ffff:ffff::');
     * address.subnetMask; // 64
     */ static fromAddressAndMask(address, mask) {
        const bits = common.prefixLengthFromMask(new Address6(mask).bigInt(), constants6.BITS);
        return new Address6(`${address}/${bits}`);
    }
    /**
     * Construct an `Address6` from an address and a Cisco-style wildcard mask
     * given as separate strings (e.g. `::ffff:ffff:ffff:ffff` for a `/64`).
     * The wildcard mask is the bitwise inverse of the subnet mask. Throws
     * `AddressError` if the mask is non-contiguous.
     * @example
     * var address = Address6.fromAddressAndWildcardMask('fe80::1', '::ffff:ffff:ffff:ffff');
     * address.subnetMask; // 64
     */ static fromAddressAndWildcardMask(address, wildcardMask) {
        const wildcard = new Address6(wildcardMask).bigInt();
        const allOnes = (BigInt(1) << BigInt(constants6.BITS)) - BigInt(1);
        // eslint-disable-next-line no-bitwise
        const mask = wildcard ^ allOnes;
        const bits = common.prefixLengthFromMask(mask, constants6.BITS);
        return new Address6(`${address}/${bits}`);
    }
    /**
     * Construct an `Address6` from a wildcard pattern with trailing `*`
     * groups. The number of trailing wildcards determines the prefix
     * length: each `*` represents 16 bits. `::` is expanded to zero groups
     * (not wildcards) before evaluating trailing wildcards.
     *
     * Only trailing whole-group wildcards are supported. Partial-group
     * wildcards (e.g. `2001:db8::0*`) and interior wildcards (e.g.
     * `*::1`) throw `AddressError`.
     * @example
     * Address6.fromWildcard('2001:db8:*:*:*:*:*:*').subnet;  // '/32'
     * Address6.fromWildcard('2001:db8::*').subnet;           // '/112'
     * Address6.fromWildcard('*:*:*:*:*:*:*:*').subnet;       // '/0'
     */ static fromWildcard(input) {
        if (input.includes('%') || input.includes('/')) {
            throw new address_error_1.AddressError('Wildcard pattern must not include a zone or CIDR suffix');
        }
        const halves = input.split('::');
        if (halves.length > 2) {
            throw new address_error_1.AddressError("Wildcard pattern cannot contain more than one '::'");
        }
        let groups;
        if (halves.length === 2) {
            const left = halves[0] === '' ? [] : halves[0].split(':');
            const right = halves[1] === '' ? [] : halves[1].split(':');
            const remaining = constants6.GROUPS - left.length - right.length;
            if (remaining < 1) {
                throw new address_error_1.AddressError("Wildcard pattern with '::' has too many groups");
            }
            groups = [
                ...left,
                ...new Array(remaining).fill('0'),
                ...right
            ];
        } else {
            groups = input.split(':');
        }
        if (groups.length !== constants6.GROUPS) {
            throw new address_error_1.AddressError('Wildcard pattern must have 8 groups');
        }
        let firstWildcard = -1;
        for(let i = 0; i < groups.length; i++){
            if (groups[i] === '*') {
                if (firstWildcard === -1) {
                    firstWildcard = i;
                }
            } else if (firstWildcard !== -1) {
                throw new address_error_1.AddressError('Wildcard `*` must only appear in trailing groups (e.g. `2001:db8:*:*:*:*:*:*`)');
            }
        }
        const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
        const replaced = groups.map((g)=>g === '*' ? '0' : g);
        const subnetBits = constants6.BITS - trailing * 16;
        return new Address6(`${replaced.join(':')}/${subnetBits}`);
    }
    /**
     * Create an IPv6-mapped address given an IPv4 address
     * @param {string} address - An IPv4 address string
     * @returns {Address6}
     * @example
     * var address = Address6.fromAddress4('192.168.0.1');
     * address.correctForm(); // '::ffff:c0a8:1'
     * address.to4in6(); // '::ffff:192.168.0.1'
     */ static fromAddress4(address) {
        const address4 = new ipv4_1.Address4(address);
        const mask6 = constants6.BITS - (constants4.BITS - address4.subnetMask);
        return new Address6(`::ffff:${address4.correctForm()}/${mask6}`);
    }
    /**
     * Return an address from ip6.arpa form
     * @param {string} arpaFormAddress - an 'ip6.arpa' form address
     * @returns {Adress6}
     * @example
     * var address = Address6.fromArpa(e.f.f.f.3.c.2.6.f.f.f.e.6.6.8.e.1.0.6.7.9.4.e.c.0.0.0.0.1.0.0.2.ip6.arpa.)
     * address.correctForm(); // '2001:0:ce49:7601:e866:efff:62c3:fffe'
     */ static fromArpa(arpaFormAddress) {
        // remove ending ".ip6.arpa." or just "."
        let address = arpaFormAddress.replace(/(\.ip6\.arpa)?\.$/, '');
        const semicolonAmount = 7;
        // correct ip6.arpa form with ending removed will be 63 characters
        if (address.length !== 63) {
            throw new address_error_1.AddressError("Invalid 'ip6.arpa' form.");
        }
        const parts = address.split('.').reverse();
        for(let i = semicolonAmount; i > 0; i--){
            const insertIndex = i * 4;
            parts.splice(insertIndex, 0, ':');
        }
        address = parts.join('');
        return new Address6(address);
    }
    /**
     * Return the Microsoft UNC transcription of the address
     * @returns {String} the Microsoft UNC transcription of the address
     */ microsoftTranscription() {
        return `${this.correctForm().replace(/:/g, '-')}.ipv6-literal.net`;
    }
    /**
     * Return the first n bits of the address, defaulting to the subnet mask
     * @param {number} [mask=subnet] - the number of bits to mask
     * @returns {String} the first n bits of the address as a string
     */ mask(mask = this.subnetMask) {
        return this.getBitsBase2(0, mask);
    }
    /**
     * Return the number of possible subnets of a given size in the address
     * @param {number} [subnetSize=128] - the subnet size
     * @returns {String}
     */ // TODO: probably useful to have a numeric version of this too
    possibleSubnets(subnetSize = 128) {
        const availableBits = constants6.BITS - this.subnetMask;
        const subnetBits = Math.abs(subnetSize - constants6.BITS);
        const subnetPowers = availableBits - subnetBits;
        if (subnetPowers < 0) {
            return '0';
        }
        return addCommas((BigInt('2') ** BigInt(subnetPowers)).toString(10));
    }
    /**
     * Helper function getting start address.
     * @returns {bigint}
     */ _startAddress() {
        return BigInt(`0b${this.mask() + '0'.repeat(constants6.BITS - this.subnetMask)}`);
    }
    /**
     * The first address in the range given by this address' subnet
     * Often referred to as the Network Address.
     * @returns {Address6}
     */ startAddress() {
        return Address6.fromBigInt(this._startAddress());
    }
    /**
     * The first host address in the range given by this address's subnet ie
     * the first address after the Network Address
     * @returns {Address6}
     */ startAddressExclusive() {
        const adjust = BigInt('1');
        return Address6.fromBigInt(this._startAddress() + adjust);
    }
    /**
     * Helper function getting end address.
     * @returns {bigint}
     */ _endAddress() {
        return BigInt(`0b${this.mask() + '1'.repeat(constants6.BITS - this.subnetMask)}`);
    }
    /**
     * The last address in the range given by this address' subnet
     * Often referred to as the Broadcast
     * @returns {Address6}
     */ endAddress() {
        return Address6.fromBigInt(this._endAddress());
    }
    /**
     * The last host address in the range given by this address's subnet ie
     * the last address prior to the Broadcast Address
     * @returns {Address6}
     */ endAddressExclusive() {
        const adjust = BigInt('1');
        return Address6.fromBigInt(this._endAddress() - adjust);
    }
    /**
     * The hex form of the subnet mask, e.g. `ffff:ffff:ffff:ffff::` for a
     * `/64`. Returns an `Address6`; call `.correctForm()` for the string.
     * @returns {Address6}
     */ subnetMaskAddress() {
        return Address6.fromBigInt(BigInt(`0b${'1'.repeat(this.subnetMask)}${'0'.repeat(constants6.BITS - this.subnetMask)}`));
    }
    /**
     * The Cisco-style wildcard mask, e.g. `::ffff:ffff:ffff:ffff` for a
     * `/64`. This is the bitwise inverse of `subnetMaskAddress()`. Returns
     * an `Address6`; call `.correctForm()` for the string.
     * @returns {Address6}
     */ wildcardMask() {
        return Address6.fromBigInt(BigInt(`0b${'0'.repeat(this.subnetMask)}${'1'.repeat(constants6.BITS - this.subnetMask)}`));
    }
    /**
     * The network address in CIDR string form, e.g. `2001:db8::/32` for
     * `2001:db8::1/32`. For an address with no explicit subnet the prefix
     * is `/128`, e.g. `networkForm()` on `2001:db8::1` returns
     * `2001:db8::1/128`.
     * @returns {string}
     */ networkForm() {
        return `${this.startAddress().correctForm()}/${this.subnetMask}`;
    }
    /**
     * Return the scope of the address. The 4-bit scope field
     * ([RFC 4291 §2.7](https://datatracker.ietf.org/doc/html/rfc4291#section-2.7))
     * is only defined for multicast addresses; for unicast addresses the scope
     * is derived from the address type per
     * [RFC 4007 §6](https://datatracker.ietf.org/doc/html/rfc4007#section-6).
     * @returns {String}
     */ getScope() {
        const type = this.getType();
        if (type === 'Multicast' || type.startsWith('Multicast ')) {
            const scope = constants6.SCOPES[parseInt(this.getBits(12, 16).toString(10), 10)];
            return scope || 'Unknown';
        }
        // RFC 4291 §2.5.3: the loopback address is treated as having Link-Local
        // scope. (Multicast scope 1, "Interface-Local", is a different concept
        // used only for loopback transmission of multicast.)
        if (type === 'Link-local unicast' || type === 'Loopback') {
            return 'Link local';
        }
        // RFC 4007 §6: the unspecified address has no scope.
        if (type === 'Unspecified') {
            return 'Unknown';
        }
        return 'Global';
    }
    /**
     * Return the type of the address
     * @returns {String}
     */ getType() {
        for(let i = 0; i < TYPE_SUBNETS.length; i++){
            const entry = TYPE_SUBNETS[i];
            if (this.isInSubnet(entry[0])) {
                return entry[1];
            }
        }
        return 'Global unicast';
    }
    /**
     * Return the bits in the given range as a BigInt
     * @returns {bigint}
     */ getBits(start, end) {
        return BigInt(`0b${this.getBitsBase2(start, end)}`);
    }
    /**
     * Return the bits in the given range as a base-2 string
     * @returns {String}
     */ getBitsBase2(start, end) {
        return this.binaryZeroPad().slice(start, end);
    }
    /**
     * Return the bits in the given range as a base-16 string
     * @returns {String}
     */ getBitsBase16(start, end) {
        const length = end - start;
        if (length % 4 !== 0) {
            throw new Error('Length of bits to retrieve must be divisible by four');
        }
        return this.getBits(start, end).toString(16).padStart(length / 4, '0');
    }
    /**
     * Return the bits that are set past the subnet mask length
     * @returns {String}
     */ getBitsPastSubnet() {
        return this.getBitsBase2(this.subnetMask, constants6.BITS);
    }
    /**
     * Return the reversed ip6.arpa form of the address
     * @param {Object} options
     * @param {boolean} options.omitSuffix - omit the "ip6.arpa" suffix
     * @returns {String}
     */ reverseForm(options) {
        if (!options) {
            options = {};
        }
        const characters = Math.floor(this.subnetMask / 4);
        const reversed = this.canonicalForm().replace(/:/g, '').split('').slice(0, characters).reverse().join('.');
        if (characters > 0) {
            if (options.omitSuffix) {
                return reversed;
            }
            return `${reversed}.ip6.arpa.`;
        }
        if (options.omitSuffix) {
            return '';
        }
        return 'ip6.arpa.';
    }
    /**
     * Returns the address in correct form, per
     * [RFC 5952](https://datatracker.ietf.org/doc/html/rfc5952): leading zeros
     * stripped, the longest run of zero groups collapsed to `::`, and hex digits
     * lowercased (e.g. `2001:db8::1`). This is the recommended form for display.
     */ correctForm() {
        let i;
        let groups = [];
        let zeroCounter = 0;
        const zeroes = [];
        for(i = 0; i < this.parsedAddress.length; i++){
            const value = parseInt(this.parsedAddress[i], 16);
            if (value === 0) {
                zeroCounter++;
            }
            if (value !== 0 && zeroCounter > 0) {
                if (zeroCounter > 1) {
                    zeroes.push([
                        i - zeroCounter,
                        i - 1
                    ]);
                }
                zeroCounter = 0;
            }
        }
        // Do we end with a string of zeroes?
        if (zeroCounter > 1) {
            zeroes.push([
                this.parsedAddress.length - zeroCounter,
                this.parsedAddress.length - 1
            ]);
        }
        const zeroLengths = zeroes.map((n)=>n[1] - n[0] + 1);
        if (zeroes.length > 0) {
            const index = zeroLengths.indexOf(Math.max(...zeroLengths));
            groups = compact(this.parsedAddress, zeroes[index]);
        } else {
            groups = this.parsedAddress;
        }
        for(i = 0; i < groups.length; i++){
            if (groups[i] !== 'compact') {
                groups[i] = parseInt(groups[i], 16).toString(16);
            }
        }
        let correct = groups.join(':');
        correct = correct.replace(/^compact$/, '::');
        correct = correct.replace(/(^compact)|(compact$)/, ':');
        correct = correct.replace(/compact/, '');
        return correct;
    }
    /**
     * Return a zero-padded base-2 string representation of the address
     * @returns {String}
     * @example
     * var address = new Address6('2001:4860:4001:803::1011');
     * address.binaryZeroPad();
     * // '0010000000000001010010000110000001000000000000010000100000000011
     * //  0000000000000000000000000000000000000000000000000001000000010001'
     */ binaryZeroPad() {
        if (this._binaryZeroPad === undefined) {
            this._binaryZeroPad = this.bigInt().toString(2).padStart(constants6.BITS, '0');
        }
        return this._binaryZeroPad;
    }
    /**
     * Parses a v4-in-v6 string (e.g. `::ffff:192.168.0.1`) by extracting the
     * trailing IPv4 address into `this.address4` / `this.parsedAddress4` and
     * returning the address with the v4 portion converted to two v6 groups.
     * Used internally by `parse()`.
     */ // TODO: Improve the semantics of this helper function
    parse4in6(address) {
        if (address.indexOf('.') === -1) {
            return address;
        }
        const groups = address.split(':');
        const lastGroup = groups.slice(-1)[0];
        const address4 = lastGroup.match(constants4.RE_ADDRESS);
        if (address4) {
            this.parsedAddress4 = address4[0];
            this.address4 = new ipv4_1.Address4(this.parsedAddress4);
            for(let i = 0; i < this.address4.groups; i++){
                if (/^0[0-9]+/.test(this.address4.parsedAddress[i])) {
                    // The prefix groups haven't been through the bad-character check
                    // yet, so escape them before including in the error HTML.
                    const highlighted = this.address4.parsedAddress.map(spanLeadingZeroes4).join('.');
                    const prefix = groups.slice(0, -1).map(helpers.escapeHtml).join(':');
                    const separator = groups.length > 1 ? ':' : '';
                    throw new address_error_1.AddressError("IPv4 addresses can't have leading zeroes.", `${prefix}${separator}${highlighted}`);
                }
            }
            this.v4 = true;
            groups[groups.length - 1] = this.address4.toGroup6();
            address = groups.join(':');
        }
        return address;
    }
    /**
     * Parses an IPv6 address string into its 8 hexadecimal groups (expanding
     * any `::` elision and any trailing v4-in-v6 portion) and stores the result
     * on `this.parsedAddress`. Called automatically by the constructor; you
     * typically don't need to call it directly. Throws `AddressError` if the
     * input is malformed.
     */ // TODO: Make private?
    parse(address) {
        address = this.parse4in6(address);
        const badCharacters = address.match(constants6.RE_BAD_CHARACTERS);
        if (badCharacters) {
            throw new address_error_1.AddressError(`Bad character${badCharacters.length > 1 ? 's' : ''} detected in address: ${badCharacters.join('')}`, address.replace(constants6.RE_BAD_CHARACTERS, '<span class="parse-error">$1</span>'));
        }
        const badAddress = address.match(constants6.RE_BAD_ADDRESS);
        if (badAddress) {
            throw new address_error_1.AddressError(`Address failed regex: ${badAddress.join('')}`, address.replace(constants6.RE_BAD_ADDRESS, '<span class="parse-error">$1</span>'));
        }
        let groups = [];
        const halves = address.split('::');
        if (halves.length === 2) {
            let first = halves[0].split(':');
            let last = halves[1].split(':');
            if (first.length === 1 && first[0] === '') {
                first = [];
            }
            if (last.length === 1 && last[0] === '') {
                last = [];
            }
            const remaining = this.groups - (first.length + last.length);
            if (!remaining) {
                throw new address_error_1.AddressError('Error parsing groups');
            }
            this.elidedGroups = remaining;
            this.elisionBegin = first.length;
            this.elisionEnd = first.length + this.elidedGroups;
            groups = groups.concat(first);
            for(let i = 0; i < remaining; i++){
                groups.push('0');
            }
            groups = groups.concat(last);
        } else if (halves.length === 1) {
            groups = address.split(':');
            this.elidedGroups = 0;
        } else {
            throw new address_error_1.AddressError('Too many :: groups found');
        }
        groups = groups.map((group)=>parseInt(group, 16).toString(16));
        if (groups.length !== this.groups) {
            throw new address_error_1.AddressError('Incorrect number of groups found');
        }
        return groups;
    }
    /**
     * Returns the canonical (fully expanded) form of the address: all 8 groups,
     * each padded to 4 hex digits, with no `::` collapsing
     * (e.g. `2001:0db8:0000:0000:0000:0000:0000:0001`). Useful for sorting and
     * byte-exact comparison.
     */ canonicalForm() {
        return this.parsedAddress.map(paddedHex).join(':');
    }
    /**
     * Return the decimal form of the address
     * @returns {String}
     */ decimal() {
        return this.parsedAddress.map((n)=>parseInt(n, 16).toString(10).padStart(5, '0')).join(':');
    }
    /**
     * Return the address as a BigInt
     * @returns {bigint}
     */ bigInt() {
        return BigInt(`0x${this.parsedAddress.map(paddedHex).join('')}`);
    }
    /**
     * Return the last two groups of this address as an IPv4 address string
     * @returns {Address4}
     * @example
     * var address = new Address6('2001:4860:4001::1825:bf11');
     * address.to4().correctForm(); // '24.37.191.17'
     */ to4() {
        const binary = this.binaryZeroPad().split('');
        return ipv4_1.Address4.fromHex(BigInt(`0b${binary.slice(96, 128).join('')}`).toString(16).padStart(8, '0'));
    }
    /**
     * Return the v4-in-v6 form of the address
     * @returns {String}
     */ to4in6() {
        const address4 = this.to4();
        const address6 = new Address6(this.parsedAddress.slice(0, 6).join(':'), 6);
        const correct = address6.correctForm();
        let infix = '';
        if (!/:$/.test(correct)) {
            infix = ':';
        }
        return correct + infix + address4.address;
    }
    /**
     * Decodes the Teredo tunneling fields embedded in this address. Returns the
     * Teredo prefix, server IPv4, client IPv4, raw flag bits, cone-NAT flag,
     * UDP port, and Microsoft-format flag breakdown (reserved, universal/local,
     * group/individual, nonce). Only meaningful for addresses in `2001::/32`.
     */ inspectTeredo() {
        /*
        - Bits 0 to 31 are set to the Teredo prefix (normally 2001:0000::/32).
        - Bits 32 to 63 embed the primary IPv4 address of the Teredo server that
          is used.
        - Bits 64 to 79 can be used to define some flags. Currently only the
          higher order bit is used; it is set to 1 if the Teredo client is
          located behind a cone NAT, 0 otherwise. For Microsoft's Windows Vista
          and Windows Server 2008 implementations, more bits are used. In those
          implementations, the format for these 16 bits is "CRAAAAUG AAAAAAAA",
          where "C" remains the "Cone" flag. The "R" bit is reserved for future
          use. The "U" bit is for the Universal/Local flag (set to 0). The "G" bit
          is Individual/Group flag (set to 0). The A bits are set to a 12-bit
          randomly generated number chosen by the Teredo client to introduce
          additional protection for the Teredo node against IPv6-based scanning
          attacks.
        - Bits 80 to 95 contains the obfuscated UDP port number. This is the
          port number that is mapped by the NAT to the Teredo client with all
          bits inverted.
        - Bits 96 to 127 contains the obfuscated IPv4 address. This is the
          public IPv4 address of the NAT with all bits inverted.
        */ const prefix = this.getBitsBase16(0, 32);
        const bitsForUdpPort = this.getBits(80, 96);
        // eslint-disable-next-line no-bitwise
        const udpPort = (bitsForUdpPort ^ BigInt('0xffff')).toString();
        const server4 = ipv4_1.Address4.fromHex(this.getBitsBase16(32, 64));
        const bitsForClient4 = this.getBits(96, 128);
        // eslint-disable-next-line no-bitwise
        const client4 = ipv4_1.Address4.fromHex((bitsForClient4 ^ BigInt('0xffffffff')).toString(16).padStart(8, '0'));
        const flagsBase2 = this.getBitsBase2(64, 80);
        const coneNat = (0, common_1.testBit)(flagsBase2, 15);
        const reserved = (0, common_1.testBit)(flagsBase2, 14);
        const groupIndividual = (0, common_1.testBit)(flagsBase2, 8);
        const universalLocal = (0, common_1.testBit)(flagsBase2, 9);
        const nonce = BigInt(`0b${flagsBase2.slice(2, 6) + flagsBase2.slice(8, 16)}`).toString(10);
        return {
            prefix: `${prefix.slice(0, 4)}:${prefix.slice(4, 8)}`,
            server4: server4.address,
            client4: client4.address,
            flags: flagsBase2,
            coneNat,
            microsoft: {
                reserved,
                universalLocal,
                groupIndividual,
                nonce
            },
            udpPort
        };
    }
    /**
     * Decodes the 6to4 tunneling fields embedded in this address. Returns the
     * 6to4 prefix and the embedded IPv4 gateway address. Only meaningful for
     * addresses in `2002::/16`.
     */ inspect6to4() {
        /*
        - Bits 0 to 15 are set to the 6to4 prefix (2002::/16).
        - Bits 16 to 48 embed the IPv4 address of the 6to4 gateway that is used.
        */ const prefix = this.getBitsBase16(0, 16);
        const gateway = ipv4_1.Address4.fromHex(this.getBitsBase16(16, 48));
        return {
            prefix: prefix.slice(0, 4),
            gateway: gateway.address
        };
    }
    /**
     * Return a v6 6to4 address from a v6 v4inv6 address
     * @returns {Address6}
     */ to6to4() {
        if (!this.is4()) {
            return null;
        }
        const addr6to4 = [
            '2002',
            this.getBitsBase16(96, 112),
            this.getBitsBase16(112, 128),
            '',
            '/16'
        ].join(':');
        return new Address6(addr6to4);
    }
    /**
     * Embed an IPv4 address into a NAT64 IPv6 address using the encoding
     * defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
     * The default prefix is the well-known prefix `64:ff9b::/96`. The prefix
     * length must be one of 32, 40, 48, 56, 64, or 96; for prefixes shorter
     * than /64 the IPv4 octets are split around the reserved bits 64–71.
     * @example
     * Address6.fromAddress4Nat64('192.0.2.33').correctForm(); // '64:ff9b::c000:221'
     * Address6.fromAddress4Nat64('192.0.2.33', '2001:db8::/32').correctForm(); // '2001:db8:c000:221::'
     */ static fromAddress4Nat64(address, prefix = '64:ff9b::/96') {
        const v4 = new ipv4_1.Address4(address);
        const prefix6 = new Address6(prefix);
        const pl = prefix6.subnetMask;
        if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
            throw new address_error_1.AddressError('NAT64 prefix length must be 32, 40, 48, 56, 64, or 96');
        }
        const prefixBits = prefix6.binaryZeroPad();
        const v4Bits = v4.binaryZeroPad();
        let bits;
        if (pl === 96) {
            bits = prefixBits.slice(0, 96) + v4Bits;
        } else {
            const beforeU = 64 - pl;
            bits = prefixBits.slice(0, pl) + v4Bits.slice(0, beforeU) + '00000000' + v4Bits.slice(beforeU) + '0'.repeat(128 - 72 - (32 - beforeU));
        }
        const hex = BigInt(`0b${bits}`).toString(16).padStart(32, '0');
        const groups = [];
        for(let i = 0; i < 8; i++){
            groups.push(hex.slice(i * 4, (i + 1) * 4));
        }
        return new Address6(groups.join(':'));
    }
    /**
     * Extract the embedded IPv4 address from a NAT64 IPv6 address using the
     * encoding defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
     * The default prefix is the well-known prefix `64:ff9b::/96`. Returns
     * `null` if this address is not contained within the given prefix.
     * @example
     * new Address6('64:ff9b::c000:221').toAddress4Nat64()!.correctForm(); // '192.0.2.33'
     */ toAddress4Nat64(prefix = '64:ff9b::/96') {
        const prefix6 = new Address6(prefix);
        const pl = prefix6.subnetMask;
        if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
            throw new address_error_1.AddressError('NAT64 prefix length must be 32, 40, 48, 56, 64, or 96');
        }
        if (!this.isInSubnet(prefix6)) {
            return null;
        }
        const bits = this.binaryZeroPad();
        let v4Bits;
        if (pl === 96) {
            v4Bits = bits.slice(96, 128);
        } else {
            const beforeU = 64 - pl;
            v4Bits = bits.slice(pl, pl + beforeU) + bits.slice(72, 72 + (32 - beforeU));
        }
        const octets = [];
        for(let i = 0; i < 4; i++){
            octets.push(parseInt(v4Bits.slice(i * 8, (i + 1) * 8), 2).toString());
        }
        return new ipv4_1.Address4(octets.join('.'));
    }
    /**
     * Return a byte array.
     *
     * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toByteArray())`.
     * @returns {Array}
     */ toByteArray() {
        const valueWithoutPadding = this.bigInt().toString(16);
        const leadingPad = '0'.repeat(valueWithoutPadding.length % 2);
        const value = `${leadingPad}${valueWithoutPadding}`;
        const bytes = [];
        for(let i = 0, length = value.length; i < length; i += 2){
            bytes.push(parseInt(value.substring(i, i + 2), 16));
        }
        return bytes;
    }
    /**
     * Return an unsigned byte array.
     *
     * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toUnsignedByteArray())`.
     * @returns {Array}
     */ toUnsignedByteArray() {
        return this.toByteArray().map(unsignByte);
    }
    /**
     * Convert a byte array to an Address6 object.
     *
     * To convert from a Node.js `Buffer`, spread it: `Address6.fromByteArray([...buf])`.
     * @returns {Address6}
     */ static fromByteArray(bytes) {
        return this.fromUnsignedByteArray(bytes.map(unsignByte));
    }
    /**
     * Convert an unsigned byte array to an Address6 object.
     *
     * To convert from a Node.js `Buffer`, spread it: `Address6.fromUnsignedByteArray([...buf])`.
     * @returns {Address6}
     */ static fromUnsignedByteArray(bytes) {
        const BYTE_MAX = BigInt('256');
        let result = BigInt('0');
        let multiplier = BigInt('1');
        for(let i = bytes.length - 1; i >= 0; i--){
            result += multiplier * BigInt(bytes[i].toString(10));
            multiplier *= BYTE_MAX;
        }
        return Address6.fromBigInt(result);
    }
    /**
     * Returns true if the address is in the canonical form, false otherwise
     * @returns {boolean}
     */ isCanonical() {
        return this.addressMinusSuffix === this.canonicalForm();
    }
    /**
     * Returns true if the address is a link local address, false otherwise
     * @returns {boolean}
     */ isLinkLocal() {
        // Zeroes are required, i.e. we can't check isInSubnet with 'fe80::/10'
        if (this.getBitsBase2(0, 64) === '1111111010000000000000000000000000000000000000000000000000000000') {
            return true;
        }
        return false;
    }
    /**
     * Returns true if the address is a multicast address, false otherwise
     * @returns {boolean}
     */ isMulticast() {
        const type = this.getType();
        return type === 'Multicast' || type.startsWith('Multicast ');
    }
    /**
     * Returns true if the address was written in v4-in-v6 dotted-quad notation
     * (e.g. `::ffff:127.0.0.1`), false otherwise. This is a notation-level flag
     * and does not reflect whether the address bits lie in the IPv4-mapped
     * (`::ffff:0:0/96`) subnet — for that, see {@link isMapped4}.
     * @returns {boolean}
     */ is4() {
        return this.v4;
    }
    /**
     * Returns true if the address is an IPv4-mapped IPv6 address in
     * `::ffff:0:0/96` ([RFC 4291 §2.5.5.2](https://datatracker.ietf.org/doc/html/rfc4291#section-2.5.5.2)),
     * false otherwise. Unlike {@link is4}, this checks the underlying address
     * bits rather than the textual notation, so `::ffff:127.0.0.1` and
     * `::ffff:7f00:1` both return true.
     * @returns {boolean}
     */ isMapped4() {
        return this.isInSubnet(IPV4_MAPPED_SUBNET);
    }
    /**
     * Returns true if the address is a Teredo address, false otherwise
     * @returns {boolean}
     */ isTeredo() {
        return this.isInSubnet(TEREDO_SUBNET);
    }
    /**
     * Returns true if the address is a 6to4 address, false otherwise
     * @returns {boolean}
     */ is6to4() {
        return this.isInSubnet(SIX_TO_FOUR_SUBNET);
    }
    /**
     * Returns true if the address is a loopback address, false otherwise
     * @returns {boolean}
     */ isLoopback() {
        return this.getType() === 'Loopback';
    }
    /**
     * Returns true if the address is a Unique Local Address in `fc00::/7` ([RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193)). ULAs are the IPv6 equivalent of IPv4 [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private addresses.
     * @returns {boolean}
     */ isULA() {
        return this.isInSubnet(ULA_SUBNET);
    }
    /**
     * Returns true if the address is the unspecified address `::`.
     * @returns {boolean}
     */ isUnspecified() {
        return this.getType() === 'Unspecified';
    }
    /**
     * Returns true if the address is in the documentation prefix `2001:db8::/32` ([RFC 3849](https://datatracker.ietf.org/doc/html/rfc3849)).
     * @returns {boolean}
     */ isDocumentation() {
        return this.isInSubnet(DOCUMENTATION_SUBNET);
    }
    // #endregion
    // #region HTML
    /**
     * Returns the address as an HTTP URL with the host bracketed, e.g.
     * `http://[2001:db8::1]/`. If `optionalPort` is provided it is appended,
     * e.g. `http://[2001:db8::1]:8080/`.
     */ href(optionalPort) {
        if (optionalPort === undefined) {
            optionalPort = '';
        } else {
            optionalPort = `:${optionalPort}`;
        }
        return `http://[${this.correctForm()}]${optionalPort}/`;
    }
    /**
     * Returns an HTML `<a>` element whose `href` encodes the address in a URL
     * hash fragment (default prefix `/#address=`). Useful for linking between
     * pages of an address-inspector UI.
     * @param options.className - CSS class for the rendered `<a>` element
     * @param options.prefix - hash prefix prepended to the address (default `/#address=`)
     * @param options.v4 - when true, render the address in v4-in-v6 form
     */ link(options) {
        if (!options) {
            options = {};
        }
        if (options.className === undefined) {
            options.className = '';
        }
        if (options.prefix === undefined) {
            options.prefix = '/#address=';
        }
        if (options.v4 === undefined) {
            options.v4 = false;
        }
        let formFunction = this.correctForm;
        if (options.v4) {
            formFunction = this.to4in6;
        }
        const form = formFunction.call(this);
        const safeHref = helpers.escapeHtml(`${options.prefix}${form}`);
        const safeForm = helpers.escapeHtml(form);
        if (options.className) {
            const safeClass = helpers.escapeHtml(options.className);
            return `<a href="${safeHref}" class="${safeClass}">${safeForm}</a>`;
        }
        return `<a href="${safeHref}">${safeForm}</a>`;
    }
    /**
     * Groups an address
     * @returns {String}
     */ group() {
        if (this.elidedGroups === 0) {
            // The simple case
            return helpers.simpleGroup(this.addressMinusSuffix).join(':');
        }
        assert(typeof this.elidedGroups === 'number');
        assert(typeof this.elisionBegin === 'number');
        // The elided case
        const output = [];
        const [left, right] = this.addressMinusSuffix.split('::');
        if (left.length) {
            output.push(...helpers.simpleGroup(left));
        } else {
            output.push('');
        }
        const classes = [
            'hover-group'
        ];
        for(let i = this.elisionBegin; i < this.elisionBegin + this.elidedGroups; i++){
            classes.push(`group-${i}`);
        }
        output.push(`<span class="${classes.join(' ')}"></span>`);
        if (right.length) {
            output.push(...helpers.simpleGroup(right, this.elisionEnd));
        } else {
            output.push('');
        }
        if (this.is4()) {
            assert(this.address4 instanceof ipv4_1.Address4);
            output.pop();
            output.push(this.address4.groupForV6());
        }
        return output.join(':');
    }
    // #endregion
    // #region Regular expressions
    /**
     * Generate a regular expression string that can be used to find or validate
     * all variations of this address
     * @param {boolean} substringSearch
     * @returns {string}
     */ regularExpressionString(substringSearch = false) {
        let output = [];
        // TODO: revisit why this is necessary
        const address6 = new Address6(this.correctForm());
        if (address6.elidedGroups === 0) {
            // The simple case
            output.push((0, regular_expressions_1.simpleRegularExpression)(address6.parsedAddress));
        } else if (address6.elidedGroups === constants6.GROUPS) {
            // A completely elided address
            output.push((0, regular_expressions_1.possibleElisions)(constants6.GROUPS));
        } else {
            // A partially elided address
            const halves = address6.address.split('::');
            if (halves[0].length) {
                output.push((0, regular_expressions_1.simpleRegularExpression)(halves[0].split(':')));
            }
            assert(typeof address6.elidedGroups === 'number');
            output.push((0, regular_expressions_1.possibleElisions)(address6.elidedGroups, halves[0].length !== 0, halves[1].length !== 0));
            if (halves[1].length) {
                output.push((0, regular_expressions_1.simpleRegularExpression)(halves[1].split(':')));
            }
            output = [
                output.join(':')
            ];
        }
        if (!substringSearch) {
            output = [
                '(?=^|',
                regular_expressions_1.ADDRESS_BOUNDARY,
                '|[^\\w\\:])(',
                ...output,
                ')(?=[^\\w\\:]|',
                regular_expressions_1.ADDRESS_BOUNDARY,
                '|$)'
            ];
        }
        return output.join('');
    }
    /**
     * Generate a regular expression that can be used to find or validate all
     * variations of this address.
     * @param {boolean} substringSearch
     * @returns {RegExp}
     */ regularExpression(substringSearch = false) {
        return new RegExp(this.regularExpressionString(substringSearch), 'i');
    }
}
exports.Address6 = Address6;
const TYPE_SUBNETS = Object.keys(constants6.TYPES).map((subnet)=>[
        new Address6(subnet),
        constants6.TYPES[subnet]
    ]);
const TEREDO_SUBNET = new Address6('2001::/32');
const SIX_TO_FOUR_SUBNET = new Address6('2002::/16');
const ULA_SUBNET = new Address6('fc00::/7');
const DOCUMENTATION_SUBNET = new Address6('2001:db8::/32');
const IPV4_MAPPED_SUBNET = new Address6('::ffff:0:0/96');
}),
"[project]/node_modules/ip-address/dist/ip-address.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.v6 = exports.AddressError = exports.Address6 = exports.Address4 = void 0;
var ipv4_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/ipv4.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Address4", {
    enumerable: true,
    get: function() {
        return ipv4_1.Address4;
    }
});
var ipv6_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/ipv6.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Address6", {
    enumerable: true,
    get: function() {
        return ipv6_1.Address6;
    }
});
var address_error_1 = __turbopack_context__.r("[project]/node_modules/ip-address/dist/address-error.js [app-route] (ecmascript)");
Object.defineProperty(exports, "AddressError", {
    enumerable: true,
    get: function() {
        return address_error_1.AddressError;
    }
});
const helpers = __importStar(__turbopack_context__.r("[project]/node_modules/ip-address/dist/v6/helpers.js [app-route] (ecmascript)"));
exports.v6 = {
    helpers
};
}),
"[project]/node_modules/@prisma/debug/dist/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Debug",
    ()=>Debug,
    "clearLogs",
    ()=>clearLogs,
    "default",
    ()=>index_default,
    "getLogs",
    ()=>getLogs
]);
var __defProp = Object.defineProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
// ../../node_modules/.pnpm/kleur@4.1.5/node_modules/kleur/colors.mjs
var colors_exports = {};
__export(colors_exports, {
    $: ()=>$,
    bgBlack: ()=>bgBlack,
    bgBlue: ()=>bgBlue,
    bgCyan: ()=>bgCyan,
    bgGreen: ()=>bgGreen,
    bgMagenta: ()=>bgMagenta,
    bgRed: ()=>bgRed,
    bgWhite: ()=>bgWhite,
    bgYellow: ()=>bgYellow,
    black: ()=>black,
    blue: ()=>blue,
    bold: ()=>bold,
    cyan: ()=>cyan,
    dim: ()=>dim,
    gray: ()=>gray,
    green: ()=>green,
    grey: ()=>grey,
    hidden: ()=>hidden,
    inverse: ()=>inverse,
    italic: ()=>italic,
    magenta: ()=>magenta,
    red: ()=>red,
    reset: ()=>reset,
    strikethrough: ()=>strikethrough,
    underline: ()=>underline,
    white: ()=>white,
    yellow: ()=>yellow
});
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof process !== "undefined") {
    ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
    isTTY = process.stdout && process.stdout.isTTY;
}
var $ = {
    enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
};
function init(x, y) {
    let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
    let open = `\x1B[${x}m`, close = `\x1B[${y}m`;
    return function(txt) {
        if (!$.enabled || txt == null) return txt;
        return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
    };
}
var reset = init(0, 0);
var bold = init(1, 22);
var dim = init(2, 22);
var italic = init(3, 23);
var underline = init(4, 24);
var inverse = init(7, 27);
var hidden = init(8, 28);
var strikethrough = init(9, 29);
var black = init(30, 39);
var red = init(31, 39);
var green = init(32, 39);
var yellow = init(33, 39);
var blue = init(34, 39);
var magenta = init(35, 39);
var cyan = init(36, 39);
var white = init(37, 39);
var gray = init(90, 39);
var grey = init(90, 39);
var bgBlack = init(40, 49);
var bgRed = init(41, 49);
var bgGreen = init(42, 49);
var bgYellow = init(43, 49);
var bgBlue = init(44, 49);
var bgMagenta = init(45, 49);
var bgCyan = init(46, 49);
var bgWhite = init(47, 49);
// src/index.ts
var MAX_ARGS_HISTORY = 100;
var COLORS = [
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "red"
];
var argsHistory = [];
var lastTimestamp = Date.now();
var lastColor = 0;
var processEnv = typeof process !== "undefined" ? process.env : {};
globalThis.DEBUG ??= processEnv.DEBUG ?? "";
globalThis.DEBUG_COLORS ??= processEnv.DEBUG_COLORS ? processEnv.DEBUG_COLORS === "true" : true;
var topProps = {
    enable (namespace) {
        if (typeof namespace === "string") {
            globalThis.DEBUG = namespace;
        }
    },
    disable () {
        const prev = globalThis.DEBUG;
        globalThis.DEBUG = "";
        return prev;
    },
    // this is the core logic to check if logging should happen or not
    enabled (namespace) {
        const listenedNamespaces = globalThis.DEBUG.split(",").map((s)=>{
            return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
        });
        const isListened = listenedNamespaces.some((listenedNamespace)=>{
            if (listenedNamespace === "" || listenedNamespace[0] === "-") return false;
            return namespace.match(RegExp(listenedNamespace.split("*").join(".*") + "$"));
        });
        const isExcluded = listenedNamespaces.some((listenedNamespace)=>{
            if (listenedNamespace === "" || listenedNamespace[0] !== "-") return false;
            return namespace.match(RegExp(listenedNamespace.slice(1).split("*").join(".*") + "$"));
        });
        return isListened && !isExcluded;
    },
    log: (...args)=>{
        const [namespace, format, ...rest] = args;
        const logWithFormatting = console.warn ?? console.log;
        logWithFormatting(`${namespace} ${format}`, ...rest);
    },
    formatters: {}
};
function debugCreate(namespace) {
    const instanceProps = {
        color: COLORS[lastColor++ % COLORS.length],
        enabled: topProps.enabled(namespace),
        namespace,
        log: topProps.log,
        extend: ()=>{}
    };
    const debugCall = (...args)=>{
        const { enabled, namespace: namespace2, color, log } = instanceProps;
        if (args.length !== 0) {
            argsHistory.push([
                namespace2,
                ...args
            ]);
        }
        if (argsHistory.length > MAX_ARGS_HISTORY) {
            argsHistory.shift();
        }
        if (topProps.enabled(namespace2) || enabled) {
            const stringArgs = args.map((arg)=>{
                if (typeof arg === "string") {
                    return arg;
                }
                return safeStringify(arg);
            });
            const ms = `+${Date.now() - lastTimestamp}ms`;
            lastTimestamp = Date.now();
            if (globalThis.DEBUG_COLORS) {
                log(colors_exports[color](bold(namespace2)), ...stringArgs, colors_exports[color](ms));
            } else {
                log(namespace2, ...stringArgs, ms);
            }
        }
    };
    return new Proxy(debugCall, {
        get: (_, prop)=>instanceProps[prop],
        set: (_, prop, value)=>instanceProps[prop] = value
    });
}
var Debug = new Proxy(debugCreate, {
    get: (_, prop)=>topProps[prop],
    set: (_, prop, value)=>topProps[prop] = value
});
function safeStringify(value, indent = 2) {
    const cache = /* @__PURE__ */ new Set();
    return JSON.stringify(value, (key, value2)=>{
        if (typeof value2 === "object" && value2 !== null) {
            if (cache.has(value2)) {
                return `[Circular *]`;
            }
            cache.add(value2);
        } else if (typeof value2 === "bigint") {
            return value2.toString();
        }
        return value2;
    }, indent);
}
function getLogs(numChars = 7500) {
    const logs = argsHistory.map(([namespace, ...args])=>{
        return `${namespace} ${args.map((arg)=>{
            if (typeof arg === "string") {
                return arg;
            } else {
                return JSON.stringify(arg);
            }
        }).join(" ")}`;
    }).join("\n");
    if (logs.length < numChars) {
        return logs;
    }
    return logs.slice(-numChars);
}
function clearLogs() {
    argsHistory.length = 0;
}
var index_default = Debug;
;
}),
"[project]/node_modules/@prisma/driver-adapter-utils/dist/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ColumnTypeEnum",
    ()=>ColumnTypeEnum,
    "DriverAdapterError",
    ()=>DriverAdapterError,
    "bindAdapter",
    ()=>bindAdapter,
    "bindMigrationAwareSqlAdapterFactory",
    ()=>bindMigrationAwareSqlAdapterFactory,
    "bindSqlAdapterFactory",
    ()=>bindSqlAdapterFactory,
    "err",
    ()=>err,
    "isDriverAdapterError",
    ()=>isDriverAdapterError,
    "mockAdapter",
    ()=>mockAdapter,
    "mockAdapterErrors",
    ()=>mockAdapterErrors,
    "mockAdapterFactory",
    ()=>mockAdapterFactory,
    "mockMigrationAwareAdapterFactory",
    ()=>mockMigrationAwareAdapterFactory,
    "ok",
    ()=>ok
]);
// src/debug.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/debug/dist/index.mjs [app-route] (ecmascript)");
;
// src/error.ts
var DriverAdapterError = class extends Error {
    name = "DriverAdapterError";
    cause;
    constructor(payload){
        super(typeof payload["message"] === "string" ? payload["message"] : payload.kind);
        this.cause = payload;
    }
};
function isDriverAdapterError(error) {
    return error["name"] === "DriverAdapterError" && typeof error["cause"] === "object";
}
// src/result.ts
function ok(value) {
    return {
        ok: true,
        value,
        map (fn) {
            return ok(fn(value));
        },
        flatMap (fn) {
            return fn(value);
        }
    };
}
function err(error) {
    return {
        ok: false,
        error,
        map () {
            return err(error);
        },
        flatMap () {
            return err(error);
        }
    };
}
// src/binder.ts
var debug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Debug"])("driver-adapter-utils");
var ErrorRegistryInternal = class {
    registeredErrors = [];
    consumeError(id) {
        return this.registeredErrors[id];
    }
    registerNewError(error) {
        let i = 0;
        while(this.registeredErrors[i] !== void 0){
            i++;
        }
        this.registeredErrors[i] = {
            error
        };
        return i;
    }
};
function copySymbolsFromSource(source, target) {
    const symbols = Object.getOwnPropertySymbols(source);
    const symbolObject = Object.fromEntries(symbols.map((symbol)=>[
            symbol,
            true
        ]));
    Object.assign(target, symbolObject);
}
var bindMigrationAwareSqlAdapterFactory = (adapterFactory)=>{
    const errorRegistry = new ErrorRegistryInternal();
    const boundFactory = {
        adapterName: adapterFactory.adapterName,
        provider: adapterFactory.provider,
        errorRegistry,
        connect: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapterFactory.connect.bind(adapterFactory))(...args);
            return ctx.map((ctx2)=>bindAdapter(ctx2, errorRegistry));
        },
        connectToShadowDb: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapterFactory.connectToShadowDb.bind(adapterFactory))(...args);
            return ctx.map((ctx2)=>bindAdapter(ctx2, errorRegistry));
        }
    };
    copySymbolsFromSource(adapterFactory, boundFactory);
    return boundFactory;
};
var bindSqlAdapterFactory = (adapterFactory)=>{
    const errorRegistry = new ErrorRegistryInternal();
    const boundFactory = {
        adapterName: adapterFactory.adapterName,
        provider: adapterFactory.provider,
        errorRegistry,
        connect: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapterFactory.connect.bind(adapterFactory))(...args);
            return ctx.map((ctx2)=>bindAdapter(ctx2, errorRegistry));
        }
    };
    copySymbolsFromSource(adapterFactory, boundFactory);
    return boundFactory;
};
var bindAdapter = (adapter, errorRegistry = new ErrorRegistryInternal())=>{
    const boundAdapter = {
        adapterName: adapter.adapterName,
        errorRegistry,
        queryRaw: wrapAsync(errorRegistry, adapter.queryRaw.bind(adapter)),
        executeRaw: wrapAsync(errorRegistry, adapter.executeRaw.bind(adapter)),
        executeScript: wrapAsync(errorRegistry, adapter.executeScript.bind(adapter)),
        dispose: wrapAsync(errorRegistry, adapter.dispose.bind(adapter)),
        provider: adapter.provider,
        startTransaction: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapter.startTransaction.bind(adapter))(...args);
            return ctx.map((ctx2)=>bindTransaction(errorRegistry, ctx2));
        }
    };
    if (adapter.getConnectionInfo) {
        boundAdapter.getConnectionInfo = wrapSync(errorRegistry, adapter.getConnectionInfo.bind(adapter));
    }
    return boundAdapter;
};
var bindTransaction = (errorRegistry, transaction)=>{
    const boundTransaction = {
        adapterName: transaction.adapterName,
        provider: transaction.provider,
        options: transaction.options,
        queryRaw: wrapAsync(errorRegistry, transaction.queryRaw.bind(transaction)),
        executeRaw: wrapAsync(errorRegistry, transaction.executeRaw.bind(transaction)),
        commit: wrapAsync(errorRegistry, transaction.commit.bind(transaction)),
        rollback: wrapAsync(errorRegistry, transaction.rollback.bind(transaction))
    };
    if (transaction.createSavepoint) {
        boundTransaction.createSavepoint = wrapAsync(errorRegistry, transaction.createSavepoint.bind(transaction));
    }
    if (transaction.rollbackToSavepoint) {
        boundTransaction.rollbackToSavepoint = wrapAsync(errorRegistry, transaction.rollbackToSavepoint.bind(transaction));
    }
    if (transaction.releaseSavepoint) {
        boundTransaction.releaseSavepoint = wrapAsync(errorRegistry, transaction.releaseSavepoint.bind(transaction));
    }
    return boundTransaction;
};
function wrapAsync(registry, fn) {
    return async (...args)=>{
        try {
            return ok(await fn(...args));
        } catch (error) {
            debug("[error@wrapAsync]", error);
            if (isDriverAdapterError(error)) {
                return err(error.cause);
            }
            const id = registry.registerNewError(error);
            return err({
                kind: "GenericJs",
                id
            });
        }
    };
}
function wrapSync(registry, fn) {
    return (...args)=>{
        try {
            return ok(fn(...args));
        } catch (error) {
            debug("[error@wrapSync]", error);
            if (isDriverAdapterError(error)) {
                return err(error.cause);
            }
            const id = registry.registerNewError(error);
            return err({
                kind: "GenericJs",
                id
            });
        }
    };
}
// src/const.ts
var ColumnTypeEnum = {
    // Scalars
    Int32: 0,
    Int64: 1,
    Float: 2,
    Double: 3,
    Numeric: 4,
    Boolean: 5,
    Character: 6,
    Text: 7,
    Date: 8,
    Time: 9,
    DateTime: 10,
    Json: 11,
    Enum: 12,
    Bytes: 13,
    Set: 14,
    Uuid: 15,
    // Arrays
    Int32Array: 64,
    Int64Array: 65,
    FloatArray: 66,
    DoubleArray: 67,
    NumericArray: 68,
    BooleanArray: 69,
    CharacterArray: 70,
    TextArray: 71,
    DateArray: 72,
    TimeArray: 73,
    DateTimeArray: 74,
    JsonArray: 75,
    EnumArray: 76,
    BytesArray: 77,
    UuidArray: 78,
    // Custom
    UnknownNumber: 128
};
// src/mock.ts
var mockAdapterErrors = {
    queryRaw: new Error("Not implemented: queryRaw"),
    executeRaw: new Error("Not implemented: executeRaw"),
    startTransaction: new Error("Not implemented: startTransaction"),
    executeScript: new Error("Not implemented: executeScript"),
    dispose: new Error("Not implemented: dispose")
};
function mockAdapter(provider) {
    return {
        provider,
        adapterName: "@prisma/adapter-mock",
        queryRaw: ()=>Promise.reject(mockAdapterErrors.queryRaw),
        executeRaw: ()=>Promise.reject(mockAdapterErrors.executeRaw),
        startTransaction: ()=>Promise.reject(mockAdapterErrors.startTransaction),
        executeScript: ()=>Promise.reject(mockAdapterErrors.executeScript),
        dispose: ()=>Promise.reject(mockAdapterErrors.dispose),
        [Symbol.for("adapter.mockAdapter")]: true
    };
}
function mockAdapterFactory(provider) {
    return {
        provider,
        adapterName: "@prisma/adapter-mock",
        connect: ()=>Promise.resolve(mockAdapter(provider)),
        [Symbol.for("adapter.mockAdapterFactory")]: true
    };
}
function mockMigrationAwareAdapterFactory(provider) {
    return {
        provider,
        adapterName: "@prisma/adapter-mock",
        connect: ()=>Promise.resolve(mockAdapter(provider)),
        connectToShadowDb: ()=>Promise.resolve(mockAdapter(provider)),
        [Symbol.for("adapter.mockMigrationAwareAdapterFactory")]: true
    };
}
;
}),
"[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg-587764f78a6c7a9c");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/node_modules/postgres-array/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const BACKSLASH = '\\';
const DQUOT = '"';
const LBRACE = '{';
const RBRACE = '}';
const LBRACKET = '[';
const EQUALS = '=';
const COMMA = ',';
/** When the raw value is this, it means a literal `null` */ const NULL_STRING = 'NULL';
/**
 * Parses an array according to
 * https://www.postgresql.org/docs/17/arrays.html#ARRAYS-IO
 *
 * Trusts the data (mostly), so only hook up to trusted Postgres servers.
 */ function makeParseArrayWithTransform(transform) {
    const haveTransform = transform != null;
    return function parseArray(str) {
        const rbraceIndex = str.length - 1;
        if (rbraceIndex === 1) {
            return [];
        }
        if (str[rbraceIndex] !== RBRACE) {
            throw new Error('Invalid array text - must end with }');
        }
        // If starts with `[`, it is specifying the index boundas. Skip past first `=`.
        let position = 0;
        if (str[position] === LBRACKET) {
            position = str.indexOf(EQUALS) + 1;
        }
        if (str[position++] !== LBRACE) {
            throw new Error('Invalid array text - must start with {');
        }
        const output = [];
        let current = output;
        const stack = [];
        let currentStringStart = position;
        let currentString = '';
        let expectValue = true;
        for(; position < rbraceIndex; ++position){
            let char = str[position];
            // > The array output routine will put double quotes around element values if
            // > they are empty strings, contain curly braces, delimiter characters, double
            // > quotes, backslashes, or white space, or match the word NULL. Double quotes
            // > and backslashes embedded in element values will be backslash-escaped.
            if (char === DQUOT) {
                // It's escaped
                currentStringStart = ++position;
                let dquot = str.indexOf(DQUOT, currentStringStart);
                let backSlash = str.indexOf(BACKSLASH, currentStringStart);
                while(backSlash !== -1 && backSlash < dquot){
                    position = backSlash;
                    const part = str.slice(currentStringStart, position);
                    currentString += part;
                    currentStringStart = ++position;
                    if (dquot === position++) {
                        // This was an escaped doublequote; find the next one!
                        dquot = str.indexOf(DQUOT, position);
                    }
                    // Either way, find the next backslash
                    backSlash = str.indexOf(BACKSLASH, position);
                }
                position = dquot;
                const part = str.slice(currentStringStart, position);
                currentString += part;
                current.push(haveTransform ? transform(currentString) : currentString);
                currentString = '';
                expectValue = false;
            } else if (char === LBRACE) {
                const newArray = [];
                current.push(newArray);
                stack.push(current);
                current = newArray;
                currentStringStart = position + 1;
                expectValue = true;
            } else if (char === COMMA) {
                expectValue = true;
            } else if (char === RBRACE) {
                expectValue = false;
                const arr = stack.pop();
                if (arr === undefined) {
                    throw new Error("Invalid array text - too many '}'");
                }
                current = arr;
            } else if (expectValue) {
                currentStringStart = position;
                while((char = str[position]) !== COMMA && char !== RBRACE && position < rbraceIndex){
                    ++position;
                }
                const part = str.slice(currentStringStart, position--);
                current.push(part === NULL_STRING ? null : haveTransform ? transform(part) : part);
                expectValue = false;
            } else {
                throw new Error('Was expecting delimeter');
            }
        }
        return output;
    };
}
const parseArray = makeParseArrayWithTransform();
exports.parse = (source, transform)=>transform != null ? makeParseArrayWithTransform(transform)(source) : parseArray(source);
}),
"[project]/node_modules/@prisma/adapter-pg/dist/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "PrismaPg",
    ()=>PrismaPgAdapterFactory
]);
// src/pg.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/debug/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@prisma/driver-adapter-utils/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$postgres$2d$array$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/postgres-array/index.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
// package.json
var name = "@prisma/adapter-pg";
// src/constants.ts
var FIRST_NORMAL_OBJECT_ID = 16384;
;
;
;
var { types } = __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["default"];
var { builtins: ScalarColumnType, getTypeParser } = types;
var AdditionalScalarColumnType = {
    NAME: 19
};
var ArrayColumnType = {
    BIT_ARRAY: 1561,
    BOOL_ARRAY: 1e3,
    BYTEA_ARRAY: 1001,
    BPCHAR_ARRAY: 1014,
    CHAR_ARRAY: 1002,
    CIDR_ARRAY: 651,
    DATE_ARRAY: 1182,
    FLOAT4_ARRAY: 1021,
    FLOAT8_ARRAY: 1022,
    INET_ARRAY: 1041,
    INT2_ARRAY: 1005,
    INT4_ARRAY: 1007,
    INT8_ARRAY: 1016,
    JSONB_ARRAY: 3807,
    JSON_ARRAY: 199,
    MONEY_ARRAY: 791,
    NUMERIC_ARRAY: 1231,
    OID_ARRAY: 1028,
    TEXT_ARRAY: 1009,
    TIMESTAMP_ARRAY: 1115,
    TIMESTAMPTZ_ARRAY: 1185,
    TIME_ARRAY: 1183,
    UUID_ARRAY: 2951,
    VARBIT_ARRAY: 1563,
    VARCHAR_ARRAY: 1015,
    XML_ARRAY: 143
};
var UnsupportedNativeDataType = class _UnsupportedNativeDataType extends Error {
    // map of type codes to type names
    static typeNames = {
        16: "bool",
        17: "bytea",
        18: "char",
        19: "name",
        20: "int8",
        21: "int2",
        22: "int2vector",
        23: "int4",
        24: "regproc",
        25: "text",
        26: "oid",
        27: "tid",
        28: "xid",
        29: "cid",
        30: "oidvector",
        32: "pg_ddl_command",
        71: "pg_type",
        75: "pg_attribute",
        81: "pg_proc",
        83: "pg_class",
        114: "json",
        142: "xml",
        194: "pg_node_tree",
        269: "table_am_handler",
        325: "index_am_handler",
        600: "point",
        601: "lseg",
        602: "path",
        603: "box",
        604: "polygon",
        628: "line",
        650: "cidr",
        700: "float4",
        701: "float8",
        705: "unknown",
        718: "circle",
        774: "macaddr8",
        790: "money",
        829: "macaddr",
        869: "inet",
        1033: "aclitem",
        1042: "bpchar",
        1043: "varchar",
        1082: "date",
        1083: "time",
        1114: "timestamp",
        1184: "timestamptz",
        1186: "interval",
        1266: "timetz",
        1560: "bit",
        1562: "varbit",
        1700: "numeric",
        1790: "refcursor",
        2202: "regprocedure",
        2203: "regoper",
        2204: "regoperator",
        2205: "regclass",
        2206: "regtype",
        2249: "record",
        2275: "cstring",
        2276: "any",
        2277: "anyarray",
        2278: "void",
        2279: "trigger",
        2280: "language_handler",
        2281: "internal",
        2283: "anyelement",
        2287: "_record",
        2776: "anynonarray",
        2950: "uuid",
        2970: "txid_snapshot",
        3115: "fdw_handler",
        3220: "pg_lsn",
        3310: "tsm_handler",
        3361: "pg_ndistinct",
        3402: "pg_dependencies",
        3500: "anyenum",
        3614: "tsvector",
        3615: "tsquery",
        3642: "gtsvector",
        3734: "regconfig",
        3769: "regdictionary",
        3802: "jsonb",
        3831: "anyrange",
        3838: "event_trigger",
        3904: "int4range",
        3906: "numrange",
        3908: "tsrange",
        3910: "tstzrange",
        3912: "daterange",
        3926: "int8range",
        4072: "jsonpath",
        4089: "regnamespace",
        4096: "regrole",
        4191: "regcollation",
        4451: "int4multirange",
        4532: "nummultirange",
        4533: "tsmultirange",
        4534: "tstzmultirange",
        4535: "datemultirange",
        4536: "int8multirange",
        4537: "anymultirange",
        4538: "anycompatiblemultirange",
        4600: "pg_brin_bloom_summary",
        4601: "pg_brin_minmax_multi_summary",
        5017: "pg_mcv_list",
        5038: "pg_snapshot",
        5069: "xid8",
        5077: "anycompatible",
        5078: "anycompatiblearray",
        5079: "anycompatiblenonarray",
        5080: "anycompatiblerange"
    };
    type;
    constructor(code){
        super();
        this.type = _UnsupportedNativeDataType.typeNames[code] || "Unknown";
        this.message = `Unsupported column type ${this.type}`;
    }
};
function fieldToColumnType(fieldTypeId) {
    switch(fieldTypeId){
        case ScalarColumnType.INT2:
        case ScalarColumnType.INT4:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int32;
        case ScalarColumnType.INT8:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int64;
        case ScalarColumnType.FLOAT4:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Float;
        case ScalarColumnType.FLOAT8:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Double;
        case ScalarColumnType.BOOL:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Boolean;
        case ScalarColumnType.DATE:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Date;
        case ScalarColumnType.TIME:
        case ScalarColumnType.TIMETZ:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Time;
        case ScalarColumnType.TIMESTAMP:
        case ScalarColumnType.TIMESTAMPTZ:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateTime;
        case ScalarColumnType.NUMERIC:
        case ScalarColumnType.MONEY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Numeric;
        case ScalarColumnType.JSON:
        case ScalarColumnType.JSONB:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Json;
        case ScalarColumnType.UUID:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Uuid;
        case ScalarColumnType.OID:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int64;
        case ScalarColumnType.BPCHAR:
        case ScalarColumnType.TEXT:
        case ScalarColumnType.VARCHAR:
        case ScalarColumnType.BIT:
        case ScalarColumnType.VARBIT:
        case ScalarColumnType.INET:
        case ScalarColumnType.CIDR:
        case ScalarColumnType.XML:
        case AdditionalScalarColumnType.NAME:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Text;
        case ScalarColumnType.BYTEA:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Bytes;
        case ArrayColumnType.INT2_ARRAY:
        case ArrayColumnType.INT4_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int32Array;
        case ArrayColumnType.FLOAT4_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].FloatArray;
        case ArrayColumnType.FLOAT8_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DoubleArray;
        case ArrayColumnType.NUMERIC_ARRAY:
        case ArrayColumnType.MONEY_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].NumericArray;
        case ArrayColumnType.BOOL_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].BooleanArray;
        case ArrayColumnType.CHAR_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].CharacterArray;
        case ArrayColumnType.BPCHAR_ARRAY:
        case ArrayColumnType.TEXT_ARRAY:
        case ArrayColumnType.VARCHAR_ARRAY:
        case ArrayColumnType.VARBIT_ARRAY:
        case ArrayColumnType.BIT_ARRAY:
        case ArrayColumnType.INET_ARRAY:
        case ArrayColumnType.CIDR_ARRAY:
        case ArrayColumnType.XML_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].TextArray;
        case ArrayColumnType.DATE_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateArray;
        case ArrayColumnType.TIME_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].TimeArray;
        case ArrayColumnType.TIMESTAMP_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateTimeArray;
        case ArrayColumnType.TIMESTAMPTZ_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateTimeArray;
        case ArrayColumnType.JSON_ARRAY:
        case ArrayColumnType.JSONB_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].JsonArray;
        case ArrayColumnType.BYTEA_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].BytesArray;
        case ArrayColumnType.UUID_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].UuidArray;
        case ArrayColumnType.INT8_ARRAY:
        case ArrayColumnType.OID_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int64Array;
        default:
            if (fieldTypeId >= FIRST_NORMAL_OBJECT_ID) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Text;
            }
            throw new UnsupportedNativeDataType(fieldTypeId);
    }
}
function normalize_array(element_normalizer) {
    return (str)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$postgres$2d$array$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parse"])(str, element_normalizer);
}
function normalize_numeric(numeric) {
    return numeric;
}
function normalize_date(date) {
    return date;
}
function normalize_timestamp(time) {
    return `${time.replace(" ", "T")}+00:00`;
}
function normalize_timestamptz(time) {
    return time.replace(" ", "T").replace(/[+-]\d{2}(:\d{2})?$/, "+00:00");
}
function normalize_time(time) {
    return time;
}
function normalize_timez(time) {
    return time.replace(/[+-]\d{2}(:\d{2})?$/, "");
}
function normalize_money(money) {
    return money.slice(1);
}
function normalize_xml(xml) {
    return xml;
}
function toJson(json) {
    return json;
}
var parsePgBytes = getTypeParser(ScalarColumnType.BYTEA);
var normalizeByteaArray = getTypeParser(ArrayColumnType.BYTEA_ARRAY);
function convertBytes(serializedBytes) {
    return parsePgBytes(serializedBytes);
}
function normalizeBit(bit) {
    return bit;
}
var customParsers = {
    [ScalarColumnType.NUMERIC]: normalize_numeric,
    [ArrayColumnType.NUMERIC_ARRAY]: normalize_array(normalize_numeric),
    [ScalarColumnType.TIME]: normalize_time,
    [ArrayColumnType.TIME_ARRAY]: normalize_array(normalize_time),
    [ScalarColumnType.TIMETZ]: normalize_timez,
    [ScalarColumnType.DATE]: normalize_date,
    [ArrayColumnType.DATE_ARRAY]: normalize_array(normalize_date),
    [ScalarColumnType.TIMESTAMP]: normalize_timestamp,
    [ArrayColumnType.TIMESTAMP_ARRAY]: normalize_array(normalize_timestamp),
    [ScalarColumnType.TIMESTAMPTZ]: normalize_timestamptz,
    [ArrayColumnType.TIMESTAMPTZ_ARRAY]: normalize_array(normalize_timestamptz),
    [ScalarColumnType.MONEY]: normalize_money,
    [ArrayColumnType.MONEY_ARRAY]: normalize_array(normalize_money),
    [ScalarColumnType.JSON]: toJson,
    [ArrayColumnType.JSON_ARRAY]: normalize_array(toJson),
    [ScalarColumnType.JSONB]: toJson,
    [ArrayColumnType.JSONB_ARRAY]: normalize_array(toJson),
    [ScalarColumnType.BYTEA]: convertBytes,
    [ArrayColumnType.BYTEA_ARRAY]: normalizeByteaArray,
    [ArrayColumnType.BIT_ARRAY]: normalize_array(normalizeBit),
    [ArrayColumnType.VARBIT_ARRAY]: normalize_array(normalizeBit),
    [ArrayColumnType.XML_ARRAY]: normalize_array(normalize_xml)
};
function mapArg(arg, argType) {
    if (arg === null) {
        return null;
    }
    if (Array.isArray(arg) && argType.arity === "list") {
        return arg.map((value)=>mapArg(value, argType));
    }
    if (typeof arg === "string" && argType.scalarType === "datetime") {
        arg = new Date(arg);
    }
    if (arg instanceof Date) {
        switch(argType.dbType){
            case "TIME":
            case "TIMETZ":
                return formatTime(arg);
            case "DATE":
                return formatDate(arg);
            default:
                return formatDateTime(arg);
        }
    }
    if (typeof arg === "string" && argType.scalarType === "bytes") {
        return Buffer.from(arg, "base64");
    }
    if (ArrayBuffer.isView(arg)) {
        return new Uint8Array(arg.buffer, arg.byteOffset, arg.byteLength);
    }
    return arg;
}
function formatDateTime(date) {
    const pad = (n, z = 2)=>String(n).padStart(z, "0");
    const ms = date.getUTCMilliseconds();
    return pad(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate()) + " " + pad(date.getUTCHours()) + ":" + pad(date.getUTCMinutes()) + ":" + pad(date.getUTCSeconds()) + (ms ? "." + String(ms).padStart(3, "0") : "");
}
function formatDate(date) {
    const pad = (n, z = 2)=>String(n).padStart(z, "0");
    return pad(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate());
}
function formatTime(date) {
    const pad = (n, z = 2)=>String(n).padStart(z, "0");
    const ms = date.getUTCMilliseconds();
    return pad(date.getUTCHours()) + ":" + pad(date.getUTCMinutes()) + ":" + pad(date.getUTCSeconds()) + (ms ? "." + String(ms).padStart(3, "0") : "");
}
// src/errors.ts
var TLS_ERRORS = /* @__PURE__ */ new Set([
    "UNABLE_TO_GET_ISSUER_CERT",
    "UNABLE_TO_GET_CRL",
    "UNABLE_TO_DECRYPT_CERT_SIGNATURE",
    "UNABLE_TO_DECRYPT_CRL_SIGNATURE",
    "UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY",
    "CERT_SIGNATURE_FAILURE",
    "CRL_SIGNATURE_FAILURE",
    "CERT_NOT_YET_VALID",
    "CERT_HAS_EXPIRED",
    "CRL_NOT_YET_VALID",
    "CRL_HAS_EXPIRED",
    "ERROR_IN_CERT_NOT_BEFORE_FIELD",
    "ERROR_IN_CERT_NOT_AFTER_FIELD",
    "ERROR_IN_CRL_LAST_UPDATE_FIELD",
    "ERROR_IN_CRL_NEXT_UPDATE_FIELD",
    "DEPTH_ZERO_SELF_SIGNED_CERT",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "CERT_CHAIN_TOO_LONG",
    "CERT_REVOKED",
    "INVALID_CA",
    "INVALID_PURPOSE",
    "CERT_UNTRUSTED",
    "CERT_REJECTED",
    "HOSTNAME_MISMATCH",
    "ERR_TLS_CERT_ALTNAME_FORMAT",
    "ERR_TLS_CERT_ALTNAME_INVALID"
]);
var SOCKET_ERRORS = /* @__PURE__ */ new Set([
    "ENOTFOUND",
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT"
]);
function convertDriverError(error) {
    if (isSocketError(error)) {
        return mapSocketError(error);
    }
    if (isTlsError(error)) {
        return {
            kind: "TlsConnectionError",
            reason: error.message
        };
    }
    if (isDriverError(error)) {
        return {
            originalCode: error.code,
            originalMessage: error.message,
            ...mapDriverError(error)
        };
    }
    throw error;
}
function mapDriverError(error) {
    switch(error.code){
        case "22001":
            return {
                kind: "LengthMismatch",
                column: error.column
            };
        case "22003":
            return {
                kind: "ValueOutOfRange",
                cause: error.message
            };
        case "22P02":
            return {
                kind: "InvalidInputValue",
                message: error.message
            };
        case "23505":
            {
                const fields = error.detail?.match(/Key \(([^)]+)\)/)?.at(1)?.split(", ");
                return {
                    kind: "UniqueConstraintViolation",
                    constraint: fields !== void 0 ? {
                        fields
                    } : void 0
                };
            }
        case "23502":
            {
                const fields = error.detail?.match(/Key \(([^)]+)\)/)?.at(1)?.split(", ");
                return {
                    kind: "NullConstraintViolation",
                    constraint: fields !== void 0 ? {
                        fields
                    } : void 0
                };
            }
        case "23503":
            {
                let constraint;
                if (error.column) {
                    constraint = {
                        fields: [
                            error.column
                        ]
                    };
                } else if (error.constraint) {
                    constraint = {
                        index: error.constraint
                    };
                }
                return {
                    kind: "ForeignKeyConstraintViolation",
                    constraint
                };
            }
        case "3D000":
            return {
                kind: "DatabaseDoesNotExist",
                db: error.message.split(" ").at(1)?.split('"').at(1)
            };
        case "28000":
            return {
                kind: "DatabaseAccessDenied",
                db: error.message.split(",").find((s)=>s.startsWith(" database"))?.split('"').at(1)
            };
        case "28P01":
            return {
                kind: "AuthenticationFailed",
                user: error.message.split(" ").pop()?.split('"').at(1)
            };
        case "40001":
            return {
                kind: "TransactionWriteConflict"
            };
        case "42P01":
            return {
                kind: "TableDoesNotExist",
                table: error.message.split(" ").at(1)?.split('"').at(1)
            };
        case "42703":
            {
                const rawColumn = error.message.match(/^column (.+) does not exist$/)?.at(1);
                return {
                    kind: "ColumnNotFound",
                    column: rawColumn?.replace(/"((?:""|[^"])*)"/g, (_, id)=>id.replaceAll('""', '"'))
                };
            }
        case "42P04":
            return {
                kind: "DatabaseAlreadyExists",
                db: error.message.split(" ").at(1)?.split('"').at(1)
            };
        case "53300":
            return {
                kind: "TooManyConnections",
                cause: error.message
            };
        default:
            return {
                kind: "postgres",
                code: error.code ?? "N/A",
                severity: error.severity ?? "N/A",
                message: error.message,
                detail: error.detail,
                column: error.column,
                hint: error.hint
            };
    }
}
function isDriverError(error) {
    return typeof error.code === "string" && typeof error.message === "string" && typeof error.severity === "string" && (typeof error.detail === "string" || error.detail === void 0) && (typeof error.column === "string" || error.column === void 0) && (typeof error.hint === "string" || error.hint === void 0);
}
function mapSocketError(error) {
    switch(error.code){
        case "ENOTFOUND":
        case "ECONNREFUSED":
            return {
                kind: "DatabaseNotReachable",
                host: error.address ?? error.hostname,
                port: error.port
            };
        case "ECONNRESET":
            return {
                kind: "ConnectionClosed"
            };
        case "ETIMEDOUT":
            return {
                kind: "SocketTimeout"
            };
    }
}
function isSocketError(error) {
    return typeof error.code === "string" && typeof error.syscall === "string" && typeof error.errno === "number" && SOCKET_ERRORS.has(error.code);
}
function isTlsError(error) {
    if (typeof error.code === "string") {
        return TLS_ERRORS.has(error.code);
    }
    switch(error.message){
        case "The server does not support SSL connections":
        case "There was an error establishing an SSL connection":
            return true;
    }
    return false;
}
// src/pg.ts
var types2 = __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["default"].types;
var debug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Debug"])("prisma:driver-adapter:pg");
var PgQueryable = class {
    constructor(client, pgOptions){
        this.client = client;
        this.pgOptions = pgOptions;
    }
    provider = "postgres";
    adapterName = name;
    /**
   * Execute a query given as SQL, interpolating the given parameters.
   */ async queryRaw(query) {
        const tag = "[js::query_raw]";
        debug(`${tag} %O`, query);
        const { fields, rows } = await this.performIO(query);
        const columnNames = fields.map((field)=>field.name);
        let columnTypes = [];
        try {
            columnTypes = fields.map((field)=>fieldToColumnType(field.dataTypeID));
        } catch (e) {
            if (e instanceof UnsupportedNativeDataType) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DriverAdapterError"]({
                    kind: "UnsupportedNativeDataType",
                    type: e.type
                });
            }
            throw e;
        }
        const udtParser = this.pgOptions?.userDefinedTypeParser;
        if (udtParser) {
            for(let i = 0; i < fields.length; i++){
                const field = fields[i];
                if (field.dataTypeID >= FIRST_NORMAL_OBJECT_ID && !Object.hasOwn(customParsers, field.dataTypeID)) {
                    for(let j = 0; j < rows.length; j++){
                        rows[j][i] = await udtParser(field.dataTypeID, rows[j][i], this);
                    }
                }
            }
        }
        return {
            columnNames,
            columnTypes,
            rows
        };
    }
    /**
   * Execute a query given as SQL, interpolating the given parameters and
   * returning the number of affected rows.
   * Note: Queryable expects a u64, but napi.rs only supports u32.
   */ async executeRaw(query) {
        const tag = "[js::execute_raw]";
        debug(`${tag} %O`, query);
        return (await this.performIO(query)).rowCount ?? 0;
    }
    /**
   * Run a query against the database, returning the result set.
   * Should the query fail due to a connection error, the connection is
   * marked as unhealthy.
   */ async performIO(query) {
        const { sql, args } = query;
        const values = args.map((arg, i)=>mapArg(arg, query.argTypes[i]));
        try {
            const result = await this.client.query({
                name: this.pgOptions?.statementNameGenerator?.(query),
                text: sql,
                values,
                rowMode: "array",
                types: {
                    getTypeParser: (oid, format)=>{
                        if (format === "text" && customParsers[oid]) {
                            return customParsers[oid];
                        }
                        return types2.getTypeParser(oid, format);
                    }
                }
            }, values);
            return result;
        } catch (e) {
            this.onError(e);
        }
    }
    onError(error) {
        debug("Error in performIO: %O", error);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DriverAdapterError"](convertDriverError(error));
    }
};
var PgTransaction = class extends PgQueryable {
    constructor(client, options, pgOptions, cleanup){
        super(client, pgOptions);
        this.options = options;
        this.pgOptions = pgOptions;
        this.cleanup = cleanup;
    }
    async commit() {
        debug(`[js::commit]`);
        this.cleanup?.();
        this.client.release();
    }
    async rollback() {
        debug(`[js::rollback]`);
        this.cleanup?.();
        this.client.release();
    }
    async createSavepoint(name2) {
        await this.executeRaw({
            sql: `SAVEPOINT ${name2}`,
            args: [],
            argTypes: []
        });
    }
    async rollbackToSavepoint(name2) {
        await this.executeRaw({
            sql: `ROLLBACK TO SAVEPOINT ${name2}`,
            args: [],
            argTypes: []
        });
    }
    async releaseSavepoint(name2) {
        await this.executeRaw({
            sql: `RELEASE SAVEPOINT ${name2}`,
            args: [],
            argTypes: []
        });
    }
};
var PrismaPgAdapter = class extends PgQueryable {
    constructor(client, pgOptions, release){
        super(client);
        this.pgOptions = pgOptions;
        this.release = release;
    }
    async startTransaction(isolationLevel) {
        const options = {
            usePhantomQuery: false
        };
        const tag = "[js::startTransaction]";
        debug("%s options: %O", tag, options);
        const conn = await this.client.connect().catch((error)=>this.onError(error));
        const onError = (err)=>{
            debug(`Error from pool connection: ${err.message} %O`, err);
            this.pgOptions?.onConnectionError?.(err);
        };
        conn.on("error", onError);
        const cleanup = ()=>{
            conn.removeListener("error", onError);
        };
        try {
            const tx = new PgTransaction(conn, options, this.pgOptions, cleanup);
            await tx.executeRaw({
                sql: "BEGIN",
                args: [],
                argTypes: []
            });
            if (isolationLevel) {
                await tx.executeRaw({
                    sql: `SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`,
                    args: [],
                    argTypes: []
                });
            }
            return tx;
        } catch (error) {
            cleanup();
            conn.release(error);
            this.onError(error);
        }
    }
    async executeScript(script) {
        const statements = script.split(";").map((stmt)=>stmt.trim()).filter((stmt)=>stmt.length > 0);
        for (const stmt of statements){
            try {
                await this.client.query(stmt);
            } catch (error) {
                this.onError(error);
            }
        }
    }
    getConnectionInfo() {
        return {
            schemaName: this.pgOptions?.schema,
            supportsRelationJoins: true
        };
    }
    async dispose() {
        return this.release?.();
    }
    underlyingDriver() {
        return this.client;
    }
};
var PrismaPgAdapterFactory = class {
    constructor(poolOrConfig, options){
        this.options = options;
        if (poolOrConfig instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["default"].Pool) {
            this.externalPool = poolOrConfig;
            this.config = poolOrConfig.options;
        } else if (typeof poolOrConfig === "string") {
            this.externalPool = null;
            this.config = {
                connectionString: poolOrConfig
            };
        } else {
            this.externalPool = null;
            this.config = poolOrConfig;
        }
    }
    provider = "postgres";
    adapterName = name;
    config;
    externalPool;
    async connect() {
        const client = this.externalPool ?? new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["default"].Pool(this.config);
        const onIdleClientError = (err)=>{
            debug(`Error from idle pool client: ${err.message} %O`, err);
            this.options?.onPoolError?.(err);
        };
        client.on("error", onIdleClientError);
        return new PrismaPgAdapter(client, this.options, async ()=>{
            if (this.externalPool) {
                if (this.options?.disposeExternalPool) {
                    await this.externalPool.end();
                    this.externalPool = null;
                } else {
                    this.externalPool.removeListener("error", onIdleClientError);
                }
            } else {
                await client.end();
            }
        });
    }
    async connectToShadowDb() {
        const conn = await this.connect();
        const database = `prisma_migrate_shadow_db_${globalThis.crypto.randomUUID()}`;
        await conn.executeScript(`CREATE DATABASE "${database}"`);
        const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["default"].Pool({
            ...this.config,
            database
        });
        return new PrismaPgAdapter(client, void 0, async ()=>{
            await conn.executeScript(`DROP DATABASE "${database}"`);
            await client.end();
        });
    }
};
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/@prisma/client/runtime/client [external] (@prisma/client/runtime/client, cjs, [project]/node_modules/@prisma/client)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client-2c3a283f134fdcb6/runtime/client", () => require("@prisma/client-2c3a283f134fdcb6/runtime/client"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0.6xl58._.js.map