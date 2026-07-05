import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import {
  computeTechnicalPlatformHealth,
  computePlatformReadinessSnapshot,
  WALKTHROUGH_001_ID,
  WALKTHROUGH_001_TITLE,
} from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { createContactActionTask } from "../contacts/contactActionRepository.js";
import { buildContactBrief } from "../contacts/contactBriefRepository.js";
import {
  assignContactContext,
  createRelationshipContext,
} from "../contacts/contactContextRepository.js";
import { createHousehold, addHouseholdMember } from "../contacts/contactHouseholdRepository.js";
import { resolveAccessContext } from "../contacts/contactInteractionValidator.js";
import {
  addOrganizationMembership,
  createOrganizationRecord,
} from "../contacts/contactOrganizationRepository.js";
import { createContact, getContactById } from "../contacts/contactRepository.js";
import { assignContactSteward } from "../contacts/contactStewardshipRepository.js";
import { buildRelationshipAnalyticsDashboard } from "../contacts/relationshipAnalyticsRepository.js";
import { commitImportRow } from "../ucie/ucieCommitService.js";
import { getMatchResult } from "../ucie/ucieIdentityResolutionService.js";
import {
  approveSchemaForSession,
  attachVoterToRow,
  buildQualityDashboard,
  createVoterVerificationWorkItem,
  intakeCsvToSession,
  intakeManualRow,
  intakeOcrArtifact,
  searchVoters,
  seedVoterRecord,
  startImportSession,
} from "../ucie/ucieIntakeService.js";
import { listImportRows } from "../ucie/ucieSessionRepository.js";
import { listProvenanceForContact } from "../ucie/ucieProvenanceService.js";
import { claimWorkItem, completeWorkItem, listOpenWorkItems } from "../ucie/ucieWorkService.js";
import { resolveUcieAccessContext } from "../ucie/ucieValidator.js";
import { Walkthrough001Recorder } from "./walkthrough001Recorder.js";
import {
  CONTEXT_LABEL,
  COUNTY_FAIR_CSV,
  EXISTING_CONTACTS,
  MANUAL_JORDAN_FIELDS,
  OCR_JANE_FIELDS,
  ORG_NAME,
  VOTER_JANE_SMITH,
  WALKTHROUGH_001_WORKSPACE,
} from "./walkthrough001Scenario.js";

const ADMIN_UCIE = resolveUcieAccessContext({ user_id: "operator-admin", role: "admin" });
const ADMIN_CONTACT = resolveAccessContext({ user_id: "operator-admin", role: "admin" });
const VOLUNTEER = "volunteer-fair-1";
const STEWARD = "chris-patel-steward";

function avgConfidence(...scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, value) => sum + value, 0) / scores.length;
}

