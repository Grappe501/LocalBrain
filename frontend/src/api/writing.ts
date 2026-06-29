import type {
  WritingDraftPreview,
  WritingOverview,
  WritingScore,
  WritingSourceFile,
} from "@localbrain/shared";

export async function fetchWritingOverview(): Promise<WritingOverview> {
  const res = await fetch("/api/writing/overview");
  if (!res.ok) throw new Error("Writing overview fetch failed");
  return (await res.json()) as WritingOverview;
}

export async function fetchWritingScore(): Promise<WritingScore> {
  const res = await fetch("/api/writing/score");
  if (!res.ok) throw new Error("Writing score fetch failed");
  return (await res.json()) as WritingScore;
}

export async function fetchWritingSources(workspaceId: string): Promise<WritingSourceFile[]> {
  const res = await fetch(
    `/api/writing/sources?workspace_id=${encodeURIComponent(workspaceId)}`,
  );
  if (!res.ok) throw new Error("Writing sources fetch failed");
  const data = (await res.json()) as { sources: WritingSourceFile[] };
  return data.sources;
}

export async function previewWritingDraft(body: {
  mode_id: string;
  voice_id: string;
  workspace_id: string;
  topic: string;
}): Promise<WritingDraftPreview> {
  const res = await fetch("/api/writing/draft/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Draft preview failed");
  return (await res.json()) as WritingDraftPreview;
}
