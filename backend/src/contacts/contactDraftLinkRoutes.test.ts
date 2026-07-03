import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import express from "express";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { contactsRouter } from "../routes/contacts.js";
import { communicationsDraftsRouter } from "../routes/communicationsDrafts.js";
import {
  writeConversation,
  writeDecisionCitation,
  writeEpisode,
  writeFact,
} from "../memory/writePipeline.js";

const WORKSPACE = `localbrain-com-link-${crypto.randomUUID().slice(0, 8)}`;
const EXEC = { identity_id: "ID-executive-001", identity_kind: "executive" as const };

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api", contactsRouter);
  app.use("/api", communicationsDraftsRouter);
  return app;
}

function seedEvidenceFixture() {
  const { episode } = writeEpisode({
    domain: "executive",
    started_at: "2026-07-01T09:00:00.000Z",
    source_ref: "source:route-com/kickoff",
    event_at: "2026-07-01T09:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
    title: "Route COM kickoff",
  });
  const { fact } = writeFact({
    domain: "executive",
    statement: "Route follow-up remains on track.",
    subject_ref: { identity_id: "ID-initiative-route-com", identity_kind: "organization" },
    predicate: "status",
    object_ref: "status:on_track",
    event_at: "2026-07-01T10:00:00.000Z",
    valid_from: "2026-07-01T10:00:00.000Z",
    source_ref: "source:route-com/status",
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
    source_ref: "source:route-com/thread",
    turns: [
      {
        sequence: 1,
        speaker_ref: EXEC,
        content: "Prepare route-linked draft.",
        event_at: "2026-07-01T12:00:00.000Z",
      },
    ],
  });
  const { citation } = writeDecisionCitation({
    decision_id: "decision:route-com-001",
    question: "Proceed?",
    outcome_summary: "Approved.",
    decided_at: "2026-07-01T13:00:00.000Z",
    decider_ref: EXEC,
    supporting_memory_refs: [`episode:${episode.episode_id}`, `fact:${fact.fact_id}`],
    ledger_ref: "ledger:route-com-001",
    event_at: "2026-07-01T13:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
  });
  return { episode, fact, conversation, citation };
}

test("communications draft generate and contact draft list routes", async () => {
  bootstrapApp();
  const app = createApp();
  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;
  const base = `http://127.0.0.1:${port}/api`;

  try {
    const createRes = await fetch(`${base}/contacts?workspace_id=${WORKSPACE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: WORKSPACE,
        display_name: "Route Contact",
        emails: [{ email: "route.contact@example.com" }],
      }),
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()) as { contact: { contact_id: string } };

    const { episode, fact, conversation, citation } = seedEvidenceFixture();
    const draftRes = await fetch(`${base}/communications/drafts/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: WORKSPACE,
        intent_label: "Route-linked update",
        contact_id: created.contact.contact_id,
        use_fixture: true,
        substrate_refs: {
          episode: [episode.episode_id],
          fact: [fact.fact_id],
          conversation: [conversation.conversation_id],
          decision_citation: [citation.citation_id],
        },
      }),
    });
    assert.equal(draftRes.status, 201);
    const draftBody = (await draftRes.json()) as {
      result: { links: { link_id: string }[] };
      draft: { draft: { advisory_notice: string } };
    };
    assert.equal(draftBody.result.links.length, 1);

    const listRes = await fetch(`${base}/contacts/${created.contact.contact_id}/drafts`);
    assert.equal(listRes.status, 200);
    const listBody = (await listRes.json()) as { drafts: { link_id: string }[] };
    assert.equal(listBody.drafts.length, 1);

    const outreachRes = await fetch(`${base}/contacts/${created.contact.contact_id}/outreach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outreach_status: "queued",
        note: "Linked draft queued for human review.",
        draft_link_id: draftBody.result.links[0]?.link_id,
      }),
    });
    assert.equal(outreachRes.status, 200);
    const outreachBody = (await outreachRes.json()) as { contact: { outreach_status: string } };
    assert.equal(outreachBody.contact.outreach_status, "queued");

    const auditRes = await fetch(`${base}/contacts/${created.contact.contact_id}/outreach-audit`);
    assert.equal(auditRes.status, 200);
    const auditBody = (await auditRes.json()) as { audit: { note: string }[] };
    assert.equal(auditBody.audit.length, 1);
  } finally {
    server.close();
    shutdownApp();
  }
});
