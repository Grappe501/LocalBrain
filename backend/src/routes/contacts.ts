import { Router } from "express";
import type { CreateContactInput, UpdateContactInput } from "@localbrain/shared";
import {
  archiveContact,
  createContact,
  createContactOrganization,
  getContactById,
  linkContactToOrganization,
  listContactOrganizations,
  restoreContact,
  updateContact,
  ContactDuplicateEmailError,
} from "../contacts/contactRepository.js";
import {
  commitContactImport,
  exportContactsCsv,
  previewContactImport,
} from "../contacts/contactCsv.js";
import {
  listContactDraftLinks,
  listContactOutreachAudit,
  updateContactOutreachWithAudit,
} from "../contacts/contactDraftLinkRepository.js";
import {
  buildContactTimelineView,
  createContactInteraction,
  deleteContactInteraction,
  listWorkspaceFollowUps,
  updateContactInteraction,
  updateTimelineMeta,
} from "../contacts/contactInteractionRepository.js";
import {
  ContactInteractionValidationError,
  resolveAccessContext,
} from "../contacts/contactInteractionValidator.js";
import {
  archiveRelationshipContext,
  assignContactContext,
  createRelationshipContext,
  endContactContextLink,
  listContactContextHistory,
  listContactContextView,
  listContactsByContext,
  listWorkspaceContexts,
  mergeRelationshipContexts,
  updateContactContextLink,
  updateRelationshipContext,
} from "../contacts/contactContextRepository.js";
import {
  ContactContextValidationError,
} from "../contacts/contactContextValidator.js";
import { ContactValidationError } from "../contacts/contactValidator.js";
import {
  addContactStewardParticipant,
  assignContactSteward,
  buildContactStewardshipView,
  buildStewardshipDashboard,
  endContactStewardParticipant,
  listStewardTransitions,
  updateContactStewardship,
} from "../contacts/contactStewardshipRepository.js";
import { ContactStewardshipValidationError } from "../contacts/contactStewardshipValidator.js";
import {
  buildActionQueue,
  buildContactActionView,
  completeContactActionTask,
  completeInteractionFollowUp,
  createContactActionTask,
  updateContactActionTask,
} from "../contacts/contactActionRepository.js";
import { ContactActionValidationError } from "../contacts/contactActionValidator.js";
import {
  addHouseholdMember,
  addHouseholdRelationship,
  buildHouseholdSummary,
  createHousehold,
  getHouseholdById,
  listHouseholdHistoryExport,
  listHouseholdsForContact,
  mergeHouseholds,
  removeHouseholdMember,
  searchHouseholds,
  splitHousehold,
  transferPrimaryResidence,
  updateHousehold,
} from "../contacts/contactHouseholdRepository.js";
import { ContactHouseholdValidationError } from "../contacts/contactHouseholdValidator.js";
import {
  addOrganizationMembership,
  archiveOrganizationRecord,
  assignOrganizationRole,
  buildOrganizationSummary,
  createOrganizationRecord,
  endOrganizationMembership,
  getOrganizationById,
  listOrganizationContacts,
  listOrganizationHistoryExport,
  listOrganizationsForContact,
  mergeOrganizations,
  searchOrganizations,
  updateOrganizationMembership,
  updateOrganizationRecord,
} from "../contacts/contactOrganizationRepository.js";
import { ContactOrganizationValidationError } from "../contacts/contactOrganizationValidator.js";
import {
  buildContactBrief,
  buildContactBriefEvidenceView,
  regenerateContactBrief,
} from "../contacts/contactBriefRepository.js";
import { ContactBriefValidationError } from "../contacts/contactBriefValidator.js";
import {
  buildRelationshipAnalyticsDashboard,
  buildRelationshipAnalyticsExport,
} from "../contacts/relationshipAnalyticsRepository.js";
import { RelationshipAnalyticsValidationError } from "../contacts/relationshipAnalyticsValidator.js";

export const contactsRouter = Router();

const ENGINE_ID = "ENG-CONTACT-001.4";
const SLICE_ID = "ENG-CONTACT-001.4";
const TIMELINE_ENGINE_ID = "CONTACT-V3-014";
const CONTEXT_ENGINE_ID = "CONTACT-V3-016.1";
const STEWARDSHIP_ENGINE_ID = "CONTACT-V3-016";
const ACTION_ENGINE_ID = "CONTACT-V3-017";
const HOUSEHOLD_ENGINE_ID = "CONTACT-V3-018";
const ORGANIZATION_ENGINE_ID = "CONTACT-V3-019";
const BRIEF_ENGINE_ID = "CONTACT-V3-020";
const ANALYTICS_ENGINE_ID = "CONTACT-V3-021";

