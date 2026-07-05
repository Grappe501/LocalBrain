# Factory Constitution v1.0

> **Status:** **FROZEN** — constitutional document for the manufacturing layer  
> **Release:** `v1.0.0-factory-certified`  
> **Engine:** ENG-FAC-001 · **Contract:** [FACTORY_CONTRACT](./FACTORY_CONTRACT.md)  
> **Certification:** [PMO manufacturing record](./certification/)  
> **Amendments:** Factory v1.1+ amend this constitution — never implicit behavior change

---

## Preamble

LocalBrain V1 separates **manufacturing** from **personalization**.

The Factory is the sovereign manufacturing layer. It produces identical empty executive institutions. It does not learn, remember, or personalize. Every institution traceable to this release shares the certified institutional structure defined at lock.

This constitution governs the Factory layer only. Memory OS, Communications, and Executive Intelligence are downstream — they plug into Factory output; they do not modify Factory behavior.

---

## Article I — Purpose

The Factory exists to answer one question:

> **Can we manufacture 10,000 identical empty executive institutions?**

Success means: any customer with no knowledge of the builder can Download → Install → Launch → receive the same institutional structure — constitution reference, Executive Office shell, departments, capability graph framework, empty vaults, passport framework, birth certificate schema, and Convention contract bundle.

The Factory **manufactures institutions**. It does not operate them.

---

## Article II — Immutable principles

These principles are binding for Factory v1.0 and may not be weakened without a new certification cycle.

| # | Principle |
| - | --------- |
| P1 | **Determinism** — identical inputs produce identical institutional structure (`structural_hash` parity). |
| P2 | **Empty brain** — no person-specific seeds, sample memories, or ingestion content at manufacture. |
| P3 | **Convention embedding** — all five Convention contracts (S1–S5) bundled at manufacture. |
| P4 | **Birth certificate** — every manufactured institution receives a complete birth certificate at provision. |
| P5 | **Separation** — Factory never personalizes; personalization is Memory OS responsibility. |
| P6 | **Traceability** — every manufacture, install, and certification event is auditable. |
| P7 | **Integrity** — sealed packages carry structural and integrity hashes; tampering fails verification. |
| P8 | **Repeatability** — rebuild validation must reproduce `structural_hash` across manufacture runs. |

---

## Article III — What the Factory may do

| Permitted | Description |
| --------- | ----------- |
| Manufacture | Produce empty institutions via `manufactureEmptyInstitution()` |
| Package | Build sealed `FactoryPackage` with hashes |
| Install | Install from package or native installer artifact |
| Verify | Integrity, installation, and certification checks |
| Upgrade | Same `structural_hash` only — structural change requires fresh install |
| Uninstall | Remove installation record; preserve audit trail |
| Certify | Run PMO ten-gate certification |
| Persist | Birth certificate and install record to filesystem at install |
| Export | Empty institution manifest and birth certificate schema |

---

## Article IV — What the Factory may not do

| Prohibited | Rationale |
| ---------- | --------- |
| Store personal memories | Memory OS domain |
| Ingest external data | Communications / ingestion pipeline |
| Learn or adapt behavior | Violates manufacturing determinism |
| Personalize profiles | Executive Discovery + Memory OS |
| Activate connectors | Communications Office |
| Modify Convention contracts | Convention Close is upstream |
| Embed Steve/Kelly/Chris defaults | Empty brain invariant |
| Run recall or reasoning | Executive Intelligence domain |
| Change behavior post-lock | Requires new certification cycle |

```txt
Factory
├── NEVER learns
├── NEVER stores memories
├── NEVER personalizes
├── NEVER changes behavior
└── ONLY manufactures institutions
```

---

## Article V — Certification requirements

Factory v1.0 is certified only when all **ten PMO gates** pass:

| Gate | Criterion |
| ---- | --------- |
| Manufacturing | Package builds with valid integrity |
| Installation | Install from artifact + verify |
| Integrity | Package integrity hash valid |
| Repeatability | Deterministic `structural_hash` |
| Empty Brain | Canonical profile — no personal seeds |
| Convention | All five contracts embedded |
| Executive Office | ≥8 departments |
| Capability Graph | Graph certified |
| Birth Certificate | Persisted to disk at install |
| Package Verification | `INSTALL.sha256` matches |

**Ceremony:** `npm run factory:certify -- --lock`

**Artifacts:** Immutable record at [docs/factory/certification/](./certification/)

**Lock:** `local_data/v1-certified-modules.json` — `factory` module locked on pass.

No Factory code ships without passing certification. Regression on any gate blocks release.

