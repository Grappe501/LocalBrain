# LocalBrain Podcast Division v1.0

> **Pillar 17 · Media department — Podcast Chief.**  
> Organization: [Department Organization](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md)

---

## Mission

One recording → **ten deliverables** — orchestrated by Podcast Chief, approved by Steve.

```txt
Podcast Chief → pipeline stages → specialists → Chief of Staff synthesis
```

---

## Pipeline

```txt
Recording
  ↓
Noise cleanup
  ↓
Speaker separation
  ↓
Transcript
  ↓
Show notes
  ↓
Chapters
  ↓
Clips (social)
  ↓
Blog post
  ↓
Newsletter segment
  ↓
Social posts
  ↓
YouTube description
  ↓
Publishing checklist
```

Each stage: **propose → preview → approve** — no silent publish.

---

## Track A (now)

```txt
Project workspace type: podcast_episode
Folder template on H: (raw, processed, transcripts, publish)
Transcript via cloud API (capability: speech — future)
Show notes / chapters / blog drafts via Writing chief delegation
Checklist UI in Podcast division route
```

**Slice:** LB-OS-094 stub.

---

## Track B (GPU)

```txt
Local noise cleanup · speaker diarization
Faster transcript on local whisper-class model
Clip suggestion from transcript embeddings
```

---

## Chief agent

```txt
id: podcast_chief
reports_to: chief_of_staff
department: podcast
```

---

## KPI

```txt
Deliverables per recording
Time from record → publish ready
Cost per episode (API + time)
```

Feeds ENG-EO-008 effectiveness metrics.

---

*Podcast division v1.0 · Pillar 17 · 2026-06-28*
