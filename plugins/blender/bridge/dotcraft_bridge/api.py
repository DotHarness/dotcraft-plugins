"""The `dc` surface injected into every `execute` call."""

import bpy


class Api:
    """Injected as `dc`. `dc.documentation()` is the entry point."""

    def __init__(self):
        self._result = None


    def result(self, value):
        """Attach a structured JSON result to this execution."""
        self._result = value
        return value

    def take_result(self):
        value = self._result
        self._result = None
        return value


    def api(self, path):
        """Describe a live API path from Blender's own RNA, correct for the running version."""
        target = _resolve(path)
        if target is None:
            return {"path": path, "found": False}
        rna = getattr(target, "get_rna_type", None)
        if callable(rna):
            rna_type = rna()
            return {
                "path": path,
                "found": True,
                "kind": "operator",
                "description": rna_type.description,
                "parameters": [
                    _describe_property(p)
                    for p in rna_type.properties
                    if p.identifier != "rna_type"
                ],
            }
        bl_rna = getattr(target, "bl_rna", None)
        if bl_rna is not None:
            return {
                "path": path,
                "found": True,
                "kind": "type",
                "description": bl_rna.description,
                "properties": [
                    _describe_property(p)
                    for p in bl_rna.properties
                    if p.identifier != "rna_type"
                ],
            }
        return {
            "path": path,
            "found": True,
            "kind": type(target).__name__,
            "members": [m for m in dir(target) if not m.startswith("_")][:200],
        }

    def search(self, term, limit=40):
        term = term.lower()
        hits = []
        for category in dir(bpy.ops):
            if category.startswith("_"):
                continue
            module = getattr(bpy.ops, category)
            for name in dir(module):
                if name.startswith("_"):
                    continue
                full = "%s.%s" % (category, name)
                if term in full.lower():
                    hits.append("bpy.ops." + full)
                    if len(hits) >= limit:
                        return hits
        return hits


    def obj(self, name):
        return bpy.data.objects.get(name)

    def selected(self):
        return [o.name for o in bpy.context.selected_objects]

    def select(self, *names):
        """Replace the selection and make the last named object active."""
        bpy.ops.object.select_all(action="DESELECT")
        target = None
        for name in names:
            target = bpy.data.objects.get(name)
            if target is None:
                raise KeyError("no object named %r" % name)
            target.select_set(True)
        if target is not None:
            bpy.context.view_layer.objects.active = target
        return [o.name for o in bpy.context.selected_objects]

    def view3d(self):
        """Return (window, area, region) for the first 3D viewport, or None in background mode."""
        for window in bpy.context.window_manager.windows:
            for area in window.screen.areas:
                if area.type != "VIEW_3D":
                    continue
                region = next((r for r in area.regions if r.type == "WINDOW"), None)
                if region is not None:
                    return window, area, region
        return None

    def documentation(self):
        return DOCUMENTATION


def _resolve(path):
    parts = path.split(".")
    if parts and parts[0] == "bpy":
        parts = parts[1:]
    target = bpy
    for part in parts:
        target = getattr(target, part, None)
        if target is None:
            return None
    return target


def _describe_property(prop):
    described = {"name": prop.identifier, "type": prop.type}
    if prop.description:
        described["description"] = prop.description
    if prop.type == "ENUM":
        described["values"] = [item.identifier for item in prop.enum_items][:64]
    return described


DOCUMENTATION = """\
`dc` helpers available inside blender.execute
=============================================

dc.result(value)       Attach a JSON result to this call. Prefer it over printing
                       when the caller needs structured data back.
dc.api(path)           Describe a live API path from Blender's own RNA, e.g.
                       dc.api("bpy.ops.mesh.primitive_cube_add") or
                       dc.api("bpy.types.SubsurfModifier"). Always correct for the
                       running Blender version. Use it instead of guessing enums.
dc.search(term)        Find operator paths containing `term`.
dc.obj(name)           bpy.data.objects.get(name)
dc.selected()          Names of the currently selected objects.
dc.select(*names)      Replace the selection; the last name becomes active.
dc.view3d()            (window, area, region) of the first 3D viewport, or None.

Notes
-----
* `bpy` is already imported. stdout is captured and returned.
* Operators that need a viewport need an override:
      win, area, region = dc.view3d()
      with bpy.context.temp_override(window=win, area=area, region=region):
          bpy.ops.view3d.view_selected()
* Do not start threads that touch bpy. Everything here already runs on the main
  thread; bpy is not thread-safe anywhere else.
* Long renders belong in blender.render, which returns a job id, not in execute,
  which blocks the bridge for its whole duration.
"""
