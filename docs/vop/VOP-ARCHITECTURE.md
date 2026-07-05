# VOP — Architecture

> **Status:** VOP-001 Reference Pattern Certified · 2026-07-05  
> **Trust domain:** Operational trust

---

## Position

VOP is the **third governed subsystem** in the LocalBrain constituent platform. It sits between relationship cultivation and commercial beta execution.

---

## Trust boundaries

```text
┌─────────────────────────────────────────────────────────┐
│                    EXTERNAL SOURCES                      │
└───────────────────────────┬─────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│  UCIE (Identity Trust)                                   │
│  Owns: sessions, staging, resolution, identity work      │
│  Does NOT: write relationship or operational state       │
└───────────────────────────┬─────────────────────────────┘
                            ▼ Canonical Contact Identity
┌─────────────────────────────────────────────────────────┐
│  Contact Management v3 (Relationship Trust)              │
│  Owns: contact record, context, stewardship, actions…    │
│  Does NOT: own operational volunteer execution state     │
└───────────────────────────┬─────────────────────────────┘
                            ▼ Work signals + trusted people
┌─────────────────────────────────────────────────────────┐
│  VOP (Operational Trust)                                 │
│  Owns: profiles, vop_work_items, claims, quality events  │
│  Does NOT: modify UCIE or Contact canonical tables       │
└───────────────────────────┬─────────────────────────────┘
                            ▼
                    Coordinated human action
```

---

## Operational hierarchy (VOP-001 pattern)

| Surface | Operator | Purpose |
| ------- | -------- | ------- |
| **Work Marketplace** | Volunteer | Browse matched open work; claim voluntarily |
| **My Queue** | Volunteer | Execute claimed work; release or complete |
| **Supervisor** | Manager | Backlog, flow, stuck work, quality flags |

UCIE identity queue appears **read-only** in marketplace — claims remain in Identity Acquisition studio.

---

## Data model (VOP-001)

| Table | Purpose |
| ----- | ------- |
| `vop_volunteer_profiles` | Skills, county, roles, training |
| `vop_work_items` | Operational claimable work |
| `vop_work_claims` | Claim/release audit trail |
| `vop_quality_events` | Supervisor quality flags |

---

## Matching engine

Open work is filtered and scored by:

1. **County** — volunteer county must match required county (if specified)
2. **Skills** — overlap between `required_skills` and profile skills
3. **Urgency** — high-urgency items sort first

---

## API surface

Prefix: `/api/vop/*` · Engine: `VOP-001` · Capability: `CAP-VOP-001`

See [VOP-001 Work Marketplace](./VOP-001-WORK-MARKETPLACE.md) for route list.

---

## Certified patterns (inherit for VOP-002+)

1. **Marketplace over assignment** — volunteers choose; managers supervise flow
2. **Three-tab operational hierarchy** — profile · marketplace/queue · supervisor
3. **Operational supervisor metrics** — backlog, completion, stuck, quality — not admin vanity metrics
4. **PSA-driven gap closure** — implement against platform coherence evidence

---

*VOP Architecture · LocalBrain · 2026*
