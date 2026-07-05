# MILESTONE-FACTORY — Empty Brain Factory

> **LOCALBRAIN V1 ROADMAP** · Design Era CLOSED · Construction mode
>
> ```txt
> ✓ Theory Validation (Peer Review S1–S5)
> ✓ Theory Freeze
> ✓ Convention (Sessions 1–5 + Close)
> ✓ Design Era Close
> ▶ Empty Brain Factory (CERTIFIED & LOCKED · `v1.0.0-factory-certified`)
> □ Memory OS (authorized to begin design)
> □ Communications Office
> □ Commercial Beta
>
> Everything else → VERSION2_BACKLOG.md
> ```

> **Depends on:** [Convention Close](../convention/CONVENTION-CLOSE.md) · [Design Era Close](../LOCALBRAIN_DESIGN_ERA_CLOSE.md)  
> **Engine:** ENG-FAC-001 · **Slices:** LB-OS-PROD-010 · LB-OS-027.0  
> **Next:** Memory OS specification ([MILESTONE-MEMORY-OS](../burt_packets/MILESTONE-MEMORY-OS.md)) — Factory immutable

---

## Mission

> **Manufacture identical empty executive institutions.**

**Success test:** Download → Install → Launch → receive Executive Office, departments, capability graph, Convention contracts, birth certificate — **nothing personal**.

**Deliverable:** [Factory Contract](../factory/FACTORY_CONTRACT.md)

---

## Manufacturing principle

```txt
Factory manufactures institutions.
Memory OS personalizes institutions.
Communications activates institutions.
```

---

## Slices

| Slice | Status | Deliverable |
| ----- | ------ | ----------- |
| 1 | ✅ | Manufacture API · birth certificate · parity tests |
| 2 | ✅ | Sealed package · install · certification engine |
| 3 | ✅ | Native installer artifact · install/upgrade/uninstall · ten-gate PMO certification |
| PMO Certification | ✅ | `v1.0.0-factory-certified` · Factory locked |

---

## Status

**Factory is CERTIFIED and LOCKED.** No further Factory behavior changes without a new certification cycle.

Manufacturing record: [certification/](../factory/certification/)

## API (slice 3)

| Endpoint | Purpose |
| -------- | ------- |
| `POST /api/factory/installer/generate` | Generate native installer artifact on disk |
| `POST /api/factory/installer/install` | Install from artifact directory |
| `GET /api/factory/installer/verify/:installId` | Verify persisted installation |
| `POST /api/factory/installer/upgrade` | Upgrade (same `structural_hash` only) |
| `POST /api/factory/installer/uninstall` | Uninstall |
| `POST /api/factory/installer/first-launch` | Complete first-launch workflow |
| `GET /api/factory/certification` | Ten PMO gates (with installer flow) |
| `POST /api/factory/pmo-certification` | PMO certification · optional Factory lock |

CLI: `npm run factory:generate` · `factory:install` · `factory:certify`

---

## PMO certification gates (ten)

| Gate | Criterion |
| ---- | --------- |
| Manufacturing | Package builds with valid integrity |
| Installation | Install from artifact + verify |
| Integrity | Package integrity hash |
| Repeatability | Deterministic `structural_hash` across rebuilds |
| Empty Brain | Canonical profile — no Steve/Kelly/Chris |
| Convention | All five contracts embedded |
| Executive Office | ≥8 departments |
| Capability Graph | Graph certified |
| Birth Certificate | Persisted to disk at install |
| Package Verification | `INSTALL.sha256` matches |

Lock Factory via `POST /api/factory/pmo-certification` with `{ "lock": true }` only when all ten pass.

---

## Engineering maturity

| Stage | Factory completion |
| ----- | -----------------: |
| After slice 2 | ~45% |
| After slice 3 | ~72% |
| After PMO certification + lock | 100% |

**Current:** 100% — certified `v1.0.0-factory-certified`

---

## Charter

```txt
Can we manufacture 10,000 identical brains?
Did we build what the Constitution specifies?
```

---

*MILESTONE-FACTORY · Construction · 2026*
