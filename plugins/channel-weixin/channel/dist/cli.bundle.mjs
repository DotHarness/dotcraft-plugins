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
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
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
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
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
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
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
    var { randomBytes: randomBytes3, createHash: createHash3 } = __require("crypto");
    var { Duplex, Readable } = __require("stream");
    var { URL: URL2 } = __require("url");
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
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
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
      const key = randomBytes3(16).toString("base64");
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
            addr = new URL2(location, address);
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
        const digest = createHash3("sha1").update(key + GUID).digest("base64");
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
    var { createHash: createHash3 } = __require("crypto");
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
        const digest = createHash3("sha1").update(key + GUID).digest("base64");
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

// ../../node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "../../node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// ../../node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "../../node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// ../../node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "../../node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// ../../node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "../../node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// ../../node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "../../node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// ../../node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "../../node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// ../../node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "../../node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// ../../node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "../../node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// ../../node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "../../node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
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
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// ../../node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "../../node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// ../../node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "../../node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// ../../node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "../../node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// ../../node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "../../node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// ../../node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "../../node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// ../../node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "../../node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// ../../node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "../../node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// ../../node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "../../node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// ../../node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "../../node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// ../../node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "../../node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// ../../node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "../../node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// ../../node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "../../node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// ../../node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "../../node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// ../../node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "../../node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// ../../node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "../../node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// ../../node_modules/pngjs/lib/chunkstream.js
var require_chunkstream = __commonJS({
  "../../node_modules/pngjs/lib/chunkstream.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var ChunkStream = module.exports = function() {
      Stream.call(this);
      this._buffers = [];
      this._buffered = 0;
      this._reads = [];
      this._paused = false;
      this._encoding = "utf8";
      this.writable = true;
    };
    util.inherits(ChunkStream, Stream);
    ChunkStream.prototype.read = function(length, callback) {
      this._reads.push({
        length: Math.abs(length),
        // if length < 0 then at most this length
        allowLess: length < 0,
        func: callback
      });
      process.nextTick(
        function() {
          this._process();
          if (this._paused && this._reads && this._reads.length > 0) {
            this._paused = false;
            this.emit("drain");
          }
        }.bind(this)
      );
    };
    ChunkStream.prototype.write = function(data, encoding) {
      if (!this.writable) {
        this.emit("error", new Error("Stream not writable"));
        return false;
      }
      let dataBuffer;
      if (Buffer.isBuffer(data)) {
        dataBuffer = data;
      } else {
        dataBuffer = Buffer.from(data, encoding || this._encoding);
      }
      this._buffers.push(dataBuffer);
      this._buffered += dataBuffer.length;
      this._process();
      if (this._reads && this._reads.length === 0) {
        this._paused = true;
      }
      return this.writable && !this._paused;
    };
    ChunkStream.prototype.end = function(data, encoding) {
      if (data) {
        this.write(data, encoding);
      }
      this.writable = false;
      if (!this._buffers) {
        return;
      }
      if (this._buffers.length === 0) {
        this._end();
      } else {
        this._buffers.push(null);
        this._process();
      }
    };
    ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;
    ChunkStream.prototype._end = function() {
      if (this._reads.length > 0) {
        this.emit("error", new Error("Unexpected end of input"));
      }
      this.destroy();
    };
    ChunkStream.prototype.destroy = function() {
      if (!this._buffers) {
        return;
      }
      this.writable = false;
      this._reads = null;
      this._buffers = null;
      this.emit("close");
    };
    ChunkStream.prototype._processReadAllowingLess = function(read) {
      this._reads.shift();
      let smallerBuf = this._buffers[0];
      if (smallerBuf.length > read.length) {
        this._buffered -= read.length;
        this._buffers[0] = smallerBuf.slice(read.length);
        read.func.call(this, smallerBuf.slice(0, read.length));
      } else {
        this._buffered -= smallerBuf.length;
        this._buffers.shift();
        read.func.call(this, smallerBuf);
      }
    };
    ChunkStream.prototype._processRead = function(read) {
      this._reads.shift();
      let pos = 0;
      let count = 0;
      let data = Buffer.alloc(read.length);
      while (pos < read.length) {
        let buf = this._buffers[count++];
        let len = Math.min(buf.length, read.length - pos);
        buf.copy(data, pos, 0, len);
        pos += len;
        if (len !== buf.length) {
          this._buffers[--count] = buf.slice(len);
        }
      }
      if (count > 0) {
        this._buffers.splice(0, count);
      }
      this._buffered -= read.length;
      read.func.call(this, data);
    };
    ChunkStream.prototype._process = function() {
      try {
        while (this._buffered > 0 && this._reads && this._reads.length > 0) {
          let read = this._reads[0];
          if (read.allowLess) {
            this._processReadAllowingLess(read);
          } else if (this._buffered >= read.length) {
            this._processRead(read);
          } else {
            break;
          }
        }
        if (this._buffers && !this.writable) {
          this._end();
        }
      } catch (ex) {
        this.emit("error", ex);
      }
    };
  }
});

// ../../node_modules/pngjs/lib/interlace.js
var require_interlace = __commonJS({
  "../../node_modules/pngjs/lib/interlace.js"(exports) {
    "use strict";
    var imagePasses = [
      {
        // pass 1 - 1px
        x: [0],
        y: [0]
      },
      {
        // pass 2 - 1px
        x: [4],
        y: [0]
      },
      {
        // pass 3 - 2px
        x: [0, 4],
        y: [4]
      },
      {
        // pass 4 - 4px
        x: [2, 6],
        y: [0, 4]
      },
      {
        // pass 5 - 8px
        x: [0, 2, 4, 6],
        y: [2, 6]
      },
      {
        // pass 6 - 16px
        x: [1, 3, 5, 7],
        y: [0, 2, 4, 6]
      },
      {
        // pass 7 - 32px
        x: [0, 1, 2, 3, 4, 5, 6, 7],
        y: [1, 3, 5, 7]
      }
    ];
    exports.getImagePasses = function(width, height) {
      let images = [];
      let xLeftOver = width % 8;
      let yLeftOver = height % 8;
      let xRepeats = (width - xLeftOver) / 8;
      let yRepeats = (height - yLeftOver) / 8;
      for (let i = 0; i < imagePasses.length; i++) {
        let pass = imagePasses[i];
        let passWidth = xRepeats * pass.x.length;
        let passHeight = yRepeats * pass.y.length;
        for (let j = 0; j < pass.x.length; j++) {
          if (pass.x[j] < xLeftOver) {
            passWidth++;
          } else {
            break;
          }
        }
        for (let j = 0; j < pass.y.length; j++) {
          if (pass.y[j] < yLeftOver) {
            passHeight++;
          } else {
            break;
          }
        }
        if (passWidth > 0 && passHeight > 0) {
          images.push({ width: passWidth, height: passHeight, index: i });
        }
      }
      return images;
    };
    exports.getInterlaceIterator = function(width) {
      return function(x, y, pass) {
        let outerXLeftOver = x % imagePasses[pass].x.length;
        let outerX = (x - outerXLeftOver) / imagePasses[pass].x.length * 8 + imagePasses[pass].x[outerXLeftOver];
        let outerYLeftOver = y % imagePasses[pass].y.length;
        let outerY = (y - outerYLeftOver) / imagePasses[pass].y.length * 8 + imagePasses[pass].y[outerYLeftOver];
        return outerX * 4 + outerY * width * 4;
      };
    };
  }
});

// ../../node_modules/pngjs/lib/paeth-predictor.js
var require_paeth_predictor = __commonJS({
  "../../node_modules/pngjs/lib/paeth-predictor.js"(exports, module) {
    "use strict";
    module.exports = function paethPredictor(left, above, upLeft) {
      let paeth = left + above - upLeft;
      let pLeft = Math.abs(paeth - left);
      let pAbove = Math.abs(paeth - above);
      let pUpLeft = Math.abs(paeth - upLeft);
      if (pLeft <= pAbove && pLeft <= pUpLeft) {
        return left;
      }
      if (pAbove <= pUpLeft) {
        return above;
      }
      return upLeft;
    };
  }
});

// ../../node_modules/pngjs/lib/filter-parse.js
var require_filter_parse = __commonJS({
  "../../node_modules/pngjs/lib/filter-parse.js"(exports, module) {
    "use strict";
    var interlaceUtils = require_interlace();
    var paethPredictor = require_paeth_predictor();
    function getByteWidth(width, bpp, depth) {
      let byteWidth = width * bpp;
      if (depth !== 8) {
        byteWidth = Math.ceil(byteWidth / (8 / depth));
      }
      return byteWidth;
    }
    var Filter = module.exports = function(bitmapInfo, dependencies) {
      let width = bitmapInfo.width;
      let height = bitmapInfo.height;
      let interlace = bitmapInfo.interlace;
      let bpp = bitmapInfo.bpp;
      let depth = bitmapInfo.depth;
      this.read = dependencies.read;
      this.write = dependencies.write;
      this.complete = dependencies.complete;
      this._imageIndex = 0;
      this._images = [];
      if (interlace) {
        let passes = interlaceUtils.getImagePasses(width, height);
        for (let i = 0; i < passes.length; i++) {
          this._images.push({
            byteWidth: getByteWidth(passes[i].width, bpp, depth),
            height: passes[i].height,
            lineIndex: 0
          });
        }
      } else {
        this._images.push({
          byteWidth: getByteWidth(width, bpp, depth),
          height,
          lineIndex: 0
        });
      }
      if (depth === 8) {
        this._xComparison = bpp;
      } else if (depth === 16) {
        this._xComparison = bpp * 2;
      } else {
        this._xComparison = 1;
      }
    };
    Filter.prototype.start = function() {
      this.read(
        this._images[this._imageIndex].byteWidth + 1,
        this._reverseFilterLine.bind(this)
      );
    };
    Filter.prototype._unFilterType1 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f1Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
        unfilteredLine[x] = rawByte + f1Left;
      }
    };
    Filter.prototype._unFilterType2 = function(rawData, unfilteredLine, byteWidth) {
      let lastLine = this._lastLine;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f2Up = lastLine ? lastLine[x] : 0;
        unfilteredLine[x] = rawByte + f2Up;
      }
    };
    Filter.prototype._unFilterType3 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      let lastLine = this._lastLine;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f3Up = lastLine ? lastLine[x] : 0;
        let f3Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
        let f3Add = Math.floor((f3Left + f3Up) / 2);
        unfilteredLine[x] = rawByte + f3Add;
      }
    };
    Filter.prototype._unFilterType4 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      let lastLine = this._lastLine;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f4Up = lastLine ? lastLine[x] : 0;
        let f4Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
        let f4UpLeft = x > xBiggerThan && lastLine ? lastLine[x - xComparison] : 0;
        let f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
        unfilteredLine[x] = rawByte + f4Add;
      }
    };
    Filter.prototype._reverseFilterLine = function(rawData) {
      let filter = rawData[0];
      let unfilteredLine;
      let currentImage = this._images[this._imageIndex];
      let byteWidth = currentImage.byteWidth;
      if (filter === 0) {
        unfilteredLine = rawData.slice(1, byteWidth + 1);
      } else {
        unfilteredLine = Buffer.alloc(byteWidth);
        switch (filter) {
          case 1:
            this._unFilterType1(rawData, unfilteredLine, byteWidth);
            break;
          case 2:
            this._unFilterType2(rawData, unfilteredLine, byteWidth);
            break;
          case 3:
            this._unFilterType3(rawData, unfilteredLine, byteWidth);
            break;
          case 4:
            this._unFilterType4(rawData, unfilteredLine, byteWidth);
            break;
          default:
            throw new Error("Unrecognised filter type - " + filter);
        }
      }
      this.write(unfilteredLine);
      currentImage.lineIndex++;
      if (currentImage.lineIndex >= currentImage.height) {
        this._lastLine = null;
        this._imageIndex++;
        currentImage = this._images[this._imageIndex];
      } else {
        this._lastLine = unfilteredLine;
      }
      if (currentImage) {
        this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this));
      } else {
        this._lastLine = null;
        this.complete();
      }
    };
  }
});

// ../../node_modules/pngjs/lib/filter-parse-async.js
var require_filter_parse_async = __commonJS({
  "../../node_modules/pngjs/lib/filter-parse-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var ChunkStream = require_chunkstream();
    var Filter = require_filter_parse();
    var FilterAsync = module.exports = function(bitmapInfo) {
      ChunkStream.call(this);
      let buffers = [];
      let that = this;
      this._filter = new Filter(bitmapInfo, {
        read: this.read.bind(this),
        write: function(buffer) {
          buffers.push(buffer);
        },
        complete: function() {
          that.emit("complete", Buffer.concat(buffers));
        }
      });
      this._filter.start();
    };
    util.inherits(FilterAsync, ChunkStream);
  }
});

// ../../node_modules/pngjs/lib/constants.js
var require_constants2 = __commonJS({
  "../../node_modules/pngjs/lib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
      TYPE_IHDR: 1229472850,
      TYPE_IEND: 1229278788,
      TYPE_IDAT: 1229209940,
      TYPE_PLTE: 1347179589,
      TYPE_tRNS: 1951551059,
      // eslint-disable-line camelcase
      TYPE_gAMA: 1732332865,
      // eslint-disable-line camelcase
      // color-type bits
      COLORTYPE_GRAYSCALE: 0,
      COLORTYPE_PALETTE: 1,
      COLORTYPE_COLOR: 2,
      COLORTYPE_ALPHA: 4,
      // e.g. grayscale and alpha
      // color-type combinations
      COLORTYPE_PALETTE_COLOR: 3,
      COLORTYPE_COLOR_ALPHA: 6,
      COLORTYPE_TO_BPP_MAP: {
        0: 1,
        2: 3,
        3: 1,
        4: 2,
        6: 4
      },
      GAMMA_DIVISION: 1e5
    };
  }
});

// ../../node_modules/pngjs/lib/crc.js
var require_crc = __commonJS({
  "../../node_modules/pngjs/lib/crc.js"(exports, module) {
    "use strict";
    var crcTable = [];
    (function() {
      for (let i = 0; i < 256; i++) {
        let currentCrc = i;
        for (let j = 0; j < 8; j++) {
          if (currentCrc & 1) {
            currentCrc = 3988292384 ^ currentCrc >>> 1;
          } else {
            currentCrc = currentCrc >>> 1;
          }
        }
        crcTable[i] = currentCrc;
      }
    })();
    var CrcCalculator = module.exports = function() {
      this._crc = -1;
    };
    CrcCalculator.prototype.write = function(data) {
      for (let i = 0; i < data.length; i++) {
        this._crc = crcTable[(this._crc ^ data[i]) & 255] ^ this._crc >>> 8;
      }
      return true;
    };
    CrcCalculator.prototype.crc32 = function() {
      return this._crc ^ -1;
    };
    CrcCalculator.crc32 = function(buf) {
      let crc = -1;
      for (let i = 0; i < buf.length; i++) {
        crc = crcTable[(crc ^ buf[i]) & 255] ^ crc >>> 8;
      }
      return crc ^ -1;
    };
  }
});

// ../../node_modules/pngjs/lib/parser.js
var require_parser = __commonJS({
  "../../node_modules/pngjs/lib/parser.js"(exports, module) {
    "use strict";
    var constants = require_constants2();
    var CrcCalculator = require_crc();
    var Parser = module.exports = function(options, dependencies) {
      this._options = options;
      options.checkCRC = options.checkCRC !== false;
      this._hasIHDR = false;
      this._hasIEND = false;
      this._emittedHeadersFinished = false;
      this._palette = [];
      this._colorType = 0;
      this._chunks = {};
      this._chunks[constants.TYPE_IHDR] = this._handleIHDR.bind(this);
      this._chunks[constants.TYPE_IEND] = this._handleIEND.bind(this);
      this._chunks[constants.TYPE_IDAT] = this._handleIDAT.bind(this);
      this._chunks[constants.TYPE_PLTE] = this._handlePLTE.bind(this);
      this._chunks[constants.TYPE_tRNS] = this._handleTRNS.bind(this);
      this._chunks[constants.TYPE_gAMA] = this._handleGAMA.bind(this);
      this.read = dependencies.read;
      this.error = dependencies.error;
      this.metadata = dependencies.metadata;
      this.gamma = dependencies.gamma;
      this.transColor = dependencies.transColor;
      this.palette = dependencies.palette;
      this.parsed = dependencies.parsed;
      this.inflateData = dependencies.inflateData;
      this.finished = dependencies.finished;
      this.simpleTransparency = dependencies.simpleTransparency;
      this.headersFinished = dependencies.headersFinished || function() {
      };
    };
    Parser.prototype.start = function() {
      this.read(constants.PNG_SIGNATURE.length, this._parseSignature.bind(this));
    };
    Parser.prototype._parseSignature = function(data) {
      let signature = constants.PNG_SIGNATURE;
      for (let i = 0; i < signature.length; i++) {
        if (data[i] !== signature[i]) {
          this.error(new Error("Invalid file signature"));
          return;
        }
      }
      this.read(8, this._parseChunkBegin.bind(this));
    };
    Parser.prototype._parseChunkBegin = function(data) {
      let length = data.readUInt32BE(0);
      let type = data.readUInt32BE(4);
      let name = "";
      for (let i = 4; i < 8; i++) {
        name += String.fromCharCode(data[i]);
      }
      let ancillary = Boolean(data[4] & 32);
      if (!this._hasIHDR && type !== constants.TYPE_IHDR) {
        this.error(new Error("Expected IHDR on beggining"));
        return;
      }
      this._crc = new CrcCalculator();
      this._crc.write(Buffer.from(name));
      if (this._chunks[type]) {
        return this._chunks[type](length);
      }
      if (!ancillary) {
        this.error(new Error("Unsupported critical chunk type " + name));
        return;
      }
      this.read(length + 4, this._skipChunk.bind(this));
    };
    Parser.prototype._skipChunk = function() {
      this.read(8, this._parseChunkBegin.bind(this));
    };
    Parser.prototype._handleChunkEnd = function() {
      this.read(4, this._parseChunkEnd.bind(this));
    };
    Parser.prototype._parseChunkEnd = function(data) {
      let fileCrc = data.readInt32BE(0);
      let calcCrc = this._crc.crc32();
      if (this._options.checkCRC && calcCrc !== fileCrc) {
        this.error(new Error("Crc error - " + fileCrc + " - " + calcCrc));
        return;
      }
      if (!this._hasIEND) {
        this.read(8, this._parseChunkBegin.bind(this));
      }
    };
    Parser.prototype._handleIHDR = function(length) {
      this.read(length, this._parseIHDR.bind(this));
    };
    Parser.prototype._parseIHDR = function(data) {
      this._crc.write(data);
      let width = data.readUInt32BE(0);
      let height = data.readUInt32BE(4);
      let depth = data[8];
      let colorType = data[9];
      let compr = data[10];
      let filter = data[11];
      let interlace = data[12];
      if (depth !== 8 && depth !== 4 && depth !== 2 && depth !== 1 && depth !== 16) {
        this.error(new Error("Unsupported bit depth " + depth));
        return;
      }
      if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
        this.error(new Error("Unsupported color type"));
        return;
      }
      if (compr !== 0) {
        this.error(new Error("Unsupported compression method"));
        return;
      }
      if (filter !== 0) {
        this.error(new Error("Unsupported filter method"));
        return;
      }
      if (interlace !== 0 && interlace !== 1) {
        this.error(new Error("Unsupported interlace method"));
        return;
      }
      this._colorType = colorType;
      let bpp = constants.COLORTYPE_TO_BPP_MAP[this._colorType];
      this._hasIHDR = true;
      this.metadata({
        width,
        height,
        depth,
        interlace: Boolean(interlace),
        palette: Boolean(colorType & constants.COLORTYPE_PALETTE),
        color: Boolean(colorType & constants.COLORTYPE_COLOR),
        alpha: Boolean(colorType & constants.COLORTYPE_ALPHA),
        bpp,
        colorType
      });
      this._handleChunkEnd();
    };
    Parser.prototype._handlePLTE = function(length) {
      this.read(length, this._parsePLTE.bind(this));
    };
    Parser.prototype._parsePLTE = function(data) {
      this._crc.write(data);
      let entries = Math.floor(data.length / 3);
      for (let i = 0; i < entries; i++) {
        this._palette.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2], 255]);
      }
      this.palette(this._palette);
      this._handleChunkEnd();
    };
    Parser.prototype._handleTRNS = function(length) {
      this.simpleTransparency();
      this.read(length, this._parseTRNS.bind(this));
    };
    Parser.prototype._parseTRNS = function(data) {
      this._crc.write(data);
      if (this._colorType === constants.COLORTYPE_PALETTE_COLOR) {
        if (this._palette.length === 0) {
          this.error(new Error("Transparency chunk must be after palette"));
          return;
        }
        if (data.length > this._palette.length) {
          this.error(new Error("More transparent colors than palette size"));
          return;
        }
        for (let i = 0; i < data.length; i++) {
          this._palette[i][3] = data[i];
        }
        this.palette(this._palette);
      }
      if (this._colorType === constants.COLORTYPE_GRAYSCALE) {
        this.transColor([data.readUInt16BE(0)]);
      }
      if (this._colorType === constants.COLORTYPE_COLOR) {
        this.transColor([
          data.readUInt16BE(0),
          data.readUInt16BE(2),
          data.readUInt16BE(4)
        ]);
      }
      this._handleChunkEnd();
    };
    Parser.prototype._handleGAMA = function(length) {
      this.read(length, this._parseGAMA.bind(this));
    };
    Parser.prototype._parseGAMA = function(data) {
      this._crc.write(data);
      this.gamma(data.readUInt32BE(0) / constants.GAMMA_DIVISION);
      this._handleChunkEnd();
    };
    Parser.prototype._handleIDAT = function(length) {
      if (!this._emittedHeadersFinished) {
        this._emittedHeadersFinished = true;
        this.headersFinished();
      }
      this.read(-length, this._parseIDAT.bind(this, length));
    };
    Parser.prototype._parseIDAT = function(length, data) {
      this._crc.write(data);
      if (this._colorType === constants.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) {
        throw new Error("Expected palette not found");
      }
      this.inflateData(data);
      let leftOverLength = length - data.length;
      if (leftOverLength > 0) {
        this._handleIDAT(leftOverLength);
      } else {
        this._handleChunkEnd();
      }
    };
    Parser.prototype._handleIEND = function(length) {
      this.read(length, this._parseIEND.bind(this));
    };
    Parser.prototype._parseIEND = function(data) {
      this._crc.write(data);
      this._hasIEND = true;
      this._handleChunkEnd();
      if (this.finished) {
        this.finished();
      }
    };
  }
});

