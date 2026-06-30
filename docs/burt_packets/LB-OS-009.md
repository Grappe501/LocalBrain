# BURT / CURSOR EXECUTION SCRIPT

> **LOCALBRAIN V1 ROADMAP** · Architecture FROZEN · Implementation mode
>
> ```txt
> □ Executive Office Certification
> □ Session 4
> □ Session 5
> □ Theory Freeze
> □ Convention
> □ Empty Brain Factory
> □ Memory OS
> □ Communications Office
> □ Commercial Beta
>
> Everything else → VERSION2_BACKLOG.md
> ```


**Project:** LocalBrain  
**Slice:** LB-OS-009  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-003, LB-OS-008  
**Authoritative spec:** [Build Slice Queue v2](../LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md)

---

## Mission

**Permission-gated file read & summarize tools** — first AI access to file *content*, still read-only.

---

## Hard boundaries

```txt
Read-only · permission engine on every path
No edits / moves / deletes / cleanup / shell
No whole-drive reads · no secret files
Max file-size cap · token-size cap
Source path shown · every read logged
Folder summarize = manifest only (not recursive dump)
```

---

## Exit criteria

```txt
[x] read_file / summarize_file / summarize_selected_asset / summarize_folder manifest
[x] POST /api/files/read · POST /api/files/summarize
[x] CoS command integration with asset_path
[x] Knowledge Explorer “Ask CoS about this asset”
[x] file_read_log table
[x] npm run check && npm run test pass
```

---

## Commit

`feat: add permission-gated file read and summarize tools`

**Next:** LB-OS-010 Approval-gated file management

---

*LB-OS-009 · File Read & Summarize · ✅ Complete*
