# LB-OS-019.7 — Experience Maturity

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


## Mission

Distinguish **live** surfaces from **useful** surfaces. Every route carries a maturity level (L0–L5) and a target upgrade path.

## Maturity scale (ENG-EXP-001)

| Level | Meaning |
| ----- | ------- |
| L0 | Wireframe |
| L1 | Live data |
| L2 | Interactive |
| L3 | Chief of Staff insights |
| L4 | Predictive |
| L5 | Executive quality |

## Deliverables

- [x] `shared/experienceMaturity.ts` contracts
- [x] Maturity metadata on `SURFACE_REGISTRY`
- [x] Program Office **Experience Maturity** roadmap table
- [x] Dev-mode maturity badges on `LiveSurfaceBanner` (`import.meta.env.DEV`)
- [x] Hidden in production builds

## Rule

> Every page is live **or** stub-labeled **and** has a visible maturity level in development mode.
