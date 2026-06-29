# Engines (`backend/src/engines/`)

> Shared backend services the **kernel hosts**; **modules consume** via engine APIs.

## Migration note (LB-OS-106)

Workspace registry currently lives in `backend/src/workspaces/` — target home:

```txt
engines/workspace-registry/   (ENG-WR-001)
```

New engines land here. Modules declare `ENG-*` dependencies in manifests — never import another module directly.

See [Engine Registry](../../docs/LOCALBRAIN_ENGINE_REGISTRY.md).
