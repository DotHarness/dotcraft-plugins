"""Command handlers. Every function here runs on Blender's main thread."""

import base64
import contextlib
import io
import os
import tempfile
import time
import traceback

import bpy

from . import api, jobs
from .protocol import PROTOCOL_VERSION, ProtocolError

_api = api.Api()


def dispatch(kind, params):
    handler = _HANDLERS.get(kind)
    if handler is None:
        raise ProtocolError("UnknownCommand", "No command named %r." % kind)
    return handler(params or {})


def _ping(_params):
    return {
        "protocolVersion": PROTOCOL_VERSION,
        "blenderVersion": bpy.app.version_string,
        "pid": os.getpid(),
        "background": bpy.app.background,
        "filepath": bpy.data.filepath,
    }


def _status(_params):
    scene = bpy.context.scene
    active = bpy.context.view_layer.objects.active
    return {
        "blenderVersion": bpy.app.version_string,
        "filepath": bpy.data.filepath,
        "unsaved": bpy.data.is_dirty,
        "scene": scene.name,
        "frame": scene.frame_current,
        "frameRange": [scene.frame_start, scene.frame_end],
        "engine": scene.render.engine,
        "mode": bpy.context.mode,
        "activeObject": active.name if active else None,
        "selected": [o.name for o in bpy.context.selected_objects],
        "counts": {
            "objects": len(bpy.data.objects),
            "meshes": len(bpy.data.meshes),
            "materials": len(bpy.data.materials),
            "collections": len(bpy.data.collections),
        },
        "hasViewport": _api.view3d() is not None,
        "jobs": [j.snapshot() for j in jobs.active()],
    }


def _scene(params):
    detail = params.get("detail", "summary")
    scene = bpy.context.scene
    payload = {
        "name": scene.name,
        "frame": scene.frame_current,
        "engine": scene.render.engine,
        "resolution": [scene.render.resolution_x, scene.render.resolution_y],
        "objects": [_object_summary(o) for o in scene.objects],
    }
    if detail == "full":
        payload["collections"] = [
            {"name": c.name, "objects": [o.name for o in c.objects]}
            for c in bpy.data.collections
        ]
        payload["materials"] = [m.name for m in bpy.data.materials]
        payload["worldNodes"] = bool(scene.world and scene.world.use_nodes)
    return payload


def _object(params):
    name = params.get("name")
    target = bpy.data.objects.get(name) if name else None
    if target is None:
        raise ProtocolError("ObjectNotFound", "No object named %r." % name)
    payload = _object_summary(target)
    payload.update(
        {
            "rotationEuler": [round(v, 6) for v in target.rotation_euler],
            "scale": [round(v, 6) for v in target.scale],
            "dimensions": [round(v, 6) for v in target.dimensions],
            "parent": target.parent.name if target.parent else None,
            "children": [c.name for c in target.children],
            "modifiers": [{"name": m.name, "type": m.type} for m in target.modifiers],
            "materials": [s.material.name for s in target.material_slots if s.material],
            "collections": [c.name for c in target.users_collection],
        }
    )
    data = target.data
    if target.type == "MESH" and data is not None:
        payload["mesh"] = {
            "vertices": len(data.vertices),
            "edges": len(data.edges),
            "polygons": len(data.polygons),
            "uvLayers": [layer.name for layer in data.uv_layers],
            "shapeKeys": len(data.shape_keys.key_blocks) if data.shape_keys else 0,
        }
    return payload


def _object_summary(target):
    return {
        "name": target.name,
        "type": target.type,
        "location": [round(v, 6) for v in target.location],
        "visible": not target.hide_viewport,
        "selected": target.select_get() if target.name in bpy.context.view_layer.objects else False,
    }


def _execute(params):
    code = params.get("code")
    if not isinstance(code, str) or not code.strip():
        raise ProtocolError("InputInvalid", "`code` must be a non-empty string.")

    out = io.StringIO()
    env = {"__name__": "__dotcraft__", "bpy": bpy, "dc": _api}
    _api.take_result()
    try:
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
            exec(compile(code, "<blender.execute>", "exec"), env)
    except Exception:
        raise ExecutionError(traceback.format_exc(), out.getvalue())
    return {"stdout": out.getvalue(), "value": _api.take_result()}


class ExecutionError(Exception):
    def __init__(self, formatted, stdout):
        super().__init__(formatted)
        self.formatted = formatted
        self.stdout = stdout


def _documentation(_params):
    return {"text": api.DOCUMENTATION}


def _view(params):
    max_size = int(params.get("maxSize", 800))
    viewport = _api.view3d()
    if viewport is None:
        raise ProtocolError(
            "NoViewport",
            "This Blender session has no 3D viewport. Use blender.render for an image.",
        )
    window, area, region = viewport
    raw = os.path.join(tempfile.gettempdir(), "dotcraft_view_%d.png" % os.getpid())
    with bpy.context.temp_override(window=window, area=area, region=region):
        bpy.ops.screen.screenshot_area(filepath=raw)
    try:
        encoded, width, height = _encode_png(raw, max_size)
    finally:
        _unlink(raw)
    return {"format": "png", "width": width, "height": height, "base64": encoded}


def _encode_png(path, max_size):
    image = bpy.data.images.load(path)
    try:
        width, height = image.size
        if max_size and max(width, height) > max_size:
            ratio = max_size / float(max(width, height))
            width, height = max(1, int(width * ratio)), max(1, int(height * ratio))
            image.scale(width, height)
        scaled = os.path.join(tempfile.gettempdir(), "dotcraft_view_scaled_%d.png" % os.getpid())
        image.file_format = "PNG"
        image.save(filepath=scaled)
        try:
            with open(scaled, "rb") as handle:
                return base64.b64encode(handle.read()).decode("ascii"), width, height
        finally:
            _unlink(scaled)
    finally:
        bpy.data.images.remove(image)


