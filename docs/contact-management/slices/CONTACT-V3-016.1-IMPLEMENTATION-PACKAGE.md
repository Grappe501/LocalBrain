# CONTACT-V3-016.1 — Implementation Package v1.0

> **Type:** Implementation specification (not architecture)  
> **Status:** **ACTIVE** · execution authorized  
> **Slice contract:** [CONTACT-V3-016.1](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md)  
> **Governance:** [Execution Charter](./CONTACT-V3-EXECUTION-CHARTER.md) · Architecture v1.0 frozen  

**Roles:** Product/architecture frozen · Technical lead = implementation package · Cursor = engineer  

---

## Mission

First **reference implementation**. Success = another engineer can build Stewardship, Action, Intelligence using these conventions.

---

## Build increments

| ID | Deliverable | Status |
| -- | ----------- | ------ |
| IMPLEMENT-016.1-001 | Database schema + shared data contract | ✅ Complete |
| IMPLEMENT-016.1-002 | Validator + RBAC permissions | ✅ Complete |
| IMPLEMENT-016.1-003 | Repository + assignment history | ✅ Complete |
| IMPLEMENT-016.1-004 | API endpoints | ✅ Complete |
| IMPLEMENT-016.1-005 | React UI components | ✅ Complete |
| IMPLEMENT-016.1-006 | Interaction `context_id` wiring | ✅ Complete |
| IMPLEMENT-016.1-007 | Targeted tests | ✅ Complete (2/2 pass) |
| IMPLEMENT-016.1-008 | Validation note + review package | ✅ Certified 2026-07-05 |

---

## 1. Database schema

**`relationship_contexts`** — workspace catalog

| Column | Type |
| ------ | ---- |
| context_id | TEXT PK |
| workspace_id | TEXT NOT NULL |
| label | TEXT NOT NULL |
| category | TEXT NOT NULL |
| status | TEXT NOT NULL DEFAULT `active` |
| created_by_user_id | TEXT NOT NULL |
| created_at | TEXT |
| updated_at | TEXT |

**`contact_context_links`** — contact assignment

| Column | Type |
| ------ | ---- |
| link_id | TEXT PK |
| workspace_id | TEXT NOT NULL |
| contact_id | TEXT FK |
| context_id | TEXT FK |
| rank | TEXT `primary` \| `secondary` |
| effective_from | TEXT NOT NULL |
| effective_until | TEXT NULL |
| source | TEXT `manual` \| `import` \| `inferred_advisory` |
| created_by_user_id | TEXT NOT NULL |
| created_at | TEXT |
| updated_at | TEXT |

Active link: `effective_until IS NULL`.

**`contact_context_link_history`** — append-only

| Column | Type |
| ------ | ---- |
| history_id | TEXT PK |
| workspace_id | TEXT |
| contact_id | TEXT |
| context_id | TEXT |
| link_id | TEXT |
| action | TEXT |
| reason | TEXT |
| payload_json | TEXT |
| created_by_user_id | TEXT |
| created_at | TEXT |

**`contact_context_merges`** — merge audit

| Column | Type |
| ------ | ---- |
| merge_id | TEXT PK |
| workspace_id | TEXT |
| from_context_id | TEXT |
| to_context_id | TEXT |
| merged_by_user_id | TEXT |
| reason | TEXT |
| created_at | TEXT |

**`contact_interactions.context_id`** — nullable FK (evolutionary add)

---

## 2. API contracts

Engine id: `CONTACT-V3-016.1`

| Method | Path |
| ------ | ---- |
| GET | `/api/contacts/contexts?workspace_id=` |
| POST | `/api/contacts/contexts` |
| PATCH | `/api/contacts/contexts/:contextId` |
| POST | `/api/contacts/contexts/:contextId/archive` |
| POST | `/api/contacts/contexts/merge` |
| GET | `/api/contacts/:id/contexts` |
| POST | `/api/contacts/:id/contexts` |
| PATCH | `/api/contacts/:id/contexts/:linkId` |
| DELETE | `/api/contacts/:id/contexts/:linkId` |
| GET | `/api/contacts/:id/contexts/history` |

List filter: `GET /api/contacts?workspace_id=&context_id=&context_primary_only=`

Headers: `X-Contact-User-Id` · `X-Contact-User-Role`

---

## 3. Service layer (repository)

- `createRelationshipContext`
- `updateRelationshipContext`
- `archiveRelationshipContext`
- `mergeRelationshipContexts`
- `listWorkspaceContexts`
- `assignContactContext`
- `updateContactContextLink`
- `endContactContextLink`
- `listContactContextView`
- `listContactContextHistory`
- `listContacts` extension for context filter

---

## 4. React component hierarchy

```
ContactManagementView
├── ContactContextFilterDrawer   (list filter)
├── ContactContextPanel          (profile tab — cards + assign)
│   ├── ContactContextChips
│   └── ContactContextAssignForm
└── ContactTimelinePanel
    ├── ContactContextSelector   (quick-log)
    └── context indicator on rows
```

---

## 5. RBAC matrix

| Action | admin | owner | organizer | viewer |
| ------ | ----- | ----- | --------- | ------ |
| View | ✓ | ✓ | ✓ | ✓ |
| Create catalog | ✓ | ✓ | | |
| Edit catalog | ✓ | ✓ | | |
| Archive catalog | ✓ | | | |
| Merge contexts | ✓ | | | |
| Assign to contact | ✓ | ✓ | ✓ | |
| End contact link | ✓ | ✓ | ✓ | |

---

## 6. Validation rules

- `label` required on context create
- `category` from enum
- One **primary** active link per contact (promote/demote on assign)
- `effective_from` required; `effective_until` ends link (append history)
- Merge: both contexts same workspace, `from` archived, links reassigned

---

## 7. Migration

Extend `migrateContactTables()` — idempotent `CREATE IF NOT EXISTS` + `ALTER TABLE contact_interactions ADD COLUMN context_id TEXT` (ignore if exists via try/catch or pragma check).

---

## 8. Targeted tests

```bash
cd backend && node --import tsx --test src/contacts/contactContext.test.ts
```

Serial `describe(..., { concurrency: 1 })`. Cover: catalog CRUD, assign, rank, end, merge, filter, permissions, history append.

---

## 9. Acceptance criteria

- [x] Contact has multiple contexts with primary/secondary rank
- [x] Interactions optional `context_id`
- [x] Filter contacts by context
- [x] Context summary on contact profile
- [x] Append-only assignment history
- [x] Permissions enforced
- [x] Targeted tests pass
- [x] Done contract satisfied (governance sign-off 2026-07-05)

---

## 10. Cursor execution script

```bash
# From repo root — after implementation
cd shared && npm run build
cd ../backend && node --import tsx --test src/contacts/contactContext.test.ts
cd ../frontend && npm run typecheck && npm run build
```

Review package for governance review:

1. PR / diff touching `shared/src/contacts/contactContext.ts`, `backend/src/contacts/contactContext*`, `frontend/src/modules/contact-studio/ContactContext*`
2. Targeted test output (2+ tests pass)
3. Operator evidence (optional until Phase 6)

---

*CONTACT-V3-016.1 Implementation Package v1.0 · LocalBrain · 2026*
