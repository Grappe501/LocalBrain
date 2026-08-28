import { Router } from "express";
import { products, masterPlans, phases, snapshot, validateSnapshot } from "../companyFoundry/companyFoundryRegistry.js";
import { academyDoctrine, academyModules, academyStages } from "../companyFoundry/academyCurriculum.js";
import {
  decideStageGate,
  enrollBuilder,
  getEnrollment,
  getLearnerDashboard,
  getModuleProgress,
  getGateRecords,
  listEnrollments,
  startModule,
  submitModuleAttempt,
} from "../companyFoundry/learnerProgress.js";
import {
  assignProductionPhase,
  getEligibleProductionPhases,
  getProductionAssignmentDetail,
  getProductionLabMetrics,
  listProductionAssignments,
  reviewProductionWork,
  startProductionAssignment,
  submitProductionWork,
} from "../companyFoundry/productionLab.js";
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
import {
  applyAcceptedProposalEffect,
  listFoundryBuilders,
  listFoundryCapabilityEvents,
  listFoundryCohorts,
  listFoundryMasterPlanRecords,
} from "../companyFoundry/effects.js";

export const companyFoundryRouter = Router();

companyFoundryRouter.get("/foundry/snapshot", (_req, res) => {
  const errors = validateSnapshot(snapshot);
  if (errors.length > 0) return res.status(500).json({ error: "foundry_registry_invalid", errors });
  return res.json(snapshot);
});
companyFoundryRouter.get("/foundry/products", (_req, res) => res.json({ products }));
companyFoundryRouter.get("/foundry/master-plans", (_req, res) => res.json({ masterPlans }));
companyFoundryRouter.get("/foundry/phases", (_req, res) => res.json({ phases }));
companyFoundryRouter.get("/foundry/builders", (_req, res) => res.json({ builders: listFoundryBuilders() }));
companyFoundryRouter.get("/foundry/capability-events", (req, res) => res.json({ events: listFoundryCapabilityEvents(req.query.builderId ? String(req.query.builderId) : undefined) }));
companyFoundryRouter.get("/foundry/cohorts", (_req, res) => res.json({ cohorts: listFoundryCohorts() }));
companyFoundryRouter.get("/foundry/admitted-master-plans", (_req, res) => res.json({ masterPlans: listFoundryMasterPlanRecords() }));

companyFoundryRouter.get("/foundry/academy/curriculum", (_req, res) => {
  return res.json({ doctrine: academyDoctrine, stages: academyStages, modules: academyModules });
});
companyFoundryRouter.get("/foundry/academy/stages/:stageId", (req, res) => {
  const stage = academyStages.find((item) => item.id === req.params.stageId);
  if (!stage) return res.status(404).json({ error: "academy_stage_not_found" });
  return res.json({ stage, modules: academyModules.filter((item) => item.stageId === stage.id) });
});
companyFoundryRouter.get("/foundry/academy/modules/:moduleId", (req, res) => {
  const module = academyModules.find((item) => item.id === req.params.moduleId);
  if (!module) return res.status(404).json({ error: "academy_module_not_found" });
  const stage = academyStages.find((item) => item.id === module.stageId) ?? null;
  return res.json({ module, stage });
});

