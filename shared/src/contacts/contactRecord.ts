/** ENG-CONTACT-001.1 — Canonical contact storage contract. */
export const CONTACT_RECORD_VERSION = "ENG-CONTACT-001.1" as const;

export const CONTACT_RECORD_ENGINE_ID = "ENG-CONTACT-001" as const;

/** Human-controlled outreach status — no automated send in ENG-CONTACT-001. */
export type ContactOutreachStatus = "none" | "queued" | "sent" | "replied";

export type ContactEmail = {
  email: string;
  label?: string;
  primary?: boolean;
};

export type ContactPhone = {
  phone: string;
  label?: string;
  primary?: boolean;
};

export type ContactAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  label?: string;
};

/** Canonical contact record — one row per person per workspace. */
export type ContactRecord = {
  contact_id: string;
  workspace_id: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  emails: readonly ContactEmail[];
  phones: readonly ContactPhone[];
  addresses: readonly ContactAddress[];
  tags: readonly string[];
  notes: string;
  outreach_status: ContactOutreachStatus;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactOrganization = {
  organization_id: string;
  workspace_id: string;
  name: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactOrganizationAffiliation = {
  organization_id: string;
  organization_name: string;
  role_label?: string;
};

export type ContactRecordWithAffiliations = ContactRecord & {
  affiliations: readonly ContactOrganizationAffiliation[];
};

export type CreateContactInput = {
  workspace_id: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  emails?: readonly ContactEmail[];
  phones?: readonly ContactPhone[];
  addresses?: readonly ContactAddress[];
  tags?: readonly string[];
  notes?: string;
  outreach_status?: ContactOutreachStatus;
};

export type UpdateContactInput = {
  display_name?: string;
  first_name?: string | null;
  last_name?: string | null;
  emails?: readonly ContactEmail[];
  phones?: readonly ContactPhone[];
  addresses?: readonly ContactAddress[];
  tags?: readonly string[];
  notes?: string;
  outreach_status?: ContactOutreachStatus;
};

export type CreateContactOrganizationInput = {
  workspace_id: string;
  name: string;
};

export type ContactListFilter = {
  workspace_id: string;
  include_archived?: boolean;
  search?: string;
  tag?: string;
  email?: string;
  context_id?: string;
  context_primary_only?: boolean;
};
