import type { EngagementRecommendation } from "@localbrain/shared";
import { SEED_PEOPLE } from "./seedCatalog.js";

export function generateEngagementRecommendations(): EngagementRecommendation[] {
  const recs: EngagementRecommendation[] = [];

  const chris = SEED_PEOPLE.find((p) => p.person_id === "person_chris_m");
  if (chris && (chris.last_touch_days_ago ?? 0) >= 14) {
    recs.push({
      id: "eng-call-chris",
      priority: "high",
      action: `Call ${chris.name}`,
      reason: `${chris.last_touch_days_ago} days since last touch — coalition bridge at risk`,
      related_person_id: chris.person_id,
      related_org_id: "org_stand_up_arkansas",
      confidence: "high",
      automation_blocked: true,
    });
  }

  recs.push({
    id: "eng-benton-county",
    priority: "medium",
    action: "Follow up with Benton County liaison",
    reason: "CountyWorkbench workspace active — quarterly touch due",
    related_person_id: "person_benton_liaison",
    related_org_id: "org_benton_county",
    confidence: "medium",
    automation_blocked: true,
  });

  const donor = SEED_PEOPLE.find((p) => p.person_id === "person_donor_x");
  if (donor) {
    recs.push({
      id: "eng-donor-x",
      priority: "high",
      action: `Reconnect with ${donor.name}`,
      reason: "Met twice at fundraisers — dormant 60+ days before next cycle",
      related_person_id: donor.person_id,
      related_org_id: "org_kelly_campaign",
      confidence: "high",
      automation_blocked: true,
    });
  }

  recs.push({
    id: "eng-intro-sarah",
    priority: "medium",
    action: "Complete introduction: Chris M. → Sarah K.",
    reason: "Open introduction loop from February coalition work",
    related_person_id: "person_sarah_k",
    related_org_id: "org_stand_up_arkansas",
    confidence: "medium",
    automation_blocked: true,
  });

  recs.push({
    id: "eng-intro-donor-marcus",
    priority: "low",
    action: "Consider introducing Donor X to Marcus T.",
    reason: "Shared voter engagement interest — coalition opportunity",
    related_person_id: "person_marcus_t",
    related_org_id: "org_naaca",
    confidence: "low",
    automation_blocked: true,
  });

  return recs;
}
