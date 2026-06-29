# LocalBrain Memory Recall Architecture v1.0

> **Pillar 12 · Memory & recall.**  
> Token economy: [Token Economy Engine](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md) · Queue: LB-OS-051–052

---

## Problem

Giant chat logs alone → unbounded storage, repeated context sends, no durable project intelligence.

**Goal:** Infinite recall **without** sending everything every time.

---

## Memory Rule — Layered Pipeline

Do not store everything as giant chat logs only.

```txt
Raw message
↓
Short summary
↓
Decision/event record
↓
Project memory chunk
↓
Searchable embedding/index
↓
Long-term style/skill pattern
```

Each layer is smaller, more durable, and cheaper to retrieve than the layer above.

---

## Layer Definitions

| Layer | Storage | Retrieval | Slice |
|-------|---------|-----------|-------|
| **Raw message** | `messages` table | Full thread replay | 008 |
| **Short summary** | `conversation_summaries` | Thread overview | 051 |
| **Decision/event** | `memory_entries` (type=decision) | "What did we decide?" | 021 partial · 051 |
| **Project memory chunk** | `project_memory_chunks` | Scoped recall by workspace | 052 |
| **Searchable index** | ENG-SR-001 + ENG-AP-008 | Semantic + keyword | 052 · post-046 |
| **Style/skill pattern** | `user_style_patterns` · OJT progress | Personalization, pace | 053–054 |

---

## Project Memory Graph

Local graph per workspace — not just flat logs.

```txt
ProjectMemoryGraph (workspace_id)
├── nodes: conversation, file, decision, slice, requirement, person
├── edges: references, supersedes, implements, blocks
└── chunks: retrievable units for RAG (512–2k tokens each)
```

**Engine:** ENG-MR-003 · ties to ENG-KG-001 (global graph, post-024).

---

## Recall Flow (Pre-Flight)

Before OpenAI call:

```txt
1. Parse intent + workspace context
2. ENG-MR-002 chunked recall: top-k relevant chunks (local index)
3. If confidence high → answer from memory (+ optional cheap model polish)
4. If partial → inject chunks as context prefix (not full history)
5. If miss → tool-fetch files + minimal new context
6. Log: recall_hits, duplicate_context_avoided (tokens saved estimate)
```

Feeds Pillar 12 pre-flight: *"Can I answer from local memory first?"*

---

## Compression Pipeline (LB-OS-051)

```txt
Trigger: conversation idle · session end · nightly job · manual "compress"
Actions:
  - Summarize thread → drop raw from hot context (retain in cold storage)
  - Extract decisions/events → memory_entries
  - Split project chunks → index + embed
  - Update memory graph edges
  - Invalidate stale context cache (ENG-AP-002)
```

**Never delete raw** without backup policy — compress for *send*, not for *audit*.

---

## Chunked Recall Engine (LB-OS-052)

```txt
backend/src/memory/chunkRecall.ts
GET /api/memory/recall?workspaceId=&query=
POST /api/memory/compress
```

**Chunk schema:**

```txt
chunk_id, workspace_id, source_type, source_id
content_text, token_estimate
embedding_vector (nullable until AP-008)
created_at, superseded_by
```

---

## Dashboard — Memory Efficiency Card (LB-OS-055)

```txt
Raw conversations stored
Summaries created
Chunks indexed
Recall hits (session / month)
Duplicate context avoided (estimated tokens saved)
```

---

## Integration

| Consumer | Use |
|----------|-----|
| Command layer | Recall before route to AI |
| Burt generator | Prior closeouts + decisions, not full chat |
| Living Workspace | Memory tab, decision timeline |
| Token economy | Attribute savings to project |

---

*Memory recall architecture v1.0 · Pillar 12 · 2026-06-28*