// ../../node_modules/pngjs/lib/bitmapper.js
var require_bitmapper = __commonJS({
  "../../node_modules/pngjs/lib/bitmapper.js"(exports) {
    "use strict";
    var interlaceUtils = require_interlace();
    var pixelBppMapper = [
      // 0 - dummy entry
      function() {
      },
      // 1 - L
      // 0: 0, 1: 0, 2: 0, 3: 0xff
      function(pxData, data, pxPos, rawPos) {
        if (rawPos === data.length) {
          throw new Error("Ran out of data");
        }
        let pixel = data[rawPos];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = 255;
      },
      // 2 - LA
      // 0: 0, 1: 0, 2: 0, 3: 1
      function(pxData, data, pxPos, rawPos) {
        if (rawPos + 1 >= data.length) {
          throw new Error("Ran out of data");
        }
        let pixel = data[rawPos];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = data[rawPos + 1];
      },
      // 3 - RGB
      // 0: 0, 1: 1, 2: 2, 3: 0xff
      function(pxData, data, pxPos, rawPos) {
        if (rawPos + 2 >= data.length) {
          throw new Error("Ran out of data");
        }
        pxData[pxPos] = data[rawPos];
        pxData[pxPos + 1] = data[rawPos + 1];
        pxData[pxPos + 2] = data[rawPos + 2];
        pxData[pxPos + 3] = 255;
      },
      // 4 - RGBA
      // 0: 0, 1: 1, 2: 2, 3: 3
      function(pxData, data, pxPos, rawPos) {
        if (rawPos + 3 >= data.length) {
          throw new Error("Ran out of data");
        }
        pxData[pxPos] = data[rawPos];
        pxData[pxPos + 1] = data[rawPos + 1];
        pxData[pxPos + 2] = data[rawPos + 2];
        pxData[pxPos + 3] = data[rawPos + 3];
      }
    ];
    var pixelBppCustomMapper = [
      // 0 - dummy entry
      function() {
      },
      // 1 - L
      // 0: 0, 1: 0, 2: 0, 3: 0xff
      function(pxData, pixelData, pxPos, maxBit) {
        let pixel = pixelData[0];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = maxBit;
      },
      // 2 - LA
      // 0: 0, 1: 0, 2: 0, 3: 1
      function(pxData, pixelData, pxPos) {
        let pixel = pixelData[0];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = pixelData[1];
      },
      // 3 - RGB
      // 0: 0, 1: 1, 2: 2, 3: 0xff
      function(pxData, pixelData, pxPos, maxBit) {
        pxData[pxPos] = pixelData[0];
        pxData[pxPos + 1] = pixelData[1];
        pxData[pxPos + 2] = pixelData[2];
        pxData[pxPos + 3] = maxBit;
      },
      // 4 - RGBA
      // 0: 0, 1: 1, 2: 2, 3: 3
      function(pxData, pixelData, pxPos) {
        pxData[pxPos] = pixelData[0];
        pxData[pxPos + 1] = pixelData[1];
        pxData[pxPos + 2] = pixelData[2];
        pxData[pxPos + 3] = pixelData[3];
      }
    ];
    function bitRetriever(data, depth) {
      let leftOver = [];
      let i = 0;
      function split() {
        if (i === data.length) {
          throw new Error("Ran out of data");
        }
        let byte = data[i];
        i++;
        let byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
        switch (depth) {
          default:
            throw new Error("unrecognised depth");
          case 16:
            byte2 = data[i];
            i++;
            leftOver.push((byte << 8) + byte2);
            break;
          case 4:
            byte2 = byte & 15;
            byte1 = byte >> 4;
            leftOver.push(byte1, byte2);
            break;
          case 2:
            byte4 = byte & 3;
            byte3 = byte >> 2 & 3;
            byte2 = byte >> 4 & 3;
            byte1 = byte >> 6 & 3;
            leftOver.push(byte1, byte2, byte3, byte4);
            break;
          case 1:
            byte8 = byte & 1;
            byte7 = byte >> 1 & 1;
            byte6 = byte >> 2 & 1;
            byte5 = byte >> 3 & 1;
            byte4 = byte >> 4 & 1;
            byte3 = byte >> 5 & 1;
            byte2 = byte >> 6 & 1;
            byte1 = byte >> 7 & 1;
            leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
            break;
        }
      }
      return {
        get: function(count) {
          while (leftOver.length < count) {
            split();
          }
          let returner = leftOver.slice(0, count);
          leftOver = leftOver.slice(count);
          return returner;
        },
        resetAfterLine: function() {
          leftOver.length = 0;
        },
        end: function() {
          if (i !== data.length) {
            throw new Error("extra data found");
          }
        }
      };
    }
    function mapImage8Bit(image, pxData, getPxPos, bpp, data, rawPos) {
      let imageWidth = image.width;
      let imageHeight = image.height;
      let imagePass = image.index;
      for (let y = 0; y < imageHeight; y++) {
        for (let x = 0; x < imageWidth; x++) {
          let pxPos = getPxPos(x, y, imagePass);
          pixelBppMapper[bpp](pxData, data, pxPos, rawPos);
          rawPos += bpp;
        }
      }
      return rawPos;
    }
    function mapImageCustomBit(image, pxData, getPxPos, bpp, bits, maxBit) {
      let imageWidth = image.width;
      let imageHeight = image.height;
      let imagePass = image.index;
      for (let y = 0; y < imageHeight; y++) {
        for (let x = 0; x < imageWidth; x++) {
          let pixelData = bits.get(bpp);
          let pxPos = getPxPos(x, y, imagePass);
          pixelBppCustomMapper[bpp](pxData, pixelData, pxPos, maxBit);
        }
        bits.resetAfterLine();
      }
    }
    exports.dataToBitMap = function(data, bitmapInfo) {
      let width = bitmapInfo.width;
      let height = bitmapInfo.height;
      let depth = bitmapInfo.depth;
      let bpp = bitmapInfo.bpp;
      let interlace = bitmapInfo.interlace;
      let bits;
      if (depth !== 8) {
        bits = bitRetriever(data, depth);
      }
      let pxData;
      if (depth <= 8) {
        pxData = Buffer.alloc(width * height * 4);
      } else {
        pxData = new Uint16Array(width * height * 4);
      }
      let maxBit = Math.pow(2, depth) - 1;
      let rawPos = 0;
      let images;
      let getPxPos;
      if (interlace) {
        images = interlaceUtils.getImagePasses(width, height);
        getPxPos = interlaceUtils.getInterlaceIterator(width, height);
      } else {
        let nonInterlacedPxPos = 0;
        getPxPos = function() {
          let returner = nonInterlacedPxPos;
          nonInterlacedPxPos += 4;
          return returner;
        };
        images = [{ width, height }];
      }
      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        if (depth === 8) {
          rawPos = mapImage8Bit(
            images[imageIndex],
            pxData,
            getPxPos,
            bpp,
            data,
            rawPos
          );
        } else {
          mapImageCustomBit(
            images[imageIndex],
            pxData,
            getPxPos,
            bpp,
            bits,
            maxBit
          );
        }
      }
      if (depth === 8) {
        if (rawPos !== data.length) {
          throw new Error("extra data found");
        }
      } else {
        bits.end();
      }
      return pxData;
    };
  }
});

// ../../node_modules/pngjs/lib/format-normaliser.js
var require_format_normaliser = __commonJS({
  "../../node_modules/pngjs/lib/format-normaliser.js"(exports, module) {
    "use strict";
    function dePalette(indata, outdata, width, height, palette) {
      let pxPos = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let color = palette[indata[pxPos]];
          if (!color) {
            throw new Error("index " + indata[pxPos] + " not in palette");
          }
          for (let i = 0; i < 4; i++) {
            outdata[pxPos + i] = color[i];
          }
          pxPos += 4;
        }
      }
    }
    function replaceTransparentColor(indata, outdata, width, height, transColor) {
      let pxPos = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let makeTrans = false;
          if (transColor.length === 1) {
            if (transColor[0] === indata[pxPos]) {
              makeTrans = true;
            }
          } else if (transColor[0] === indata[pxPos] && transColor[1] === indata[pxPos + 1] && transColor[2] === indata[pxPos + 2]) {
            makeTrans = true;
          }
          if (makeTrans) {
            for (let i = 0; i < 4; i++) {
              outdata[pxPos + i] = 0;
            }
          }
          pxPos += 4;
        }
      }
    }
    function scaleDepth(indata, outdata, width, height, depth) {
      let maxOutSample = 255;
      let maxInSample = Math.pow(2, depth) - 1;
      let pxPos = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          for (let i = 0; i < 4; i++) {
            outdata[pxPos + i] = Math.floor(
              indata[pxPos + i] * maxOutSample / maxInSample + 0.5
            );
          }
          pxPos += 4;
        }
      }
    }
    module.exports = function(indata, imageData) {
      let depth = imageData.depth;
      let width = imageData.width;
      let height = imageData.height;
      let colorType = imageData.colorType;
      let transColor = imageData.transColor;
      let palette = imageData.palette;
      let outdata = indata;
      if (colorType === 3) {
        dePalette(indata, outdata, width, height, palette);
      } else {
        if (transColor) {
          replaceTransparentColor(indata, outdata, width, height, transColor);
        }
        if (depth !== 8) {
          if (depth === 16) {
            outdata = Buffer.alloc(width * height * 4);
          }
          scaleDepth(indata, outdata, width, height, depth);
        }
      }
      return outdata;
    };
  }
});

// ../../node_modules/pngjs/lib/parser-async.js
var require_parser_async = __commonJS({
  "../../node_modules/pngjs/lib/parser-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var zlib = __require("zlib");
    var ChunkStream = require_chunkstream();
    var FilterAsync = require_filter_parse_async();
    var Parser = require_parser();
    var bitmapper = require_bitmapper();
    var formatNormaliser = require_format_normaliser();
    var ParserAsync = module.exports = function(options) {
      ChunkStream.call(this);
      this._parser = new Parser(options, {
        read: this.read.bind(this),
        error: this._handleError.bind(this),
        metadata: this._handleMetaData.bind(this),
        gamma: this.emit.bind(this, "gamma"),
        palette: this._handlePalette.bind(this),
        transColor: this._handleTransColor.bind(this),
        finished: this._finished.bind(this),
        inflateData: this._inflateData.bind(this),
        simpleTransparency: this._simpleTransparency.bind(this),
        headersFinished: this._headersFinished.bind(this)
      });
      this._options = options;
      this.writable = true;
      this._parser.start();
    };
    util.inherits(ParserAsync, ChunkStream);
    ParserAsync.prototype._handleError = function(err) {
      this.emit("error", err);
      this.writable = false;
      this.destroy();
      if (this._inflate && this._inflate.destroy) {
        this._inflate.destroy();
      }
      if (this._filter) {
        this._filter.destroy();
        this._filter.on("error", function() {
        });
      }
      this.errord = true;
    };
    ParserAsync.prototype._inflateData = function(data) {
      if (!this._inflate) {
        if (this._bitmapInfo.interlace) {
          this._inflate = zlib.createInflate();
          this._inflate.on("error", this.emit.bind(this, "error"));
          this._filter.on("complete", this._complete.bind(this));
          this._inflate.pipe(this._filter);
        } else {
          let rowSize = (this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1;
          let imageSize = rowSize * this._bitmapInfo.height;
          let chunkSize = Math.max(imageSize, zlib.Z_MIN_CHUNK);
          this._inflate = zlib.createInflate({ chunkSize });
          let leftToInflate = imageSize;
          let emitError = this.emit.bind(this, "error");
          this._inflate.on("error", function(err) {
            if (!leftToInflate) {
              return;
            }
            emitError(err);
          });
          this._filter.on("complete", this._complete.bind(this));
          let filterWrite = this._filter.write.bind(this._filter);
          this._inflate.on("data", function(chunk) {
            if (!leftToInflate) {
              return;
            }
            if (chunk.length > leftToInflate) {
              chunk = chunk.slice(0, leftToInflate);
            }
            leftToInflate -= chunk.length;
            filterWrite(chunk);
          });
          this._inflate.on("end", this._filter.end.bind(this._filter));
        }
      }
      this._inflate.write(data);
    };
    ParserAsync.prototype._handleMetaData = function(metaData) {
      this._metaData = metaData;
      this._bitmapInfo = Object.create(metaData);
      this._filter = new FilterAsync(this._bitmapInfo);
    };
    ParserAsync.prototype._handleTransColor = function(transColor) {
      this._bitmapInfo.transColor = transColor;
    };
    ParserAsync.prototype._handlePalette = function(palette) {
      this._bitmapInfo.palette = palette;
    };
    ParserAsync.prototype._simpleTransparency = function() {
      this._metaData.alpha = true;
    };
    ParserAsync.prototype._headersFinished = function() {
      this.emit("metadata", this._metaData);
    };
    ParserAsync.prototype._finished = function() {
      if (this.errord) {
        return;
      }
      if (!this._inflate) {
        this.emit("error", "No Inflate block");
      } else {
        this._inflate.end();
      }
    };
    ParserAsync.prototype._complete = function(filteredData) {
      if (this.errord) {
        return;
      }
      let normalisedBitmapData;
      try {
        let bitmapData = bitmapper.dataToBitMap(filteredData, this._bitmapInfo);
        normalisedBitmapData = formatNormaliser(bitmapData, this._bitmapInfo);
        bitmapData = null;
      } catch (ex) {
        this._handleError(ex);
        return;
      }
      this.emit("parsed", normalisedBitmapData);
    };
  }
});