---

## Article VI — Versioning policy

| Artifact | Version | Rule |
| -------- | ------- | ---- |
| Factory Constitution | **1.0** | This document — amend only via explicit v1.1+ |
| Factory Contract | `FAC-2026-07` | Engineering contract — references this constitution |
| Factory release | `v1.0.0-factory-certified` | Git tag + certification artifacts |
| Factory engine | `FAC-1.0.0` | Birth certificate `factory_version` field |
| Installer | `INS-1.0.0` | Native artifact format version |
| Package | `package_version: 1` | Sealed package schema version |

**Version bumps:**

- **Patch** (FAC-1.0.x) — bug fixes that preserve `structural_hash` and all gates
- **Minor** (FAC-1.x) — additive manufacturing capability; requires re-certification
- **Major** (FAC-2.x) — structural change; new constitution article review + full PMO cycle

`structural_hash` change always requires fresh install — never in-place upgrade.

---

## Article VII — Upgrade policy

| Scenario | Policy |
| -------- | ------ |
| Same `structural_hash`, new `package_id` | Upgrade permitted — reinstall package contents |
| `structural_hash` change | **Rejected** — fresh install required |
| Factory Constitution amendment | New certification cycle before lock |
| Convention contract version change | Factory must re-embed; re-certify |
| Post-lock code change | Forbidden without unlock + re-certification |

Upgrade preserves install record audit trail (`upgraded_at`). Uninstall sets `uninstalled_at` — records retained.

---

## Article VIII — Manufacturing guarantees

For every institution manufactured under Factory v1.0:

| Guarantee | Mechanism |
| --------- | --------- |
| **Structural parity** | `structural_hash` invariant across manufactures |
| **Empty brain** | `CANONICAL_EMPTY_DISPLAY_NAME` · onboarding not completed |
| **Convention bundle** | S1–S5 version strings in birth certificate |
| **Birth certificate completeness** | All required fields present at provision |
| **No secrets in export** | Manufacture verification scan |
| **Installer integrity** | `INSTALL.sha256` over `institution.package.json` |
| **Filesystem persistence** | Birth certificate written at install path |
| **Traceability** | `manufacture_id` · `install_id` · certification report |

**Baseline release:** `v1.0.0-factory-certified`  
**Baseline structural hash:** recorded in [factory-release.json](./certification/factory-release.json)

Every future institution is traceable to this certified release via `structural_hash` and birth certificate `factory_version`.

---

## Article IX — Backward compatibility

| Consumer | Expectation |
| -------- | ----------- |
| Memory OS | Receives empty framework only — never depends on Factory runtime changes |
| Installer artifacts | `INS-1.0.0` format readable for life of v1.0 line |
| Birth certificate schema | Additive fields only in v1.0.x — no removed required fields |
| API endpoints | `/api/factory/*` stable for v1.0 — breaking changes → v2 |
| Certification gates | Ten gates fixed for v1.0 — new gates → v1.1 constitution |

Memory OS and downstream systems **must not** require Factory unlock to function. Factory output is a stable interface.

---

## Article X — Relationship to other layers

```txt
Factory manufactures institutions.
Memory OS personalizes institutions.
Communications activates institutions.
```

```txt
Factory
      │
      ▼
Institution (empty)
      │
      ▼
Memory OS
      │
      ▼
Learning
      │
      ▼
Identity
      │
      ▼
Executive Intelligence
```

| Layer | Starts when |
| ----- | ----------- |
| Factory | Install complete |
| Memory OS | After Factory lock · spec freeze |
| Communications | After Memory OS bootstrap |
| Executive Intelligence | Uses memory — never is memory |

---

## Article XI — Amendment process

1. Propose amendment to Factory Constitution (v1.1 draft).
2. PMO review — impact on manufacturing guarantees and downstream consumers.
3. Implement against amended contract.
4. Full ten-gate re-certification.
5. New release tag (e.g. `v1.1.0-factory-certified`).
6. New certification artifacts — prior artifacts remain historical record.

**Factory v1.0 is locked.** No amendments apply retroactively to `v1.0.0-factory-certified`.

---

## Article XII — Certification reference

| Field | Value |
| ----- | ----- |
| Release tag | `v1.0.0-factory-certified` |
| Certification date | 2026-07-01 |
| Gates passed | 10 / 10 |
| Status | CERTIFIED · LOCKED |
| Ready for | Memory OS specification |

Manufacturing record: [certification/](./certification/)

---

*Factory Constitution v1.0 · LocalBrain V1 · ENG-FAC-001*
