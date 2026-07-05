import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { createContact } from "./contactRepository.js";
import {
  addHouseholdMember,
  addHouseholdRelationship,
  buildHouseholdSummary,
  createHousehold,
  listHouseholdsForContact,
  mergeHouseholds,
  removeHouseholdMember,
  searchHouseholds,
  splitHousehold,
  transferPrimaryResidence,
} from "./contactHouseholdRepository.js";
import { ContactHouseholdValidationError } from "./contactHouseholdValidator.js";
import { resolveAccessContext } from "./contactInteractionValidator.js";

const WORKSPACE = `localbrain-household-${crypto.randomUUID().slice(0, 8)}`;
const ADMIN = resolveAccessContext({ user_id: "admin-user", role: "admin" });
const ORGANIZER = resolveAccessContext({ user_id: "organizer-user", role: "organizer" });
const VIEWER = resolveAccessContext({ user_id: "viewer-user", role: "viewer" });

describe("CONTACT-V3-018", { concurrency: 1 }, () => {
  test("household creation, members, relationships, merge, split, history, compute", () => {
    bootstrapApp();
    try {
      const john = createContact({
        workspace_id: WORKSPACE,
        display_name: "John Smith",
        emails: [{ email: "john@example.com", primary: true }],
        tags: ["registered_voter", "volunteer"],
        addresses: [{ line1: "123 Main St", city: "Springfield", state: "IL", postal_code: "62701" }],
      });
      const mary = createContact({
        workspace_id: WORKSPACE,
        display_name: "Mary Smith",
        emails: [{ email: "mary@example.com", primary: true }],
        tags: ["registered_voter"],
      });
      const child = createContact({
        workspace_id: WORKSPACE,
        display_name: "Sam Smith",
        emails: [{ email: "sam@example.com", primary: true }],
        tags: ["minor"],
      });

      const household = createHousehold(
        {
          workspace_id: WORKSPACE,
          name: "Smith Household",
          primary_contact_id: john.contact_id,
          primary_address: { line1: "123 Main St", city: "Springfield", state: "IL" },
          voting_district: "District 14",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(household);
      assert.equal(household!.primary_contact_id, john.contact_id);

      const maryMember = addHouseholdMember(
        {
          workspace_id: WORKSPACE,
          household_id: household!.household_id,
          contact_id: mary.contact_id,
          role: "spouse",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(maryMember);

      const childMember = addHouseholdMember(
        {
          workspace_id: WORKSPACE,
          household_id: household!.household_id,
          contact_id: child.contact_id,
          role: "child",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(childMember);

      const relationship = addHouseholdRelationship(
        {
          workspace_id: WORKSPACE,
          household_id: household!.household_id,
          from_contact_id: john.contact_id,
          to_contact_id: mary.contact_id,
          relationship_type: "spouse",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(relationship);

      let summary = buildHouseholdSummary(household!.household_id, ADMIN);
      assert.ok(summary);
      assert.equal(summary!.computed.size, 3);
      assert.equal(summary!.computed.adults, 2);
      assert.equal(summary!.computed.minors, 1);
      assert.equal(summary!.computed.registered_voters, 2);
      assert.equal(summary!.computed.volunteers, 1);
      assert.ok(summary!.computed.health_score >= 0);
      assert.ok(summary!.history.length >= 4);

      const transferred = transferPrimaryResidence(
        {
          workspace_id: WORKSPACE,
          household_id: household!.household_id,
          contact_id: mary.contact_id,
          changed_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(transferred);
      assert.equal(transferred!.household.primary_contact_id, mary.contact_id);

      const otherHousehold = createHousehold(
        {
          workspace_id: WORKSPACE,
          name: "Guest Household",
          primary_contact_id: child.contact_id,
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(otherHousehold);

      const merged = mergeHouseholds(
        {
          workspace_id: WORKSPACE,
          from_household_id: otherHousehold!.household_id,
          to_household_id: household!.household_id,
          reason: "Same address",
          merged_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(merged);
      assert.ok(merged!.members.length >= 3);

      const split = splitHousehold(
        {
          workspace_id: WORKSPACE,
          source_household_id: household!.household_id,
          new_household_name: "Sam Split Household",
          member_contact_ids: [child.contact_id],
          reason: "Moved out",
          split_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(split);
      assert.equal(split!.created.household.name, "Sam Split Household");

      const contactHouseholds = listHouseholdsForContact(john.contact_id, ADMIN);
      assert.ok(contactHouseholds.length >= 1);

      const lookup = searchHouseholds({
        workspace_id: WORKSPACE,
        search: "Smith",
        ctx: ADMIN,
      });
      assert.ok(lookup.length >= 1);

      const removed = removeHouseholdMember(maryMember!.member_id, ORGANIZER, ORGANIZER.user_id);
      assert.ok(removed);
      assert.ok(removed!.effective_until);
    } finally {
      shutdownApp();
    }
  });

  test("RBAC permissions on household operations", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "RBAC Household",
        emails: [{ email: "rbac-house@example.com", primary: true }],
      });

      assert.throws(
        () =>
          createHousehold(
            {
              workspace_id: WORKSPACE,
              name: "Viewer Household",
              created_by_user_id: VIEWER.user_id,
            },
            VIEWER,
          ),
        (error: unknown) =>
          error instanceof ContactHouseholdValidationError && error.code === "forbidden",
      );

      const household = createHousehold(
        {
          workspace_id: WORKSPACE,
          name: "Readable Household",
          primary_contact_id: contact.contact_id,
          created_by_user_id: ADMIN.user_id,
        },
        ADMIN,
      );
      assert.ok(household);

      const view = buildHouseholdSummary(household!.household_id, VIEWER);
      assert.ok(view);
    } finally {
      shutdownApp();
    }
  });
});