// ../../node_modules/pngjs/lib/bitpacker.js
var require_bitpacker = __commonJS({
  "../../node_modules/pngjs/lib/bitpacker.js"(exports, module) {
    "use strict";
    var constants = require_constants2();
    module.exports = function(dataIn, width, height, options) {
      let outHasAlpha = [constants.COLORTYPE_COLOR_ALPHA, constants.COLORTYPE_ALPHA].indexOf(
        options.colorType
      ) !== -1;
      if (options.colorType === options.inputColorType) {
        let bigEndian = (function() {
          let buffer = new ArrayBuffer(2);
          new DataView(buffer).setInt16(
            0,
            256,
            true
            /* littleEndian */
          );
          return new Int16Array(buffer)[0] !== 256;
        })();
        if (options.bitDepth === 8 || options.bitDepth === 16 && bigEndian) {
          return dataIn;
        }
      }
      let data = options.bitDepth !== 16 ? dataIn : new Uint16Array(dataIn.buffer);
      let maxValue = 255;
      let inBpp = constants.COLORTYPE_TO_BPP_MAP[options.inputColorType];
      if (inBpp === 4 && !options.inputHasAlpha) {
        inBpp = 3;
      }
      let outBpp = constants.COLORTYPE_TO_BPP_MAP[options.colorType];
      if (options.bitDepth === 16) {
        maxValue = 65535;
        outBpp *= 2;
      }
      let outData = Buffer.alloc(width * height * outBpp);
      let inIndex = 0;
      let outIndex = 0;
      let bgColor = options.bgColor || {};
      if (bgColor.red === void 0) {
        bgColor.red = maxValue;
      }
      if (bgColor.green === void 0) {
        bgColor.green = maxValue;
      }
      if (bgColor.blue === void 0) {
        bgColor.blue = maxValue;
      }
      function getRGBA() {
        let red;
        let green;
        let blue;
        let alpha = maxValue;
        switch (options.inputColorType) {
          case constants.COLORTYPE_COLOR_ALPHA:
            alpha = data[inIndex + 3];
            red = data[inIndex];
            green = data[inIndex + 1];
            blue = data[inIndex + 2];
            break;
          case constants.COLORTYPE_COLOR:
            red = data[inIndex];
            green = data[inIndex + 1];
            blue = data[inIndex + 2];
            break;
          case constants.COLORTYPE_ALPHA:
            alpha = data[inIndex + 1];
            red = data[inIndex];
            green = red;
            blue = red;
            break;
          case constants.COLORTYPE_GRAYSCALE:
            red = data[inIndex];
            green = red;
            blue = red;
            break;
          default:
            throw new Error(
              "input color type:" + options.inputColorType + " is not supported at present"
            );
        }
        if (options.inputHasAlpha) {
          if (!outHasAlpha) {
            alpha /= maxValue;
            red = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0),
              maxValue
            );
            green = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0),
              maxValue
            );
            blue = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0),
              maxValue
            );
          }
        }
        return { red, green, blue, alpha };
      }
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let rgba = getRGBA(data, inIndex);
          switch (options.colorType) {
            case constants.COLORTYPE_COLOR_ALPHA:
            case constants.COLORTYPE_COLOR:
              if (options.bitDepth === 8) {
                outData[outIndex] = rgba.red;
                outData[outIndex + 1] = rgba.green;
                outData[outIndex + 2] = rgba.blue;
                if (outHasAlpha) {
                  outData[outIndex + 3] = rgba.alpha;
                }
              } else {
                outData.writeUInt16BE(rgba.red, outIndex);
                outData.writeUInt16BE(rgba.green, outIndex + 2);
                outData.writeUInt16BE(rgba.blue, outIndex + 4);
                if (outHasAlpha) {
                  outData.writeUInt16BE(rgba.alpha, outIndex + 6);
                }
              }
              break;
            case constants.COLORTYPE_ALPHA:
            case constants.COLORTYPE_GRAYSCALE: {
              let grayscale = (rgba.red + rgba.green + rgba.blue) / 3;
              if (options.bitDepth === 8) {
                outData[outIndex] = grayscale;
                if (outHasAlpha) {
                  outData[outIndex + 1] = rgba.alpha;
                }
              } else {
                outData.writeUInt16BE(grayscale, outIndex);
                if (outHasAlpha) {
                  outData.writeUInt16BE(rgba.alpha, outIndex + 2);
                }
              }
              break;
            }
            default:
              throw new Error("unrecognised color Type " + options.colorType);
          }
          inIndex += inBpp;
          outIndex += outBpp;
        }
      }
      return outData;
    };
  }
});

// ../../node_modules/pngjs/lib/filter-pack.js
var require_filter_pack = __commonJS({
  "../../node_modules/pngjs/lib/filter-pack.js"(exports, module) {
    "use strict";
    var paethPredictor = require_paeth_predictor();
    function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
      for (let x = 0; x < byteWidth; x++) {
        rawData[rawPos + x] = pxData[pxPos + x];
      }
    }
    function filterSumNone(pxData, pxPos, byteWidth) {
      let sum = 0;
      let length = pxPos + byteWidth;
      for (let i = pxPos; i < length; i++) {
        sum += Math.abs(pxData[i]);
      }
      return sum;
    }
    function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let val = pxData[pxPos + x] - left;
        rawData[rawPos + x] = val;
      }
    }
    function filterSumSub(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let val = pxData[pxPos + x] - left;
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
      for (let x = 0; x < byteWidth; x++) {
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let val = pxData[pxPos + x] - up;
        rawData[rawPos + x] = val;
      }
    }
    function filterSumUp(pxData, pxPos, byteWidth) {
      let sum = 0;
      let length = pxPos + byteWidth;
      for (let x = pxPos; x < length; x++) {
        let up = pxPos > 0 ? pxData[x - byteWidth] : 0;
        let val = pxData[x] - up;
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let val = pxData[pxPos + x] - (left + up >> 1);
        rawData[rawPos + x] = val;
      }
    }
    function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let val = pxData[pxPos + x] - (left + up >> 1);
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
        let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
        rawData[rawPos + x] = val;
      }
    }
    function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
        let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
        sum += Math.abs(val);
      }
      return sum;
    }
    var filters = {
      0: filterNone,
      1: filterSub,
      2: filterUp,
      3: filterAvg,
      4: filterPaeth
    };
    var filterSums = {
      0: filterSumNone,
      1: filterSumSub,
      2: filterSumUp,
      3: filterSumAvg,
      4: filterSumPaeth
    };
    module.exports = function(pxData, width, height, options, bpp) {
      let filterTypes;
      if (!("filterType" in options) || options.filterType === -1) {
        filterTypes = [0, 1, 2, 3, 4];
      } else if (typeof options.filterType === "number") {
        filterTypes = [options.filterType];
      } else {
        throw new Error("unrecognised filter types");
      }
      if (options.bitDepth === 16) {
        bpp *= 2;
      }
      let byteWidth = width * bpp;
      let rawPos = 0;
      let pxPos = 0;
      let rawData = Buffer.alloc((byteWidth + 1) * height);
      let sel = filterTypes[0];
      for (let y = 0; y < height; y++) {
        if (filterTypes.length > 1) {
          let min = Infinity;
          for (let i = 0; i < filterTypes.length; i++) {
            let sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
            if (sum < min) {
              sel = filterTypes[i];
              min = sum;
            }
          }
        }
        rawData[rawPos] = sel;
        rawPos++;
        filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
        rawPos += byteWidth;
        pxPos += byteWidth;
      }
      return rawData;
    };
  }
});

// ../../node_modules/pngjs/lib/packer.js
var require_packer = __commonJS({
  "../../node_modules/pngjs/lib/packer.js"(exports, module) {
    "use strict";
    var constants = require_constants2();
    var CrcStream = require_crc();
    var bitPacker = require_bitpacker();
    var filter = require_filter_pack();
    var zlib = __require("zlib");
    var Packer = module.exports = function(options) {
      this._options = options;
      options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
      options.deflateLevel = options.deflateLevel != null ? options.deflateLevel : 9;
      options.deflateStrategy = options.deflateStrategy != null ? options.deflateStrategy : 3;
      options.inputHasAlpha = options.inputHasAlpha != null ? options.inputHasAlpha : true;
      options.deflateFactory = options.deflateFactory || zlib.createDeflate;
      options.bitDepth = options.bitDepth || 8;
      options.colorType = typeof options.colorType === "number" ? options.colorType : constants.COLORTYPE_COLOR_ALPHA;
      options.inputColorType = typeof options.inputColorType === "number" ? options.inputColorType : constants.COLORTYPE_COLOR_ALPHA;
      if ([
        constants.COLORTYPE_GRAYSCALE,
        constants.COLORTYPE_COLOR,
        constants.COLORTYPE_COLOR_ALPHA,
        constants.COLORTYPE_ALPHA
      ].indexOf(options.colorType) === -1) {
        throw new Error(
          "option color type:" + options.colorType + " is not supported at present"
        );
      }
      if ([
        constants.COLORTYPE_GRAYSCALE,
        constants.COLORTYPE_COLOR,
        constants.COLORTYPE_COLOR_ALPHA,
        constants.COLORTYPE_ALPHA
      ].indexOf(options.inputColorType) === -1) {
        throw new Error(
          "option input color type:" + options.inputColorType + " is not supported at present"
        );
      }
      if (options.bitDepth !== 8 && options.bitDepth !== 16) {
        throw new Error(
          "option bit depth:" + options.bitDepth + " is not supported at present"
        );
      }
    };
    Packer.prototype.getDeflateOptions = function() {
      return {
        chunkSize: this._options.deflateChunkSize,
        level: this._options.deflateLevel,
        strategy: this._options.deflateStrategy
      };
    };
    Packer.prototype.createDeflate = function() {
      return this._options.deflateFactory(this.getDeflateOptions());
    };
    Packer.prototype.filterData = function(data, width, height) {
      let packedData = bitPacker(data, width, height, this._options);
      let bpp = constants.COLORTYPE_TO_BPP_MAP[this._options.colorType];
      let filteredData = filter(packedData, width, height, this._options, bpp);
      return filteredData;
    };
    Packer.prototype._packChunk = function(type, data) {
      let len = data ? data.length : 0;
      let buf = Buffer.alloc(len + 12);
      buf.writeUInt32BE(len, 0);
      buf.writeUInt32BE(type, 4);
      if (data) {
        data.copy(buf, 8);
      }
      buf.writeInt32BE(
        CrcStream.crc32(buf.slice(4, buf.length - 4)),
        buf.length - 4
      );
      return buf;
    };
    Packer.prototype.packGAMA = function(gamma) {
      let buf = Buffer.alloc(4);
      buf.writeUInt32BE(Math.floor(gamma * constants.GAMMA_DIVISION), 0);
      return this._packChunk(constants.TYPE_gAMA, buf);
    };
    Packer.prototype.packIHDR = function(width, height) {
      let buf = Buffer.alloc(13);
      buf.writeUInt32BE(width, 0);
      buf.writeUInt32BE(height, 4);
      buf[8] = this._options.bitDepth;
      buf[9] = this._options.colorType;
      buf[10] = 0;
      buf[11] = 0;
      buf[12] = 0;
      return this._packChunk(constants.TYPE_IHDR, buf);
    };
    Packer.prototype.packIDAT = function(data) {
      return this._packChunk(constants.TYPE_IDAT, data);
    };
    Packer.prototype.packIEND = function() {
      return this._packChunk(constants.TYPE_IEND, null);
    };
  }
});

// ../../node_modules/pngjs/lib/packer-async.js
var require_packer_async = __commonJS({
  "../../node_modules/pngjs/lib/packer-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var constants = require_constants2();
    var Packer = require_packer();
    var PackerAsync = module.exports = function(opt) {
      Stream.call(this);
      let options = opt || {};
      this._packer = new Packer(options);
      this._deflate = this._packer.createDeflate();
      this.readable = true;
    };
    util.inherits(PackerAsync, Stream);
    PackerAsync.prototype.pack = function(data, width, height, gamma) {
      this.emit("data", Buffer.from(constants.PNG_SIGNATURE));
      this.emit("data", this._packer.packIHDR(width, height));
      if (gamma) {
        this.emit("data", this._packer.packGAMA(gamma));
      }
      let filteredData = this._packer.filterData(data, width, height);
      this._deflate.on("error", this.emit.bind(this, "error"));
      this._deflate.on(
        "data",
        function(compressedData) {
          this.emit("data", this._packer.packIDAT(compressedData));
        }.bind(this)
      );
      this._deflate.on(
        "end",
        function() {
          this.emit("data", this._packer.packIEND());
          this.emit("end");
        }.bind(this)
      );
      this._deflate.end(filteredData);
    };
  }
});

// ../../node_modules/pngjs/lib/sync-inflate.js
var require_sync_inflate = __commonJS({
  "../../node_modules/pngjs/lib/sync-inflate.js"(exports, module) {
    "use strict";
    var assert = __require("assert").ok;
    var zlib = __require("zlib");
    var util = __require("util");
    var kMaxLength = __require("buffer").kMaxLength;
    function Inflate(opts) {
      if (!(this instanceof Inflate)) {
        return new Inflate(opts);
      }
      if (opts && opts.chunkSize < zlib.Z_MIN_CHUNK) {
        opts.chunkSize = zlib.Z_MIN_CHUNK;
      }
      zlib.Inflate.call(this, opts);
      this._offset = this._offset === void 0 ? this._outOffset : this._offset;
      this._buffer = this._buffer || this._outBuffer;
      if (opts && opts.maxLength != null) {
        this._maxLength = opts.maxLength;
      }
    }
    function createInflate(opts) {
      return new Inflate(opts);
    }
    function _close(engine, callback) {
      if (callback) {
        process.nextTick(callback);
      }
      if (!engine._handle) {
        return;
      }
      engine._handle.close();
      engine._handle = null;
    }
    Inflate.prototype._processChunk = function(chunk, flushFlag, asyncCb) {
      if (typeof asyncCb === "function") {
        return zlib.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
      }
      let self = this;
      let availInBefore = chunk && chunk.length;
      let availOutBefore = this._chunkSize - this._offset;
      let leftToInflate = this._maxLength;
      let inOff = 0;
      let buffers = [];
      let nread = 0;
      let error;
      this.on("error", function(err) {
        error = err;
      });
      function handleChunk(availInAfter, availOutAfter) {
        if (self._hadError) {
          return;
        }
        let have = availOutBefore - availOutAfter;
        assert(have >= 0, "have should not go down");
        if (have > 0) {
          let out = self._buffer.slice(self._offset, self._offset + have);
          self._offset += have;
          if (out.length > leftToInflate) {
            out = out.slice(0, leftToInflate);
          }
          buffers.push(out);
          nread += out.length;
          leftToInflate -= out.length;
          if (leftToInflate === 0) {
            return false;
          }
        }
        if (availOutAfter === 0 || self._offset >= self._chunkSize) {
          availOutBefore = self._chunkSize;
          self._offset = 0;
          self._buffer = Buffer.allocUnsafe(self._chunkSize);
        }
        if (availOutAfter === 0) {
          inOff += availInBefore - availInAfter;
          availInBefore = availInAfter;
          return true;
        }
        return false;
      }
      assert(this._handle, "zlib binding closed");
      let res;
      do {
        res = this._handle.writeSync(
          flushFlag,
          chunk,
          // in
          inOff,
          // in_off
          availInBefore,
          // in_len
          this._buffer,
          // out
          this._offset,
          //out_off
          availOutBefore
        );
        res = res || this._writeState;
      } while (!this._hadError && handleChunk(res[0], res[1]));
      if (this._hadError) {
        throw error;
      }
      if (nread >= kMaxLength) {
        _close(this);
        throw new RangeError(
          "Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + " bytes"
        );
      }
      let buf = Buffer.concat(buffers, nread);
      _close(this);
      return buf;
    };
    util.inherits(Inflate, zlib.Inflate);
    function zlibBufferSync(engine, buffer) {
      if (typeof buffer === "string") {
        buffer = Buffer.from(buffer);
      }
      if (!(buffer instanceof Buffer)) {
        throw new TypeError("Not a string or buffer");
      }
      let flushFlag = engine._finishFlushFlag;
      if (flushFlag == null) {
        flushFlag = zlib.Z_FINISH;
      }
      return engine._processChunk(buffer, flushFlag);
    }
    function inflateSync(buffer, opts) {
      return zlibBufferSync(new Inflate(opts), buffer);
    }
    module.exports = exports = inflateSync;
    exports.Inflate = Inflate;
    exports.createInflate = createInflate;
    exports.inflateSync = inflateSync;
  }
});

// ../../node_modules/pngjs/lib/sync-reader.js
var require_sync_reader = __commonJS({
  "../../node_modules/pngjs/lib/sync-reader.js"(exports, module) {
    "use strict";
    var SyncReader = module.exports = function(buffer) {
      this._buffer = buffer;
      this._reads = [];
    };
    SyncReader.prototype.read = function(length, callback) {
      this._reads.push({
        length: Math.abs(length),
        // if length < 0 then at most this length
        allowLess: length < 0,
        func: callback
      });
    };
    SyncReader.prototype.process = function() {
      while (this._reads.length > 0 && this._buffer.length) {
        let read = this._reads[0];
        if (this._buffer.length && (this._buffer.length >= read.length || read.allowLess)) {
          this._reads.shift();
          let buf = this._buffer;
          this._buffer = buf.slice(read.length);
          read.func.call(this, buf.slice(0, read.length));
        } else {
          break;
        }
      }
      if (this._reads.length > 0) {
        return new Error("There are some read requests waitng on finished stream");
      }
      if (this._buffer.length > 0) {
        return new Error("unrecognised content at end of stream");
      }
    };
  }
});

// ../../node_modules/pngjs/lib/filter-parse-sync.js
var require_filter_parse_sync = __commonJS({
  "../../node_modules/pngjs/lib/filter-parse-sync.js"(exports) {
    "use strict";
    var SyncReader = require_sync_reader();
    var Filter = require_filter_parse();
    exports.process = function(inBuffer, bitmapInfo) {
      let outBuffers = [];
      let reader = new SyncReader(inBuffer);
      let filter = new Filter(bitmapInfo, {
        read: reader.read.bind(reader),
        write: function(bufferPart) {
          outBuffers.push(bufferPart);
        },
        complete: function() {
        }
      });
      filter.start();
      reader.process();
      return Buffer.concat(outBuffers);
    };
  }
});

// ../../node_modules/pngjs/lib/parser-sync.js
var require_parser_sync = __commonJS({
  "../../node_modules/pngjs/lib/parser-sync.js"(exports, module) {
    "use strict";
    var hasSyncZlib = true;
    var zlib = __require("zlib");
    var inflateSync = require_sync_inflate();
    if (!zlib.deflateSync) {
      hasSyncZlib = false;
    }
    var SyncReader = require_sync_reader();
    var FilterSync = require_filter_parse_sync();
    var Parser = require_parser();
    var bitmapper = require_bitmapper();
    var formatNormaliser = require_format_normaliser();
    module.exports = function(buffer, options) {
      if (!hasSyncZlib) {
        throw new Error(
          "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
        );
      }
      let err;
      function handleError(_err_) {
        err = _err_;
      }
      let metaData;
      function handleMetaData(_metaData_) {
        metaData = _metaData_;
      }
      function handleTransColor(transColor) {
        metaData.transColor = transColor;
      }
      function handlePalette(palette) {
        metaData.palette = palette;
      }
      function handleSimpleTransparency() {
        metaData.alpha = true;
      }
      let gamma;
      function handleGamma(_gamma_) {
        gamma = _gamma_;
      }
      let inflateDataList = [];
      function handleInflateData(inflatedData2) {
        inflateDataList.push(inflatedData2);
      }
      let reader = new SyncReader(buffer);
      let parser = new Parser(options, {
        read: reader.read.bind(reader),
        error: handleError,
        metadata: handleMetaData,
        gamma: handleGamma,
        palette: handlePalette,
        transColor: handleTransColor,
        inflateData: handleInflateData,
        simpleTransparency: handleSimpleTransparency
      });
      parser.start();
      reader.process();
      if (err) {
        throw err;
      }
      let inflateData = Buffer.concat(inflateDataList);
      inflateDataList.length = 0;
      let inflatedData;
      if (metaData.interlace) {
        inflatedData = zlib.inflateSync(inflateData);
      } else {
        let rowSize = (metaData.width * metaData.bpp * metaData.depth + 7 >> 3) + 1;
        let imageSize = rowSize * metaData.height;
        inflatedData = inflateSync(inflateData, {
          chunkSize: imageSize,
          maxLength: imageSize
        });
      }
      inflateData = null;
      if (!inflatedData || !inflatedData.length) {
        throw new Error("bad png - invalid inflate data response");
      }
      let unfilteredData = FilterSync.process(inflatedData, metaData);
      inflateData = null;
      let bitmapData = bitmapper.dataToBitMap(unfilteredData, metaData);
      unfilteredData = null;
      let normalisedBitmapData = formatNormaliser(bitmapData, metaData);
      metaData.data = normalisedBitmapData;
      metaData.gamma = gamma || 0;
      return metaData;
    };
  }
});

