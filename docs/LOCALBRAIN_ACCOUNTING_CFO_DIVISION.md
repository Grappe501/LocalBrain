# LocalBrain Accounting & CFO Division v1.0

> **Finance Domain · Run my business with me — from the start.**  
> Domains: [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) · Matrix: [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md)

---

## Mission

LocalBrain is Steve's **CFO** — not just Chief of Staff for priorities, but **financial command** for life and work.

```txt
Campaign books & compliance
Household accounting
Business accounting
One system · permission-gated · audit trail · never silent money moves
```

---

## Scope

### Campaign finance & compliance

```txt
Campaign books (RedDirt, SOS Public, etc.)
Contribution/expenditure tracking
Compliance calendars (FEC, state, local — config per campaign)
Report preparation assistance (propose → Steve + accountant review)
Receipt/document linkage on H:
Audit trail for every classification change
```

### Household accounting

```txt
Personal accounts overview (manual import / CSV — no bank password in V1)
Budget vs actual · recurring bills awareness
Shared visibility with business where needed (tags, not merged blindly)
```

### Business accounting

```txt
Entity-separated books (ACU, CountyWorkbench, consulting, etc.)
P&L-oriented views · project cost allocation
API spend as line item (ties Pillar 12 token economy)
Contractor / vendor payment tracking (document-linked)
```

---

## CFO Chief agent

```txt
id: cfo_chief
reports_to: chief_of_staff
department: finance
persona: CFO — not bookkeeper bot
risk_limit: LOW (propose only; no wire transfers, no auto-file)
```

**Behaviors:**

```txt
"You have a compliance report due in 12 days."
"Campaign X is $400 over projected media spend this month."
"Household utilities are 18% above your 6-month average."
"Recommend categorizing this receipt as event supplies — approve?"
"Business and campaign share this vendor — split 60/40?"
```

---

## Engines

| Engine | ID | Job |
|--------|-----|-----|
| Ledger & books | ENG-FN-001 | Chart of accounts, entries, entities |
| Compliance calendar | ENG-FN-002 | Deadlines, filings, reminders |
| Receipt & doc linker | ENG-FN-003 | H: files → transactions |
| Reconciliation assistant | ENG-FN-004 | Match imports, flag gaps |
| CFO briefing | ENG-FN-005 | Finance section in executive brief |
| Reporting exporter | ENG-FN-006 | CSV/PDF for accountant (gated) |

---

## Data model (target)

```txt
finance_entities        campaign | household | business_acu | …
accounts                per entity
transactions            amount, date, category, source_doc_path
compliance_obligations  due_date, jurisdiction, status
receipts                linked files, OCR summary optional (future)
```

**Storage:** SQLite finance tables + documents on H: · **Never** auto-sync bank credentials in V1.

---

## Safety

```txt
No auto-filing government reports
No moving money · no payment initiation
Classifications are proposals until Steve approves
Secrets and account numbers never in prompts/logs
Campaign compliance: human + professional review for filings
```

Binding: [Safety Model](./LOCALBRAIN_SAFETY_MODEL.md)

---

## Integration

| System | Link |
|--------|------|
| Executive briefing | Daily finance snapshot |
| Token economy | API $ as operational expense |
| Operations | Campaign entity books |
| Data platform | Transactions queryable via NL |
| Relationship intel | Donor ↔ contribution linkage |

---

## Queue (Track A — from start in planning)

| Slice | Focus |
|-------|-------|
| LB-OS-097 | Finance/CFO doctrine + matrix cell |
| LB-OS-101 | CFO chief + ledger schema stub + briefing finance section |

**LB-OS-002:** Finance & CFO placeholder in briefing + context card stub.

---

## Example briefing lines

```txt
FINANCE & COMPLIANCE
  RedDirt Q2 compliance worksheet due Apr 15 — 3 receipts uncategorized
  Household: on budget · Business: API $142 MTD
  Action: approve 2 expense classifications
```

---

*Accounting & CFO division v1.0 · Finance domain · from the start · 2026-06-28*
