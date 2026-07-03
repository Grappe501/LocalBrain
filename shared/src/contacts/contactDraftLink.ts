import type { ContactOutreachStatus } from "./contactRecord.js";
import type { ContactRecipientRef } from "../memoryOs/communicationsDraft.js";

/** ENG-CONTACT-001.4 — Contact ↔ Communications draft link contract. */
export const CONTACT_DRAFT_LINK_VERSION = "ENG-CONTACT-001.4" as const;

export type ContactDraftLink = {
  link_id: string;
  workspace_id: string;
  contact_id: string;
  draft_id: string;
  request_id: string;
  intent_label: string;
  audience_label?: string;
  body_preview: string;
  linked_at: string;
  recipient_snapshot: {
    contact_id: string;
    display_name: string;
    email?: string;
  };
};

export type ContactOutreachAuditEntry = {
  audit_id: string;
  workspace_id: string;
  contact_id: string;
  outreach_status: ContactOutreachStatus;
  note: string;
  draft_link_id?: string;
  created_at: string;
};

export type UpdateContactOutreachInput = {
  outreach_status: ContactOutreachStatus;
  note: string;
  draft_link_id?: string;
};

export type GenerateContactLinkedDraftInput = {
  workspace_id: string;
  intent_label: string;
  audience_label?: string;
  request_id?: string;
  contact_id?: string;
  recipient_refs?: readonly ContactRecipientRef[];
  substrate_refs?: {
    episode?: readonly string[];
    fact?: readonly string[];
    conversation?: readonly string[];
    decision_citation?: readonly string[];
  };
};

export type GenerateContactLinkedDraftResult = {
  engine_id: typeof CONTACT_DRAFT_LINK_VERSION;
  draft_id: string;
  links: readonly ContactDraftLink[];
  advisory_notice: string;
  body_preview: string;
};
