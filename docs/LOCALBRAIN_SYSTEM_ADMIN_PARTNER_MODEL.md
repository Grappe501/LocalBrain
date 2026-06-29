# LocalBrain System Administrator Partner Model v1.0

> **Pillar 6:** Folders, repos, backups, health, deployment.  
> Doctrine: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md)

---

## Vision

LocalBrain as Steve's **sysadmin partner** — not root access, not reckless automation. Governed local operations with full visibility.

```txt
Think freely. Preview clearly. Ask approval. Act safely. Log everything. Undo when possible.
```

---

## Domains

| Domain | Examples |
|--------|----------|
| **Folders** | Allowlist, organize, archive |
| **Files** | Index, read, move, quarantine |
| **Projects** | Health, profiles, repo map |
| **Repos** | LocalBrain + approved project roots |
| **Dev environments** | Env checklists, port health, `.env` status (not values) |
| **Backups** | Pre-write snapshots, restore |
| **Disk** | Duplicate report, cleanup proposals |
| **Build status** | Slice progress, test results |
| **Deployment** | Preflight checklists, launch gates |

---

## Partner Behaviors

### Observe (auto)

```txt
Index approved folders · health endpoint · index run stats
openaiKeyPresent (boolean) · db connected · last backup age
```

### Propose (AI)

```txt
"These 12 files look like duplicates"
"This folder hasn't been touched in 90 days — archive?"
"ACU repo missing tests per auditor"
```

### Execute (gated)

```txt
Move · write · quarantine only after approval + backup + log
```

---

## UI Surfaces

| Surface | Route | Slice |
|---------|-------|-------|
| Settings | `/settings` | 005 |
| Actions cockpit | `/actions` | 010 |
| Backups | `/backups` | 011 |
| Sysadmin dashboard | `/system` | OS v2 TBD |

---

## Agents

- `deployment_checklist_agent` — Netlify/GitHub/release preflight
- `document_organizer` — folder cleanup proposals
- `general_localbrain` — env and setup questions

---

## Checklists (Examples)

**Env setup:**

```txt
Node installed · ports free · .env.local present (not displayed)
OpenAI key present · allowed folders configured · index fresh
```

**Deployment preflight:**

```txt
npm run check · tests pass · no secrets in build · rollback path documented
```

Generated via Burt deployment mode (LB-BURT-005).

---

## Safety (Permanent)

```txt
No whole-drive scan
No shell in V1
No permanent delete — quarantine only
Forbidden paths enforced ([Safety Model](./LOCALBRAIN_SAFETY_MODEL.md))
Every action logged in action_log
```

---

*System administrator partner model version 1.0 · 2026-06-28*
