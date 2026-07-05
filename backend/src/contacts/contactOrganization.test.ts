import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { createContact } from "./contactRepository.js";
import {
  addOrganizationMembership,
  archiveOrganizationRecord,
  assignOrganizationRole,
  buildOrganizationSummary,
  createOrganizationRecord,
  endOrganizationMembership,
  listOrganizationsForContact,
  mergeOrganizations,
  searchOrganizations,
  updateOrganizationMembership,
} from "./contactOrganizationRepository.js";
import { ContactOrganizationValidationError } from "./contactOrganizationValidator.js";
import { resolveAccessContext } from "./contactInteractionValidator.js";

const WORKSPACE = `localbrain-org-${crypto.randomUUID().slice(0, 8)}`;
const ADMIN = resolveAccessContext({ user_id: "admin-user", role: "admin" });
const ORGANIZER = resolveAccessContext({ user_id: "organizer-user", role: "organizer" });
const VIEWER = resolveAccessContext({ user_id: "viewer-user", role: "viewer" });

describe("CONTACT-V3-019", { concurrency: 1 }, () => {
  test("organization CRUD, membership, roles, merge, archive, search, metrics", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "Org Member",
        emails: [{ email: "org@example.com", primary: true }],
        tags: ["volunteer"],
      });
      const contact2 = createContact({
        workspace_id: WORKSPACE,
        display_name: "Board Member",
        emails: [{ email: "board@example.com", primary: true }],
      });

      const org = createOrganizationRecord(
        {
          workspace_id: WORKSPACE,
          name: "Stand Up Arkansas",
          category: "nonprofit",
          description: "Community advocacy",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(org);
      assert.equal(org!.category, "nonprofit");

      const membership = addOrganizationMembership(
        {
          workspace_id: WORKSPACE,
          organization_id: org!.organization_id,
          contact_id: contact.contact_id,
          membership_role: "volunteer",
          membership_status: "active",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(membership);

      const boardMembership = addOrganizationMembership(
        {
          workspace_id: WORKSPACE,
          organization_id: org!.organization_id,
          contact_id: contact2.contact_id,
          membership_role: "board_member",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(boardMembership);

      const role = assignOrganizationRole(
        {
          workspace_id: WORKSPACE,
          organization_id: org!.organization_id,
          membership_id: boardMembership!.membership_id,
          contact_id: contact2.contact_id,
          role: "president",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(role);

      let summary = buildOrganizationSummary(org!.organization_id, ADMIN);
      assert.ok(summary);
      assert.equal(summary!.metrics.membership_count, 2);
      assert.ok(summary!.metrics.leader_count >= 1);
      assert.ok(summary!.metrics.strength_score >= 0);
      assert.ok(summary!.history.length >= 3);

      const promoted = updateOrganizationMembership(
        membership!.membership_id,
        { membership_role: "staff", updated_by_user_id: ORGANIZER.user_id },
        ORGANIZER,
      );
      assert.ok(promoted);
      assert.equal(promoted!.membership_role, "staff");

      const otherOrg = createOrganizationRecord(
        {
          workspace_id: WORKSPACE,
          name: "Legacy Chapter",
          category: "civic_club",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(otherOrg);

      addOrganizationMembership(
        {
          workspace_id: WORKSPACE,
          organization_id: otherOrg!.organization_id,
          contact_id: contact.contact_id,
          membership_role: "member",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );

      const merged = mergeOrganizations(
        {
          workspace_id: WORKSPACE,
          from_organization_id: otherOrg!.organization_id,
          to_organization_id: org!.organization_id,
          reason: "Chapter consolidation",
          merged_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(merged);
      assert.ok(merged!.metrics.membership_count >= 2);

      const contactOrgs = listOrganizationsForContact(contact.contact_id, ADMIN);
      assert.ok(contactOrgs.length >= 1);

      const results = searchOrganizations({
        workspace_id: WORKSPACE,
        search: "Stand Up",
        category: "nonprofit",
        ctx: ADMIN,
      });
      assert.ok(results.length >= 1);

      const ended = endOrganizationMembership(membership!.membership_id, ORGANIZER, ORGANIZER.user_id);
      assert.ok(ended);
      assert.equal(ended!.membership_status, "former");

      summary = buildOrganizationSummary(org!.organization_id, ADMIN);
      assert.ok(summary);
      assert.equal(summary!.metrics.membership_count, 1);
    } finally {
      shutdownApp();
    }
  });

  test("RBAC permissions on organization operations", () => {
    bootstrapApp();
    try {
      assert.throws(
        () =>
          createOrganizationRecord(
            {
              workspace_id: WORKSPACE,
              name: "Viewer Org",
              created_by_user_id: VIEWER.user_id,
            },
            VIEWER,
          ),
        (error: unknown) =>
          error instanceof ContactOrganizationValidationError && error.code === "forbidden",
      );

      const org = createOrganizationRecord(
        {
          workspace_id: WORKSPACE,
          name: "Archive Test Org",
          created_by_user_id: ADMIN.user_id,
        },
        ADMIN,
      );
      assert.ok(org);

      const archived = archiveOrganizationRecord(org!.organization_id, ADMIN, ADMIN.user_id);
      assert.ok(archived);
      assert.equal(archived!.status, "archived");

      const view = buildOrganizationSummary(org!.organization_id, VIEWER);
      assert.equal(view, null);
    } finally {
      shutdownApp();
    }
  });
});
