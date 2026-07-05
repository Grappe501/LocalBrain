import crypto from "node:crypto";
import type {
  CompleteContactActionTaskInput,
  ContactActionQueue,
  ContactActionTask,
  ContactActionTaskHistory,
  ContactActionView,
  CreateContactActionTaskInput,
  UpdateContactActionTaskInput,
} from "@localbrain/shared";
import { CONTACT_ACTION_VERSION } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getContactById } from "./contactRepository.js";
import {
  getContactInteractionById,
  listContactInteractions,
  listWorkspaceFollowUps,
  updateContactInteraction,
} from "./contactInteractionRepository.js";
import {
  buildActionSummary,
  buildUnifiedQueue,
} from "./contactActionCompute.js";
import type { ContactAccessContext } from "./contactActionValidator.js";
import {
  assertRoleCapable,
  canEditActions,
  canViewActions,
  validateCompleteTaskInput,
  validateCreateTaskInput,
  validateUpdateTaskInput,
} from "./contactActionValidator.js";

type TaskRow = {
  task_id: string;
  workspace_id: string;
  contact_id: string;
  title: string;
  details: string | null;
  status: string;
  priority: string;
  assigned_to_user_id: string | null;
  due_at: string | null;
  interaction_id: string | null;
  context_id: string | null;
  source: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  completed_by_user_id: string | null;
};

type HistoryRow = {
  history_id: string;
  task_id: string;
  workspace_id: string;
  contact_id: string;
  from_status: string | null;
  to_status: string;
  note: string | null;
  changed_by_user_id: string;
  created_at: string;
};

function rowToTask(row: TaskRow): ContactActionTask {
  return {
    task_id: row.task_id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    title: row.title,
    details: row.details ?? undefined,
    status: row.status as ContactActionTask["status"],
    priority: row.priority as ContactActionTask["priority"],
    assigned_to_user_id: row.assigned_to_user_id ?? undefined,
    due_at: row.due_at ?? undefined,
    interaction_id: row.interaction_id ?? undefined,
    context_id: row.context_id ?? undefined,
    source: row.source as ContactActionTask["source"],
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    completed_at: row.completed_at ?? undefined,
    completed_by_user_id: row.completed_by_user_id ?? undefined,
  };
}

function rowToHistory(row: HistoryRow): ContactActionTaskHistory {
  return {
    history_id: row.history_id,
    task_id: row.task_id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    from_status: (row.from_status ?? undefined) as ContactActionTaskHistory["from_status"],
    to_status: row.to_status as ContactActionTaskHistory["to_status"],
    note: row.note ?? undefined,
    changed_by_user_id: row.changed_by_user_id,
    created_at: row.created_at,
  };
}

function appendTaskHistory(options: {
  task: ContactActionTask;
  from_status?: ContactActionTask["status"];
  to_status: ContactActionTask["status"];
  note?: string;
  changed_by_user_id: string;
}): void {
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO contact_action_task_history (
        history_id, task_id, workspace_id, contact_id, from_status, to_status, note, changed_by_user_id, created_at
      ) VALUES (
        @history_id, @task_id, @workspace_id, @contact_id, @from_status, @to_status, @note, @changed_by_user_id, @created_at
      )`,
    )
    .run({
      history_id: crypto.randomUUID(),
      task_id: options.task.task_id,
      workspace_id: options.task.workspace_id,
      contact_id: options.task.contact_id,
      from_status: options.from_status ?? null,
      to_status: options.to_status,
      note: options.note ?? null,
      changed_by_user_id: options.changed_by_user_id,
      created_at: now,
    });
}

function getTaskById(taskId: string): ContactActionTask | null {
  const row = getDatabase()
    .prepare(`SELECT * FROM contact_action_tasks WHERE task_id = ?`)
    .get(taskId) as TaskRow | undefined;
  return row ? rowToTask(row) : null;
}

function listOpenTasksForContact(contactId: string): ContactActionTask[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM contact_action_tasks WHERE contact_id = ? ORDER BY
        CASE status WHEN 'open' THEN 0 ELSE 1 END,
        due_at IS NULL, due_at ASC, created_at DESC`,
    )
    .all(contactId) as TaskRow[];
  return rows.map(rowToTask);
}

