"""Exposes this Blender session to DotCraft over an authenticated loopback socket."""

import bpy

from . import server

bl_info = {
    "name": "DotCraft Bridge",
    "author": "DotHarness",
    "version": (0, 1, 1),
    "blender": (4, 2, 0),
    "category": "Development",
    "description": "Let DotCraft inspect and drive this Blender session.",
}


class DOTCRAFT_OT_start(bpy.types.Operator):
    bl_idname = "dotcraft.bridge_start"
    bl_label = "Start DotCraft Bridge"
    bl_description = "Accept DotCraft connections on the loopback interface"

    def execute(self, _context):
        port = server.start()
        self.report({"INFO"}, "DotCraft Bridge listening on 127.0.0.1:%d" % port)
        return {"FINISHED"}


class DOTCRAFT_OT_stop(bpy.types.Operator):
    bl_idname = "dotcraft.bridge_stop"
    bl_label = "Stop DotCraft Bridge"
    bl_description = "Stop accepting DotCraft connections"

    def execute(self, _context):
        server.stop()
        self.report({"INFO"}, "DotCraft Bridge stopped")
        return {"FINISHED"}


class DOTCRAFT_PT_panel(bpy.types.Panel):
    bl_label = "DotCraft"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "DotCraft"

    def draw(self, _context):
        layout = self.layout
        state = server.status()
        if state["running"]:
            layout.label(text="Listening on port %d" % state["port"], icon="LINKED")
            layout.operator(DOTCRAFT_OT_stop.bl_idname, icon="UNLINKED")
        else:
            layout.label(text="Not listening", icon="UNLINKED")
            layout.operator(DOTCRAFT_OT_start.bl_idname, icon="LINKED")


class DOTCRAFT_Preferences(bpy.types.AddonPreferences):
    bl_idname = __package__

    autostart: bpy.props.BoolProperty(
        name="Start the bridge when Blender opens",
        description="Accept DotCraft connections without opening the sidebar first",
        default=True,
    )

    def draw(self, _context):
        self.layout.prop(self, "autostart")


_CLASSES = (
    DOTCRAFT_OT_start,
    DOTCRAFT_OT_stop,
    DOTCRAFT_PT_panel,
    DOTCRAFT_Preferences,
)


def register():
    for cls in _CLASSES:
        bpy.utils.register_class(cls)
    if _autostart_enabled():
        server.start()


def unregister():
    server.stop()
    for cls in reversed(_CLASSES):
        bpy.utils.unregister_class(cls)


def _autostart_enabled():
    # No addon entry means this was loaded through `--python` rather than installed,
    # which is already an explicit request to listen.
    addon = bpy.context.preferences.addons.get(__package__)
    if addon is None:
        return True
    return bool(getattr(addon.preferences, "autostart", True))
