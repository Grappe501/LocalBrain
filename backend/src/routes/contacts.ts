import { Router } from "express";
import type { CreateContactInput, UpdateContactInput } from "@localbrain/shared";
import {
  archiveContact,
  createContact,
  createContactOrganization,
  getContactById,
  linkContactToOrganization,
  listContactOrganizations,
  listContacts,
  restoreContact,
  updateContact,
  ContactDuplicateEmailError,
} from "../contacts/contactRepository.js";
import { ContactValidationError } from "../contacts/contactValidator.js";

export const contactsRouter = Router();

const ENGINE_ID = "ENG-CONTACT-001.2";
const SLICE_ID = "ENG-CONTACT-001.2";

function resolveWorkspaceId(queryValue: unknown, bodyValue: unknown): string | null {
  const candidate =
    (typeof queryValue === "string" && queryValue.trim()) ||
    (typeof bodyValue === "string" && bodyValue.trim()) ||
    "";
  return candidate || null;
}

function mapContactError(error: unknown, res: import("express").Response): boolean {
  if (error instanceof ContactDuplicateEmailError) {
    res.status(409).json({
      error: "duplicate_email",
      message: error.message,
      email: error.email,
      existing_contact_id: error.existing_contact_id,
    });
    return true;
  }
  if (error instanceof ContactValidationError) {
    res.status(400).json({ error: error.code, message: error.message });
    return true;
  }
  return false;
}

contactsRouter.get("/contacts/organizations/list", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  const include_archived = req.query.include_archived === "true";
  res.json({
    slice_id: SLICE_ID,
    engine_id: ENGINE_ID,
    workspace_id,
    organizations: listContactOrganizations(workspace_id, { include_archived }),
  });
});

contactsRouter.post("/contacts/organizations", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  try {
    const organization = createContactOrganization({
      workspace_id,
      name: req.body?.name ?? "",
    });
    res.status(201).json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, organization });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, undefined);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  const contacts = listContacts({
    workspace_id,
    include_archived: req.query.include_archived === "true",
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    tag: typeof req.query.tag === "string" ? req.query.tag : undefined,
    email: typeof req.query.email === "string" ? req.query.email : undefined,
  });

  res.json({
    slice_id: SLICE_ID,
    engine_id: ENGINE_ID,
    workspace_id,
    count: contacts.length,
    contacts,
  });
});

contactsRouter.post("/contacts", (req, res) => {
  const workspace_id = resolveWorkspaceId(req.query.workspace_id, req.body?.workspace_id);
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }

  try {
    const input: CreateContactInput = {
      workspace_id,
      display_name: req.body?.display_name ?? "",
      first_name: req.body?.first_name,
      last_name: req.body?.last_name,
      emails: req.body?.emails,
      phones: req.body?.phones,
      addresses: req.body?.addresses,
      tags: req.body?.tags,
      notes: req.body?.notes,
      outreach_status: req.body?.outreach_status,
    };
    let contact = createContact(input);

    if (req.body?.organization_id) {
      const linked = linkContactToOrganization({
        contact_id: contact.contact_id,
        organization_id: req.body.organization_id,
        role_label: req.body.role_label,
      });
      if (linked) contact = linked;
    }

    res.status(201).json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.get("/contacts/:id", (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
});

contactsRouter.patch("/contacts/:id", (req, res) => {
  try {
    const input: UpdateContactInput = {
      display_name: req.body?.display_name,
      first_name: req.body?.first_name,
      last_name: req.body?.last_name,
      emails: req.body?.emails,
      phones: req.body?.phones,
      addresses: req.body?.addresses,
      tags: req.body?.tags,
      notes: req.body?.notes,
      outreach_status: req.body?.outreach_status,
    };
    const contact = updateContact(req.params.id, input);
    if (!contact) {
      res.status(404).json({ error: "contact_not_found" });
      return;
    }
    res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
  } catch (error) {
    if (mapContactError(error, res)) return;
    throw error;
  }
});

contactsRouter.post("/contacts/:id/archive", (req, res) => {
  const contact = archiveContact(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
});

contactsRouter.post("/contacts/:id/restore", (req, res) => {
  const contact = restoreContact(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "contact_not_found" });
    return;
  }
  res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
});

contactsRouter.post("/contacts/:id/affiliations", (req, res) => {
  const organization_id = req.body?.organization_id;
  if (!organization_id || typeof organization_id !== "string") {
    res.status(400).json({ error: "organization_id is required" });
    return;
  }

  const contact = linkContactToOrganization({
    contact_id: req.params.id,
    organization_id,
    role_label: req.body?.role_label,
  });
  if (!contact) {
    res.status(404).json({ error: "contact_or_organization_not_found" });
    return;
  }
  res.json({ slice_id: SLICE_ID, engine_id: ENGINE_ID, contact });
});
