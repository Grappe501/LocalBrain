# Empty Brain Factory — Manufacturing Contract

> **Status:** **FROZEN** — manufacturing contract for ENG-FAC-001  
> **Depends on:** [Convention Close](../convention/CONVENTION-CLOSE.md) · [Design Era Close](../LOCALBRAIN_DESIGN_ERA_CLOSE.md)  
> **Type:** Engineering contract — behavior frozen · packaging/installer implementation free  
> **Slice:** LB-OS-PROD-010 · LB-OS-027.0  
> **Rule:** Freeze behavior · never freeze implementation

---

## Success test (binding)

> **Could a customer with no knowledge of Steve install LocalBrain and receive exactly the same institution?**

Not the same `instance_id`. The same **institutional structure** — constitution, offices, capability graph shell, vaults, passport framework, birth certificate schema.

If yes — Factory succeeded.

---

## One job

> **Manufacture identical empty executive institutions.**

| In scope | Out of scope |
| -------- | ------------ |
| Executive Office shell | Personal data |
| Departments (empty) | Steve-specific seeds |
| Capability graph (empty) | Kelly/Chris-specific config |
| Constitution reference | Memory OS ingestion |
| Memory OS **framework** (empty) | Google · Gmail · connectors |
| Provider vault (empty) | Sample memories · fake projects |
| Security vault (empty) | Hardcoded paths |
| Passport · identity certificate | Executive Discovery answers |
| Birth certificate | |

---

## Manufacturing principle

```txt
Factory manufactures institutions.
Memory OS personalizes institutions.
Communications activates institutions.
```

Factory **never** personalizes. Personalization begins after manufacture — Memory OS and Executive Discovery.

---

## Manufacture entry point

| Field | Contract |
| ----- | -------- |
| **API** | `manufactureEmptyInstitution() → ManufactureResult` |
| **HTTP** | `POST /api/factory/manufacture` |
| **Idempotency** | Each call produces fresh empty institution; prior instance superseded in audit |
| **Preconditions** | Convention contracts S1–S5 frozen |

---

## Required outputs (`ManufactureResult`)

| Field | Required | Purpose |
| ----- | -------- | ------- |
| `manufacture_id` | Yes | Audit id — `MFG-*` |
| `birth_certificate` | Yes | Full birth certificate — see below |
| `manifest` | Yes | Structure included / excluded |
| `profile` | Yes | Canonical empty instance profile |
| `onboarding` | Yes | Reset — not completed |
| `package_mode` | Yes | Always `empty_brain` |
| `contract_version` | Yes | `FAC-2026-07` |
| `convention_contracts[]` | Yes | All five Convention versions bundled |

---

## Brain Birth Certificate (binding)

Every manufactured LocalBrain must answer at provision time:

| Field | Contract |
| ----- | -------- |
| `manufacturer` | Factory identity — `LocalBrain Factory` |
| `constitution_version` | e.g. `1.0` |
| `office_pack` | e.g. `executive_office_v1` |
| `capability_pack` | e.g. `capability_graph_v1` |
| `factory_version` | ENG-FAC-001 release |
| `migration_version` | Schema migration baseline |
| `identity` | `instance_id` + passport reference |
| `authority` | Authority stack placeholder — pre-activation |
| `passport` | Sovereign passport id |
| `license` | License slot — pre-activation |
| `manufactured_at` | ISO-8601 |
| `convention_contracts` | S1–S5 version strings |

---

## Structure manifest

**Included** (from `EMPTY_BRAIN_BIRTH_CONTENT`):

```txt
executive_office · departments · capability_graph · constitution
memory_os_framework · provider_vault · security_vault · passport · identity_certificate
```

**Excluded** (from `EMPTY_BRAIN_BIRTH_EXCLUSIONS` + PMO):

```txt
personal_data · sample_memories · fake_projects · steve_specific_seeds · hardcoded_paths
memory_ingestion · google · gmail · connector_activation
```

---

## Institution parity invariants

Two manufactures pass parity if:

| # | Invariant |
| - | --------- |
| F1 | Same `constitution_version` · `office_pack` · `capability_pack` |
| F2 | Same `structure_included[]` and `structure_excluded[]` |
| F3 | Same default department template |
| F4 | Same Convention contract bundle |
| F5 | `package_mode` = `empty_brain` |
| F6 | Export bundle contains no secrets · no person-specific owner defaults |
| F7 | Onboarding not completed until Executive Discovery (post-manufacture) |

`instance_id` and passport ids **may differ** — structure must not.

---

## Lifecycle stage

Factory operates at **`provision`** stage of commercial pipeline:

```txt
Source Platform → Package → Provision → Activate → Personalize → Operate → …
                              ▲
                         Factory here
```

Activation and personalization are **downstream** — not Factory.

---

## Audit events

```txt
event_type:       factory.manufacture | factory.verify
manufacture_id:   MFG-*
instance_id:      *
birth_certificate_hash: *
contract_version: FAC-2026-07
timestamp:        ISO-8601
```

---

## Failure behavior

| Condition | Behavior |
| --------- | -------- |
| Manufacture with excluded content detected | Fail · do not ship |
| Missing birth certificate field | Fail certification |
| Convention contract version mismatch | Fail · block manufacture |
| Dev seeded instance | Manufacture resets to canonical empty |

---

## Factory gate (slice 1)

- [x] Manufacturing contract frozen
- [x] Success test defined — customer parity
- [x] Birth certificate schema bound
- [x] ENG-FAC-001 manufacture API implemented
- [ ] Installer artifact (future slice)
- [ ] Factory certification (future)

**Next slices:** packaging · installer · birth cert persistence export · authority stack (PROD-008/009)

---

*Empty Brain Factory · Manufacturing Contract · 2026*
