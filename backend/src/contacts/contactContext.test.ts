import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { createContact } from "./contactRepository.js";
import {
  assignContactContext,
  createRelationshipContext,
  endContactContextLink,
  listContactContextHistory,
  listContactContextView,
  listContactsByContext,
  listWorkspaceContexts,
  mergeRelationshipContexts,
  updateContactContextLink,
} from "./contactContextRepository.js";
import { ContactContextValidationError } from "./contactContextValidator.js";
import { resolveAccessContext } from "./contactInteractionValidator.js";
import { createContactInteraction } from "./contactInteractionRepository.js";

const WORKSPACE = `localbrain-context-${crypto.randomUUID().slice(0, 8)}`;
const ADMIN = resolveAccessContext({ user_id: "admin-user", role: "admin" });
const OWNER = resolveAccessContext({ user_id: "owner-user", role: "owner" });
const ORGANIZER = resolveAccessContext({ user_id: "organizer-user", role: "organizer" });
const VIEWER = resolveAccessContext({ user_id: "viewer-user", role: "viewer" });

describe("CONTACT-V3-016.1", { concurrency: 1 }, () => {
  test("context catalog, assignment, filter, merge, and history", () => {
    bootstrapApp();
    try {
      const campaign = createRelationshipContext(
        {
          workspace_id: WORKSPACE,
          label: "County canvass",
          category: "campaign",
          created_by_user_id: ADMIN.user_id,
        },
        ADMIN,
      );
      const civic = createRelationshipContext(
        {
          workspace_id: WORKSPACE,
          label: "School board",
          category: "civic",
          created_by_user_id: OWNER.user_id,
        },
        OWNER,
      );

      const contexts = listWorkspaceContexts(WORKSPACE);
      assert.equal(contexts.length, 2);
      assert.ok(contexts.some((c) => c.context_id === campaign.context_id));

      const contactA = createContact({
        workspace_id: WORKSPACE,
        display_name: "Context Alpha",
        emails: [{ email: "alpha@example.com", primary: true }],
      });
      const contactB = createContact({
        workspace_id: WORKSPACE,
        display_name: "Context Beta",
        emails: [{ email: "beta@example.com", primary: true }],
      });

      const primaryLink = assignContactContext(
        {
          workspace_id: WORKSPACE,
          contact_id: contactA.contact_id,
          context_id: campaign.context_id,
          rank: "primary",
          created_by_user_id: ORGANIZER.user_id,
          reason: "Initial assignment",
        },
        ORGANIZER,
      );
      assert.ok(primaryLink);
      assert.equal(primaryLink!.rank, "primary");

      const secondaryLink = assignContactContext(
        {
          workspace_id: WORKSPACE,
          contact_id: contactA.contact_id,
          context_id: civic.context_id,
          rank: "secondary",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(secondaryLink);

      const view = listContactContextView(contactA.contact_id);
      assert.ok(view);
      assert.equal(view!.links.length, 2);
      assert.equal(view!.links[0]!.rank, "primary");

      assignContactContext(
        {
          workspace_id: WORKSPACE,
          contact_id: contactB.contact_id,
          context_id: campaign.context_id,
          rank: "primary",
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );

      const filtered = listContactsByContext({
        workspace_id: WORKSPACE,
        context_id: campaign.context_id,
      });
      assert.equal(filtered.length, 2);

      const primaryOnly = listContactsByContext({
        workspace_id: WORKSPACE,
        context_id: campaign.context_id,
        context_primary_only: true,
      });
      assert.equal(primaryOnly.length, 2);

      const promoted = updateContactContextLink(
        secondaryLink!.link_id,
        { rank: "primary", reason: "Promote civic" },
        ORGANIZER,
      );
      assert.ok(promoted);
      assert.equal(promoted!.rank, "primary");

      const afterPromote = listContactContextView(contactA.contact_id);
      const campaignLink = afterPromote!.links.find((l) => l.context_id === campaign.context_id);
      assert.equal(campaignLink!.rank, "secondary");

      const ended = endContactContextLink(
        campaignLink!.link_id,
        { reason: "No longer active", ended_by_user_id: ORGANIZER.user_id },
        ORGANIZER,
      );
      assert.ok(ended);
      assert.ok(ended!.effective_until);

      const mergeResult = mergeRelationshipContexts(
        {
          workspace_id: WORKSPACE,
          from_context_id: campaign.context_id,
          to_context_id: civic.context_id,
          merged_by_user_id: ADMIN.user_id,
          reason: "Consolidate canvass into civic",
        },
        ADMIN,
      );
      assert.ok(mergeResult);
      assert.equal(mergeResult!.links_moved, 1);

      const historyA = listContactContextHistory(contactA.contact_id);
      assert.ok(historyA.length >= 4);
      assert.ok(historyA.some((h) => h.action === "assigned"));
      assert.ok(historyA.some((h) => h.action === "rank_changed"));
      assert.ok(historyA.some((h) => h.action === "ended"));

      const historyB = listContactContextHistory(contactB.contact_id);
      assert.ok(historyB.some((h) => h.action === "merged"));

      const interaction = createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: contactA.contact_id,
        type: "note",
        summary: "Logged with context",
        created_by_user_id: ORGANIZER.user_id,
        visibility: "campaign",
        context_id: civic.context_id,
      });
      assert.equal(interaction!.context_id, civic.context_id);
    } finally {
      shutdownApp();
    }
  });

  test("RBAC permissions on context operations", () => {
    bootstrapApp();
    try {
      assert.throws(
        () =>
          createRelationshipContext(
            {
              workspace_id: WORKSPACE,
              label: "Viewer attempt",
              created_by_user_id: VIEWER.user_id,
            },
            VIEWER,
          ),
        (error: unknown) =>
          error instanceof ContactContextValidationError && error.code === "forbidden",
      );

      const ctx = createRelationshipContext(
        {
          workspace_id: WORKSPACE,
          label: "Admin catalog",
          created_by_user_id: ADMIN.user_id,
        },
        ADMIN,
      );

      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "RBAC Contact",
        emails: [{ email: "rbac@example.com", primary: true }],
      });

      assert.throws(
        () =>
          assignContactContext(
            {
              workspace_id: WORKSPACE,
              contact_id: contact.contact_id,
              context_id: ctx.context_id,
              created_by_user_id: VIEWER.user_id,
            },
            VIEWER,
          ),
        (error: unknown) =>
          error instanceof ContactContextValidationError && error.code === "forbidden",
      );

      const link = assignContactContext(
        {
          workspace_id: WORKSPACE,
          contact_id: contact.contact_id,
          context_id: ctx.context_id,
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(link);

      assert.throws(
        () =>
          mergeRelationshipContexts(
            {
              workspace_id: WORKSPACE,
              from_context_id: ctx.context_id,
              to_context_id: createRelationshipContext(
                {
                  workspace_id: WORKSPACE,
                  label: "Merge target",
                  created_by_user_id: ADMIN.user_id,
                },
                ADMIN,
              ).context_id,
              merged_by_user_id: ORGANIZER.user_id,
            },
            ORGANIZER,
          ),
        (error: unknown) =>
          error instanceof ContactContextValidationError && error.code === "forbidden",
      );
    } finally {
      shutdownApp();
    }
  });
});
