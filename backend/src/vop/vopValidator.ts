export class VopValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "VopValidationError";
    this.code = code;
  }
}

export type VopAccessContext = {
  user_id: string;
  role: "admin" | "owner" | "organizer" | "supervisor" | "volunteer" | "viewer";
};

export function resolveVopAccessContext(input: {
  user_id?: unknown;
  role?: unknown;
}): VopAccessContext {
  const user_id =
    typeof input.user_id === "string" && input.user_id.trim()
      ? input.user_id.trim()
      : "local-user";
  const roleRaw = typeof input.role === "string" ? input.role.trim() : "volunteer";
  const role =
    roleRaw === "admin" ||
    roleRaw === "owner" ||
    roleRaw === "organizer" ||
    roleRaw === "supervisor" ||
    roleRaw === "viewer"
      ? roleRaw
      : "volunteer";
  return { user_id, role };
}

export function canClaimVopWork(ctx: VopAccessContext): boolean {
  return ctx.role !== "viewer";
}

export function canSuperviseVop(ctx: VopAccessContext): boolean {
  return (
    ctx.role === "admin" ||
    ctx.role === "owner" ||
    ctx.role === "organizer" ||
    ctx.role === "supervisor"
  );
}

export function canCreateVopWork(ctx: VopAccessContext): boolean {
  return canSuperviseVop(ctx);
}

export function assertVopCapable(allowed: boolean, code: string, message: string): void {
  if (!allowed) {
    throw new VopValidationError(code, message);
  }
}
