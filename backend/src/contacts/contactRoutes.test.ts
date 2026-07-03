import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import express from "express";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { contactsRouter } from "../routes/contacts.js";

const WORKSPACE = `localbrain-routes-${crypto.randomUUID().slice(0, 8)}`;

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api", contactsRouter);
  return app;
}

test("contacts API CRUD archive restore and filters", async () => {
  bootstrapApp();
  const app = createApp();
  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;
  const base = `http://127.0.0.1:${port}/api/contacts`;

  try {
    const orgRes = await fetch(`${base}/organizations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace_id: WORKSPACE, name: "Beta Org" }),
    });
    assert.equal(orgRes.status, 201);
    const orgBody = (await orgRes.json()) as { organization: { organization_id: string } };

    const createRes = await fetch(`${base}?workspace_id=${WORKSPACE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: WORKSPACE,
        display_name: "Route Test User",
        emails: [{ email: "route.test@example.com", primary: true }],
        tags: ["beta"],
        organization_id: orgBody.organization.organization_id,
        role_label: "Member",
      }),
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()) as {
      contact: { contact_id: string; affiliations: { organization_name: string }[] };
    };
    assert.equal(created.contact.affiliations[0]?.organization_name, "Beta Org");

    const listRes = await fetch(
      `${base}?workspace_id=${WORKSPACE}&search=Route&tag=beta`,
    );
    assert.equal(listRes.status, 200);
    const listBody = (await listRes.json()) as { count: number };
    assert.equal(listBody.count, 1);

    const getRes = await fetch(`${base}/${created.contact.contact_id}`);
    assert.equal(getRes.status, 200);

    const patchRes = await fetch(`${base}/${created.contact.contact_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "Updated via API", outreach_status: "queued" }),
    });
    assert.equal(patchRes.status, 200);
    const patched = (await patchRes.json()) as { contact: { notes: string; outreach_status: string } };
    assert.equal(patched.contact.notes, "Updated via API");
    assert.equal(patched.contact.outreach_status, "queued");

    const archiveRes = await fetch(`${base}/${created.contact.contact_id}/archive`, {
      method: "POST",
    });
    assert.equal(archiveRes.status, 200);
    const archived = (await archiveRes.json()) as { contact: { archived: boolean } };
    assert.equal(archived.contact.archived, true);

    const hiddenRes = await fetch(`${base}?workspace_id=${WORKSPACE}`);
    const hiddenBody = (await hiddenRes.json()) as { count: number };
    assert.equal(hiddenBody.count, 0);

    const restoreRes = await fetch(`${base}/${created.contact.contact_id}/restore`, {
      method: "POST",
    });
    assert.equal(restoreRes.status, 200);
    const restored = (await restoreRes.json()) as { contact: { archived: boolean } };
    assert.equal(restored.contact.archived, false);

    const dupRes = await fetch(`${base}?workspace_id=${WORKSPACE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: WORKSPACE,
        display_name: "Duplicate",
        emails: [{ email: "route.test@example.com" }],
      }),
    });
    assert.equal(dupRes.status, 409);
  } finally {
    server.close();
    shutdownApp();
  }
});

test("contacts organizations list requires workspace_id", async () => {
  bootstrapApp();
  const app = createApp();
  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/contacts/organizations/list`);
    assert.equal(res.status, 400);
  } finally {
    server.close();
    shutdownApp();
  }
});

test("contacts CSV export import preview and commit routes", async () => {
  bootstrapApp();
  const workspace = `${WORKSPACE}-csv-${crypto.randomUUID().slice(0, 8)}`;
  const app = createApp();
  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;
  const base = `http://127.0.0.1:${port}/api/contacts`;

  try {
    const createRes = await fetch(`${base}?workspace_id=${workspace}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: workspace,
        display_name: "CSV Route User",
        emails: [{ email: "csv.route@example.com" }],
        tags: ["import-test"],
      }),
    });
    assert.equal(createRes.status, 201);

    const exportRes = await fetch(`${base}/export.csv?workspace_id=${workspace}`);
    assert.equal(exportRes.status, 200);
    assert.match(exportRes.headers.get("content-type") ?? "", /text\/csv/);
    const exported = await exportRes.text();
    assert.ok(exported.includes("csv.route@example.com"));

    const previewRes = await fetch(`${base}/import/preview?workspace_id=${workspace}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: workspace,
        csv_text: exported,
        duplicate_policy: "update",
      }),
    });
    assert.equal(previewRes.status, 200);
    const previewBody = (await previewRes.json()) as {
      preview: { update_count: number; can_commit: boolean };
    };
    assert.equal(previewBody.preview.update_count, 1);
    assert.equal(previewBody.preview.can_commit, true);

    const importCsv = `${exported.split("\r\n")[0]}
,Fresh Import,,,fresh.import@example.com,501-555-0200,beta,From CSV,none,false`;

    const commitRes = await fetch(`${base}/import/commit?workspace_id=${workspace}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: workspace,
        csv_text: importCsv,
        duplicate_policy: "skip",
      }),
    });
    assert.equal(commitRes.status, 201);
    const commitBody = (await commitRes.json()) as { result: { created_count: number } };
    assert.equal(commitBody.result.created_count, 1);
  } finally {
    server.close();
    shutdownApp();
  }
});
