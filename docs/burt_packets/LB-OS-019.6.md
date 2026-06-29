# LB-OS-019.6 — Live Surface Audit & Wiring Fix

## Mission

Every visible route is either **live-wired** to authoritative data or **explicitly labeled** as future/planned/stub with reason.

## Deliverables

- [x] ENG-SRF-001 live surface registry (`/api/surfaces/audit`)
- [x] Smoke tests for priority route payloads (`/api/surfaces/smoke`)
- [x] Workspace live projection (build state overlay + links API)
- [x] `LiveSurfaceBanner` on all priority pages
- [x] System health executive panel wired to EPO gate
- [x] Actions CoS proposal badge (`requested_by: chief_of_staff`)
- [x] Settings stub labels + link to AI providers

## Acceptance rule

```txt
Live-wired OR explicitly labeled stub with reason on every priority page.
```

## Priority routes audited

`/workspace` · `/actions` · `/program-office` · `/system` · `/explorer` · studio departments · `/settings`
