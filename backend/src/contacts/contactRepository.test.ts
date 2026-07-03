import crypto from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { CONTACT_RECORD_VERSION } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import {
  archiveContact,
  createContact,
  createContactOrganization,
  getContactById,
  linkContactToOrganization,
  listContacts,
  listContactOrganizations,
  restoreContact,
  updateContact,
  ContactDuplicateEmailError,
} from "./contactRepository.js";
import { ContactValidationError } from "./contactValidator.js";
import {
  parseAddressesJson,
  parseEmailsJson,
  parsePhonesJson,
  parseTagsJson,
  serializeAddresses,
  serializeEmails,
  serializePhones,
  serializeTags,
} from "./contactSerde.js";

const WORKSPACE = `localbrain-contact-${crypto.randomUUID().slice(0, 8)}`;

test("contact contract version is ENG-CONTACT-001.1", () => {
  assert.equal(CONTACT_RECORD_VERSION, "ENG-CONTACT-001.1");
});

test("contact serde round-trips structured fields", () => {
  const emails = serializeEmails([{ email: "Kelly@Example.com", primary: true }]);
  const phones = serializePhones([{ phone: "+1 501 555 0100", label: "mobile" }]);
  const addresses = serializeAddresses([{ city: "Little Rock", state: "AR" }]);
  const tags = serializeTags(["donor", "board"]);

  assert.deepEqual(parseEmailsJson(emails), [{ email: "Kelly@Example.com", primary: true }]);
  assert.deepEqual(parsePhonesJson(phones), [{ phone: "+1 501 555 0100", label: "mobile" }]);
  assert.deepEqual(parseAddressesJson(addresses), [{ city: "Little Rock", state: "AR" }]);
  assert.deepEqual(parseTagsJson(tags), ["donor", "board"]);
});

test("create read update archive contact round-trip", () => {
  bootstrapApp();
  try {
    const created = createContact({
      workspace_id: WORKSPACE,
      display_name: "Kelly Smith",
      first_name: "Kelly",
      last_name: "Smith",
      emails: [{ email: "kelly@example.com", primary: true }],
      phones: [{ phone: "501-555-0100" }],
      tags: ["donor"],
      notes: "Met at fundraiser",
      outreach_status: "none",
    });

    assert.ok(created.contact_id);
    assert.equal(created.display_name, "Kelly Smith");
    assert.equal(created.emails[0]?.email, "kelly@example.com");
    assert.equal(created.archived, false);

    const updated = updateContact(created.contact_id, {
      outreach_status: "queued",
      notes: "Follow up after briefing",
    });
    assert.ok(updated);
    assert.equal(updated?.outreach_status, "queued");
    assert.equal(updated?.notes, "Follow up after briefing");

    const archived = archiveContact(created.contact_id);
    assert.ok(archived);
    assert.equal(archived?.archived, true);

    const activeOnly = listContacts({ workspace_id: WORKSPACE });
    assert.equal(activeOnly.some((c) => c.contact_id === created.contact_id), false);

    const withArchived = listContacts({ workspace_id: WORKSPACE, include_archived: true });
    assert.equal(withArchived.some((c) => c.contact_id === created.contact_id), true);
  } finally {
    shutdownApp();
  }
});

test("duplicate email within workspace is rejected", () => {
  bootstrapApp();
  try {
    const first = createContact({
      workspace_id: WORKSPACE,
      display_name: "Chris Allen",
      emails: [{ email: "chris@example.com" }],
    });

    assert.throws(
      () =>
        createContact({
          workspace_id: WORKSPACE,
          display_name: "Chris Duplicate",
          emails: [{ email: "Chris@Example.com" }],
        }),
      (error: unknown) => {
        assert.ok(error instanceof ContactDuplicateEmailError);
        assert.equal(error.existing_contact_id, first.contact_id);
        return true;
      },
    );

    assert.doesNotThrow(() =>
      updateContact(first.contact_id, {
        emails: [{ email: "chris@example.com" }, { email: "chris.alt@example.com" }],
      }),
    );
  } finally {
    shutdownApp();
  }
});

test("organization affiliation links persist on read", () => {
  bootstrapApp();
  try {
    const org = createContactOrganization({
      workspace_id: WORKSPACE,
      name: "Stand Up Arkansas",
    });
    const contact = createContact({
      workspace_id: WORKSPACE,
      display_name: "Network Lead",
      emails: [{ email: "lead@example.org" }],
    });

    const linked = linkContactToOrganization({
      contact_id: contact.contact_id,
      organization_id: org.organization_id,
      role_label: "Board liaison",
    });
    assert.ok(linked);
    assert.equal(linked?.affiliations.length, 1);
    assert.equal(linked?.affiliations[0]?.organization_name, "Stand Up Arkansas");
    assert.equal(linked?.affiliations[0]?.role_label, "Board liaison");

    const reloaded = getContactById(contact.contact_id);
    assert.equal(reloaded?.affiliations[0]?.organization_id, org.organization_id);
  } finally {
    shutdownApp();
  }
});

test("listContacts filters by search tag and email", () => {
  bootstrapApp();
  try {
    createContact({
      workspace_id: WORKSPACE,
      display_name: "Filter Alpha",
      emails: [{ email: "alpha@example.com" }],
      tags: ["partner"],
    });
    createContact({
      workspace_id: WORKSPACE,
      display_name: "Filter Beta",
      emails: [{ email: "beta@example.com" }],
      tags: ["vendor"],
    });

    const byTag = listContacts({ workspace_id: WORKSPACE, tag: "partner" });
    assert.equal(byTag.length, 1);
    assert.equal(byTag[0]?.display_name, "Filter Alpha");

    const byEmail = listContacts({ workspace_id: WORKSPACE, email: "beta@example.com" });
    assert.equal(byEmail.length, 1);
    assert.equal(byEmail[0]?.display_name, "Filter Beta");

    const bySearch = listContacts({ workspace_id: WORKSPACE, search: "alpha" });
    assert.equal(bySearch.length, 1);
  } finally {
    shutdownApp();
  }
});

test("archive and restore contact", () => {
  bootstrapApp();
  try {
    const created = createContact({
      workspace_id: WORKSPACE,
      display_name: "Restore Me",
      emails: [{ email: "restore@example.com" }],
    });

    const archived = archiveContact(created.contact_id);
    assert.ok(archived?.archived);

    const restored = restoreContact(created.contact_id);
    assert.ok(restored);
    assert.equal(restored?.archived, false);
  } finally {
    shutdownApp();
  }
});

test("listContactOrganizations returns workspace orgs", () => {
  bootstrapApp();
  try {
    createContactOrganization({ workspace_id: WORKSPACE, name: "Org A" });
    const orgs = listContactOrganizations(WORKSPACE);
    assert.ok(orgs.some((org) => org.name === "Org A"));
  } finally {
    shutdownApp();
  }
});

test("validation rejects empty display name", () => {
  bootstrapApp();
  try {
    assert.throws(
      () =>
        createContact({
          workspace_id: WORKSPACE,
          display_name: "   ",
        }),
      (error: unknown) => error instanceof ContactValidationError,
    );
  } finally {
    shutdownApp();
  }
});
