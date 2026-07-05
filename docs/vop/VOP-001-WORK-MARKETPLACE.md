# VOP-001 — Volunteer Work Marketplace

**Status:** **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
**Governance:** [VOP-001 Governance Review](./VOP-GOVERNANCE-REVIEW.md)

## Vertical slice

| Feature | Implementation |
| --- | --- |
| Volunteer profile | `vop_volunteer_profiles` · skills, county, roles, training |
| Claimable work queue | `vop_work_items` · open pool with urgency |
| Claim / release / complete | `vop_work_claims` audit trail |
| Skill tags | `VOP_SKILL_TAGS` · profile + required_skills matching |
| County matching | Open queue filtered by volunteer county |
| Supervisor dashboard | Backlog, completion rate, stuck work, quality flags |
| Quality flags | `vop_quality_events` · rework / needs_review |
| Targeted tests | `backend/src/vop/vop.test.ts` |

## API

| Method | Path |
| --- | --- |
| GET | `/api/vop/profiles/me?workspace_id=` |
| PUT | `/api/vop/profiles/me` |
| GET | `/api/vop/work/open?workspace_id=` |
| GET | `/api/vop/work/mine?workspace_id=` |
| POST | `/api/vop/work` (supervisor) |
| POST | `/api/vop/work/:id/claim` |
| POST | `/api/vop/work/:id/release` |
| POST | `/api/vop/work/:id/complete` |
| POST | `/api/vop/work/:id/flag` (supervisor) |
| GET | `/api/vop/supervisor/dashboard?workspace_id=` |

## Boundaries

- **UCIE work items** remain in `ucie_work_items` — VOP marketplace shows them read-only; identity claims still flow through Identity Acquisition.
- **Contact action tasks** remain steward-scoped — VOP operational work is a separate queue for coordinated volunteer capacity.
- **No Contact v3 contract changes** in this slice.

## Next slice (VOP-002)

Training gates before sensitive claims · shift scheduling · volunteer evidence ledger entries on complete.