// ../../node_modules/pngjs/lib/packer-sync.js
var require_packer_sync = __commonJS({
  "../../node_modules/pngjs/lib/packer-sync.js"(exports, module) {
    "use strict";
    var hasSyncZlib = true;
    var zlib = __require("zlib");
    if (!zlib.deflateSync) {
      hasSyncZlib = false;
    }
    var constants = require_constants2();
    var Packer = require_packer();
    module.exports = function(metaData, opt) {
      if (!hasSyncZlib) {
        throw new Error(
          "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
        );
      }
      let options = opt || {};
      let packer = new Packer(options);
      let chunks = [];
      chunks.push(Buffer.from(constants.PNG_SIGNATURE));
      chunks.push(packer.packIHDR(metaData.width, metaData.height));
      if (metaData.gamma) {
        chunks.push(packer.packGAMA(metaData.gamma));
      }
      let filteredData = packer.filterData(
        metaData.data,
        metaData.width,
        metaData.height
      );
      let compressedData = zlib.deflateSync(
        filteredData,
        packer.getDeflateOptions()
      );
      filteredData = null;
      if (!compressedData || !compressedData.length) {
        throw new Error("bad png - invalid compressed data response");
      }
      chunks.push(packer.packIDAT(compressedData));
      chunks.push(packer.packIEND());
      return Buffer.concat(chunks);
    };
  }
});

// ../../node_modules/pngjs/lib/png-sync.js
var require_png_sync = __commonJS({
  "../../node_modules/pngjs/lib/png-sync.js"(exports) {
    "use strict";
    var parse = require_parser_sync();
    var pack = require_packer_sync();
    exports.read = function(buffer, options) {
      return parse(buffer, options || {});
    };
    exports.write = function(png, options) {
      return pack(png, options);
    };
  }
});

// ../../node_modules/pngjs/lib/png.js
var require_png = __commonJS({
  "../../node_modules/pngjs/lib/png.js"(exports) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var Parser = require_parser_async();
    var Packer = require_packer_async();
    var PNGSync = require_png_sync();
    var PNG = exports.PNG = function(options) {
      Stream.call(this);
      options = options || {};
      this.width = options.width | 0;
      this.height = options.height | 0;
      this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null;
      if (options.fill && this.data) {
        this.data.fill(0);
      }
      this.gamma = 0;
      this.readable = this.writable = true;
      this._parser = new Parser(options);
      this._parser.on("error", this.emit.bind(this, "error"));
      this._parser.on("close", this._handleClose.bind(this));
      this._parser.on("metadata", this._metadata.bind(this));
      this._parser.on("gamma", this._gamma.bind(this));
      this._parser.on(
        "parsed",
        function(data) {
          this.data = data;
          this.emit("parsed", data);
        }.bind(this)
      );
      this._packer = new Packer(options);
      this._packer.on("data", this.emit.bind(this, "data"));
      this._packer.on("end", this.emit.bind(this, "end"));
      this._parser.on("close", this._handleClose.bind(this));
      this._packer.on("error", this.emit.bind(this, "error"));
    };
    util.inherits(PNG, Stream);
    PNG.sync = PNGSync;
    PNG.prototype.pack = function() {
      if (!this.data || !this.data.length) {
        this.emit("error", "No data provided");
        return this;
      }
      process.nextTick(
        function() {
          this._packer.pack(this.data, this.width, this.height, this.gamma);
        }.bind(this)
      );
      return this;
    };
    PNG.prototype.parse = function(data, callback) {
      if (callback) {
        let onParsed, onError;
        onParsed = function(parsedData) {
          this.removeListener("error", onError);
          this.data = parsedData;
          callback(null, this);
        }.bind(this);
        onError = function(err) {
          this.removeListener("parsed", onParsed);
          callback(err, null);
        }.bind(this);
        this.once("parsed", onParsed);
        this.once("error", onError);
      }
      this.end(data);
      return this;
    };
    PNG.prototype.write = function(data) {
      this._parser.write(data);
      return true;
    };
    PNG.prototype.end = function(data) {
      this._parser.end(data);
    };
    PNG.prototype._metadata = function(metadata) {
      this.width = metadata.width;
      this.height = metadata.height;
      this.emit("metadata", metadata);
    };
    PNG.prototype._gamma = function(gamma) {
      this.gamma = gamma;
    };
    PNG.prototype._handleClose = function() {
      if (!this._parser.writable && !this._packer.readable) {
        this.emit("close");
      }
    };
    PNG.bitblt = function(src, dst, srcX, srcY, width, height, deltaX, deltaY) {
      srcX |= 0;
      srcY |= 0;
      width |= 0;
      height |= 0;
      deltaX |= 0;
      deltaY |= 0;
      if (srcX > src.width || srcY > src.height || srcX + width > src.width || srcY + height > src.height) {
        throw new Error("bitblt reading outside image");
      }
      if (deltaX > dst.width || deltaY > dst.height || deltaX + width > dst.width || deltaY + height > dst.height) {
        throw new Error("bitblt writing outside image");
      }
      for (let y = 0; y < height; y++) {
        src.data.copy(
          dst.data,
          (deltaY + y) * dst.width + deltaX << 2,
          (srcY + y) * src.width + srcX << 2,
          (srcY + y) * src.width + srcX + width << 2
        );
      }
    };
    PNG.prototype.bitblt = function(dst, srcX, srcY, width, height, deltaX, deltaY) {
      PNG.bitblt(this, dst, srcX, srcY, width, height, deltaX, deltaY);
      return this;
    };
    PNG.adjustGamma = function(src) {
      if (src.gamma) {
        for (let y = 0; y < src.height; y++) {
          for (let x = 0; x < src.width; x++) {
            let idx = src.width * y + x << 2;
            for (let i = 0; i < 3; i++) {
              let sample = src.data[idx + i] / 255;
              sample = Math.pow(sample, 1 / 2.2 / src.gamma);
              src.data[idx + i] = Math.round(sample * 255);
            }
          }
        }
        src.gamma = 0;
      }
    };
    PNG.prototype.adjustGamma = function() {
      PNG.adjustGamma(this);
    };
  }
});

// ../../node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "../../node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// ../../node_modules/qrcode/lib/renderer/png.js
var require_png2 = __commonJS({
  "../../node_modules/qrcode/lib/renderer/png.js"(exports) {
    var fs = __require("fs");
    var PNG = require_png().PNG;
    var Utils = require_utils2();
    exports.render = function render(qrData, options) {
      const opts = Utils.getOptions(options);
      const pngOpts = opts.rendererOpts;
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      pngOpts.width = size;
      pngOpts.height = size;
      const pngImage = new PNG(pngOpts);
      Utils.qrToImageData(pngImage.data, qrData, opts);
      return pngImage;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      exports.renderToBuffer(qrData, options, function(err, output) {
        if (err) cb(err);
        let url = "data:image/png;base64,";
        url += output.toString("base64");
        cb(null, url);
      });
    };
    exports.renderToBuffer = function renderToBuffer(qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      const png = exports.render(qrData, options);
      const buffer = [];
      png.on("error", cb);
      png.on("data", function(data) {
        buffer.push(data);
      });
      png.on("end", function() {
        cb(null, Buffer.concat(buffer));
      });
      png.pack();
    };
    exports.renderToFile = function renderToFile(path, qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      let called = false;
      const done = (...args) => {
        if (called) return;
        called = true;
        cb.apply(null, args);
      };
      const stream = fs.createWriteStream(path);
      stream.on("error", done);
      stream.on("close", done);
      exports.renderToFileStream(stream, qrData, options);
    };
    exports.renderToFileStream = function renderToFileStream(stream, qrData, options) {
      const png = exports.render(qrData, options);
      png.pack().pipe(stream);
    };
  }
});

// ../../node_modules/qrcode/lib/renderer/utf8.js
var require_utf8 = __commonJS({
  "../../node_modules/qrcode/lib/renderer/utf8.js"(exports) {
    var Utils = require_utils2();
    var BLOCK_CHAR = {
      WW: " ",
      WB: "\u2584",
      BB: "\u2588",
      BW: "\u2580"
    };
    var INVERTED_BLOCK_CHAR = {
      BB: " ",
      BW: "\u2584",
      WW: "\u2588",
      WB: "\u2580"
    };
    function getBlockChar(top, bottom, blocks) {
      if (top && bottom) return blocks.BB;
      if (top && !bottom) return blocks.BW;
      if (!top && bottom) return blocks.WB;
      return blocks.WW;
    }
    exports.render = function(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      let blocks = BLOCK_CHAR;
      if (opts.color.dark.hex === "#ffffff" || opts.color.light.hex === "#000000") {
        blocks = INVERTED_BLOCK_CHAR;
      }
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      let output = "";
      let hMargin = Array(size + opts.margin * 2 + 1).join(blocks.WW);
      hMargin = Array(opts.margin / 2 + 1).join(hMargin + "\n");
      const vMargin = Array(opts.margin + 1).join(blocks.WW);
      output += hMargin;
      for (let i = 0; i < size; i += 2) {
        output += vMargin;
        for (let j = 0; j < size; j++) {
          const topModule = data[i * size + j];
          const bottomModule = data[(i + 1) * size + j];
          output += getBlockChar(topModule, bottomModule, blocks);
        }
        output += vMargin + "\n";
      }
      output += hMargin.slice(0, -1);
      if (typeof cb === "function") {
        cb(null, output);
      }
      return output;
    };
    exports.renderToFile = function renderToFile(path, qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      const fs = __require("fs");
      const utf8 = exports.render(qrData, options);
      fs.writeFile(path, utf8, cb);
    };
  }
});

// ../../node_modules/qrcode/lib/renderer/terminal/terminal.js
var require_terminal = __commonJS({
  "../../node_modules/qrcode/lib/renderer/terminal/terminal.js"(exports) {
    exports.render = function(qrData, options, cb) {
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const black = "\x1B[40m  \x1B[0m";
      const white = "\x1B[47m  \x1B[0m";
      let output = "";
      const hMargin = Array(size + 3).join(white);
      const vMargin = Array(2).join(white);
      output += hMargin + "\n";
      for (let i = 0; i < size; ++i) {
        output += white;
        for (let j = 0; j < size; j++) {
          output += data[i * size + j] ? black : white;
        }
        output += vMargin + "\n";
      }
      output += hMargin + "\n";
      if (typeof cb === "function") {
        cb(null, output);
      }
      return output;
    };
  }
});

// ../../node_modules/qrcode/lib/renderer/terminal/terminal-small.js
var require_terminal_small = __commonJS({
  "../../node_modules/qrcode/lib/renderer/terminal/terminal-small.js"(exports) {
    var backgroundWhite = "\x1B[47m";
    var backgroundBlack = "\x1B[40m";
    var foregroundWhite = "\x1B[37m";
    var foregroundBlack = "\x1B[30m";
    var reset = "\x1B[0m";
    var lineSetupNormal = backgroundWhite + foregroundBlack;
    var lineSetupInverse = backgroundBlack + foregroundWhite;
    var createPalette = function(lineSetup, foregroundWhite2, foregroundBlack2) {
      return {
        // 1 ... white, 2 ... black, 0 ... transparent (default)
        "00": reset + " " + lineSetup,
        "01": reset + foregroundWhite2 + "\u2584" + lineSetup,
        "02": reset + foregroundBlack2 + "\u2584" + lineSetup,
        10: reset + foregroundWhite2 + "\u2580" + lineSetup,
        11: " ",
        12: "\u2584",
        20: reset + foregroundBlack2 + "\u2580" + lineSetup,
        21: "\u2580",
        22: "\u2588"
      };
    };
    var mkCodePixel = function(modules, size, x, y) {
      const sizePlus = size + 1;
      if (x >= sizePlus || y >= sizePlus || y < -1 || x < -1) return "0";
      if (x >= size || y >= size || y < 0 || x < 0) return "1";
      const idx = y * size + x;
      return modules[idx] ? "2" : "1";
    };
    var mkCode = function(modules, size, x, y) {
      return mkCodePixel(modules, size, x, y) + mkCodePixel(modules, size, x, y + 1);
    };
    exports.render = function(qrData, options, cb) {
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const inverse = !!(options && options.inverse);
      const lineSetup = options && options.inverse ? lineSetupInverse : lineSetupNormal;
      const white = inverse ? foregroundBlack : foregroundWhite;
      const black = inverse ? foregroundWhite : foregroundBlack;
      const palette = createPalette(lineSetup, white, black);
      const newLine = reset + "\n" + lineSetup;
      let output = lineSetup;
      for (let y = -1; y < size + 1; y += 2) {
        for (let x = -1; x < size; x++) {
          output += palette[mkCode(data, size, x, y)];
        }
        output += palette[mkCode(data, size, size, y)] + newLine;
      }
      output += reset;
      if (typeof cb === "function") {
        cb(null, output);
      }
      return output;
    };
  }
});

// ../../node_modules/qrcode/lib/renderer/terminal.js
var require_terminal2 = __commonJS({
  "../../node_modules/qrcode/lib/renderer/terminal.js"(exports) {
    var big = require_terminal();
    var small = require_terminal_small();
    exports.render = function(qrData, options, cb) {
      if (options && options.small) {
        return small.render(qrData, options, cb);
      }
      return big.render(qrData, options, cb);
    };
  }
});

// ../../node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "../../node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// ../../node_modules/qrcode/lib/renderer/svg.js
var require_svg = __commonJS({
  "../../node_modules/qrcode/lib/renderer/svg.js"(exports) {
    var svgTagRenderer = require_svg_tag();
    exports.render = svgTagRenderer.render;
    exports.renderToFile = function renderToFile(path, qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      const fs = __require("fs");
      const svgTag = exports.render(qrData, options);
      const xmlStr = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + svgTag;
      fs.writeFile(path, xmlStr, cb);
    };
  }
});

