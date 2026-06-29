# LocalBrain Team Workspace Model

> **Future multi-user arc** — very doable, but **after** single-user V1 is stable.

---

## Future model

```txt
Steve         = owner
Team members  = users
Workspaces    = shared or private
Modules       = permissioned per role
Actions       = approval-gated (unchanged)
Audit trail   = always on
```

---

## Design references

Combine patterns from:

```txt
GitHub-style   = shared workspace dashboard, activity feed, ownership
Norton-style   = system/network health overview across devices
CampaignOS-style = command center, approvals, operational loop
```

LocalBrain already has: LivingWorkspace, Actions queue, CoS orchestration, Operational Health Score. Team mode **extends** these — no parallel permission system.

---

## Permission layers (future)

| Layer | Owner | Member | Viewer |
|-------|-------|--------|--------|
| Read workspace | ✓ | ✓ | ✓ |
| Propose actions | ✓ | role-based | ✗ |
| Approve actions | ✓ | delegated | ✗ |
| Execute approved | ✓ | ✓ (scoped paths) | ✗ |
| Module access | all | per manifest | read-only |

Actions remain **approval-gated**. Team members may **propose**; owner (or delegated approvers) **approve**.

---

## Audit trail (LB-OS-113)

Every sensitive event logged:

```txt
who · what · when · device · outcome · verify result
```

Extends: `action_log`, `cos_outcomes`, future `decision_ledger`, workspace events.

Immutable append-only log for compliance and learning — no silent edits.

---

## Shared vs private workspaces

- **Private** — visible only to owner (default today)
- **Shared** — team members see executive context, assets, pending proposals
- **Archive** — read-only for team; owner retains delete/quarantine authority

Filesystem roots still enforced per machine via permission engine v2.

---

## Slices

| Slice | Focus |
|-------|--------|
| LB-OS-112 | Team workspace permissions |
| LB-OS-113 | Multi-user audit trail |

**Gate:** After LB-OS-108 (server topology) and personal OS cutover (LB-OS-024).

---

## V1 rule

Single-user Steve only. No auth UI, no sharing UI, no team tables in V1 schema beyond `requested_by` stubs.

---

*Future arc · Team Workspace · Planning only*
