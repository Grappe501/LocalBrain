import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { getDatabase } from "../db/database.js";
import { createContact } from "./contactRepository.js";
import { createContactInteraction } from "./contactInteractionRepository.js";
import {
  buildContactBrief,
  buildContactBriefEvidenceView,
  regenerateContactBrief,
} from "./contactBriefRepository.js";
import { composeContactBrief } from "./contactBriefComposer.js";
import { ContactBriefValidationError } from "./contactBriefValidator.js";
import { resolveAccessContext } from "./contactInteractionValidator.js";
import { assignContactSteward } from "./contactStewardshipRepository.js";

const WORKSPACE = `localbrain-brief-${crypto.randomUUID().slice(0, 8)}`;
const ADMIN = resolveAccessContext({ user_id: "admin-user", role: "admin" });
const VIEWER = resolveAccessContext({ user_id: "viewer-user", role: "viewer" });

describe("CONTACT-V3-020", { concurrency: 1 }, () => {
  test("evidence, citations, confidence, recommendations, regeneration, cache metadata", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "Brief Subject",
        emails: [{ email: "brief@example.com", primary: true }],
      });

      createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: contact.contact_id,
        type: "event",
        summary: "County rally attendance",
        created_by_user_id: ADMIN.user_id,
        visibility: "campaign",
      });
      createContactInteraction({
        workspace_id: WORKSPACE,
        contact_id: contact.contact_id,
        type: "volunteer_shift",
        summary: "Phone bank shift",
        created_by_user_id: ADMIN.user_id,
        visibility: "campaign",
      });

      assignContactSteward(
        {
          workspace_id: WORKSPACE,
          contact_id: contact.contact_id,
          steward_user_id: "kelly-user",
          created_by_user_id: ADMIN.user_id,
        },
        ADMIN,
      );

      const brief = buildContactBrief(contact.contact_id, ADMIN);
      assert.ok(brief);
      assert.equal(brief!.advisory, true);
      assert.equal(brief!.metadata.live_ai_wired, false);
      assert.ok(brief!.evidence.length >= 3);
      assert.ok(brief!.metadata.source_engines.includes("timeline"));
      assert.ok(brief!.metadata.source_engines.includes("stewardship"));

      for (const section of brief!.sections) {
        if (!section.withheld) {
          assert.ok(section.body);
          assert.ok(section.citations.length > 0);
        }
      }

      for (const rec of [...brief!.recommendations, ...brief!.opportunities, ...brief!.risks]) {
        assert.ok(rec.citations.length > 0);
        assert.ok(["high", "medium", "low"].includes(rec.confidence));
        assert.ok(rec.why.length > 0);
      }

      const cache = getDatabase()
        .prepare(`SELECT regeneration_count FROM contact_brief_cache WHERE contact_id = ?`)
        .get(contact.contact_id) as { regeneration_count: number };
      assert.equal(cache.regeneration_count, 0);

      const regenerated = regenerateContactBrief(contact.contact_id, ADMIN);
      assert.ok(regenerated);
      assert.equal(regenerated!.metadata.regeneration_count, 1);

      const evidenceView = buildContactBriefEvidenceView(contact.contact_id, ADMIN);
      assert.ok(evidenceView);
      assert.equal(evidenceView!.evidence.length, brief!.evidence.length);
    } finally {
      shutdownApp();
    }
  });

  test("empty contact withholds unsupported claims and RBAC on regenerate", () => {
    bootstrapApp();
    try {
      const contact = createContact({
        workspace_id: WORKSPACE,
        display_name: "Empty Brief",
        emails: [{ email: "empty-brief@example.com", primary: true }],
      });

      const brief = composeContactBrief({
        contact_id: contact.contact_id,
        ctx: ADMIN,
        generated_by_user_id: ADMIN.user_id,
        regeneration_count: 0,
        operator_approved: false,
      });
      assert.ok(brief);
      assert.equal(brief!.summary.has_substantive_evidence, false);
      assert.equal(brief!.executive_summary, undefined);
      assert.ok(brief!.sections.every((section) => section.withheld));
      assert.equal(brief!.recommendations.length, 0);

      assert.throws(
        () => regenerateContactBrief(contact.contact_id, VIEWER),
        (error: unknown) =>
          error instanceof ContactBriefValidationError && error.code === "forbidden",
      );

      const viewerBrief = buildContactBrief(contact.contact_id, VIEWER);
      assert.ok(viewerBrief);
    } finally {
      shutdownApp();
    }
  });
});
