/** UCIE-108 — Provenance engine. */

export type FieldProvenance = {
  provenance_id: string;
  contact_id: string;
  field_name: string;
  field_value: string;
  source_type: string;
  source_label: string;
  uploaded_by_user_id?: string;
  confirmed_by_user_id?: string;
  session_id?: string;
  row_id?: string;
  verified_at?: string;
  created_at: string;
};

export type UcieProvenanceChain = {
  contact_id: string;
  field_name: string;
  entries: readonly FieldProvenance[];
};
