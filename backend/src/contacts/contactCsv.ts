import type {
  ContactImportCommitInput,
  ContactImportCommitResult,
  ContactImportCommitRowResult,
  ContactImportDuplicatePolicy,
  ContactImportPreviewInput,
  ContactImportPreviewResult,
  ContactImportPreviewRow,
  ContactImportRowAction,
  ContactListFilter,
  ContactOutreachStatus,
  ContactRecordWithAffiliations,
  CreateContactInput,
  UpdateContactInput,
} from "@localbrain/shared";
import { CONTACT_CSV_HEADERS, CONTACT_CSV_VERSION } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { createContact, getContactById, listContacts, updateContact } from "./contactRepository.js";
import { normalizeEmail } from "./contactSerde.js";
import { ContactValidationError } from "./contactValidator.js";

type ParsedCsvRow = {
  row_number: number;
  contact_id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tags: string[];
  notes: string;
  outreach_status: ContactOutreachStatus;
  archived: boolean;
};

function stripBom(text: string): string {
  return text.replace(/^\uFEFF/, "");
}

/** RFC 4180-style CSV parser — no external dependency. */
export function parseCsvRecords(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = stripBom(text);

  for (let i = 0; i < src.length; i++) {
    const c = src[i]!;
    const next = src[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r" && next === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
    } else if (c === "\n" || c === "\r") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim().length > 0));
}

export function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function serializeContactsCsv(contacts: readonly ContactRecordWithAffiliations[]): string {
  const header = CONTACT_CSV_HEADERS.join(",");
  const lines = contacts.map((contact) => {
    const values = [
      contact.contact_id,
      contact.display_name,
      contact.first_name ?? "",
      contact.last_name ?? "",
      contact.emails[0]?.email ?? "",
      contact.phones[0]?.phone ?? "",
      contact.tags.join("|"),
      contact.notes,
      contact.outreach_status,
      contact.archived ? "true" : "false",
    ];
    return values.map((value) => escapeCsvField(String(value))).join(",");
  });
  return [header, ...lines].join("\r\n");
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseTags(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  return [...new Set(trimmed.split(/[|;]/).map((tag) => tag.trim()).filter(Boolean))];
}

function parseArchived(raw: string): boolean {
  const value = raw.trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}

function parseOutreachStatus(raw: string): ContactOutreachStatus {
  const value = raw.trim().toLowerCase();
  if (value === "queued" || value === "sent" || value === "replied") {
    return value;
  }
  return "none";
}

function headerIndex(headers: string[], name: string): number {
  const normalized = normalizeHeader(name);
  return headers.findIndex((header) => normalizeHeader(header) === normalized);
}

function cellValue(cells: string[], index: number): string {
  if (index < 0) return "";
  return (cells[index] ?? "").trim();
}

function parseDataRows(csvText: string): ParsedCsvRow[] {
  const records = parseCsvRecords(csvText);
  if (records.length === 0) return [];

  const headerRow = records[0]!.map((cell) => cell.trim());
  const displayNameIdx = headerIndex(headerRow, "display_name");
  if (displayNameIdx < 0) {
    throw new ContactValidationError("invalid_csv", "CSV must include a display_name column");
  }

  const rows: ParsedCsvRow[] = [];
  for (let i = 1; i < records.length; i++) {
    const cells = records[i]!;
    rows.push({
      row_number: i + 1,
      contact_id: cellValue(cells, headerIndex(headerRow, "contact_id")),
      display_name: cellValue(cells, displayNameIdx),
      first_name: cellValue(cells, headerIndex(headerRow, "first_name")),
      last_name: cellValue(cells, headerIndex(headerRow, "last_name")),
      email: cellValue(cells, headerIndex(headerRow, "email")),
      phone: cellValue(cells, headerIndex(headerRow, "phone")),
      tags: parseTags(cellValue(cells, headerIndex(headerRow, "tags"))),
      notes: cellValue(cells, headerIndex(headerRow, "notes")),
      outreach_status: parseOutreachStatus(
        cellValue(cells, headerIndex(headerRow, "outreach_status")),
      ),
      archived: parseArchived(cellValue(cells, headerIndex(headerRow, "archived"))),
    });
  }

  return rows;
}

function buildEmailIndex(
  workspaceId: string,
): Map<string, { contact_id: string; display_name: string }> {
  const contacts = listContacts({ workspace_id: workspaceId, include_archived: true });
  const index = new Map<string, { contact_id: string; display_name: string }>();
  for (const contact of contacts) {
    for (const entry of contact.emails) {
      index.set(normalizeEmail(entry.email), {
        contact_id: contact.contact_id,
        display_name: contact.display_name,
      });
    }
  }
  return index;
}

function isValidImportEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed.includes("@")) return false;
  const [, domain] = trimmed.split("@");
  return Boolean(domain && domain.includes("."));
}

