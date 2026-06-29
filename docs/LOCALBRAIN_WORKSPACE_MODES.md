# Adaptive Workspace Modes — LocalBrain

> **Future slice:** LB-OS-03X (Adaptive Workspace Modes)  
> **Principle:** The mode follows the work you're doing — not a simple light/dark toggle.

---

## Why Work Modes, Not Themes

LocalBrain is an Executive Operating System. Each department and workspace type benefits from a different **presentation layer** while sharing the same shell, APIs, and data.

| Wrong framing | Right framing |
|---------------|---------------|
| Light theme / Dark theme | Executive Mode / Engineering Mode / Writing Mode |
| One global appearance | Context-aware experience per kind of work |
| Cosmetic preference | Layout, density, typography, and chrome tuned to the task |

---

## Planned Modes

### Executive Mode (default)

- Clean, bright, minimal
- Designed for running the day
- Current light shell after LB-OS-019.7 restore

### Engineering Mode

- Slightly darker workbench feel
- Emphasizes: engineering graph, metrics, logs, build status
- Aligns with Engineering Studio (`/studio/engineering`)

### Writing Mode

- Warm, paper-like, distraction-free
- Typography-first
- Aligns with Writing Studio (`/studio/writing`)

### Photography Mode

- Dark, image-first, minimal chrome
- Color-accurate presentation
- Future photography workspace

### Operations Center

- Mission-control feel
- Multiple dashboards, health metrics, status indicators
- Aligns with System Health + Program Office

### Presentation Mode

- Large typography, simplified navigation
- Executive dashboards, full-screen graphs
- Meeting / TV / conference-room friendly

### Focus Mode

- Reduced chrome, single-task layout
- Minimal notifications and sidebar noise

---

## View Menu (future)

```text
View
  Executive      ← default
  Engineering
  Writing
  Photography
  Presentation
  Focus
```

Each mode may change:

- Layout and density
- Sidebar and context panel behavior
- Widget emphasis
- Color tokens and typography
- **Not** underlying routes, APIs, or business logic

---

## Development vs Production

| Development | Production |
|-------------|------------|
| Experience Maturity badges (L0–L5) | Hidden |
| Live / Partial / Stub banners | Hidden |
| Build slice IDs on surfaces | Hidden |
| Debug / smoke metadata | Hidden |

Today: `import.meta.env.DEV` gates maturity badges. Future: explicit **Production** flag in settings or environment.

---

## Relationship to departments

Departments already map naturally to modes:

| Department | Suggested default mode |
|------------|----------------------|
| Chief of Staff / Briefing | Executive |
| Engineering Studio | Engineering |
| Writing Studio | Writing |
| Data & Intelligence | Engineering or Executive |
| Relationship Network | Executive |
| Program Office | Operations Center |
| System Health | Operations Center |

Mode can follow **active workspace type** or **user View selection**.

---

## Suggested deliverables (LB-OS-03X)

- [ ] `WorkMode` contract in `@localbrain/shared`
- [ ] CSS token sets per mode (not duplicate components)
- [ ] View menu + persisted preference
- [ ] Department auto-suggest mode on route enter
- [ ] Presentation layout variant
- [ ] Production flag hides dev maturity chrome
- [ ] EPO maturity table tracks mode coverage per route

---

## Non-goals (V1 of modes)

- Separate codebases per mode
- Breaking read-only / approval gates per theme
- Photography color pipeline (defer to workspace slice)
