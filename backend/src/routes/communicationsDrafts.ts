import { Router } from "express";
import { proposeFixtureTraceableDraft } from "../communicationsOffice/fixtureTraceableDraftAdapter.js";
import { generateContactLinkedDraft } from "../contacts/contactDraftLinkService.js";
import { getContactDraftLinkById } from "../contacts/contactDraftLinkRepository.js";
import { ContactValidationError } from "../contacts/contactValidator.js";

export const communicationsDraftsRouter = Router();

const ENGINE_ID = "ENG-CONTACT-001.4";
const SLICE_ID = "ENG-CONTACT-001.4";

function mapError(error: unknown, res: import("express").Response): boolean {
  if (error instanceof ContactValidationError) {
    res.status(400).json({ error: error.code, message: error.message });
    return true;
  }
  return false;
}

communicationsDraftsRouter.post("/communications/drafts/generate", async (req, res) => {
  try {
    const workspace_id =
      (typeof req.body?.workspace_id === "string" && req.body.workspace_id.trim()) ||
      (typeof req.query.workspace_id === "string" && req.query.workspace_id.trim()) ||
      "";
    if (!workspace_id) {
      res.status(400).json({ error: "workspace_id is required" });
      return;
    }

    const result = await generateContactLinkedDraft({
      workspace_id,
      intent_label: req.body?.intent_label ?? "",
      audience_label: req.body?.audience_label,
      request_id: req.body?.request_id,
      contact_id: req.body?.contact_id,
      recipient_refs: req.body?.recipient_refs,
      substrate_refs: req.body?.substrate_refs,
      adapter: req.body?.use_fixture ? proposeFixtureTraceableDraft : undefined,
    });

    res.status(201).json({
      slice_id: SLICE_ID,
      engine_id: ENGINE_ID,
      result: {
        engine_id: result.engine_id,
        draft_id: result.draft_id,
        links: result.links,
        advisory_notice: result.advisory_notice,
        body_preview: result.body_preview,
      },
      draft: result.draft,
    });
  } catch (error) {
    if (mapError(error, res)) return;
    throw error;
  }
});

communicationsDraftsRouter.get("/communications/drafts/links/:linkId", (req, res) => {
  const link = getContactDraftLinkById(req.params.linkId);
  if (!link) {
    res.status(404).json({ error: "draft_link_not_found" });
    return;
  }
  res.json({
    slice_id: SLICE_ID,
    engine_id: ENGINE_ID,
    link: {
      link_id: link.link_id,
      workspace_id: link.workspace_id,
      contact_id: link.contact_id,
      draft_id: link.draft_id,
      request_id: link.request_id,
      intent_label: link.intent_label,
      audience_label: link.audience_label,
      body_preview: link.body_preview,
      linked_at: link.linked_at,
      recipient_snapshot: link.recipient_snapshot,
    },
    draft: link.draft,
  });
});
