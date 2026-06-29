# LocalBrain Google Drive Archive Plan

> **Future knowledge source** — archive and cold storage, not the live working drive.

---

## Storage model

```txt
H:/           = active work (primary)
Google Drive  = archive / backup / shared docs / cold storage
LocalBrain    = index + search + sync awareness (metadata-first)
```

Google Drive is **not** the live working filesystem. LocalBrain treats it as a **Knowledge Source** with sync awareness — same category as future remote drives.

---

## What LocalBrain can do later (LB-OS-111)

| Capability | Mode |
|------------|------|
| Index Google Drive metadata | Read-only API |
| Search Drive docs from Knowledge Explorer | Read-only |
| Archive old assets to Drive | Approval-gated proposal |
| Track what has been backed up | Registry + backup_records extension |
| Warn what is local-only | Intelligence recommendations |
| Pull selected archived files back | Approval-gated restore proposal |

No automatic upload. No silent delete from local after upload. Every archive move = proposal → approve → execute → **verify** (file exists in Drive, local quarantine or keep per user choice).

---

## Registry integration

Extend `digital_assets` (or parallel `cloud_assets` table) with:

```txt
source: local | google_drive
cloud_file_id
last_synced_at
backup_status: local_only | synced | archive_only
```

Chief of Staff cleanup recommendations distinguish **local-only risk** from **already archived**.

---

## Auth & safety

- OAuth per Steve (single-user first; team OAuth later in LB-OS-112)
- Tokens in host secret store — never in repo, never in client bundle
- Permission engine: Drive paths are not local write roots; all mutations via Drive API proposals

---

## Slice

**LB-OS-111 — Google Drive archive connector**

Exit criteria (future):

```txt
[ ] OAuth connect / disconnect in Settings
[ ] Metadata index + search
[ ] Archive proposal type (approval-gated)
[ ] Local-only warnings in asset intelligence
[ ] No auto-upload
```

---

*Future arc · Google Drive Archive · Planning only*
