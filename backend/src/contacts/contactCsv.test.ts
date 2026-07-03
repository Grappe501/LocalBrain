import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { CONTACT_CSV_HEADERS } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { createContact, listContacts } from "./contactRepository.js";
import {
  commitContactImport,
  exportContactsCsv,
  parseCsvRecords,
  previewContactImport,
  serializeContactsCsv,
} from "./contactCsv.js";
import { ContactValidationError } from "./contactValidator.js";

const WORKSPACE = `localbrain-csv-${crypto.randomUUID().slice(0, 8)}`;

function workspaceSuffix(): string {
  return crypto.randomUUID().slice(0, 8);
}

const SAMPLE_HEADER = CONTACT_CSV_HEADERS.join(",");

test("parseCsvRecords handles quoted commas and round-trip fields", () => {
  const csv = 'display_name,notes\n"Smith, Kelly","Line one\nLine two"';
  const rows = parseCsvRecords(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[1]?.[0], "Smith, Kelly");
  assert.equal(rows[1]?.[1], "Line one\nLine two");
});

test("export and import preview round-trip without data loss", () => {
  bootstrapApp();
  const workspace = `${WORKSPACE}-roundtrip-${workspaceSuffix()}`;
  try {
    createContact({
      workspace_id: workspace,
      display_name: "CSV Round Trip",
      first_name: "CSV",
      last_name: "Trip",
      emails: [{ email: "csv.roundtrip@example.com", primary: true }],
      phones: [{ phone: "501-555-0199", primary: true }],
      tags: ["donor", "board"],
      notes: "Exported then re-imported",
      outreach_status: "queued",
    });

    const exported = exportContactsCsv({ workspace_id: workspace });
    assert.ok(exported.startsWith(SAMPLE_HEADER));
    assert.ok(exported.includes("csv.roundtrip@example.com"));
    assert.ok(exported.includes("donor|board"));

    const preview = previewContactImport({
      workspace_id: workspace,
      csv_text: exported,
      duplicate_policy: "error",
    });
    assert.equal(preview.total_rows, 1);
    assert.equal(preview.error_count, 1);
    assert.equal(preview.rows[0]?.action, "error");

    const updatePreview = previewContactImport({
      workspace_id: workspace,
      csv_text: exported,
      duplicate_policy: "update",
    });
    assert.equal(updatePreview.update_count, 1);
    assert.equal(updatePreview.can_commit, true);
  } finally {
    shutdownApp();
  }
});

test("import preview validates required display_name and invalid email", () => {
  bootstrapApp();
  const workspace = `${WORKSPACE}-validate-${workspaceSuffix()}`;
  try {
    assert.throws(
      () =>
        previewContactImport({
          workspace_id: workspace,
          csv_text: "email\nonly@example.com",
        }),
      (error: unknown) => error instanceof ContactValidationError,
    );

    const preview = previewContactImport({
      workspace_id: workspace,
      csv_text: `${SAMPLE_HEADER}
,,,,not-an-email,,,notes,none,false`,
    });
    assert.equal(preview.error_count, 1);
    assert.ok(preview.rows[0]?.errors.some((message) => message.includes("email")));

    const missingNamePreview = previewContactImport({
      workspace_id: workspace,
      csv_text: `${SAMPLE_HEADER}
,,,,person@example.com,,,notes,none,false`,
    });
    assert.equal(missingNamePreview.error_count, 1);
    assert.ok(missingNamePreview.rows[0]?.errors.some((message) => message.includes("display_name")));
  } finally {
    shutdownApp();
  }
});

test("import commit creates rows and reports duplicates with skip policy", () => {
  bootstrapApp();
  const workspace = `${WORKSPACE}-commit-${workspaceSuffix()}`;
  try {
    createContact({
      workspace_id: workspace,
      display_name: "Existing Person",
      emails: [{ email: "existing@example.com" }],
    });

    const csv = `${SAMPLE_HEADER}
,New Person,,,new@example.com,501-555-0101,donor,Fresh import,none,false
,Duplicate Person,,,existing@example.com,,,Should skip,none,false`;

    const preview = previewContactImport({
      workspace_id: workspace,
      csv_text: csv,
      duplicate_policy: "skip",
    });
    assert.equal(preview.create_count, 1);
    assert.equal(preview.skip_count, 1);
    assert.equal(preview.can_commit, true);

    const result = commitContactImport({
      workspace_id: workspace,
      csv_text: csv,
      duplicate_policy: "skip",
    });
    assert.equal(result.created_count, 1);
    assert.equal(result.skipped_count, 1);
    assert.equal(result.failed_count, 0);

    const contacts = listContacts({ workspace_id: workspace, email: "new@example.com" });
    assert.equal(contacts.length, 1);
    assert.equal(contacts[0]?.display_name, "New Person");
    assert.deepEqual(contacts[0]?.tags, ["donor"]);
  } finally {
    shutdownApp();
  }
});

test("import commit blocked when preview has errors under error policy", () => {
  bootstrapApp();
  const workspace = `${WORKSPACE}-blocked-${workspaceSuffix()}`;
  try {
    createContact({
      workspace_id: workspace,
      display_name: "Block Test",
      emails: [{ email: "block@example.com" }],
    });

    const csv = `${SAMPLE_HEADER}
,Another,,,block@example.com,,,Dup,none,false`;

    assert.throws(
      () =>
        commitContactImport({
          workspace_id: workspace,
          csv_text: csv,
          duplicate_policy: "error",
        }),
      (error: unknown) => error instanceof ContactValidationError,
    );
  } finally {
    shutdownApp();
  }
});

test("serializeContactsCsv escapes commas in display names", () => {
  bootstrapApp();
  const workspace = `${WORKSPACE}-escape-${workspaceSuffix()}`;
  try {
    createContact({
      workspace_id: workspace,
      display_name: "Allen, Chris",
      emails: [{ email: "chris@example.com" }],
    });
    const csv = exportContactsCsv({ workspace_id: workspace });
    assert.ok(csv.includes('"Allen, Chris"'));
    const roundTrip = parseCsvRecords(csv);
    assert.ok(roundTrip.some((row) => row.includes("Allen, Chris")));
  } finally {
    shutdownApp();
  }
});