function listOpenTasksForWorkspace(workspaceId: string): ContactActionTask[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM contact_action_tasks
       WHERE workspace_id = ? AND status = 'open'
       ORDER BY due_at IS NULL, due_at ASC, created_at DESC`,
    )
    .all(workspaceId) as TaskRow[];
  return rows.map(rowToTask);
}

function linkedInteractionIdsForWorkspace(workspaceId: string): Set<string> {
  const rows = getDatabase()
    .prepare(
      `SELECT interaction_id FROM contact_action_tasks
       WHERE workspace_id = ? AND status = 'open' AND interaction_id IS NOT NULL`,
    )
    .all(workspaceId) as { interaction_id: string }[];
  return new Set(rows.map((row) => row.interaction_id));
}

function countOpenFollowUpsForContact(
  contactId: string,
  ctx: ContactAccessContext,
  linkedIds: Set<string>,
): number {
  const interactions = listContactInteractions({ contact_id: contactId, ctx });
  return interactions.filter(
    (item) =>
      item.follow_up_required &&
      item.follow_up_due_at &&
      !linkedIds.has(item.id),
  ).length;
}

export function createContactActionTask(
  input: CreateContactActionTaskInput,
  ctx: ContactAccessContext,
): ContactActionTask | null {
  validateCreateTaskInput(input);
  assertRoleCapable(canEditActions(ctx), "forbidden", "Insufficient permissions to create tasks");

  const contact = getContactById(input.contact_id);
  if (!contact || contact.workspace_id !== input.workspace_id) return null;

  if (input.interaction_id) {
    const interaction = getContactInteractionById(input.interaction_id);
    if (!interaction || interaction.contact_id !== input.contact_id) {
      throw new Error("interaction_not_found");
    }
  }

  const now = new Date().toISOString();
  const taskId = crypto.randomUUID();
  const task: ContactActionTask = {
    task_id: taskId,
    workspace_id: input.workspace_id,
    contact_id: input.contact_id,
    title: input.title.trim(),
    details: input.details?.trim(),
    status: "open",
    priority: input.priority ?? "normal",
    assigned_to_user_id: input.assigned_to_user_id,
    due_at: input.due_at,
    interaction_id: input.interaction_id,
    context_id: input.context_id,
    source: input.interaction_id ? "follow_up" : (input.source ?? "manual"),
    created_by_user_id: input.created_by_user_id,
    created_at: now,
    updated_at: now,
  };

  getDatabase()
    .prepare(
      `INSERT INTO contact_action_tasks (
        task_id, workspace_id, contact_id, title, details, status, priority,
        assigned_to_user_id, due_at, interaction_id, context_id, source,
        created_by_user_id, created_at, updated_at, completed_at, completed_by_user_id
      ) VALUES (
        @task_id, @workspace_id, @contact_id, @title, @details, @status, @priority,
        @assigned_to_user_id, @due_at, @interaction_id, @context_id, @source,
        @created_by_user_id, @created_at, @updated_at, NULL, NULL
      )`,
    )
    .run({
      task_id: task.task_id,
      workspace_id: task.workspace_id,
      contact_id: task.contact_id,
      title: task.title,
      details: task.details ?? null,
      status: task.status,
      priority: task.priority,
      assigned_to_user_id: task.assigned_to_user_id ?? null,
      due_at: task.due_at ?? null,
      interaction_id: task.interaction_id ?? null,
      context_id: task.context_id ?? null,
      source: task.source,
      created_by_user_id: task.created_by_user_id,
      created_at: task.created_at,
      updated_at: task.updated_at,
    });

  appendTaskHistory({
    task,
    to_status: "open",
    note: "Task created",
    changed_by_user_id: input.created_by_user_id,
  });

  return task;
}

export function updateContactActionTask(
  taskId: string,
  input: UpdateContactActionTaskInput,
  ctx: ContactAccessContext,
): ContactActionTask | null {
  validateUpdateTaskInput(input);
  assertRoleCapable(canEditActions(ctx), "forbidden", "Insufficient permissions to update tasks");

  const existing = getTaskById(taskId);
  if (!existing || existing.status !== "open") return null;

  const now = new Date().toISOString();
  const next = {
    title: input.title?.trim() ?? existing.title,
    details: input.details !== undefined ? input.details.trim() : existing.details,
    priority: input.priority ?? existing.priority,
    assigned_to_user_id:
      input.assigned_to_user_id === null
        ? undefined
        : (input.assigned_to_user_id ?? existing.assigned_to_user_id),
    due_at:
      input.due_at === null ? undefined : (input.due_at ?? existing.due_at),
    updated_at: now,
  };

  getDatabase()
    .prepare(
      `UPDATE contact_action_tasks SET
        title = @title, details = @details, priority = @priority,
        assigned_to_user_id = @assigned_to_user_id, due_at = @due_at, updated_at = @updated_at
       WHERE task_id = @task_id`,
    )
    .run({
      task_id: taskId,
      title: next.title,
      details: next.details ?? null,
      priority: next.priority,
      assigned_to_user_id: next.assigned_to_user_id ?? null,
      due_at: next.due_at ?? null,
      updated_at: next.updated_at,
    });

  return getTaskById(taskId);
}

function clearLinkedFollowUp(
  task: ContactActionTask,
  ctx: ContactAccessContext,
): void {
  if (!task.interaction_id) return;
  updateContactInteraction(
    task.interaction_id,
    { follow_up_required: false, follow_up_due_at: null },
    ctx,
  );
}

export function completeContactActionTask(
  taskId: string,
  input: CompleteContactActionTaskInput,
  ctx: ContactAccessContext,
): ContactActionTask | null {
  validateCompleteTaskInput(input);
  assertRoleCapable(canEditActions(ctx), "forbidden", "Insufficient permissions to complete tasks");

  const existing = getTaskById(taskId);
  if (!existing || existing.status !== "open") return null;

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE contact_action_tasks SET
        status = 'completed', updated_at = @updated_at,
        completed_at = @completed_at, completed_by_user_id = @completed_by_user_id
       WHERE task_id = @task_id`,
    )
    .run({
      task_id: taskId,
      updated_at: now,
      completed_at: now,
      completed_by_user_id: input.completed_by_user_id,
    });

  const completed = getTaskById(taskId)!;
  appendTaskHistory({
    task: completed,
    from_status: "open",
    to_status: "completed",
    note: input.note,
    changed_by_user_id: input.completed_by_user_id,
  });
  clearLinkedFollowUp(completed, ctx);
  return completed;
}