// ../../node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "../../node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// ../../node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "../../node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve5, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve5(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// ../../node_modules/qrcode/lib/server.js
var require_server = __commonJS({
  "../../node_modules/qrcode/lib/server.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var PngRenderer = require_png2();
    var Utf8Renderer = require_utf8();
    var TerminalRenderer = require_terminal2();
    var SvgRenderer = require_svg();
    function checkParams(text, opts, cb) {
      if (typeof text === "undefined") {
        throw new Error("String required as first argument");
      }
      if (typeof cb === "undefined") {
        cb = opts;
        opts = {};
      }
      if (typeof cb !== "function") {
        if (!canPromise()) {
          throw new Error("Callback required as last argument");
        } else {
          opts = cb || {};
          cb = null;
        }
      }
      return {
        opts,
        cb
      };
    }
    function getTypeFromFilename(path) {
      return path.slice((path.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
    }
    function getRendererFromType(type) {
      switch (type) {
        case "svg":
          return SvgRenderer;
        case "txt":
        case "utf8":
          return Utf8Renderer;
        case "png":
        case "image/png":
        default:
          return PngRenderer;
      }
    }
    function getStringRendererFromType(type) {
      switch (type) {
        case "svg":
          return SvgRenderer;
        case "terminal":
          return TerminalRenderer;
        case "utf8":
        default:
          return Utf8Renderer;
      }
    }
    function render(renderFunc, text, params) {
      if (!params.cb) {
        return new Promise(function(resolve5, reject) {
          try {
            const data = QRCode2.create(text, params.opts);
            return renderFunc(data, params.opts, function(err, data2) {
              return err ? reject(err) : resolve5(data2);
            });
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, params.opts);
        return renderFunc(data, params.opts, params.cb);
      } catch (e) {
        params.cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = require_browser().toCanvas;
    exports.toString = function toString(text, opts, cb) {
      const params = checkParams(text, opts, cb);
      const type = params.opts ? params.opts.type : void 0;
      const renderer = getStringRendererFromType(type);
      return render(renderer.render, text, params);
    };
    exports.toDataURL = function toDataURL(text, opts, cb) {
      const params = checkParams(text, opts, cb);
      const renderer = getRendererFromType(params.opts.type);
      return render(renderer.renderToDataURL, text, params);
    };
    exports.toBuffer = function toBuffer(text, opts, cb) {
      const params = checkParams(text, opts, cb);
      const renderer = getRendererFromType(params.opts.type);
      return render(renderer.renderToBuffer, text, params);
    };
    exports.toFile = function toFile(path, text, opts, cb) {
      if (typeof path !== "string" || !(typeof text === "string" || typeof text === "object")) {
        throw new Error("Invalid argument");
      }
      if (arguments.length < 3 && !canPromise()) {
        throw new Error("Too few arguments provided");
      }
      const params = checkParams(text, opts, cb);
      const type = params.opts.type || getTypeFromFilename(path);
      const renderer = getRendererFromType(type);
      const renderToFile = renderer.renderToFile.bind(null, path);
      return render(renderToFile, text, params);
    };
    exports.toFileStream = function toFileStream(stream, text, opts) {
      if (arguments.length < 2) {
        throw new Error("Too few arguments provided");
      }
      const params = checkParams(text, opts, stream.emit.bind(stream, "error"));
      const renderer = getRendererFromType("png");
      const renderToFileStream = renderer.renderToFileStream.bind(null, stream);
      render(renderToFileStream, text, params);
    };
  }
});

// ../../node_modules/qrcode/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/qrcode/lib/index.js"(exports, module) {
    module.exports = require_server();
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/QRMode.js
var require_QRMode = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/QRMode.js"(exports, module) {
    module.exports = {
      MODE_NUMBER: 1 << 0,
      MODE_ALPHA_NUM: 1 << 1,
      MODE_8BIT_BYTE: 1 << 2,
      MODE_KANJI: 1 << 3
    };
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/QR8bitByte.js
var require_QR8bitByte = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/QR8bitByte.js"(exports, module) {
    var QRMode = require_QRMode();
    function QR8bitByte(data) {
      this.mode = QRMode.MODE_8BIT_BYTE;
      this.data = data;
    }
    QR8bitByte.prototype = {
      getLength: function() {
        return this.data.length;
      },
      write: function(buffer) {
        for (var i = 0; i < this.data.length; i++) {
          buffer.put(this.data.charCodeAt(i), 8);
        }
      }
    };
    module.exports = QR8bitByte;
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/QRMath.js
var require_QRMath = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/QRMath.js"(exports, module) {
    var QRMath = {
      glog: function(n) {
        if (n < 1) {
          throw new Error("glog(" + n + ")");
        }
        return QRMath.LOG_TABLE[n];
      },
      gexp: function(n) {
        while (n < 0) {
          n += 255;
        }
        while (n >= 256) {
          n -= 255;
        }
        return QRMath.EXP_TABLE[n];
      },
      EXP_TABLE: new Array(256),
      LOG_TABLE: new Array(256)
    };
    for (i = 0; i < 8; i++) {
      QRMath.EXP_TABLE[i] = 1 << i;
    }
    var i;
    for (i = 8; i < 256; i++) {
      QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    }
    var i;
    for (i = 0; i < 255; i++) {
      QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    }
    var i;
    module.exports = QRMath;
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/QRPolynomial.js
var require_QRPolynomial = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/QRPolynomial.js"(exports, module) {
    var QRMath = require_QRMath();
    function QRPolynomial(num, shift) {
      if (num.length === void 0) {
        throw new Error(num.length + "/" + shift);
      }
      var offset = 0;
      while (offset < num.length && num[offset] === 0) {
        offset++;
      }
      this.num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i++) {
        this.num[i] = num[i + offset];
      }
    }
    QRPolynomial.prototype = {
      get: function(index) {
        return this.num[index];
      },
      getLength: function() {
        return this.num.length;
      },
      multiply: function(e) {
        var num = new Array(this.getLength() + e.getLength() - 1);
        for (var i = 0; i < this.getLength(); i++) {
          for (var j = 0; j < e.getLength(); j++) {
            num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
          }
        }
        return new QRPolynomial(num, 0);
      },
      mod: function(e) {
        if (this.getLength() - e.getLength() < 0) {
          return this;
        }
        var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
        var num = new Array(this.getLength());
        for (var i = 0; i < this.getLength(); i++) {
          num[i] = this.get(i);
        }
        for (var x = 0; x < e.getLength(); x++) {
          num[x] ^= QRMath.gexp(QRMath.glog(e.get(x)) + ratio);
        }
        return new QRPolynomial(num, 0).mod(e);
      }
    };
    module.exports = QRPolynomial;
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/QRMaskPattern.js
var require_QRMaskPattern = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/QRMaskPattern.js"(exports, module) {
    module.exports = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/QRUtil.js
var require_QRUtil = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/QRUtil.js"(exports, module) {
    var QRMode = require_QRMode();
    var QRPolynomial = require_QRPolynomial();
    var QRMath = require_QRMath();
    var QRMaskPattern = require_QRMaskPattern();
    var QRUtil = {
      PATTERN_POSITION_TABLE: [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
      ],
      G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0,
      G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0,
      G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1,
      getBCHTypeInfo: function(data) {
        var d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
          d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
        }
        return (data << 10 | d) ^ QRUtil.G15_MASK;
      },
      getBCHTypeNumber: function(data) {
        var d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
          d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
        }
        return data << 12 | d;
      },
      getBCHDigit: function(data) {
        var digit = 0;
        while (data !== 0) {
          digit++;
          data >>>= 1;
        }
        return digit;
      },
      getPatternPosition: function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
      },
      getMask: function(maskPattern, i, j) {
        switch (maskPattern) {
          case QRMaskPattern.PATTERN000:
            return (i + j) % 2 === 0;
          case QRMaskPattern.PATTERN001:
            return i % 2 === 0;
          case QRMaskPattern.PATTERN010:
            return j % 3 === 0;
          case QRMaskPattern.PATTERN011:
            return (i + j) % 3 === 0;
          case QRMaskPattern.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
          case QRMaskPattern.PATTERN101:
            return i * j % 2 + i * j % 3 === 0;
          case QRMaskPattern.PATTERN110:
            return (i * j % 2 + i * j % 3) % 2 === 0;
          case QRMaskPattern.PATTERN111:
            return (i * j % 3 + (i + j) % 2) % 2 === 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      },
      getErrorCorrectPolynomial: function(errorCorrectLength) {
        var a = new QRPolynomial([1], 0);
        for (var i = 0; i < errorCorrectLength; i++) {
          a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
        }
        return a;
      },
      getLengthInBits: function(mode, type) {
        if (1 <= type && type < 10) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 10;
            case QRMode.MODE_ALPHA_NUM:
              return 9;
            case QRMode.MODE_8BIT_BYTE:
              return 8;
            case QRMode.MODE_KANJI:
              return 8;
            default:
              throw new Error("mode:" + mode);
          }
        } else if (type < 27) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 12;
            case QRMode.MODE_ALPHA_NUM:
              return 11;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 10;
            default:
              throw new Error("mode:" + mode);
          }
        } else if (type < 41) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 14;
            case QRMode.MODE_ALPHA_NUM:
              return 13;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 12;
            default:
              throw new Error("mode:" + mode);
          }
        } else {
          throw new Error("type:" + type);
        }
      },
      getLostPoint: function(qrCode) {
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        var row = 0;
        var col = 0;
        for (row = 0; row < moduleCount; row++) {
          for (col = 0; col < moduleCount; col++) {
            var sameCount = 0;
            var dark = qrCode.isDark(row, col);
            for (var r = -1; r <= 1; r++) {
              if (row + r < 0 || moduleCount <= row + r) {
                continue;
              }
              for (var c = -1; c <= 1; c++) {
                if (col + c < 0 || moduleCount <= col + c) {
                  continue;
                }
                if (r === 0 && c === 0) {
                  continue;
                }
                if (dark === qrCode.isDark(row + r, col + c)) {
                  sameCount++;
                }
              }
            }
            if (sameCount > 5) {
              lostPoint += 3 + sameCount - 5;
            }
          }
        }
        for (row = 0; row < moduleCount - 1; row++) {
          for (col = 0; col < moduleCount - 1; col++) {
            var count = 0;
            if (qrCode.isDark(row, col)) count++;
            if (qrCode.isDark(row + 1, col)) count++;
            if (qrCode.isDark(row, col + 1)) count++;
            if (qrCode.isDark(row + 1, col + 1)) count++;
            if (count === 0 || count === 4) {
              lostPoint += 3;
            }
          }
        }
        for (row = 0; row < moduleCount; row++) {
          for (col = 0; col < moduleCount - 6; col++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
              lostPoint += 40;
            }
          }
        }
        for (col = 0; col < moduleCount; col++) {
          for (row = 0; row < moduleCount - 6; row++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
              lostPoint += 40;
            }
          }
        }
        var darkCount = 0;
        for (col = 0; col < moduleCount; col++) {
          for (row = 0; row < moduleCount; row++) {
            if (qrCode.isDark(row, col)) {
              darkCount++;
            }
          }
        }
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;
        return lostPoint;
      }
    };
    module.exports = QRUtil;
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js
var require_QRErrorCorrectLevel = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js"(exports, module) {
    module.exports = {
      L: 1,
      M: 0,
      Q: 3,
      H: 2
    };
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/QRRSBlock.js
var require_QRRSBlock = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/QRRSBlock.js"(exports, module) {
    var QRErrorCorrectLevel = require_QRErrorCorrectLevel();
    function QRRSBlock(totalCount, dataCount) {
      this.totalCount = totalCount;
      this.dataCount = dataCount;
    }
    QRRSBlock.RS_BLOCK_TABLE = [
      // L
      // M
      // Q
      // H
      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],
      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],
      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],
      // 4		
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],
      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],
      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],
      // 7		
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],
      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],
      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],
      // 10		
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],
      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],
      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],
      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],
      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],
      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12],
      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],
      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],
      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],
      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],
      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],
      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],
      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],
      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],
      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],
      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],
      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],
      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],
      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],
      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],
      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],
      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],
      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],
      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],
      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],
      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],
      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],
      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],
      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],
      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],
      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];
    QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
      var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
      if (rsBlock === void 0) {
        throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
      }
      var length = rsBlock.length / 3;
      var list = [];
      for (var i = 0; i < length; i++) {
        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];
        for (var j = 0; j < count; j++) {
          list.push(new QRRSBlock(totalCount, dataCount));
        }
      }
      return list;
    };
    QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
      switch (errorCorrectLevel) {
        case QRErrorCorrectLevel.L:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
        case QRErrorCorrectLevel.M:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
        case QRErrorCorrectLevel.Q:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
        case QRErrorCorrectLevel.H:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    module.exports = QRRSBlock;
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/QRBitBuffer.js
var require_QRBitBuffer = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/QRBitBuffer.js"(exports, module) {
    function QRBitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    QRBitBuffer.prototype = {
      get: function(index) {
        var bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
      },
      put: function(num, length) {
        for (var i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) == 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        var bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = QRBitBuffer;
  }
});

// ../../node_modules/qrcode-terminal/vendor/QRCode/index.js
var require_QRCode = __commonJS({
  "../../node_modules/qrcode-terminal/vendor/QRCode/index.js"(exports, module) {
    var QR8bitByte = require_QR8bitByte();
    var QRUtil = require_QRUtil();
    var QRPolynomial = require_QRPolynomial();
    var QRRSBlock = require_QRRSBlock();
    var QRBitBuffer = require_QRBitBuffer();
    function QRCode2(typeNumber, errorCorrectLevel) {
      this.typeNumber = typeNumber;
      this.errorCorrectLevel = errorCorrectLevel;
      this.modules = null;
      this.moduleCount = 0;
      this.dataCache = null;
      this.dataList = [];
    }
    QRCode2.prototype = {
      addData: function(data) {
        var newData = new QR8bitByte(data);
        this.dataList.push(newData);
        this.dataCache = null;
      },
      isDark: function(row, col) {
        if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
          throw new Error(row + "," + col);
        }
        return this.modules[row][col];
      },
      getModuleCount: function() {
        return this.moduleCount;
      },
      make: function() {
        if (this.typeNumber < 1) {
          var typeNumber = 1;
          for (typeNumber = 1; typeNumber < 40; typeNumber++) {
            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);
            var buffer = new QRBitBuffer();
            var totalDataCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) {
              totalDataCount += rsBlocks[i].dataCount;
            }
            for (var x = 0; x < this.dataList.length; x++) {
              var data = this.dataList[x];
              buffer.put(data.mode, 4);
              buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
              data.write(buffer);
            }
            if (buffer.getLengthInBits() <= totalDataCount * 8)
              break;
          }
          this.typeNumber = typeNumber;
        }
        this.makeImpl(false, this.getBestMaskPattern());
      },
      makeImpl: function(test, maskPattern) {
        this.moduleCount = this.typeNumber * 4 + 17;
        this.modules = new Array(this.moduleCount);
        for (var row = 0; row < this.moduleCount; row++) {
          this.modules[row] = new Array(this.moduleCount);
          for (var col = 0; col < this.moduleCount; col++) {
            this.modules[row][col] = null;
          }
        }
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(test, maskPattern);
        if (this.typeNumber >= 7) {
          this.setupTypeNumber(test);
        }
        if (this.dataCache === null) {
          this.dataCache = QRCode2.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
        }
        this.mapData(this.dataCache, maskPattern);
      },
      setupPositionProbePattern: function(row, col) {
        for (var r = -1; r <= 7; r++) {
          if (row + r <= -1 || this.moduleCount <= row + r) continue;
          for (var c = -1; c <= 7; c++) {
            if (col + c <= -1 || this.moduleCount <= col + c) continue;
            if (0 <= r && r <= 6 && (c === 0 || c === 6) || 0 <= c && c <= 6 && (r === 0 || r === 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      },
      getBestMaskPattern: function() {
        var minLostPoint = 0;
        var pattern = 0;
        for (var i = 0; i < 8; i++) {
          this.makeImpl(true, i);
          var lostPoint = QRUtil.getLostPoint(this);
          if (i === 0 || minLostPoint > lostPoint) {
            minLostPoint = lostPoint;
            pattern = i;
          }
        }
        return pattern;
      },
      createMovieClip: function(target_mc, instance_name, depth) {
        var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
        var cs = 1;
        this.make();
        for (var row = 0; row < this.modules.length; row++) {
          var y = row * cs;
          for (var col = 0; col < this.modules[row].length; col++) {
            var x = col * cs;
            var dark = this.modules[row][col];
            if (dark) {
              qr_mc.beginFill(0, 100);
              qr_mc.moveTo(x, y);
              qr_mc.lineTo(x + cs, y);
              qr_mc.lineTo(x + cs, y + cs);
              qr_mc.lineTo(x, y + cs);
              qr_mc.endFill();
            }
          }
        }
        return qr_mc;
      },
      setupTimingPattern: function() {
        for (var r = 8; r < this.moduleCount - 8; r++) {
          if (this.modules[r][6] !== null) {
            continue;
          }
          this.modules[r][6] = r % 2 === 0;
        }
        for (var c = 8; c < this.moduleCount - 8; c++) {
          if (this.modules[6][c] !== null) {
            continue;
          }
          this.modules[6][c] = c % 2 === 0;
        }
      },
      setupPositionAdjustPattern: function() {
        var pos = QRUtil.getPatternPosition(this.typeNumber);
        for (var i = 0; i < pos.length; i++) {
          for (var j = 0; j < pos.length; j++) {
            var row = pos[i];
            var col = pos[j];
            if (this.modules[row][col] !== null) {
              continue;
            }
            for (var r = -2; r <= 2; r++) {
              for (var c = -2; c <= 2; c++) {
                if (Math.abs(r) === 2 || Math.abs(c) === 2 || r === 0 && c === 0) {
                  this.modules[row + r][col + c] = true;
                } else {
                  this.modules[row + r][col + c] = false;
                }
              }
            }
          }
        }
      },
      setupTypeNumber: function(test) {
        var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        var mod;
        for (var i = 0; i < 18; i++) {
          mod = !test && (bits >> i & 1) === 1;
          this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
        }
        for (var x = 0; x < 18; x++) {
          mod = !test && (bits >> x & 1) === 1;
          this.modules[x % 3 + this.moduleCount - 8 - 3][Math.floor(x / 3)] = mod;
        }
      },
      setupTypeInfo: function(test, maskPattern) {
        var data = this.errorCorrectLevel << 3 | maskPattern;
        var bits = QRUtil.getBCHTypeInfo(data);
        var mod;
        for (var v = 0; v < 15; v++) {
          mod = !test && (bits >> v & 1) === 1;
          if (v < 6) {
            this.modules[v][8] = mod;
          } else if (v < 8) {
            this.modules[v + 1][8] = mod;
          } else {
            this.modules[this.moduleCount - 15 + v][8] = mod;
          }
        }
        for (var h = 0; h < 15; h++) {
          mod = !test && (bits >> h & 1) === 1;
          if (h < 8) {
            this.modules[8][this.moduleCount - h - 1] = mod;
          } else if (h < 9) {
            this.modules[8][15 - h - 1 + 1] = mod;
          } else {
            this.modules[8][15 - h - 1] = mod;
          }
        }
        this.modules[this.moduleCount - 8][8] = !test;
      },
      mapData: function(data, maskPattern) {
        var inc = -1;
        var row = this.moduleCount - 1;
        var bitIndex = 7;
        var byteIndex = 0;
        for (var col = this.moduleCount - 1; col > 0; col -= 2) {
          if (col === 6) col--;
          while (true) {
            for (var c = 0; c < 2; c++) {
              if (this.modules[row][col - c] === null) {
                var dark = false;
                if (byteIndex < data.length) {
                  dark = (data[byteIndex] >>> bitIndex & 1) === 1;
                }
                var mask = QRUtil.getMask(maskPattern, row, col - c);
                if (mask) {
                  dark = !dark;
                }
                this.modules[row][col - c] = dark;
                bitIndex--;
                if (bitIndex === -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || this.moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }
    };
    QRCode2.PAD0 = 236;
    QRCode2.PAD1 = 17;
    QRCode2.createData = function(typeNumber, errorCorrectLevel, dataList) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
      var buffer = new QRBitBuffer();
      for (var i = 0; i < dataList.length; i++) {
        var data = dataList[i];
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
        data.write(buffer);
      }
      var totalDataCount = 0;
      for (var x = 0; x < rsBlocks.length; x++) {
        totalDataCount += rsBlocks[x].dataCount;
      }
      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
      }
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(false);
      }
      while (true) {
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCode2.PAD0, 8);
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCode2.PAD1, 8);
      }
      return QRCode2.createBytes(buffer, rsBlocks);
    };
    QRCode2.createBytes = function(buffer, rsBlocks) {
      var offset = 0;
      var maxDcCount = 0;
      var maxEcCount = 0;
      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);
      for (var r = 0; r < rsBlocks.length; r++) {
        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (var i = 0; i < dcdata[r].length; i++) {
          dcdata[r][i] = 255 & buffer.buffer[i + offset];
        }
        offset += dcCount;
        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var x = 0; x < ecdata[r].length; x++) {
          var modIndex = x + modPoly.getLength() - ecdata[r].length;
          ecdata[r][x] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
        }
      }
      var totalCodeCount = 0;
      for (var y = 0; y < rsBlocks.length; y++) {
        totalCodeCount += rsBlocks[y].totalCount;
      }
      var data = new Array(totalCodeCount);
      var index = 0;
      for (var z = 0; z < maxDcCount; z++) {
        for (var s = 0; s < rsBlocks.length; s++) {
          if (z < dcdata[s].length) {
            data[index++] = dcdata[s][z];
          }
        }
      }
      for (var xx = 0; xx < maxEcCount; xx++) {
        for (var t = 0; t < rsBlocks.length; t++) {
          if (xx < ecdata[t].length) {
            data[index++] = ecdata[t][xx];
          }
        }
      }
      return data;
    };
    module.exports = QRCode2;
  }
});

