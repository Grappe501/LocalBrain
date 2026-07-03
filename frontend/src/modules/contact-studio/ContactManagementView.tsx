import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ContactDraftLink,
  ContactImportPreviewResult,
  ContactOrganization,
  ContactOutreachAuditEntry,
  ContactRecordWithAffiliations,
} from "@localbrain/shared";
import {
  OUTREACH_STATUS_OPTIONS,
  type ContactImportDuplicatePolicy,
  archiveContactApi,
  commitContactImportApi,
  createContactApi,
  createContactOrganizationApi,
  exportContactsCsv,
  fetchContactDrafts,
  fetchContactOrganizations,
  fetchContactOutreachAudit,
  fetchContacts,
  generateContactLinkedDraftApi,
  linkContactAffiliationApi,
  previewContactImportApi,
  restoreContactApi,
  updateContactApi,
  updateContactOutreachApi,
} from "../../api/contacts";

const WORKSPACE_ID = "localbrain";

type FormState = {
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tags: string;
  notes: string;
  outreach_status: (typeof OUTREACH_STATUS_OPTIONS)[number];
};

const EMPTY_FORM: FormState = {
  display_name: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  tags: "",
  notes: "",
  outreach_status: "none",
};

function formFromContact(contact: ContactRecordWithAffiliations): FormState {
  return {
    display_name: contact.display_name,
    first_name: contact.first_name ?? "",
    last_name: contact.last_name ?? "",
    email: contact.emails[0]?.email ?? "",
    phone: contact.phones[0]?.phone ?? "",
    tags: contact.tags.join(", "),
    notes: contact.notes,
    outreach_status: contact.outreach_status,
  };
}

function payloadFromForm(form: FormState) {
  return {
    display_name: form.display_name.trim(),
    first_name: form.first_name.trim() || undefined,
    last_name: form.last_name.trim() || undefined,
    emails: form.email.trim() ? [{ email: form.email.trim(), primary: true }] : [],
    phones: form.phone.trim() ? [{ phone: form.phone.trim(), primary: true }] : [],
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    notes: form.notes.trim(),
    outreach_status: form.outreach_status,
  };
}

