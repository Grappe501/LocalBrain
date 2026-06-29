# LB-OS-021 — Executive Workspace Architecture Builder

> **Depends on:** LB-OS-020.5 ✅  
> **Spec:** [Executive Workspace Architecture](../LOCALBRAIN_EXECUTIVE_WORKSPACE_ARCHITECTURE.md) · [Three Worlds & Projection](../LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md)  
> **Next:** LB-OS-022 Digital Land Survey (Physical World)

---

## Goal

Map **Logical World → Projection Layer → Physical World**. Not folders first.

```txt
Executive World   (unchanged in 021 — stub mission links only)
Logical World     Workspace DNA · Organization Tree
Projection Layer  current + recommended projections per workspace
Physical World    H:/C: survey seed (full survey in 022)
Zero disk mutations
```

---

## Five Gates

| Gate | Answer |
| ---- | ------ |
| System | Executive OS |
| Object | LivingWorkspace + Projection interface |
| Module | Migration / workspace architecture |
| EQ | EQ-014 · EQ-015 |
| Leverage | Translation-safe migration to Personal OS |

---

## Build

```txt
shared/     Projection types · StorageProvider stub · WorkspaceBlueprint · PhysicalWorldSurvey
backend/    Blueprint generator · org tree · projection registry · survey API
frontend/   Organization tree · blueprint cards · physical world summary
```

---

## Binding rules

```txt
Workspace identity is Logical — never tied to a drive letter as primary key
Migration = change projection, not workspace_id
StorageProvider: interface/types only — no cloud/NAS runtime in 021
Three Worlds must not collapse in UI copy or data model
```

---

## Exit criteria

```txt
[ ] Projection contract in shared
[ ] Blueprints show current vs recommended projection per workspace
[ ] Physical World survey (H + C) with logical orphan/conflict links
[ ] No mkdir · mv · rename
[ ] Tests for blueprint + projection read paths
```

---

**Commit:** `feat: add executive workspace architecture builder`

---

*Burt packet · LB-OS-021 · planning only until build starts*
