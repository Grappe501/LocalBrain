import crypto from "node:crypto";
import type {
  AdvisoryRecommendation,
  BriefConfidenceRating,
  BriefEvidenceEngine,
  BriefRecommendationCategory,
  BriefSection,
  ContactBrief,
  ContactBriefEvidenceView,
  EvidenceCitation,
} from "@localbrain/shared";
import { CONTACT_BRIEF_ADVISORY_NOTICE, CONTACT_BRIEF_VERSION } from "@localbrain/shared";
import type { ContactAccessContext } from "./contactInteractionValidator.js";
import { buildContactActionView } from "./contactActionRepository.js";
import { buildContactTimelineView } from "./contactInteractionRepository.js";
import { listContactContextView } from "./contactContextRepository.js";
import { listHouseholdsForContact } from "./contactHouseholdRepository.js";
import { listOrganizationsForContact } from "./contactOrganizationRepository.js";
import { buildContactStewardshipView } from "./contactStewardshipRepository.js";
import { getContactById } from "./contactRepository.js";

export type BriefComposerInput = {
  contact_id: string;
  ctx: ContactAccessContext;
  generated_by_user_id: string;
  regeneration_count: number;
  operator_approved: boolean;
  operator_approved_by_user_id?: string;
  operator_approved_at?: string;
};

function cite(
  engine_id: BriefEvidenceEngine,
  source_type: string,
  label: string,
  detail: string,
  source_id?: string,
  occurred_at?: string,
): EvidenceCitation {
  return {
    citation_id: crypto.randomUUID(),
    engine_id,
    source_type,
    source_id,
    label,
    detail,
    occurred_at,
  };
}

function confidenceFromCitations(count: number, engines: Set<BriefEvidenceEngine>): BriefConfidenceRating {
  if (count >= 3 || engines.size >= 2) return "high";
  if (count >= 1) return "medium";
  return "low";
}

function buildRecommendation(options: {
  title: string;
  rationale: string;
  category: BriefRecommendationCategory;
  citations: EvidenceCitation[];
  why: string;
}): AdvisoryRecommendation | null {
  if (options.citations.length === 0) return null;
  const engines = new Set(options.citations.map((c) => c.engine_id));
  return {
    recommendation_id: crypto.randomUUID(),
    title: options.title,
    rationale: options.rationale,
    confidence: confidenceFromCitations(options.citations.length, engines),
    category: options.category,
    citations: options.citations,
    why: options.why,
  };
}

function briefSection(
  section_id: string,
  title: string,
  body: string | undefined,
  citations: EvidenceCitation[],
  withheldReason?: string,
): BriefSection {
  const hasEvidence = citations.length > 0 && Boolean(body);
  return {
    section_id,
    title,
    body: hasEvidence ? body : undefined,
    citations,
    withheld: !hasEvidence,
    withheld_reason: hasEvidence ? undefined : (withheldReason ?? "Insufficient evidence to support this section."),
  };
}

