# LocalBrain Social Media Interface v1.0

> **Pillar 5:** Draft, repurpose, calendar — human approves before publish.  
> Doctrine: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md)

---

## Vision

LocalBrain helps Steve **create and manage** social content locally. It does not auto-post in V1. Scheduling and APIs require explicit approval gates and future slices.

---

## Capabilities

| Capability | Phase |
|------------|-------|
| Draft posts (FB, X, etc.) | V1 via chat / writing mode |
| Repurpose long → short (blog → thread) | OS v2 |
| Content calendars | OS v3 |
| Captions + hooks | OS v2 |
| Thread generator | OS v2 |
| Theme tracking (civic, campaign, faith) | OS v3 |
| Reusable messaging library | OS v3 |
| Graphics prompts (for external tools) | OS v2 |
| Schedule with approval | OS v4 + API connectors |

---

## UI (Future)

**Route:** `/social`

```txt
Calendar view · Draft queue · Theme tags · Platform selector
Composer with voice (Kelly campaign, Steve strategic)
Preview panel · Approval queue before export/schedule
```

---

## Agents

- `campaignos_agent` — campaign messaging
- Writing modes — social media writer
- Future: `social_scheduler_agent` (approval-gated)

---

## Data Model (Future)

```txt
social_drafts · social_themes · content_calendar · reusable_snippets
```

Local SQLite — no cloud sync without Steve's explicit connector setup.

---

## Safety

```txt
No auto-publish in V1
No credential storage in frontend
API keys for platforms: backend only, approval to post
Export to clipboard/file default until connectors approved
```

---

## Integration

| Source | Flow |
|--------|------|
| Writing dashboard | Long draft → repurpose wizard |
| Explorer | Pull campaign assets, images paths |
| SysAdmin | Archive posted content metadata |

---

*Social media interface version 1.0 · 2026-06-28*
