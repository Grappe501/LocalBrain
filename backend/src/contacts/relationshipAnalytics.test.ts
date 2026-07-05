import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { createContact } from "./contactRepository.js";
import { createContactInteraction } from "./contactInteractionRepository.js";
import { assignContactSteward, updateContactStewardship } from "./contactStewardshipRepository.js";
import { resolveAccessContext } from "./contactInteractionValidator.js";
import {
  buildRelationshipAnalyticsDashboard,
  buildRelationshipAnalyticsExport,
} from "./relationshipAnalyticsRepository.js";
import { RelationshipAnalyticsValidationError } from "./relationshipAnalyticsValidator.js";

const WORKSPACE = `localbrain-analytics-${crypto.randomUUID().slice(0, 8)}`;
const ADMIN = resolveAccessContext({ user_id: "admin-user", role: "admin" });
const VIEWER = resolveAccessContext({ user_id: "viewer-user", role: "viewer" });

describe("CONTACT-V3-021", { concurrency: 1 }, () => {
  test("aggregates portfolio, buckets, filters, and export from certified engines", () => {
    bootstrapApp();
    try {
      const volunteer = createContact({
        workspace_id: WORKSPACE,
        display_name: "Ignored Volunteer",
        tags: ["county:benton"],
        emails: [{ email: "vol@example.com", primary: true }],
      });
      const donor = createContact({
        workspace_id: WORKSPACE,
        display_name: "Cold Donor",
        tags: ["county:benton"],
        emails: [{ email: "donor@example.com", primary: true }],
      });
      const unowned = createContact({
        workspace_id: WORKSPACE,
        display_name: "Unowned Contact",
        emails: [{ email: "unowned@example.com", primary: true }],
      });

      createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: volunteer.contact_id,
        type: "volunteer_shift",
        summary: "Past shift",
        created_by_user_id: ADMIN.user_id,
        visibility: "campaign",
        occurred_at: new Date(Date.now() - 90 * 86_400_000).toISOString(),
      });
      updateContactStewardship(
        volunteer.contact_id,
        { strength: "volunteer", lifecycle_stage: "volunteer", updated_by_user_id: ADMIN.user_id },
        ADMIN,
      );

      assignContactSteward(
        {
          workspace_id: WORKSPACE,
          contact_id: donor.contact_id,
          steward_user_id: "kelly-user",
          created_by_user_id: ADMIN.user_id,
        },
        ADMIN,
      );

      createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: donor.contact_id,
        type: "call",
        summary: "Old donor call",
        created_by_user_id: ADMIN.user_id,
        visibility: "campaign",
        occurred_at: new Date(Date.now() - 120 * 86_400_000).toISOString(),
      });
      updateContactStewardship(
        donor.contact_id,
        { strength: "donor", updated_by_user_id: ADMIN.user_id },
        ADMIN,
      );

      const dashboard = buildRelationshipAnalyticsDashboard(WORKSPACE, ADMIN);
      assert.equal(dashboard.advisory, true);
      assert.equal(dashboard.engine_id, "CONTACT-V3-021");
      assert.ok(dashboard.portfolio.total_contacts >= 3);
      assert.ok(dashboard.source_engines.includes("stewardship"));
      assert.ok(dashboard.source_engines.includes("timeline"));
      assert.ok(dashboard.without_steward.some((row) => row.contact_id === unowned.contact_id));

      const filtered = buildRelationshipAnalyticsDashboard(WORKSPACE, ADMIN, {
        tag: "county:benton",
      });
      assert.ok(filtered.portfolio.total_contacts >= 2);
      assert.ok(
        filtered.ignored_volunteers.some((row) => row.contact_id === volunteer.contact_id) ||
          filtered.cooling.some((row) => row.contact_id === volunteer.contact_id),
      );
      assert.ok(
        filtered.cold_donors.some((row) => row.contact_id === donor.contact_id) ||
          filtered.cooling.some((row) => row.contact_id === donor.contact_id),
      );

      const exportView = buildRelationshipAnalyticsExport(WORKSPACE, ADMIN);
      assert.ok(exportView.contacts.length >= 3);
      assert.ok(exportView.portfolio.total_contacts >= 3);
      for (const row of exportView.contacts) {
        assert.ok(row.evidence_summary.length > 0);
      }
    } finally {
      shutdownApp();
    }
  });

  test("empty workspace and RBAC", () => {
    bootstrapApp();
    try {
      const emptyWorkspace = `localbrain-analytics-empty-${crypto.randomUUID().slice(0, 8)}`;
      const dashboard = buildRelationshipAnalyticsDashboard(emptyWorkspace, ADMIN);
      assert.equal(dashboard.portfolio.total_contacts, 0);
      assert.equal(dashboard.without_steward.length, 0);
      assert.equal(dashboard.overloaded_stewards.length, 0);

      assert.throws(
        () => buildRelationshipAnalyticsDashboard(emptyWorkspace, VIEWER),
        (error: unknown) =>
          error instanceof RelationshipAnalyticsValidationError && error.code === "forbidden",
      );
    } finally {
      shutdownApp();
    }
  });
});
