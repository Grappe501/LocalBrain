# Knowledge Taxonomy — Operational, Executive, Domain

> **Status:** Binding separation for memory, export, training, and commercialization  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) Article VII · [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md) · [Executive Memory OS](./LOCALBRAIN_EXECUTIVE_MEMORY_OS.md)

---

## Principle

LocalBrain holds three **kinds of knowledge**. They must remain separable for privacy, export, training, GPU packaging, and future multi-customer sales.

```txt
Operational Knowledge     How LocalBrain works
Executive Knowledge         How Steve works
Domain Knowledge            How Steve's worlds work
```

Someone buying the **Platform** receives Operational Knowledge. Each customer builds their own Executive and Domain knowledge over time.

---

## The three kinds

### Operational Knowledge

**How the software works.**

| Examples | Owner system |
| -------- | ------------ |
| Module manifests · engine contracts · API routes | Executive OS |
| Permission rules · action pipeline · safety doctrine | Executive OS |
| Provider adapters · prompt templates (generic) | Executive Evolution |
| Architecture docs · Burt packets · checklist | Executive OS (EPO) |
| OJT curriculum structure (not personal progress) | Executive Evolution |

**Ships with product.** No Steve-specific campaign or novel content.

**Storage:** Platform repo · `docs/` · generic `shared/` types · seed modules.

---

### Executive Knowledge

**How the executive works.**

| Examples | Owner system |
| -------- | ------------ |
| Mission Stack · priorities · deferral history | Executive Intelligence |
| Writing voice · energy patterns · work rhythms | Executive Memory OS |
| CoS interaction history · accepted/rejected recommendations | Executive Evolution |
| Executive Cognitive Load patterns | Executive Intelligence |
| Personal Memory domain | Executive Memory OS |
| Mission Memory · habit inference | Executive Intelligence + Evolution |

**Private per user.** Never shipped as product defaults.

**Storage:** Brain layer · `local_data/` · personal memory domains · `cos_outcomes`.

---

### Domain Knowledge

**How specific worlds work.**

| Domain | Examples |
| ------ | -------- |
| Campaigns | Counties, donors, compliance, speeches |
| Writing | Novel canon, characters, chapters |
| Photography | Collections, clients, deliverables |
| Finance | Accounts, budgets, tax context |
| Politics | Research, voter data, coalitions |
| Engineering | Repo-specific architecture (customer's code) |
| LocalBrain (meta) | Build slices, Steve's OS construction |

**Scoped to workspaces** · exportable per project · trainable per domain without leaking others.

**Storage:** Workspace Memory · Digital Assets · Knowledge Sources · department modules.

---

## Separation rules

```txt
Operational  ⊄  Executive     — platform code never embeds Steve's priorities
Executive    ⊄  Domain        — personal patterns don't pollute novel canon tables
Domain A     ⊄  Domain B      — workspace isolation · permission gates
Export       =  per-class      — customer gets Operational; opts in Executive/Domain
Training     =  per-class      — LoRA on Domain; not Operational secrets in customer data
```

See [Knowledge Taxonomy export matrix](#export-and-commercialization) below.

---

## Memory OS mapping

| Knowledge kind | Primary Memory OS partitions |
| -------------- | ---------------------------- |
| Operational | Reference Memory (platform docs) · Operational Memory (builds/deploys) |
| Executive | Executive Memory · Personal Memory |
| Domain | Workspace · Creative · Relationship · Learning (domain content) |

Recall plans **tag knowledge class** before retrieval — never blend Operational platform docs into Executive briefing without intent.

---

## Export and commercialization

Aligns with [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md):

```txt
Platform (sellable)
  Executive OS · Memory OS · Intelligence · Evolution · Departments
        ↓
Customer installs
        ↓
Creates Executive Profile
        ↓
Creates Mission Stack
        ↓
Imports Documents (Domain)
        ↓
Platform grows with them
```

| On install | Customer receives | Customer builds |
| ---------- | ----------------- | --------------- |
| **Operational** | Full platform · modules · empty studios | — |
| **Executive** | Empty profile templates | Mission Stack · habits · CoS history |
| **Domain** | Import tools · workspace shells | Campaigns · writing · finance · … |

Software stays the same; **Executive Memory OS** and **Executive Intelligence** layers become unique per customer.

---

## Five Gates alignment

| Gate | Knowledge check |
| ---- | --------------- |
| Object | Domain data on Workspace/Asset — not new top-level store |
| Module | Department owns Domain knowledge for its vertical |
| EQ | Domain features still answer an Executive Question |
| Leverage | Domain knowledge must connect to executive outcomes |

---

## Related docs

| Doc | Role |
| --- | ---- |
| [Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) | Storage partitions |
| [Product Naming](./LOCALBRAIN_PRODUCT_NAMING.md) | EOS product vs LocalBrain engine |
| [Assumption Ledger](./LOCALBRAIN_ASSUMPTION_LEDGER.md) | Premises for single-user · SQLite · etc. |

---

*Knowledge Taxonomy · Constitution Article VII extension · 2026-06-29*
