import path from "node:path";
import { fileURLToPath } from "node:url";

/** Monorepo root (H:/localAgent when deployed per drive doctrine). */
export function getRepoRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "..", "..");
}

export function getDefaultDbPath(): string {
  return path.join(getRepoRoot(), "local_data", "localbrain.db");
}
