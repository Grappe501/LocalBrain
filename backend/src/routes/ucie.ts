import { Router } from "express";
import {
  approveSchemaForSession,
  attachVoterToRow,
  buildQualityDashboard,
  disconnectConnectorSession,
  intakeCsvToSession,
  intakeManualRow,
  intakeOcrArtifact,
  listConnectorDefinitions,
  searchVoters,
  startConnectorSession,
  startImportSession,
} from "../ucie/ucieIntakeService.js";
import { commitImportRow } from "../ucie/ucieCommitService.js";
import { getMatchResult, resolveIdentityForRow } from "../ucie/ucieIdentityResolutionService.js";
import { listProvenanceForContact } from "../ucie/ucieProvenanceService.js";
import {
  getImportRow,
  getImportSession,
  listImportRows,
  listImportSessions,
} from "../ucie/ucieSessionRepository.js";
import {
  assertUcieCapable,
  canClaimWork,
  canCommitUcie,
  canIntakeUcie,
  canReviewUcie,
  resolveUcieAccessContext,
  UcieValidationError,
} from "../ucie/ucieValidator.js";
import {
  claimWorkItem,
  completeWorkItem,
  getWorkItem,
  listOpenWorkItems,
} from "../ucie/ucieWorkService.js";

export const ucieRouter = Router();

const ENGINE_ID = "CONTACT-V3-100";

function accessFromRequest(req: import("express").Request) {
  return resolveUcieAccessContext({
    user_id: req.header("x-contact-user-id") ?? req.query.user_id,
    role: req.header("x-contact-user-role") ?? req.query.user_role,
  });
}

function mapUcieError(error: unknown, res: import("express").Response): boolean {
  if (error instanceof UcieValidationError) {
    res.status(error.code === "forbidden" ? 403 : 400).json({ error: error.code, message: error.message });
    return true;
  }
  return false;
}

