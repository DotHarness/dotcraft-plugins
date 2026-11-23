#!/usr/bin/env node
import{createRequire as __dotcraftCreateRequire}from'node:module';import{fileURLToPath as __dotcraftFileURLToPath}from'node:url';import{dirname as __dotcraftPathDirname}from'node:path';const require=__dotcraftCreateRequire(import.meta.url);const __filename=__dotcraftFileURLToPath(import.meta.url);const __dirname=__dotcraftPathDirname(__filename);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "../../node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// ../../node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "../../node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = __require("bufferutil");
        module.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// ../../node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "../../node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// ../../node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "../../node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    var zlib = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [options.isServer=false] Create the instance in either
       *     server or client mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// ../../node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "../../node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    var { isUtf8 } = __require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = __require("utf-8-validate");
        module.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// ../../node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "../../node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    var { Writable } = __require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxBufferedChunks = options.maxBufferedChunks | 0;
        this._maxFragments = options.maxFragments | 0;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          cb(
            this.createError(
              RangeError,
              "Too many buffered chunks",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            )
          );
          return;
        }
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          if (this._maxFragments > 0 && this._fragments.length >= this._maxFragments) {
            const error = this.createError(
              RangeError,
              "Too many message fragments",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            );
            cb(error);
            return;
          }
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            if (this._maxFragments > 0 && this._fragments.length >= this._maxFragments) {
              const error = this.createError(
                RangeError,
                "Too many message fragments",
                false,
                1008,
                "WS_ERR_TOO_MANY_BUFFERED_PARTS"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module.exports = Receiver2;
  }
});

// ../../node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "../../node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    var { Duplex } = __require("stream");
    var { randomFillSync } = __require("crypto");
    var {
      types: { isUint8Array }
    } = __require("util");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else if (isUint8Array(data)) {
            buf.set(data, 2);
          } else {
            throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength2;
        let readOnly;
        if (typeof data === "string") {
          byteLength2 = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength2 = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength2 = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength2 > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength2,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength2;
        let readOnly;
        if (typeof data === "string") {
          byteLength2 = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength2 = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength2 = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength2 > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength2,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength2;
        let readOnly;
        if (typeof data === "string") {
          byteLength2 = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength2 = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength2 = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength2 >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength2,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// ../../node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "../../node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// ../../node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "../../node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension2].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module.exports = { format, parse };
  }
});

// ../../node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "../../node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var https = __require("https");
    var http = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes: randomBytes2, createHash: createHash4 } = __require("crypto");
    var { Duplex, Readable } = __require("stream");
    var { URL: URL3 } = __require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxBufferedChunks: options.maxBufferedChunks,
          maxFragments: options.maxFragments,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxBufferedChunks: 1024 * 1024,
        maxFragments: 128 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL3) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL3(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes2(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL3(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash4("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxBufferedChunks: opts.maxBufferedChunks,
          maxFragments: opts.maxFragments,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED) return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// ../../node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "../../node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    var WebSocket2 = require_websocket();
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module.exports = createWebSocketStream2;
  }
});

// ../../node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "../../node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module.exports = { parse };
  }
});

// ../../node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "../../node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http = __require("http");
    var { Duplex } = __require("stream");
    var { createHash: createHash4 } = __require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxBufferedChunks=1048576] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=131072] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxBufferedChunks: 1024 * 1024,
          maxFragments: 128 * 1024,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash4("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxBufferedChunks: this.options.maxBufferedChunks,
          maxFragments: this.options.maxFragments,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// dist/cli.js
import { resolve as resolve4 } from "node:path";

// ../channel/node_modules/@dotcraft/sdk/dist/models.js
var JsonRpcMessage = class _JsonRpcMessage {
  method;
  id;
  params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result;
  error;
  constructor(init) {
    if (init)
      Object.assign(this, init);
  }
  get isRequest() {
    return this.id != null && this.method != null;
  }
  get isNotification() {
    return this.id == null && this.method != null;
  }
  get isResponse() {
    return this.id != null && this.method == null;
  }
  static fromDict(data) {
    return new _JsonRpcMessage({
      method: data.method,
      id: data.id,
      params: data.params ?? null,
      result: data.result,
      error: data.error
    });
  }
  toDict() {
    const out = { jsonrpc: "2.0" };
    if (this.id != null)
      out.id = this.id;
    if (this.method != null && this.method !== void 0)
      out.method = this.method;
    if (this.params != null)
      out.params = this.params;
    if (this.result !== void 0)
      out.result = this.result;
    if (this.error != null)
      out.error = this.error;
    return out;
  }
};
function textPart(text2) {
  return { type: "text", text: text2 };
}
function localImagePart(path) {
  return { type: "localImage", path };
}
var DECISION_ACCEPT = "accept";
var DECISION_ACCEPT_FOR_SESSION = "acceptForSession";
var DECISION_DECLINE = "decline";
var DECISION_CANCEL = "cancel";
var ERR_THREAD_NOT_FOUND = -32010;
var ERR_THREAD_NOT_ACTIVE = -32011;
var ERR_TURN_IN_PROGRESS = -32012;

// ../channel/node_modules/@dotcraft/sdk/dist/errors.js
var DotCraftError = class extends Error {
  code;
  cause;
  constructor(code, message, options) {
    super(message);
    this.name = "DotCraftError";
    this.code = code;
    this.cause = options?.cause;
  }
};
function jsonRpcDetail(data) {
  if (!data || typeof data !== "object" || !("detail" in data))
    return null;
  const detail = data.detail;
  return typeof detail === "string" && detail.trim() ? detail : null;
}
var JsonRpcError = class extends DotCraftError {
  rpcCode;
  rpcMessage;
  data;
  constructor(rpcCode, rpcMessage, data, code = "jsonRpcError") {
    const detail = jsonRpcDetail(data);
    super(code, detail ? `${rpcMessage}: ${detail}` : rpcMessage, { cause: data });
    this.name = "JsonRpcError";
    this.rpcCode = rpcCode;
    this.rpcMessage = rpcMessage;
    this.data = data;
  }
};
var TurnInProgressError = class extends JsonRpcError {
  constructor(rpcCode, rpcMessage, data) {
    super(rpcCode, rpcMessage, data, "turnInProgress");
    this.name = "TurnInProgressError";
  }
};
var ThreadNotFoundError = class extends JsonRpcError {
  constructor(rpcCode, rpcMessage, data) {
    super(rpcCode, rpcMessage, data, "threadNotFound");
    this.name = "ThreadNotFoundError";
  }
};
var ThreadNotActiveError = class extends JsonRpcError {
  constructor(rpcCode, rpcMessage, data) {
    super(rpcCode, rpcMessage, data, "threadNotActive");
    this.name = "ThreadNotActiveError";
  }
};
var RequestTimeoutError = class extends DotCraftError {
  constructor(method, timeoutMs) {
    super("requestTimeout", `Request '${method}' timed out after ${timeoutMs}ms.`);
    this.name = "RequestTimeoutError";
  }
};
var ReconnectQueueFullError = class extends DotCraftError {
  constructor(limit) {
    super("reconnectQueueFull", `Reconnect queue reached its ${limit} message limit.`);
    this.name = "ReconnectQueueFullError";
  }
};
function toJsonRpcError(rpcCode, rpcMessage, data) {
  if (rpcCode === ERR_TURN_IN_PROGRESS)
    return new TurnInProgressError(rpcCode, rpcMessage, data);
  if (rpcCode === ERR_THREAD_NOT_FOUND)
    return new ThreadNotFoundError(rpcCode, rpcMessage, data);
  if (rpcCode === ERR_THREAD_NOT_ACTIVE)
    return new ThreadNotActiveError(rpcCode, rpcMessage, data);
  return new JsonRpcError(rpcCode, rpcMessage, data);
}

// ../channel/node_modules/@dotcraft/sdk/dist/transportCore.js
var TransportError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TransportError";
  }
};
var TransportClosed = class extends TransportError {
  constructor(message = "Transport closed") {
    super(message);
    this.name = "TransportClosed";
  }
};

// ../channel/node_modules/@dotcraft/sdk/dist/client.js
var DotCraftWireClient = class {
  transport;
  options;
  nextId = 1;
  pending = /* @__PURE__ */ new Map();
  handlers = /* @__PURE__ */ new Map();
  rawNotificationHandlers = /* @__PURE__ */ new Set();
  requestHandlers = /* @__PURE__ */ new Map();
  serverRequests = /* @__PURE__ */ new Map();
  rawServerRequestFallback = null;
  readerPromise = null;
  initializeResultValue = null;
  initializeOptions = null;
  reconnecting = false;
  explicitlyClosed = false;
  reconnectAttempt = 0;
  queuedWrites = [];
  stateValue = "disconnected";
  stateHandlers = /* @__PURE__ */ new Set();
  constructor(transport, options = {}) {
    this.transport = transport;
    this.options = {
      autoReconnect: options.autoReconnect ?? false,
      defaultTimeoutMs: options.defaultTimeoutMs ?? 3e4,
      initializeTimeoutMs: options.initializeTimeoutMs ?? null,
      maxReconnectQueueSize: options.maxReconnectQueueSize ?? 1024,
      reconnectBaseDelayMs: options.reconnectBaseDelayMs ?? 1e3,
      reconnectMaxDelayMs: options.reconnectMaxDelayMs ?? 3e4,
      random: options.random ?? Math.random
    };
  }
  get state() {
    return this.stateValue;
  }
  get initializeResult() {
    return this.initializeResultValue;
  }
  onStateChanged(handler) {
    this.stateHandlers.add(handler);
    return () => this.stateHandlers.delete(handler);
  }
  setState(state, error) {
    this.stateValue = state;
    for (const handler of this.stateHandlers)
      handler(state, error);
  }
  async connect() {
    this.setState("connecting");
    await this.transport.connect?.();
    this.setState("ready");
  }
  async start() {
    if (this.readerPromise)
      return;
    if (this.stateValue === "disconnected")
      this.setState("ready");
    this.readerPromise = this.readerLoop();
  }
  async stop() {
    this.explicitlyClosed = true;
    this.reconnecting = false;
    this.endServerRequests();
    await this.transport.close();
    this.rejectAllPending(new TransportClosed("Wire client closed"));
    this.rejectQueuedWrites(new TransportClosed("Wire client closed"));
    this.readerPromise = null;
    this.setState("closed");
  }
  async initialize(opts) {
    this.initializeOptions = { ...opts };
    this.setState("initializing");
    if (!this.readerPromise)
      await this.start();
    const capabilities = {
      approvalSupport: opts.approvalSupport ?? false,
      requestUserInputSupport: opts.requestUserInputSupport ?? false,
      streamingSupport: opts.streamingSupport ?? true,
      configChange: opts.configChange ?? false,
      appBindingVersion: 1
    };
    if (opts.extraCapabilities) {
      Object.assign(capabilities, opts.extraCapabilities);
    }
    if (opts.optOutNotifications?.length)
      capabilities.optOutNotificationMethods = opts.optOutNotifications;
    if (opts.channelAdapter) {
      const { channelTools, ...channelAdapter } = opts.channelAdapter;
      capabilities.channelAdapter = channelTools?.length ? { ...channelAdapter, channelTools } : channelAdapter;
    }
    const clientInfo = {
      name: opts.clientName,
      version: opts.clientVersion
    };
    if (opts.clientTitle)
      clientInfo.title = opts.clientTitle;
    const result = await this.requestRawInternal("initialize", {
      clientInfo,
      capabilities
    }, this.options.initializeTimeoutMs, true);
    await this.notifyRaw("initialized", {}, true);
    this.setState("ready");
    this.initializeResultValue = result;
    return this.initializeResultValue;
  }
  on(method, fn) {
    return this.addNotificationHandler(method, fn);
  }
  onRaw(method, fn) {
    return this.addNotificationHandler(method, fn);
  }
  onAnyNotificationRaw(fn) {
    this.rawNotificationHandlers.add(fn);
    return () => this.rawNotificationHandlers.delete(fn);
  }
  addNotificationHandler(method, fn) {
    const list = this.handlers.get(method) ?? [];
    list.push(fn);
    this.handlers.set(method, list);
    return () => this.unregisterHandler(method, fn);
  }
  unregisterHandler(method, fn) {
    const list = this.handlers.get(method);
    if (!list)
      return;
    const i = list.indexOf(fn);
    if (i >= 0)
      list.splice(i, 1);
  }
  registerServerRequestHandler(method, fn) {
    this.requestHandlers.set(method, fn);
  }
  registerServerRequestHandlerRaw(method, fn) {
    this.requestHandlers.set(method, fn);
  }
  hasServerRequestHandler(method) {
    return this.requestHandlers.has(method);
  }
  registerServerRequestFallbackRaw(fn) {
    this.rawServerRequestFallback = fn;
    return () => {
      if (this.rawServerRequestFallback === fn)
        this.rawServerRequestFallback = null;
    };
  }
  nextRequestId() {
    return this.nextId++;
  }
  async request(method, params, timeoutMs, responseHandlers) {
    return await this.requestRaw(method, params, timeoutMs, responseHandlers);
  }
  async requestRaw(method, params, timeoutMs, responseHandlers) {
    return await this.requestRawInternal(method, params, timeoutMs, false, responseHandlers);
  }
  async requestRawInternal(method, params, timeoutMs, bypassReconnectQueue, responseHandlers) {
    const id = this.nextRequestId();
    return new Promise((resolve5, reject) => {
      const effectiveTimeout = timeoutMs === void 0 ? this.options.defaultTimeoutMs : timeoutMs;
      const timer = effectiveTimeout == null ? null : setTimeout(() => {
        this.pending.delete(id);
        reject(new RequestTimeoutError(method, effectiveTimeout));
      }, effectiveTimeout);
      this.pending.set(id, { resolve: resolve5, reject, timer, written: false, responseHandlers });
      const msg = new JsonRpcMessage({
        method,
        id,
        params
      });
      void this.writeMessage(msg.toDict(), id, bypassReconnectQueue).catch((error) => this.rejectPending(id, error));
    });
  }
  async notify(method, params) {
    await this.notifyRaw(method, params);
  }
  async notifyRaw(method, params = {}, bypassReconnectQueue = false) {
    const msg = new JsonRpcMessage({ method, params });
    await this.writeMessage(msg.toDict(), void 0, bypassReconnectQueue);
  }
  async writeMessage(message, requestId, bypassReconnectQueue = false) {
    if (this.explicitlyClosed)
      throw new TransportClosed("Wire client closed");
    if (this.reconnecting && !bypassReconnectQueue) {
      if (this.queuedWrites.length >= this.options.maxReconnectQueueSize) {
        throw new ReconnectQueueFullError(this.options.maxReconnectQueueSize);
      }
      await new Promise((resolve5, reject) => {
        this.queuedWrites.push({ message, requestId, resolve: resolve5, reject });
      });
      return;
    }
    await this.transport.writeMessage(message);
    if (requestId !== void 0) {
      const pending = this.pending.get(requestId);
      if (pending)
        pending.written = true;
    }
  }
  rejectPending(requestId, error) {
    const pending = this.pending.get(requestId);
    if (!pending)
      return;
    this.pending.delete(requestId);
    if (pending.timer)
      clearTimeout(pending.timer);
    pending.reject(error);
  }
  rejectAllPending(error, writtenOnly = false) {
    for (const [id, pending] of this.pending) {
      if (writtenOnly && !pending.written)
        continue;
      this.pending.delete(id);
      if (pending.timer)
        clearTimeout(pending.timer);
      pending.reject(error);
    }
  }
  rejectQueuedWrites(error) {
    for (const queued of this.queuedWrites.splice(0))
      queued.reject(error);
  }
  async flushQueuedWrites() {
    const queued = this.queuedWrites.splice(0);
    for (const item of queued) {
      if (item.requestId !== void 0 && !this.pending.has(item.requestId)) {
        item.resolve();
        continue;
      }
      try {
        await this.transport.writeMessage(item.message);
        if (item.requestId !== void 0) {
          const pending = this.pending.get(item.requestId);
          if (pending)
            pending.written = true;
        }
        item.resolve();
      } catch (error) {
        item.reject(error);
        if (item.requestId !== void 0)
          this.rejectPending(item.requestId, error);
      }
    }
  }
  async sendResponse(requestId, result) {
    const msg = new JsonRpcMessage({ id: requestId, result });
    await this.transport.writeMessage(msg.toDict());
  }
  async sendErrorResponse(requestId, code, message) {
    const msg = new JsonRpcMessage({
      id: requestId,
      error: { code, message }
    });
    await this.transport.writeMessage(msg.toDict());
  }
  async readerLoop() {
    try {
      while (true) {
        let raw;
        try {
          raw = await this.transport.readMessage();
        } catch (e) {
          const closed = e instanceof TransportClosed ? e : new TransportClosed(`Transport read failed: ${e instanceof Error ? e.message : String(e)}`);
          this.endServerRequests();
          this.setState("disconnected", closed);
          this.rejectAllPending(closed, this.options.autoReconnect);
          if (await this.tryReconnect())
            continue;
          this.rejectAllPending(closed);
          this.rejectQueuedWrites(closed);
          break;
        }
        const msg = JsonRpcMessage.fromDict(raw);
        await this.dispatch(msg);
      }
    } catch {
    } finally {
      this.endServerRequests();
    }
  }
  async tryReconnect() {
    if (this.explicitlyClosed || !this.options.autoReconnect || !this.transport.connect || !this.initializeOptions) {
      return false;
    }
    this.reconnecting = true;
    while (!this.explicitlyClosed) {
      this.setState("reconnecting");
      const delay2 = Math.min(this.options.reconnectBaseDelayMs * 2 ** this.reconnectAttempt, this.options.reconnectMaxDelayMs);
      const jittered = Math.round(delay2 * (0.8 + this.options.random() * 0.4));
      await new Promise((resolve5) => setTimeout(resolve5, jittered));
      try {
        await this.transport.connect();
        await this.performReconnectHandshake(this.initializeOptions);
        this.reconnectAttempt = 0;
        this.reconnecting = false;
        await this.flushQueuedWrites();
        this.setState("ready");
        return true;
      } catch (error) {
        this.endServerRequests();
        this.reconnectAttempt += 1;
        this.setState("reconnectError", error);
      }
    }
    return false;
  }
  async performReconnectHandshake(options) {
    let settled = false;
    let failure;
    const handshake = this.initialize(options).then(() => {
      settled = true;
    }, (error) => {
      failure = error;
      settled = true;
    });
    while (!settled) {
      const raw = await this.transport.readMessage();
      await this.dispatch(JsonRpcMessage.fromDict(raw));
      await Promise.race([
        handshake,
        new Promise((resolve5) => setTimeout(resolve5, 1))
      ]);
    }
    await handshake;
    if (failure !== void 0)
      throw failure;
  }
  async dispatch(msg) {
    if (msg.isResponse) {
      const fut = this.pending.get(msg.id);
      if (!fut)
        return;
      this.pending.delete(msg.id);
      if (fut.timer)
        clearTimeout(fut.timer);
      if (msg.error) {
        const code = msg.error.code ?? -1;
        const m = String(msg.error.message ?? "Unknown error");
        const error = toJsonRpcError(code, m, msg.error.data);
        try {
          fut.responseHandlers?.onError?.(error);
          fut.reject(error);
        } catch (hookError) {
          fut.reject(hookError);
        }
      } else {
        try {
          fut.responseHandlers?.onResponse?.(msg.result);
          fut.resolve(msg.result);
        } catch (error) {
          fut.reject(error);
        }
      }
      return;
    }
    if (msg.isNotification) {
      await this.dispatchNotification(msg);
      return;
    }
    if (msg.isRequest) {
      void this.dispatchServerRequest(msg).catch((e) => console.error("Error in server request handler:", e));
    }
  }
  async dispatchNotification(msg) {
    const method = msg.method ?? "";
    const params = msg.params ?? {};
    if (method === "serverRequest/resolved" && typeof params.requestId === "number") {
      const pending = this.serverRequests.get(params.requestId);
      this.serverRequests.delete(params.requestId);
      pending?.abort();
    }
    const list = this.handlers.get(method) ?? [];
    for (const h of [...list]) {
      void Promise.resolve(h(params)).catch(() => {
      });
    }
    for (const handler of [...this.rawNotificationHandlers]) {
      void Promise.resolve(handler(method, params)).catch(() => {
      });
    }
  }
  async dispatchServerRequest(msg) {
    const method = msg.method ?? "";
    const params = msg.params ?? {};
    const requestId = msg.id;
    const controller = new AbortController();
    this.serverRequests.set(requestId, controller);
    const active = () => !controller.signal.aborted && !this.explicitlyClosed;
    try {
      const handler = this.requestHandlers.get(method);
      if (!handler && !this.rawServerRequestFallback) {
        if (active())
          await this.sendErrorResponse(requestId, -32601, `Method not handled: ${method}`);
        return;
      }
      const result = handler ? await handler(requestId, params, controller.signal) : await this.rawServerRequestFallback(method, requestId, params, controller.signal);
      if (active())
        await this.sendResponse(requestId, result ?? {});
    } catch (error) {
      if (active())
        await this.sendErrorResponse(requestId, -32603, String(error));
    } finally {
      if (this.serverRequests.get(requestId) === controller)
        this.serverRequests.delete(requestId);
    }
  }
  endServerRequests() {
    const pending = [...this.serverRequests.values()];
    this.serverRequests.clear();
    for (const controller of pending)
      controller.abort();
  }
};

