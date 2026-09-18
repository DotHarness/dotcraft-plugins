"""Start the bridge without installing anything: blender --python bridge/bootstrap.py

A Blender the user opened needs the add-on installed instead, which
`scripts/install-extension.ps1` does in one call.
"""

import os
import sys
import time
import traceback

import bpy

_BRIDGE_ROOT = os.path.dirname(os.path.abspath(__file__))
if _BRIDGE_ROOT not in sys.path:
    sys.path.insert(0, _BRIDGE_ROOT)


def _fallback_log(message):
    """Record a failure that happens before the bridge's own logging is importable."""
    base = os.environ.get("LOCALAPPDATA") or os.path.join(
        os.path.expanduser("~"), ".local", "state"
    )
    directory = os.path.join(base, "DotCraft", "blender-bridge")
    try:
        os.makedirs(directory, exist_ok=True)
        path = os.path.join(directory, "bridge-%d.log" % os.getpid())
        with open(path, "a", encoding="utf-8") as handle:
            handle.write("%s %s\n" % (time.strftime("%H:%M:%S"), message))
    except OSError:
        pass


def _suppress_splash():
    """The splash covers the 3D view until clicked, so the first capture would show it instead
    of the scene. Preference saving is turned off first so this never rewrites what the user chose.
    """
    preferences = bpy.context.preferences
    preferences.use_preferences_save = False
    preferences.view.show_splash = False


try:
    import dotcraft_bridge

    _suppress_splash()
    dotcraft_bridge.register()
except Exception:
    _fallback_log("bootstrap failed from %s\n%s" % (_BRIDGE_ROOT, traceback.format_exc()))
    raise