companyFoundryRouter.get("/foundry/academy/enrollments", (_req, res) => res.json({ enrollments: listEnrollments() }));
companyFoundryRouter.post("/foundry/academy/enrollments", (req, res) => {
  const builderId = String(req.body?.builderId ?? "").trim();
  const cohortId = req.body?.cohortId ? String(req.body.cohortId) : null;
  if (!builderId) return res.status(400).json({ error: "builder_id_required" });
  return res.status(201).json({ enrollment: enrollBuilder({ builderId, cohortId }) });
});
companyFoundryRouter.get("/foundry/academy/enrollments/:enrollmentId", (req, res) => {
  const enrollment = getEnrollment(req.params.enrollmentId);
  if (!enrollment) return res.status(404).json({ error: "academy_enrollment_not_found" });
  return res.json({ enrollment, progress: getModuleProgress(enrollment.id), gates: getGateRecords(enrollment.id) });
});
companyFoundryRouter.get("/foundry/academy/enrollments/:enrollmentId/dashboard", (req, res) => {
  const dashboard = getLearnerDashboard(req.params.enrollmentId);
  if (!dashboard) return res.status(404).json({ error: "academy_enrollment_not_found" });
  return res.json(dashboard);
});
companyFoundryRouter.post("/foundry/academy/enrollments/:enrollmentId/modules/:moduleId/start", (req, res) => {
  const progress = startModule(req.params.enrollmentId, req.params.moduleId);
  if (!progress) return res.status(409).json({ error: "module_not_startable" });
  return res.json({ progress });
});
companyFoundryRouter.post("/foundry/academy/enrollments/:enrollmentId/modules/:moduleId/attempt", (req, res) => {
  const passed = req.body?.passed;
  if (typeof passed !== "boolean") return res.status(400).json({ error: "passed_boolean_required" });
  const progress = submitModuleAttempt({
    enrollmentId: req.params.enrollmentId,
    moduleId: req.params.moduleId,
    score: req.body?.score,
    passed,
    evidence: Array.isArray(req.body?.evidence) ? req.body.evidence : [],
    feedback: Array.isArray(req.body?.feedback) ? req.body.feedback : [],
  });
  if (!progress) return res.status(409).json({ error: "module_attempt_not_allowed" });
  return res.status(201).json({ progress, dashboard: getLearnerDashboard(req.params.enrollmentId) });
});
companyFoundryRouter.post("/foundry/academy/enrollments/:enrollmentId/stages/:stageId/gate", (req, res) => {
  const evaluatorId = String(req.body?.evaluatorId ?? "").trim();
  const rationale = String(req.body?.rationale ?? "").trim();
  const passed = req.body?.passed;
  if (!evaluatorId || !rationale || typeof passed !== "boolean") return res.status(400).json({ error: "invalid_gate_decision" });
  const gate = decideStageGate({ enrollmentId: req.params.enrollmentId, stageId: req.params.stageId, evaluatorId, passed, rationale });
  if (!gate) return res.status(409).json({ error: "stage_gate_not_decidable" });
  return res.status(201).json({ gate, dashboard: getLearnerDashboard(req.params.enrollmentId) });
});

// CF-012D Production Lab
companyFoundryRouter.get("/foundry/production-lab/metrics", (_req, res) => res.json(getProductionLabMetrics()));
companyFoundryRouter.get("/foundry/production-lab/assignments", (req, res) => {
  const builderId = req.query.builderId ? String(req.query.builderId) : undefined;
  return res.json({ assignments: listProductionAssignments(builderId) });
});
companyFoundryRouter.get("/foundry/production-lab/assignments/:assignmentId", (req, res) => {
  const detail = getProductionAssignmentDetail(req.params.assignmentId);
  if (!detail) return res.status(404).json({ error: "production_assignment_not_found" });
  return res.json(detail);
});
companyFoundryRouter.get("/foundry/production-lab/eligible/:builderId", (req, res) => {
  return res.json({ phases: getEligibleProductionPhases(req.params.builderId) });
});
companyFoundryRouter.post("/foundry/production-lab/assignments", (req, res) => {
  const phaseId = String(req.body?.phaseId ?? "").trim();
  const builderId = String(req.body?.builderId ?? "").trim();
  const assignedBy = String(req.body?.assignedBy ?? "").trim();
  const pvs = Number(req.body?.pvs);
  if (!phaseId || !builderId || !assignedBy || !Number.isFinite(pvs)) return res.status(400).json({ error: "invalid_assignment" });
  const result = assignProductionPhase({
    phaseId,
    builderId,
    assignedBy,
    pvs,
    contributionShare: req.body?.contributionShare === undefined ? undefined : Number(req.body.contributionShare),
    budgetAttributionUsd: req.body?.budgetAttributionUsd === undefined ? undefined : Number(req.body.budgetAttributionUsd),
    compensationNote: req.body?.compensationNote ? String(req.body.compensationNote) : undefined,
  });
  if (!result.ok) return res.status(409).json(result);
  return res.status(201).json(result);
});
companyFoundryRouter.post("/foundry/production-lab/assignments/:assignmentId/start", (req, res) => {
  const builderId = String(req.body?.builderId ?? "").trim();
  if (!builderId) return res.status(400).json({ error: "builder_id_required" });
  const result = startProductionAssignment(req.params.assignmentId, builderId);
  if (!result.ok) return res.status(409).json(result);
  return res.json(result);
});
companyFoundryRouter.post("/foundry/production-lab/assignments/:assignmentId/submit", (req, res) => {
  const builderId = String(req.body?.builderId ?? "").trim();
  const summary = String(req.body?.summary ?? "").trim();
  const evidence = Array.isArray(req.body?.evidence) ? req.body.evidence : [];
  const validation = Array.isArray(req.body?.validation) ? req.body.validation : [];
  if (!builderId || !summary) return res.status(400).json({ error: "invalid_production_submission" });
  const result = submitProductionWork({ assignmentId: req.params.assignmentId, builderId, summary, evidence, validation, knownLimits: Array.isArray(req.body?.knownLimits) ? req.body.knownLimits : [] });
  if (!result.ok) return res.status(409).json(result);
  return res.status(201).json(result);
});
companyFoundryRouter.post("/foundry/production-lab/assignments/:assignmentId/review", (req, res) => {
  const submissionId = String(req.body?.submissionId ?? "").trim();
  const reviewerId = String(req.body?.reviewerId ?? "").trim();
  const rationale = String(req.body?.rationale ?? "").trim();
  const decision = req.body?.decision;
  if (!submissionId || !reviewerId || !rationale || !["accepted", "rework", "rejected"].includes(decision)) return res.status(400).json({ error: "invalid_production_review" });
  const result = reviewProductionWork({ assignmentId: req.params.assignmentId, submissionId, reviewerId, decision, rationale, qualityMultiplier: req.body?.qualityMultiplier });
  if (!result.ok) return res.status(result.error === "self_acceptance_forbidden" ? 403 : 409).json(result);
  return res.status(201).json(result);
});

