# LocalBrain Learning Pace Engine v1.0

> **Pillar 12 · Teaching pace & OJT adaptation.**  
> OJT: [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md) · Token economy: [Token Economy Engine](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md)

---

## Mission

Steve learns to code **while building LocalBrain** — not on a fixed curriculum clock.

```txt
OJT coding knowledge tracker
Teaching pace control
User style learning
Concepts introduced vs mastered
"Teach me more / less"
Current confidence level
```

---

## Pace Control

### User-facing controls

```txt
Teach Me While We Build:  ON / OFF        (existing — LB-OS-026)
Teaching intensity:       More · Normal · Less
Confidence self-report:   Low · Building · Comfortable · Teaching others
```

### System behavior by intensity

| Intensity | Closeout OJT block | Challenges | Concept depth |
|-----------|-------------------|------------|---------------|
| **More** | Full lesson + challenge | Frequent | Explain every pattern |
| **Normal** | Standard OJT block | Per slice | Balance build + teach |
| **Less** | One-line concept only | Rare | Build-first, link to /learn |

**Engine:** ENG-LP-002 · **Slice:** LB-OS-054

---

## OJT Knowledge Tracker

Tracks what Steve has been exposed to vs demonstrated:

```txt
concepts_introduced[]   — from closeouts, challenges, /learn
concepts_mastered[]     — challenge passed · self-marked · repeated use in code
skill_map_progress{}    — ties LB-OS-027 ladder
ojt_sessions[]          — slice, concepts, duration, teach_intensity
```

Feeds Living Workspace **Learn** signals and Pillar 12 dashboard.

---

## Style Learning (LB-OS-053)

Learn how Steve works — not secrets, not private content — **patterns**:

```txt
Preferred explanation depth
Common vocabulary (RedDirt, ACU, Burt, slice)
Typical request phrasing
Preferred output format (bullets vs prose vs code-first)
Risk tolerance signals (asks for preview often → higher caution)
```

**Engine:** ENG-LP-001 · stored in `user_style_patterns` · informs agent prompts and model router.

**Rule:** Style patterns are **local only** · never sent to third parties except as compressed prompt hints via OpenAI API under existing policy.

---

## Dashboard — Learning Pace Card (LB-OS-055)

```txt
Concepts introduced (count + recent)
Concepts mastered (count + %)
Teaching intensity: More / Normal / Less
Current confidence level
Quick actions: "Teach me more" · "Teach me less" · "Skip lesson this slice"
```

---

## Integration with OJT Academy (Pillar 9)

| Pillar 9 | Pillar 12 |
|----------|-----------|
| Curriculum content (LB-OS-027) | Pace adapts delivery |
| Challenges (028) | Mastery detection |
| Progress UI (029) | Learning Pace card |
| Certs (030) | Confidence + mastery evidence |

Closeout OJT block (when Teach ON) remains manual until 026 — pace engine adjusts **depth**, not presence.

---

## Token Economy Link

Heavy teaching = more tokens. Pace engine can suggest:

```txt
"Switch to Less intensity to save ~40% tokens this session"
"Concept already mastered 3× — skip re-explain?"
```

Requires ENG-TE-001 attribution by `purpose=ojt_teaching`.

---

## API (Target)

```txt
GET  /api/learn/pace
PUT  /api/learn/pace          — intensity, confidence
GET  /api/learn/concepts      — introduced / mastered
POST /api/learn/concepts/:id/master
```

---

*Learning pace engine v1.0 · Pillar 12 · 2026-06-28*