def _unlink(path):
    try:
        os.unlink(path)
    except OSError:
        pass


def _render(params):
    scene = bpy.context.scene
    if jobs.active("render"):
        raise ProtocolError("RenderBusy", "A render job is already running.")

    filepath = params.get("filepath") or os.path.join(
        tempfile.gettempdir(), "dotcraft_render_%d.png" % os.getpid()
    )
    if params.get("engine"):
        _set_engine(scene, params["engine"])
    if params.get("resolution"):
        scene.render.resolution_x, scene.render.resolution_y = params["resolution"]
    if params.get("frame") is not None:
        scene.frame_set(int(params["frame"]))
    # Blender always appends the frame number and its own extension to `filepath`, so it is given
    # the requested path without one and the result is moved onto the exact path afterwards.
    scene.render.image_settings.file_format = _format_for(filepath)
    scene.render.use_file_extension = True
    scene.render.filepath = os.path.splitext(filepath)[0]

    job = jobs.create(
        "render",
        {
            "filepath": filepath,
            "engine": scene.render.engine,
            "resolution": [scene.render.resolution_x, scene.render.resolution_y],
            "frame": scene.frame_current,
        },
    )

    if bpy.app.background or _api.view3d() is None:
        try:
            bpy.ops.render.render(write_still=True)
            for candidate in _candidates(filepath):
                if os.path.exists(candidate):
                    if os.path.abspath(candidate) != os.path.abspath(filepath):
                        os.replace(candidate, filepath)
                    break
            job.complete({"filepath": filepath, "bytes": _size(filepath)})
        except Exception:
            job.fault(traceback.format_exc())
        return job.snapshot()

    _install_render_handlers(job)
    bpy.ops.render.render("INVOKE_DEFAULT", write_still=True)
    return job.snapshot()


FORMATS = {
    ".png": "PNG",
    ".jpg": "JPEG",
    ".jpeg": "JPEG",
    ".exr": "OPEN_EXR",
    ".tif": "TIFF",
    ".tiff": "TIFF",
    ".webp": "WEBP",
    ".bmp": "BMP",
    ".tga": "TARGA",
}


def _format_for(filepath):
    return FORMATS.get(os.path.splitext(filepath)[1].lower(), "PNG")


COLLECT_TIMEOUT = 60.0


def _candidates(filepath):
    """Where the still may land: write_still appends the format's own extension to the path."""
    base = os.path.splitext(filepath)[0]
    return [filepath, base] + [base + ext for ext in FORMATS]


def _collect_when_written(job):
    """Finish the job once the file exists, moving it onto the exact requested path.

    render_complete fires before the still reaches disk, and `bpy.context` is restricted inside a
    handler, so the wait runs on a timer and looks only at the filesystem.
    """
    filepath = job.detail["filepath"]
    deadline = time.time() + COLLECT_TIMEOUT

    def _poll():
        for candidate in _candidates(filepath):
            if not os.path.exists(candidate):
                continue
            try:
                if os.path.abspath(candidate) != os.path.abspath(filepath):
                    os.replace(candidate, filepath)
                job.complete({"filepath": filepath, "bytes": _size(filepath)})
            except Exception:
                job.fault(traceback.format_exc())
            return None
        if time.time() > deadline:
            job.fault("Blender wrote no output for %r." % filepath)
            return None
        return 0.05

    bpy.app.timers.register(_poll)


def _set_engine(scene, engine):
    allowed = [item.identifier for item in scene.render.bl_rna.properties["engine"].enum_items]
    if engine not in allowed:
        raise ProtocolError(
            "EngineUnavailable",
            "Engine %r is not available in Blender %s. Available: %s."
            % (engine, bpy.app.version_string, ", ".join(allowed)),
        )
    scene.render.engine = engine


def _install_render_handlers(job):
    handlers = bpy.app.handlers

    def _finish(*_args):
        # render_complete fires before the still is on disk, so the move waits for the file.
        _remove()
        _collect_when_written(job)

    def _cancel(*_args):
        _remove()
        job.cancel("Render cancelled in Blender.")

    def _remove():
        for collection, callback in (
            (handlers.render_complete, _finish),
            (handlers.render_cancel, _cancel),
        ):
            if callback in collection:
                collection.remove(callback)

    handlers.render_complete.append(_finish)
    handlers.render_cancel.append(_cancel)


def _size(path):
    return os.path.getsize(path) if os.path.exists(path) else -1


def _job(params):
    job_id = params.get("jobId")
    if job_id is None:
        return {"jobs": jobs.listing()}
    job = jobs.get(job_id)
    if job is None:
        raise ProtocolError("JobNotFound", "No job %r." % job_id)
    if params.get("terminate") and job.state == "running":
        job.cancel("Cancellation requested by the caller.")
    return job.snapshot()


def _image(params):
    """Read a rendered file back as base64, downscaled."""
    path = params.get("filepath")
    if not path or not os.path.exists(path):
        raise ProtocolError("ImageNotFound", "No file at %r." % path)
    encoded, width, height = _encode_png(path, int(params.get("maxSize", 800)))
    return {"format": "png", "width": width, "height": height, "base64": encoded}


_HANDLERS = {
    "ping": _ping,
    "status": _status,
    "scene": _scene,
    "object": _object,
    "execute": _execute,
    "documentation": _documentation,
    "view": _view,
    "render": _render,
    "job": _job,
    "image": _image,
}
