# LocalBrain Database Studio v1.0

> **Data Domain · AI row** — say it, don't write SQL (unless you want to learn).  
> Platform: [Data Platform](./LOCALBRAIN_DATA_PLATFORM.md) · OJT: real-work SQL lessons

---

## Mission

Instead of writing SQL by hand:

```txt
"Import this voter file."
"Normalize addresses."
"Build an index."
"Create a lookup table."
"Join Census blocks to precincts."
"Find duplicates."
"Generate a dashboard."
```

LocalBrain generates SQL, **validates**, **explains**, runs with approval, and **teaches** what it did.

---

## Workflow

```txt
Steve (NL command)
  ↓
ENG-DP-003 Query Planner + ENG-DP-001 catalog
  ↓
Generate SQL / ETL plan (preview)
  ↓
Steve approves
  ↓
Execute (sandboxed · read-only default · writes gated)
  ↓
Explain + OJT lesson block if Teach ON
  ↓
Optional: save as reusable workflow template
```

---

## UI

```txt
Route: /studio/data or /data
Panels: Sources · Query history · Preview results · Explain plan
Chief: data_chief
```

---

## Safety

```txt
Read-only by default on imports
Writes require approval + backup metadata
No DROP without explicit Steve confirm + typed confirmation
PII columns flagged in explain view
```

---

## OJT integration

```txt
Today you learned: SQL JOIN
because we joined voter files to Census blocks in Database Studio.
```

---

## Slice

LB-OS-099 · depends LB-OS-098

---

*Database studio v1.0 · 2026-06-28*
