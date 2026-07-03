import crypto from "node:crypto";
import type {
  CommunicationsDraftRequest,
  ContactRecipientRef,
  GenerateContactLinkedDraftInput,
  GenerateContactLinkedDraftResult,
  TraceableDraftGenerationResult,
} from "@localbrain/shared";
import {
  COMMUNICATIONS_DRAFT_ADVISORY_NOTICE,
  CONTACT_DRAFT_LINK_VERSION,
} from "@localbrain/shared";
import { assembleConstitutionalEvidencePackage } from "../executiveIntelligence/constitutionalRetrievalService.js";
import { generateTraceableCommunicationsDraft } from "../communicationsOffice/traceableDraftGenerator.js";
import type { TraceableDraftAdapter } from "../communicationsOffice/traceableDraftGenerator.js";
import { ContactValidationError } from "./contactValidator.js";
import {
  createContactDraftLinks,
  resolveRecipientSnapshots,
} from "./contactDraftLinkRepository.js";

export type GenerateLinkedDraftOptions = GenerateContactLinkedDraftInput & {
  adapter?: TraceableDraftAdapter;
};

export async function generateContactLinkedDraft(
  input: GenerateLinkedDraftOptions,
): Promise<GenerateContactLinkedDraftResult & { draft: TraceableDraftGenerationResult }> {
  const workspace_id = input.workspace_id.trim();
  const intent_label = input.intent_label.trim();
  if (!workspace_id) {
    throw new ContactValidationError("required_field", "workspace_id is required");
  }
  if (!intent_label) {
    throw new ContactValidationError("required_field", "intent_label is required");
  }

  const recipient_snapshots = resolveRecipientSnapshots(
    workspace_id,
    input.contact_id,
    input.recipient_refs,
  );

  const request_id = input.request_id?.trim() || crypto.randomUUID();
  const recipient_refs: ContactRecipientRef[] = recipient_snapshots.map((snapshot) => ({
    contact_id: snapshot.contact_id,
    display_name: snapshot.display_name,
    email: snapshot.email,
  }));

  const request: CommunicationsDraftRequest = {
    request_id,
    intent_label,
    audience_label: input.audience_label?.trim() || undefined,
    contact_id: input.contact_id?.trim() || recipient_snapshots[0]?.contact_id,
    recipient_refs,
  };

  const substrate_refs = input.substrate_refs ?? {};
  const pkg = assembleConstitutionalEvidencePackage({
    request_id: `contact-com-${request_id}`,
    scope_label: intent_label,
    substrate_refs: {
      episode: [...(substrate_refs.episode ?? [])],
      fact: [...(substrate_refs.fact ?? [])],
      conversation: [...(substrate_refs.conversation ?? [])],
      decision_citation: [...(substrate_refs.decision_citation ?? [])],
    },
  });

  const draft = await generateTraceableCommunicationsDraft(pkg, request, {
    adapter: input.adapter,
  });

  const links = createContactDraftLinks({
    workspace_id,
    draft,
    request_id,
    intent_label,
    audience_label: request.audience_label,
    recipient_snapshots,
  });

  return {
    engine_id: CONTACT_DRAFT_LINK_VERSION,
    draft_id: draft.draft.draft_id,
    links,
    advisory_notice: COMMUNICATIONS_DRAFT_ADVISORY_NOTICE,
    body_preview: draft.draft.body_text.slice(0, 240),
    draft,
  };
}