export function composeContactBrief(input: BriefComposerInput): ContactBrief | null {
  const contact = getContactById(input.contact_id);
  if (!contact) return null;

  const timeline = buildContactTimelineView({ contact_id: input.contact_id, ctx: input.ctx });
  const stewardship = buildContactStewardshipView(input.contact_id, input.ctx);
  const contextView = listContactContextView(input.contact_id);
  const actionView = buildContactActionView(input.contact_id, input.ctx);
  const households = listHouseholdsForContact(input.contact_id, input.ctx);
  const organizations = listOrganizationsForContact(input.contact_id, input.ctx);
  const interactionCount = timeline?.interactions.length ?? 0;
  const openActions = actionView?.summary.total_open_actions ?? 0;

  const evidence: EvidenceCitation[] = [];
  const sourceEngines = new Set<BriefEvidenceEngine>();

  for (const interaction of timeline?.interactions ?? []) {
    sourceEngines.add("timeline");
    evidence.push(
      cite(
        "timeline",
        interaction.type,
        interaction.summary,
        `${interaction.type.replace(/_/g, " ")} on ${interaction.occurred_at.slice(0, 10)}`,
        interaction.id,
        interaction.occurred_at,
      ),
    );
  }

  for (const link of contextView?.links ?? []) {
    sourceEngines.add("context");
    evidence.push(
      cite(
        "context",
        "context_link",
        link.context.label,
        `${link.rank} context · ${link.context.category}`,
        link.context_id,
      ),
    );
  }

  if (stewardship) {
    const stewardshipHasSignal =
      Boolean(stewardship.stewardship.steward_user_id) ||
      interactionCount > 0 ||
      stewardship.contributors.length > 0 ||
      stewardship.watchers.length > 0;
    if (stewardshipHasSignal) {
      sourceEngines.add("stewardship");
      if (stewardship.stewardship.steward_user_id) {
        evidence.push(
          cite("stewardship", "steward", "Assigned steward", stewardship.stewardship.steward_user_id),
        );
      }
      if (interactionCount > 0) {
        evidence.push(
          cite("stewardship", "momentum", "Relationship momentum", stewardship.computed.momentum),
        );
        evidence.push(
          cite(
            "stewardship",
            "health",
            "Stewardship health",
            `${stewardship.computed.health_score} — ${stewardship.computed.health_label}`,
          ),
        );
        for (const factor of stewardship.computed.factors.slice(0, 3)) {
          evidence.push(cite("stewardship", factor.code, factor.label, factor.detail));
        }
      }
    }
  }

  for (const householdSummary of households) {
    sourceEngines.add("household");
    evidence.push(
      cite(
        "household",
        "household",
        householdSummary.household.name,
        `${householdSummary.computed.size} member(s) · health ${householdSummary.computed.health_label}`,
        householdSummary.household.household_id,
      ),
    );
  }

  for (const orgSummary of organizations) {
    sourceEngines.add("organization");
    const membership = orgSummary.memberships.find(
      (m) => !m.effective_until && m.contact_id === input.contact_id,
    );
    evidence.push(
      cite(
        "organization",
        "membership",
        orgSummary.organization.name,
        membership
          ? `${membership.membership_role} · ${membership.membership_status}`
          : orgSummary.organization.category,
        orgSummary.organization.organization_id,
      ),
    );
  }

  if (actionView) {
    sourceEngines.add("action");
    for (const task of actionView.open_tasks) {
      evidence.push(
        cite(
          "action",
          "task",
          task.title,
          `${task.priority} priority${task.due_at ? ` · due ${task.due_at.slice(0, 10)}` : ""}`,
          task.task_id,
          task.due_at,
        ),
      );
    }
    if (actionView.summary.open_follow_up_count > 0) {
      evidence.push(
        cite(
          "action",
          "follow_up_count",
          "Open timeline follow-ups",
          `${actionView.summary.open_follow_up_count} follow-up item(s) referenced from timeline`,
        ),
      );
    }
  }

  const relationshipBody =
    interactionCount >= 3 && stewardship
      ? `This contact has ${interactionCount} logged timeline entries with ${stewardship.computed.momentum} momentum and stewardship health ${stewardship.computed.health_label}.`
      : interactionCount > 0 && stewardship
        ? `Limited timeline (${interactionCount} entries) — momentum is ${stewardship.computed.momentum}.`
        : undefined;

  const stewardshipBody =
    stewardship?.stewardship.steward_user_id
      ? `Steward: ${stewardship.stewardship.steward_user_id}. Strength ${stewardship.stewardship.strength.replace(/_/g, " ")} · lifecycle ${stewardship.stewardship.lifecycle_stage}.`
      : stewardship && interactionCount > 0
        ? `No steward assigned. Health ${stewardship.computed.health_score} with ${stewardship.computed.momentum} momentum.`
        : undefined;

  const sections: BriefSection[] = [
    briefSection(
      "relationship_snapshot",
      "Relationship Snapshot",
      relationshipBody,
      evidence.filter((e) => e.engine_id === "timeline" || e.engine_id === "stewardship"),
      "No timeline or stewardship evidence available.",
    ),
    briefSection(
      "stewardship",
      "Stewardship",
      stewardshipBody,
      evidence.filter((e) => e.engine_id === "stewardship"),
      "No stewardship assignments or computed metrics available.",
    ),
    briefSection(
      "organizations",
      "Organizations",
      organizations.length > 0
        ? `Active affiliations: ${organizations.map((o) => o.organization.name).join(", ")}.`
        : undefined,
      evidence.filter((e) => e.engine_id === "organization"),
      "No organization affiliations on record.",
    ),
    briefSection(
      "household",
      "Household",
      households.length > 0
        ? `Household: ${households[0]!.household.name} (${households[0]!.computed.size} members, ${households[0]!.computed.participation_label} participation).`
        : undefined,
      evidence.filter((e) => e.engine_id === "household"),
      "No household membership on record.",
    ),
    briefSection(
      "context",
      "Context",
      (contextView?.links.length ?? 0) > 0
        ? `Contexts: ${contextView!.links.map((l) => l.context.label).join(", ")}.`
        : undefined,
      evidence.filter((e) => e.engine_id === "context"),
      "No active relationship contexts assigned.",
    ),
    briefSection(
      "open_actions",
      "Open Actions",
      openActions > 0
        ? `${actionView!.summary.open_task_count} open task(s) and ${actionView!.summary.open_follow_up_count} timeline follow-up(s).`
        : undefined,
      evidence.filter((e) => e.engine_id === "action"),
      "No open tasks or follow-ups.",
    ),
  ];

  const opportunities: AdvisoryRecommendation[] = [];
  const risks: AdvisoryRecommendation[] = [];
  const recommendations: AdvisoryRecommendation[] = [];

  if (stewardship?.computed.momentum === "growing" && interactionCount >= 3) {
    const rec = buildRecommendation({
      title: "Invite to leadership conversation",
      rationale: "Growing momentum with meaningful timeline activity supports a deeper engagement conversation.",
      category: "leadership",
      citations: evidence.filter((e) => e.engine_id === "timeline" || e.engine_id === "stewardship").slice(0, 4),
      why: "Timeline volume and growing momentum are documented in stewardship and timeline engines.",
    });
    if (rec) opportunities.push(rec);
  }

  if (openActions > 0 && actionView) {
    const rec = buildRecommendation({
      title: "Complete open action items",
      rationale: `${openActions} open action item(s) need steward attention before outreach.`,
      category: "follow_up",
      citations: evidence.filter((e) => e.engine_id === "action"),
      why: "Open tasks and timeline follow-ups are referenced from the Action engine.",
    });
    if (rec) recommendations.push(rec);
  }

  if (timeline?.follow_ups.overdue.length) {
    const overdue = timeline.follow_ups.overdue[0]!;
    const rec = buildRecommendation({
      title: "Schedule overdue follow-up",
      rationale: "Timeline records an overdue follow-up commitment.",
      category: "follow_up",
      citations: [
        cite(
          "timeline",
          "follow_up",
          overdue.interaction.summary,
          `Overdue follow-up since ${overdue.interaction.follow_up_due_at?.slice(0, 10) ?? "unknown"}`,
          overdue.interaction.id,
          overdue.interaction.follow_up_due_at,
        ),
      ],
      why: "Overdue status comes directly from timeline interaction follow_up fields.",
    });
    if (rec) risks.push(rec);
  }

  if (stewardship && !stewardship.stewardship.steward_user_id && interactionCount > 0) {
    const rec = buildRecommendation({
      title: "Assign a relationship steward",
      rationale: "Timeline activity exists but no accountable steward is assigned.",
      category: "other",
      citations: evidence.filter((e) => e.engine_id === "stewardship" || e.engine_id === "timeline").slice(0, 2),
      why: "Stewardship engine shows no steward while timeline has entries.",
    });
    if (rec) risks.push(rec);
  }

  if (households.length > 0 && households[0]!.computed.size > 1) {
    const rec = buildRecommendation({
      title: "Consider household outreach",
      rationale: "Multiple household members may share volunteer or voter activity.",
      category: "household",
      citations: evidence.filter((e) => e.engine_id === "household"),
      why: "Household engine reports member count and participation metrics.",
    });
    if (rec) opportunities.push(rec);
  }

  const hasSubstantiveEvidence =
    interactionCount > 0 ||
    Boolean(stewardship?.stewardship.steward_user_id) ||
    (contextView?.links.length ?? 0) > 0 ||
    households.length > 0 ||
    organizations.length > 0 ||
    openActions > 0;
  let executiveSummary: string | undefined;
  if (hasSubstantiveEvidence && interactionCount > 0) {
    executiveSummary = `${contact.display_name} — ${interactionCount} timeline ${interactionCount === 1 ? "entry" : "entries"}`;
    if (stewardship) executiveSummary += `, ${stewardship.computed.momentum} momentum`;
    if (openActions > 0) executiveSummary += `, ${openActions} open action(s)`;
    executiveSummary += ". Brief cites engine evidence only.";
  } else if (hasSubstantiveEvidence) {
    executiveSummary = `${contact.display_name} — relationship record exists with limited timeline activity. Review cited evidence before outreach.`;
  }

  return {
    engine_id: CONTACT_BRIEF_VERSION,
    contact_id: input.contact_id,
    workspace_id: contact.workspace_id,
    advisory: true,
    notice: CONTACT_BRIEF_ADVISORY_NOTICE,
    summary: {
      contact_display_name: contact.display_name,
      has_substantive_evidence: hasSubstantiveEvidence,
      open_action_count: openActions,
      momentum: stewardship?.computed.momentum,
      steward_user_id: stewardship?.stewardship.steward_user_id,
    },
    executive_summary: executiveSummary,
    sections,
    opportunities,
    risks,
    recommendations,
    evidence,
    metadata: {
      generated_at: new Date().toISOString(),
      generated_by_user_id: input.generated_by_user_id,
      regeneration_count: input.regeneration_count,
      operator_approved: input.operator_approved,
      operator_approved_by_user_id: input.operator_approved_by_user_id,
      operator_approved_at: input.operator_approved_at,
      source_engines: [...sourceEngines],
      live_ai_wired: false,
    },
  };
}

export function composeContactBriefEvidence(input: BriefComposerInput): ContactBriefEvidenceView | null {
  const brief = composeContactBrief(input);
  if (!brief) return null;
  return {
    engine_id: CONTACT_BRIEF_VERSION,
    contact_id: brief.contact_id,
    workspace_id: brief.workspace_id,
    evidence: brief.evidence,
    metadata: brief.metadata,
  };
}