function resolveWorkspaceId(queryValue: unknown, bodyValue: unknown): string | null {
  const candidate =
    (typeof queryValue === "string" && queryValue.trim()) ||
    (typeof bodyValue === "string" && bodyValue.trim()) ||
    "";
  return candidate || null;
}

function mapContactError(error: unknown, res: import("express").Response): boolean {
  if (error instanceof ContactDuplicateEmailError) {
    res.status(409).json({
      error: "duplicate_email",
      message: error.message,
      email: error.email,
      existing_contact_id: error.existing_contact_id,
    });
    return true;
  }
  if (error instanceof ContactValidationError) {
    res.status(400).json({ error: error.code, message: error.message });
    return true;
  }
  if (error instanceof ContactInteractionValidationError) {
    res.status(400).json({ error: error.code, message: error.message });
    return true;
  }
  if (error instanceof ContactContextValidationError) {
    res.status(error.code === "forbidden" ? 403 : 400).json({ error: error.code, message: error.message });
    return true;
  }
  if (error instanceof ContactStewardshipValidationError) {
    res.status(error.code === "forbidden" ? 403 : 400).json({ error: error.code, message: error.message });
    return true;
  }
  if (error instanceof ContactActionValidationError) {
    res.status(error.code === "forbidden" ? 403 : 400).json({ error: error.code, message: error.message });
    return true;
  }
  if (error instanceof ContactHouseholdValidationError) {
    res.status(error.code === "forbidden" ? 403 : 400).json({ error: error.code, message: error.message });
    return true;
  }
  if (error instanceof ContactOrganizationValidationError) {
    res.status(error.code === "forbidden" ? 403 : 400).json({ error: error.code, message: error.message });
    return true;
  }
  if (error instanceof ContactBriefValidationError) {
    res.status(error.code === "forbidden" ? 403 : 400).json({ error: error.code, message: error.message });
    return true;
  }
  if (error instanceof RelationshipAnalyticsValidationError) {
    res.status(error.code === "forbidden" ? 403 : 400).json({ error: error.code, message: error.message });
    return true;
  }
  return false;
}

function accessFromRequest(req: import("express").Request) {
  return resolveAccessContext({
    user_id: req.header("x-contact-user-id") ?? req.query.user_id,
    role: req.header("x-contact-user-role") ?? req.query.user_role,
  });
}

