import { Router } from "express";
import { products, masterPlans, phases, snapshot, validateSnapshot } from "../companyFoundry/companyFoundryRegistry.js";
import {
  addFoundryEvidence,
  createFoundryProposal,
  getFoundryAudit,
  getFoundryProposal,
  listFoundryEvidence,
  listFoundryProposals,
  listFoundryReviews,
  reviewFoundryProposal,
  submitFoundryProposal,
  type FoundryProposalKind,
} from "../companyFoundry/persistence.js";

export const companyFoundryRouter = Router();

companyFoundryRouter.get("/foundry/snapshot", (_req, res) => {
  const errors = validateSnapshot(snapshot);
  if (errors.length > 0) return res.status(500).json({ error: "foundry_registry_invalid", errors });
  return res.json(snapshot);
});

companyFoundryRouter.get("/foundry/products", (_req, res) => res.json({ products }));
companyFoundryRouter.get("/foundry/master-plans", (_req, res) => res.json({ masterPlans }));
companyFoundryRouter.get("/foundry/phases", (_req, res) => res.json({ phases }));

companyFoundryRouter.get("/foundry/products/:productId", (req, res) => {
  const product = products.find((item) => item.id === req.params.productId);
  if (!product) return res.status(404).json({ error: "product_not_found" });
  return res.json({
    product,
    masterPlans: masterPlans.filter((plan) => plan.productId === product.id),
    phases: phases.filter((phase) => phase.productId === product.id),
  });
});

companyFoundryRouter.get("/foundry/validation", (_req, res) => {
  const errors = validateSnapshot(snapshot);
  return res.status(errors.length === 0 ? 200 : 500).json({ valid: errors.length === 0, errors, schemaVersion: snapshot.meta.schemaVersion, slice: snapshot.meta.slice });
});

companyFoundryRouter.get("/foundry/proposals", (_req, res) => res.json({ proposals: listFoundryProposals() }));
companyFoundryRouter.get("/foundry/proposals/:proposalId", (req, res) => {
  const proposal = getFoundryProposal(req.params.proposalId);
  if (!proposal) return res.status(404).json({ error: "proposal_not_found" });
  return res.json({ proposal, evidence: listFoundryEvidence(proposal.id), reviews: listFoundryReviews(proposal.id) });
});

companyFoundryRouter.post("/foundry/proposals", (req, res) => {
  const { kind, subjectId, submittedBy, title, summary, payload } = req.body ?? {};
  const allowedKinds: FoundryProposalKind[] = ["product_change", "builder_application", "phase_submission", "capstone_application", "registry_change"];
  if (!allowedKinds.includes(kind) || !submittedBy || !title || !summary) return res.status(400).json({ error: "invalid_proposal" });
  return res.status(201).json({ proposal: createFoundryProposal({ kind, subjectId, submittedBy, title, summary, payload }) });
});

companyFoundryRouter.post("/foundry/proposals/:proposalId/submit", (req, res) => {
  const actorId = String(req.body?.actorId ?? "").trim();
  if (!actorId) return res.status(400).json({ error: "actor_required" });
  const proposal = submitFoundryProposal(req.params.proposalId, actorId);
  if (!proposal) return res.status(409).json({ error: "proposal_not_draft_or_missing" });
  return res.json({ proposal });
});

companyFoundryRouter.post("/foundry/proposals/:proposalId/evidence", (req, res) => {
  const { actorId, evidenceType, label, uri, contentHash, notes } = req.body ?? {};
  if (!actorId || !evidenceType || !label) return res.status(400).json({ error: "invalid_evidence" });
  const evidence = addFoundryEvidence({ proposalId: req.params.proposalId, actorId, evidenceType, label, uri, contentHash, notes });
  if (!evidence) return res.status(404).json({ error: "proposal_not_found" });
  return res.status(201).json({ evidence });
});

companyFoundryRouter.post("/foundry/proposals/:proposalId/review", (req, res) => {
  const { reviewerId, decision, rationale } = req.body ?? {};
  if (!reviewerId || !["accepted", "rejected", "rework"].includes(decision) || !rationale) return res.status(400).json({ error: "invalid_review" });
  const proposal = getFoundryProposal(req.params.proposalId);
  if (!proposal) return res.status(404).json({ error: "proposal_not_found" });
  if (proposal.submitted_by === reviewerId) return res.status(403).json({ error: "self_acceptance_forbidden" });
  const review = reviewFoundryProposal({ proposalId: proposal.id, reviewerId, decision, rationale });
  if (!review) return res.status(409).json({ error: "proposal_not_reviewable" });
  return res.status(201).json({ review, proposal: getFoundryProposal(proposal.id) });
});

companyFoundryRouter.get("/foundry/audit", (req, res) => {
  const limit = Number(req.query.limit ?? 100);
  return res.json({ events: getFoundryAudit(Number.isFinite(limit) ? limit : 100) });
});

companyFoundryRouter.get("/foundry/write-capabilities", (_req, res) => res.json({
  governanceWritesEnabled: true,
  productMutationEnabled: false,
  builderAdmissionEnabled: false,
  phaseAcceptanceEffectsEnabled: false,
  payrollEnabled: false,
  equityIssuanceEnabled: false,
  residualSettlementEnabled: false,
  moneyMovementEnabled: false,
}));
