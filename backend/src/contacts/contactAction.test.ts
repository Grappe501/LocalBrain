import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { createContact } from "./contactRepository.js";
import { createContactInteraction } from "./contactInteractionRepository.js";
import {
  buildActionQueue,
  buildContactActionView,
  completeContactActionTask,
  completeInteractionFollowUp,
  createContactActionTask,
} from "./contactActionRepository.js";
import { ContactActionValidationError } from "./contactActionValidator.js";
import { resolveAccessContext } from "./contactInteractionValidator.js";

const WORKSPACE = `localbrain-action-${crypto.randomUUID().slice(0, 8)}`;
const ADMIN = resolveAccessContext({ user_id: "admin-user", role: "admin" });
const ORGANIZER = resolveAccessContext({ user_id: "organizer-user", role: "organizer" });
const VIEWER = resolveAccessContext({ user_id: "viewer-user", role: "viewer" });

describe("CONTACT-V3-017", { concurrency: 1 }, () => {
  test("tasks, follow-up queue integration, summary counts, completion", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "Action Test",
        emails: [{ email: "action@example.com", primary: true }],
      });

      const interaction = createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: contact.contact_id,
        type: "follow_up",
        summary: "Send county packet",
        created_by_user_id: ORGANIZER.user_id,
        visibility: "campaign",
        follow_up_required: true,
        follow_up_due_at: new Date().toISOString(),
        assigned_to_user_id: ORGANIZER.user_id,
      });
      assert.ok(interaction);

      const task = createContactActionTask(
        {
          workspace_id: WORKSPACE,
          contact_id: contact.contact_id,
          title: "Schedule volunteer training",
          priority: "high",
          assigned_to_user_id: ORGANIZER.user_id,
          due_at: new Date().toISOString(),
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(task);
      assert.equal(task!.status, "open");

      let view = buildContactActionView(contact.contact_id, ADMIN);
      assert.ok(view);
      assert.equal(view!.summary.open_task_count, 1);
      assert.equal(view!.summary.open_follow_up_count, 1);
      assert.equal(view!.summary.total_open_actions, 2);

      const queue = buildActionQueue({
        workspace_id: WORKSPACE,
        assigned_to_user_id: ORGANIZER.user_id,
        ctx: ADMIN,
      });
      const queueTotal =
        queue.overdue.length +
        queue.due_today.length +
        queue.upcoming.length +
        queue.no_due.length;
      assert.ok(queueTotal >= 2);

      const linkedTask = createContactActionTask(
        {
          workspace_id: WORKSPACE,
          contact_id: contact.contact_id,
          title: "Linked follow-up task",
          interaction_id: interaction!.id,
          assigned_to_user_id: ORGANIZER.user_id,
          created_by_user_id: ORGANIZER.user_id,
        },
        ORGANIZER,
      );
      assert.ok(linkedTask);
      assert.equal(linkedTask!.source, "follow_up");

      view = buildContactActionView(contact.contact_id, ADMIN);
      assert.ok(view);
      assert.equal(view!.summary.open_follow_up_count, 0);

      const completed = completeContactActionTask(
        linkedTask!.task_id,
        { completed_by_user_id: ORGANIZER.user_id, note: "Done" },
        ORGANIZER,
      );
      assert.ok(completed);
      assert.equal(completed!.status, "completed");

      assert.ok(completeInteractionFollowUp(interaction!.id, ORGANIZER));

      view = buildContactActionView(contact.contact_id, ADMIN);
      assert.ok(view);
      assert.equal(view!.summary.open_follow_up_count, 0);
      assert.equal(view!.summary.open_task_count, 1);
    } finally {
      shutdownApp();
    }
  });

  test("RBAC permissions on action operations", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "RBAC Action",
        emails: [{ email: "rbac-action@example.com", primary: true }],
      });

      assert.throws(
        () =>
          createContactActionTask(
            {
              workspace_id: WORKSPACE,
              contact_id: contact.contact_id,
              title: "Viewer task",
              created_by_user_id: VIEWER.user_id,
            },
            VIEWER,
          ),
        (error: unknown) =>
          error instanceof ContactActionValidationError && error.code === "forbidden",
      );

      const view = buildContactActionView(contact.contact_id, VIEWER);
      assert.ok(view);
    } finally {
      shutdownApp();
    }
  });
});
