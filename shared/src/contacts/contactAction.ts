/** CONTACT-V3-017 — Action Engine contract. */
export const CONTACT_ACTION_VERSION = "CONTACT-V3-017" as const;

export const CONTACT_TASK_STATUSES = ["open", "completed", "cancelled"] as const;
export type ContactTaskStatus = (typeof CONTACT_TASK_STATUSES)[number];

export const CONTACT_TASK_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type ContactTaskPriority = (typeof CONTACT_TASK_PRIORITIES)[number];

export const CONTACT_TASK_SOURCES = ["manual", "follow_up"] as const;
export type ContactTaskSource = (typeof CONTACT_TASK_SOURCES)[number];

export const CONTACT_ACTION_QUEUE_BUCKETS = [
  "overdue",
  "due_today",
  "upcoming",
  "no_due",
] as const;
export type ContactActionQueueBucket = (typeof CONTACT_ACTION_QUEUE_BUCKETS)[number];

export type ContactActionTask = {
  task_id: string;
  workspace_id: string;
  contact_id: string;
  title: string;
  details?: string;
  status: ContactTaskStatus;
  priority: ContactTaskPriority;
  assigned_to_user_id?: string;
  due_at?: string;
  interaction_id?: string;
  context_id?: string;
  source: ContactTaskSource;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  completed_by_user_id?: string;
};

export type ContactActionTaskHistory = {
  history_id: string;
  task_id: string;
  workspace_id: string;
  contact_id: string;
  from_status?: ContactTaskStatus;
  to_status: ContactTaskStatus;
  note?: string;
  changed_by_user_id: string;
  created_at: string;
};

export type ContactActionQueueItemKind = "task" | "follow_up";

export type ContactActionQueueItem = {
  kind: ContactActionQueueItemKind;
  task_id?: string;
  interaction_id?: string;
  contact_id: string;
  contact_display_name: string;
  title: string;
  assigned_to_user_id?: string;
  due_at?: string;
  priority: ContactTaskPriority;
  bucket: ContactActionQueueBucket;
  status: ContactTaskStatus | "open";
};

export type ContactActionSummary = {
  open_task_count: number;
  open_follow_up_count: number;
  total_open_actions: number;
};

export type ContactActionView = {
  engine_id: typeof CONTACT_ACTION_VERSION;
  contact_id: string;
  workspace_id: string;
  summary: ContactActionSummary;
  open_tasks: readonly ContactActionTask[];
  history: readonly ContactActionTaskHistory[];
};

export type ContactActionQueue = {
  engine_id: typeof CONTACT_ACTION_VERSION;
  workspace_id: string;
  assigned_to_user_id?: string;
  overdue: readonly ContactActionQueueItem[];
  due_today: readonly ContactActionQueueItem[];
  upcoming: readonly ContactActionQueueItem[];
  no_due: readonly ContactActionQueueItem[];
};

export type CreateContactActionTaskInput = {
  workspace_id: string;
  contact_id: string;
  title: string;
  details?: string;
  priority?: ContactTaskPriority;
  assigned_to_user_id?: string;
  due_at?: string;
  interaction_id?: string;
  context_id?: string;
  source?: ContactTaskSource;
  created_by_user_id: string;
};

export type UpdateContactActionTaskInput = {
  title?: string;
  details?: string;
  priority?: ContactTaskPriority;
  assigned_to_user_id?: string | null;
  due_at?: string | null;
  updated_by_user_id: string;
};

export type CompleteContactActionTaskInput = {
  completed_by_user_id: string;
  note?: string;
};

export const CONTACT_ACTION_ADVISORY_NOTICE =
  "Action items combine assignable tasks with timeline follow-ups — complete work without duplicating timeline state." as const;