companyFoundryRouter.get("/foundry/products/:productId", (req, res) => {
  const product = products.find((item) => item.id === req.params.productId);
  if (!product) return res.status(404).json({ error: "product_not_found" });
  return res.json({ product, masterPlans: masterPlans.filter((plan) => plan.productId === product.id), phases: phases.filter((phase) => phase.productId === product.id) });
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
  const allowedKinds: FoundryProposalKind[] = ["product_change", "builder_application", "phase_submission", "capstone_application", "master_plan_proposal", "registry_change"];
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
companyFoundryRouter.post("/foundry/proposals/:proposalId/apply-effect", (req, res) => {
  const actorId = String(req.body?.actorId ?? "").trim();
  if (!actorId) return res.status(400).json({ error: "actor_required" });
  const result = applyAcceptedProposalEffect(req.params.proposalId, actorId);
  if (!result.ok) return res.status(409).json(result);
  return res.status(201).json(result);
});
companyFoundryRouter.get("/foundry/audit", (req, res) => {
  const limit = Number(req.query.limit ?? 100);
  return res.json({ events: getFoundryAudit(Number.isFinite(limit) ? limit : 100) });
});
companyFoundryRouter.get("/foundry/write-capabilities", (_req, res) => res.json({
  governanceWritesEnabled: true,
  controlledOperationalEffectsEnabled: true,
  builderAdmissionEnabled: true,
  acceptedMasterPlanAdmissionEnabled: true,
  phaseCapabilityCreditEnabled: true,
  academyCurriculumReadEnabled: true,
  academyEnrollmentEnabled: true,
  academyProgressTrackingEnabled: true,
  academyRemediationEnabled: true,
  academyStageGateEnabled: true,
  productionLabEnabled: true,
  productionAssignmentEnabled: true,
  productionEvidenceSubmissionEnabled: true,
  independentProductionReviewEnabled: true,
  productionPvpCreditEnabled: true,
  projectBudgetAttributionEnabled: true,
  projectBudgetFinancialExecutionEnabled: false,
  productMutationEnabled: false,
  payrollEnabled: false,
  equityIssuanceEnabled: false,
  residualSettlementEnabled: false,
  moneyMovementEnabled: false,
}));
