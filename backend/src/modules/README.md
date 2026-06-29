# LocalBrain Modules (`backend/src/modules/`)

> **LB-OS-106+** — every department/studio is a module with a manifest.

## Layout

```txt
modules/
├── README.md           ← you are here
├── manifests/          ← JSON manifests (registered at boot)
└── <module-id>/        ← domain package (code lands in LB-OS-011+)
```

## Registration

1. Add `manifests/<module-id>.json` conforming to `@localbrain/shared` `ModuleManifest`.
2. Restart backend — `moduleLoader` validates and registers.
3. Frontend shell reads `GET /api/modules` for nav and lazy routes.

## Manifest required fields

```txt
module_id · name · domain · routes · permissions · tools · agents
data_sources · capabilities (with dependencies) · dependencies
nav_placement · lazy_load_boundary
```

**No domain hard-coding in kernel** — if it is not in a manifest, it does not ship as a department.
