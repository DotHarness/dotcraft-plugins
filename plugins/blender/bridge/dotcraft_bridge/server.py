"""Client sockets are served on worker threads, but nothing there touches `bpy`: every
request is parked on a queue that a `bpy.app.timers` callback drains on the main thread,
which is the only thread where `bpy` is safe.
"""

import json
import os
import queue
import secrets
import socket
import threading
import time
import traceback

import bpy

from . import commands, protocol
from .protocol import ProtocolError

HOST = "127.0.0.1"
DRAIN_INTERVAL = 0.02
HANDSHAKE_TIMEOUT = 5.0
REQUEST_TIMEOUT = 600.0

_state = {"socket": None, "thread": None, "port": None, "token": None, "descriptor": None}
_requests = queue.Queue()
_stop = threading.Event()


def discovery_directory():
    """A DotCraft-owned location, stable across Blender versions."""
    base = os.environ.get("LOCALAPPDATA") or os.path.join(
        os.path.expanduser("~"), ".local", "state"
    )
    path = os.path.join(base, "DotCraft", "blender-bridge")
    os.makedirs(path, exist_ok=True)
    return path


def _descriptor_path():
    return os.path.join(discovery_directory(), "bridge-%d.json" % os.getpid())


def log_path(pid=None):
    """Where this session records what it did, for a caller that cannot see Blender's stdout."""
    return os.path.join(discovery_directory(), "bridge-%d.log" % (pid or os.getpid()))


def log(message):
    try:
        with open(log_path(), "a", encoding="utf-8") as handle:
            handle.write("%s %s\n" % (time.strftime("%H:%M:%S"), message))
    except OSError:
        pass


def _write_descriptor(port, token):
    path = _descriptor_path()
    payload = {
        "protocolVersion": protocol.PROTOCOL_VERSION,
        "pid": os.getpid(),
        "port": port,
        "token": token,
        "blenderVersion": bpy.app.version_string,
        "background": bpy.app.background,
        "filepath": bpy.data.filepath,
        "startedAt": time.time(),
    }
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
    _state["descriptor"] = path
    return path


def _remove_descriptor():
    path = _state.get("descriptor")
    if path:
        try:
            os.unlink(path)
        except OSError:
            pass
    _state["descriptor"] = None


def _prune_stale_descriptors():
    for name in os.listdir(discovery_directory()):
        if not name.startswith("bridge-") or not name.endswith(".json"):
            continue
        path = os.path.join(discovery_directory(), name)
        try:
            with open(path, "r", encoding="utf-8") as handle:
                pid = json.load(handle).get("pid")
        except (OSError, ValueError):
            pid = None
        if pid is None or not _pid_alive(pid):
            for stale in (path, log_path(pid) if pid else None):
                if not stale:
                    continue
                try:
                    os.unlink(stale)
                except OSError:
                    pass


def _pid_alive(pid):
    if os.name == "nt":
        import ctypes

        handle = ctypes.windll.kernel32.OpenProcess(0x1000, False, int(pid))
        if not handle:
            return False
        ctypes.windll.kernel32.CloseHandle(handle)
        return True
    try:
        os.kill(int(pid), 0)
    except OSError:
        return False
    return True


def _serve_client(conn):
    try:
        conn.settimeout(HANDSHAKE_TIMEOUT)
        hello = protocol.decode(conn)
        if not isinstance(hello, dict) or hello.get("type") != "hello":
            _send(conn, protocol.fail(None, "HandshakeRequired", "Send a hello frame first."))
            return
        if not secrets.compare_digest(str(hello.get("token", "")), _state["token"] or ""):
            _send(conn, protocol.fail(hello.get("id"), "Unauthorized", "Invalid bridge token."))
            return
        # Even the handshake's identity read goes through the drain: bpy is main-thread only.
        _send(conn, _await_main_thread({"id": hello.get("id"), "type": "ping"}))

        conn.settimeout(None)
        while not _stop.is_set():
            request = protocol.decode(conn)
            if request is None:
                return
            _send(conn, _await_main_thread(request))
    except (OSError, ValueError, ProtocolError):
        pass
    finally:
        try:
            conn.close()
        except OSError:
            pass


def _await_main_thread(request):
    request_id = request.get("id") if isinstance(request, dict) else None
    done = threading.Event()
    box = {}
    _requests.put((request, box, done))
    if not done.wait(timeout=REQUEST_TIMEOUT):
        return protocol.fail(
            request_id,
            "MainThreadTimeout",
            "Blender did not drain the request within %ds. It may be busy in a modal "
            "operator or a long synchronous call." % REQUEST_TIMEOUT,
        )
    return box["response"]


def _send(conn, payload):
    conn.sendall(protocol.encode(payload))


def _accept_loop(server):
    while not _stop.is_set():
        try:
            conn, _ = server.accept()
        except OSError:
            return
        threading.Thread(target=_serve_client, args=(conn,), daemon=True).start()


def _drain():
    while True:
        try:
            request, box, done = _requests.get_nowait()
        except queue.Empty:
            break
        try:
            box["response"] = _run(request)
        except Exception:
            box["response"] = protocol.fail(
                request.get("id") if isinstance(request, dict) else None,
                "BridgeFailure",
                traceback.format_exc(),
            )
        finally:
            done.set()
    return DRAIN_INTERVAL


def _run(request):
    if not isinstance(request, dict):
        return protocol.fail(None, "InputInvalid", "Request must be a JSON object.")
    request_id = request.get("id")
    try:
        return protocol.ok(
            request_id, commands.dispatch(request.get("type"), request.get("params"))
        )
    except commands.ExecutionError as error:
        return protocol.fail(
            request_id, "ExecutionFailed", error.formatted, {"stdout": error.stdout}
        )
    except ProtocolError as error:
        return protocol.fail(request_id, error.code, error.message)
    except Exception:
        return protocol.fail(request_id, "BridgeFailure", traceback.format_exc())


def start(port=0):
    if _state["socket"] is not None:
        return _state["port"]
    _stop.clear()
    _prune_stale_descriptors()

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((HOST, port))
    server.listen(8)
    bound = server.getsockname()[1]
    token = secrets.token_hex(24)

    _state.update({"socket": server, "port": bound, "token": token})
    _state["thread"] = threading.Thread(target=_accept_loop, args=(server,), daemon=True)
    _state["thread"].start()
    if not bpy.app.timers.is_registered(_drain):
        bpy.app.timers.register(_drain, persistent=True)
    _write_descriptor(bound, token)
    log("listening on %s:%d (Blender %s)" % (HOST, bound, bpy.app.version_string))
    print("DOTCRAFT_BRIDGE_READY port=%d pid=%d" % (bound, os.getpid()), flush=True)
    return bound


def stop():
    _stop.set()
    server = _state.get("socket")
    if server is not None:
        try:
            server.close()
        except OSError:
            pass
    if bpy.app.timers.is_registered(_drain):
        bpy.app.timers.unregister(_drain)
    _remove_descriptor()
    log("stopped")
    _state.update({"socket": None, "thread": None, "port": None, "token": None})


def status():
    return {"running": _state["socket"] is not None, "port": _state["port"]}