ucieRouter.get("/ucie/sessions", (req, res) => {
  const workspace_id = typeof req.query.workspace_id === "string" ? req.query.workspace_id : null;
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  const ctx = accessFromRequest(req);
  try {
    assertUcieCapable(canReviewUcie(ctx), "forbidden", "Insufficient permissions");
    res.json({ engine_id: ENGINE_ID, sessions: listImportSessions(workspace_id) });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.post("/ucie/sessions", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const session = startImportSession(
      {
        workspace_id: req.body.workspace_id,
        source_type: req.body.source_type,
        source_label: req.body.source_label,
      },
      ctx,
    );
    res.status(201).json({ engine_id: ENGINE_ID, session });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.get("/ucie/sessions/:id", (req, res) => {
  const session = getImportSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: "session_not_found" });
    return;
  }
  res.json({ engine_id: ENGINE_ID, session, rows: listImportRows(session.session_id) });
});

ucieRouter.post("/ucie/sessions/:id/intake/csv", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    assertUcieCapable(canIntakeUcie(ctx), "forbidden", "Insufficient permissions");
    const result = intakeCsvToSession({
      session_id: req.params.id,
      filename: req.body.filename ?? "upload.csv",
      csv_text: req.body.csv_text,
      uploaded_by_user_id: ctx.user_id,
    });
    res.json({ engine_id: ENGINE_ID, ...result });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.post("/ucie/sessions/:id/schema/approve", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    assertUcieCapable(canReviewUcie(ctx), "forbidden", "Insufficient permissions");
    const schema = approveSchemaForSession({
      session_id: req.params.id,
      mappings: req.body.mappings,
      approved_by_user_id: ctx.user_id,
      remember_for_future: Boolean(req.body.remember_for_future),
    });
    res.json({ engine_id: ENGINE_ID, schema });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.post("/ucie/sessions/:id/intake/manual", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    assertUcieCapable(canIntakeUcie(ctx), "forbidden", "Insufficient permissions");
    const row_id = intakeManualRow({
      session_id: req.params.id,
      fields: req.body.fields ?? {},
      uploaded_by_user_id: ctx.user_id,
    });
    res.status(201).json({ engine_id: ENGINE_ID, row_id });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.post("/ucie/sessions/:id/intake/ocr", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    assertUcieCapable(canIntakeUcie(ctx), "forbidden", "Insufficient permissions");
    const row_id = intakeOcrArtifact({
      session_id: req.params.id,
      filename: req.body.filename ?? "scan.jpg",
      storage_ref: req.body.storage_ref,
      extracted_fields: req.body.extracted_fields ?? {},
      uploaded_by_user_id: ctx.user_id,
    });
    res.status(201).json({ engine_id: ENGINE_ID, row_id });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.get("/ucie/rows/:id", (req, res) => {
  const row = getImportRow(req.params.id);
  if (!row) {
    res.status(404).json({ error: "row_not_found" });
    return;
  }
  const match = getMatchResult(row.row_id);
  res.json({ engine_id: ENGINE_ID, row, match });
});

ucieRouter.post("/ucie/rows/:id/resolve", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    assertUcieCapable(canReviewUcie(ctx), "forbidden", "Insufficient permissions");
    const match = resolveIdentityForRow(req.params.id);
    if (!match) {
      res.status(404).json({ error: "row_not_found" });
      return;
    }
    res.json({ engine_id: ENGINE_ID, match });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.post("/ucie/rows/:id/commit", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    assertUcieCapable(canCommitUcie(ctx), "forbidden", "Insufficient permissions to commit");
    const result = commitImportRow({
      row_id: req.params.id,
      committed_by_user_id: ctx.user_id,
      force_create: Boolean(req.body.force_create),
    });
    if (!result) {
      res.status(404).json({ error: "row_not_found" });
      return;
    }
    res.json({ engine_id: ENGINE_ID, result });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.get("/ucie/voters/search", (req, res) => {
  const workspace_id = typeof req.query.workspace_id === "string" ? req.query.workspace_id : null;
  const county = typeof req.query.county === "string" ? req.query.county : null;
  if (!workspace_id || !county) {
    res.status(400).json({ error: "workspace_id and county are required" });
    return;
  }
  res.json({
    engine_id: ENGINE_ID,
    voters: searchVoters({
      workspace_id,
      county,
      last_name: typeof req.query.last_name === "string" ? req.query.last_name : undefined,
      first_name: typeof req.query.first_name === "string" ? req.query.first_name : undefined,
      address: typeof req.query.address === "string" ? req.query.address : undefined,
      date_of_birth: typeof req.query.date_of_birth === "string" ? req.query.date_of_birth : undefined,
    }),
  });
});

ucieRouter.post("/ucie/rows/:id/voter/attach", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    assertUcieCapable(canReviewUcie(ctx), "forbidden", "Insufficient permissions");
    attachVoterToRow({
      row_id: req.params.id,
      voter_id: req.body.voter_id,
      verified_by_user_id: ctx.user_id,
    });
    res.json({ engine_id: ENGINE_ID, ok: true });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.get("/ucie/work", (req, res) => {
  const workspace_id = typeof req.query.workspace_id === "string" ? req.query.workspace_id : null;
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  res.json({ engine_id: ENGINE_ID, items: listOpenWorkItems(workspace_id) });
});

ucieRouter.post("/ucie/work/:id/claim", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    assertUcieCapable(canClaimWork(ctx), "forbidden", "Insufficient permissions");
    const item = claimWorkItem({ work_item_id: req.params.id, user_id: ctx.user_id });
    if (!item) {
      res.status(404).json({ error: "work_item_not_found" });
      return;
    }
    res.json({ engine_id: ENGINE_ID, item });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.post("/ucie/work/:id/complete", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const item = completeWorkItem({
      work_item_id: req.params.id,
      user_id: ctx.user_id,
      resolution_note: req.body.resolution_note,
    });
    if (!item) {
      res.status(404).json({ error: "work_item_not_found" });
      return;
    }
    res.json({ engine_id: ENGINE_ID, item });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.get("/ucie/work/:id", (req, res) => {
  const item = getWorkItem(req.params.id);
  if (!item) {
    res.status(404).json({ error: "work_item_not_found" });
    return;
  }
  res.json({ engine_id: ENGINE_ID, item });
});

ucieRouter.get("/ucie/contacts/:id/provenance", (req, res) => {
  res.json({ engine_id: ENGINE_ID, chains: listProvenanceForContact(req.params.id) });
});

ucieRouter.get("/ucie/connectors", (_req, res) => {
  res.json({ engine_id: ENGINE_ID, connectors: listConnectorDefinitions() });
});

ucieRouter.post("/ucie/connectors/sessions", (req, res) => {
  const ctx = accessFromRequest(req);
  try {
    const session = startConnectorSession(
      {
        workspace_id: req.body.workspace_id,
        connector_type: req.body.connector_type,
        connected_by_user_id: ctx.user_id,
      },
      ctx,
    );
    res.status(201).json({ engine_id: ENGINE_ID, session });
  } catch (error) {
    if (mapUcieError(error, res)) return;
    throw error;
  }
});

ucieRouter.post("/ucie/connectors/sessions/:id/disconnect", (req, res) => {
  disconnectConnectorSession(req.params.id);
  res.json({ engine_id: ENGINE_ID, ok: true });
});

ucieRouter.get("/ucie/dashboard/quality", (req, res) => {
  const workspace_id = typeof req.query.workspace_id === "string" ? req.query.workspace_id : null;
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  res.json({ engine_id: ENGINE_ID, dashboard: buildQualityDashboard(workspace_id) });
});
