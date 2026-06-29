# LocalBrain Relationship & Network Intelligence Department v1.0

> **Slice:** LB-OS-015 · **Not a CRM** — **Social Knowledge**.  
> Mission: Understand the people, organizations, and relationships that make up your world.  
> Legacy engine doc: [Relationship Intelligence](./LOCALBRAIN_RELATIONSHIP_INTELLIGENCE.md) · Memory domain: `relationship`

---

## Philosophy

```txt
The fundamental object is not a person.
It is a relationship.
```

People, organizations, workspaces, communications, meetings, and projects connect through **relationships**. This gives the Chief of Staff context to recommend not just what to work on — but **who you should be working with next**.

---

## Department mission

Answer:

```txt
Who do I know?
Who knows whom?
Where are relationships growing?
Which relationships are getting cold?
Who should I contact next?
Who introduced me to this person?
Which workspaces involve this person?
```

---

## Chief

| Role | Agent ID | Responsibility |
|------|----------|----------------|
| **Relationship Chief** | `relationship_chief` | Network health, engagement recommendations, introductions |

---

## Six tabs

| Tab | Purpose |
|-----|---------|
| **Overview** | Relationship Health Score, active/dormant, strongest ties, Chief recommendation |
| **People** | Relationship Profiles + **Relationship Timeline** per person |
| **Organizations** | Stand Up Arkansas, NAACP, Campaign, counties, media, vendors |
| **Network Graph** | Steve → people → orgs → workspaces |
| **Engagement** | Call Chris, follow up Benton County, reconnect donor — **recommendations only** |
| **Learn** | Networking, stakeholder mapping, coalition building OJT stub |

Route: `/studio/relationships` · Nav: **Relationships**

---

## Relationship Profile (not a contact row)

Eventually: organizations, meetings, emails, projects, conversations, shared workspaces, interests, introductions.

V1: stub catalog with strength, recency, status, workspaces, timeline events.

---

## Relationship Timeline (priority)

```txt
Met → Worked together → Emails → Meetings → Projects → Introductions → Current status
```

One coherent history instead of five apps.

---

## Relationship Health Score

| Factor | Signals |
|--------|---------|
| Communication | Touch frequency |
| Recency | Days since last contact |
| Strength | Relationship strength score |
| Projects | Workspace linkage |
| Shared work | LivingWorkspace involvement |
| Introductions | Introduction chains |
| Follow-through | Dormant / open loops |
| Engagement | Active vs cooling ties |

---

## Guardrails (binding)

```txt
Recommendations only — no automated outreach
No Google Contacts / Gmail / Calendar sync in V1
No CRM writes without approval
Permission-gated future imports
```

---

## Long-term integrations

Google Contacts · Gmail · Calendar · Campaign CRM · ContactList · linked workspaces · meeting notes · AI summaries — all permission-gated.

---

## LB-OS-015 bootstrap scope

**Build:**

```txt
Relationship & Network Intelligence Department
Stub people + organizations + timelines
Network graph
Engagement recommendations (no automation)
Relationship Health Score
GET /api/relationship-network/*
relationship-studio manifest active
```

**Do not build in 015:**

```txt
Live Google sync
Automated calls/emails
Full ContactList import
NL cross-source donor queries (later)
```

---

## V1 foundational trio + network

```txt
012 Engineering           → systems
013 Writing               → narratives
014 Data & Intelligence   → knowledge
015 Relationship & Network → social knowledge
016 Executive OS V1 milestone
```

---

*Relationship & Network Intelligence v1.0 · LB-OS-015 · 2026-06-29*
