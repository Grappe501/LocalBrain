import type {
  ContactActionQueue,
  ContactActionQueueBucket,
  ContactActionQueueItem,
  ContactActionSummary,
  ContactActionTask,
  ContactTaskPriority,
} from "@localbrain/shared";
import type { ContactFollowUpItem } from "@localbrain/shared";

const PRIORITY_WEIGHT: Record<ContactTaskPriority, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

function startOfLocalDay(iso: string): Date {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function classifyActionDueBucket(
  dueAt: string | undefined,
  now = new Date(),
): ContactActionQueueBucket {
  if (!dueAt) return "no_due";
  const due = startOfLocalDay(dueAt);
  const today = startOfLocalDay(now.toISOString());
  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "due_today";
  return "upcoming";
}

export function queueSortScore(item: ContactActionQueueItem): number {
  const bucketWeight =
    item.bucket === "overdue"
      ? 400
      : item.bucket === "due_today"
        ? 300
        : item.bucket === "upcoming"
          ? 200
          : 100;
  const priorityWeight = PRIORITY_WEIGHT[item.priority] * 10;
  const dueWeight = item.due_at ? Date.parse(item.due_at) / 1_000_000_000 : 0;
  return bucketWeight + priorityWeight - dueWeight;
}

export function buildActionSummary(options: {
  openTasks: readonly ContactActionTask[];
  openFollowUpCount: number;
}): ContactActionSummary {
  const openTaskCount = options.openTasks.filter((task) => task.status === "open").length;
  return {
    open_task_count: openTaskCount,
    open_follow_up_count: options.openFollowUpCount,
    total_open_actions: openTaskCount + options.openFollowUpCount,
  };
}

export function taskToQueueItem(
  task: ContactActionTask,
  contactDisplayName: string,
): ContactActionQueueItem {
  return {
    kind: "task",
    task_id: task.task_id,
    contact_id: task.contact_id,
    contact_display_name: contactDisplayName,
    title: task.title,
    assigned_to_user_id: task.assigned_to_user_id,
    due_at: task.due_at,
    priority: task.priority,
    bucket: classifyActionDueBucket(task.due_at),
    status: task.status,
  };
}

export function followUpToQueueItem(item: ContactFollowUpItem): ContactActionQueueItem {
  return {
    kind: "follow_up",
    interaction_id: item.interaction.id,
    contact_id: item.contact_id,
    contact_display_name: item.contact_display_name,
    title: item.interaction.summary,
    assigned_to_user_id: item.interaction.assigned_to_user_id,
    due_at: item.interaction.follow_up_due_at,
    priority: "normal",
    bucket: item.bucket,
    status: "open",
  };
}

export function buildUnifiedQueue(options: {
  workspace_id: string;
  assigned_to_user_id?: string;
  tasks: readonly ContactActionTask[];
  contactNames: ReadonlyMap<string, string>;
  followUps: readonly ContactFollowUpItem[];
  linkedInteractionIds: ReadonlySet<string>;
}): ContactActionQueue {
  const buckets = {
    overdue: [] as ContactActionQueueItem[],
    due_today: [] as ContactActionQueueItem[],
    upcoming: [] as ContactActionQueueItem[],
    no_due: [] as ContactActionQueueItem[],
  };

  for (const task of options.tasks) {
    if (task.status !== "open") continue;
    if (
      options.assigned_to_user_id &&
      task.assigned_to_user_id !== options.assigned_to_user_id
    ) {
      continue;
    }
    const displayName = options.contactNames.get(task.contact_id) ?? task.contact_id;
    const item = taskToQueueItem(task, displayName);
    buckets[item.bucket].push(item);
  }

  for (const followUp of options.followUps) {
    if (options.linkedInteractionIds.has(followUp.interaction.id)) continue;
    if (
      options.assigned_to_user_id &&
      followUp.interaction.assigned_to_user_id !== options.assigned_to_user_id
    ) {
      continue;
    }
    const item = followUpToQueueItem(followUp);
    buckets[item.bucket].push(item);
  }

  for (const key of Object.keys(buckets) as ContactActionQueueBucket[]) {
    buckets[key].sort((a, b) => queueSortScore(b) - queueSortScore(a));
  }

  return {
    engine_id: "CONTACT-V3-017",
    workspace_id: options.workspace_id,
    assigned_to_user_id: options.assigned_to_user_id,
    overdue: buckets.overdue,
    due_today: buckets.due_today,
    upcoming: buckets.upcoming,
    no_due: buckets.no_due,
  };
}
