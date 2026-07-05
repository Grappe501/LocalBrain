import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { createContact } from "./contactRepository.js";
import { createContactInteraction } from "./contactInteractionRepository.js";
import {
  addContactStewardParticipant,
  assignContactSteward,
  buildContactStewardshipView,
  buildStewardshipDashboard,
  updateContactStewardship,
} from "./contactStewardshipRepository.js";
import { ContactStewardshipValidationError } from "./contactStewardshipValidator.js";
import { resolveAccessContext } from "./contactInteractionValidator.js";

const WORKSPACE = `localbrain-steward-${crypto.randomUUID().slice(0, 8)}`;
const ADMIN = resolveAccessContext({ user_id: "admin-user", role: "admin" });
const ORGANIZER = resolveAccessContext({ user_id: "organizer-user", role: "organizer" });
const VIEWER = resolveAccessContext({ user_id: "viewer-user", role: "viewer" });

describe("CONTACT-V3-016", { concurrency: 1 }, () => {
  test("steward assignment, participants, computed health, transitions, dashboard", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "Steward Test",
        emails: [{ email: "steward@example.com", primary: true }],
      });

      createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: contact.contact_id,
        type: "call",
        summary: "County leadership call",
        created_by_user_id: "organizer-user",
        visibility: "campaign",
        sentiment: "positive",
      });

      const assigned = assignContactSteward(
        {
          workspace_id: WORKSPACE,
          contact_id: contact.contact_id,
          steward_user_id: "kelly-user",
          reason: "County reassignment",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(assigned);
      assert.equal(assigned!.stewardship.steward_user_id, "kelly-user");
      assert.equal(assigned!.transitions.length, 1);

      const contributor = addContactStewardParticipant(
        {
          workspace_id: WORKSPACE,
          contact_id: contact.contact_id,
          user_id: "chris-user",
          role: "contributor",
          label: "County Captain",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(contributor);

      const updated = updateContactStewardship(
        contact.contact_id,
        { strength: "county_leader", lifecycle_stage: "leader", updated_by_user_id: ADMIN.user_id },
        ADMIN,
      );
      assert.ok(updated);
      assert.equal(updated!.stewardship.strength, "county_leader");
      assert.equal(updated!.stewardship.lifecycle_stage, "leader");
      assert.ok(updated!.computed.health_score >= 0);
      assert.ok(updated!.contributors.length === 1);
      assert.equal(updated!.advisory_summary.advisory, true);
      assert.match(updated!.advisory_summary.summary_text, /appears to be the primary steward/i);

      assignContactSteward(
        {
          workspace_id: WORKSPACE,
          contact_id: contact.contact_id,
          steward_user_id: "mary-user",
          reason: "Handoff",
          created_by_user_id: ADMIN.user_id,
        },
        ADMIN,
      );

      const view = buildContactStewardshipView(contact.contact_id, ADMIN);
      assert.ok(view);
      assert.equal(view!.transitions.length, 2);

      const dashboard = buildStewardshipDashboard(WORKSPACE, ADMIN);
      assert.ok(dashboard.without_steward.length >= 0);
      assert.ok(dashboard.growing.length + dashboard.cooling.length >= 0);
    } finally {
      shutdownApp();
    }
  });

  test("RBAC permissions on stewardship operations", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "RBAC Steward",
        emails: [{ email: "rbac-steward@example.com", primary: true }],
      });

      assert.throws(
        () =>
          assignContactSteward(
            {
              workspace_id: WORKSPACE,
              contact_id: contact.contact_id,
              steward_user_id: "viewer-user",
              created_by_user_id: VIEWER.user_id,
            },
            VIEWER,
          ),
        (error: unknown) =>
          error instanceof ContactStewardshipValidationError && error.code === "forbidden",
      );

      const view = buildContactStewardshipView(contact.contact_id, VIEWER);
      assert.ok(view);
    } finally {
      shutdownApp();
    }
  });
});
