import { resolveAccessContext, type ContactAccessContext } from "./contactInteractionValidator.js";

export class RelationshipAnalyticsValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "RelationshipAnalyticsValidationError";
    this.code = code;
  }
}

export { resolveAccessContext, type ContactAccessContext };

export function canViewRelationshipAnalytics(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner" || ctx.role === "organizer";
}

export function assertRoleCapable(allowed: boolean, code: string, message: string): void {
  if (!allowed) {
    throw new RelationshipAnalyticsValidationError(code, message);
  }
}