describe("OPERATOR-WALKTHROUGH-001", { concurrency: 1 }, () => {
  test("Unknown Person → Trusted Relationship — golden system acceptance", () => {
    bootstrapApp();
    const workspace_id = `${WALKTHROUGH_001_WORKSPACE}-${crypto.randomUUID().slice(0, 8)}`;
    const recorder = new Walkthrough001Recorder(workspace_id, "County fair volunteer intake");
    let humanInterventions = 0;
    let openWorkBeforePhase3 = 0;

    try {
      // --- Pre-scenario: two contacts already in the system ---
      const kellyExisting = createContact({
        workspace_id,
        display_name: EXISTING_CONTACTS[0].display_name,
        emails: [{ email: EXISTING_CONTACTS[0].email, primary: true }],
        tags: [...EXISTING_CONTACTS[0].tags],
      });
      createContact({
        workspace_id,
        display_name: EXISTING_CONTACTS[1].display_name,
        emails: [{ email: EXISTING_CONTACTS[1].email, primary: true }],
        tags: [...EXISTING_CONTACTS[1].tags],
      });

      // Jane exists in voter file only
      const janeVoter = seedVoterRecord({ workspace_id, ...VOTER_JANE_SMITH });

      // === Phase 1 — Intake (UCIE) ===
      recorder.beginPhase("phase_1_intake");

      const csvSession = startImportSession(
        { workspace_id, source_type: "csv", source_label: "Online registration export" },
        ADMIN_UCIE,
      );
      const csvIntake = intakeCsvToSession({
        session_id: csvSession.session_id,
        filename: "county-fair-volunteers.csv",
        csv_text: COUNTY_FAIR_CSV,
        uploaded_by_user_id: ADMIN_UCIE.user_id,
      });
      assert.equal(csvIntake.row_count, 3);
      assert.ok(csvIntake.schema.mappings.length >= 2);

      humanInterventions += 1;
      approveSchemaForSession({
        session_id: csvSession.session_id,
        mappings: csvIntake.schema.mappings.map((mapping) => ({ ...mapping, approved: true })),
        approved_by_user_id: ADMIN_UCIE.user_id,
        remember_for_future: true,
      });

      const ocrSession = startImportSession(
        { workspace_id, source_type: "ocr_image", source_label: "Handwritten sign-up sheet" },
        ADMIN_UCIE,
      );
      const janeRowId = intakeOcrArtifact({
        session_id: ocrSession.session_id,
        filename: "fair-signup-sheet.jpg",
        storage_ref: "/uploads/fair-signup-sheet.jpg",
        extracted_fields: { ...OCR_JANE_FIELDS },
        uploaded_by_user_id: ADMIN_UCIE.user_id,
      });

      const manualSession = startImportSession(
        { workspace_id, source_type: "manual_entry", source_label: "Fair booth conversation" },
        ADMIN_UCIE,
      );
      const jordanRowId = intakeManualRow({
        session_id: manualSession.session_id,
        fields: { ...MANUAL_JORDAN_FIELDS },
        uploaded_by_user_id: ADMIN_UCIE.user_id,
      });

      assert.ok(listOpenWorkItems(workspace_id).some((item) => item.item_type === "ocr_review"));
      openWorkBeforePhase3 = listOpenWorkItems(workspace_id).length;

      recorder.endPhase({
        human_interventions: humanInterventions,
        errors: [],
        technical_pass: csvIntake.row_count === 3 && Boolean(janeRowId) && Boolean(jordanRowId),
        ai_confidence_avg: csvIntake.schema.mappings.filter((m) => m.approved).length / csvIntake.schema.mappings.length,
        suggested_improvements: ["Confirm OCR one-at-a-time UX with real sheet photo"],
      });

      // === Phase 2 — Identity Resolution ===
      recorder.beginPhase("phase_2_identity_resolution");
      humanInterventions = 0;

      const csvRows = listImportRows(csvSession.session_id);
      const kellyRow = csvRows.find((row) => {
        const raw = JSON.parse(row.raw_json) as Record<string, string>;
        return raw.Email === EXISTING_CONTACTS[0].email;
      });
      assert.ok(kellyRow);
      const kellyMatch = getMatchResult(kellyRow!.row_id);
      assert.ok(kellyMatch);
      assert.equal(kellyMatch!.outcome, "exact_match");
      assert.equal(kellyMatch!.matched_contact_id, kellyExisting.contact_id);

      const alexRow = csvRows.find((row) => {
        const raw = JSON.parse(row.raw_json) as Record<string, string>;
        return raw.Email === "alex.rivera@countyfair.example.com";
      });
      const samRow = csvRows.find((row) => {
        const raw = JSON.parse(row.raw_json) as Record<string, string>;
        return raw.Email === "sam.nguyen@countyfair.example.com";
      });
      assert.ok(alexRow && samRow);

      const alexMatch = getMatchResult(alexRow!.row_id);
      const samMatch = getMatchResult(samRow!.row_id);
      const janeMatch = getMatchResult(janeRowId);
      const jordanMatch = getMatchResult(jordanRowId);
      assert.equal(alexMatch!.outcome, "new_identity");
      assert.equal(samMatch!.outcome, "new_identity");
      assert.equal(janeMatch!.outcome, "review_required");
      assert.equal(jordanMatch!.outcome, "new_identity");

      humanInterventions += 1;
      assert.ok(listOpenWorkItems(workspace_id).some((item) => item.item_type === "identity_review"));

      recorder.endPhase({
        human_interventions: humanInterventions,
        errors: [],
        technical_pass: true,
        ai_confidence_avg: avgConfidence(
          kellyMatch!.confidence_score,
          alexMatch!.confidence_score,
          samMatch!.confidence_score,
          janeMatch!.confidence_score,
          jordanMatch!.confidence_score,
        ),
        operator_hesitation_notes: "Jane name-only signal triggers review — expected voter path",
      });

      // === Phase 3 — Voter Verification ===
      recorder.beginPhase("phase_3_voter_verification");
      humanInterventions = 0;

      const ocrWork = listOpenWorkItems(workspace_id).find(
        (item) => item.item_type === "ocr_review" && item.row_id === janeRowId,
      );
      assert.ok(ocrWork);
      humanInterventions += 1;
      claimWorkItem({ work_item_id: ocrWork!.work_item_id, user_id: VOLUNTEER });
      completeWorkItem({
        work_item_id: ocrWork!.work_item_id,
        user_id: VOLUNTEER,
        resolution_note: "OCR fields confirmed",
      });

      createVoterVerificationWorkItem({
        workspace_id,
        row_id: janeRowId,
        detail: "Name-only intake — verify against Benton voter roll",
      });

      const voterWork = listOpenWorkItems(workspace_id).find(
        (item) => item.item_type === "voter_verification" && item.row_id === janeRowId,
      );
      assert.ok(voterWork);
      humanInterventions += 1;
      claimWorkItem({ work_item_id: voterWork!.work_item_id, user_id: VOLUNTEER });

      const voters = searchVoters({ workspace_id, county: "Benton", last_name: "Smith" });
      assert.ok(voters.some((voter) => voter.voter_id === janeVoter.voter_id));

      humanInterventions += 1;
      attachVoterToRow({
        row_id: janeRowId,
        voter_id: janeVoter.voter_id,
        verified_by_user_id: VOLUNTEER,
      });

      const janeAfterVoter = getMatchResult(janeRowId);
      assert.equal(janeAfterVoter!.outcome, "review_required");

      completeWorkItem({
        work_item_id: voterWork!.work_item_id,
        user_id: VOLUNTEER,
        resolution_note: "Matched Jane Smith on voter roll",
      });

      const identityReviews = listOpenWorkItems(workspace_id).filter(
        (item) => item.item_type === "identity_review" && item.row_id === janeRowId,
      );
      for (const identityReview of identityReviews) {
        if (identityReview.status !== "completed") {
          humanInterventions += 1;
          if (identityReview.status === "open") {
            claimWorkItem({ work_item_id: identityReview.work_item_id, user_id: VOLUNTEER });
          }
          completeWorkItem({
            work_item_id: identityReview.work_item_id,
            user_id: VOLUNTEER,
            resolution_note: "Voter verified — proceed to commit",
          });
        }
      }

      recorder.endPhase({
        human_interventions: humanInterventions,
        errors: [],
        technical_pass: voters.length >= 1,
        ai_confidence_avg: janeAfterVoter!.confidence_score,
        recovery_path: "VoterView search → attach → identity review complete",
      });

      // === Phase 4 — Commit ===
      recorder.beginPhase("phase_4_commit");
      humanInterventions = 0;

      const commits: Array<{ row_id: string; contact_id: string; action: string }> = [];

      const kellyCommit = commitImportRow({
        row_id: kellyRow!.row_id,
        committed_by_user_id: ADMIN_UCIE.user_id,
      });
      assert.ok(kellyCommit);
      assert.equal(kellyCommit!.action, "linked");
      assert.equal(kellyCommit!.contact_id, kellyExisting.contact_id);
      commits.push(kellyCommit!);

      const alexCommit = commitImportRow({
        row_id: alexRow!.row_id,
        committed_by_user_id: ADMIN_UCIE.user_id,
      });
      const samCommit = commitImportRow({
        row_id: samRow!.row_id,
        committed_by_user_id: ADMIN_UCIE.user_id,
      });
      const jordanCommit = commitImportRow({
        row_id: jordanRowId,
        committed_by_user_id: ADMIN_UCIE.user_id,
      });
      assert.ok(alexCommit && samCommit && jordanCommit);
      assert.equal(alexCommit!.action, "created");
      assert.equal(samCommit!.action, "created");
      assert.equal(jordanCommit!.action, "created");
      for (const result of [alexCommit!, samCommit!, jordanCommit!]) {
        commits.push(result);
        assert.ok(listProvenanceForContact(result.contact_id).length > 0);
      }

      humanInterventions += 1;
      const janeCommit = commitImportRow({
        row_id: janeRowId,
        committed_by_user_id: ADMIN_UCIE.user_id,
        force_create: true,
      });
      assert.ok(janeCommit);
      assert.equal(janeCommit!.action, "created");
      commits.push(janeCommit!);

      const janeContact = getContactById(janeCommit!.contact_id);
      assert.ok(janeContact);
      assert.equal(janeContact!.last_name, "Smith");

      recorder.endPhase({
        human_interventions: humanInterventions,
        errors: [],
        technical_pass: commits.length === 5,
        ai_confidence_avg: 1,
        recovery_path: "Jane required force_create after voter attach (name-only confidence)",
      });

      // === Phase 5 — Relationship Cultivation ===
      recorder.beginPhase("phase_5_relationship_cultivation");
      humanInterventions = 0;

      const jordanContactId = jordanCommit!.contact_id;

      const context = createRelationshipContext(
        {
          workspace_id,
          label: CONTEXT_LABEL,
          category: "campaign",
          created_by_user_id: ADMIN_CONTACT.user_id,
        },
        ADMIN_CONTACT,
      );
      assert.ok(context);
      humanInterventions += 1;

      assignContactContext(
        {
          workspace_id,
          contact_id: jordanContactId,
          context_id: context!.context_id,
          rank: "primary",
          source: "manual",
          created_by_user_id: ADMIN_CONTACT.user_id,
        },
        ADMIN_CONTACT,
      );
      humanInterventions += 1;

      assignContactSteward(
        {
          workspace_id,
          contact_id: jordanContactId,
          steward_user_id: STEWARD,
          created_by_user_id: ADMIN_CONTACT.user_id,
        },
        ADMIN_CONTACT,
      );
      humanInterventions += 1;

      const household = createHousehold(
        {
          workspace_id,
          name: "Lee Household",
          primary_contact_id: jordanContactId,
          created_by_user_id: ADMIN_CONTACT.user_id,
        },
        ADMIN_CONTACT,
      );
      assert.ok(household);
      addHouseholdMember(
        {
          workspace_id,
          household_id: household!.household_id,
          contact_id: jordanContactId,
          role: "head",
          is_primary_residence: true,
          created_by_user_id: ADMIN_CONTACT.user_id,
        },
        ADMIN_CONTACT,
      );

      const org = createOrganizationRecord(
        {
          workspace_id,
          name: ORG_NAME,
          category: "nonprofit",
          created_by_user_id: ADMIN_CONTACT.user_id,
        },
        ADMIN_CONTACT,
      );
      assert.ok(org);
      addOrganizationMembership(
        {
          workspace_id,
          organization_id: org!.organization_id,
          contact_id: jordanContactId,
          membership_role: "member",
          created_by_user_id: ADMIN_CONTACT.user_id,
        },
        ADMIN_CONTACT,
      );

      const action = createContactActionTask(
        {
          workspace_id,
          contact_id: jordanContactId,
          title: "Follow up — county fair conversation",
          details: MANUAL_JORDAN_FIELDS.notes,
          assigned_to_user_id: STEWARD,
          context_id: context!.context_id,
          created_by_user_id: ADMIN_CONTACT.user_id,
        },
        ADMIN_CONTACT,
      );
      assert.ok(action);

      const duplicateJordan = createContact({
        workspace_id,
        display_name: MANUAL_JORDAN_FIELDS.display_name,
        emails: [{ email: "duplicate@example.com", primary: true }],
      });
      assert.notEqual(duplicateJordan.contact_id, jordanContactId);

      recorder.endPhase({
        human_interventions: humanInterventions,
        errors: [],
        technical_pass: Boolean(context && household && org && action),
        suggested_improvements: ["Surface steward picklist from existing stewards like Chris Patel"],
      });

      // === Phase 6 — Intelligence ===
      recorder.beginPhase("phase_6_intelligence");
      humanInterventions = 0;

      const brief = buildContactBrief(jordanContactId, ADMIN_CONTACT);
      assert.ok(brief);
      assert.equal(brief!.advisory, true);

      for (const section of brief!.sections) {
        if (!section.withheld) {
          assert.ok(section.body);
          assert.ok(section.citations.length > 0);
        }
      }
      for (const rec of [...brief!.recommendations, ...brief!.opportunities, ...brief!.risks]) {
        assert.ok(rec.citations.length > 0);
        assert.ok(["high", "medium", "low"].includes(rec.confidence));
      }

      recorder.endPhase({
        human_interventions: humanInterventions,
        errors: [],
        technical_pass: brief!.evidence.length > 0,
        ai_confidence_avg: brief!.summary.has_substantive_evidence ? 0.9 : 0.5,
      });

      // === Phase 7 — Campaign View ===
      recorder.beginPhase("phase_7_campaign_view");
      humanInterventions = 0;

      const quality = buildQualityDashboard(workspace_id);
      assert.equal(quality.total_sessions, 3);
      assert.equal(quality.total_rows_committed, 5);
      assert.equal(quality.open_work_items, 0);
      assert.ok(quality.import_success_rate_percent >= 80);

      const analytics = buildRelationshipAnalyticsDashboard(workspace_id, ADMIN_CONTACT);
      assert.equal(analytics.advisory, true);
      assert.ok(analytics.portfolio.total_contacts >= 7);
      assert.ok(analytics.source_engines.includes("stewardship"));

      const bentonView = buildRelationshipAnalyticsDashboard(workspace_id, ADMIN_CONTACT, {
        tag: "county:benton",
      });
      assert.ok(bentonView.portfolio.total_contacts >= 2);

      const stewarded = analytics.portfolio.stewarded_count;
      assert.ok(stewarded >= 1);

      recorder.endPhase({
        human_interventions: humanInterventions,
        errors: [],
        technical_pass:
          quality.total_rows_committed === 5 &&
          quality.open_work_items < openWorkBeforePhase3 &&
          analytics.portfolio.total_contacts >= 5,
        suggested_improvements: ["Show queue reduction delta on manager landing card"],
      });

      // --- Evidence package ---
      const phases = recorder.build(true).phases;
      const platform_health = computeTechnicalPlatformHealth(workspace_id, phases);
      const readiness_snapshot = computePlatformReadinessSnapshot({
        walkthrough_id: WALKTHROUGH_001_ID,
        workspace_id,
        platform_readiness_level: "PRL-3",
        scenario_scores: platform_health.categories,
        notes: "Automated acceptance — PRL-3 achieved; PRL-4 requires internal operator evidence.",
      });
      const evidence = {
        ...recorder.build(true),
        platform_health,
        readiness_snapshot,
      };

      assert.equal(evidence.walkthrough_id, WALKTHROUGH_001_ID);
      assert.equal(evidence.title, WALKTHROUGH_001_TITLE);
      assert.equal(evidence.phases.length, 7);
      assert.equal(evidence.technical_acceptance_pass, true);
      assert.ok(evidence.platform_health!.overall_operator_readiness >= 80);
      assert.equal(evidence.platform_health!.categories.intake_experience > 0, true);
      assert.equal(evidence.platform_health!.categories.manager_visibility > 0, true);
      assert.equal(readiness_snapshot.platform_readiness_level, "PRL-3");
      assert.ok(readiness_snapshot.overall_readiness >= 80);
      assert.ok(readiness_snapshot.readiness_dimensions.operational_readiness > 0);
    } finally {
      shutdownApp();
    }
  });
});