function validateParsedRow(row: ParsedCsvRow): string[] {
  const errors: string[] = [];
  if (!row.display_name.trim()) {
    errors.push("display_name is required");
  }
  if (row.email && !isValidImportEmail(row.email)) {
    errors.push("email is not valid");
  }
  return errors;
}

function emailBelongsToOtherContact(
  emailIndex: Map<string, { contact_id: string; display_name: string }>,
  normalizedEmail: string,
  contactId: string,
): boolean {
  const match = emailIndex.get(normalizedEmail);
  return Boolean(match && match.contact_id !== contactId);
}

function resolveRowAction(options: {
  workspaceId: string;
  row: ParsedCsvRow;
  duplicate_policy: ContactImportDuplicatePolicy;
  emailIndex: Map<string, { contact_id: string; display_name: string }>;
  fileEmailCounts: Map<string, number>;
}): ContactImportPreviewRow {
  const errors = validateParsedRow(options.row);
  const warnings: string[] = [];
  let existing_contact_id: string | null = null;

  const normalizedEmail = options.row.email ? normalizeEmail(options.row.email) : "";
  if (normalizedEmail) {
    const fileCount = options.fileEmailCounts.get(normalizedEmail) ?? 0;
    if (fileCount > 1) {
      errors.push("duplicate email within CSV file");
    }
    const existingByEmail = options.emailIndex.get(normalizedEmail);
    if (existingByEmail) {
      existing_contact_id = existingByEmail.contact_id;
    }
  }

  if (options.row.contact_id) {
    const byId = getContactById(options.row.contact_id);
    if (!byId) {
      if (!existing_contact_id) {
        errors.push("contact_id not found in workspace");
      } else {
        warnings.push("contact_id not found — matched by email instead");
      }
    } else if (byId.workspace_id !== options.workspaceId) {
      errors.push("contact_id belongs to another workspace");
    } else {
      existing_contact_id = byId.contact_id;
      if (normalizedEmail && emailBelongsToOtherContact(options.emailIndex, normalizedEmail, byId.contact_id)) {
        errors.push("email belongs to a different existing contact");
      }
    }
  }

  let action: ContactImportRowAction = "create";
  if (errors.length > 0) {
    action = "error";
  } else if (existing_contact_id) {
    if (options.duplicate_policy === "skip") {
      action = "skip";
    } else if (options.duplicate_policy === "update") {
      action = "update";
    } else {
      action = "error";
      errors.push(`duplicate email — existing contact ${existing_contact_id}`);
    }
  }

  return {
    row_number: options.row.row_number,
    action,
    display_name: options.row.display_name,
    email: options.row.email,
    existing_contact_id,
    errors,
    warnings,
  };
}

function buildPreviewRows(
  workspaceId: string,
  rows: ParsedCsvRow[],
  duplicate_policy: ContactImportDuplicatePolicy,
): ContactImportPreviewRow[] {
  const emailIndex = buildEmailIndex(workspaceId);
  const fileEmailCounts = new Map<string, number>();
  for (const row of rows) {
    if (!row.email) continue;
    const normalized = normalizeEmail(row.email);
    fileEmailCounts.set(normalized, (fileEmailCounts.get(normalized) ?? 0) + 1);
  }

  return rows.map((row) =>
    resolveRowAction({
      workspaceId,
      row,
      duplicate_policy,
      emailIndex,
      fileEmailCounts,
    }),
  );
}

function summarizePreview(rows: ContactImportPreviewRow[]): Omit<
  ContactImportPreviewResult,
  "engine_id" | "workspace_id" | "duplicate_policy" | "rows"
> {
  const create_count = rows.filter((row) => row.action === "create").length;
  const update_count = rows.filter((row) => row.action === "update").length;
  const skip_count = rows.filter((row) => row.action === "skip").length;
  const error_count = rows.filter((row) => row.action === "error").length;
  return {
    total_rows: rows.length,
    create_count,
    update_count,
    skip_count,
    error_count,
    can_commit: error_count === 0 && rows.some((row) => row.action === "create" || row.action === "update"),
  };
}

export function exportContactsCsv(filter: ContactListFilter): string {
  const contacts = listContacts(filter);
  return serializeContactsCsv(contacts);
}

export function previewContactImport(input: ContactImportPreviewInput): ContactImportPreviewResult {
  const workspace_id = input.workspace_id.trim();
  if (!workspace_id) {
    throw new ContactValidationError("required_field", "workspace_id is required");
  }

  const duplicate_policy = input.duplicate_policy ?? "error";
  const parsedRows = parseDataRows(input.csv_text);
  const rows = buildPreviewRows(workspace_id, parsedRows, duplicate_policy);
  const summary = summarizePreview(rows);

  return {
    engine_id: CONTACT_CSV_VERSION,
    workspace_id,
    duplicate_policy,
    rows,
    ...summary,
  };
}