// ../../node_modules/qrcode-terminal/lib/main.js
var require_main = __commonJS({
  "../../node_modules/qrcode-terminal/lib/main.js"(exports, module) {
    var QRCode2 = require_QRCode();
    var QRErrorCorrectLevel = require_QRErrorCorrectLevel();
    var black = "\x1B[40m  \x1B[0m";
    var white = "\x1B[47m  \x1B[0m";
    var toCell = function(isBlack) {
      return isBlack ? black : white;
    };
    var repeat = function(color) {
      return {
        times: function(count) {
          return new Array(count).join(color);
        }
      };
    };
    var fill = function(length, value) {
      var arr = new Array(length);
      for (var i = 0; i < length; i++) {
        arr[i] = value;
      }
      return arr;
    };
    module.exports = {
      error: QRErrorCorrectLevel.L,
      generate: function(input, opts, cb) {
        if (typeof opts === "function") {
          cb = opts;
          opts = {};
        }
        var qrcode = new QRCode2(-1, this.error);
        qrcode.addData(input);
        qrcode.make();
        var output = "";
        if (opts && opts.small) {
          var BLACK = true, WHITE = false;
          var moduleCount = qrcode.getModuleCount();
          var moduleData = qrcode.modules.slice();
          var oddRow = moduleCount % 2 === 1;
          if (oddRow) {
            moduleData.push(fill(moduleCount, WHITE));
          }
          var platte = {
            WHITE_ALL: "\u2588",
            WHITE_BLACK: "\u2580",
            BLACK_WHITE: "\u2584",
            BLACK_ALL: " "
          };
          var borderTop = repeat(platte.BLACK_WHITE).times(moduleCount + 3);
          var borderBottom = repeat(platte.WHITE_BLACK).times(moduleCount + 3);
          output += borderTop + "\n";
          for (var row = 0; row < moduleCount; row += 2) {
            output += platte.WHITE_ALL;
            for (var col = 0; col < moduleCount; col++) {
              if (moduleData[row][col] === WHITE && moduleData[row + 1][col] === WHITE) {
                output += platte.WHITE_ALL;
              } else if (moduleData[row][col] === WHITE && moduleData[row + 1][col] === BLACK) {
                output += platte.WHITE_BLACK;
              } else if (moduleData[row][col] === BLACK && moduleData[row + 1][col] === WHITE) {
                output += platte.BLACK_WHITE;
              } else {
                output += platte.BLACK_ALL;
              }
            }
            output += platte.WHITE_ALL + "\n";
          }
          if (!oddRow) {
            output += borderBottom;
          }
        } else {
          var border = repeat(white).times(qrcode.getModuleCount() + 3);
          output += border + "\n";
          qrcode.modules.forEach(function(row2) {
            output += white;
            output += row2.map(toCell).join("");
            output += white + "\n";
          });
          output += border;
        }
        if (cb) cb(output);
        else console.log(output);
      },
      setErrorLevel: function(error) {
        this.error = QRErrorCorrectLevel[error] || this.error;
      }
    };
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
function textPart(text) {
  return { type: "text", text };
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
      const text = String(value).trim();
      if (!text)
        continue;
      return JSON.parse(text);
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
    const text = JSON.stringify(msg);
    await new Promise((resolve5, reject) => {
      this.ws.send(text, (err) => err ? reject(err) : resolve5());
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
      const text = this.rawDataToUtf8(data);
      if (this.waitingReaders.length > 0) {
        const waiter = this.waitingReaders.shift();
        try {
          waiter.resolve(JSON.parse(text));
        } catch (error) {
          waiter.reject(error);
        }
        return;
      }
      this.receivedFrames.push(text);
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
  const text = replyText.trim();
  if (!text)
    return null;
  if (questions.length === 1) {
    const answer = parseAnswerForQuestion(questions[0], text);
    if (!answer)
      return null;
    return { answers: { [questions[0].id]: { answers: [answer] } } };
  }
  const answers = {};
  for (const segment of splitMultiQuestionSegments(text)) {
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
function splitMultiQuestionSegments(text) {
  const lineSegments = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lineSegments.length > 1)
    return lineSegments;
  return text.split(/[;；]/).map((segment) => segment.trim()).filter(Boolean);
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
function resolveModuleStatePath(context) {
  return join3(context.craftPath, "state", context.moduleId);
}
function resolveModuleTempPath(context) {
  return join3(context.craftPath, "tmp", context.moduleId);
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
function commandWord(text) {
  const first = text.trim().split(/\s+/, 1)[0] ?? "";
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
  async isCommand(text) {
    const name = commandWord(text);
    if (!name)
      return false;
    await this.ensureFresh();
    return this.names.has(name);
  }
  async run(request) {
    const text = request.opts.text.trim();
    const [command = "", ...args] = text.split(/\s+/);
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
  async isCommand(text) {
    return await this.commandRouter.isCommand(text);
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
  parseChannelBindCode(text) {
    const match = /^\/bind\s+([1-9][0-9]{5})\s*$/i.exec(text.trim());
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
function parseApprovalReplyDecision(text, options = {}) {
  const trimmed = text.trim();
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
  tryResolve(recipient, text) {
    const decision = parseApprovalReplyDecision(text);
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
  async notify(recipient, text) {
    try {
      await this.options.notify(recipient, text);
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
  moduleId: "weixin-standard",
  channelName: "weixin",
  displayName: "\u5FAE\u4FE1",
  localizedDisplayName: {
    en: "WeChat",
    "zh-Hans": "\u5FAE\u4FE1",
    ja: "WeChat",
    ko: "WeChat",
    es: "WeChat",
    fr: "WeChat",
    de: "WeChat"
  },
  interface: {
    shortDescription: "Send and receive messages via WeChat ClawBot.",
    localizedShortDescription: {
      en: "Send and receive messages via WeChat ClawBot.",
      "zh-Hans": "\u901A\u8FC7\u5FAE\u4FE1 ClawBot \u6536\u53D1\u6D88\u606F\u3002",
      ja: "WeChat ClawBot \u3092\u901A\u3058\u3066\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u9001\u53D7\u4FE1\u3057\u307E\u3059\u3002",
      ko: "WeChat ClawBot\uC73C\uB85C \uBA54\uC2DC\uC9C0\uB97C \uC8FC\uACE0\uBC1B\uC544\uC694.",
      es: "Env\xEDa y recibe mensajes a trav\xE9s de WeChat ClawBot.",
      fr: "Envoyez et recevez des messages via WeChat ClawBot.",
      de: "Senden und empfangen Sie Nachrichten \xFCber WeChat ClawBot."
    },
    longDescription: "Message DotCraft in the WeChat ClawBot chat and it replies in the same chat. Replies are plain text and can include images and files.",
    localizedLongDescription: {
      en: "Message DotCraft in the WeChat ClawBot chat and it replies in the same chat. Replies are plain text and can include images and files.",
      "zh-Hans": "\u5728\u5FAE\u4FE1\u7684\u300C\u5FAE\u4FE1 ClawBot\u300D\u5BF9\u8BDD\u4E2D\u7ED9 DotCraft \u53D1\u6D88\u606F\uFF0C\u5B83\u4F1A\u5728\u540C\u4E00\u5BF9\u8BDD\u4E2D\u56DE\u590D\u3002\u56DE\u590D\u4E3A\u7EAF\u6587\u672C\uFF0C\u4E5F\u53EF\u4EE5\u5305\u542B\u56FE\u7247\u548C\u6587\u4EF6\u3002",
      ja: "WeChat ClawBot \u306E\u30C1\u30E3\u30C3\u30C8\u3067 DotCraft \u306B\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u9001\u308B\u3068\u3001\u540C\u3058\u30C1\u30E3\u30C3\u30C8\u3067\u8FD4\u4FE1\u3057\u307E\u3059\u3002\u8FD4\u4FE1\u306F\u30D7\u30EC\u30FC\u30F3\u30C6\u30AD\u30B9\u30C8\u3067\u3001\u753B\u50CF\u3084\u30D5\u30A1\u30A4\u30EB\u3092\u542B\u3081\u308B\u3053\u3068\u3082\u3067\u304D\u307E\u3059\u3002",
      ko: "WeChat ClawBot \uCC44\uD305\uC5D0\uC11C DotCraft\uC5D0 \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0B4\uBA74 \uAC19\uC740 \uCC44\uD305\uC73C\uB85C \uB2F5\uC7A5\uD574\uC694. \uB2F5\uC7A5\uC740 \uC77C\uBC18 \uD14D\uC2A4\uD2B8\uC774\uBA70 \uC774\uBBF8\uC9C0\uC640 \uD30C\uC77C\uC744 \uD3EC\uD568\uD560 \uC218 \uC788\uC5B4\uC694.",
      es: "Escribe a DotCraft en el chat de WeChat ClawBot y te responder\xE1 en el mismo chat. Las respuestas son texto sin formato y pueden incluir im\xE1genes y archivos.",
      fr: "\xC9crivez \xE0 DotCraft dans la discussion WeChat ClawBot et il vous r\xE9pond dans la m\xEAme discussion. Les r\xE9ponses sont en texte brut et peuvent inclure des images et des fichiers.",
      de: "Schreiben Sie DotCraft im Chat mit WeChat ClawBot, und es antwortet im selben Chat. Antworten sind reiner Text und k\xF6nnen Bilder und Dateien enthalten."
    },
    previewPrompt: "Capture this WeChat request and draft a reply.",
    localizedPreviewPrompt: {
      en: "Capture this WeChat request and draft a reply.",
      "zh-Hans": "\u8BB0\u5F55\u8FD9\u6761\u5FAE\u4FE1\u8BF7\u6C42\uFF0C\u5E76\u51C6\u5907\u4E00\u6BB5\u56DE\u590D\u3002",
      ja: "\u3053\u306E WeChat \u306E\u30EA\u30AF\u30A8\u30B9\u30C8\u3092\u8A18\u9332\u3057\u3066\u3001\u8FD4\u4FE1\u306E\u4E0B\u66F8\u304D\u3092\u4F5C\u6210\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      ko: "\uC774 WeChat \uC694\uCCAD\uC744 \uAE30\uB85D\uD558\uACE0 \uB2F5\uC7A5 \uCD08\uC548\uC744 \uC791\uC131\uD558\uC138\uC694.",
      es: "Registra esta solicitud de WeChat y redacta una respuesta.",
      fr: "Enregistrez cette demande WeChat et r\xE9digez une r\xE9ponse.",
      de: "Erfassen Sie diese WeChat-Anfrage und entwerfen Sie eine Antwort."
    },
    setupSteps: [
      "In WeChat on your phone, turn on WeChat ClawBot under Me \u203A Settings \u203A Plugins.",
      "Select Connect and scan the QR code with WeChat.",
      "Send a message in the WeChat ClawBot chat."
    ],
    localizedSetupSteps: {
      en: [
        "In WeChat on your phone, turn on WeChat ClawBot under Me \u203A Settings \u203A Plugins.",
        "Select Connect and scan the QR code with WeChat.",
        "Send a message in the WeChat ClawBot chat."
      ],
      "zh-Hans": [
        "\u5728\u624B\u673A\u5FAE\u4FE1\u7684\u300C\u6211 \u203A \u8BBE\u7F6E \u203A \u63D2\u4EF6\u300D\u4E2D\u542F\u7528\u300C\u5FAE\u4FE1 ClawBot\u300D\u3002",
        "\u70B9\u51FB\u300C\u8FDE\u63A5\u300D\uFF0C\u4F7F\u7528\u5FAE\u4FE1\u626B\u63CF\u4E8C\u7EF4\u7801\u3002",
        "\u5728\u300C\u5FAE\u4FE1 ClawBot\u300D\u5BF9\u8BDD\u4E2D\u53D1\u9001\u6D88\u606F\u3002"
      ],
      ja: [
        "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u306E WeChat \u3067\u300C\u81EA\u5206 \u203A \u8A2D\u5B9A \u203A \u30D7\u30E9\u30B0\u30A4\u30F3\u300D\u3092\u958B\u304D\u3001\u300CWeChat ClawBot\u300D\u3092\u30AA\u30F3\u306B\u3057\u307E\u3059\u3002",
        "\u300C\u63A5\u7D9A\u300D\u3092\u9078\u629E\u3057\u3001WeChat \u3067 QR \u30B3\u30FC\u30C9\u3092\u30B9\u30AD\u30E3\u30F3\u3057\u307E\u3059\u3002",
        "\u300CWeChat ClawBot\u300D\u306E\u30C1\u30E3\u30C3\u30C8\u3067\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u9001\u4FE1\u3057\u307E\u3059\u3002"
      ],
      ko: [
        "\uD734\uB300\uD3F0\uC758 WeChat\uC5D0\uC11C \uB098 \u203A \uC124\uC815 \u203A \uD50C\uB7EC\uADF8\uC778\uC73C\uB85C \uC774\uB3D9\uD574 WeChat ClawBot\uC744 \uCF1C\uC138\uC694.",
        "\uC5F0\uACB0\uC744 \uC120\uD0DD\uD558\uACE0 WeChat\uC73C\uB85C QR \uCF54\uB4DC\uB97C \uC2A4\uCE94\uD558\uC138\uC694.",
        "WeChat ClawBot \uCC44\uD305\uC5D0\uC11C \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0B4\uC138\uC694."
      ],
      es: [
        "En WeChat en tu tel\xE9fono, activa WeChat ClawBot en Yo \u203A Configuraci\xF3n \u203A Plugins.",
        "Selecciona Conectar y escanea el c\xF3digo QR con WeChat.",
        "Env\xEDa un mensaje en el chat de WeChat ClawBot."
      ],
      fr: [
        "Dans WeChat sur votre t\xE9l\xE9phone, activez WeChat ClawBot sous Moi \u203A Param\xE8tres \u203A Plugins.",
        "S\xE9lectionnez Connecter et scannez le code QR avec WeChat.",
        "Envoyez un message dans la discussion WeChat ClawBot."
      ],
      de: [
        "Aktivieren Sie in WeChat auf Ihrem Smartphone WeChat ClawBot unter Ich \u203A Einstellungen \u203A Plugins.",
        "W\xE4hlen Sie Verbinden und scannen Sie den QR-Code mit WeChat.",
        "Senden Sie eine Nachricht im Chat mit WeChat ClawBot."
      ]
    }
  },
  packageName: "@dotcraft/channel-weixin",
  configFileName: "weixin.json",
  supportedTransports: ["websocket"],
  requiresInteractiveSetup: true,
  capabilitySummary: {
    hasChannelTools: false,
    requiresInteractiveSetup: true,
    capabilitySetMayVaryByEnvironment: false
  },
  channelContractVersion: CHANNEL_CONTRACT_VERSION,
  supportedChannelProtocolVersions: ["0.2"],
  variant: "standard",
  launcher: {
    bin: "dotcraft-channel-weixin",
    supportsWorkspaceFlag: true,
    supportsConfigOverrideFlag: true
  }
};

// dist/weixin-adapter.js
var import_qrcode = __toESM(require_lib(), 1);
import { mkdirSync as mkdirSync4, rmSync, writeFileSync as writeFileSync3 } from "node:fs";
import { join as join8 } from "node:path";
import { randomUUID as randomUUID3 } from "node:crypto";

// dist/auth.js
var QR_LONG_POLL_MS = 35e3;
var DEFAULT_BOT_TYPE = "3";
async function fetchQrCode(apiBaseUrl, botType, signal) {
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;
  const url = new URL(`ilink/bot/get_bot_qrcode?bot_type=${encodeURIComponent(botType)}`, base);
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`QR fetch failed: ${res.status} ${body}`);
  }
  return await res.json();
}
async function pollQrStatus(apiBaseUrl, qrcode, signal) {
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;
  const url = new URL(`ilink/bot/get_qrcode_status?qrcode=${encodeURIComponent(qrcode)}`, base);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), QR_LONG_POLL_MS);
  try {
    const res = await fetch(url, {
      headers: { "iLink-App-ClientVersion": "1" },
      signal: signal ? AbortSignal.any([signal, controller.signal]) : controller.signal
    });
    clearTimeout(t);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`QR status failed: ${res.status} ${body}`);
    }
    return await res.json();
  } catch (e) {
    clearTimeout(t);
    signal?.throwIfAborted();
    if (e instanceof Error && e.name === "AbortError") {
      return { status: "wait" };
    }
    throw e;
  }
}
async function waitForQrLogin(opts) {
  const deadline = Date.now() + (opts.deadlineMs ?? 48e4);
  if (opts.abortSignal?.aborted) {
    throw new Error("QR login aborted");
  }
  const qr = await fetchQrCode(opts.apiBaseUrl, opts.botType, opts.abortSignal);
  opts.abortSignal?.throwIfAborted();
  opts.onQrUrl(qr.qrcode_img_content);
  let qrcode = qr.qrcode;
  let scannedPrinted = false;
  while (Date.now() < deadline) {
    if (opts.abortSignal?.aborted) {
      throw new Error("QR login aborted");
    }
    const st = await pollQrStatus(opts.apiBaseUrl, qrcode, opts.abortSignal);
    opts.abortSignal?.throwIfAborted();
    opts.onStatus?.(st.status);
    if (st.status === "scaned" && !scannedPrinted) {
      scannedPrinted = true;
      console.error("\nScanned \u2014 confirm in WeChat...\n");
    }
    if (st.status === "expired") {
      console.error("QR expired, fetching new QR...");
      const next = await fetchQrCode(opts.apiBaseUrl, opts.botType, opts.abortSignal);
      opts.abortSignal?.throwIfAborted();
      qrcode = next.qrcode;
      opts.onQrUrl(next.qrcode_img_content);
    }
    if (st.status === "confirmed") {
      if (!st.ilink_bot_id) {
        throw new Error("Login confirmed but ilink_bot_id missing");
      }
      return {
        botToken: st.bot_token ?? "",
        ilinkBotId: st.ilink_bot_id,
        baseUrl: st.baseurl ?? opts.apiBaseUrl,
        ilinkUserId: st.ilink_user_id,
        savedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    await sleep(1e3, opts.abortSignal);
  }
  throw new Error("QR login timed out");
}
function sleep(ms, abortSignal) {
  return new Promise((resolve5, reject) => {
    const timer = setTimeout(() => {
      abortSignal?.removeEventListener("abort", onAbort);
      resolve5();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      abortSignal?.removeEventListener("abort", onAbort);
      reject(new Error("QR login aborted"));
    };
    if (abortSignal) {
      abortSignal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

// dist/formatting.js
function markdownToPlainText(text) {
  let result = text;
  result = result.replace(/```[^\n]*\n?([\s\S]*?)```/g, (_, code) => code.trim());
  result = result.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
  result = result.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  result = result.replace(/^\|[\s:|-]+\|$/gm, "");
  result = result.replace(/^\|(.+)\|$/gm, (_, inner) => inner.split("|").map((c) => c.trim()).join("  "));
  result = result.replace(/\*\*([^*]+)\*\*/g, "$1");
  result = result.replace(/\*([^*]+)\*/g, "$1");
  result = result.replace(/^#+\s*/gm, "");
  return result.trim();
}

// dist/weixin-api.js
import { randomBytes } from "node:crypto";

// dist/weixin-types.js
var MessageType = {
  NONE: 0,
  USER: 1,
  BOT: 2
};
var MessageState = {
  NEW: 0,
  GENERATING: 1,
  FINISH: 2
};
var MessageItemType = {
  NONE: 0,
  TEXT: 1,
  IMAGE: 2,
  VOICE: 3,
  FILE: 4,
  VIDEO: 5
};
var UploadMediaType = {
  IMAGE: 1,
  VIDEO: 2,
  FILE: 3,
  VOICE: 4
};

// dist/weixin-api.js
var DEFAULT_LONG_POLL_MS = 35e3;
var DEFAULT_API_TIMEOUT_MS = 15e3;
function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : `${url}/`;
}
function randomWechatUin() {
  const buf = randomBytes(4);
  const u32 = buf.readUInt32BE(0);
  return Buffer.from(String(u32), "utf-8").toString("base64");
}
function buildHeaders(token, body) {
  const headers = {
    "Content-Type": "application/json",
    AuthorizationType: "ilink_bot_token",
    "Content-Length": String(Buffer.byteLength(body, "utf-8")),
    "X-WECHAT-UIN": randomWechatUin()
  };
  if (token?.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }
  return headers;
}
function buildBaseInfo() {
  return { channel_version: "0.1.0" };
}
async function apiFetch(params) {
  const base = ensureTrailingSlash(params.baseUrl);
  const url = new URL(params.endpoint, base);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), params.timeoutMs);
  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: buildHeaders(params.token, params.body),
      body: params.body,
      signal: controller.signal
    });
    clearTimeout(t);
    const rawText = await res.text();
    if (!res.ok) {
      throw new Error(`${params.label} ${res.status}: ${rawText}`);
    }
    return rawText;
  } catch (err) {
    clearTimeout(t);
    throw err;
  }
}
async function getUpdates(params) {
  const timeout = params.timeoutMs ?? DEFAULT_LONG_POLL_MS;
  try {
    const rawText = await apiFetch({
      baseUrl: params.baseUrl,
      endpoint: "ilink/bot/getupdates",
      body: JSON.stringify({
        get_updates_buf: params.get_updates_buf ?? "",
        base_info: buildBaseInfo()
      }),
      token: params.token,
      timeoutMs: timeout,
      label: "getUpdates"
    });
    return JSON.parse(rawText);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { ret: 0, msgs: [], get_updates_buf: params.get_updates_buf };
    }
    throw err;
  }
}
async function sendMessage(opts) {
  await apiFetch({
    baseUrl: opts.baseUrl,
    endpoint: "ilink/bot/sendmessage",
    body: JSON.stringify({ ...opts.body, base_info: buildBaseInfo() }),
    token: opts.token,
    timeoutMs: opts.timeoutMs ?? DEFAULT_API_TIMEOUT_MS,
    label: "sendMessage"
  });
}
async function getUploadUrl(opts) {
  const rawText = await apiFetch({
    baseUrl: opts.baseUrl,
    endpoint: "ilink/bot/getuploadurl",
    body: JSON.stringify({ ...opts.body, base_info: buildBaseInfo() }),
    token: opts.token,
    timeoutMs: opts.timeoutMs ?? DEFAULT_API_TIMEOUT_MS,
    label: "getUploadUrl"
  });
  return JSON.parse(rawText);
}
function buildTextMessageReq(params) {
  const item_list = params.text.length > 0 ? [{ type: 1, text_item: { text: params.text } }] : [];
  const msg = {
    from_user_id: "",
    to_user_id: params.toUserId,
    client_id: params.clientId,
    message_type: MessageType.BOT,
    message_state: MessageState.FINISH,
    item_list: item_list.length ? item_list : void 0,
    context_token: params.contextToken
  };
  return { msg };
}
function buildFileMessageReq(params) {
  return {
    msg: {
      from_user_id: "",
      to_user_id: params.toUserId,
      client_id: params.clientId,
      message_type: MessageType.BOT,
      message_state: MessageState.FINISH,
      context_token: params.contextToken,
      item_list: [
        {
          type: MessageItemType.FILE,
          file_item: {
            media: params.media,
            file_name: params.fileName,
            len: String(params.byteLength)
          }
        }
      ]
    }
  };
}
function buildImageMessageReq(params) {
  return {
    msg: {
      from_user_id: "",
      to_user_id: params.toUserId,
      client_id: params.clientId,
      message_type: MessageType.BOT,
      message_state: MessageState.FINISH,
      context_token: params.contextToken,
      item_list: [
        {
          type: MessageItemType.IMAGE,
          image_item: {
            media: params.media,
            mid_size: params.ciphertextByteLength
          }
        }
      ]
    }
  };
}
var SESSION_EXPIRED_ERRCODE = -14;

// dist/monitor.js
var DEFAULT_LONG_POLL = 35e3;
var MAX_FAILURES = 3;
var BACKOFF_MS = 3e4;
var RETRY_MS = 2e3;
async function runMonitorLoop(opts) {
  let buf = opts.getInitialBuf();
  let nextTimeout = opts.longPollMs ?? DEFAULT_LONG_POLL;
  let consecutiveFailures = 0;
  while (!opts.abortSignal?.aborted) {
    try {
      const resp = await getUpdates({
        baseUrl: opts.baseUrl,
        token: opts.token,
        get_updates_buf: buf,
        timeoutMs: nextTimeout
      });
      if (resp.longpolling_timeout_ms != null && resp.longpolling_timeout_ms > 0) {
        nextTimeout = resp.longpolling_timeout_ms;
      }
      const isApiError = resp.ret !== void 0 && resp.ret !== 0 || resp.errcode !== void 0 && resp.errcode !== 0;
      if (isApiError) {
        const sessionExpired = resp.errcode === SESSION_EXPIRED_ERRCODE || resp.ret === SESSION_EXPIRED_ERRCODE;
        if (sessionExpired) {
          console.error("Weixin session expired; re-login required.");
          await opts.callbacks.onSessionExpired?.();
          consecutiveFailures = 0;
          await sleep2(6e4, opts.abortSignal);
          continue;
        }
        consecutiveFailures++;
        console.error(`getUpdates error ret=${resp.ret} errcode=${resp.errcode} (${consecutiveFailures}/${MAX_FAILURES})`);
        if (consecutiveFailures >= MAX_FAILURES) {
          consecutiveFailures = 0;
          await sleep2(BACKOFF_MS, opts.abortSignal);
        } else {
          await sleep2(RETRY_MS, opts.abortSignal);
        }
        continue;
      }
      consecutiveFailures = 0;
      if (resp.get_updates_buf != null && resp.get_updates_buf !== "") {
        opts.saveBuf(resp.get_updates_buf);
        buf = resp.get_updates_buf;
      }
      const list = resp.msgs ?? [];
      for (const full of list) {
        if (full.message_type === MessageType.USER) {
          await opts.callbacks.onMessage(full);
        }
      }
    } catch (e) {
      if (opts.abortSignal?.aborted)
        break;
      consecutiveFailures++;
      console.error(`getUpdates exception (${consecutiveFailures}/${MAX_FAILURES}):`, e);
      if (consecutiveFailures >= MAX_FAILURES) {
        consecutiveFailures = 0;
        await sleep2(BACKOFF_MS, opts.abortSignal);
      } else {
        await sleep2(RETRY_MS, opts.abortSignal);
      }
    }
  }
}
function sleep2(ms, signal) {
  return new Promise((resolve5, reject) => {
    const t = setTimeout(resolve5, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new Error("aborted"));
    }, { once: true });
  });
}

// dist/state.js
import { mkdirSync as mkdirSync3, readFileSync as readFileSync2, writeFileSync as writeFileSync2, existsSync as existsSync2 } from "node:fs";
import { join as join4 } from "node:path";
var WeixinState = class {
  dataDir;
  constructor(dataDir) {
    this.dataDir = dataDir;
    mkdirSync3(dataDir, { recursive: true });
  }
  credentialsPath() {
    return join4(this.dataDir, "credentials.json");
  }
  syncPath() {
    return join4(this.dataDir, "sync.json");
  }
  contextTokensPath() {
    return join4(this.dataDir, "context-tokens.json");
  }
  loadCredentials() {
    const p = this.credentialsPath();
    if (!existsSync2(p))
      return null;
    try {
      return JSON.parse(readFileSync2(p, "utf-8"));
    } catch {
      return null;
    }
  }
  saveCredentials(c) {
    writeFileSync2(this.credentialsPath(), JSON.stringify(c, null, 2), "utf-8");
  }
  loadSyncBuf() {
    const p = this.syncPath();
    if (!existsSync2(p))
      return "";
    try {
      const j = JSON.parse(readFileSync2(p, "utf-8"));
      return j.get_updates_buf ?? "";
    } catch {
      return "";
    }
  }
  saveSyncBuf(buf) {
    writeFileSync2(this.syncPath(), JSON.stringify({ get_updates_buf: buf }, null, 2), "utf-8");
  }
  loadContextTokens() {
    const p = this.contextTokensPath();
    if (!existsSync2(p))
      return {};
    try {
      return JSON.parse(readFileSync2(p, "utf-8"));
    } catch {
      return {};
    }
  }
  saveContextTokens(tokens) {
    writeFileSync2(this.contextTokensPath(), JSON.stringify(tokens, null, 2), "utf-8");
  }
};

// dist/weixin-config.js
var DEFAULT_WEIXIN_API_BASE_URL = "https://ilinkai.weixin.qq.com";

// dist/weixin-media.js
import { createCipheriv, createHash as createHash2, randomBytes as randomBytes2 } from "node:crypto";

// ../channel/dist/inboundFile.js
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, join as join5 } from "node:path";

// ../channel/dist/inboundImage.js
import { randomUUID as randomUUID2 } from "node:crypto";
import { mkdir as mkdir2, writeFile as writeFile2 } from "node:fs/promises";
import { join as join6 } from "node:path";

// ../channel/dist/mediaSource.js
import { createHash } from "node:crypto";
import { mkdtemp, readFile as readFile2, rm, stat, writeFile as writeFile3 } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename as basename2, extname, join as join7, resolve as resolve3 } from "node:path";
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
  const text = requiredText(value, fieldName, options);
  const normalized = text.startsWith("base64://") ? text.slice("base64://".length) : text;
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
function enforceMaxBytes(byteLength, options) {
  if (options.maxBytes !== void 0 && byteLength > options.maxBytes) {
    fail(options, "InvalidArguments", `Media source is ${byteLength} bytes, exceeding the ${options.maxBytes} byte limit.`);
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
  const text = optionalText(value);
  if (!text)
    fail(options, "InvalidArguments", `${fieldName} is required.`);
  return text;
}
function optionalText(value) {
  const text = String(value ?? "").trim();
  return text || void 0;
}
function fail(options, code, message) {
  throw options.errorFactory?.(code, message) ?? new MediaSourceError(code, message);
}
function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

// dist/weixin-media.js
var DEFAULT_CDN_BASE_URL = "https://novac2c.cdn.weixin.qq.com/c2c";
var MAX_CDN_UPLOAD_ATTEMPTS = 3;
var WeixinMediaError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.name = "WeixinMediaError";
    this.code = code;
  }
};
function formatErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function wrapMediaStageError(stage, code, error) {
  if (error instanceof WeixinMediaError)
    return error;
  return new WeixinMediaError(code, `${stage} failed: ${formatErrorMessage(error)}`);
}
var WeixinMediaSender = class {
  api;
  cdnBaseUrl;
  constructor(api = { getUploadUrl, sendMessage }, cdnBaseUrl = DEFAULT_CDN_BASE_URL) {
    this.api = api;
    this.cdnBaseUrl = cdnBaseUrl;
  }
  async sendStructuredMessage(opts) {
    const kind = String(opts.message.kind ?? "");
    if (kind !== "file" && kind !== "image") {
      return {
        delivered: false,
        errorCode: "UnsupportedDeliveryKind",
        errorMessage: `Weixin channel does not support '${kind}' media delivery.`
      };
    }
    const fallbackName = kind === "image" ? "image.jpg" : "attachment";
    const prepared = await prepareMediaSource(asRecord2(opts.message.source), optionalText2(opts.message.fileName), optionalText2(opts.message.mediaType), fallbackName);
    const uploaded = kind === "image" ? await this.uploadImage(opts, prepared) : await this.uploadFile(opts, prepared);
    try {
      await this.api.sendMessage({
        baseUrl: opts.baseUrl,
        token: opts.token,
        body: uploaded.body
      });
    } catch (error) {
      throw wrapMediaStageError("sendMessage", "MediaMessageSendFailed", error);
    }
    return {
      delivered: true,
      remoteMediaId: uploaded.media.encrypt_query_param ?? null,
      effectiveSourceKind: prepared.sourceKind,
      uploadStage: "completed",
      sendStage: "completed",
      mediaKind: kind,
      fileName: prepared.fileName,
      md5: prepared.md5,
      bytes: prepared.bytes.length
    };
  }
  async uploadFile(opts, prepared) {
    const aesKey = randomBytes2(16);
    const aesKeyHex = aesKey.toString("hex");
    const mediaAesKey = encodeMediaAesKey(aesKeyHex);
    const upload = await this.requestUploadUrl(opts, prepared, UploadMediaType.FILE, aesKeyHex);
    const media = await this.uploadBufferToCdn({
      buf: prepared.bytes,
      uploadFullUrl: upload.upload_full_url,
      uploadParam: upload.upload_param,
      filekey: prepared.fileKey,
      label: "file",
      aesKey,
      mediaAesKey
    });
    return {
      media,
      body: buildFileMessageReq({
        toUserId: opts.toUserId,
        contextToken: opts.contextToken,
        clientId: opts.clientId,
        fileName: prepared.fileName,
        media,
        byteLength: prepared.bytes.length
      })
    };
  }
  async uploadImage(opts, prepared) {
    const aesKey = randomBytes2(16);
    const aesKeyHex = aesKey.toString("hex");
    const mediaAesKey = encodeMediaAesKey(aesKeyHex);
    const upload = await this.requestUploadUrl(opts, prepared, UploadMediaType.IMAGE, aesKeyHex);
    const media = await this.uploadBufferToCdn({
      buf: prepared.bytes,
      uploadFullUrl: upload.upload_full_url,
      uploadParam: upload.upload_param,
      filekey: prepared.fileKey,
      label: "image",
      aesKey,
      mediaAesKey
    });
    return {
      media,
      body: buildImageMessageReq({
        toUserId: opts.toUserId,
        contextToken: opts.contextToken,
        clientId: opts.clientId,
        media,
        ciphertextByteLength: aesEcbPaddedSize(prepared.bytes.length)
      })
    };
  }
  async requestUploadUrl(opts, prepared, mediaType, aesKeyHex) {
    const body = {
      filekey: prepared.fileKey,
      media_type: mediaType,
      to_user_id: opts.toUserId,
      rawsize: prepared.bytes.length,
      rawfilemd5: prepared.md5,
      filesize: aesEcbPaddedSize(prepared.bytes.length),
      no_need_thumb: true,
      aeskey: aesKeyHex
    };
    try {
      return await this.api.getUploadUrl({
        baseUrl: opts.baseUrl,
        token: opts.token,
        body
      });
    } catch (error) {
      throw wrapMediaStageError("getUploadUrl", "UploadUrlRequestFailed", error);
    }
  }
  async uploadBufferToCdn(params) {
    const uploadUrl = buildCdnUploadUrl({
      cdnBaseUrl: this.cdnBaseUrl,
      filekey: params.filekey,
      uploadFullUrl: params.uploadFullUrl,
      uploadParam: params.uploadParam
    });
    const encrypted = encryptAesEcb(params.buf, params.aesKey);
    let lastFailure = "";
    for (let attempt = 1; attempt <= MAX_CDN_UPLOAD_ATTEMPTS; attempt += 1) {
      let response;
      try {
        response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": "application/octet-stream" },
          body: new Uint8Array(encrypted)
        });
      } catch (error) {
        lastFailure = `${params.label} CDN upload failed: ${formatErrorMessage(error)}`;
        if (attempt === MAX_CDN_UPLOAD_ATTEMPTS)
          break;
        continue;
      }
      if (response.ok) {
        const downloadParam = response.headers.get("x-encrypted-param") ?? "";
        if (!downloadParam) {
          throw new WeixinMediaError("CdnUploadFailed", `${params.label} upload response missing x-encrypted-param.`);
        }
        return {
          encrypt_query_param: downloadParam,
          aes_key: params.mediaAesKey,
          encrypt_type: 1
        };
      }
      const detail = await formatCdnErrorDetail(response);
      lastFailure = `${params.label} upload failed: HTTP ${response.status}${detail ? ` ${detail}` : ""}`;
      if (response.status < 500 || response.status >= 600 || attempt === MAX_CDN_UPLOAD_ATTEMPTS) {
        break;
      }
    }
    throw new WeixinMediaError("CdnUploadFailed", lastFailure);
  }
};
async function prepareMediaSource(source, requestedFileName, mediaType, fallbackFileName) {
  const prepared = await prepareMediaBytes(source, {
    fileName: requestedFileName,
    mediaType,
    fallbackFileName,
    errorFactory: weixinMediaError
  });
  return {
    ...prepared,
    fileKey: randomBytes2(16).toString("hex")
  };
}
function encryptAesEcb(plaintext, key) {
  const cipher = createCipheriv("aes-128-ecb", key, null);
  return Buffer.concat([cipher.update(plaintext), cipher.final()]);
}
function aesEcbPaddedSize(plaintextSize) {
  return Math.ceil((plaintextSize + 1) / 16) * 16;
}
function buildCdnUploadUrl(params) {
  const full = params.uploadFullUrl?.trim();
  if (full)
    return full;
  const uploadParam = params.uploadParam?.trim();
  if (!uploadParam) {
    throw new WeixinMediaError("CdnUploadUrlMissing", "CDN upload URL missing; expected upload_full_url or upload_param.");
  }
  return `${params.cdnBaseUrl}/upload?encrypted_query_param=${encodeURIComponent(uploadParam)}&filekey=${encodeURIComponent(params.filekey)}`;
}
function encodeMediaAesKey(aesKeyHex) {
  return Buffer.from(aesKeyHex, "utf-8").toString("base64");
}
async function formatCdnErrorDetail(response) {
  const header = response.headers.get("x-error-message")?.trim();
  const body = (await response.text()).trim();
  return [header, body].filter(Boolean).join(" ");
}
function asRecord2(value) {
  return value && typeof value === "object" ? value : {};
}
function optionalText2(value) {
  const text = String(value ?? "").trim();
  return text || void 0;
}
function weixinMediaError(code, message) {
  return new WeixinMediaError(code, message);
}

// dist/weixin-delivery.js
var mediaConstraints = {
  supportsHostPath: true,
  supportsUrl: false,
  supportsBase64: true,
  supportsCaption: false
};
function weixinDeliveryCapabilities() {
  return {
    text: { format: "plain" },
    targets: { group: false, direct: "knownOnly" },
    media: {
      image: { ...mediaConstraints },
      file: { ...mediaConstraints }
    }
  };
}
async function deliverWeixinMessage(deps, target, message) {
  if (!target.trim()) {
    return unsupportedTarget("Weixin target must be a Weixin user id.");
  }
  if (!deps.getContextToken(target)) {
    return unsupportedTarget(`Weixin user '${target}' has not messaged the bot, so it cannot be reached.`);
  }
  const kind = String(message.kind ?? "");
  if (kind === "text") {
    try {
      await deps.sendText(target, String(message.text ?? ""));
      return { delivered: true };
    } catch (error) {
      return deliveryFailure(error);
    }
  }
  if (kind !== "image" && kind !== "file") {
    return {
      delivered: false,
      errorCode: "UnsupportedDeliveryKind",
      errorMessage: `Weixin channel does not support '${kind}' delivery.`
    };
  }
  const caption = await sendCaptionIfPresent(deps.sendText, target, String(message.caption ?? ""));
  try {
    return attachCaptionInfo(await deps.sendMedia(target, message), caption);
  } catch (error) {
    return attachCaptionInfo(deliveryFailure(error), caption);
  }
}
async function sendCaptionIfPresent(sendText, toUserId, caption) {
  if (!caption.trim())
    return { attempted: false };
  try {
    await sendText(toUserId, caption);
    return { attempted: true, delivered: true };
  } catch (error) {
    console.error("caption send failed:", error);
    return { attempted: true, delivered: false, errorMessage: errorText(error) };
  }
}
function attachCaptionInfo(result, caption) {
  if (!caption.attempted)
    return result;
  const updated = {
    ...result,
    captionDelivered: caption.delivered === true
  };
  if (caption.errorMessage) {
    updated.captionError = caption.errorMessage;
  }
  return updated;
}
function unsupportedTarget(errorMessage) {
  return { delivered: false, errorCode: "UnsupportedTarget", errorMessage };
}
function deliveryFailure(error) {
  const errorCode = error instanceof WeixinMediaError && error.code === "UnsupportedMediaSource" ? error.code : "AdapterDeliveryFailed";
  return { delivered: false, errorCode, errorMessage: errorText(error) };
}
function errorText(error) {
  return error instanceof Error ? error.message : String(error);
}

// dist/weixin-adapter.js
function hasUsableCredentials(credentials) {
  if (!credentials)
    return false;
  return Boolean(credentials.botToken?.trim() && credentials.ilinkBotId?.trim());
}
function delay(ms) {
  return new Promise((resolve5) => setTimeout(resolve5, ms));
}
function shouldRetrySendMessage(error) {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : String(error);
  return name === "AbortError" || message.includes("fetch failed") || /\b5\d\d:/.test(message);
}
function validateWeixinConfig(rawConfig) {
  if (!rawConfig || typeof rawConfig !== "object") {
    throw new ConfigValidationError("Weixin config must be an object.", ["config"]);
  }
  const config = rawConfig;
  const dotcraft = config.dotcraft ?? {};
  if (config.weixin !== void 0 && (!config.weixin || typeof config.weixin !== "object" || Array.isArray(config.weixin))) {
    throw new ConfigValidationError("Weixin platform settings must be an object.", ["weixin"]);
  }
  const weixin = config.weixin ?? {};
  const useDefaultUrl = !Object.hasOwn(weixin, "apiBaseUrl");
  const fields = [];
  const wsUrl = String(dotcraft.wsUrl ?? "").trim();
  const apiBaseUrl = useDefaultUrl ? DEFAULT_WEIXIN_API_BASE_URL : weixin.apiBaseUrl;
  if (!wsUrl) {
    fields.push("dotcraft.wsUrl");
  } else if (!/^wss?:\/\//i.test(wsUrl)) {
    throw new ConfigValidationError("dotcraft.wsUrl must use ws:// or wss://.", ["dotcraft.wsUrl"]);
  }
  if (typeof apiBaseUrl !== "string" || !apiBaseUrl.trim()) {
    fields.push("weixin.apiBaseUrl");
  }
  if (fields.length > 0) {
    throw new ConfigValidationError(`Missing required fields: ${fields.join(", ")}`, fields);
  }
  if (useDefaultUrl) {
    config.weixin = { ...weixin, apiBaseUrl };
  }
}
var WeixinAdapter = class extends ModuleChannelAdapter {
  apiBaseUrl = "";
  botToken = "";
  approvalTimeoutMs = 12e4;
  state;
  tempDir = "";
  contextTokens = {};
  dotcraftStarted = false;
  monitorAbortController;
  authAbortController;
  qrRevision = 0;
  media = new WeixinMediaSender();
  approvalReplies = new ApprovalReplyTracker({
    notify: async ({ userId }, text) => {
      await this.sendWeixinText(userId, text);
    }
  });
  userInputWaiters = /* @__PURE__ */ new Map();
  constructor() {
    super("weixin", "dotcraft-weixin", "0.1.0", [
      "item/reasoning/delta",
      "subagent/progress",
      "item/usage/delta",
      "system/event",
      "plan/updated"
    ]);
  }
  getConfigFileName(_context) {
    return "weixin.json";
  }
  validateConfig(rawConfig) {
    validateWeixinConfig(rawConfig);
  }
  buildTransportFromConfig(config) {
    return new WebSocketTransport({
      url: config.dotcraft.wsUrl,
      token: config.dotcraft.token ?? ""
    });
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
    const config = this.loadedConfig;
    this.approvalTimeoutMs = config.weixin.approvalTimeoutMs ?? 12e4;
    this.tempDir = resolveModuleTempPath(context);
    mkdirSync4(this.tempDir, { recursive: true });
    this.clearQrArtifacts();
    this.state = new WeixinState(resolveModuleStatePath(context));
    this.contextTokens = this.state.loadContextTokens();
    const existing = this.state.loadCredentials();
    if (hasUsableCredentials(existing)) {
      try {
        await this.ensureDotCraftReady(config);
        this.activateCredentials(existing, config);
        this.startMonitor(config);
      } catch (error) {
        this.setStatus("stopped", this.buildError("startupFailed", this.errText(error)));
      }
      return;
    }
    this.signalAuthRequired(this.buildError("authRequired", "Weixin QR login is required before startup.", {
      statePath: resolveModuleStatePath(context)
    }));
    this.beginAuthFlow("startup");
  }
  async stop() {
    this.authAbortController?.abort();
    this.authAbortController = void 0;
    this.monitorAbortController?.abort();
    this.monitorAbortController = void 0;
    this.clearQrArtifacts();
    this.approvalReplies.resolveAll(DECISION_CANCEL);
    this.resolveAllPendingUserInputs(emptyUserInputResponse());
    if (this.dotcraftStarted) {
      await super.stop();
      this.dotcraftStarted = false;
      return;
    }
    this.setStatus("stopped", this.getError());
  }
  beginAuthFlow(reason) {
    if (this.authAbortController)
      return;
    if (!this.loadedConfig)
      return;
    if (!this.state)
      return;
    const config = this.loadedConfig;
    const state = this.state;
    const authController = new AbortController();
    this.authAbortController = authController;
    this.clearQrArtifacts();
    void (async () => {
      try {
        const botType = config.weixin.botType ?? DEFAULT_BOT_TYPE;
        const creds = await waitForQrLogin({
          apiBaseUrl: config.weixin.apiBaseUrl,
          botType,
          abortSignal: authController.signal,
          onStatus: (status) => {
            if (status === "expired" && this.authAbortController === authController)
              this.clearQrArtifacts();
          },
          onQrUrl: (url) => {
            if (this.authAbortController !== authController || authController.signal.aborted)
              return;
            this.persistQrArtifact(url);
            this.setStatus("authRequired", this.buildError("authRequired", "Scan the Weixin QR code to continue.", {
              reason,
              qrUrl: url
            }));
          }
        });
        if (authController.signal.aborted)
          return;
        this.clearQrArtifacts();
        state.saveCredentials(creds);
        this.activateCredentials(creds, config);
        await this.ensureDotCraftReady(config);
        if (authController.signal.aborted)
          return;
        this.startMonitor(config);
        this.setStatus("ready");
      } catch (error) {
        if (authController.signal.aborted)
          return;
        this.setStatus("authRequired", this.buildError("authRequired", this.errText(error)));
      } finally {
        if (this.authAbortController === authController) {
          this.authAbortController = void 0;
          this.clearQrArtifacts();
        }
      }
    })();
  }
  startMonitor(config) {
    const state = this.getState();
    const token = this.getBotToken();
    this.monitorAbortController?.abort();
    const controller = new AbortController();
    this.monitorAbortController = controller;
    void runMonitorLoop({
      baseUrl: this.apiBaseUrl,
      token,
      getInitialBuf: () => state.loadSyncBuf(),
      saveBuf: (buf) => state.saveSyncBuf(buf),
      longPollMs: config.weixin.pollTimeoutMs,
      abortSignal: controller.signal,
      callbacks: {
        onMessage: async (msg) => {
          await this.handleInboundUserMessage(msg);
        },
        onSessionExpired: async () => {
          controller.abort();
          this.signalAuthExpired(this.buildError("authExpired", "Weixin session expired."));
          this.signalAuthRequired(this.buildError("authRequired", "Weixin login is required again after expiry."));
          this.beginAuthFlow("expired");
        }
      }
    }).catch((error) => {
      if (controller.signal.aborted)
        return;
      this.setStatus("stopped", this.buildError("unexpectedRuntimeFailure", this.errText(error)));
    });
  }
  activateCredentials(creds, config) {
    this.apiBaseUrl = creds.baseUrl || config.weixin.apiBaseUrl;
    this.botToken = creds.botToken;
  }
  async ensureDotCraftReady(config) {
    if (this.dotcraftStarted)
      return;
    this.client = new ChannelAppServerClient(this.buildTransportFromConfig(config), { autoReconnect: true });
    await super.start();
    this.dotcraftStarted = true;
  }
  clearQrArtifacts() {
    this.qrRevision++;
    if (!this.tempDir)
      return;
    for (const filename of ["qr-url.txt", "qr.png"]) {
      try {
        rmSync(join8(this.tempDir, filename), { force: true });
      } catch (error) {
        console.error("[weixin] Could not clear the temporary sign-in artifact:", this.errText(error));
      }
    }
  }
  persistQrArtifact(url) {
    this.clearQrArtifacts();
    const revision = this.qrRevision;
    const tempDir = this.tempDir;
    if (!tempDir)
      return;
    void (async () => {
      try {
        writeFileSync3(join8(tempDir, "qr-url.txt"), `${url}
`, { encoding: "utf-8", mode: 384 });
        const data = await import_qrcode.default.toBuffer(url, { type: "png", margin: 1, width: 360 });
        if (this.qrRevision === revision)
          writeFileSync3(join8(tempDir, "qr.png"), data, { mode: 384 });
      } catch (error) {
        console.error("[weixin] Could not render the temporary sign-in artifact:", this.errText(error));
      }
    })();
  }
  getState() {
    if (!this.state) {
      throw new Error("Weixin state is not initialized.");
    }
    return this.state;
  }
  getBotToken() {
    if (!this.botToken) {
      throw new Error("Weixin bot token is not available.");
    }
    return this.botToken;
  }
  buildError(code, message, detail) {
    return {
      code,
      message,
      detail,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  errText(error) {
    return error instanceof Error ? error.message : String(error);
  }
  findUserIdForThread(threadId) {
    for (const [identityKey, tid] of this.threadMap) {
      if (tid === threadId) {
        const userId = identityKey.split(":")[0];
        return userId;
      }
    }
    return void 0;
  }
  async sendWeixinText(toUserId, text) {
    const ctx = this.contextTokens[toUserId];
    const clientId = `dotcraft-weixin-${randomUUID3()}`;
    const req = buildTextMessageReq({
      toUserId,
      text: markdownToPlainText(text),
      contextToken: ctx,
      clientId
    });
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        await sendMessage({
          baseUrl: this.apiBaseUrl,
          token: this.getBotToken(),
          body: req
        });
        return;
      } catch (error) {
        lastError = error;
        if (attempt === 3 || !shouldRetrySendMessage(error))
          break;
        await delay(attempt === 1 ? 250 : 750);
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }
  async onDeliver(target, content, _metadata) {
    try {
      await this.sendWeixinText(target, content);
      return true;
    } catch (e) {
      console.error("onDeliver failed:", e);
      return false;
    }
  }
  getDisplayName() {
    return "WeChat";
  }
  getDeliveryCapabilities() {
    return weixinDeliveryCapabilities();
  }
  getChatDescriptor(_opts, _channelContext) {
    return { kind: "direct", membership: "shared" };
  }
  buildChannelTarget(opts, sender, channelContext) {
    const conversationId = channelContext.trim();
    if (!conversationId)
      return null;
    const platformUserId = String(sender.senderId ?? opts.userId ?? "");
    const displayName = typeof sender.senderName === "string" && sender.senderName.trim() ? sender.senderName.trim() : null;
    return {
      channelName: "weixin",
      conversationKind: "user",
      conversationId,
      deliveryTarget: conversationId,
      displayName: displayName ?? `Weixin user ${conversationId}`,
      boundBy: platformUserId ? {
        platformUserId,
        displayName
      } : null
    };
  }
  async onSend(target, message, _metadata) {
    return await deliverWeixinMessage({
      getContextToken: (userId) => this.contextTokens[userId],
      sendText: (userId, text) => this.sendWeixinText(userId, text),
      sendMedia: (userId, media) => this.media.sendStructuredMessage({
        baseUrl: this.apiBaseUrl,
        token: this.getBotToken(),
        toUserId: userId,
        contextToken: this.contextTokens[userId],
        clientId: `dotcraft-weixin-${randomUUID3()}`,
        message: media
      })
    }, target, message);
  }
  async onApprovalRequest(request) {
    const threadId = String(request.threadId ?? "");
    const approvalType = String(request.approvalType ?? "");
    const operation = String(request.operation ?? "");
    const target = String(request.target ?? "");
    const userId = this.findUserIdForThread(threadId);
    if (!userId) {
      console.warn("No user for thread; declining approval");
      return DECISION_DECLINE;
    }
    const timeoutSeconds = Math.round(this.approvalTimeoutMs / 1e3);
    const prompt = approvalType === "shell" ? `\u26A0\uFE0F \u9700\u8981\u6267\u884C\u547D\u4EE4\u6743\u9650\uFF1A\`${operation}\`
\u56DE\u590D \u540C\u610F/yes \u6279\u51C6\uFF0C\u540C\u610F\u5168\u90E8/yes all \u672C\u4F1A\u8BDD\u653E\u884C\u540C\u7C7B\u64CD\u4F5C\uFF0C\u62D2\u7EDD/no \u62D2\u7EDD\uFF08${timeoutSeconds}\u79D2\u8D85\u65F6\u81EA\u52A8\u62D2\u7EDD\uFF09` : `\u26A0\uFE0F \u9700\u8981 ${operation} \u6587\u4EF6\u6743\u9650\uFF1A\`${target}\`
\u56DE\u590D \u540C\u610F/yes \u6279\u51C6\uFF0C\u540C\u610F\u5168\u90E8/yes all \u672C\u4F1A\u8BDD\u653E\u884C\u540C\u7C7B\u64CD\u4F5C\uFF0C\u62D2\u7EDD/no \u62D2\u7EDD\uFF08${timeoutSeconds}\u79D2\u8D85\u65F6\u81EA\u52A8\u62D2\u7EDD\uFF09`;
    await this.sendWeixinText(userId, prompt);
    return await this.approvalReplies.wait(String(request.requestId ?? "") || randomUUID3(), { channelContext: userId, userId }, this.approvalTimeoutMs);
  }
  async onUserInputRequest(request) {
    const threadId = String(request.threadId ?? "");
    const userId = this.findUserIdForThread(threadId);
    if (!userId) {
      console.warn("No user for thread; resolving user input empty");
      return emptyUserInputResponse();
    }
    const steps = splitUserInputRequestByQuestion(request);
    if (steps.length === 0) {
      return emptyUserInputResponse();
    }
    const responses = [];
    for (const step of steps) {
      const response = await this.requestUserInputStep({
        userId,
        request: step.request,
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
    await this.sendWeixinText(params.userId, `\u2753 \u9700\u8981\u4F60\u56DE\u7B54 DotCraft \u95EE\u9898
${buildUserInputPrompt(params.request, { title: params.promptTitle })}`);
    return await new Promise((resolve5) => {
      const previous = this.userInputWaiters.get(params.userId);
      previous?.resolve(emptyUserInputResponse());
      this.userInputWaiters.set(params.userId, {
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
  updateContextToken(userId, token) {
    if (!token)
      return;
    this.contextTokens[userId] = token;
    this.getState().saveContextTokens(this.contextTokens);
  }
  async handleInboundUserMessage(msg) {
    const from = msg.from_user_id ?? "";
    if (!from)
      return;
    this.updateContextToken(from, msg.context_token);
    const text = msg.item_list?.map((i) => i.type === 1 ? i.text_item?.text ?? "" : "").join("").trim() ?? "";
    const approver = { channelContext: from, userId: from };
    if (this.approvalReplies.tryResolve(approver, text))
      return;
    if (await this.tryHandleUserInputReply(from, text))
      return;
    if (this.approvalReplies.hasPending(approver) && !await this.isCommand(text)) {
      await this.approvalReplies.remindIfPending(approver);
      return;
    }
    const name = from;
    void this.handleMessage({
      userId: from,
      userName: name,
      text,
      channelContext: from,
      directTarget: from,
      senderExtra: { senderRole: "admin" }
    }).catch((e) => console.error("handleMessage error:", e));
  }
  async tryHandleUserInputReply(userId, text) {
    const pending = this.userInputWaiters.get(userId);
    if (!pending || await this.isCommand(text))
      return false;
    const response = userInputResponseFromText(pending.request, text);
    if (!response) {
      await this.sendWeixinText(userId, buildUserInputPrompt(pending.request, { title: pending.promptTitle }));
      return true;
    }
    this.userInputWaiters.delete(userId);
    pending.resolve(response);
    return true;
  }
  resolveAllPendingUserInputs(response) {
    for (const [userId, pending] of this.userInputWaiters) {
      pending.resolve(response);
      this.userInputWaiters.delete(userId);
    }
  }
};

// dist/module.js
function createModule(context) {
  const adapter = new WeixinAdapter();
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
      continue;
    }
  }
  return parsed;
}
function printLifecycleError(status, detail) {
  console.error(JSON.stringify({
    code: status,
    message: detail ?? (status === "configMissing" ? "Module config file not found." : "Module config is invalid.")
  }));
}
function waitForShutdownSignal() {
  return new Promise((resolve5) => {
    const onSigint = () => resolve5("SIGINT");
    const onSigterm = () => resolve5("SIGTERM");
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
async function renderQrInTerminal(url) {
  logInfo(`
Scan this QR with WeChat:
${url}
`);
  if (process.env.DOTCRAFT_CHANNEL_TRANSPORT === "stdio") {
    return;
  }
  const qrcodeTerminal = await Promise.resolve().then(() => __toESM(require_main(), 1));
  try {
    qrcodeTerminal.default.generate(url, { small: true });
  } catch {
  }
}
async function runWorkspaceMode(args) {
  if (!args.workspacePath) {
    throw new Error("Missing value for --workspace.");
  }
  const workspaceRoot = resolve4(args.workspacePath);
  const context = {
    workspaceRoot,
    craftPath: resolveHostedCraftPath(workspaceRoot),
    channelName: manifest.channelName,
    moduleId: manifest.moduleId,
    configOverridePath: args.configPath ? resolve4(args.configPath) : void 0
  };
  const instance = createModule(context);
  let lastQrUrl = "";
  instance.onStatusChange((status2, error) => {
    logInfo(`[weixin] lifecycle=${status2}` + (error?.code ? ` code=${error.code}` : "") + (error?.message ? ` message=${error.message}` : ""));
    if (status2 === "authRequired" && !process.env.DOTCRAFT_CHANNEL_CRAFT_PATH) {
      const qrUrl = String(error?.detail?.qrUrl ?? "");
      if (qrUrl && qrUrl !== lastQrUrl) {
        lastQrUrl = qrUrl;
        void renderQrInTerminal(qrUrl);
      }
    }
  });
  await instance.start();
  const status = instance.getStatus();
  if (status === "configMissing" || status === "configInvalid") {
    printLifecycleError(status, instance.getError()?.message);
    process.exitCode = 1;
    return;
  }
  if (status === "stopped") {
    const err = instance.getError();
    console.error(`[weixin] startup failed: ${err?.message ?? "unknown error"}`);
    process.exitCode = 1;
    return;
  }
  const signal = await waitForShutdownSignal();
  logInfo(`[weixin] shutdown signal: ${signal}`);
  await instance.stop();
}
async function runFromCommandLine() {
  const args = parseArgs(process.argv.slice(2));
  try {
    await runWorkspaceMode(args);
  } catch (error) {
    console.error("[weixin] startup failed:", error);
    process.exit(1);
  }
}
void runFromCommandLine();
export {
  runFromCommandLine
};
