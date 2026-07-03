import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { COMMUNICATIONS_DRAFT_ADVISORY_NOTICE } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import {
  writeConversation,
  writeDecisionCitation,
  writeEpisode,
  writeFact,
} from "../memory/writePipeline.js";
import { proposeFixtureTraceableDraft } from "../communicationsOffice/fixtureTraceableDraftAdapter.js";
import { createContact } from "./contactRepository.js";
import {
  listContactDraftLinks,
  listContactOutreachAudit,
  resolveRecipientSnapshots,
  updateContactOutreachWithAudit,
} from "./contactDraftLinkRepository.js";
import { generateContactLinkedDraft } from "./contactDraftLinkService.js";
import { ContactValidationError } from "./contactValidator.js";

const WORKSPACE = `localbrain-link-${crypto.randomUUID().slice(0, 8)}`;
const EXEC = { identity_id: "ID-executive-001", identity_kind: "executive" as const };

function seedEvidenceFixture() {
  const { episode } = writeEpisode({
    domain: "executive",
    started_at: "2026-07-01T09:00:00.000Z",
    source_ref: "source:contact-com/kickoff",
    event_at: "2026-07-01T09:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
    title: "Contact draft kickoff",
  });
  const { fact } = writeFact({
    domain: "executive",
    statement: "Follow-up remains on track.",
    subject_ref: { identity_id: "ID-initiative-contact-com", identity_kind: "organization" },
    predicate: "status",
    object_ref: "status:on_track",
    event_at: "2026-07-01T10:00:00.000Z",
    valid_from: "2026-07-01T10:00:00.000Z",
    source_ref: "source:contact-com/status",
    captured_by: EXEC,
    capture_method: "direct",
    confidence_level: "observed",
  });
  const { conversation } = writeConversation({
    domain: "executive",
    channel: "email",
    participants: [EXEC],
    started_at: "2026-07-01T12:00:00.000Z",
    event_at: "2026-07-01T12:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
    source_ref: "source:contact-com/thread",
    turns: [
      {
        sequence: 1,
        speaker_ref: EXEC,
        content: "Prepare a factual update for the contact.",
        event_at: "2026-07-01T12:00:00.000Z",
      },
    ],
  });
  const { citation } = writeDecisionCitation({
    decision_id: "decision:contact-com-001",
    question: "Proceed with contact-linked draft?",
    outcome_summary: "Approved for draft preparation.",
    decided_at: "2026-07-01T13:00:00.000Z",
    decider_ref: EXEC,
    supporting_memory_refs: [`episode:${episode.episode_id}`, `fact:${fact.fact_id}`],
    ledger_ref: "ledger:contact-com-001",
    event_at: "2026-07-01T13:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
  });
  return { episode, fact, conversation, citation };
}

test("resolveRecipientSnapshots requires workspace contact", () => {
  bootstrapApp();
  try {
    const contact = createContact({
      workspace_id: WORKSPACE,
      display_name: "Kelly Smith",
      emails: [{ email: "kelly@example.com" }],
    });
    const snapshots = resolveRecipientSnapshots(WORKSPACE, contact.contact_id, undefined);
    assert.equal(snapshots.length, 1);
    assert.equal(snapshots[0]?.display_name, "Kelly Smith");

    assert.throws(
      () => resolveRecipientSnapshots(WORKSPACE, crypto.randomUUID(), undefined),
      (error: unknown) => error instanceof ContactValidationError,
    );
  } finally {
    shutdownApp();
  }
});

test("generateContactLinkedDraft links COM draft without Contacts owning draft body", async () => {
  bootstrapApp();
  try {
    const { episode, fact, conversation, citation } = seedEvidenceFixture();
    const contact = createContact({
      workspace_id: WORKSPACE,
      display_name: "Board Liaison",
      emails: [{ email: "liaison@example.com" }],
    });

    const result = await generateContactLinkedDraft({
      workspace_id: WORKSPACE,
      intent_label: "Board update for liaison",
      audience_label: "Board observers",
      contact_id: contact.contact_id,
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
        conversation: [conversation.conversation_id],
        decision_citation: [citation.citation_id],
      },
      adapter: proposeFixtureTraceableDraft,
    });

    assert.equal(result.links.length, 1);
    assert.equal(result.links[0]?.contact_id, contact.contact_id);
    assert.equal(result.advisory_notice, COMMUNICATIONS_DRAFT_ADVISORY_NOTICE);
    assert.ok(result.draft.draft.body_text.length > 0);
    assert.notEqual(result.draft.draft.draft_id, contact.contact_id);

    const linked = listContactDraftLinks(contact.contact_id);
    assert.equal(linked.length, 1);
    assert.equal(linked[0]?.intent_label, "Board update for liaison");
  } finally {
    shutdownApp();
  }
});

test("updateContactOutreachWithAudit requires note and records append-only audit", () => {
  bootstrapApp();
  try {
    const contact = createContact({
      workspace_id: WORKSPACE,
      display_name: "Outreach Target",
      emails: [{ email: "outreach@example.com" }],
      outreach_status: "none",
    });

    assert.throws(
      () =>
        updateContactOutreachWithAudit(contact.contact_id, {
          outreach_status: "queued",
          note: "   ",
        }),
      (error: unknown) => error instanceof ContactValidationError,
    );

    const updated = updateContactOutreachWithAudit(contact.contact_id, {
      outreach_status: "queued",
      note: "Draft prepared for human review — no send path opened.",
    });
    assert.equal(updated?.outreach_status, "queued");

    const audit = listContactOutreachAudit(contact.contact_id);
    assert.equal(audit.length, 1);
    assert.equal(audit[0]?.note, "Draft prepared for human review — no send path opened.");
  } finally {
    shutdownApp();
  }
});

test("generateContactLinkedDraft supports multiple recipient refs without CRM merge", async () => {
  bootstrapApp();
  try {
    const { episode, fact, conversation, citation } = seedEvidenceFixture();
    const first = createContact({
      workspace_id: WORKSPACE,
      display_name: "Recipient A",
      emails: [{ email: "a@example.com" }],
    });
    const second = createContact({
      workspace_id: WORKSPACE,
      display_name: "Recipient B",
      emails: [{ email: "b@example.com" }],
    });

    const result = await generateContactLinkedDraft({
      workspace_id: WORKSPACE,
      intent_label: "Shared board update",
      recipient_refs: [{ contact_id: first.contact_id }, { contact_id: second.contact_id }],
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
        conversation: [conversation.conversation_id],
        decision_citation: [citation.citation_id],
      },
      adapter: proposeFixtureTraceableDraft,
    });

    assert.equal(result.links.length, 2);
    assert.equal(result.draft.draft.draft_id, result.links[0]?.draft_id);
    assert.equal(result.links[0]?.draft_id, result.links[1]?.draft_id);
    assert.equal(listContactDraftLinks(first.contact_id).length, 1);
    assert.equal(listContactDraftLinks(second.contact_id).length, 1);
  } finally {
    shutdownApp();
  }
});