function rowToCreateInput(workspaceId: string, row: ParsedCsvRow): CreateContactInput {
  return {
    workspace_id: workspaceId,
    display_name: row.display_name,
    first_name: row.first_name || undefined,
    last_name: row.last_name || undefined,
    emails: row.email ? [{ email: row.email, primary: true }] : [],
    phones: row.phone ? [{ phone: row.phone, primary: true }] : [],
    tags: row.tags,
    notes: row.notes,
    outreach_status: row.outreach_status,
  };
}

function rowToUpdateInput(row: ParsedCsvRow): UpdateContactInput {
  return {
    display_name: row.display_name,
    first_name: row.first_name || null,
    last_name: row.last_name || null,
    emails: row.email ? [{ email: row.email, primary: true }] : [],
    phones: row.phone ? [{ phone: row.phone, primary: true }] : [],
    tags: row.tags,
    notes: row.notes,
    outreach_status: row.outreach_status,
  };
}

function setArchivedFlag(contactId: string, archived: boolean): void {
  getDatabase()
    .prepare("UPDATE contacts SET archived = ?, updated_at = datetime('now') WHERE contact_id = ?")
    .run(archived ? 1 : 0, contactId);
}

function applyImportRow(
  workspaceId: string,
  parsedRow: ParsedCsvRow,
  previewRow: ContactImportPreviewRow,
): ContactImportCommitRowResult {
  if (previewRow.action === "skip") {
    return {
      row_number: previewRow.row_number,
      action: "skipped",
      contact_id: previewRow.existing_contact_id,
      message: "Skipped duplicate per policy",
    };
  }

  try {
    if (previewRow.action === "create") {
      const created = createContact(rowToCreateInput(workspaceId, parsedRow));
      if (parsedRow.archived) {
        setArchivedFlag(created.contact_id, true);
      }
      return {
        row_number: previewRow.row_number,
        action: "created",
        contact_id: created.contact_id,
        message: "Contact created",
      };
    }

    if (previewRow.action === "update" && previewRow.existing_contact_id) {
      const updated = updateContact(previewRow.existing_contact_id, rowToUpdateInput(parsedRow));
      if (!updated) {
        return {
          row_number: previewRow.row_number,
          action: "failed",
          contact_id: previewRow.existing_contact_id,
          message: "Existing contact not found during commit",
        };
      }
      setArchivedFlag(updated.contact_id, parsedRow.archived);
      return {
        row_number: previewRow.row_number,
        action: "updated",
        contact_id: updated.contact_id,
        message: "Contact updated",
      };
    }

    return {
      row_number: previewRow.row_number,
      action: "failed",
      contact_id: null,
      message: "Row was not eligible for commit",
    };
  } catch (error) {
    return {
      row_number: previewRow.row_number,
      action: "failed",
      contact_id: previewRow.existing_contact_id,
      message: error instanceof Error ? error.message : "Import row failed",
    };
  }
}

export function commitContactImport(input: ContactImportCommitInput): ContactImportCommitResult {
  const workspace_id = input.workspace_id.trim();
  if (!workspace_id) {
    throw new ContactValidationError("required_field", "workspace_id is required");
  }

  const duplicate_policy = input.duplicate_policy ?? "error";
  const parsedRows = parseDataRows(input.csv_text);
  const previewRows = buildPreviewRows(workspace_id, parsedRows, duplicate_policy);
  const preview = summarizePreview(previewRows);

  if (!preview.can_commit) {
    throw new ContactValidationError(
      "import_blocked",
      "Import blocked — fix validation errors before commit",
    );
  }

  const parsedByRowNumber = new Map(parsedRows.map((row) => [row.row_number, row]));

  const applyAll = getDatabase().transaction(() => {
    const results: ContactImportCommitRowResult[] = [];
    for (const previewRow of previewRows) {
      if (previewRow.action === "error") continue;
      const parsedRow = parsedByRowNumber.get(previewRow.row_number);
      if (!parsedRow) continue;
      results.push(applyImportRow(workspace_id, parsedRow, previewRow));
    }
    return results;
  });

  const rows = applyAll();
  return {
    engine_id: CONTACT_CSV_VERSION,
    workspace_id,
    duplicate_policy,
    created_count: rows.filter((row) => row.action === "created").length,
    updated_count: rows.filter((row) => row.action === "updated").length,
    skipped_count: rows.filter((row) => row.action === "skipped").length,
    failed_count: rows.filter((row) => row.action === "failed").length,
    rows,
  };
}
