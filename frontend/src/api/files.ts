import type { FileReadResult, FileSummarizeMode, FileSummarizeResult, FolderManifestResult } from "@localbrain/shared";

export async function readFileApi(path: string): Promise<FileReadResult> {
  const res = await fetch("/api/files/read", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  return (await res.json()) as FileReadResult;
}

export async function summarizeFileApi(options: {
  path: string;
  mode?: FileSummarizeMode;
  prompt?: string;
}): Promise<FileSummarizeResult> {
  const res = await fetch("/api/files/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: options.path,
      mode: options.mode ?? "asset",
      prompt: options.prompt,
    }),
  });
  return (await res.json()) as FileSummarizeResult;
}

export async function fetchFolderManifest(path: string): Promise<FolderManifestResult> {
  const res = await fetch("/api/files/folder-manifest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  return (await res.json()) as FolderManifestResult;
}
