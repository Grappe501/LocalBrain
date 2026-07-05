export class UcieValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "UcieValidationError";
    this.code = code;
  }
}

export type UcieAccessContext = {
  user_id: string;
  role: "admin" | "owner" | "organizer" | "viewer";
};

export function resolveUcieAccessContext(input: {
  user_id?: unknown;
  role?: unknown;
}): UcieAccessContext {
  const user_id =
    typeof input.user_id === "string" && input.user_id.trim()
      ? input.user_id.trim()
      : "local-user";
  const roleRaw = typeof input.role === "string" ? input.role.trim() : "admin";
  const role =
    roleRaw === "owner" || roleRaw === "organizer" || roleRaw === "viewer"
      ? roleRaw
      : "admin";
  return { user_id, role };
}

export function canIntakeUcie(ctx: UcieAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner" || ctx.role === "organizer";
}

export function canReviewUcie(ctx: UcieAccessContext): boolean {
  return canIntakeUcie(ctx);
}

export function canCommitUcie(ctx: UcieAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner";
}

export function canClaimWork(ctx: UcieAccessContext): boolean {
  return true;
}

export function assertUcieCapable(allowed: boolean, code: string, message: string): void {
  if (!allowed) {
    throw new UcieValidationError(code, message);
  }
}
