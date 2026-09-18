---
name: blender
description: Inspect and drive a running Blender session. Use for Blender scenes, objects, materials, modifiers, bpy Python, viewport capture, and renders.
tools: list, connect, status, scene, execute, view, render, job, disconnect
---

# Blender

The tools connect to a Blender process that is running the DotCraft Bridge add-on. Capability
lives in `blender.execute`, which runs Python on Blender's main thread. The other tools exist
only for what `execute` cannot do: choosing a session, seeing the result, and running work that
outlives one call.

## Connect first

`blender.connect` binds this task to one session and every later call uses it.

- No pid: takes the newest listening session.
- `launch: true`: starts Blender when none is listening.
- `blendFile`: a file to open. Optional — omit it for an empty scene.

A launch that has not finished comes back as `state: "starting"` with a pid. That is not a
failure: call `blender.connect` again and it attaches to that same process instead of starting
another one.

If a later call reports `NotConnected`, the session went away. Reconnect; do not assume the
previous scene state survived.

## Ask Blender, do not guess

Blender's Python API is large and changes between releases. Enum values in particular are
renamed: `BLENDER_EEVEE_NEXT` in 4.x is `BLENDER_EEVEE` in 5.x. Read the running version's real
signature instead of recalling one:

```python
dc.result(dc.api("bpy.ops.mesh.primitive_cube_add"))   # description + every parameter
dc.result(dc.api("bpy.types.SubsurfModifier"))          # properties of a type
dc.result(dc.search("bevel"))                           # operator paths containing "bevel"
```

`dc.documentation()` lists the rest of the helpers. Reach for `dc.api` the moment a call fails
with a type or enum error rather than trying another remembered spelling.

## Writing execute code

`bpy` and `dc` are already in scope. The code runs as a module body: top-level statements are
fine, `return` is a syntax error. stdout comes back as `stdout`; use `dc.result(value)` for
anything the next step needs to read.

```python
import bpy
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(0, 0, 1))
sphere = bpy.context.active_object
sphere.name = "Ball"
sphere.modifiers.new("Smooth", "SUBSURF").levels = 2
dc.result({"object": sphere.name, "verts": len(sphere.data.vertices)})
```

Rules that matter:

- **Operators that act on a viewport need an override**, or they fail with a context error:

  ```python
  win, area, region = dc.view3d()
  with bpy.context.temp_override(window=win, area=area, region=region):
      bpy.ops.view3d.view_selected()
  ```

- **Prefer `bpy.data` over `bpy.ops` when both work.** `bpy.data.objects["Ball"].location.x = 2`
  is exact; the operator equivalent depends on selection and context.
- **Never start a thread that touches `bpy`.** The call already runs on the main thread and `bpy`
  is not safe anywhere else.
- **Keep each call to one step.** A failed call leaves everything before the exception applied,
  so a long script fails halfway with no clean state to resume from.

## Look at the result

The scene text tells you what exists, not what it looks like. Capture the viewport after a
change that was supposed to be visible:

```
blender.view { maxSize: 800 }
```

`blender.scene` returns the graph, and `blender.scene { name: "Ball" }` returns one object with
its mesh statistics, modifiers, materials and parents.

## Rendering

`blender.render` returns a job id immediately and the render proceeds through Blender's own modal
path, so the session stays responsive. Poll with `blender.job { jobId }` until the state leaves
`running`, then read the image back with the reported `filepath`.

Do not render inside `execute`. A synchronous `bpy.ops.render.render()` holds the main thread for
the whole render and blocks every other call until it finishes.

## Before destructive work

Blender's undo stack does not cover what scripts do reliably. Check `blender.status` for
`unsaved` and ask before overwriting a file the user has not saved. `bpy.ops.wm.save_as_mainfile`
with a new path is the safe way to snapshot first.

## Talking about it

Describe what changed in the scene, not the plumbing. Do not mention the bridge, the socket, the
session pid, or `execute` unless the user asks how it works.
