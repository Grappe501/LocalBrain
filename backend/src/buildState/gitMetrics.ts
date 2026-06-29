import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";

export type GitCommit = {
  hash: string;
  subject: string;
  date: string;
};

export function getRecentCommits(limit = 20): GitCommit[] {
  try {
    const out = execSync(`git log -${limit} --format="%h|%s|%aI"`, {
      cwd: getRepoRoot(),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return out
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, subject, date] = line.split("|");
        return { hash, subject, date: date?.slice(0, 10) ?? "" };
      });
  } catch {
    return [];
  }
}

export function getCommitsSince(days: number): GitCommit[] {
  try {
    const out = execSync(`git log --since="${days} days ago" --format="%h|%s|%aI"`, {
      cwd: getRepoRoot(),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return out
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, subject, date] = line.split("|");
        return { hash, subject, date: date?.slice(0, 10) ?? "" };
      });
  } catch {
    return [];
  }
}

export function getCommitCount(): number | null {
  try {
    const out = execSync("git rev-list --count HEAD", {
      cwd: getRepoRoot(),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return Number(out.trim()) || null;
  } catch {
    return null;
  }
}

const SLICE_ID_IN_COMMIT = /LB-OS-[\d.]+/gi;

/** Map slice IDs mentioned in recent commit subjects. */
export function getSliceIdsFromCommits(commits: GitCommit[]): Map<string, GitCommit[]> {
  const map = new Map<string, GitCommit[]>();
  for (const commit of commits) {
    const matches = commit.subject.match(SLICE_ID_IN_COMMIT) ?? [];
    const inferred = inferSliceFromSubject(commit.subject);
    const ids = [...new Set([...matches.map((m) => m.toUpperCase()), ...inferred])];
    for (const id of ids) {
      const list = map.get(id) ?? [];
      list.push(commit);
      map.set(id, list);
    }
  }
  return map;
}

function inferSliceFromSubject(subject: string): string[] {
  const lower = subject.toLowerCase();
  const hits: string[] = [];
  const patterns: [RegExp, string][] = [
    [/ai provider/i, "LB-OS-017"],
    [/filesystem mapping audit/i, "LB-OS-019"],
    [/drive architecture/i, "LB-OS-018"],
    [/executive os v1/i, "LB-OS-016"],
    [/relationship.*network/i, "LB-OS-015"],
    [/data.*intelligence/i, "LB-OS-014"],
    [/writing department/i, "LB-OS-013"],
    [/engineering department/i, "LB-OS-012"],
    [/program office/i, "LB-OS-012.5"],
    [/Executive Consolidation Briefing/i, "LB-OS-020"],
    [/consolidation planner/i, "LB-OS-020"],
    [/EIC foundation/i, "LB-OS-020"],
  ];
  for (const [re, id] of patterns) {
    if (re.test(lower)) hits.push(id);
  }
  return hits;
}

export function countDocsChangedSince(days: number): number {
  try {
    const out = execSync(`git log --since="${days} days ago" --name-only --pretty=format: -- docs/`, {
      cwd: getRepoRoot(),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const files = new Set(
      out
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.endsWith(".md")),
    );
    return files.size;
  } catch {
    return 0;
  }
}

export function countTypeScriptLoc(): number {
  const root = getRepoRoot();
  let total = 0;

  function walk(dir: string) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name === "node_modules" || ent.name === "dist") continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".ts") || ent.name.endsWith(".tsx")) {
        const text = fs.readFileSync(full, "utf8");
        total += text.split("\n").length;
      }
    }
  }

  for (const sub of ["backend/src", "frontend/src", "shared/src"]) {
    const p = path.join(root, sub);
    if (fs.existsSync(p)) walk(p);
  }
  return total;
}

export function countTestFiles(): number {
  const root = getRepoRoot();
  let count = 0;

  function walk(dir: string) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name === "node_modules" || ent.name === "dist") continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".test.ts")) count += 1;
    }
  }

  walk(path.join(root, "backend", "src"));
  return count;
}