export function ContactManagementView() {
  const [contacts, setContacts] = useState<ContactRecordWithAffiliations[]>([]);
  const [organizations, setOrganizations] = useState<ContactOrganization[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newOrgName, setNewOrgName] = useState("");
  const [linkOrgId, setLinkOrgId] = useState("");
  const [linkRole, setLinkRole] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState("");
  const [duplicatePolicy, setDuplicatePolicy] = useState<ContactImportDuplicatePolicy>("error");
  const [importPreview, setImportPreview] = useState<ContactImportPreviewResult | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [linkedDrafts, setLinkedDrafts] = useState<ContactDraftLink[]>([]);
  const [outreachAudit, setOutreachAudit] = useState<ContactOutreachAuditEntry[]>([]);
  const [outreachNote, setOutreachNote] = useState("");
  const [draftIntent, setDraftIntent] = useState("");
  const [draftAudience, setDraftAudience] = useState("");

  const selected = useMemo(
    () => contacts.find((contact) => contact.contact_id === selectedId) ?? null,
    [contacts, selectedId],
  );

  const loadContactDrafts = useCallback(async (contactId: string) => {
    try {
      const [{ drafts }, { audit }] = await Promise.all([
        fetchContactDrafts(contactId),
        fetchContactOutreachAudit(contactId),
      ]);
      setLinkedDrafts(drafts);
      setOutreachAudit(audit);
    } catch {
      setLinkedDrafts([]);
      setOutreachAudit([]);
    }
  }, []);

  useEffect(() => {
    if (selectedId && !creating) {
      void loadContactDrafts(selectedId);
    } else {
      setLinkedDrafts([]);
      setOutreachAudit([]);
    }
  }, [selectedId, creating, loadContactDrafts]);

  const loadContacts = useCallback(async () => {
    try {
      setError(null);
      const rows = await fetchContacts({
        workspace_id: WORKSPACE_ID,
        search: search.trim() || undefined,
        tag: tagFilter.trim() || undefined,
        include_archived: includeArchived,
      });
      setContacts(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [search, tagFilter, includeArchived]);

  const loadOrganizations = useCallback(async () => {
    try {
      setOrganizations(await fetchContactOrganizations(WORKSPACE_ID));
    } catch {
      setOrganizations([]);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  useEffect(() => {
    if (creating) {
      setForm(EMPTY_FORM);
      return;
    }
    if (selected) {
      setForm(formFromContact(selected));
    }
  }, [selected, creating]);

  function beginCreate() {
    setCreating(true);
    setSelectedId(null);
    setForm(EMPTY_FORM);
  }

  function selectContact(contactId: string) {
    setCreating(false);
    setSelectedId(contactId);
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = payloadFromForm(form);
      if (creating) {
        const created = await createContactApi({
          workspace_id: WORKSPACE_ID,
          ...payload,
        });
        setCreating(false);
        setSelectedId(created.contact_id);
      } else if (selectedId) {
        await updateContactApi(selectedId, payload);
      } else {
        return;
      }
      await loadContacts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleArchiveToggle() {
    if (!selectedId || !selected) return;
    setSaving(true);
    setError(null);
    try {
      if (selected.archived) {
        await restoreContactApi(selectedId);
      } else {
        await archiveContactApi(selectedId);
      }
      await loadContacts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Archive action failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateOrganization() {
    if (!newOrgName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const org = await createContactOrganizationApi({
        workspace_id: WORKSPACE_ID,
        name: newOrgName.trim(),
      });
      setNewOrgName("");
      setLinkOrgId(org.organization_id);
      await loadOrganizations();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Organization create failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleExportCsv() {
    setSaving(true);
    setError(null);
    try {
      const csv = await exportContactsCsv({
        workspace_id: WORKSPACE_ID,
        include_archived: includeArchived,
        search: search.trim() || undefined,
        tag: tagFilter.trim() || undefined,
      });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `contacts-${WORKSPACE_ID}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
      setImportMessage("Contacts exported to CSV.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "CSV export failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleImportFile(file: File) {
    setError(null);
    setImportMessage(null);
    setImportPreview(null);
    try {
      const csv_text = await file.text();
      setImportCsvText(csv_text);
      setImportOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read CSV file");
    }
  }

  async function handleImportPreview() {
    if (!importCsvText.trim()) return;
    setSaving(true);
    setError(null);
    setImportMessage(null);
    try {
      const response = await previewContactImportApi({
        workspace_id: WORKSPACE_ID,
        csv_text: importCsvText,
        duplicate_policy: duplicatePolicy,
      });
      setImportPreview(response.preview);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import preview failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleImportCommit() {
    if (!importCsvText.trim() || !importPreview?.can_commit) return;
    setSaving(true);
    setError(null);
    try {
      const response = await commitContactImportApi({
        workspace_id: WORKSPACE_ID,
        csv_text: importCsvText,
        duplicate_policy: duplicatePolicy,
      });
      const { result } = response;
      setImportMessage(
        `Import complete — ${result.created_count} created, ${result.updated_count} updated, ${result.skipped_count} skipped, ${result.failed_count} failed.`,
      );
      setImportPreview(null);
      setImportCsvText("");
      setImportOpen(false);
      await loadContacts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import commit failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleOutreachUpdate() {
    if (!selectedId || !outreachNote.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await updateContactOutreachApi({
        contact_id: selectedId,
        outreach_status: form.outreach_status,
        note: outreachNote.trim(),
      });
      setOutreachNote("");
      await loadContacts();
      await loadContactDrafts(selectedId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Outreach update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateDraft() {
    if (!selectedId || !draftIntent.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await generateContactLinkedDraftApi({
        workspace_id: WORKSPACE_ID,
        contact_id: selectedId,
        intent_label: draftIntent.trim(),
        audience_label: draftAudience.trim() || undefined,
        use_fixture: true,
      });
      setDraftIntent("");
      setDraftAudience("");
      setImportMessage("Communications draft linked — advisory only, no send path.");
      await loadContactDrafts(selectedId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Draft generation failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleLinkOrganization() {
    if (!selectedId || !linkOrgId) return;
    setSaving(true);
    setError(null);
    try {
      await linkContactAffiliationApi({
        contact_id: selectedId,
        organization_id: linkOrgId,
        role_label: linkRole.trim() || undefined,
      });
      setLinkRole("");
      await loadContacts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Affiliation link failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="contact-dept">
      <header className="contact-dept__header">
        <h1>Contact Management</h1>
        <p className="contact-dept__meta">
          ENG-CONTACT-001.4 · workspace {WORKSPACE_ID} · COM draft linking · human outreach only
        </p>
      </header>

      {importMessage ? <p className="contact-dept__notice">{importMessage}</p> : null}

      {error ? <p className="contact-dept__error">{error}</p> : null}

      <div className="contact-dept__layout">
        <aside className="contact-dept__list-panel">
          <div className="contact-dept__toolbar">
            <button type="button" className="contact-dept__primary" onClick={beginCreate}>
              New contact
            </button>
            <button
              type="button"
              className="contact-dept__secondary"
              disabled={saving}
              onClick={() => void handleExportCsv()}
            >
              Export CSV
            </button>
            <label className="contact-dept__file-button">
              Import CSV
              <input
                type="file"
                accept=".csv,text/csv"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleImportFile(file);
                  event.target.value = "";
                }}
              />
            </label>
          </div>

          {importOpen ? (
            <section className="contact-dept__import">
              <h2>CSV import preview</h2>
              <label className="contact-dept__field">
                <span>Duplicate handling</span>
                <select
                  value={duplicatePolicy}
                  onChange={(event) =>
                    setDuplicatePolicy(event.target.value as ContactImportDuplicatePolicy)
                  }
                >
                  <option value="error">Block duplicates (safest)</option>
                  <option value="skip">Skip duplicates</option>
                  <option value="update">Update existing by email</option>
                </select>
              </label>
              <div className="contact-dept__actions">
                <button
                  type="button"
                  className="contact-dept__secondary"
                  disabled={saving || !importCsvText.trim()}
                  onClick={() => void handleImportPreview()}
                >
                  Preview import
                </button>
                <button
                  type="button"
                  className="contact-dept__primary"
                  disabled={saving || !importPreview?.can_commit}
                  onClick={() => void handleImportCommit()}
                >
                  Commit import
                </button>
                <button
                  type="button"
                  className="contact-dept__secondary"
                  onClick={() => {
                    setImportOpen(false);
                    setImportPreview(null);
                    setImportCsvText("");
                  }}
                >
                  Cancel
                </button>
              </div>
              {importPreview ? (
                <div className="contact-dept__import-report">
                  <p>
                    {importPreview.total_rows} rows · {importPreview.create_count} create ·{" "}
                    {importPreview.update_count} update · {importPreview.skip_count} skip ·{" "}
                    {importPreview.error_count} error
                  </p>
                  <ul>
                    {importPreview.rows.map((row) => (
                      <li key={row.row_number}>
                        Row {row.row_number}: {row.action} — {row.display_name || "(no name)"}
                        {row.email ? ` · ${row.email}` : ""}
                        {row.errors.length > 0 ? ` · ${row.errors.join("; ")}` : ""}
                        {row.warnings.length > 0 ? ` · ${row.warnings.join("; ")}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          <label className="contact-dept__field">
            <span>Search</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email, notes…"
            />
          </label>

          <label className="contact-dept__field">
            <span>Tag filter</span>
            <input
              type="text"
              value={tagFilter}
              onChange={(event) => setTagFilter(event.target.value)}
              placeholder="donor, board…"
            />
          </label>

          <label className="contact-dept__checkbox">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(event) => setIncludeArchived(event.target.checked)}
            />
            Show archived
          </label>

          {loading ? <p>Loading contacts…</p> : null}

          <ul className="contact-dept__list">
            {contacts.map((contact) => (
              <li key={contact.contact_id}>
                <button
                  type="button"
                  className={
                    contact.contact_id === selectedId && !creating
                      ? "contact-dept__list-item contact-dept__list-item--active"
                      : "contact-dept__list-item"
                  }
                  onClick={() => selectContact(contact.contact_id)}
                >
                  <strong>{contact.display_name}</strong>
                  <span>{contact.emails[0]?.email ?? "No email"}</span>
                  {contact.archived ? <em className="contact-dept__archived">Archived</em> : null}
                </button>
              </li>
            ))}
          </ul>
          {!loading && contacts.length === 0 ? (
            <p className="contact-dept__empty">No contacts match these filters.</p>
          ) : null}
        </aside>

        <section className="contact-dept__detail-panel">
          {!creating && !selected ? (
            <p className="contact-dept__empty">Select a contact or create a new one.</p>
          ) : (
            <form className="contact-dept__form" onSubmit={(event) => void handleSave(event)}>
              <h2>{creating ? "New contact" : selected?.display_name ?? "Contact"}</h2>

              <label className="contact-dept__field">
                <span>Display name</span>
                <input
                  required
                  value={form.display_name}
                  onChange={(event) => setForm({ ...form, display_name: event.target.value })}
                />
              </label>

              <div className="contact-dept__row">
                <label className="contact-dept__field">
                  <span>First name</span>
                  <input
                    value={form.first_name}
                    onChange={(event) => setForm({ ...form, first_name: event.target.value })}
                  />
                </label>
                <label className="contact-dept__field">
                  <span>Last name</span>
                  <input
                    value={form.last_name}
                    onChange={(event) => setForm({ ...form, last_name: event.target.value })}
                  />
                </label>
              </div>

              <label className="contact-dept__field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>

              <label className="contact-dept__field">
                <span>Phone</span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </label>

              <label className="contact-dept__field">
                <span>Tags (comma-separated)</span>
                <input
                  value={form.tags}
                  onChange={(event) => setForm({ ...form, tags: event.target.value })}
                />
              </label>

              <label className="contact-dept__field">
                <span>Outreach status</span>
                <select
                  value={form.outreach_status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      outreach_status: event.target.value as FormState["outreach_status"],
                    })
                  }
                >
                  {OUTREACH_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              {!creating && selected ? (
                <section className="contact-dept__affiliations">
                  <h3>Outreach audit</h3>
                  <label className="contact-dept__field">
                    <span>Audit note (required to update status)</span>
                    <textarea
                      rows={2}
                      value={outreachNote}
                      onChange={(event) => setOutreachNote(event.target.value)}
                      placeholder="Human-initiated outreach note — no automated send."
                    />
                  </label>
                  <button
                    type="button"
                    className="contact-dept__secondary"
                    disabled={saving || !outreachNote.trim()}
                    onClick={() => void handleOutreachUpdate()}
                  >
                    Update outreach status
                  </button>
                  {outreachAudit.length === 0 ? (
                    <p className="contact-dept__empty">No outreach audit entries yet.</p>
                  ) : (
                    <ul>
                      {outreachAudit.map((entry) => (
                        <li key={entry.audit_id}>
                          <strong>{entry.outreach_status}</strong> · {entry.note}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ) : null}

              {!creating && selected ? (
                <section className="contact-dept__affiliations">
                  <h3>Communications drafts</h3>
                  <p className="contact-dept__empty">
                    Contacts own people records. Communications owns drafts. Links connect them.
                  </p>
                  <label className="contact-dept__field">
                    <span>Draft intent</span>
                    <input
                      value={draftIntent}
                      onChange={(event) => setDraftIntent(event.target.value)}
                      placeholder="Board update…"
                    />
                  </label>
                  <label className="contact-dept__field">
                    <span>Audience (optional)</span>
                    <input
                      value={draftAudience}
                      onChange={(event) => setDraftAudience(event.target.value)}
                      placeholder="Board observers…"
                    />
                  </label>
                  <button
                    type="button"
                    className="contact-dept__secondary"
                    disabled={saving || !draftIntent.trim()}
                    onClick={() => void handleGenerateDraft()}
                  >
                    Generate linked draft
                  </button>
                  {linkedDrafts.length === 0 ? (
                    <p className="contact-dept__empty">No linked Communications drafts yet.</p>
                  ) : (
                    <ul>
                      {linkedDrafts.map((draft) => (
                        <li key={draft.link_id}>
                          <strong>{draft.intent_label}</strong>
                          {draft.audience_label ? ` · ${draft.audience_label}` : ""}
                          <div>{draft.body_preview}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ) : null}

              <label className="contact-dept__field">
                <span>Notes</span>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                />
              </label>

              {!creating && selected ? (
                <section className="contact-dept__affiliations">
                  <h3>Organizations</h3>
                  {selected.affiliations.length === 0 ? (
                    <p className="contact-dept__empty">No organization affiliations yet.</p>
                  ) : (
                    <ul>
                      {selected.affiliations.map((affiliation) => (
                        <li key={affiliation.organization_id}>
                          <strong>{affiliation.organization_name}</strong>
                          {affiliation.role_label ? ` · ${affiliation.role_label}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="contact-dept__row">
                    <label className="contact-dept__field">
                      <span>Link organization</span>
                      <select
                        value={linkOrgId}
                        onChange={(event) => setLinkOrgId(event.target.value)}
                      >
                        <option value="">Select…</option>
                        {organizations.map((org) => (
                          <option key={org.organization_id} value={org.organization_id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="contact-dept__field">
                      <span>Role</span>
                      <input
                        value={linkRole}
                        onChange={(event) => setLinkRole(event.target.value)}
                        placeholder="Board member…"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="contact-dept__secondary"
                    disabled={!linkOrgId || saving}
                    onClick={() => void handleLinkOrganization()}
                  >
                    Add affiliation
                  </button>

                  <div className="contact-dept__row">
                    <label className="contact-dept__field">
                      <span>New organization</span>
                      <input
                        value={newOrgName}
                        onChange={(event) => setNewOrgName(event.target.value)}
                        placeholder="Organization name"
                      />
                    </label>
                    <button
                      type="button"
                      className="contact-dept__secondary"
                      disabled={!newOrgName.trim() || saving}
                      onClick={() => void handleCreateOrganization()}
                    >
                      Create org
                    </button>
                  </div>
                </section>
              ) : null}

              <div className="contact-dept__actions">
                <button type="submit" className="contact-dept__primary" disabled={saving}>
                  {saving ? "Saving…" : creating ? "Create contact" : "Save changes"}
                </button>
                {!creating && selected ? (
                  <button
                    type="button"
                    className="contact-dept__secondary"
                    disabled={saving}
                    onClick={() => void handleArchiveToggle()}
                  >
                    {selected.archived ? "Restore contact" : "Archive contact"}
                  </button>
                ) : null}
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
