export type PermissionAction = "read" | "list" | "write" | "delete";

export type PermissionLevel =
  | "FORBIDDEN"
  | "READ_ONLY"
  | "CREATE_DRAFT"
  | "EDIT"
  | "MOVE"
  | "DELETE_QUARANTINE";

export type PathCheckResult = {
  allowed: boolean;
  level: PermissionLevel;
  reason: string;
  normalizedPath?: string;
};

export type PathCheckInput = {
  path: string;
  action?: PermissionAction;
};
