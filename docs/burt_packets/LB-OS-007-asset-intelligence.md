# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Slice:** LB-OS-007  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-006  
**Authoritative spec:** [Digital Asset Model](../LOCALBRAIN_DIGITAL_ASSET_MODEL.md)

---

## Mission

**Digital Asset Intelligence Engine** — health scores, collections, cleanup proposals, and CoS asset signals. Storage optimization is **one capability**, not the product name.

---

## Capabilities (007)

```txt
Asset health scoring (good/poor signals)
Collections engine (dynamic queries — stub + Kelly/Grappe examples)
Duplicate + version cluster reports
Dormant asset summary ("4,200 assets · 31 GB")
Archive candidate proposals (suggest only)
UI: /assets or Knowledge Explorer Intelligence panel
CoS briefing hooks: asset counts by lifecycle
```

---

## Exit criteria

```txt
[ ] Health score computed per asset from fingerprint heuristics
[ ] At least 3 seed collections (focus workspace, touched this week, stale)
[ ] duplicate: and stale: search use registry not ad-hoc scans
[ ] Cleanup proposals — no auto-delete
[ ] Executive Mode insights cite registry stats
```

---

## Commit

`feat: add digital asset intelligence engine`

**Next:** LB-OS-008 OpenAI Command Layer

---

*LB-OS-007 · Digital Asset Intelligence · PLANNED*