export function completeInteractionFollowUp(
  interactionId: string,
  ctx: ContactAccessContext,
): boolean {
  assertRoleCapable(canEditActions(ctx), "forbidden", "Insufficient permissions to complete follow-ups");
  const updated = updateContactInteraction(
    interactionId,
    { follow_up_required: false, follow_up_due_at: null },
    ctx,
  );
  return updated != null;
}

export function buildContactActionView(
  contactId: string,
  ctx: ContactAccessContext,
): ContactActionView | null {
  if (!canViewActions(ctx)) return null;
  const contact = getContactById(contactId);
  if (!contact) return null;

  const tasks = listOpenTasksForContact(contactId);
  const linkedIds = new Set(
    tasks.filter((task) => task.interaction_id).map((task) => task.interaction_id!),
  );
  const openFollowUpCount = countOpenFollowUpsForContact(contactId, ctx, linkedIds);

  const historyRows = getDatabase()
    .prepare(
      `SELECT * FROM contact_action_task_history
       WHERE contact_id = ? ORDER BY created_at DESC LIMIT 20`,
    )
    .all(contactId) as HistoryRow[];

  return {
    engine_id: CONTACT_ACTION_VERSION,
    contact_id: contactId,
    workspace_id: contact.workspace_id,
    summary: buildActionSummary({ openTasks: tasks, openFollowUpCount }),
    open_tasks: tasks.filter((task) => task.status === "open"),
    history: historyRows.map(rowToHistory),
  };
}

export function buildActionQueue(options: {
  workspace_id: string;
  assigned_to_user_id?: string;
  ctx: ContactAccessContext;
}): ContactActionQueue {
  assertRoleCapable(canViewActions(options.ctx), "forbidden", "Insufficient permissions to view queue");

  const tasks = listOpenTasksForWorkspace(options.workspace_id);
  const linkedIds = linkedInteractionIdsForWorkspace(options.workspace_id);
  const followUpBuckets = listWorkspaceFollowUps({
    workspace_id: options.workspace_id,
    ctx: options.ctx,
  });
  const followUps = [
    ...followUpBuckets.overdue,
    ...followUpBuckets.due_today,
    ...followUpBuckets.upcoming,
  ];

  const contactNames = new Map<string, string>();
  for (const task of tasks) {
    if (!contactNames.has(task.contact_id)) {
      const contact = getContactById(task.contact_id);
      contactNames.set(task.contact_id, contact?.display_name ?? task.contact_id);
    }
  }
  for (const item of followUps) {
    contactNames.set(item.contact_id, item.contact_display_name);
  }

  return buildUnifiedQueue({
    workspace_id: options.workspace_id,
    assigned_to_user_id: options.assigned_to_user_id,
    tasks,
    contactNames,
    followUps,
    linkedInteractionIds: linkedIds,
  });
}