// ../channel/node_modules/@dotcraft/sdk/dist/threadEvents.js
var methods = [
  "thread/started",
  "thread/renamed",
  "thread/resumed",
  "thread/archived",
  "thread/unarchived",
  "thread/status/changed",
  "thread/queue/updated",
  "turn/started",
  "turn/completed",
  "turn/failed",
  "turn/cancelled",
  "item/started",
  "item/completed",
  "item/agentMessage/delta",
  "item/reasoning/delta",
  "item/toolCall/argumentsDelta",
  "item/approval/resolved",
  "item/tool/requestUserInput/resolved",
  "item/toolExecution/progress",
  "subagent/progress",
  "item/usage/delta",
  "system/event",
  "plan/updated"
];
function threadEventIdentity(method, params) {
  switch (method) {
    case "thread/started":
    case "thread/resumed":
      return { threadId: params.thread?.id };
    case "turn/started":
    case "turn/completed":
    case "turn/failed":
    case "turn/cancelled": {
      const turn = params.turn;
      return { threadId: turn?.threadId, turnId: turn?.id };
    }
    default: {
      const event = params;
      return { threadId: event.threadId, turnId: event.turnId };
    }
  }
}
function captureThreadEvents(client, threadId) {
  const queue = [];
  let wake;
  let finished = false;
  const unsubscribe = methods.map((method) => client.on(method, (params) => {
    if (finished || threadEventIdentity(method, params).threadId !== threadId)
      return;
    queue.push(JsonRpcMessage.fromDict({ method, params }));
    wake?.();
    wake = void 0;
  }));
  const cleanup = () => {
    if (finished)
      return;
    finished = true;
    unsubscribe.forEach((remove) => remove());
    wake?.();
    wake = void 0;
  };
  unsubscribe.push(client.onStateChanged((state) => {
    if (state === "disconnected" || state === "closed")
      cleanup();
  }));
  return {
    next: async () => {
      while (!finished && queue.length === 0)
        await new Promise((resolve5) => {
          wake = resolve5;
        });
      const value = queue.shift();
      return value ? { value, done: false } : { value: void 0, done: true };
    },
    return: async () => {
      queue.length = 0;
      cleanup();
      return { value: void 0, done: true };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}

// ../channel/node_modules/@dotcraft/sdk/dist/transport.js
import { createInterface } from "node:readline";

// ../../node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_extension = __toESM(require_extension(), 1);
var import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_subprotocol = __toESM(require_subprotocol(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);
var wrapper_default = import_websocket.default;

// ../channel/node_modules/@dotcraft/sdk/dist/transport.js
var StdioTransport = class {
  closed = false;
  rl;
  lineIter = null;
  constructor() {
    this.rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
  }
  async readMessage() {
    if (this.closed)
      throw new TransportClosed();
    if (!this.lineIter) {
      this.lineIter = this.rl[Symbol.asyncIterator]();
    }
    while (true) {
      const { value, done } = await this.lineIter.next();
      if (done)
        throw new TransportClosed("stdin closed");
      const text2 = String(value).trim();
      if (!text2)
        continue;
      return JSON.parse(text2);
    }
  }
  async writeMessage(msg) {
    if (this.closed)
      throw new TransportClosed();
    const line = `${JSON.stringify(msg)}
`;
    await new Promise((resolve5, reject) => {
      process.stdout.write(line, (err) => err ? reject(err) : resolve5());
    });
  }
  async close() {
    this.closed = true;
    this.rl.close();
  }
};
var DEFAULT_MAX_PAYLOAD_BYTES = 128 * 1024 * 1024;
var WebSocketTransport = class {
  baseUrl;
  token;
  maxPayload;
  ws = null;
  closed = false;
  receivedFrames = [];
  waitingReaders = [];
  terminalError = null;
  constructor(opts) {
    this.baseUrl = opts.url;
    this.token = opts.token;
    this.maxPayload = opts.maxPayload ?? DEFAULT_MAX_PAYLOAD_BYTES;
  }
  get urlWithToken() {
    if (!this.token?.trim())
      return this.baseUrl;
    try {
      const parsed = new URL(this.baseUrl);
      if (!parsed.searchParams.has("token")) {
        parsed.searchParams.set("token", this.token.trim());
      }
      return parsed.toString();
    } catch {
      const sep = this.baseUrl.includes("?") ? "&" : "?";
      return `${this.baseUrl}${sep}token=${encodeURIComponent(this.token.trim())}`;
    }
  }
  async connect() {
    if (this.closed)
      throw new TransportClosed();
    if (this.ws !== null)
      return;
    this.terminalError = null;
    this.receivedFrames = [];
    this.ws = new wrapper_default(this.urlWithToken, { maxPayload: this.maxPayload });
    await new Promise((resolve5, reject) => {
      const w = this.ws;
      const onOpen = () => {
        cleanup();
        this.attachSocketHandlers(w);
        resolve5();
      };
      const onError = (e) => {
        cleanup();
        if (this.ws === w)
          this.ws = null;
        this.terminalError = e;
        reject(e);
      };
      const onClose = () => {
        cleanup();
        if (this.ws === w)
          this.ws = null;
        const err = new TransportClosed("WebSocket closed");
        this.terminalError = err;
        reject(err);
      };
      const cleanup = () => {
        w.off("open", onOpen);
        w.off("error", onError);
        w.off("close", onClose);
      };
      w.once("open", onOpen);
      w.once("error", onError);
      w.once("close", onClose);
    });
  }
  async readMessage() {
    if (this.closed)
      throw new TransportClosed();
    if (this.receivedFrames.length > 0) {
      const frame = this.receivedFrames.shift();
      return JSON.parse(frame);
    }
    if (this.terminalError) {
      throw this.terminalError;
    }
    if (this.ws === null) {
      await this.connect();
      return await this.readMessage();
    }
    return await new Promise((resolve5, reject) => {
      this.waitingReaders.push({ resolve: resolve5, reject });
    });
  }
  async writeMessage(msg) {
    if (this.closed)
      throw new TransportClosed();
    if (this.ws === null)
      throw new TransportError("WebSocket not connected; call connect() first");
    const text2 = JSON.stringify(msg);
    await new Promise((resolve5, reject) => {
      this.ws.send(text2, (err) => err ? reject(err) : resolve5());
    });
  }
  async close() {
    this.closed = true;
    const closeError = new TransportClosed("Transport closed");
    this.terminalError = closeError;
    this.receivedFrames = [];
    this.rejectWaitingReaders(closeError);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  attachSocketHandlers(ws) {
    ws.on("message", (data) => {
      const text2 = this.rawDataToUtf8(data);
      if (this.waitingReaders.length > 0) {
        const waiter = this.waitingReaders.shift();
        try {
          waiter.resolve(JSON.parse(text2));
        } catch (error) {
          waiter.reject(error);
        }
        return;
      }
      this.receivedFrames.push(text2);
    });
    ws.on("close", () => this.dropSocket(ws, new TransportClosed("WebSocket closed")));
    ws.on("error", (error) => this.dropSocket(ws, new TransportClosed(`WebSocket closed: ${error.message}`)));
  }
  dropSocket(ws, error) {
    if (this.closed || this.ws !== ws)
      return;
    this.ws = null;
    this.terminalError = error;
    this.receivedFrames = [];
    this.rejectWaitingReaders(error);
  }
  rejectWaitingReaders(error) {
    if (this.waitingReaders.length === 0)
      return;
    const readers = this.waitingReaders;
    this.waitingReaders = [];
    for (const reader of readers) {
      reader.reject(error);
    }
  }
  rawDataToUtf8(data) {
    if (typeof data === "string")
      return data;
    if (data instanceof Buffer)
      return data.toString("utf-8");
    if (Array.isArray(data))
      return Buffer.concat(data).toString("utf-8");
    if (data instanceof ArrayBuffer)
      return Buffer.from(new Uint8Array(data)).toString("utf-8");
    if (ArrayBuffer.isView(data))
      return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString("utf-8");
    throw new TransportError("Unsupported WebSocket raw data format");
  }
};

// ../channel/dist/channelAppServerClient.js
var ChannelAppServerClient = class extends DotCraftWireClient {
  async initialize(opts) {
    if (opts.approvalSupport && !this.hasServerRequestHandler("item/approval/request")) {
      throw new Error("approvalSupport requires an approval request handler");
    }
    if (opts.requestUserInputSupport && !this.hasServerRequestHandler("item/tool/requestUserInput")) {
      throw new Error("requestUserInputSupport requires a user-input request handler");
    }
    return await super.initialize(opts);
  }
  async threadStart(params) {
    const identity = { channelName: params.channelName, userId: params.userId };
    if (params.workspacePath)
      identity.workspacePath = params.workspacePath;
    if (params.channelContext)
      identity.channelContext = params.channelContext;
    const payload = { identity, historyMode: params.historyMode ?? "server" };
    if (params.displayName != null)
      payload.displayName = params.displayName;
    if (params.config)
      payload.config = params.config;
    if (params.dynamicTools != null)
      payload.dynamicTools = params.dynamicTools;
    if (params.additionalContext)
      payload.additionalContext = params.additionalContext;
    if (params.chat)
      payload.chat = params.chat;
    const result = await this.request("thread/start", payload);
    return result.thread;
  }
  async threadResume(threadId, params) {
    const payload = { threadId };
    if (params?.dynamicTools != null)
      payload.dynamicTools = params.dynamicTools;
    if (params?.additionalContext != null)
      payload.additionalContext = params.additionalContext;
    if (params?.chat != null)
      payload.chat = params.chat;
    const result = await this.request("thread/resume", payload);
    return result.thread;
  }
  async threadList(params) {
    return (await this.threadListPage(params)).data;
  }
  async threadListPage(params) {
    const identity = { channelName: params.channelName, userId: params.userId };
    if (params.workspacePath)
      identity.workspacePath = params.workspacePath;
    if (params.channelContext)
      identity.channelContext = params.channelContext;
    const payload = { identity, includeArchived: params.includeArchived ?? false };
    if (params.scope)
      payload.scope = params.scope;
    if (params.query)
      payload.query = params.query;
    if (params.limit != null)
      payload.limit = params.limit;
    if (params.cursor)
      payload.cursor = params.cursor;
    return await this.request("thread/list", payload);
  }
  async threadRead(threadId) {
    const result = await this.request("thread/read", { threadId });
    return result.thread;
  }
  async threadTurnsList(params) {
    return await this.request("thread/turns/list", params);
  }
  async threadItemsList(params) {
    return await this.request("thread/items/list", params);
  }
  async threadUnsubscribe(threadId) {
    await this.request("thread/unsubscribe", { threadId });
  }
  async threadArchive(threadId) {
    await this.request("thread/archive", { threadId });
  }
  async threadDelete(threadId) {
    await this.request("thread/delete", { threadId });
  }
  async threadSetMode(threadId, mode) {
    await this.request("thread/mode/set", { threadId, mode });
  }
  async turnStart(threadId, input, sender, settings = {}) {
    const payload = { ...settings, threadId, input };
    if (sender)
      payload.sender = sender;
    const result = await this.request("turn/start", payload);
    return result.turn;
  }
  async turnInterrupt(threadId, turnId) {
    await this.request("turn/interrupt", { threadId, turnId });
  }
  async turnEnqueue(threadId, input, sender) {
    const payload = { threadId, input };
    if (sender)
      payload.sender = sender;
    return await this.request("turn/enqueue", payload);
  }
  async turnSteer(threadId, expectedTurnId, input, sender) {
    const payload = { threadId, expectedTurnId, input };
    if (sender)
      payload.sender = sender;
    const result = await this.request("turn/steer", payload);
    return result.turnId;
  }
  async commandList() {
    const result = await this.request("command/list", {});
    return result.commands ?? [];
  }
  async commandExecute(params) {
    const payload = { threadId: params.threadId, command: params.command };
    if (params.arguments)
      payload.arguments = params.arguments;
    if (params.sender)
      payload.sender = params.sender;
    return await this.request("command/execute", payload);
  }
  streamEvents(threadId) {
    return captureThreadEvents(this, threadId);
  }
};

// ../channel/node_modules/@dotcraft/sdk/dist/threadManager.js
import { userInfo } from "node:os";

// ../channel/node_modules/@dotcraft/sdk/dist/hubClient.js
import { existsSync, mkdirSync as mkdirSync2, readFileSync, writeFileSync } from "node:fs";
import { join as join2 } from "node:path";
import { homedir } from "node:os";
import { isIP } from "node:net";

// ../channel/node_modules/@dotcraft/sdk/dist/hubBootstrap.js
import { resolve } from "node:path";

// ../channel/node_modules/@dotcraft/sdk/dist/hubStartupProcess.js
import { spawn } from "node:child_process";
import { closeSync, fstatSync, mkdirSync, openSync, readSync } from "node:fs";
import { dirname, join } from "node:path";

// ../channel/node_modules/@dotcraft/sdk/dist/hubBootstrapFlight.js
import { resolve as resolve2 } from "node:path";

// ../channel/dist/channelRuntime.js
import { readFile } from "node:fs/promises";
import { isAbsolute, join as join3 } from "node:path";

// ../channel/dist/userInput.js
function emptyUserInputResponse() {
  return { answers: {} };
}
function normalizeUserInputQuestions(request) {
  const rawQuestions = Array.isArray(request.questions) ? request.questions : [];
  return rawQuestions.filter((item) => item != null && typeof item === "object" && !Array.isArray(item)).map((item, index) => {
    const id = String(item.id ?? `question_${index + 1}`).trim() || `question_${index + 1}`;
    const rawOptions = Array.isArray(item.options) ? item.options : [];
    const options = rawOptions.filter((option) => option != null && typeof option === "object" && !Array.isArray(option)).map((option) => ({
      label: String(option.label ?? "").trim(),
      description: String(option.description ?? "").trim()
    })).filter((option) => option.label.length > 0);
    return {
      id,
      header: String(item.header ?? "").trim(),
      question: String(item.question ?? "").trim(),
      isOther: item.isOther !== false,
      isSecret: Boolean(item.isSecret),
      options
    };
  });
}
function splitUserInputRequestByQuestion(request) {
  const questions = normalizeUserInputQuestions(request);
  const requestId = String(request.requestId ?? "").trim();
  return questions.map((question, questionIndex) => {
    const stepRequestId = questions.length > 1 && requestId ? `${requestId}:${questionIndex + 1}` : requestId;
    return {
      request: {
        ...request,
        requestId: stepRequestId,
        questions: [question]
      },
      question,
      questionIndex,
      questionCount: questions.length
    };
  });
}
function mergeUserInputResponses(responses) {
  const answers = {};
  for (const response of responses) {
    const responseAnswers = asRecord(response.answers);
    for (const [questionId, answer] of Object.entries(responseAnswers)) {
      if (!answer || typeof answer !== "object" || Array.isArray(answer))
        continue;
      const values = answer.answers;
      if (Array.isArray(values)) {
        answers[questionId] = { answers: values.map((value) => String(value)) };
      }
    }
  }
  return { answers };
}
function hasUserInputAnswer(response, questionId) {
  const answer = response.answers[questionId];
  return Array.isArray(answer?.answers) && answer.answers.length > 0;
}
function userInputResponseFromText(request, replyText) {
  const questions = normalizeUserInputQuestions(request);
  if (questions.length === 0)
    return emptyUserInputResponse();
  const text2 = replyText.trim();
  if (!text2)
    return null;
  if (questions.length === 1) {
    const answer = parseAnswerForQuestion(questions[0], text2);
    if (!answer)
      return null;
    return { answers: { [questions[0].id]: { answers: [answer] } } };
  }
  const answers = {};
  for (const segment of splitMultiQuestionSegments(text2)) {
    const parsed = segment.match(/^\s*(?:q)?(\d+)\s*[:：=.)、-]\s*(.+?)\s*$/i);
    if (!parsed)
      continue;
    const questionIndex = Number(parsed[1]) - 1;
    const question = questions[questionIndex];
    if (!question)
      continue;
    const answer = parseAnswerForQuestion(question, parsed[2] ?? "");
    if (answer)
      answers[question.id] = { answers: [answer] };
  }
  return Object.keys(answers).length > 0 ? { answers } : null;
}
function buildUserInputPrompt(request, options = {}) {
  const questions = normalizeUserInputQuestions(request);
  const title = options.title ?? "DotCraft needs your input";
  const lines = [title];
  const requestId = String(request.requestId ?? "").trim();
  if (options.requestId !== false && requestId)
    lines.push(`Request: ${requestId}`);
  lines.push("");
  if (questions.length === 0) {
    lines.push("No questions were provided.");
    return lines.join("\n").trim();
  }
  questions.forEach((question, questionIndex) => {
    const prefix = questions.length > 1 ? `${questionIndex + 1}. ` : "";
    const heading = question.header || `Question ${questionIndex + 1}`;
    lines.push(`${prefix}${heading}`);
    if (question.question)
      lines.push(question.question);
    if (question.isSecret) {
      lines.push("This chat cannot hide secret answers; reply only if it is safe to share here.");
    }
    question.options.forEach((option, optionIndex) => {
      const detail = option.description ? ` - ${option.description}` : "";
      lines.push(`${optionIndex + 1}) ${option.label}${detail}`);
    });
    if (question.isOther) {
      lines.push("0) Other / free text");
    }
    lines.push("");
  });
  if (questions.length === 1) {
    const question = questions[0];
    if (question.options.length > 0 && question.isOther) {
      lines.push("Reply with an option number, or reply `0 your answer` for other.");
    } else if (question.options.length > 0) {
      lines.push("Reply with an option number.");
    } else {
      lines.push("Reply with your answer.");
    }
  } else {
    lines.push("Reply one answer per line, for example:");
    lines.push("1: 2");
    lines.push("2: 0 custom answer");
  }
  return lines.join("\n").trim();
}
function splitMultiQuestionSegments(text2) {
  const lineSegments = text2.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lineSegments.length > 1)
    return lineSegments;
  return text2.split(/[;；]/).map((segment) => segment.trim()).filter(Boolean);
}
function parseAnswerForQuestion(question, rawAnswer) {
  const trimmed = rawAnswer.trim();
  if (!trimmed)
    return null;
  const numberMatch = trimmed.match(/^(?:选|option\s*)?(\d+)(?:[.)、\s:-]+(.*))?$/i);
  if (numberMatch) {
    const optionNumber = Number(numberMatch[1]);
    const remainder = String(numberMatch[2] ?? "").trim();
    if (optionNumber === 0) {
      return question.isOther && remainder ? remainder : null;
    }
    const option = question.options[optionNumber - 1];
    if (option)
      return option.label;
  }
  const exactOption = question.options.find((option) => option.label.toLowerCase() === trimmed.toLowerCase());
  if (exactOption)
    return exactOption.label;
  if (question.isOther || question.options.length === 0)
    return trimmed;
  return null;
}
function asRecord(value) {
  return value != null && typeof value === "object" && !Array.isArray(value) ? value : {};
}

// ../channel/dist/channelRuntime.js
function resolveHostedCraftPath(workspaceRoot) {
  const path = process.env.DOTCRAFT_CHANNEL_CRAFT_PATH;
  if (!path)
    return join3(workspaceRoot, ".craft");
  if (!isAbsolute(path))
    throw new Error("DOTCRAFT_CHANNEL_CRAFT_PATH must be absolute.");
  return path;
}
function resolveClient(provider) {
  return typeof provider === "function" ? provider() : provider;
}
function isNodeErrno(error, code) {
  return typeof error === "object" && error !== null && "code" in error && String(error.code) === code;
}
function buildChannelSender(opts, channelContext) {
  const sender = { ...opts.sender ?? {} };
  if (sender.senderId === void 0)
    sender.senderId = opts.userId;
  if (sender.senderName === void 0)
    sender.senderName = opts.userName;
  if (sender.senderRole === void 0)
    sender.senderRole = "user";
  Object.assign(sender, opts.senderExtra ?? {});
  if (opts.directTarget && sender.directTarget === void 0)
    sender.directTarget = opts.directTarget;
  if (channelContext && !opts.omitSenderGroupId && sender.groupId === void 0) {
    sender.groupId = channelContext;
  }
  return sender;
}
var ChannelMessageQueue = class {
  queues = /* @__PURE__ */ new Map();
  runningWorkers = /* @__PURE__ */ new Map();
  isRunning;
  onError;
  constructor(options = {}) {
    this.isRunning = options.isRunning ?? (() => true);
    this.onError = options.onError ?? ((identityKey, error) => {
      console.error(`Error processing message for ${identityKey}:`, error);
    });
  }
  enqueue(identityKey, job) {
    let q = this.queues.get(identityKey);
    if (!q) {
      q = [];
      this.queues.set(identityKey, q);
    }
    q.push(job);
    void this.runWorker(identityKey, q);
  }
  clear(identityKey) {
    if (identityKey === void 0) {
      this.queues.clear();
      return;
    }
    this.queues.delete(identityKey);
  }
  activeKeys() {
    const keys = /* @__PURE__ */ new Set();
    for (const [key, q] of this.queues) {
      if (q.length > 0)
        keys.add(key);
    }
    for (const [key, running] of this.runningWorkers) {
      if (running)
        keys.add(key);
    }
    return [...keys];
  }
  async runWorker(identityKey, q) {
    if (this.runningWorkers.get(identityKey))
      return;
    this.runningWorkers.set(identityKey, true);
    try {
      while (this.isRunning() && q.length > 0) {
        const job = q.shift();
        if (!job)
          continue;
        try {
          await job();
        } catch (error) {
          this.onError(identityKey, error);
        }
      }
    } finally {
      this.runningWorkers.set(identityKey, false);
      if (q.length > 0 && this.isRunning())
        void this.runWorker(identityKey, q);
    }
  }
};
var ThreadResolver = class {
  threadMap;
  client;
  channelName;
  resolving = /* @__PURE__ */ new Map();
  getRuntimeAdditionalContext;
  onEvent;
  constructor(options) {
    this.client = options.client;
    this.channelName = options.channelName;
    this.threadMap = options.threadMap ?? /* @__PURE__ */ new Map();
    this.getRuntimeAdditionalContext = options.getRuntimeAdditionalContext;
    this.onEvent = options.onEvent;
  }
  invalidateConnectionBoundRuntime() {
    this.threadMap.clear();
  }
  getCachedThreadId(identityKey) {
    return this.threadMap.get(identityKey);
  }
  setCachedThread(identityKey, threadId) {
    this.threadMap.set(identityKey, threadId);
  }
  deleteCachedThread(identityKey) {
    this.threadMap.delete(identityKey);
  }
  async getOrCreateThread(lookup) {
    const pending = this.resolving.get(lookup.identityKey);
    if (pending)
      return await pending;
    const resolving = this.resolveThread(lookup);
    this.resolving.set(lookup.identityKey, resolving);
    try {
      return await resolving;
    } finally {
      if (this.resolving.get(lookup.identityKey) === resolving)
        this.resolving.delete(lookup.identityKey);
    }
  }
  async resolveThread(lookup) {
    const client = resolveClient(this.client);
    const additionalContext = this.getRuntimeAdditionalContext?.();
    const threadId = this.threadMap.get(lookup.identityKey);
    if (threadId) {
      try {
        const thread2 = await client.threadResume(threadId, { additionalContext, chat: lookup.chat });
        if (thread2.status === "active") {
          this.emit({ action: "cache_hit", ...lookup, threadId: thread2.id });
          return thread2;
        }
      } catch (error) {
        this.threadMap.delete(lookup.identityKey);
        this.emit({ action: "cache_invalidated", ...lookup, threadId, error });
      }
      this.threadMap.delete(lookup.identityKey);
    }
    const threads = await client.threadList({
      channelName: this.channelName,
      userId: lookup.userId,
      channelContext: lookup.channelContext,
      workspacePath: lookup.workspacePath
    });
    const reusable = threads.find((t) => t.status === "active");
    if (reusable) {
      const thread2 = await client.threadResume(reusable.id, { additionalContext, chat: lookup.chat });
      this.threadMap.set(lookup.identityKey, thread2.id);
      this.emit({ action: "listed_active", ...lookup, threadId: thread2.id });
      return thread2;
    }
    const thread = await client.threadStart({
      channelName: this.channelName,
      userId: lookup.userId,
      channelContext: lookup.channelContext,
      workspacePath: lookup.workspacePath,
      additionalContext,
      chat: lookup.chat
    });
    this.threadMap.set(lookup.identityKey, thread.id);
    this.emit({ action: "created", ...lookup, threadId: thread.id });
    return thread;
  }
  async recoverThreadAfterNotActive(lookup, staleThreadId) {
    const client = resolveClient(this.client);
    const additionalContext = this.getRuntimeAdditionalContext?.();
    try {
      const latest = await client.threadResume(staleThreadId, { additionalContext, chat: lookup.chat });
      if (latest.status === "active") {
        this.threadMap.set(lookup.identityKey, latest.id);
        this.emit({ action: "recovered_stale_active", ...lookup, staleThreadId, threadId: latest.id });
        return latest;
      }
    } catch {
    }
    this.threadMap.delete(lookup.identityKey);
    const threads = await client.threadList({
      channelName: this.channelName,
      userId: lookup.userId,
      channelContext: lookup.channelContext,
      workspacePath: lookup.workspacePath
    });
    const reusable = threads.find((t) => t.status === "active");
    if (reusable) {
      const thread = await client.threadResume(reusable.id, { additionalContext, chat: lookup.chat });
      this.threadMap.set(lookup.identityKey, thread.id);
      this.emit({ action: "recovered_listed_active", ...lookup, staleThreadId, threadId: thread.id });
      return thread;
    }
    const fresh = await client.threadStart({
      channelName: this.channelName,
      userId: lookup.userId,
      channelContext: lookup.channelContext,
      workspacePath: lookup.workspacePath,
      additionalContext,
      chat: lookup.chat
    });
    this.threadMap.set(lookup.identityKey, fresh.id);
    this.emit({ action: "recovered_created", ...lookup, staleThreadId, threadId: fresh.id });
    return fresh;
  }
  emit(event) {
    this.onEvent?.(event);
  }
};
var ApprovalDispatcher = class {
  client;
  onApprovalRequest;
  onError;
  constructor(options) {
    this.client = options.client;
    this.onApprovalRequest = options.onApprovalRequest;
    this.onError = options.onError ?? ((message, error) => console.error(message, error));
  }
  register() {
    resolveClient(this.client).registerServerRequestHandler("item/approval/request", async (_id, params) => {
      try {
        return { decision: await this.onApprovalRequest(params) };
      } catch (error) {
        this.onError("onApprovalRequest raised:", error);
        return { decision: "cancel" };
      }
    });
  }
};
var UserInputDispatcher = class {
  client;
  onUserInputRequest;
  onError;
  constructor(options) {
    this.client = options.client;
    this.onUserInputRequest = options.onUserInputRequest;
    this.onError = options.onError ?? ((message, error) => console.error(message, error));
  }
  register() {
    resolveClient(this.client).registerServerRequestHandler("item/tool/requestUserInput", async (_id, params) => {
      try {
        return await this.onUserInputRequest(params);
      } catch (error) {
        this.onError("onUserInputRequest raised:", error);
        return emptyUserInputResponse();
      }
    });
  }
};
var ChannelToolDispatcher = class {
  client;
  onToolCall;
  onConfigOptionAvailability;
  onError;
  constructor(options) {
    this.client = options.client;
    this.onToolCall = options.onToolCall;
    this.onConfigOptionAvailability = options.onConfigOptionAvailability;
    this.onError = options.onError ?? ((message, error) => console.error(message, error));
  }
  register() {
    const client = resolveClient(this.client);
    client.registerServerRequestHandler("ext/channel/toolCall", async (_id, params) => {
      try {
        return await this.onToolCall(params ?? {});
      } catch (error) {
        this.onError("onToolCall raised:", error);
        return {
          success: false,
          errorCode: "AdapterToolCallFailed",
          errorMessage: String(error)
        };
      }
    });
    client.registerServerRequestHandler("ext/channel/heartbeat", async () => ({}));
    client.registerServerRequestHandler("ext/channel/configOptionAvailability", async (_id, params) => {
      const key = String(params?.key ?? "");
      try {
        return { available: await this.onConfigOptionAvailability(key) };
      } catch (error) {
        this.onError("onConfigOptionAvailability raised:", error);
        return { available: null };
      }
    });
  }
};
var ModuleLifecycleState = class {
  lifecycleStatus;
  lifecycleError;
  statusHandlers = [];
  constructor(initialStatus = "stopped") {
    this.lifecycleStatus = initialStatus;
  }
  getStatus() {
    return this.lifecycleStatus;
  }
  getError() {
    return this.lifecycleError;
  }
  onStatusChange(handler) {
    this.statusHandlers.push(handler);
  }
  setStatus(status, error) {
    const nextError = status === "starting" || status === "ready" ? void 0 : error;
    if (this.lifecycleStatus === status && this.lifecycleError === nextError) {
      return;
    }
    this.lifecycleStatus = status;
    this.lifecycleError = nextError;
    for (const handler of this.statusHandlers) {
      handler(status, this.lifecycleError);
    }
  }
  buildStatusError(code, error) {
    return {
      code,
      message: error?.message ?? (code === "authRequired" ? "Interactive authentication is required." : "Authentication has expired."),
      detail: error?.detail,
      timestamp: error?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  buildModuleError(code, message) {
    return {
      code,
      message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};
function resolveConfigPath(context, configFileName) {
  if (context.configOverridePath)
    return context.configOverridePath;
  return join3(context.craftPath, configFileName);
}
async function loadJsonConfig(configPath) {
  try {
    const raw = await readFile(configPath, "utf-8");
    return { found: true, data: JSON.parse(raw) };
  } catch (error) {
    if (isNodeErrno(error, "ENOENT")) {
      return { found: false };
    }
    throw error;
  }
}
var ConfigValidationError = class extends Error {
  fields;
  constructor(message, fields) {
    super(message);
    this.name = "ConfigValidationError";
    this.fields = fields;
  }
};
var ModuleConfigLoader = class {
  getConfigFileName;
  validateConfig;
  lifecycle;
  isStdioRuntime;
  constructor(options) {
    this.getConfigFileName = options.getConfigFileName;
    this.validateConfig = options.validateConfig;
    this.lifecycle = options.lifecycle ?? new ModuleLifecycleState();
    this.isStdioRuntime = options.isStdioRuntime ?? isStdioChannelRuntime;
  }
  async load(context) {
    const configPath = resolveConfigPath(context, this.getConfigFileName(context));
    const loaded = await loadJsonConfig(configPath);
    if (!loaded.found) {
      return {
        status: "configMissing",
        configPath,
        error: this.lifecycle.buildModuleError("configMissing", `Config file not found: ${configPath}`)
      };
    }
    try {
      const stdioRuntime = this.isStdioRuntime();
      const rawConfig = applyChannelRuntimeDefaults(loaded.data, stdioRuntime);
      this.validateConfig(rawConfig);
      return { status: "loaded", config: rawConfig, configPath, stdioRuntime };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: "configInvalid",
        configPath,
        error: this.lifecycle.buildModuleError("configInvalid", message)
      };
    }
  }
};
function isStdioChannelRuntime() {
  return process.env.DOTCRAFT_CHANNEL_TRANSPORT === "stdio";
}
function isWebSocketChannelRuntime() {
  return process.env.DOTCRAFT_CHANNEL_TRANSPORT === "websocket";
}
function applyChannelRuntimeDefaults(rawConfig, stdioRuntime = isStdioChannelRuntime()) {
  if (stdioRuntime)
    return withStdioRuntimeDefaults(rawConfig);
  if (isWebSocketChannelRuntime())
    return withWebSocketRuntimeDefaults(rawConfig);
  return rawConfig;
}
function withStdioRuntimeDefaults(rawConfig) {
  if (!rawConfig || typeof rawConfig !== "object" || Array.isArray(rawConfig)) {
    return rawConfig;
  }
  const config = { ...rawConfig };
  const dotcraftRaw = config.dotcraft;
  const dotcraft = dotcraftRaw && typeof dotcraftRaw === "object" && !Array.isArray(dotcraftRaw) ? { ...dotcraftRaw } : {};
  if (typeof dotcraft.wsUrl !== "string" || dotcraft.wsUrl.trim() === "") {
    dotcraft.wsUrl = "ws://127.0.0.1/stdio-placeholder";
  }
  config.dotcraft = dotcraft;
  return config;
}
function withWebSocketRuntimeDefaults(rawConfig) {
  if (!rawConfig || typeof rawConfig !== "object" || Array.isArray(rawConfig)) {
    return rawConfig;
  }
  const wsUrl = process.env.DOTCRAFT_CHANNEL_WS_URL?.trim();
  if (!wsUrl)
    return rawConfig;
  const config = { ...rawConfig };
  const dotcraftRaw = config.dotcraft;
  const dotcraft = dotcraftRaw && typeof dotcraftRaw === "object" && !Array.isArray(dotcraftRaw) ? { ...dotcraftRaw } : {};
  dotcraft.wsUrl = wsUrl;
  if (process.env.DOTCRAFT_CHANNEL_WS_TOKEN !== void 0) {
    dotcraft.token = process.env.DOTCRAFT_CHANNEL_WS_TOKEN.trim();
  }
  config.dotcraft = dotcraft;
  return config;
}

// ../channel/dist/commandRouter.js
var DEFAULT_CATALOG_TTL_MS = 6e4;
function commandWord(text2) {
  const first = text2.trim().split(/\s+/, 1)[0] ?? "";
  return first.length > 1 && first.startsWith("/") ? first.slice(1).toLowerCase() : "";
}
function normalizeCommandName(name) {
  return String(name ?? "").trim().replace(/^\//, "").toLowerCase();
}
var CommandRouter = class {
  options;
  catalogTtlMs;
  now;
  commands = [];
  names = /* @__PURE__ */ new Set();
  loadedAt;
  loading;
  constructor(options) {
    this.options = options;
    this.catalogTtlMs = options.catalogTtlMs ?? DEFAULT_CATALOG_TTL_MS;
    this.now = options.now ?? Date.now;
  }
  invalidate() {
    this.loadedAt = void 0;
  }
  async refresh() {
    this.loading ??= this.load().finally(() => {
      this.loading = void 0;
    });
    await this.loading;
  }
  async listCommands() {
    await this.ensureFresh();
    return this.commands;
  }
  async isCommand(text2) {
    const name = commandWord(text2);
    if (!name)
      return false;
    await this.ensureFresh();
    return this.names.has(name);
  }
  async run(request) {
    const text2 = request.opts.text.trim();
    const [command = "", ...args] = text2.split(/\s+/);
    const target = request.opts.channelContext ?? "";
    let result;
    try {
      result = await resolveClient(this.options.client).commandExecute({
        threadId: request.threadId,
        command: command.toLowerCase(),
        arguments: args.length > 0 ? args : void 0,
        sender: request.sender
      });
    } catch (error) {
      if (!(error instanceof JsonRpcError))
        throw error;
      await this.options.deliver(target, error.message || String(error), {});
      return;
    }
    if (result.expandedPrompt) {
      const inputParts = [...request.opts.inputParts ?? []];
      const textIndex = inputParts.findIndex((part) => part.type === "text");
      const promptPart = { type: "text", text: result.expandedPrompt };
      if (textIndex >= 0)
        inputParts[textIndex] = promptPart;
      else
        inputParts.unshift(promptPart);
      this.options.enqueueMessage({
        ...request.opts,
        text: result.expandedPrompt,
        inputParts,
        skipCommand: true
      });
      return;
    }
    let threadId = request.threadId;
    if (result.thread?.id) {
      await this.options.switchThread(result.thread, request);
      threadId = result.thread.id;
    }
    if (result.message)
      await this.options.deliver(target, result.message, {});
    const choices = (result.choices ?? []).filter((choice) => Boolean(choice.command));
    if (choices.length > 0) {
      await this.options.renderChoices(target, choices, { opts: request.opts, sender: request.sender, threadId });
    }
  }
  async ensureFresh() {
    if (this.loadedAt !== void 0 && this.now() - this.loadedAt <= this.catalogTtlMs)
      return;
    await this.refresh();
  }
  async load() {
    try {
      const commands = await resolveClient(this.options.client).commandList();
      const names = /* @__PURE__ */ new Set();
      for (const command of commands) {
        for (const name of [command.name, ...command.aliases ?? []]) {
          const normalized = normalizeCommandName(name);
          if (normalized)
            names.add(normalized);
        }
      }
      this.commands = commands;
      this.names = names;
      this.loadedAt = this.now();
    } catch (error) {
      console.warn("[channel] command catalog refresh failed:", error instanceof Error ? error.message : String(error));
    }
  }
};

// ../channel/dist/deliveryDispatcher.js
var DeliveryDispatcher = class _DeliveryDispatcher {
  client;
  onSend;
  onError;
  deliveries = /* @__PURE__ */ new Map();
  static rememberedDeliveries = 1024;
  constructor(options) {
    this.client = options.client;
    this.onSend = options.onSend;
    this.onError = options.onError ?? ((message, error) => console.error(message, error));
  }
  register() {
    const client = resolveClient(this.client);
    client.registerServerRequestHandler("ext/channel/send", async (_id, params) => {
      const deliveryId = String(params.deliveryId);
      const remembered = this.deliveries.get(deliveryId);
      if (remembered)
        return await remembered;
      const delivery = this.send(params);
      this.remember(deliveryId, delivery);
      const result = await delivery;
      if (result.delivered !== true)
        this.deliveries.delete(deliveryId);
      return result;
    });
  }
  async send(params) {
    const target = String(params.target ?? "");
    const message = params.message ?? {};
    const metadata = params.metadata ?? {};
    try {
      return await this.onSend(target, message, metadata);
    } catch (error) {
      this.onError("onSend raised:", error);
      return {
        delivered: false,
        errorCode: "AdapterDeliveryFailed",
        errorMessage: String(error)
      };
    }
  }
  remember(deliveryId, delivery) {
    this.deliveries.set(deliveryId, delivery);
    while (this.deliveries.size > _DeliveryDispatcher.rememberedDeliveries) {
      const oldest = this.deliveries.keys().next().value;
      if (oldest === void 0)
        break;
      this.deliveries.delete(oldest);
    }
  }
};

// ../channel/dist/chatHistory.js
function historyFailure(errorCode, errorMessage) {
  return { messages: [], errorCode, errorMessage };
}
var HistoryDispatcher = class {
  client;
  onReadHistory;
  constructor(client, onReadHistory) {
    this.client = client;
    this.onReadHistory = onReadHistory;
  }
  register() {
    resolveClient(this.client).registerServerRequestHandler("ext/channel/history", async (_id, params) => {
      const before = typeof params.before === "string" && params.before ? params.before : void 0;
      const request = {
        target: String(params.target ?? ""),
        limit: Math.max(1, Number(params.limit) || 1),
        ...before ? { before } : {}
      };
      try {
        return await this.onReadHistory(request);
      } catch (error) {
        console.error("onReadHistory raised:", error);
        return historyFailure("HistoryUnavailable", error instanceof Error ? error.message : String(error));
      }
    });
  }
};

// ../channel/dist/turnStream.js
function activityKindForItemType(itemType) {
  switch (itemType) {
    case "agentMessage":
      return "text";
    case "reasoningContent":
      return "reasoning";
    case "toolCall":
    case "mcpToolCall":
    case "dynamicToolCall":
    case "toolResult":
    case "commandExecution":
      return "tool";
    default:
      return null;
  }
}
async function consumeTurnStream(eventStream, turn, handlers) {
  const observe = async (hook, run) => {
    try {
      await run();
    } catch (error) {
      handlers.onHandlerError?.(hook, error);
    }
  };
  for await (const event of eventStream) {
    const params = event.params ?? {};
    const identity = threadEventIdentity(event.method, params);
    if (identity.threadId !== turn.threadId || identity.turnId !== turn.turnId)
      continue;
    switch (event.method) {
      case "item/started":
      case "item/completed": {
        const item = params.item ?? {};
        const kind = activityKindForItemType(String(item.type ?? ""));
        const itemId = String(item.id ?? "");
        if (!kind || !itemId)
          break;
        const phase = event.method === "item/started" ? "started" : "completed";
        await observe("onActivity", () => handlers.onActivity(turn, { kind, phase, itemId }));
        break;
      }
      case "system/event":
        if (params.kind === "streamError") {
          await observe("onTurnRetrying", () => handlers.onTurnRetrying(turn));
        }
        break;
      case "turn/completed":
        return { status: "completed" };
      case "turn/failed": {
        const failed = params.turn ?? {};
        return { status: "failed", error: String(failed.error ?? params.error ?? "Unknown error") };
      }
      case "turn/cancelled":
        return { status: "cancelled" };
    }
  }
  return { status: "disconnected" };
}

// ../channel/dist/adapter.js
var CHANNEL_REQUEST_START_FAILED_CODE = "channelRequestStartFailed";
var CHANNEL_REQUEST_START_FAILED_MESSAGE = "DotCraft couldn't start this request. Please try again or check the channel logs.";
var CHANNEL_TURN_FAILED_CODE = "channelTurnFailed";
var CHANNEL_TURN_FAILED_MESSAGE = "DotCraft couldn't finish this request. Please try again.";
var ChannelAdapter = class {
  client;
  channelName;
  clientName;
  clientVersion;
  optOutNotifications;
  clientStateUnsubscribe;
  threadMap = /* @__PURE__ */ new Map();
  turnSenders = /* @__PURE__ */ new Map();
  threadSenders = /* @__PURE__ */ new Map();
  observationOwners = /* @__PURE__ */ new Map();
  threadResolver;
  messageQueue;
  commandRouter;
  approvalDispatcher;
  userInputDispatcher;
  deliveryDispatcher;
  channelToolDispatcher;
  historyDispatcher;
  lifecycle = new ModuleLifecycleState();
  running = false;
  defaultWorkspacePath = "";
  constructor(transport, channelName, clientName, clientVersion, optOutNotifications = []) {
    this.client = new ChannelAppServerClient(transport, { autoReconnect: true });
    this.channelName = channelName;
    this.clientName = clientName;
    this.clientVersion = clientVersion;
    this.optOutNotifications = optOutNotifications;
    this.threadResolver = new ThreadResolver({
      client: () => this.client,
      channelName: this.channelName,
      threadMap: this.threadMap,
      getRuntimeAdditionalContext: () => this.getRuntimeAdditionalContext(),
      onEvent: (event) => this.onThreadResolveEvent(event)
    });
    this.messageQueue = new ChannelMessageQueue({
      isRunning: () => this.running,
      onError: (identityKey, error) => {
        console.error(`Error processing message for ${identityKey}:`, error);
      }
    });
    this.commandRouter = new CommandRouter({
      client: () => this.client,
      deliver: (target, content, metadata) => this.onDeliver(target, content, metadata),
      enqueueMessage: (opts) => this.enqueueMessage(opts),
      switchThread: (thread, request) => this.switchCurrentThread(thread, request),
      renderChoices: (target, choices, context) => this.renderCommandChoices(target, choices, context)
    });
    this.approvalDispatcher = new ApprovalDispatcher({
      client: () => this.client,
      onApprovalRequest: (params) => this.onApprovalRequest(params)
    });
    this.userInputDispatcher = new UserInputDispatcher({
      client: () => this.client,
      onUserInputRequest: (params) => this.onUserInputRequest(params)
    });
    this.deliveryDispatcher = new DeliveryDispatcher({
      client: () => this.client,
      onSend: (target, message, metadata) => this.onSend(target, message, metadata)
    });
    this.channelToolDispatcher = new ChannelToolDispatcher({
      client: () => this.client,
      onToolCall: (params) => this.onToolCall(params),
      onConfigOptionAvailability: (key) => this.onConfigOptionAvailability(key)
    });
    this.historyDispatcher = new HistoryDispatcher(() => this.client, (request) => this.onReadHistory(request));
  }
  async onUserInputRequest(_request) {
    return { answers: {} };
  }
  async onSend(target, message, metadata) {
    const kind = String(message.kind ?? "");
    if (kind === "text") {
      const ok = await this.onDeliver(target, String(message.text ?? ""), metadata);
      return { delivered: ok };
    }
    return {
      delivered: false,
      errorCode: "UnsupportedDeliveryKind",
      errorMessage: `Adapter does not implement structured '${kind}' delivery.`
    };
  }
  getChannelTools() {
    return null;
  }
  async onToolCall(_request) {
    return {
      success: false,
      errorCode: "UnsupportedTool",
      errorMessage: "Adapter does not implement channel tool calls."
    };
  }
  /** Override when the delivery capabilities declare `history`. */
  async onReadHistory(_request) {
    return historyFailure("UnsupportedTarget", "This adapter cannot read chat history.");
  }
  async onConfigOptionAvailability(_key) {
    return null;
  }
  async onTurnStarted(_turn) {
  }
  async onActivity(_turn, _activity) {
  }
  async onTurnRetrying(_turn) {
  }
  async onTurnEnded(turn, outcome) {
    if (outcome.status !== "failed") {
      console.info(`Turn ${turn.turnId} ${outcome.status} on thread ${turn.threadId}`);
      return;
    }
    console.error(`Turn ${turn.turnId} failed on thread ${turn.threadId}: ${outcome.error}`);
    await this.sendGenericNotice(turn.channelContext, CHANNEL_TURN_FAILED_MESSAGE, CHANNEL_TURN_FAILED_CODE);
  }
  onThreadContextBound(_threadId, _channelContext) {
  }
  onCurrentThreadChanged(_previousThreadId, _threadId, _channelContext) {
  }
  async renderCommandChoices(target, choices, _context) {
    const lines = choices.map((choice, index) => `${index + 1}. ${choice.label || choice.command}: ${choice.command}`);
    await this.onDeliver(target, lines.join("\n"), {});
  }
  getRuntimeAdditionalContext() {
    return void 0;
  }
  onThreadResolveEvent(_event) {
  }
  getStatus() {
    return this.lifecycle.getStatus();
  }
  getError() {
    return this.lifecycle.getError();
  }
  onStatusChange(handler) {
    this.lifecycle.onStatusChange(handler);
  }
  setStatus(status, error) {
    this.lifecycle.setStatus(status, error);
  }
  async start() {
    this.setStatus("starting");
    this.threadResolver.invalidateConnectionBoundRuntime();
    this.clientStateUnsubscribe?.();
    this.clientStateUnsubscribe = this.client.onStateChanged((state) => {
      if (state !== "reconnecting")
        return;
      this.threadResolver.invalidateConnectionBoundRuntime();
      this.commandRouter.invalidate();
    });
    await this.client.connect();
    await this.client.start();
    this.approvalDispatcher.register();
    this.userInputDispatcher.register();
    this.deliveryDispatcher.register();
    this.channelToolDispatcher.register();
    this.historyDispatcher.register();
    await this.client.initialize({
      clientName: this.clientName,
      clientVersion: this.clientVersion,
      approvalSupport: true,
      requestUserInputSupport: true,
      streamingSupport: false,
      optOutNotifications: this.optOutNotifications,
      channelAdapter: {
        channelName: this.channelName,
        displayName: this.getDisplayName(),
        deliveryCapabilities: this.getDeliveryCapabilities(),
        channelTools: (this.getChannelTools() ?? []).map((tool) => ({
          ...tool,
          requiresChatContext: tool.requiresChatContext ?? false
        }))
      }
    });
    this.running = true;
    this.commandRouter.invalidate();
    void this.commandRouter.refresh();
    this.setStatus("ready");
    console.info(`ChannelAdapter '${this.channelName}' started (client: ${this.clientName} ${this.clientVersion})`);
  }
  async stop() {
    this.running = false;
    this.clientStateUnsubscribe?.();
    this.clientStateUnsubscribe = void 0;
    await this.client.stop();
    this.setStatus("stopped", this.lifecycle.getError());
    console.info(`ChannelAdapter '${this.channelName}' stopped`);
  }
  async handleMessage(opts) {
    const channelContext = opts.channelContext ?? "";
    const bindCode = this.parseChannelBindCode(opts.text);
    if (bindCode) {
      const sender = buildChannelSender(opts, channelContext);
      if (await this.tryAcceptChannelBinding(opts, sender, channelContext, bindCode))
        return;
    }
    if (!opts.skipCommand && await this.commandRouter.isCommand(opts.text)) {
      await this.runCommand(opts);
      return;
    }
    this.enqueueMessage(opts);
  }
  approvalSender(request) {
    return this.turnSenders.get(JSON.stringify([String(request.threadId ?? ""), String(request.turnId ?? "")])) ?? this.threadSenders.get(String(request.threadId ?? ""));
  }
  async isCommand(text2) {
    return await this.commandRouter.isCommand(text2);
  }
  async listCommands() {
    return await this.commandRouter.listCommands();
  }
  async executeCommandChoice(command, opts) {
    await this.runCommand({ ...opts, text: command });
  }
  async runCommand(opts) {
    const channelContext = opts.channelContext ?? "";
    const sender = buildChannelSender(opts, channelContext);
    const cachedThreadId = this.threadResolver.getCachedThreadId(this.identityKey(opts.userId, channelContext));
    let release = cachedThreadId ? this.retainObservation(cachedThreadId) : void 0;
    try {
      const { threadId, thread } = await this.resolveConversationThread(opts, sender);
      if (thread && threadId !== cachedThreadId) {
        const previousRelease = release;
        release = this.retainObservation(threadId);
        await previousRelease?.();
      }
      await this.commandRouter.run({ opts, threadId, sender });
    } catch (error) {
      console.error(`[${this.channelName}] command failed:`, error);
      await this.sendGenericNotice(channelContext, CHANNEL_REQUEST_START_FAILED_MESSAGE, CHANNEL_REQUEST_START_FAILED_CODE);
    } finally {
      await release?.();
    }
  }
  async switchCurrentThread(thread, request) {
    const channelContext = request.opts.channelContext ?? "";
    const identityKey = this.identityKey(request.opts.userId, channelContext);
    const previousThreadId = this.threadResolver.getCachedThreadId(identityKey);
    const release = this.retainObservation(thread.id);
    try {
      await this.client.threadResume(thread.id, {
        additionalContext: this.getRuntimeAdditionalContext(),
        chat: this.getChatDescriptor(request.opts, channelContext)
      });
      this.threadResolver.setCachedThread(identityKey, thread.id);
      this.onThreadContextBound(thread.id, channelContext);
      if (previousThreadId !== thread.id)
        this.onCurrentThreadChanged(previousThreadId, thread.id, channelContext);
    } finally {
      await release();
    }
  }
  getChannelBindingAppId() {
    return `com.dotharness.channel.${this.channelName}`;
  }
  parseChannelBindCode(text2) {
    const match = /^\/bind\s+([1-9][0-9]{5})\s*$/i.exec(text2.trim());
    return match?.[1] ?? null;
  }
  buildChannelTarget(_opts, _sender, _channelContext) {
    return null;
  }
  async onChannelBindingAccepted(binding, target, _opts) {
    if (!target.deliveryTarget || !binding.threadId) {
      throw new Error("Accepted channel binding omitted its delivery target or thread id.");
    }
    await this.onDeliver(target.deliveryTarget, `Bound this conversation to thread ${binding.threadId}.`, {
      appId: binding.appId,
      bindingId: binding.bindingId,
      authorityRevision: binding.authorityRevision
    });
  }
  async onChannelBindingFailed(error, target, _opts) {
    const message = error instanceof Error ? error.message : String(error);
    if (!target.deliveryTarget)
      throw new Error("Channel binding target omitted its delivery target.");
    await this.onDeliver(target.deliveryTarget, `Binding failed: ${message}`, {
      error: message
    });
  }
  async tryAcceptChannelBinding(opts, sender, channelContext, bindCode) {
    const target = this.buildChannelTarget(opts, sender, channelContext);
    if (!target)
      return false;
    try {
      await this.client.request("app/channelBinding/request/get", { code: bindCode });
      const binding = await this.client.request("app/channelBinding/accept", { code: bindCode, target });
      if (!binding.threadId)
        throw new Error("Accepted channel binding omitted its thread id.");
      const identityKey = this.identityKey(opts.userId, channelContext);
      this.threadResolver.setCachedThread(identityKey, binding.threadId);
      this.onThreadContextBound(binding.threadId, channelContext);
      await this.onChannelBindingAccepted(binding, target, opts);
    } catch (error) {
      await this.onChannelBindingFailed(error, target, opts);
    }
    return true;
  }
  enqueueMessage(opts) {
    const channelContext = opts.channelContext ?? "";
    const identityKey = this.identityKey(opts.userId, channelContext);
    this.messageQueue.enqueue(identityKey, async () => {
      await this.processMessage(identityKey, opts);
    });
  }
  identityKey(userId, channelContext) {
    return `${userId}:${channelContext}`;
  }
  async recoverThreadAfterNotActive(identityKey, userId, channelContext, workspacePath, staleThreadId, chat) {
    return await this.threadResolver.recoverThreadAfterNotActive({
      identityKey,
      userId,
      channelContext,
      workspacePath,
      chat
    }, staleThreadId);
  }
  async processMessage(identityKey, opts) {
    const channelContext = opts.channelContext ?? "";
    const workspacePath = opts.workspacePath ?? this.defaultWorkspacePath;
    const sender = buildChannelSender(opts, channelContext);
    let accepted = false;
    const cachedThreadId = this.threadResolver.getCachedThreadId(identityKey);
    let release = cachedThreadId ? this.retainObservation(cachedThreadId) : void 0;
    try {
      const { thread, threadId, binding, chat } = await this.resolveConversationThread(opts, sender);
      if (thread && threadId !== cachedThreadId) {
        const previousRelease = release;
        release = this.retainObservation(threadId);
        await previousRelease?.();
      }
      const input = opts.inputParts?.length ? opts.inputParts : [textPart(opts.text)];
      if (binding) {
        await this.enqueueChannelBoundInput(binding, input, opts, sender);
        opts.onAccepted?.();
        return;
      }
      await this.submitInput(thread, input, sender, channelContext, async () => {
        const recovered = await this.recoverThreadAfterNotActive(identityKey, opts.userId, channelContext, workspacePath, threadId, chat);
        this.onThreadContextBound(recovered.id, channelContext);
        return recovered;
      });
      accepted = true;
      opts.onAccepted?.();
    } catch (error) {
      if (!accepted)
        await this.sendGenericNotice(channelContext, CHANNEL_REQUEST_START_FAILED_MESSAGE, CHANNEL_REQUEST_START_FAILED_CODE);
      throw error;
    } finally {
      await release?.();
    }
  }
  retainObservation(threadId) {
    this.observationOwners.set(threadId, (this.observationOwners.get(threadId) ?? 0) + 1);
    return async () => {
      const remaining = (this.observationOwners.get(threadId) ?? 1) - 1;
      if (remaining > 0) {
        this.observationOwners.set(threadId, remaining);
      } else {
        this.observationOwners.delete(threadId);
        await this.client.threadUnsubscribe(threadId);
      }
    };
  }
  async resolveConversationThread(opts, sender) {
    const channelContext = opts.channelContext ?? "";
    const identityKey = this.identityKey(opts.userId, channelContext);
    const channelTarget = this.buildChannelTarget(opts, sender, channelContext);
    const binding = channelTarget ? await this.resolveChannelBindingForMessage(channelTarget) : null;
    const chat = this.getChatDescriptor(opts, channelContext);
    let thread = null;
    let threadId;
    if (binding) {
      if (!binding.threadId)
        throw new Error("Resolved channel binding omitted its thread id.");
      threadId = binding.threadId;
      this.threadMap.set(identityKey, threadId);
    } else {
      thread = await this.getOrCreateThread(identityKey, opts.userId, channelContext, opts.workspacePath ?? this.defaultWorkspacePath, chat);
      threadId = thread.id;
    }
    if (chat.kind === "direct" || chat.membership === "sender")
      this.threadSenders.set(threadId, String(sender.senderId));
    this.onThreadContextBound(threadId, channelContext);
    return { thread, threadId, binding, chat };
  }
  async submitInput(thread, input, sender, channelContext, recover) {
    if (thread.runtime?.activeTurnId || thread.runtime?.maintenanceKind) {
      if (await this.addToActiveTurn(thread.id, thread.runtime, input, sender))
        return;
      const latest = await this.client.threadRead(thread.id);
      if (latest.runtime?.activeTurnId || latest.runtime?.maintenanceKind) {
        await this.client.turnEnqueue(thread.id, input, sender);
        return;
      }
      thread = latest;
    }
    const eventStream = this.client.streamEvents(thread.id);
    const release = this.retainObservation(thread.id);
    let turn;
    try {
      turn = await this.client.turnStart(thread.id, input, sender);
    } catch (error) {
      await eventStream.return?.();
      await release();
      if (error instanceof JsonRpcError && error.rpcCode === ERR_TURN_IN_PROGRESS) {
        const latest = await this.client.threadRead(thread.id);
        if (!await this.addToActiveTurn(thread.id, latest.runtime, input, sender))
          await this.client.turnEnqueue(thread.id, input, sender);
        return;
      }
      if (recover && error instanceof JsonRpcError && error.rpcCode === ERR_THREAD_NOT_ACTIVE) {
        await this.submitInput(await recover(), input, sender, channelContext);
        return;
      }
      throw error;
    }
    const consumerKey = JSON.stringify([thread.id, turn.id]);
    if (this.turnSenders.has(consumerKey)) {
      await eventStream.return?.();
      await release();
      return;
    }
    this.turnSenders.set(consumerKey, String(sender.senderId));
    void this.runTurn(eventStream, { threadId: thread.id, turnId: turn.id, channelContext }, release);
  }
  async addToActiveTurn(threadId, runtime, input, sender) {
    if (runtime?.maintenanceKind) {
      await this.client.turnEnqueue(threadId, input, sender);
      return true;
    }
    const activeTurnId = runtime?.activeTurnId;
    if (!activeTurnId)
      return false;
    try {
      await this.client.turnSteer(threadId, activeTurnId, input, sender);
      return true;
    } catch (error) {
      if (!(error instanceof JsonRpcError))
        throw error;
      return false;
    }
  }
  async runTurn(eventStream, turn, release) {
    const reportHookError = (hook, error) => {
      console.error(`[${this.channelName}] ${hook} failed for turn ${turn.turnId}:`, error);
    };
    let outcome = { status: "disconnected" };
    try {
      await this.onTurnStarted(turn).catch((error) => reportHookError("onTurnStarted", error));
      outcome = await consumeTurnStream(eventStream, turn, {
        onActivity: (current, activity) => this.onActivity(current, activity),
        onTurnRetrying: (current) => this.onTurnRetrying(current),
        onHandlerError: reportHookError
      });
    } catch (error) {
      console.error(`[${this.channelName}] event stream for turn ${turn.turnId} failed:`, error);
    } finally {
      await eventStream.return?.();
    }
    await this.onTurnEnded(turn, outcome).catch((error) => reportHookError("onTurnEnded", error));
    this.turnSenders.delete(JSON.stringify([turn.threadId, turn.turnId]));
    await release().catch((error) => reportHookError("unsubscribe", error));
  }
  async sendGenericNotice(channelContext, message, failureCode) {
    if (!channelContext) {
      console.error(`[${this.channelName}] cannot deliver ${failureCode}: channel context is empty`);
      return;
    }
    try {
      const delivered = await this.onDeliver(channelContext, message, { failureCode });
      if (!delivered) {
        console.error(`[${this.channelName}] ${failureCode} notice was not delivered`);
      }
    } catch (deliveryError) {
      console.error(`[${this.channelName}] failed to deliver ${failureCode} notice:`, deliveryError);
    }
  }
  async enqueueChannelBoundInput(binding, input, opts, sender) {
    await this.client.request("app/threadInput/enqueue", {
      bindingId: binding.bindingId,
      input,
      displayText: opts.text,
      triggerLabel: `${this.channelName} message`,
      triggerRefId: this.channelBindingTriggerRef(binding),
      startPolicy: "runWhenIdle",
      sender
    });
  }
  async resolveChannelBindingForMessage(target) {
    try {
      const result = await this.client.request("app/channelBinding/resolve", {
        channelName: target.channelName,
        accountId: target.accountId,
        conversationKind: target.conversationKind,
        conversationId: target.conversationId
      });
      const binding = result.binding ?? null;
      return binding?.state === "active" ? binding : null;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[${this.channelName}] channel binding resolve failed; falling back to normal channel routing: ${message}`);
      return null;
    }
  }
  channelBindingTriggerRef(binding) {
    const target = binding.channelTarget;
    if (!target)
      return void 0;
    return [
      target.channelName,
      target.accountId ?? "",
      target.conversationKind,
      target.conversationId
    ].join(":");
  }
  async getOrCreateThread(identityKey, userId, channelContext, workspacePath, chat) {
    return await this.threadResolver.getOrCreateThread({
      identityKey,
      userId,
      channelContext,
      workspacePath,
      chat
    });
  }
};

// ../channel/dist/moduleAdapter.js
var ModuleChannelAdapter = class extends ChannelAdapter {
  context;
  loadedConfig;
  moduleLifecycle = new ModuleLifecycleState();
  constructor(channelName, clientName, clientVersion, optOutNotifications = []) {
    super(new PlaceholderTransport(), channelName, clientName, clientVersion, optOutNotifications);
  }
  getConfigFileName(context) {
    return `${context.channelName}.json`;
  }
  async startWithContext(context) {
    this.context = context;
    this.setStatus("starting");
    const configLoader = new ModuleConfigLoader({
      getConfigFileName: (ctx) => this.getConfigFileName(ctx),
      validateConfig: (rawConfig) => this.validateConfig(rawConfig)
    });
    const loaded = await configLoader.load(context);
    if (loaded.status !== "loaded") {
      this.setStatus(loaded.status, loaded.error);
      return;
    }
    this.loadedConfig = loaded.config;
    try {
      const transport = loaded.stdioRuntime ? new StdioTransport() : this.buildTransportFromConfig(loaded.config);
      this.client = new ChannelAppServerClient(transport);
      await super.start();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.setStatus("stopped", this.buildModuleError("startupFailed", message));
    }
  }
  signalAuthRequired(error) {
    this.setStatus("authRequired", this.buildStatusError("authRequired", error));
  }
  signalAuthExpired(error) {
    this.setStatus("authExpired", this.buildStatusError("authExpired", error));
  }
  buildStatusError(code, error) {
    return this.moduleLifecycle.buildStatusError(code, error);
  }
  buildModuleError(code, message) {
    return this.moduleLifecycle.buildModuleError(code, message);
  }
};
var PlaceholderTransport = class {
  async readMessage() {
    throw new TransportClosed("ModuleChannelAdapter transport not configured");
  }
  async writeMessage(_msg) {
    throw new TransportClosed("ModuleChannelAdapter transport not configured");
  }
  async close() {
  }
};

// ../channel/dist/approvalReplies.js
var APPROVAL_REPLY_PENDING_NOTICE = "\u5F53\u524D\u6709\u5F85\u5BA1\u6279\u7684\u64CD\u4F5C\uFF0C\u8BF7\u56DE\u590D \u540C\u610F/yes\u3001\u540C\u610F\u5168\u90E8/yes all \u6216 \u62D2\u7EDD/no\u3002";
var APPROVAL_REPLY_TIMEOUT_NOTICE = "\u5BA1\u6279\u5DF2\u8D85\u65F6\uFF0C\u64CD\u4F5C\u5DF2\u53D6\u6D88\u3002";
var ACCEPT_FOR_SESSION_REPLIES = /* @__PURE__ */ new Set(["\u540C\u610F\u5168\u90E8", "\u5141\u8BB8\u5168\u90E8", "yes all", "approve all", "y all", "approve session"]);
var ACCEPT_REPLIES = /* @__PURE__ */ new Set(["\u540C\u610F", "\u5141\u8BB8", "yes", "y", "approve"]);
var DECLINE_REPLIES = /* @__PURE__ */ new Set(["\u62D2\u7EDD", "\u4E0D\u540C\u610F", "no", "n", "reject", "deny"]);
var CANCEL_REPLIES = /* @__PURE__ */ new Set(["\u53D6\u6D88", "cancel"]);
var SLASH_ALIASES = /* @__PURE__ */ new Map([
  ["approve", DECISION_ACCEPT],
  ["approve session", DECISION_ACCEPT_FOR_SESSION],
  ["deny", DECISION_DECLINE]
]);
function parseApprovalReplyDecision(text2, options = {}) {
  const trimmed = text2.trim();
  const reply = trimmed.replace(/^[/／]/, "").trim().replace(/\s+/g, " ").toLowerCase();
  if (!reply)
    return null;
  if (options.slashAliasesOnly) {
    return /^[/／]/.test(trimmed) ? SLASH_ALIASES.get(reply) ?? null : null;
  }
  if (ACCEPT_FOR_SESSION_REPLIES.has(reply) || /(?<!不)(同意|允许)全部/.test(reply)) {
    return DECISION_ACCEPT_FOR_SESSION;
  }
  if (ACCEPT_REPLIES.has(reply))
    return DECISION_ACCEPT;
  if (DECLINE_REPLIES.has(reply))
    return DECISION_DECLINE;
  if (CANCEL_REPLIES.has(reply))
    return DECISION_CANCEL;
  return null;
}
var ApprovalReplyTracker = class {
  options;
  pending = /* @__PURE__ */ new Map();
  constructor(options) {
    this.options = options;
  }
  wait(requestId, recipient, timeoutMs) {
    return new Promise((resolveDecision) => {
      const timer = setTimeout(() => {
        if (this.pending.get(requestId) !== entry)
          return;
        this.pending.delete(requestId);
        resolveDecision(DECISION_CANCEL);
        void this.notify(recipient, APPROVAL_REPLY_TIMEOUT_NOTICE);
      }, timeoutMs);
      const entry = {
        channelContext: recipient.channelContext,
        userId: recipient.userId,
        resolve: (decision) => {
          clearTimeout(timer);
          if (this.pending.get(requestId) === entry)
            this.pending.delete(requestId);
          resolveDecision(decision);
        }
      };
      this.pending.get(requestId)?.resolve(DECISION_CANCEL);
      this.pending.set(requestId, entry);
    });
  }
  tryResolve(recipient, text2) {
    const decision = parseApprovalReplyDecision(text2);
    if (!decision)
      return false;
    const entry = this.find(recipient);
    if (!entry)
      return false;
    entry.resolve(decision);
    return true;
  }
  hasPending(recipient) {
    return this.find(recipient) !== void 0;
  }
  async remindIfPending(recipient) {
    if (!this.find(recipient))
      return false;
    await this.notify(recipient, APPROVAL_REPLY_PENDING_NOTICE);
    return true;
  }
  cancel(recipient) {
    for (const entry of [...this.pending.values()]) {
      if (matches(entry, recipient))
        entry.resolve(DECISION_CANCEL);
    }
  }
  resolveAll(decision) {
    for (const entry of [...this.pending.values()]) {
      entry.resolve(decision);
    }
  }
  find(recipient) {
    for (const entry of this.pending.values()) {
      if (matches(entry, recipient))
        return entry;
    }
    return void 0;
  }
  async notify(recipient, text2) {
    try {
      await this.options.notify(recipient, text2);
    } catch (error) {
      console.error("[channel] approval notice delivery failed:", error instanceof Error ? error.message : String(error));
    }
  }
};
function matches(entry, recipient) {
  return entry.userId === recipient.userId && entry.channelContext === recipient.channelContext;
}

// ../channel/dist/meta.js
var CHANNEL_CONTRACT_VERSION = "1.0.0";

// dist/manifest.js
var manifest = {
  moduleId: "wecom-standard",
  channelName: "wecom",
  displayName: "WeCom",
  localizedDisplayName: {
    en: "WeCom",
    "zh-Hans": "\u4F01\u4E1A\u5FAE\u4FE1",
    ja: "WeCom",
    ko: "WeCom",
    es: "WeCom",
    fr: "WeCom",
    de: "WeCom"
  },
  interface: {
    shortDescription: "Send and receive messages through a group bot.",
    localizedShortDescription: {
      en: "Send and receive messages through a group bot.",
      "zh-Hans": "\u901A\u8FC7\u7FA4\u673A\u5668\u4EBA\u6536\u53D1\u6D88\u606F\u3002",
      ja: "\u30B0\u30EB\u30FC\u30D7\u30DC\u30C3\u30C8\u3067\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u9001\u53D7\u4FE1\u3057\u307E\u3059\u3002",
      ko: "\uADF8\uB8F9 \uBD07\uC73C\uB85C \uBA54\uC2DC\uC9C0\uB97C \uC8FC\uACE0\uBC1B\uC544\uC694.",
      es: "Env\xEDa y recibe mensajes mediante un bot de grupo.",
      fr: "Envoyez et recevez des messages via un bot de groupe.",
      de: "Senden und empfangen Sie Nachrichten \xFCber einen Gruppen-Bot."
    },
    longDescription: "Message the bot in WeCom and DotCraft replies in the same chat. Only whitelisted users and chats get replies. Replies can include text, images, files, and voice.",
    localizedLongDescription: {
      en: "Message the bot in WeCom and DotCraft replies in the same chat. Only whitelisted users and chats get replies. Replies can include text, images, files, and voice.",
      "zh-Hans": "\u5728\u4F01\u4E1A\u5FAE\u4FE1\u4E2D\u7ED9\u673A\u5668\u4EBA\u53D1\u6D88\u606F\uFF0CDotCraft \u4F1A\u5728\u540C\u4E00\u4F1A\u8BDD\u4E2D\u56DE\u590D\uFF0C\u4EC5\u56DE\u590D\u767D\u540D\u5355\u5185\u7684\u7528\u6237\u548C\u4F1A\u8BDD\u3002\u56DE\u590D\u53EF\u4EE5\u5305\u542B\u6587\u672C\u3001\u56FE\u7247\u3001\u6587\u4EF6\u548C\u8BED\u97F3\u3002",
      ja: "WeCom \u3067\u30DC\u30C3\u30C8\u306B\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u9001\u308B\u3068\u3001DotCraft \u304C\u540C\u3058\u30C1\u30E3\u30C3\u30C8\u3067\u8FD4\u4FE1\u3057\u307E\u3059\u3002\u8FD4\u4FE1\u3055\u308C\u308B\u306E\u306F\u3001\u8A31\u53EF\u30EA\u30B9\u30C8\u306B\u767B\u9332\u3055\u308C\u305F\u30E6\u30FC\u30B6\u30FC\u3068\u30C1\u30E3\u30C3\u30C8\u306E\u307F\u3067\u3059\u3002\u8FD4\u4FE1\u306B\u306F\u30C6\u30AD\u30B9\u30C8\u3001\u753B\u50CF\u3001\u30D5\u30A1\u30A4\u30EB\u3001\u97F3\u58F0\u3092\u542B\u3081\u3089\u308C\u307E\u3059\u3002",
      ko: "WeCom\uC5D0\uC11C \uBD07\uC5D0\uAC8C \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0B4\uBA74 DotCraft\uAC00 \uAC19\uC740 \uCC44\uD305\uC5D0\uC11C \uB2F5\uC7A5\uD574\uC694. \uD5C8\uC6A9 \uBAA9\uB85D\uC5D0 \uC788\uB294 \uC0AC\uC6A9\uC790\uC640 \uCC44\uD305\uC5D0\uB9CC \uB2F5\uC7A5\uD574\uC694. \uB2F5\uC7A5\uC5D0\uB294 \uD14D\uC2A4\uD2B8, \uC774\uBBF8\uC9C0, \uD30C\uC77C, \uC74C\uC131\uC744 \uD3EC\uD568\uD560 \uC218 \uC788\uC5B4\uC694.",
      es: "Escribe al bot en WeCom y DotCraft responde en el mismo chat. Solo responde a los usuarios y chats permitidos. Las respuestas pueden incluir texto, im\xE1genes, archivos y voz.",
      fr: "\xC9crivez au bot dans WeCom et DotCraft r\xE9pond dans la m\xEAme conversation. Seuls les utilisateurs et conversations autoris\xE9s re\xE7oivent des r\xE9ponses. Les r\xE9ponses peuvent contenir du texte, des images, des fichiers et de la voix.",
      de: "Schreiben Sie dem Bot in WeCom, und DotCraft antwortet im selben Chat. Nur zugelassene Benutzer und Chats erhalten Antworten. Antworten k\xF6nnen Text, Bilder, Dateien und Sprache enthalten."
    },
    previewPrompt: "Sync this WeCom thread into project memory.",
    localizedPreviewPrompt: {
      en: "Sync this WeCom thread into project memory.",
      "zh-Hans": "\u628A\u8FD9\u6BB5\u4F01\u4E1A\u5FAE\u4FE1\u8BA8\u8BBA\u540C\u6B65\u5230\u9879\u76EE\u8BB0\u5FC6\u4E2D\u3002",
      ja: "\u3053\u306E WeCom \u306E\u30B9\u30EC\u30C3\u30C9\u3092\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E\u30E1\u30E2\u30EA\u306B\u540C\u671F\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      ko: "\uC774 WeCom \uC2A4\uB808\uB4DC\uB97C \uD504\uB85C\uC81D\uD2B8 \uBA54\uBAA8\uB9AC\uC5D0 \uB3D9\uAE30\uD654\uD574 \uC8FC\uC138\uC694.",
      es: "Sincroniza este hilo de WeCom con la memoria del proyecto.",
      fr: "Synchronisez ce fil WeCom dans la m\xE9moire du projet.",
      de: "Synchronisieren Sie diesen WeCom-Thread mit dem Projektspeicher."
    },
    setupSteps: [
      "In WeCom, create a group bot, turn on callback mode, and note its Token and EncodingAESKey.",
      "In Manage, add the bot with its callback path, Token, and EncodingAESKey, add admin users, whitelisted users, or whitelisted chats, then select Connect.",
      "Set the bot's callback URL to a public HTTPS address that forwards to DotCraft's callback listen port (`9000` by default)."
    ],
    localizedSetupSteps: {
      en: [
        "In WeCom, create a group bot, turn on callback mode, and note its Token and EncodingAESKey.",
        "In Manage, add the bot with its callback path, Token, and EncodingAESKey, add admin users, whitelisted users, or whitelisted chats, then select Connect.",
        "Set the bot's callback URL to a public HTTPS address that forwards to DotCraft's callback listen port (`9000` by default)."
      ],
      "zh-Hans": [
        "\u5728\u4F01\u4E1A\u5FAE\u4FE1\u4E2D\u521B\u5EFA\u7FA4\u673A\u5668\u4EBA\uFF0C\u542F\u7528\u56DE\u8C03\u6A21\u5F0F\uFF0C\u5E76\u8BB0\u5F55 Token \u548C EncodingAESKey\u3002",
        "\u5728\u300C\u7BA1\u7406\u300D\u4E2D\u6DFB\u52A0\u673A\u5668\u4EBA\u914D\u7F6E\uFF0C\u586B\u5199\u56DE\u8C03\u8DEF\u5F84\u3001Token \u548C EncodingAESKey\uFF0C\u6DFB\u52A0\u7BA1\u7406\u5458\u7528\u6237\u3001\u767D\u540D\u5355\u7528\u6237\u6216\u767D\u540D\u5355\u4F1A\u8BDD\uFF0C\u7136\u540E\u70B9\u51FB\u300C\u8FDE\u63A5\u300D\u3002",
        "\u5C06\u673A\u5668\u4EBA\u7684\u56DE\u8C03 URL \u8BBE\u7F6E\u4E3A\u53EF\u4ECE\u516C\u7F51\u8BBF\u95EE\u7684 HTTPS \u5730\u5740\uFF0C\u5E76\u8F6C\u53D1\u5230 DotCraft \u7684\u56DE\u8C03\u76D1\u542C\u7AEF\u53E3\uFF08\u9ED8\u8BA4\u4E3A `9000`\uFF09\u3002"
      ],
      ja: [
        "WeCom \u3067\u30B0\u30EB\u30FC\u30D7\u30DC\u30C3\u30C8\u3092\u4F5C\u6210\u3057\u3001\u30B3\u30FC\u30EB\u30D0\u30C3\u30AF\u30E2\u30FC\u30C9\u3092\u30AA\u30F3\u306B\u3057\u3066\u3001Token \u3068 EncodingAESKey \u3092\u63A7\u3048\u3066\u304A\u304D\u307E\u3059\u3002",
        "\u300C\u7BA1\u7406\u300D\u3067\u30DC\u30C3\u30C8\u3092\u8FFD\u52A0\u3057\u3001\u300C\u30B3\u30FC\u30EB\u30D0\u30C3\u30AF\u30D1\u30B9\u300D\u3001Token\u3001EncodingAESKey \u3092\u5165\u529B\u3057\u307E\u3059\u3002\u300C\u7BA1\u7406\u8005\u30E6\u30FC\u30B6\u30FC\u300D\u3001\u300C\u8A31\u53EF\u30EA\u30B9\u30C8\u306E\u30E6\u30FC\u30B6\u30FC\u300D\u3001\u300C\u8A31\u53EF\u30EA\u30B9\u30C8\u306E\u30C1\u30E3\u30C3\u30C8\u300D\u306E\u3044\u305A\u308C\u304B\u3092\u8FFD\u52A0\u3057\u3066\u3001\u300C\u63A5\u7D9A\u300D\u3092\u9078\u629E\u3057\u307E\u3059\u3002",
        "\u30DC\u30C3\u30C8\u306E\u30B3\u30FC\u30EB\u30D0\u30C3\u30AF URL \u3092\u3001DotCraft \u306E\u30B3\u30FC\u30EB\u30D0\u30C3\u30AF\u5F85\u3061\u53D7\u3051\u30DD\u30FC\u30C8\uFF08\u30C7\u30D5\u30A9\u30EB\u30C8\u306F `9000`\uFF09\u306B\u8EE2\u9001\u3059\u308B\u516C\u958B HTTPS \u30A2\u30C9\u30EC\u30B9\u306B\u8A2D\u5B9A\u3057\u307E\u3059\u3002"
      ],
      ko: [
        "WeCom\uC5D0\uC11C \uADF8\uB8F9 \uBD07\uC744 \uB9CC\uB4E4\uACE0 \uCF5C\uBC31 \uBAA8\uB4DC\uB97C \uCF20 \uB2E4\uC74C Token\uACFC EncodingAESKey\uB97C \uBA54\uBAA8\uD574 \uB450\uC138\uC694.",
        "\uAD00\uB9AC\uC5D0\uC11C \uBD07\uC744 \uCD94\uAC00\uD558\uACE0 \uCF5C\uBC31 \uACBD\uB85C, Token, EncodingAESKey\uB97C \uC785\uB825\uD55C \uB4A4 \uAD00\uB9AC\uC790 \uC0AC\uC6A9\uC790, \uD5C8\uC6A9 \uBAA9\uB85D \uC0AC\uC6A9\uC790 \uB610\uB294 \uD5C8\uC6A9 \uBAA9\uB85D \uCC44\uD305\uC744 \uCD94\uAC00\uD558\uACE0 \uC5F0\uACB0\uC744 \uC120\uD0DD\uD558\uC138\uC694.",
        "\uBD07\uC758 \uCF5C\uBC31 URL\uC744 DotCraft\uC758 \uCF5C\uBC31 \uC218\uC2E0 \uD3EC\uD2B8(\uAE30\uBCF8\uAC12 `9000`)\uB85C \uC804\uB2EC\uD558\uB294 \uACF5\uAC1C HTTPS \uC8FC\uC18C\uB85C \uC124\uC815\uD558\uC138\uC694."
      ],
      es: [
        "En WeCom, crea un bot de grupo, activa el modo callback y anota su Token y EncodingAESKey.",
        "En Administrar, a\xF1ade el bot con su ruta de callback, Token y EncodingAESKey, a\xF1ade usuarios administradores, usuarios permitidos o chats permitidos y selecciona Conectar.",
        "Configura la URL de callback del bot con una direcci\xF3n HTTPS p\xFAblica que reenv\xEDe al puerto de escucha de callback de DotCraft (`9000` por defecto)."
      ],
      fr: [
        "Dans WeCom, cr\xE9ez un bot de groupe, activez le mode rappel et notez son Token et son EncodingAESKey.",
        "Dans G\xE9rer, ajoutez le bot avec son chemin de rappel, son Token et son EncodingAESKey, ajoutez des utilisateurs administrateurs, des utilisateurs autoris\xE9s ou des conversations autoris\xE9es, puis s\xE9lectionnez Connecter.",
        "D\xE9finissez l'URL de rappel du bot sur une adresse HTTPS publique qui redirige vers le port d'\xE9coute de rappel de DotCraft (`9000` par d\xE9faut)."
      ],
      de: [
        "Erstellen Sie in WeCom einen Gruppen-Bot, aktivieren Sie den Callback-Modus und notieren Sie Token und EncodingAESKey.",
        "F\xFCgen Sie unter Verwalten den Bot mit Callback-Pfad, Token und EncodingAESKey hinzu, erg\xE4nzen Sie Admin-Benutzer, zugelassene Benutzer oder zugelassene Chats und w\xE4hlen Sie dann Verbinden.",
        "Legen Sie als Callback-URL des Bots eine \xF6ffentliche HTTPS-Adresse fest, die an den Callback-Listen-Port von DotCraft weiterleitet (standardm\xE4\xDFig `9000`)."
      ]
    }
  },
  packageName: "@dotcraft/channel-wecom",
  configFileName: "wecom.json",
  supportedTransports: ["websocket"],
  requiresInteractiveSetup: false,
  capabilitySummary: {
    hasChannelTools: false,
    requiresInteractiveSetup: false,
    capabilitySetMayVaryByEnvironment: false
  },
  channelContractVersion: CHANNEL_CONTRACT_VERSION,
  supportedChannelProtocolVersions: ["0.2"],
  variant: "standard",
  launcher: {
    bin: "dotcraft-channel-wecom",
    supportsWorkspaceFlag: true,
    supportsConfigOverrideFlag: true
  }
};

// ../channel/dist/inboundFile.js
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, join as join4 } from "node:path";

// ../channel/dist/inboundImage.js
import { randomUUID as randomUUID2 } from "node:crypto";
import { mkdir as mkdir2, writeFile as writeFile2 } from "node:fs/promises";
import { join as join5 } from "node:path";
async function saveInboundImage(craftPath, bytes, mediaType) {
  const dir = join5(craftPath, "attachments", "images");
  await mkdir2(dir, { recursive: true });
  const fileName = `${randomUUID2()}${imageFileExtension(mediaType)}`;
  const path = join5(dir, fileName);
  await writeFile2(path, bytes);
  return { ...localImagePart(path), mimeType: mediaType, fileName };
}
function imageFileExtension(mediaType) {
  switch (mediaType.toLowerCase()) {
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".png";
  }
}

// ../channel/dist/mediaSource.js
import { createHash } from "node:crypto";
import { mkdtemp, readFile as readFile2, rm, stat, writeFile as writeFile3 } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename as basename2, extname, join as join6, resolve as resolve3 } from "node:path";
var MediaSourceError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.name = "MediaSourceError";
    this.code = code;
  }
};
async function prepareMediaBytes(source, options = {}) {
  const normalized = normalizeMediaSource(source, options);
  if (normalized.kind === "hostPath") {
    const resolvedPath = resolve3(normalized.hostPath);
    const fileStats = await stat(resolvedPath).catch((error) => {
      fail(options, "InvalidArguments", `Cannot access file '${resolvedPath}': ${formatError(error)}`);
    });
    if (!fileStats.isFile()) {
      fail(options, "InvalidArguments", `Path '${resolvedPath}' is not a regular file.`);
    }
    const bytes2 = await readFile2(resolvedPath).catch((error) => {
      fail(options, "InvalidArguments", `Cannot read file '${resolvedPath}': ${formatError(error)}`);
    });
    const fileName2 = normalizeFileName(options.fileName ?? normalized.fileName ?? basename2(resolvedPath), options.fallbackFileName);
    return finalizePreparedMedia(bytes2, {
      ...options,
      sourceKind: "hostPath",
      fileName: fileName2,
      mediaType: options.mediaType ?? normalized.mediaType,
      resolvedPath
    });
  }
  if (normalized.kind === "dataBase64") {
    const bytes2 = decodeBase64Media(normalized.dataBase64, options);
    const fileName2 = normalizeFileName(options.fileName ?? normalized.fileName, options.fallbackFileName);
    return finalizePreparedMedia(bytes2, {
      ...options,
      sourceKind: "dataBase64",
      fileName: fileName2,
      mediaType: options.mediaType ?? normalized.mediaType
    });
  }
  if (!options.allowUrl) {
    fail(options, "UnsupportedMediaSource", "URL media sources are not enabled for this channel operation.");
  }
  const parsedUrl = parseHttpUrl(normalized.url, options);
  const response = await (options.fetch ?? fetch)(parsedUrl).catch((error) => {
    fail(options, "InvalidArguments", `Cannot fetch media URL '${parsedUrl.toString()}': ${formatError(error)}`);
  });
  if (!response.ok) {
    fail(options, "InvalidArguments", `Media URL '${parsedUrl.toString()}' returned HTTP ${response.status}.`);
  }
  const contentLength = parseContentLength(response.headers.get("content-length"));
  if (contentLength !== void 0)
    enforceMaxBytes(contentLength, options);
  const bytes = Buffer.from(await response.arrayBuffer());
  const responseMediaType = normalizeMediaType(response.headers.get("content-type") ?? void 0);
  const fileName = normalizeFileName(options.fileName ?? normalized.fileName ?? fileNameFromUrl(parsedUrl), options.fallbackFileName);
  return finalizePreparedMedia(bytes, {
    ...options,
    sourceKind: "url",
    fileName,
    mediaType: options.mediaType ?? normalized.mediaType ?? responseMediaType,
    url: parsedUrl.toString()
  });
}
function decodeBase64Media(value, options = {}) {
  const fieldName = options.fieldName ?? "dataBase64";
  const text2 = requiredText(value, fieldName, options);
  const normalized = text2.startsWith("base64://") ? text2.slice("base64://".length) : text2;
  const compact = normalized.replace(/\s+/g, "");
  if (!compact || compact.length % 4 === 1 || /[^A-Za-z0-9+/=]/.test(compact) || !/^[A-Za-z0-9+/]*={0,2}$/.test(compact)) {
    fail(options, "InvalidArguments", `${fieldName} did not contain valid base64.`);
  }
  return Buffer.from(compact, "base64");
}
function inferMediaTypeFromFileName(fileName) {
  switch (extname(fileName).toLowerCase()) {
    case ".csv":
      return "text/csv";
    case ".gif":
      return "image/gif";
    case ".htm":
    case ".html":
      return "text/html";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".json":
      return "application/json";
    case ".md":
      return "text/markdown";
    case ".mp3":
      return "audio/mpeg";
    case ".mp4":
      return "video/mp4";
    case ".ogg":
    case ".oga":
      return "audio/ogg";
    case ".pdf":
      return "application/pdf";
    case ".png":
      return "image/png";
    case ".txt":
      return "text/plain";
    case ".xml":
      return "application/xml";
    case ".zip":
      return "application/zip";
    default:
      return "application/octet-stream";
  }
}
function normalizeMediaSource(source, options) {
  const kind = String(source.kind ?? "").trim();
  if (kind === "hostPath") {
    return {
      kind,
      hostPath: requiredText(source.hostPath, "hostPath", options),
      fileName: optionalText(source.fileName),
      mediaType: optionalText(source.mediaType)
    };
  }
  if (kind === "url") {
    return {
      kind,
      url: requiredText(source.url, "url", options),
      fileName: optionalText(source.fileName),
      mediaType: optionalText(source.mediaType)
    };
  }
  if (kind === "dataBase64") {
    return {
      kind,
      dataBase64: requiredText(source.dataBase64, "dataBase64", options),
      fileName: optionalText(source.fileName),
      mediaType: optionalText(source.mediaType)
    };
  }
  fail(options, "UnsupportedMediaSource", `Unsupported media source kind '${kind || "unknown"}'.`);
}
function finalizePreparedMedia(bytes, options) {
  enforceMaxBytes(bytes.length, options);
  const mediaType = options.mediaType ?? inferMediaTypeFromFileName(options.fileName);
  return {
    bytes,
    byteLength: bytes.length,
    fileName: options.fileName,
    mediaType,
    md5: createHash("md5").update(bytes).digest("hex"),
    sourceKind: options.sourceKind,
    resolvedPath: options.resolvedPath,
    url: options.url
  };
}
function enforceMaxBytes(byteLength2, options) {
  if (options.maxBytes !== void 0 && byteLength2 > options.maxBytes) {
    fail(options, "InvalidArguments", `Media source is ${byteLength2} bytes, exceeding the ${options.maxBytes} byte limit.`);
  }
}
function parseHttpUrl(value, options) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    fail(options, "InvalidArguments", `Media URL '${value}' is not a valid URL.`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    fail(options, "InvalidArguments", `Media URL '${value}' must use http or https.`);
  }
  return parsed;
}
function parseContentLength(value) {
  if (!value)
    return void 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : void 0;
}
function normalizeFileName(fileName, fallbackFileName) {
  const normalized = fileName?.trim() || fallbackFileName?.trim() || "attachment";
  return fileNameLeaf(normalized) || "attachment";
}
function fileNameFromUrl(url) {
  const pathName = url.pathname.trim();
  if (!pathName || pathName === "/")
    return void 0;
  const name = fileNameLeaf(pathName);
  if (!name)
    return void 0;
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}
function fileNameLeaf(value) {
  const normalized = value.replaceAll("\\", "/");
  const parts = normalized.split("/");
  return parts[parts.length - 1] ?? "";
}
function normalizeMediaType(value) {
  const normalized = value?.split(";", 1)[0]?.trim();
  return normalized || void 0;
}
function requiredText(value, fieldName, options) {
  const text2 = optionalText(value);
  if (!text2)
    fail(options, "InvalidArguments", `${fieldName} is required.`);
  return text2;
}
function optionalText(value) {
  const text2 = String(value ?? "").trim();
  return text2 || void 0;
}
function fail(options, code, message) {
  throw options.errorFactory?.(code, message) ?? new MediaSourceError(code, message);
}
function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

// dist/wecom-delivery.js
var WE_COM_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
var WE_COM_FILE_MAX_BYTES = 20 * 1024 * 1024;
var WE_COM_VOICE_MAX_BYTES = 2 * 1024 * 1024;
var sourceForms = { supportsHostPath: true, supportsUrl: true, supportsBase64: true };
var weComDeliveryCapabilities = {
  text: { format: "plain" },
  targets: { group: false, direct: "knownOnly" },
  media: {
    image: {
      maxBytes: WE_COM_IMAGE_MAX_BYTES,
      allowedMimeTypes: ["image/jpeg", "image/png"],
      allowedExtensions: [".jpg", ".jpeg", ".png"],
      ...sourceForms
    },
    file: {
      maxBytes: WE_COM_FILE_MAX_BYTES,
      ...sourceForms
    },
    audio: {
      maxBytes: WE_COM_VOICE_MAX_BYTES,
      allowedMimeTypes: ["audio/amr"],
      allowedExtensions: [".amr"],
      ...sourceForms
    }
  }
};
var mediaLimits = {
  image: { maxBytes: WE_COM_IMAGE_MAX_BYTES, fallbackFileName: "image.png" },
  file: { maxBytes: WE_COM_FILE_MAX_BYTES, fallbackFileName: "file.bin" },
  audio: { maxBytes: WE_COM_VOICE_MAX_BYTES, fallbackFileName: "voice.amr" }
};
var WeComMediaError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.name = "WeComMediaError";
    this.code = code;
  }
};
async function deliverWeComMessage(pusher, message) {
  const kind = String(message.kind ?? "");
  if (kind === "text") {
    await pusher.pushText(String(message.text ?? ""));
    return { delivered: true };
  }
  if (kind !== "image" && kind !== "file" && kind !== "audio") {
    return {
      delivered: false,
      errorCode: "UnsupportedDeliveryKind",
      errorMessage: `WeCom channel does not support '${kind}' delivery.`
    };
  }
  const prepared = await prepareMediaBytes(asRecord2(message.source), {
    fileName: optionalText2(message.fileName),
    fallbackFileName: mediaLimits[kind].fallbackFileName,
    maxBytes: mediaLimits[kind].maxBytes,
    allowUrl: true,
    errorFactory: weComMediaError
  });
  if (kind === "audio" && !isAmr(prepared.bytes)) {
    throw new WeComMediaError("MediaTypeNotAllowed", "WeCom voice delivery only supports AMR files.");
  }
  const caption = optionalText2(message.caption);
  if (caption)
    await pusher.pushText(caption);
  if (kind === "image" && isJpegOrPng(prepared.bytes)) {
    await pusher.pushImage(prepared.bytes);
    return { delivered: true };
  }
  const uploadType = kind === "audio" ? "voice" : "file";
  const mediaId = await pusher.uploadMedia(prepared.bytes, prepared.fileName, uploadType);
  if (uploadType === "voice")
    await pusher.pushVoice(mediaId);
  else
    await pusher.pushFile(mediaId);
  return { delivered: true, remoteMediaId: mediaId };
}
function isJpegOrPng(bytes) {
  const isPng = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg = bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  return isPng || isJpeg;
}
function isAmr(bytes) {
  return bytes.subarray(0, 5).toString("latin1") === "#!AMR";
}
function optionalText2(value) {
  const text2 = String(value ?? "").trim();
  return text2 || void 0;
}
function asRecord2(value) {
  return value && typeof value === "object" ? value : {};
}
function weComMediaError(code, message) {
  return new WeComMediaError(code, message);
}

// dist/permission.js
var WeComPermissionService = class {
  adminUsers;
  whitelistedUsers;
  whitelistedChats;
  constructor(config) {
    this.adminUsers = new Set(normalizeIds(config.adminUsers));
    this.whitelistedUsers = new Set(normalizeIds(config.whitelistedUsers));
    this.whitelistedChats = new Set(normalizeIds(config.whitelistedChats));
  }
  getUserRole(userId, chatId) {
    const user = normalizeId(userId);
    const chat = chatId ? normalizeId(chatId) : "";
    if (this.adminUsers.has(user))
      return "admin";
    if (this.whitelistedUsers.has(user))
      return "user";
    if (chat && this.whitelistedChats.has(chat))
      return "user";
    return "unauthorized";
  }
};
function normalizeId(value) {
  const text2 = String(value ?? "").trim();
  if (!text2)
    throw new Error("WeCom id values must be non-empty strings.");
  return text2;
}
function normalizeIds(values) {
  return (values ?? []).map((value) => normalizeId(value));
}

// dist/wecom-server.js
import { readFile as readFile4 } from "node:fs/promises";
import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { URL as URL2 } from "node:url";

// dist/wecom-crypto.js
import { createCipheriv, createDecipheriv, createHash as createHash2, randomBytes } from "node:crypto";
var Pkcs7BlockSize = 32;
var WeComBizMsgCrypt = class {
  token;
  aesKey;
  constructor(token, encodingAesKey) {
    if (!token)
      throw new Error("Token must not be empty.");
    if (!encodingAesKey)
      throw new Error("EncodingAESKey must not be empty.");
    this.token = token;
    this.aesKey = Buffer.from(padBase64(encodingAesKey), "base64");
    if (this.aesKey.length !== 32) {
      throw new Error("EncodingAESKey must decode to 32 bytes.");
    }
  }
  verifyUrl(msgSignature, timestamp, nonce, echoStr) {
    const signature = this.computeSignature(timestamp, nonce, echoStr);
    if (signature !== msgSignature) {
      throw new Error(`Signature validation failed: expected=${msgSignature}, actual=${signature}`);
    }
    const plaintext = this.aesDecrypt(echoStr);
    const { message } = parsePlainText(plaintext);
    return message.toString("utf-8");
  }
  decryptMsg(msgSignature, timestamp, nonce, postData) {
    const encryptData = extractXmlTag(postData, "Encrypt");
    if (!encryptData)
      throw new Error("Could not extract Encrypt from callback XML.");
    const signature = this.computeSignature(timestamp, nonce, encryptData);
    if (signature !== msgSignature) {
      throw new Error(`Signature validation failed: expected=${msgSignature}, actual=${signature}`);
    }
    const plaintext = this.aesDecrypt(encryptData);
    const { message } = parsePlainText(plaintext);
    return message.toString("utf-8");
  }
  encryptMsg(replyMsg, timestamp, nonce) {
    const msgBytes = Buffer.from(replyMsg, "utf-8");
    const msgLen = Buffer.alloc(4);
    msgLen.writeUInt32BE(msgBytes.length, 0);
    const plaintext = Buffer.concat([generateRandomBytes(16), msgLen, msgBytes]);
    const encrypted = this.aesEncrypt(plaintext);
    const signature = this.computeSignature(timestamp, nonce, encrypted);
    return `<xml><Encrypt><![CDATA[${encrypted}]]></Encrypt><MsgSignature><![CDATA[${signature}]]></MsgSignature><TimeStamp>${timestamp}</TimeStamp><Nonce><![CDATA[${nonce}]]></Nonce></xml>`;
  }
  computeSignature(timestamp, nonce, encrypt) {
    const raw = [this.token, timestamp, nonce, encrypt].sort().join("");
    return createHash2("sha1").update(raw, "utf-8").digest("hex");
  }
  aesEncrypt(plaintext) {
    const cipher = createCipheriv("aes-256-cbc", this.aesKey, this.aesKey.subarray(0, 16));
    cipher.setAutoPadding(false);
    const padded = pkcs7Pad(plaintext, Pkcs7BlockSize);
    return Buffer.concat([cipher.update(padded), cipher.final()]).toString("base64");
  }
  aesDecrypt(base64EncryptedText) {
    const encrypted = Buffer.from(base64EncryptedText, "base64");
    const decipher = createDecipheriv("aes-256-cbc", this.aesKey, this.aesKey.subarray(0, 16));
    decipher.setAutoPadding(false);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return pkcs7Unpad(decrypted, Pkcs7BlockSize);
  }
};
function extractXmlTag(xml, tagName) {
  const pattern = new RegExp(`<${tagName}>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</${tagName}>`, "i");
  const match = pattern.exec(xml);
  return match?.[1]?.trim() ?? null;
}
function parsePlainText(plaintext) {
  if (plaintext.length < 20)
    throw new Error("Decrypted payload is too short.");
  const random = plaintext.subarray(0, 16);
  const msgLen = plaintext.readUInt32BE(16);
  if (plaintext.length < 20 + msgLen)
    throw new Error("Decrypted message length mismatch.");
  const message = plaintext.subarray(20, 20 + msgLen);
  const receiverId = plaintext.subarray(20 + msgLen);
  return { random, message, receiverId };
}
function pkcs7Pad(data, blockSize) {
  const padding = blockSize - data.length % blockSize;
  return Buffer.concat([data, Buffer.alloc(padding, padding)]);
}
function pkcs7Unpad(data, blockSize) {
  if (data.length === 0)
    throw new Error("PKCS7 unpad failed: empty data.");
  if (data.length % blockSize !== 0)
    throw new Error("PKCS7 unpad failed: data length is not block aligned.");
  const padding = data[data.length - 1] ?? 0;
  if (padding < 1 || padding > blockSize)
    throw new Error(`PKCS7 unpad failed: invalid padding length ${padding}.`);
  return data.subarray(0, data.length - padding);
}
function padBase64(value) {
  const remainder = value.length % 4;
  if (remainder === 2)
    return `${value}==`;
  if (remainder === 3)
    return `${value}=`;
  return value;
}
function generateRandomBytes(length) {
  return randomBytes(length);
}

// dist/wecom-pusher.js
import { readFile as readFile3 } from "node:fs/promises";
import { createHash as createHash3, randomUUID as randomUUID3 } from "node:crypto";

// dist/message-splitter.js
var paragraphSeparators = ["\r\n\r\n", "\n\n"];
var lineSeparators = ["\r\n", "\n"];
var sentenceSeparators = ["\u3002", ". ", "\uFF01", "! ", "\uFF1F", "? "];
var WeComTextMaxBytes = 2048;
var WeComMarkdownMaxBytes = 4096;
var WeComInterChunkDelayMs = 200;
function splitWeComMessage(content, maxBytes) {
  if (!content)
    return [content ?? ""];
  if (byteLength(content) <= maxBytes)
    return [content];
  const chunks = [];
  let remaining = content;
  while (remaining.length > 0) {
    if (byteLength(remaining) <= maxBytes) {
      chunks.push(remaining);
      break;
    }
    const index = findSplitIndex(remaining, maxBytes);
    chunks.push(remaining.slice(0, index).trimEnd());
    remaining = remaining.slice(index).trimStart();
  }
  return chunks;
}
function findSplitIndex(text2, maxBytes) {
  let lo = 0;
  let hi = text2.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo + 1) / 2);
    if (byteLength(text2.slice(0, mid)) <= maxBytes)
      lo = mid;
    else
      hi = mid - 1;
  }
  const limit = lo;
  return findSeparator(text2, limit, paragraphSeparators) ?? findSeparator(text2, limit, lineSeparators) ?? findSeparator(text2, limit, sentenceSeparators) ?? findSpace(text2, limit) ?? limit;
}
function findSeparator(text2, limit, separators) {
  const minAcceptable = Math.floor(limit / 4);
  let best = -1;
  const searchArea = text2.slice(0, limit);
  for (const separator of separators) {
    const pos = searchArea.lastIndexOf(separator);
    if (pos >= minAcceptable)
      best = Math.max(best, pos + separator.length);
  }
  return best > 0 ? best : null;
}
function findSpace(text2, limit) {
  const pos = text2.slice(0, limit).lastIndexOf(" ");
  return pos > Math.floor(limit / 4) ? pos + 1 : null;
}
function byteLength(text2) {
  return Buffer.byteLength(text2, "utf-8");
}

// dist/wecom-pusher.js
var WeComPusher = class {
  chatId;
  webhookUrl;
  constructor(chatId, webhookUrl) {
    this.chatId = chatId;
    this.webhookUrl = webhookUrl;
    if (!chatId)
      throw new Error("chatId is required.");
    if (!webhookUrl)
      throw new Error("webhookUrl is required.");
  }
  getChatId() {
    return this.chatId;
  }
  async pushText(content, mentionedList, mentionedMobileList, visibleToUser) {
    const chunks = splitWeComMessage(content, WeComTextMaxBytes);
    for (let i = 0; i < chunks.length; i += 1) {
      if (i > 0)
        await delay(WeComInterChunkDelayMs);
      await this.post({
        chatid: this.chatId,
        msgtype: "text",
        text: {
          content: chunks[i],
          mentioned_list: i === 0 ? mentionedList : void 0,
          mentioned_mobile_list: i === 0 ? mentionedMobileList : void 0
        },
        visible_to_user: visibleToUser?.join("|")
      });
    }
  }
  async pushMarkdown(content, visibleToUser) {
    const chunks = splitWeComMessage(content, WeComMarkdownMaxBytes);
    for (let i = 0; i < chunks.length; i += 1) {
      if (i > 0)
        await delay(WeComInterChunkDelayMs);
      await this.post({
        chatid: this.chatId,
        msgtype: "markdown",
        markdown: { content: chunks[i] },
        visible_to_user: visibleToUser?.join("|")
      });
    }
  }
  async pushImage(imageData, visibleToUser) {
    await this.post({
      chatid: this.chatId,
      msgtype: "image",
      image: {
        base64: imageData.toString("base64"),
        md5: createHash3("md5").update(imageData).digest("hex")
      },
      visible_to_user: visibleToUser?.join("|")
    });
  }
  async pushNews(articles, visibleToUser) {
    await this.post({
      chatid: this.chatId,
      msgtype: "news",
      news: { articles },
      visible_to_user: visibleToUser?.join("|")
    });
  }
  async pushVoice(mediaId) {
    await this.post({
      chatid: this.chatId,
      msgtype: "voice",
      voice: { media_id: mediaId }
    });
  }
  async pushFile(mediaId) {
    await this.post({
      chatid: this.chatId,
      msgtype: "file",
      file: { media_id: mediaId }
    });
  }
  async uploadMediaFromPath(path, filename, type) {
    return await this.uploadMedia(await readFile3(path), filename, type);
  }
  async uploadMedia(fileBytes, filename, type) {
    const uploadUrl = this.buildUploadUrl(type);
    const boundary = `----DotCraft${randomUUID3().replace(/-/g, "")}`;
    const header = Buffer.from(`--${boundary}\r
Content-Disposition: form-data; name="media"; filename="${escapeHeader(filename)}"; filelength=${fileBytes.length}\r
Content-Type: application/octet-stream\r
\r
`, "utf-8");
    const footer = Buffer.from(`\r
--${boundary}--\r
`, "utf-8");
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
      body: Buffer.concat([header, fileBytes, footer])
    });
    const body = await response.text();
    if (!response.ok)
      throw new Error(`Upload media failed: HTTP ${response.status} ${body}`);
    const json = JSON.parse(body);
    const errcode = Number(json.errcode ?? 0);
    if (errcode !== 0)
      throw new Error(`Upload media failed: ${String(json.errmsg ?? "unknown")}`);
    const mediaId = String(json.media_id ?? "");
    if (!mediaId)
      throw new Error("Upload media response does not contain media_id.");
    return mediaId;
  }
  async pushRaw(jsonData) {
    await this.postRaw(jsonData);
  }
  buildUploadUrl(type) {
    const url = new URL(this.webhookUrl);
    const key = url.searchParams.get("key") ?? "";
    if (!key)
      throw new Error("Cannot extract key parameter from WeCom webhook URL.");
    return `${url.protocol}//${url.host}/cgi-bin/webhook/upload_media?key=${encodeURIComponent(key)}&type=${type}`;
  }
  async post(message) {
    const json = JSON.stringify(removeUndefined(message));
    await this.postRaw(json);
  }
  async postRaw(json) {
    const response = await fetch(this.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: json
    });
    const body = await response.text();
    if (!response.ok) {
      throw new Error(`Push message failed: HTTP ${response.status} ${body}`);
    }
    const errcode = Number(parseJsonObject(body).errcode ?? 0);
    if (errcode !== 0) {
      throw new Error(`Push message failed: errcode ${errcode} ${body}`);
    }
  }
};
function parseJsonObject(body) {
  try {
    const value = JSON.parse(body);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}
function removeUndefined(value) {
  if (Array.isArray(value))
    return value.map(removeUndefined);
  if (!value || typeof value !== "object")
    return value;
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== void 0).map(([key, item]) => [key, removeUndefined(item)]));
}
function escapeHeader(value) {
  return value.replace(/["\r\n]/g, "_");
}
function delay(ms) {
  return new Promise((resolve5) => setTimeout(resolve5, ms));
}

// dist/wecom-types.js
var WeComMsgType = {
  Event: "event",
  Text: "text",
  Image: "image",
  Attachment: "attachment",
  Mixed: "mixed",
  Voice: "voice",
  File: "file"
};
var WeComEventType = {
  AddToChat: "add_to_chat",
  DeleteFromChat: "delete_from_chat",
  EnterChat: "enter_chat"
};
var WeComChatType = {
  Single: "single",
  Group: "group"
};
function parseWeComMessage(content) {
  const trimmed = content.trimStart();
  if (!trimmed)
    return null;
  if (trimmed.startsWith("{"))
    return parseJsonMessage(trimmed);
  return parseXmlMessage(trimmed);
}
function validateWeComMessage(message) {
  switch (message.msgType) {
    case WeComMsgType.Text:
      return Boolean(message.text);
    case WeComMsgType.Image:
      return Boolean(message.image);
    case WeComMsgType.Event:
      return Boolean(message.event);
    case WeComMsgType.Attachment:
      return Boolean(message.attachment);
    case WeComMsgType.Mixed:
      return Boolean(message.mixedMessage);
    case WeComMsgType.Voice:
      return Boolean(message.voice);
    case WeComMsgType.File:
      return Boolean(message.file);
    default:
      return false;
  }
}
function normalizeWeComTextContent(content) {
  return content.replace(/\r/g, " ").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}
function parseWeComParameters(content, chatType) {
  const parts = content.split(" ").filter(Boolean);
  if (chatType === WeComChatType.Group && parts[0]?.startsWith("@"))
    return parts.slice(1);
  return parts;
}
function parseXmlMessage(xml) {
  const from = {
    userId: tag(xml, "UserId"),
    name: tag(xml, "Name"),
    alias: tag(xml, "Alias")
  };
  const msgType = tag(xml, "MsgType");
  const message = {
    from,
    webhookUrl: tag(xml, "WebhookUrl"),
    chatId: tag(xml, "ChatId"),
    postId: tag(xml, "PostId") || void 0,
    getChatInfoUrl: tag(xml, "GetChatInfoUrl") || void 0,
    msgId: tag(xml, "MsgId"),
    chatType: tag(xml, "ChatType"),
    msgType
  };
  if (msgType === WeComMsgType.Text)
    message.text = { content: tag(xml, "Content") };
  if (msgType === WeComMsgType.Event)
    message.event = { eventType: tag(xml, "EventType") };
  if (msgType === WeComMsgType.Image)
    message.image = { imageUrl: tag(xml, "ImageUrl") };
  if (msgType === WeComMsgType.Voice)
    message.voice = { content: tag(xml, "Content") };
  if (msgType === WeComMsgType.File)
    message.file = { url: tag(xml, "Url") };
  if (msgType === WeComMsgType.Attachment) {
    message.attachment = {
      callbackId: tag(xml, "CallbackId"),
      actions: {
        name: tag(xml, "Name"),
        value: tag(xml, "Value"),
        type: tag(xml, "Type")
      }
    };
  }
  if (msgType === WeComMsgType.Mixed) {
    message.mixedMessage = { msgItems: parseXmlMixedItems(xml) };
  }
  return message;
}
function parseJsonMessage(json) {
  const root = JSON.parse(json);
  const from = asRecord3(root.from);
  const msgType = text(root.msgtype);
  const message = {
    msgId: text(root.msgid),
    chatType: text(root.chattype),
    msgType,
    responseUrl: optionalText3(root.response_url),
    chatId: text(root.chatid),
    webhookUrl: text(root.webhook_url),
    from: {
      userId: text(from.userid),
      name: text(from.name),
      alias: optionalText3(from.alias) ?? text(from.userid)
    }
  };
  if (msgType === WeComMsgType.Text) {
    const obj = asRecord3(root.text);
    message.text = { content: text(obj.content) };
  }
  if (msgType === WeComMsgType.Image) {
    const obj = asRecord3(root.image);
    message.image = { imageUrl: text(obj.url) };
  }
  if (msgType === WeComMsgType.Voice) {
    const obj = asRecord3(root.voice);
    message.voice = { content: text(obj.content) };
  }
  if (msgType === WeComMsgType.File) {
    const obj = asRecord3(root.file);
    message.file = { url: text(obj.url) };
  }
  if (msgType === WeComMsgType.Mixed) {
    const obj = asRecord3(root.mixed);
    const items = Array.isArray(obj.msg_item) ? obj.msg_item : [];
    message.mixedMessage = {
      msgItems: items.map((item) => parseJsonMixedItem(asRecord3(item)))
    };
  }
  if (msgType === WeComMsgType.Event) {
    const obj = asRecord3(root.event);
    message.event = { eventType: text(obj.eventtype ?? obj.event_type) };
  }
  if (msgType === WeComMsgType.Attachment) {
    const obj = asRecord3(root.attachment);
    message.attachment = { callbackId: text(obj.callback_id) };
  }
  return message;
}
function parseJsonMixedItem(item) {
  const msgType = text(item.msgtype);
  const result = { msgType };
  if (msgType === WeComMsgType.Text) {
    result.text = { content: text(asRecord3(item.text).content) };
  }
  if (msgType === WeComMsgType.Image) {
    result.image = { imageUrl: text(asRecord3(item.image).url) };
  }
  return result;
}
function parseXmlMixedItems(xml) {
  const matches2 = [...xml.matchAll(/<MsgItem>([\s\S]*?)<\/MsgItem>/gi)];
  return matches2.map((match) => {
    const item = match[1] ?? "";
    const msgType = tag(item, "MsgType");
    const result = { msgType };
    if (msgType === WeComMsgType.Text)
      result.text = { content: tag(item, "Content") };
    if (msgType === WeComMsgType.Image)
      result.image = { imageUrl: tag(item, "ImageUrl") };
    return result;
  });
}
function tag(xml, name) {
  return extractXmlTag(xml, name) ?? "";
}
function asRecord3(value) {
  return value && typeof value === "object" ? value : {};
}
function text(value) {
  return String(value ?? "");
}
function optionalText3(value) {
  const valueText = text(value);
  return valueText || void 0;
}

// dist/wecom-server.js
var WeComBotRegistry = class {
  entries = /* @__PURE__ */ new Map();
  crypts = /* @__PURE__ */ new Map();
  handlers = /* @__PURE__ */ new Map();
  webhookUrlCache = /* @__PURE__ */ new Map();
  register(path, token, aesKey) {
    const normalized = normalizePath(path);
    if (!token)
      throw new Error("Token must not be empty.");
    if (!aesKey)
      throw new Error("EncodingAESKey must not be empty.");
    this.entries.set(normalized, { path: normalized, token, aesKey });
    this.crypts.set(normalized, new WeComBizMsgCrypt(token, aesKey));
  }
  setHandlers(path, textHandler, commonHandler, eventHandler) {
    this.handlers.set(normalizePath(path), { textHandler, commonHandler, eventHandler });
  }
  getAllPaths() {
    return [...this.entries.keys()];
  }
  getCrypt(path) {
    return this.crypts.get(normalizePath(path));
  }
  getHandlers(path) {
    return this.handlers.get(normalizePath(path));
  }
  cacheWebhookUrl(chatId, webhookUrl) {
    if (chatId && webhookUrl)
      this.webhookUrlCache.set(chatId, webhookUrl);
  }
  getWebhookUrl(chatId) {
    return this.webhookUrlCache.get(chatId);
  }
};
var WeComBotServer = class {
  registry;
  options;
  server;
  constructor(registry, options) {
    this.registry = registry;
    this.options = options;
  }
  async start() {
    if (this.server)
      return;
    this.server = await this.createServer();
    await new Promise((resolve5, reject) => {
      const onError = (error) => {
        this.server?.off("error", onError);
        reject(error);
      };
      this.server?.once("error", onError);
      this.server?.listen(this.options.port, this.options.host, () => {
        this.server?.off("error", onError);
        resolve5();
      });
    });
  }
  async stop() {
    const server = this.server;
    this.server = void 0;
    if (!server)
      return;
    await new Promise((resolve5) => server.close(() => resolve5()));
  }
  async createServer() {
    const listener = (req, res) => {
      void this.handle(req, res).catch((error) => {
        console.error("[wecom] callback handling failed:", error);
        if (!res.headersSent)
          res.statusCode = 500;
        res.end();
      });
    };
    if (this.options.scheme === "https") {
      const certPath = this.options.tls?.certPath;
      const keyPath = this.options.tls?.keyPath;
      if (!certPath || !keyPath)
        throw new Error("HTTPS requires wecom.tls.certPath and wecom.tls.keyPath.");
      return createHttpsServer({ cert: await readFile4(certPath), key: await readFile4(keyPath) }, listener);
    }
    return createHttpServer(listener);
  }
  async handle(req, res) {
    const url = new URL2(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const path = normalizePath(decodeURIComponent(url.pathname));
    if (req.method === "GET") {
      await this.handleVerifyUrl(path, url, res);
      return;
    }
    if (req.method === "POST") {
      await this.handleMessage(path, url, req, res);
      return;
    }
    res.statusCode = 405;
    res.end("Method not allowed");
  }
  async handleVerifyUrl(path, url, res) {
    const msgSignature = url.searchParams.get("msg_signature") ?? "";
    const timestamp = url.searchParams.get("timestamp") ?? "";
    const nonce = url.searchParams.get("nonce") ?? "";
    const echoStr = url.searchParams.get("echostr") ?? "";
    if (!msgSignature || !timestamp || !nonce || !echoStr) {
      res.statusCode = 400;
      res.end("Missing parameters");
      return;
    }
    const crypt = this.registry.getCrypt(path);
    if (!crypt) {
      res.statusCode = 404;
      res.end("Bot not found");
      return;
    }
    try {
      res.end(crypt.verifyUrl(msgSignature, timestamp, nonce, echoStr));
    } catch (error) {
      res.statusCode = 400;
      res.end(`Verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async handleMessage(path, url, req, res) {
    const msgSignature = url.searchParams.get("msg_signature") ?? "";
    const timestamp = url.searchParams.get("timestamp") ?? "";
    const nonce = url.searchParams.get("nonce") ?? "";
    if (!msgSignature || !timestamp || !nonce) {
      res.statusCode = 400;
      res.end("Missing parameters");
      return;
    }
    const crypt = this.registry.getCrypt(path);
    if (!crypt) {
      res.statusCode = 404;
      res.end("Bot not found");
      return;
    }
    const handlers = this.registry.getHandlers(path);
    if (!handlers || !handlers.textHandler && !handlers.commonHandler && !handlers.eventHandler) {
      res.statusCode = 200;
      res.end();
      return;
    }
    const body = await readRequestBody(req);
    const plaintext = crypt.decryptMsg(msgSignature, timestamp, nonce, body);
    const message = parseWeComMessage(plaintext);
    if (!message || !validateWeComMessage(message)) {
      res.statusCode = 400;
      res.end();
      return;
    }
    if (message.msgType === WeComMsgType.Event) {
      await this.handleEventMessage(message, handlers, crypt, timestamp, nonce, res);
      return;
    }
    res.statusCode = 200;
    res.end();
    void this.processMessage(message, handlers).catch((error) => {
      console.error("[wecom] async message processing failed:", error);
    });
  }
  async handleEventMessage(message, handlers, crypt, timestamp, nonce, res) {
    if (!handlers.eventHandler) {
      res.statusCode = 200;
      res.end();
      return;
    }
    this.registry.cacheWebhookUrl(message.chatId, message.webhookUrl);
    const pusher = new WeComPusher(message.chatId, message.webhookUrl);
    const responseText = await handlers.eventHandler(message.event?.eventType ?? "", message.chatType, message.from ?? emptyFrom(), pusher);
    if (!responseText) {
      res.statusCode = 200;
      res.end();
      return;
    }
    res.setHeader("Content-Type", "application/xml");
    res.end(crypt.encryptMsg(responseText, timestamp, nonce));
  }
  async processMessage(message, handlers) {
    const webhookUrl = message.webhookUrl || message.responseUrl || "";
    this.registry.cacheWebhookUrl(message.chatId, webhookUrl);
    const pusher = new WeComPusher(message.chatId, webhookUrl);
    if (message.msgType === WeComMsgType.Voice && handlers.textHandler) {
      const content = normalizeWeComTextContent(message.voice?.content ?? "");
      await handlers.textHandler(parseWeComParameters(content, message.chatType), message.from ?? emptyFrom(), pusher, message.chatType);
      return;
    }
    if (message.msgType === WeComMsgType.Text && handlers.textHandler) {
      const content = normalizeWeComTextContent(message.text?.content ?? "");
      await handlers.textHandler(parseWeComParameters(content, message.chatType), message.from ?? emptyFrom(), pusher, message.chatType);
      return;
    }
    if (handlers.commonHandler) {
      await handlers.commonHandler(message, pusher);
    }
  }
};
function normalizePath(path) {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/")
    throw new Error("Path must not be empty.");
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
function readRequestBody(req) {
  return new Promise((resolve5, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve5(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}
function emptyFrom() {
  return { userId: "", name: "", alias: "" };
}

// dist/wecom-adapter.js
function validateWeComConfig(rawConfig) {
  if (!rawConfig || typeof rawConfig !== "object") {
    throw new ConfigValidationError("WeCom config must be an object.", ["config"]);
  }
  const config = rawConfig;
  const dotcraft = asRecord4(config.dotcraft);
  const wecom = asRecord4(config.wecom);
  const fields = [];
  const wsUrl = String(dotcraft.wsUrl ?? "").trim();
  if (!wsUrl) {
    fields.push("dotcraft.wsUrl");
  } else if (!/^wss?:\/\//i.test(wsUrl)) {
    throw new ConfigValidationError("dotcraft.wsUrl must use ws:// or wss://.", ["dotcraft.wsUrl"]);
  }
  const port = wecom.port === void 0 ? 9e3 : Number(wecom.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new ConfigValidationError("wecom.port must be an integer between 1 and 65535.", ["wecom.port"]);
  }
  const scheme = String(wecom.scheme ?? "http").trim().toLowerCase();
  if (scheme !== "http" && scheme !== "https") {
    throw new ConfigValidationError("wecom.scheme must be 'http' or 'https'.", ["wecom.scheme"]);
  }
  const robots = Array.isArray(wecom.robots) ? wecom.robots : [];
  if (robots.length === 0)
    fields.push("wecom.robots");
  for (const [index, item] of robots.entries()) {
    const robot = asRecord4(item);
    if (!String(robot.path ?? "").trim())
      fields.push(`wecom.robots[${index}].path`);
    if (!String(robot.token ?? "").trim())
      fields.push(`wecom.robots[${index}].token`);
    if (!String(robot.aesKey ?? "").trim())
      fields.push(`wecom.robots[${index}].aesKey`);
  }
  for (const key of ["adminUsers", "whitelistedUsers", "whitelistedChats"]) {
    if (wecom[key] !== void 0 && !Array.isArray(wecom[key])) {
      throw new ConfigValidationError(`wecom.${key} must be an array.`, [`wecom.${key}`]);
    }
  }
  if (fields.length > 0) {
    throw new ConfigValidationError(`Missing required fields: ${fields.join(", ")}`, fields);
  }
}
var WeComAdapter = class extends ModuleChannelAdapter {
  server;
  registry;
  permission = new WeComPermissionService({});
  threadContextMap = /* @__PURE__ */ new Map();
  lastSenderByContext = /* @__PURE__ */ new Map();
  chatKindByContext = /* @__PURE__ */ new Map();
  directChatByUser = /* @__PURE__ */ new Map();
  approvalReplies = new ApprovalReplyTracker({
    notify: async ({ channelContext }, text2) => {
      await this.createPusher(channelContext).pushText(text2);
    }
  });
  pendingUserInputs = /* @__PURE__ */ new Map();
  approvalTimeoutMs = 6e4;
  constructor() {
    super("wecom", "dotcraft-wecom", "0.1.0", [
      "item/reasoning/delta",
      "subagent/progress",
      "item/usage/delta",
      "system/event",
      "plan/updated"
    ]);
  }
  getConfigFileName(_context) {
    return "wecom.json";
  }
  validateConfig(rawConfig) {
    validateWeComConfig(rawConfig);
  }
  buildTransportFromConfig(config) {
    return new WebSocketTransport({
      url: config.dotcraft.wsUrl,
      token: config.dotcraft.token ?? ""
    });
  }
  getDisplayName() {
    return "WeCom";
  }
  getDeliveryCapabilities() {
    return weComDeliveryCapabilities;
  }
  getChatDescriptor(_opts, channelContext) {
    return { kind: this.chatKindByContext.get(channelContext) ?? "group", membership: "shared" };
  }
  buildChannelTarget(opts, sender, channelContext) {
    const conversationId = parseWeComConversationId(channelContext);
    if (!conversationId)
      return null;
    const platformUserId = String(sender.senderId ?? opts.userId ?? "");
    const displayName = typeof sender.senderName === "string" && sender.senderName.trim() ? sender.senderName.trim() : null;
    return {
      channelName: "wecom",
      conversationKind: "chat",
      conversationId,
      deliveryTarget: channelContext,
      displayName: `WeCom chat ${conversationId}`,
      boundBy: platformUserId ? {
        platformUserId,
        displayName
      } : null
    };
  }
  async startWithContext(context) {
    this.defaultWorkspacePath = context.workspaceRoot;
    await super.startWithContext(context);
    if (this.getStatus() !== "ready" || !this.loadedConfig)
      return;
    const config = this.loadedConfig;
    this.approvalTimeoutMs = config.wecom.approvalTimeoutMs ?? 6e4;
    this.permission = new WeComPermissionService(config.wecom);
    try {
      const registry = new WeComBotRegistry();
      for (const robot of config.wecom.robots ?? []) {
        registry.register(robot.path, robot.token, robot.aesKey);
      }
      for (const path of registry.getAllPaths()) {
        registry.setHandlers(path, (parameters, from, pusher, chatType) => this.handleTextMessage(parameters, from, pusher, chatType), (message, pusher) => this.handleCommonMessage(message, pusher), (eventType, chatType, from, pusher) => this.handleEventMessage(eventType, chatType, from, pusher));
      }
      const server = new WeComBotServer(registry, {
        host: config.wecom.host ?? "0.0.0.0",
        port: config.wecom.port ?? 9e3,
        scheme: config.wecom.scheme ?? "http",
        tls: config.wecom.tls
      });
      await server.start();
      this.registry = registry;
      this.server = server;
      console.info(`[wecom] callback server listening on ${config.wecom.scheme ?? "http"}://${config.wecom.host ?? "0.0.0.0"}:${config.wecom.port ?? 9e3}`);
    } catch (error) {
      this.setStatus("stopped", {
        code: "startupFailed",
        message: error instanceof Error ? error.message : String(error),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  }
  async stop() {
    this.approvalReplies.resolveAll(DECISION_CANCEL);
    this.resolveAllPendingUserInputs(emptyUserInputResponse());
    const server = this.server;
    this.server = void 0;
    this.registry = void 0;
    await server?.stop();
    await super.stop();
  }
  onThreadContextBound(threadId, channelContext) {
    if (channelContext)
      this.threadContextMap.set(threadId, channelContext);
  }
  async onDeliver(target, content, _metadata) {
    try {
      const pusher = this.createPusher(target);
      await pusher.pushText(content);
      return true;
    } catch (error) {
      console.error("[wecom] delivery failed:", error instanceof Error ? error.message : String(error));
      return false;
    }
  }
  async onSend(target, message, _metadata) {
    const pusher = this.resolvePusher(target);
    if (!pusher) {
      return {
        delivered: false,
        errorCode: "UnsupportedTarget",
        errorMessage: `WeCom cannot reach '${target}'. Targets are chat:<chatId> for a chat that has messaged the bot.`
      };
    }
    try {
      return await deliverWeComMessage(pusher, message);
    } catch (error) {
      if (error instanceof WeComMediaError) {
        return { delivered: false, errorCode: error.code, errorMessage: error.message };
      }
      return {
        delivered: false,
        errorCode: "AdapterDeliveryFailed",
        errorMessage: error instanceof Error ? error.message : String(error)
      };
    }
  }
  async onApprovalRequest(request) {
    const threadId = String(request.threadId ?? "");
    const requestId = String(request.requestId ?? "");
    const approvalType = String(request.approvalType ?? "");
    const operation = String(request.operation ?? "");
    const target = String(request.target ?? "");
    const channelContext = this.threadContextMap.get(threadId);
    if (!channelContext) {
      console.warn(`[wecom] cannot find chat for thread ${threadId}; auto-cancelling approval`);
      return DECISION_CANCEL;
    }
    const approvalUserId = this.lastSenderByContext.get(channelContext);
    if (!approvalUserId) {
      console.warn(`[wecom] cannot find approver for '${channelContext}'; auto-cancelling approval`);
      return DECISION_CANCEL;
    }
    const timeoutSeconds = Math.round(this.approvalTimeoutMs / 1e3);
    const prompt = approvalType === "shell" ? `\u26A0\uFE0F \u9700\u8981\u6267\u884C\u547D\u4EE4\u6743\u9650\uFF1A\`${operation}\`
\u56DE\u590D \u540C\u610F/yes \u6279\u51C6\uFF0C\u540C\u610F\u5168\u90E8/yes all \u672C\u4F1A\u8BDD\u653E\u884C\u540C\u7C7B\u64CD\u4F5C\uFF0C\u62D2\u7EDD/no \u62D2\u7EDD\uFF08${timeoutSeconds}\u79D2\u8D85\u65F6\u81EA\u52A8\u62D2\u7EDD\uFF09` : `\u26A0\uFE0F \u9700\u8981 ${operation} \u6587\u4EF6\u6743\u9650\uFF1A\`${target}\`
\u56DE\u590D \u540C\u610F/yes \u6279\u51C6\uFF0C\u540C\u610F\u5168\u90E8/yes all \u672C\u4F1A\u8BDD\u653E\u884C\u540C\u7C7B\u64CD\u4F5C\uFF0C\u62D2\u7EDD/no \u62D2\u7EDD\uFF08${timeoutSeconds}\u79D2\u8D85\u65F6\u81EA\u52A8\u62D2\u7EDD\uFF09`;
    await this.createPusher(channelContext).pushText(prompt);
    return await this.approvalReplies.wait(requestId, { channelContext, userId: approvalUserId }, this.approvalTimeoutMs);
  }
  async onUserInputRequest(request) {
    const threadId = String(request.threadId ?? "");
    const requestId = String(request.requestId ?? "");
    const channelContext = this.threadContextMap.get(threadId);
    if (!channelContext || !requestId) {
      console.warn(`[wecom] cannot find chat for thread ${threadId}; resolving user input empty`);
      return emptyUserInputResponse();
    }
    const userId = this.lastSenderByContext.get(channelContext);
    if (!userId) {
      console.warn(`[wecom] cannot find user for '${channelContext}'; resolving user input empty`);
      return emptyUserInputResponse();
    }
    const steps = splitUserInputRequestByQuestion(request);
    if (steps.length === 0) {
      return emptyUserInputResponse();
    }
    const responses = [];
    for (const step of steps) {
      const response = await this.requestUserInputStep({
        request: step.request,
        channelContext,
        userId,
        promptTitle: this.userInputPromptTitle(step.questionIndex, step.questionCount)
      });
      if (!hasUserInputAnswer(response, step.question.id)) {
        return emptyUserInputResponse();
      }
      responses.push(response);
    }
    return mergeUserInputResponses(responses);
  }
  async requestUserInputStep(params) {
    const requestId = String(params.request.requestId ?? "");
    if (!requestId) {
      return emptyUserInputResponse();
    }
    this.cancelPendingUserInputsFor(params.channelContext, params.userId);
    await this.createPusher(params.channelContext).pushText(`\u2753 \u9700\u8981\u4F60\u56DE\u7B54 DotCraft \u95EE\u9898
${buildUserInputPrompt(params.request, { title: params.promptTitle })}`);
    return await new Promise((resolve5) => {
      this.pendingUserInputs.set(requestId, {
        channelContext: params.channelContext,
        userId: params.userId,
        request: params.request,
        promptTitle: params.promptTitle,
        resolve: resolve5
      });
    });
  }
  userInputPromptTitle(questionIndex, questionCount) {
    const base = "DotCraft needs your input";
    return questionCount > 1 ? `${base} (${questionIndex + 1}/${questionCount})` : base;
  }
  async handleTextMessage(parameters, from, pusher, chatType) {
    const plainText = parameters.join(" ").trim();
    if (!plainText) {
      await pusher.pushText("\u8BF7\u8F93\u5165\u6D88\u606F\u5185\u5BB9");
      return;
    }
    const channelContext = `chat:${pusher.getChatId()}`;
    if (this.approvalReplies.tryResolve({ channelContext, userId: from.userId }, plainText)) {
      return;
    }
    if (await this.tryResolvePendingUserInput(plainText, from.userId, channelContext)) {
      return;
    }
    await this.runInboundMessage(plainText, from, pusher, [textPart(plainText)], chatType);
  }
  async handleCommonMessage(message, pusher) {
    const from = message.from ?? { userId: "", name: "", alias: "" };
    const inputParts = await this.buildInputParts(message);
    if (inputParts) {
      const text2 = message.msgType === WeComMsgType.Voice ? message.voice?.content ?? "[voice]" : `[${message.msgType}]`;
      await this.runInboundMessage(text2, from, pusher, inputParts, message.chatType);
      return;
    }
    let info = `\u6536\u5230 ${message.msgType} \u7C7B\u578B\u6D88\u606F`;
    if (message.msgType === WeComMsgType.Attachment) {
      info += `
CallbackId: ${message.attachment?.callbackId ?? ""}`;
    } else if (message.msgType === WeComMsgType.File) {
      info += `
\u6587\u4EF6URL: ${message.file?.url ?? ""}`;
    }
    await pusher.pushText(info);
  }
  async handleEventMessage(eventType, chatType, from, pusher) {
    const message = eventType === WeComEventType.AddToChat ? `\u6B22\u8FCE ${from.name} \u5C06\u6211\u6DFB\u52A0\u5230${chatType === WeComChatType.Group ? "\u7FA4\u804A" : "\u4F1A\u8BDD"}\uFF01\u8F93\u5165 /help \u67E5\u770B\u53EF\u7528\u547D\u4EE4\u3002` : eventType === WeComEventType.EnterChat ? `\u4F60\u597D\uFF0C${from.name}\uFF01\u6211\u662F DotCraft\uFF0C\u968F\u65F6\u4E3A\u60A8\u670D\u52A1\u3002\u8F93\u5165 /help \u67E5\u770B\u53EF\u7528\u547D\u4EE4\u3002` : eventType === WeComEventType.DeleteFromChat ? "\u518D\u89C1\uFF01" : null;
    if (message)
      await pusher.pushText(message);
    return null;
  }
  async runInboundMessage(text2, from, pusher, inputParts, chatType) {
    const chatId = pusher.getChatId();
    const channelContext = `chat:${chatId}`;
    const role = this.permission.getUserRole(from.userId, chatId);
    if (role === "unauthorized") {
      console.info(`[wecom] unauthorized user ${from.userId} ignored`);
      return;
    }
    const approver = { channelContext, userId: from.userId };
    if (this.approvalReplies.hasPending(approver) && !await this.isCommand(text2)) {
      await this.approvalReplies.remindIfPending(approver);
      return;
    }
    const senderName = from.name || from.alias || from.userId;
    this.lastSenderByContext.set(channelContext, from.userId);
    const chatKind = chatType === WeComChatType.Single ? "direct" : "group";
    this.chatKindByContext.set(channelContext, chatKind);
    if (chatKind === "direct" && from.userId)
      this.directChatByUser.set(from.userId, channelContext);
    await this.handleMessage({
      userId: channelContext,
      userName: senderName,
      text: text2,
      channelContext,
      directTarget: this.directChatByUser.get(from.userId),
      sender: {
        senderId: from.userId,
        senderName,
        senderRole: role,
        groupId: channelContext
      },
      inputParts
    });
  }
  async buildInputParts(message) {
    if (message.msgType === WeComMsgType.Image && message.image?.imageUrl) {
      const image = await this.downloadImageAsLocalPart(message.image.imageUrl);
      return image ? [image] : null;
    }
    if (message.msgType === WeComMsgType.Mixed && message.mixedMessage?.msgItems.length) {
      const parts = [];
      for (const item of message.mixedMessage.msgItems) {
        if (item.msgType === WeComMsgType.Text && item.text?.content)
          parts.push(textPart(item.text.content));
        if (item.msgType === WeComMsgType.Image && item.image?.imageUrl) {
          const image = await this.downloadImageAsLocalPart(item.image.imageUrl);
          if (image)
            parts.push(image);
        }
      }
      return parts.length > 0 ? parts : null;
    }
    if (message.msgType === WeComMsgType.Voice && message.voice?.content) {
      return [textPart(message.voice.content)];
    }
    return null;
  }
  async downloadImageAsLocalPart(url) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const mediaType = response.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
      return await saveInboundImage(this.context.craftPath, bytes, mediaType);
    } catch (error) {
      console.warn("[wecom] failed to download image:", error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  createPusher(target) {
    const pusher = this.resolvePusher(target);
    if (!pusher)
      throw new Error(`No WeCom webhook is available for target '${target}'.`);
    return pusher;
  }
  resolvePusher(target) {
    const chatId = parseWeComConversationId(target);
    const webhookUrl = chatId ? this.registry?.getWebhookUrl(chatId) : void 0;
    return chatId && webhookUrl ? new WeComPusher(chatId, webhookUrl) : null;
  }
  async tryResolvePendingUserInput(text2, userId, channelContext) {
    for (const [requestId, pending] of this.pendingUserInputs) {
      if (pending.userId !== userId || pending.channelContext !== channelContext) {
        continue;
      }
      if (await this.isCommand(text2))
        return false;
      const response = userInputResponseFromText(pending.request, text2);
      if (!response) {
        await this.createPusher(channelContext).pushText(buildUserInputPrompt(pending.request, { title: pending.promptTitle }));
        return true;
      }
      this.pendingUserInputs.delete(requestId);
      pending.resolve(response);
      return true;
    }
    return false;
  }
  resolveAllPendingUserInputs(response) {
    for (const [requestId, pending] of this.pendingUserInputs) {
      pending.resolve(response);
      this.pendingUserInputs.delete(requestId);
    }
  }
  cancelPendingUserInputsFor(channelContext, userId) {
    for (const [requestId, pending] of this.pendingUserInputs) {
      if (pending.channelContext !== channelContext || pending.userId !== userId) {
        continue;
      }
      pending.resolve(emptyUserInputResponse());
      this.pendingUserInputs.delete(requestId);
    }
  }
};
function asRecord4(value) {
  return value && typeof value === "object" ? value : {};
}
function parseWeComConversationId(channelContext) {
  const match = /^chat:(.+)$/.exec(channelContext.trim());
  return match?.[1]?.trim() || null;
}

// dist/module.js
function createModule(context) {
  const adapter = new WeComAdapter();
  return {
    start: () => adapter.startWithContext(context),
    stop: () => adapter.stop(),
    onStatusChange: (handler) => adapter.onStatusChange(handler),
    getStatus: () => adapter.getStatus(),
    getError: () => adapter.getError()
  };
}

// dist/cli.js
function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--workspace") {
      parsed.workspacePath = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === "--config") {
      parsed.configPath = argv[i + 1];
      i += 1;
    }
  }
  return parsed;
}
function waitForShutdownSignal() {
  return new Promise((resolveSignal) => {
    const onSigint = () => resolveSignal("SIGINT");
    const onSigterm = () => resolveSignal("SIGTERM");
    process.once("SIGINT", onSigint);
    process.once("SIGTERM", onSigterm);
  });
}
function logInfo(message) {
  if (process.env.DOTCRAFT_CHANNEL_TRANSPORT === "stdio") {
    console.error(message);
  } else {
    console.log(message);
  }
}
async function runWorkspaceMode(args) {
  if (!args.workspacePath)
    throw new Error("Missing value for --workspace.");
  const workspaceRoot = resolve4(args.workspacePath);
  const context = {
    workspaceRoot,
    craftPath: resolveHostedCraftPath(workspaceRoot),
    channelName: manifest.channelName,
    moduleId: manifest.moduleId,
    configOverridePath: args.configPath ? resolve4(args.configPath) : void 0
  };
  const instance = createModule(context);
  instance.onStatusChange((status2, error) => {
    logInfo(`[wecom] lifecycle=${status2}` + (error?.code ? ` code=${error.code}` : "") + (error?.message ? ` message=${error.message}` : ""));
  });
  await instance.start();
  const status = instance.getStatus();
  if (status === "configMissing" || status === "configInvalid") {
    console.error(JSON.stringify({ code: status, message: instance.getError()?.message ?? status }));
    process.exitCode = 1;
    return;
  }
  if (status === "stopped") {
    console.error(`[wecom] startup failed: ${instance.getError()?.message ?? "unknown error"}`);
    process.exitCode = 1;
    return;
  }
  const signal = await waitForShutdownSignal();
  logInfo(`[wecom] shutdown signal: ${signal}`);
  await instance.stop();
}
async function runFromCommandLine() {
  const args = parseArgs(process.argv.slice(2));
  try {
    await runWorkspaceMode(args);
  } catch (error) {
    console.error("[wecom] startup failed:", error);
    process.exit(1);
  }
}
void runFromCommandLine();
export {
  runFromCommandLine
};
