import { execSync } from "node:child_process";
import { getRepoRoot } from "../db/repoRoot.js";

export function getRecentCommits(limit = 8): { hash: string; subject: string; date: string }[] {
  try {
    const out = execSync(`git log -${limit} --format=%h|%s|%aI`, {
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
