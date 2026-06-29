import {
  closeDatabase,
  getAllowedFoldersFromDb,
  isDatabaseConnected,
  runMigrations,
} from "./db/database.js";
import { loadModuleManifests } from "./core/moduleLoader.js";
import { migrateDigitalAssetTables } from "./digitalAssets/assetRegistry.js";
import { refreshIntelligence } from "./digitalAssets/intelligenceEngine.js";
import { migrateKnowledgeExplorerTables } from "./knowledgeExplorer/migrate.js";
import { initPermissionEngine } from "./safety/permissionEngine.js";
import {
  migrateWorkspaceTables,
  seedWorkspaces,
  syncFilesystemRootsToAllowedFolders,
} from "./workspaces/workspaceRegistry.js";

export function refreshPermissionEngine(): void {
  const folders = getAllowedFoldersFromDb();
  initPermissionEngine(folders.map((f) => f.path));
}

export function bootstrapApp(): void {
  runMigrations();
  migrateWorkspaceTables();
  migrateKnowledgeExplorerTables();
  migrateDigitalAssetTables();
  refreshIntelligence();
  seedWorkspaces();
  syncFilesystemRootsToAllowedFolders();
  loadModuleManifests();
  refreshPermissionEngine();
}

export function shutdownApp(): void {
  closeDatabase();
}

export { isDatabaseConnected };

/** @deprecated use bootstrapApp */
export const bootstrapSafety = bootstrapApp;

/** @deprecated use shutdownApp */
export const shutdownSafety = shutdownApp;
