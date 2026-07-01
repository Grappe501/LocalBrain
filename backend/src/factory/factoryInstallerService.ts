import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type {
  BrainBirthCertificate,
  FactoryFirstLaunchState,
  FactoryInstallRecord,
  FactoryInstallerManifest,
  FactoryPackage,
} from "@localbrain/shared";
import {
  FACTORY_ARTIFACT_FILES,
  FACTORY_CONTRACT_VERSION,
  FACTORY_INSTALLER_VERSION,
} from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";
import { readBirthCertificate } from "./factoryCore.js";
import {
  buildFactoryPackage,
  installFactoryPackage,
  verifyPackageIntegrity,
} from "./factoryPackageService.js";

export function getFactoryDistDir(): string {
  return path.join(getRepoRoot(), "local_data", "factory-dist");
}

export function getFactoryInstallsDir(): string {
  return path.join(getRepoRoot(), "local_data", "factory-installs");
}

function sha256File(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return createHash("sha256").update(content).digest("hex");
}

function writeJson(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

/** Generate native installer artifact directory (Download). */
export function generateInstallerArtifact(outputDir?: string): {
  artifact_dir: string;
  manifest: FactoryInstallerManifest;
  package: FactoryPackage;
} {
  const pkg = buildFactoryPackage();
  const hash8 = pkg.structural_hash.slice(0, 8);
  const artifactDir =
    outputDir ?? path.join(getFactoryDistDir(), `localbrain-empty-institution-${hash8}`);

  if (fs.existsSync(artifactDir)) {
    fs.rmSync(artifactDir, { recursive: true, force: true });
  }
  fs.mkdirSync(artifactDir, { recursive: true });

  const packagePath = path.join(artifactDir, FACTORY_ARTIFACT_FILES.package);
  writeJson(packagePath, pkg);

  const checksum = sha256File(packagePath);
  fs.writeFileSync(path.join(artifactDir, FACTORY_ARTIFACT_FILES.checksum), `${checksum}\n`, "utf8");

  const installerManifest: FactoryInstallerManifest = {
    installer_version: FACTORY_INSTALLER_VERSION,
    factory_contract_version: FACTORY_CONTRACT_VERSION,
    package_id: pkg.package_id,
    structural_hash: pkg.structural_hash,
    integrity_hash: pkg.integrity_hash,
    generated_at: new Date().toISOString(),
    artifact_files: {
      package: FACTORY_ARTIFACT_FILES.package,
      checksum: FACTORY_ARTIFACT_FILES.checksum,
      installer_manifest: FACTORY_ARTIFACT_FILES.installer_manifest,
    },
  };

  writeJson(path.join(artifactDir, FACTORY_ARTIFACT_FILES.installer_manifest), installerManifest);

  fs.writeFileSync(
    path.join(artifactDir, "README.txt"),
    [
      "LocalBrain Empty Executive Institution",
      "Manufactured by LocalBrain Factory — ENG-FAC-001",
      "",
      "This artifact contains a certified empty institution.",
      "No personal data. No Memory OS ingestion.",
      "",
      `Structural hash: ${pkg.structural_hash}`,
      "",
    ].join("\n"),
    "utf8",
  );

  return { artifact_dir: artifactDir, manifest: installerManifest, package: pkg };
}

export function verifyInstallerArtifact(artifactDir: string): {
  valid: boolean;
  violations: string[];
  package?: FactoryPackage;
} {
  const violations: string[] = [];
  const packagePath = path.join(artifactDir, FACTORY_ARTIFACT_FILES.package);
  const checksumPath = path.join(artifactDir, FACTORY_ARTIFACT_FILES.checksum);
  const manifestPath = path.join(artifactDir, FACTORY_ARTIFACT_FILES.installer_manifest);

  if (!fs.existsSync(packagePath)) violations.push("missing_package_file");
  if (!fs.existsSync(checksumPath)) violations.push("missing_checksum_file");
  if (!fs.existsSync(manifestPath)) violations.push("missing_installer_manifest");

  if (violations.length > 0) return { valid: false, violations };

  const expectedChecksum = fs.readFileSync(checksumPath, "utf8").trim();
  const actualChecksum = sha256File(packagePath);
  if (expectedChecksum !== actualChecksum) violations.push("INSTALL_sha256_mismatch");

  const pkg = readJson<FactoryPackage>(packagePath);
  const integrity = verifyPackageIntegrity(pkg);
  if (!integrity.valid) violations.push(...integrity.violations.map((v) => `package_${v}`));

  const manifest = readJson<FactoryInstallerManifest>(manifestPath);
  if (manifest.structural_hash !== pkg.structural_hash) violations.push("manifest_structural_hash_mismatch");

  return { valid: violations.length === 0, violations, package: pkg };
}

export function loadPackageFromArtifact(artifactDir: string): FactoryPackage {
  const check = verifyInstallerArtifact(artifactDir);
  if (!check.valid || !check.package) {
    throw new Error(`Invalid installer artifact: ${check.violations.join(", ")}`);
  }
  return check.package;
}

/** Install from artifact into runtime + filesystem persistence (Install → Launch). */
export function installFromArtifact(artifactDir: string): FactoryInstallRecord {
  const pkg = loadPackageFromArtifact(artifactDir);
  const installResult = installFactoryPackage(pkg);

  const installId = installResult.install_id.replace("INS-", "");
  const installPath = path.join(getFactoryInstallsDir(), installId);
  if (fs.existsSync(installPath)) {
    fs.rmSync(installPath, { recursive: true, force: true });
  }
  fs.mkdirSync(installPath, { recursive: true });

  fs.copyFileSync(
    path.join(artifactDir, FACTORY_ARTIFACT_FILES.package),
    path.join(installPath, FACTORY_ARTIFACT_FILES.package),
  );

  const birthCertificate = readBirthCertificate();
  if (!birthCertificate) throw new Error("Birth certificate missing after install");

  writeJson(path.join(installPath, FACTORY_ARTIFACT_FILES.birth_certificate), birthCertificate);

  const firstLaunch: FactoryFirstLaunchState = {
    completed: false,
    completed_at: null,
    install_id: installResult.install_id,
  };
  writeJson(path.join(installPath, FACTORY_ARTIFACT_FILES.first_launch), firstLaunch);

  const record: FactoryInstallRecord = {
    install_id: installResult.install_id,
    install_path: installPath,
    package_id: pkg.package_id,
    structural_hash: pkg.structural_hash,
    profile_instance_id: installResult.profile_instance_id,
    installed_at: installResult.observed_at,
    upgraded_at: null,
    uninstalled_at: null,
    first_launch_completed: false,
    first_launch_at: null,
  };
  writeJson(path.join(installPath, FACTORY_ARTIFACT_FILES.install_record), record);

  return record;
}

export function verifyInstallation(installId: string): {
  valid: boolean;
  violations: string[];
  record?: FactoryInstallRecord;
} {
  const violations: string[] = [];
  const id = installId.startsWith("INS-") ? installId.replace("INS-", "") : installId;
  const installPath = path.join(getFactoryInstallsDir(), id);
  const recordPath = path.join(installPath, FACTORY_ARTIFACT_FILES.install_record);

  if (!fs.existsSync(recordPath)) {
    return { valid: false, violations: ["install_not_found"] };
  }

  const record = readJson<FactoryInstallRecord>(recordPath);
  if (record.uninstalled_at) violations.push("install_uninstalled");

  const birthPath = path.join(installPath, FACTORY_ARTIFACT_FILES.birth_certificate);
  if (!fs.existsSync(birthPath)) violations.push("missing_persisted_birth_certificate");

  const pkgPath = path.join(installPath, FACTORY_ARTIFACT_FILES.package);
  if (!fs.existsSync(pkgPath)) violations.push("missing_package_copy");

  const pkg = readJson<FactoryPackage>(pkgPath);
  const integrity = verifyPackageIntegrity(pkg);
  if (!integrity.valid) violations.push(...integrity.violations);

  const birth = readJson<BrainBirthCertificate>(birthPath);
  if (birth.identity.instance_id !== record.profile_instance_id) {
    violations.push("birth_certificate_instance_mismatch");
  }

  return { valid: violations.length === 0, violations, record };
}

export function upgradeInstallation(installId: string, artifactDir: string): FactoryInstallRecord {
  const existing = verifyInstallation(installId);
  if (!existing.valid || !existing.record) {
    throw new Error(`Cannot upgrade: ${existing.violations.join(", ")}`);
  }

  const pkg = loadPackageFromArtifact(artifactDir);
  if (pkg.structural_hash !== existing.record.structural_hash) {
    throw new Error("Upgrade rejected: structural_hash changed — requires fresh install");
  }

  installFactoryPackage(pkg);

  const birthCertificate = readBirthCertificate();
  if (!birthCertificate) throw new Error("Birth certificate missing after upgrade");

  const installPath = existing.record.install_path;
  writeJson(path.join(installPath, FACTORY_ARTIFACT_FILES.package), pkg);
  writeJson(path.join(installPath, FACTORY_ARTIFACT_FILES.birth_certificate), birthCertificate);

  const updated: FactoryInstallRecord = {
    ...existing.record,
    package_id: pkg.package_id,
    upgraded_at: new Date().toISOString(),
  };
  writeJson(path.join(installPath, FACTORY_ARTIFACT_FILES.install_record), updated);
  return updated;
}

export function uninstallInstallation(installId: string): { removed: boolean; install_path: string } {
  const id = installId.startsWith("INS-") ? installId.replace("INS-", "") : installId;
  const installPath = path.join(getFactoryInstallsDir(), id);
  const recordPath = path.join(installPath, FACTORY_ARTIFACT_FILES.install_record);

  if (!fs.existsSync(recordPath)) {
    return { removed: false, install_path: installPath };
  }

  const record = readJson<FactoryInstallRecord>(recordPath);
  record.uninstalled_at = new Date().toISOString();
  writeJson(recordPath, record);

  fs.rmSync(installPath, { recursive: true, force: true });
  return { removed: true, install_path: installPath };
}

/** First-launch workflow — marks institution launched without onboarding intelligence. */
export function completeFirstLaunch(installId: string): FactoryFirstLaunchState {
  const check = verifyInstallation(installId);
  if (!check.valid || !check.record) {
    throw new Error(`First launch blocked: ${check.violations.join(", ")}`);
  }

  const now = new Date().toISOString();
  const state: FactoryFirstLaunchState = {
    completed: true,
    completed_at: now,
    install_id: check.record.install_id,
  };

  const installPath = check.record.install_path;
  writeJson(path.join(installPath, FACTORY_ARTIFACT_FILES.first_launch), state);

  const record: FactoryInstallRecord = {
    ...check.record,
    first_launch_completed: true,
    first_launch_at: now,
  };
  writeJson(path.join(installPath, FACTORY_ARTIFACT_FILES.install_record), record);
  return state;
}

export function runDeterministicRebuildValidation(): {
  pass: boolean;
  structural_hash: string;
  rebuild_hash: string;
} {
  const a = generateInstallerArtifact(path.join(getRepoRoot(), "local_data", "factory-test", `rebuild-a-${randomUUID()}`));
  const b = generateInstallerArtifact(path.join(getRepoRoot(), "local_data", "factory-test", `rebuild-b-${randomUUID()}`));

  const pass = a.package.structural_hash === b.package.structural_hash;
  fs.rmSync(a.artifact_dir, { recursive: true, force: true });
  fs.rmSync(b.artifact_dir, { recursive: true, force: true });

  return {
    pass,
    structural_hash: a.package.structural_hash,
    rebuild_hash: b.package.structural_hash,
  };
}

export function readPersistedBirthCertificate(installId: string): BrainBirthCertificate | null {
  const id = installId.startsWith("INS-") ? installId.replace("INS-", "") : installId;
  const birthPath = path.join(getFactoryInstallsDir(), id, FACTORY_ARTIFACT_FILES.birth_certificate);
  if (!fs.existsSync(birthPath)) return null;
  return readJson<BrainBirthCertificate>(birthPath);
}