contactsRouter.get("/contacts/export.csv", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  const csv = exportContactsCsv({
    workspace_id,
    include_archived: req.query.include_archived === "true",
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    tag: typeof req.query.tag === "string" ? req.query.tag : undefined,
    email: typeof req.query.email === "string" ? req.query.email : undefined,
  });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="contacts-${workspace_id}.csv"`,
  );
  res.send(csv);
});

contactsRouter.post("/contacts/import/preview", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  const csv_text = typeof req.body?.csv_text === "string" ? req.body.csv_text : "";
  if (!csv_text.trim()) {
    res.status(400).json({ error: "csv_text is required" });
    return;
  }

  try {
    const preview = previewContactImport({
      workspace_id,
      csv_text,
      duplicate_policy: req.body?.duplicate_policy,
    });
    res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, preview });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/import/commit", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  const csv_text = typeof req.body?.csv_text === "string" ? req.body.csv_text : "";
  if (!csv_text.trim()) {
    res.status(400).json({ error: "csv_text is required" });
    return;
  }

  try {
    const result = commitContactImport({
      workspace_id,
      csv_text,
      duplicate_policy: req.body?.duplicate_policy,
    });
    res.status(201).json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, result });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/organizations/list", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  const include_archived = req.query.include_archived === "true";
  res.json({
    slice_id: SLICE_ID,
    engine_id: ENGINE_ID,
    workspace_id,
    organizations: listContactOrganizations(workspace_id, { include_archived }),
  });
});

contactsRouter.post("/contacts/organizations", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  try {
    const organization = createContactOrganization({
      workspace_id,
      name: req.body?.name ?? "",
    });
    res.status(201).json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, organization });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  const context_id = typeof req.query.context_id === "string" ? req.query.context_id : undefined;
  const contacts = listContactsByContext({
    workspace_id,
    include_archived: req.query.include_archived === "true",
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    tag: typeof req.query.tag === "string" ? req.query.tag : undefined,
    email: typeof req.query.email === "string" ? req.query.email : undefined,
    context_id,
    context_primary_only: req.query.context_primary_only === "true",
  });

  res.json({
    slice_id: SLICE_ID,
    engine_id: ENGINE_ID,
    workspace_id,
    count: contacts.length,
    contacts,
  });
});

contactsRouter.post("/contacts", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  try {
    const input: CreateContactInput = {
      workspace_id,
      display_name: req.body?.display_name ?? "",
      first_name: req.body?.first_name,
      last_name: req.body?.last_name,
      emails: req.body?.emails,
      phones: req.body?.phones,
      addresses: req.body?.addresses,
      tags: req.body?.tags,
      notes: req.body?.notes,
      outreach_status: req.body?.outreach_status,
    };
    let contact = createContact(input);

    if (req.body?.organization_id) {
      const linked = linkContactToOrganization({
        contact_id: contact.contact_id,
        organization_id: req.body.organization_id,
        role_label: req.body.role_label,
      });
      if (linked) contact = linked;
    }

    res.status(201).json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/follow-ups", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  const ctx = accessFromRequest(req);
  const follow_ups = listWorkspaceFollowUps({ workspace_id, ctx });
  res.json({
    slice_id: TIMELINE_ENGINE_ID,
    engine_id: TIMELINE_ENGINE_ID,
    workspace_id,
    follow_ups,
  });
});

contactsRouter.get("/contacts/:id/timeline", (req, res) => {
  const ctx = accessFromRequest(req);
  const type_filter = typeof req.query.type === "string" ? req.query.type : undefined;
  const timeline = buildContactTimelineView({
    contact_id: req.params.id,
    ctx,
    type_filter,
  });
  if (!timeline) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({ slice_id: TIMELINE_ENGINE_ID, engine_id: TIMELINE_ENGINE_ID, timeline });
});

contactsRouter.patch("/contacts/:id/timeline/meta", (req, res) => {
  const ctx = accessFromRequest(req);
  if (ctx.role === "viewer") {
    res.status(403).json({ error: "forbidden", message: "Viewer cannot update timeline meta" });
    return;
  }
  const meta = updateTimelineMeta(req.params.id, {
    manual_summary: req.body?.manual_summary,
    relationship_owner_user_id: req.body?.relationship_owner_user_id,
    pinned_next_step: req.body?.pinned_next_step,
  });
  if (!meta) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({ slice_id: TIMELINE_ENGINE_ID, engine_id: TIMELINE_ENGINE_ID, meta });
});

contactsRouter.get("/contacts/:id/interactions", (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  const ctx = accessFromRequest(req);
  const type_filter = typeof req.query.type === "string" ? req.query.type : undefined;
  const timeline = buildContactTimelineView({
    contact_id: contact.contact_id,
    ctx,
    type_filter,
  });
  res.json({
    slice_id: TIMELINE_ENGINE_ID,
    engine_id: TIMELINE_ENGINE_ID,
    contact_id: contact.contact_id,
    interactions: timeline?.interactions ?? [],
  });
});

contactsRouter.post("/contacts/:id/interactions", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  const ctx = accessFromRequest(req);
  if (ctx.role === "viewer") {
    res.status(403).json({ error: "forbidden", message: "Viewer cannot log interactions" });
    return;
  }
  try {
    const interaction = createContactInteraction({
      workspace_id,
      contact_id: req.params.id,
      type: req.body?.type,
      summary: req.body?.summary ?? "",
      details: req.body?.details,
      occurred_at: req.body?.occurred_at,
      created_by_user_id: req.body?.created_by_user_id ?? ctx.user_id,
      assigned_to_user_id: req.body?.assigned_to_user_id,
      visibility: req.body?.visibility,
      sentiment: req.body?.sentiment,
      follow_up_required: req.body?.follow_up_required,
      follow_up_due_at: req.body?.follow_up_due_at,
      source: req.body?.source ?? "manual",
    });
    if (!interaction) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.status(201).json({ slice_id: TIMELINE_ENGINE_ID, engine_id: TIMELINE_ENGINE_ID, interaction });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.patch("/contacts/:contactId/interactions/:interactionId", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const interaction = updateContactInteraction(req.params.interactionId, req.body ?? {}, ctx);
    if (!interaction) {
      res.status(404).json({ error: "interaction_not_found_or_forbidden" });
      return;
    }
    res.json({ slice_id: TIMELINE_ENGINE_ID, engine_id: TIMELINE_ENGINE_ID, interaction });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.delete("/contacts/:contactId/interactions/:interactionId", (req, res) => {
  const ctx = accessFromRequest(req);
  const deleted = deleteContactInteraction(req.params.interactionId, ctx);
  if (!deleted) {
    res.status(404).json({ error: "interaction_not_found_or_forbidden" });
    return;
  }
  res.json({ slice_id: TIMELINE_ENGINE_ID, engine_id: TIMELINE_ENGINE_ID, deleted: true });
});

contactsRouter.get("/contacts/contexts", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  const contexts = listWorkspaceContexts(workspace_id, {
    include_archived: req.query.include_archived === "true",
  });
  res.json({ slice_id: CONTEXT_ENGINE_ID, engine_id: CONTEXT_ENGINE_ID, contexts });
});

contactsRouter.post("/contacts/contexts", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const context = createRelationshipContext(
      {
        workspace_id,
        label: req.body?.label ?? "",
        category: req.body?.category,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    res.status(201).json({ slice_id: CONTEXT_ENGINE_ID, engine_id: CONTEXT_ENGINE_ID, context });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.patch("/contacts/contexts/:contextId", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const context = updateRelationshipContext(req.params.contextId, req.body ?? {}, ctx);
    if (!context) {
      res.status(404).json({ error: "context_not_found" });
      return;
    }
    res.json({ slice_id: CONTEXT_ENGINE_ID, engine_id: CONTEXT_ENGINE_ID, context });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/contexts/:contextId/archive", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const context = archiveRelationshipContext(req.params.contextId, ctx);
    if (!context) {
      res.status(404).json({ error: "context_not_found" });
      return;
    }
    res.json({ slice_id: CONTEXT_ENGINE_ID, engine_id: CONTEXT_ENGINE_ID, context });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/contexts/merge", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const result = mergeRelationshipContexts(
      {
        workspace_id,
        from_context_id: req.body?.from_context_id,
        to_context_id: req.body?.to_context_id,
        merged_by_user_id: ctx.user_id,
        reason: req.body?.reason,
      },
      ctx,
    );
    if (!result) {
      res.status(404).json({ error: "merge_failed" });
      return;
    }
    res.json({ slice_id: CONTEXT_ENGINE_ID, engine_id: CONTEXT_ENGINE_ID, ...result });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/:id/contexts", (req, res) => {
  const view = listContactContextView(req.params.id);
  if (!view) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({ slice_id: CONTEXT_ENGINE_ID, engine_id: CONTEXT_ENGINE_ID, view });
});

contactsRouter.get("/contacts/:id/contexts/history", (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({
    slice_id: CONTEXT_ENGINE_ID,
    engine_id: CONTEXT_ENGINE_ID,
    history: listContactContextHistory(req.params.id),
  });
});

contactsRouter.post("/contacts/:id/contexts", (req, res) => {
  const ctx = accessFromRequest(req);
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  try {
    const link = assignContactContext(
      {
        workspace_id: contact.workspace_id,
        contact_id: contact.contact_id,
        context_id: req.body?.context_id,
        rank: req.body?.rank,
        effective_from: req.body?.effective_from,
        source: req.body?.source,
        created_by_user_id: ctx.user_id,
        reason: req.body?.reason,
      },
      ctx,
    );
    if (!link) {
      res.status(409).json({ error: "assign_failed", message: "Active link may already exist" });
      return;
    }
    res.status(201).json({ slice_id: CONTEXT_ENGINE_ID, engine_id: CONTEXT_ENGINE_ID, link });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.patch("/contacts/:contactId/contexts/:linkId", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const link = updateContactContextLink(req.params.linkId, req.body ?? {}, ctx);
    if (!link) {
      res.status(404).json({ error: "link_not_found" });
      return;
    }
    res.json({ slice_id: CONTEXT_ENGINE_ID, engine_id: CONTEXT_ENGINE_ID, link });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.delete("/contacts/:contactId/contexts/:linkId", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const link = endContactContextLink(
      req.params.linkId,
      {
        reason: typeof req.body?.reason === "string" ? req.body.reason : "",
        ended_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!link) {
      res.status(404).json({ error: "link_not_found" });
      return;
    }
    res.json({ slice_id: CONTEXT_ENGINE_ID, engine_id: CONTEXT_ENGINE_ID, link });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/stewardship/dashboard", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const dashboard = buildStewardshipDashboard(workspace_id, ctx);
    res.json({ slice_id: STEWARDSHIP_ENGINE_ID, engine_id: STEWARDSHIP_ENGINE_ID, dashboard });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/analytics/dashboard", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const dashboard = buildRelationshipAnalyticsDashboard(workspace_id, ctx, req.query as Record<string, unknown>);
    res.json({ slice_id: ANALYTICS_ENGINE_ID, engine_id: ANALYTICS_ENGINE_ID, dashboard });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/analytics/export", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const exportView = buildRelationshipAnalyticsExport(workspace_id, ctx, req.query as Record<string, unknown>);
    res.json({ slice_id: ANALYTICS_ENGINE_ID, engine_id: ANALYTICS_ENGINE_ID, export: exportView });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/:id/stewardship", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const view = buildContactStewardshipView(req.params.id, ctx);
    if (!view) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.json({ slice_id: STEWARDSHIP_ENGINE_ID, engine_id: STEWARDSHIP_ENGINE_ID, view });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/:id/stewardship/transitions", (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({
    slice_id: STEWARDSHIP_ENGINE_ID,
    engine_id: STEWARDSHIP_ENGINE_ID,
    transitions: listStewardTransitions(req.params.id),
  });
});

contactsRouter.post("/contacts/:id/stewardship/steward", (req, res) => {
  const ctx = accessFromRequest(req);
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  try {
    const view = assignContactSteward(
      {
        workspace_id: contact.workspace_id,
        contact_id: contact.contact_id,
        steward_user_id: req.body?.steward_user_id,
        reason: req.body?.reason,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!view) {
      res.status(400).json({ error: "assign_failed" });
      return;
    }
    res.json({ slice_id: STEWARDSHIP_ENGINE_ID, engine_id: STEWARDSHIP_ENGINE_ID, view });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.patch("/contacts/:id/stewardship", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const view = updateContactStewardship(
      req.params.id,
      {
        strength: req.body?.strength,
        lifecycle_stage: req.body?.lifecycle_stage,
        updated_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!view) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.json({ slice_id: STEWARDSHIP_ENGINE_ID, engine_id: STEWARDSHIP_ENGINE_ID, view });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/:id/stewardship/participants", (req, res) => {
  const ctx = accessFromRequest(req);
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  try {
    const participant = addContactStewardParticipant(
      {
        workspace_id: contact.workspace_id,
        contact_id: contact.contact_id,
        user_id: req.body?.user_id,
        role: req.body?.role,
        label: req.body?.label,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!participant) {
      res.status(409).json({ error: "participant_exists" });
      return;
    }
    res.status(201).json({ slice_id: STEWARDSHIP_ENGINE_ID, engine_id: STEWARDSHIP_ENGINE_ID, participant });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.delete("/contacts/:contactId/stewardship/participants/:participantId", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const participant = endContactStewardParticipant(req.params.participantId, ctx);
    if (!participant) {
      res.status(404).json({ error: "participant_not_found" });
      return;
    }
    res.json({ slice_id: STEWARDSHIP_ENGINE_ID, engine_id: STEWARDSHIP_ENGINE_ID, participant });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/actions/queue", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const queue = buildActionQueue({
      workspace_id,
      assigned_to_user_id:
        typeof req.query.assigned_to === "string" ? req.query.assigned_to : undefined,
      ctx,
    });
    res.json({ slice_id: ACTION_ENGINE_ID, engine_id: ACTION_ENGINE_ID, queue });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/:id/actions", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const view = buildContactActionView(req.params.id, ctx);
    if (!view) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.json({ slice_id: ACTION_ENGINE_ID, engine_id: ACTION_ENGINE_ID, view });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/:id/actions/tasks", (req, res) => {
  const ctx = accessFromRequest(req);
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  try {
    const task = createContactActionTask(
      {
        workspace_id: contact.workspace_id,
        contact_id: contact.contact_id,
        title: req.body?.title,
        details: req.body?.details,
        priority: req.body?.priority,
        assigned_to_user_id: req.body?.assigned_to_user_id,
        due_at: req.body?.due_at,
        interaction_id: req.body?.interaction_id,
        context_id: req.body?.context_id,
        source: req.body?.source,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!task) {
      res.status(400).json({ error: "create_failed" });
      return;
    }
    res.status(201).json({ slice_id: ACTION_ENGINE_ID, engine_id: ACTION_ENGINE_ID, task });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.patch("/contacts/actions/tasks/:taskId", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const task = updateContactActionTask(
      req.params.taskId,
      {
        title: req.body?.title,
        details: req.body?.details,
        priority: req.body?.priority,
        assigned_to_user_id: req.body?.assigned_to_user_id,
        due_at: req.body?.due_at,
        updated_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!task) {
      res.status(404).json({ error: "task_not_found" });
      return;
    }
    res.json({ slice_id: ACTION_ENGINE_ID, engine_id: ACTION_ENGINE_ID, task });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/actions/tasks/:taskId/complete", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const task = completeContactActionTask(
      req.params.taskId,
      {
        completed_by_user_id: ctx.user_id,
        note: req.body?.note,
      },
      ctx,
    );
    if (!task) {
      res.status(404).json({ error: "task_not_found" });
      return;
    }
    res.json({ slice_id: ACTION_ENGINE_ID, engine_id: ACTION_ENGINE_ID, task });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/actions/follow-ups/:interactionId/complete", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const ok = completeInteractionFollowUp(req.params.interactionId, ctx);
    if (!ok) {
      res.status(404).json({ error: "follow_up_not_found" });
      return;
    }
    res.json({ slice_id: ACTION_ENGINE_ID, engine_id: ACTION_ENGINE_ID, completed: true });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/households", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const households = searchHouseholds({
      workspace_id,
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      ctx,
    });
    res.json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, households });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/households", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const household = createHousehold(
      {
        workspace_id,
        name: req.body?.name,
        primary_address: req.body?.primary_address,
        voting_district: req.body?.voting_district,
        primary_contact_id: req.body?.primary_contact_id,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!household) {
      res.status(400).json({ error: "create_failed" });
      return;
    }
    const summary = buildHouseholdSummary(household.household_id, ctx);
    res.status(201).json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/households/:id", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const summary = buildHouseholdSummary(req.params.id, ctx);
    if (!summary) {
      res.status(404).json({ error: "household_not_found" });
      return;
    }
    res.json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.patch("/contacts/households/:id", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const household = updateHousehold(
      req.params.id,
      {
        name: req.body?.name,
        primary_address: req.body?.primary_address,
        voting_district: req.body?.voting_district,
        primary_contact_id: req.body?.primary_contact_id,
        updated_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!household) {
      res.status(404).json({ error: "household_not_found" });
      return;
    }
    const summary = buildHouseholdSummary(household.household_id, ctx);
    res.json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/households/:id/members", (req, res) => {
  const ctx = accessFromRequest(req);
  const household = getHouseholdById(req.params.id);
  if (!household) {
    res.status(404).json({ error: "household_not_found" });
    return;
  }
  try {
    const member = addHouseholdMember(
      {
        workspace_id: household.workspace_id,
        household_id: household.household_id,
        contact_id: req.body?.contact_id,
        role: req.body?.role,
        relationship_label: req.body?.relationship_label,
        is_primary_residence: req.body?.is_primary_residence,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!member) {
      res.status(409).json({ error: "member_exists" });
      return;
    }
    const summary = buildHouseholdSummary(household.household_id, ctx);
    res.status(201).json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, member, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.delete("/contacts/households/:householdId/members/:memberId", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const member = removeHouseholdMember(req.params.memberId, ctx, ctx.user_id);
    if (!member) {
      res.status(404).json({ error: "member_not_found" });
      return;
    }
    const summary = buildHouseholdSummary(req.params.householdId, ctx);
    res.json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, member, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/households/:id/relationships", (req, res) => {
  const ctx = accessFromRequest(req);
  const household = getHouseholdById(req.params.id);
  if (!household) {
    res.status(404).json({ error: "household_not_found" });
    return;
  }
  try {
    const relationship = addHouseholdRelationship(
      {
        workspace_id: household.workspace_id,
        household_id: household.household_id,
        from_contact_id: req.body?.from_contact_id,
        to_contact_id: req.body?.to_contact_id,
        relationship_type: req.body?.relationship_type,
        label: req.body?.label,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!relationship) {
      res.status(400).json({ error: "relationship_failed" });
      return;
    }
    const summary = buildHouseholdSummary(household.household_id, ctx);
    res.status(201).json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, relationship, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/households/merge", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const summary = mergeHouseholds(
      {
        workspace_id,
        from_household_id: req.body?.from_household_id,
        to_household_id: req.body?.to_household_id,
        reason: req.body?.reason,
        merged_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!summary) {
      res.status(400).json({ error: "merge_failed" });
      return;
    }
    res.json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/households/:id/split", (req, res) => {
  const ctx = accessFromRequest(req);
  const household = getHouseholdById(req.params.id);
  if (!household) {
    res.status(404).json({ error: "household_not_found" });
    return;
  }
  try {
    const result = splitHousehold(
      {
        workspace_id: household.workspace_id,
        source_household_id: household.household_id,
        new_household_name: req.body?.new_household_name,
        member_contact_ids: req.body?.member_contact_ids ?? [],
        reason: req.body?.reason,
        split_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!result) {
      res.status(400).json({ error: "split_failed" });
      return;
    }
    res.json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, ...result });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/households/:id/primary-residence", (req, res) => {
  const ctx = accessFromRequest(req);
  const household = getHouseholdById(req.params.id);
  if (!household) {
    res.status(404).json({ error: "household_not_found" });
    return;
  }
  try {
    const summary = transferPrimaryResidence(
      {
        workspace_id: household.workspace_id,
        household_id: household.household_id,
        contact_id: req.body?.contact_id,
        changed_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!summary) {
      res.status(400).json({ error: "transfer_failed" });
      return;
    }
    res.json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/households/:id/history", (req, res) => {
  const household = getHouseholdById(req.params.id);
  if (!household) {
    res.status(404).json({ error: "household_not_found" });
    return;
  }
  res.json({
    slice_id: HOUSEHOLD_ENGINE_ID,
    engine_id: HOUSEHOLD_ENGINE_ID,
    history: listHouseholdHistoryExport(req.params.id),
  });
});

contactsRouter.get("/contacts/:id/households", (req, res) => {
  const ctx = accessFromRequest(req);
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  try {
    const households = listHouseholdsForContact(req.params.id, ctx);
    res.json({ slice_id: HOUSEHOLD_ENGINE_ID, engine_id: HOUSEHOLD_ENGINE_ID, households });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/organizations/search", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const organizations = searchOrganizations({
      workspace_id,
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      category: typeof req.query.category === "string" ? req.query.category : undefined,
      ctx,
    });
    res.json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, organizations });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/organizations", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const organization = createOrganizationRecord(
      {
        workspace_id,
        name: req.body?.name,
        category: req.body?.category,
        description: req.body?.description,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!organization) {
      res.status(400).json({ error: "create_failed" });
      return;
    }
    const summary = buildOrganizationSummary(organization.organization_id, ctx);
    res.status(201).json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/organizations/:id", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const summary = buildOrganizationSummary(req.params.id, ctx);
    if (!summary) {
      res.status(404).json({ error: "organization_not_found" });
      return;
    }
    res.json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.patch("/contacts/organizations/:id", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const organization = updateOrganizationRecord(
      req.params.id,
      {
        name: req.body?.name,
        category: req.body?.category,
        description: req.body?.description,
        updated_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!organization) {
      res.status(404).json({ error: "organization_not_found" });
      return;
    }
    const summary = buildOrganizationSummary(organization.organization_id, ctx);
    res.json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/organizations/:id/archive", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const organization = archiveOrganizationRecord(req.params.id, ctx, ctx.user_id);
    if (!organization) {
      res.status(404).json({ error: "organization_not_found" });
      return;
    }
    res.json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, organization });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/organizations/:id/memberships", (req, res) => {
  const ctx = accessFromRequest(req);
  const organization = getOrganizationById(req.params.id);
  if (!organization) {
    res.status(404).json({ error: "organization_not_found" });
    return;
  }
  try {
    const membership = addOrganizationMembership(
      {
        workspace_id: organization.workspace_id,
        organization_id: organization.organization_id,
        contact_id: req.body?.contact_id,
        membership_role: req.body?.membership_role,
        membership_status: req.body?.membership_status,
        custom_role_label: req.body?.custom_role_label,
        started_at: req.body?.started_at,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!membership) {
      res.status(409).json({ error: "membership_exists" });
      return;
    }
    const summary = buildOrganizationSummary(organization.organization_id, ctx);
    res.status(201).json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, membership, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.patch("/contacts/organizations/memberships/:membershipId", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const membership = updateOrganizationMembership(
      req.params.membershipId,
      {
        membership_role: req.body?.membership_role,
        membership_status: req.body?.membership_status,
        custom_role_label: req.body?.custom_role_label,
        started_at: req.body?.started_at,
        updated_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!membership) {
      res.status(404).json({ error: "membership_not_found" });
      return;
    }
    const summary = buildOrganizationSummary(membership.organization_id, ctx);
    res.json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, membership, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.delete("/contacts/organizations/memberships/:membershipId", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const membership = endOrganizationMembership(req.params.membershipId, ctx, ctx.user_id);
    if (!membership) {
      res.status(404).json({ error: "membership_not_found" });
      return;
    }
    const summary = buildOrganizationSummary(membership.organization_id, ctx);
    res.json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, membership, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/organizations/:id/roles", (req, res) => {
  const ctx = accessFromRequest(req);
  const organization = getOrganizationById(req.params.id);
  if (!organization) {
    res.status(404).json({ error: "organization_not_found" });
    return;
  }
  try {
    const role = assignOrganizationRole(
      {
        workspace_id: organization.workspace_id,
        organization_id: organization.organization_id,
        membership_id: req.body?.membership_id,
        contact_id: req.body?.contact_id,
        role: req.body?.role,
        label: req.body?.label,
        created_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!role) {
      res.status(400).json({ error: "role_assignment_failed" });
      return;
    }
    const summary = buildOrganizationSummary(organization.organization_id, ctx);
    res.status(201).json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, role, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/organizations/merge", (req, res) => {
  const ctx = accessFromRequest(req);
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  try {
    const summary = mergeOrganizations(
      {
        workspace_id,
        from_organization_id: req.body?.from_organization_id,
        to_organization_id: req.body?.to_organization_id,
        reason: req.body?.reason,
        merged_by_user_id: ctx.user_id,
      },
      ctx,
    );
    if (!summary) {
      res.status(400).json({ error: "merge_failed" });
      return;
    }
    res.json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, summary });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/organizations/:id/history", (req, res) => {
  const organization = getOrganizationById(req.params.id);
  if (!organization) {
    res.status(404).json({ error: "organization_not_found" });
    return;
  }
  res.json({
    slice_id: ORGANIZATION_ENGINE_ID,
    engine_id: ORGANIZATION_ENGINE_ID,
    history: listOrganizationHistoryExport(req.params.id),
  });
});

contactsRouter.get("/contacts/organizations/:id/contacts", (req, res) => {
  const ctx = accessFromRequest(req);
  const organization = getOrganizationById(req.params.id);
  if (!organization) {
    res.status(404).json({ error: "organization_not_found" });
    return;
  }
  res.json({
    slice_id: ORGANIZATION_ENGINE_ID,
    engine_id: ORGANIZATION_ENGINE_ID,
    members: listOrganizationContacts(req.params.id, ctx),
  });
});

contactsRouter.get("/contacts/:id/organizations", (req, res) => {
  const ctx = accessFromRequest(req);
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  try {
    const organizations = listOrganizationsForContact(req.params.id, ctx);
    res.json({ slice_id: ORGANIZATION_ENGINE_ID, engine_id: ORGANIZATION_ENGINE_ID, organizations });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/:id/brief", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const brief = buildContactBrief(req.params.id, ctx);
    if (!brief) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.json({ slice_id: BRIEF_ENGINE_ID, engine_id: BRIEF_ENGINE_ID, brief });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/:id/brief/regenerate", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const brief = regenerateContactBrief(req.params.id, ctx);
    if (!brief) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.json({ slice_id: BRIEF_ENGINE_ID, engine_id: BRIEF_ENGINE_ID, brief });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/:id/brief/evidence", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const evidence = buildContactBriefEvidenceView(req.params.id, ctx);
    if (!evidence) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.json({ slice_id: BRIEF_ENGINE_ID, engine_id: BRIEF_ENGINE_ID, evidence });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/:id/drafts", (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({
    slice_id: SLICE_ID,
    engine_id: ENGINE_ID,
    contact_id: contact.contact_id,
    drafts: listContactDraftLinks(contact.contact_id),
  });
});

contactsRouter.get("/contacts/:id/outreach-audit", (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({
    slice_id: SLICE_ID,
    engine_id: ENGINE_ID,
    contact_id: contact.contact_id,
    audit: listContactOutreachAudit(contact.contact_id),
  });
});

contactsRouter.post("/contacts/:id/outreach", (req, res) => {
  try {
    const contact = updateContactOutreachWithAudit(req.params.id, {
      outreach_status: req.body?.outreach_status,
      note: req.body?.note ?? "",
      draft_link_id: req.body?.draft_link_id,
    });
    if (!contact) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/:id", (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
});

contactsRouter.patch("/contacts/:id", (req, res) => {
  try {
    const input: UpdateContactInput = {
      display_name: req.body?.display_name,
      first_name: req.body?.first_name,
      last_name: req.body?.last_name,
      emails: req.body?.emails,
      phones: req.body?.phones,
      addresses: req.body?.addresses,
      tags: req.body?.tags,
      notes: req.body?.notes,
      outreach_status: req.body?.outreach_status,
    };
    const contact = updateContact(req.params.id, input);
    if (!contact) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/:id/archive", (req, res) => {
  const contact = archiveContact(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
});

contactsRouter.post("/contacts/:id/restore", (req, res) => {
  const contact = restoreContact(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
});

contactsRouter.post("/contacts/:id/affiliations", (req, res) => {
  const organization_id = req.body?.organization_id;
  if (!organization_id || typeof organization_id !== "string") {
    res.status(400).json({ error: "organization_id is required" });
    return;
  }

  const contact = linkContactToOrganization({
    contact_id: req.params.id,
    organization_id,
    role_label: req.body?.role_label,
  });
  if (!contact) {
    res.status(404).json({ error: "contact_or_organization_not_found" });
    return;
  }
  res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
});
