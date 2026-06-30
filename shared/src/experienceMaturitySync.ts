/** Sync experience maturity from ENG-CAP-001 capability registry. */

import type { CapabilityEntry, CapabilityCompletionStatus } from "./capabilityRegistry.js";
import {
  CAPABILITY_REGISTRY,
  getCapabilityById,
  matchCapabilityForRoute,
} from "./capabilityRegistry.js";
import type { ExperienceMaturityLevel, ExperienceMaturityRow } from "./experienceMaturity.js";
import { maturityLabel } from "./experienceMaturity.js";
import type { LiveSurfaceEntry, LiveSurfaceMode } from "./liveSurface.js";

/** Platform-wide next step when a capability chain is complete */
export const PLATFORM_EXPERIENCE_NEXT_SLICE = "LB-OS-026.7";
export const PLATFORM_EXPERIENCE_NEXT_SUMMARY =
  "Executive Office home — Chief of Staff narrative replaces mock briefing sections";

/** Manual next-upgrade hints when capability graph points backward or to unrelated caps */
export const EXPERIENCE_MATURITY_UPGRADE_HINTS: Record<
  string,
  { next_upgrade_slice: string; next_upgrade_summary: string }
> = {
  "/": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: PLATFORM_EXPERIENCE_NEXT_SUMMARY,
  },
  "/program-office": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary:
      "Surface Executive Office experience certification alongside build state (L3→L4)",
  },
  "/migration": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: "Migration arc complete — elevate outcomes in Chief of Staff briefing",
  },
  "/migration/audit": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: "Audit feeds Executive Office; land survey in briefing narrative",
  },
  "/migration/consolidation": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: "Consolidation insights feed Chief of Staff briefing (L4)",
  },
  "/migration/workspace-architecture": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: "Architecture posture in Executive Office department reports",
  },
  "/migration/digital-land-survey": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: "Survey complexity in CoS briefing — planning already live",
  },
  "/migration/proof": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: "Certified proof status in Executive Office operations zone",
  },
  "/migration/planning": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: "Active plans surface in Chief of Staff daily narrative",
  },
  "/migration/approval": {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: "Approval queue in Executive Office — cutover already live",
  },
  "/migration/cutover": {
    next_upgrade_slice: "LB-OS-089",
    next_upgrade_summary: "Phase 1 Personal OS launch intelligence composer (L5)",
  },
};

export function capabilityToSurfaceMode(
  cap: CapabilityEntry,
): LiveSurfaceMode {
  if (cap.completion_status === "planned") return "stub";
  if (cap.completion_status === "stub") return "stub";
  if (cap.completion_status === "partial" || cap.maturity.health === "degraded") {
    return "partial";
  }
  return "live";
}

export function capabilityToExperienceMaturity(
  cap: CapabilityEntry,
): ExperienceMaturityLevel {
  if (cap.completion_status === "planned" || cap.completion_status === "stub") {
    return 0;
  }
  const p = cap.maturity.completion_percent;
  if (p >= 95 && cap.maturity.health === "healthy") return 4;
  if (p >= 88) return 3;
  if (p >= 70) return 2;
  if (p >= 35) return 1;
  return 1;
}

export function resolveCapabilityForSurfaceRoute(route: string): CapabilityEntry | undefined {
  const exact = CAPABILITY_REGISTRY.find((c) => c.primary_route === route);
  if (exact) return exact;
  const probe =
    route.includes(":workspaceId") ? route.replace(":workspaceId", "localbrain") : route;
  return matchCapabilityForRoute(probe) ?? undefined;
}

function nextUpgradeFromCapability(cap: CapabilityEntry): {
  next_upgrade_slice: string | null;
  next_upgrade_summary: string;
} {
  const hint = EXPERIENCE_MATURITY_UPGRADE_HINTS[cap.primary_route];
  if (hint) return hint;

  const nextId = cap.next_recommended_steps[0];
  if (!nextId) {
    return {
      next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
      next_upgrade_summary: PLATFORM_EXPERIENCE_NEXT_SUMMARY,
    };
  }
  const next = getCapabilityById(nextId);
  if (!next) {
    return { next_upgrade_slice: null, next_upgrade_summary: cap.executive_outcome };
  }
  if (next.completion_status === "planned") {
    return {
      next_upgrade_slice: next.slice_id,
      next_upgrade_summary: `${next.title} — infrastructure reserved (not live)`,
    };
  }
  const nextMaturity = capabilityToExperienceMaturity(next);
  if (nextMaturity >= capabilityToExperienceMaturity(cap)) {
    return {
      next_upgrade_slice: next.slice_id,
      next_upgrade_summary: `${next.title} — ${next.executive_outcome}`,
    };
  }
  return {
    next_upgrade_slice: PLATFORM_EXPERIENCE_NEXT_SLICE,
    next_upgrade_summary: PLATFORM_EXPERIENCE_NEXT_SUMMARY,
  };
}

export function mergeSurfaceWithCapability(
  surface: LiveSurfaceEntry,
  cap?: CapabilityEntry,
): ExperienceMaturityRow {
  if (!cap) {
    return {
      route: surface.route,
      label: surface.label,
      surface_mode: surface.mode,
      maturity_level: surface.maturity_level,
      maturity_label: maturityLabel(surface.maturity_level),
      target_level: surface.target_maturity_level,
      next_upgrade_slice: surface.next_upgrade_slice,
      next_upgrade_summary: surface.next_upgrade_summary,
      capability_id: null,
      last_verified_slice: surface.slice_id,
    };
  }

  const maturity_level = capabilityToExperienceMaturity(cap);
  const upgrade = nextUpgradeFromCapability(cap);
  const hint = EXPERIENCE_MATURITY_UPGRADE_HINTS[surface.route];

  return {
    route: surface.route,
    label: cap.title,
    surface_mode: capabilityToSurfaceMode(cap),
    maturity_level,
    maturity_label: maturityLabel(maturity_level),
    target_level: surface.target_maturity_level,
    next_upgrade_slice: hint?.next_upgrade_slice ?? upgrade.next_upgrade_slice,
    next_upgrade_summary: hint?.next_upgrade_summary ?? upgrade.next_upgrade_summary,
    capability_id: cap.capability_id,
    last_verified_slice: cap.maturity.last_verified_slice,
  };
}

export function buildExperienceMaturityMatrix(
  surfaces: LiveSurfaceEntry[],
): ExperienceMaturityRow[] {
  return surfaces.map((surface) => {
    const cap = resolveCapabilityForSurfaceRoute(surface.route);
    return mergeSurfaceWithCapability(surface, cap);
  });
}

export function isCapabilityProductionReady(
  status: CapabilityCompletionStatus,
): boolean {
  return status === "production" || status === "partial";
}
