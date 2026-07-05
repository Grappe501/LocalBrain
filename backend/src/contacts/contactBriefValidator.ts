import { resolveAccessContext, type ContactAccessContext } from "./contactInteractionValidator.js";

export class ContactBriefValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ContactBriefValidationError";
    this.code = code;
  }
}

export { resolveAccessContext, type ContactAccessContext };

export function canViewBriefs(_ctx: ContactAccessContext): boolean {
  return true;
}

export function canRegenerateBriefs(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner" || ctx.role === "organizer";
}

export function assertRoleCapable(allowed: boolean, code: string, message: string): void {
  if (!allowed) {
    throw new ContactBriefValidationError(code, message);
  }
}
