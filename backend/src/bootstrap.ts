import {
  closeDatabase,
  getAllowedFoldersFromDb,
  isDatabaseConnected,
  runMigrations,
} from "./db/database.js";
import { initPermissionEngine } from "./safety/permissionEngine.js";

export function bootstrapSafety(): void {
  runMigrations();
  const folders = getAllowedFoldersFromDb();
  initPermissionEngine(folders.map((f) => f.path));
}

export function shutdownSafety(): void {
  closeDatabase();
}

export { isDatabaseConnected };
