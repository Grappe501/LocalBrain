import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import { CONTACT_TIMELINE_ADVISORY_NOTICE } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { createContact } from "./contactRepository.js";
import {
  buildContactTimelineView,
  createContactInteraction,
  listContactInteractions,
  listWorkspaceFollowUps,
} from "./contactInteractionRepository.js";
import { resolveAccessContext } from "./contactInteractionValidator.js";

const WORKSPACE = `localbrain-timeline-${crypto.randomUUID().slice(0, 8)}`;
const ADMIN = resolveAccessContext({ user_id: "admin-user", role: "admin" });
const ORGANIZER = resolveAccessContext({ user_id: "organizer-user", role: "organizer" });
const VIEWER = resolveAccessContext({ user_id: "viewer-user", role: "viewer" });

describe("CONTACT-V3-014", { concurrency: 1 }, () => {
  test("interaction CRUD and timeline view", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "Timeline Test",
        emails: [{ email: "timeline@example.com", primary: true }],
      });

      const call = createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: contact.contact_id,
        type: "call",
        summary: "Intro call about voting rights",
        created_by_user_id: "organizer-user",
        visibility: "campaign",
      });
      assert.ok(call);

      const privateNote = createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: contact.contact_id,
        type: "note",
        summary: "Private strategist note",
        created_by_user_id: "organizer-user",
        visibility: "private",
      });
      assert.ok(privateNote);

      const followUp = createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: contact.contact_id,
        type: "follow_up",
        summary: "Schedule county meeting invite",
        created_by_user_id: "organizer-user",
        visibility: "campaign",
        follow_up_required: true,
        follow_up_due_at: new Date().toISOString(),
      });
      assert.ok(followUp);

      const adminView = buildContactTimelineView({
        contact_id: contact.contact_id,
        ctx: ADMIN,
      });
      assert.ok(adminView);
      assert.equal(adminView!.interactions.length, 3);
      assert.equal(adminView!.advisory_summary.advisory, true);
      assert.equal(adminView!.advisory_summary.live_ai_wired, false);
      assert.equal(adminView!.advisory_summary.notice, CONTACT_TIMELINE_ADVISORY_NOTICE);
      assert.ok(adminView!.advisory_summary.citations.length > 0);

      const viewerInteractions = listContactInteractions({
        contact_id: contact.contact_id,
        ctx: VIEWER,
      });
      assert.equal(viewerInteractions.length, 2);
      assert.ok(viewerInteractions.every((item) => item.visibility !== "private"));

      const followUps = listWorkspaceFollowUps({ workspace_id: WORKSPACE, ctx: ADMIN });
      const totalFollowUps =
        followUps.overdue.length + followUps.due_today.length + followUps.upcoming.length;
      assert.ok(totalFollowUps >= 1);
    } finally {
      shutdownApp();
    }
  });

  test("organizer can log interactions", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "Organizer Contact",
      });
      const note = createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: contact.contact_id,
        type: "note",
        summary: "Met at event booth",
        created_by_user_id: ORGANIZER.user_id,
        visibility: "campaign",
      });
      assert.ok(note);
      const listed = listContactInteractions({ contact_id: contact.contact_id, ctx: ORGANIZER });
      assert.equal(listed.length, 1);
    } finally {
      shutdownApp();
    }
  });
});
