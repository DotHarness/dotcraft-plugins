"""Frames are a 4-byte big-endian length followed by that many bytes of UTF-8 JSON."""

import json
import struct

HEADER = struct.Struct(">I")
MAX_FRAME = 64 * 1024 * 1024

PROTOCOL_VERSION = 1


class ProtocolError(Exception):
    def __init__(self, code, message):
        super().__init__(message)
        self.code = code
        self.message = message


def encode(payload):
    body = json.dumps(payload, default=str).encode("utf-8")
    if len(body) > MAX_FRAME:
        raise ProtocolError("FrameTooLarge", "Response exceeds %d bytes." % MAX_FRAME)
    return HEADER.pack(len(body)) + body


def read_exactly(sock, count):
    chunks = []
    remaining = count
    while remaining:
        chunk = sock.recv(remaining)
        if not chunk:
            return None
        chunks.append(chunk)
        remaining -= len(chunk)
    return b"".join(chunks)


def decode(sock):
    """Reads one frame. Returns None when the peer closed the connection."""
    header = read_exactly(sock, HEADER.size)
    if header is None:
        return None
    (length,) = HEADER.unpack(header)
    if length > MAX_FRAME:
        raise ProtocolError("FrameTooLarge", "Request exceeds %d bytes." % MAX_FRAME)
    body = read_exactly(sock, length)
    if body is None:
        return None
    return json.loads(body.decode("utf-8"))


def ok(request_id, result):
    return {"id": request_id, "ok": True, "result": result}


def fail(request_id, code, message, result=None):
    payload = {"id": request_id, "ok": False, "error": {"code": code, "message": message}}
    if result is not None:
        payload["result"] = result
    return payload
