#!/usr/bin/env tsx
/**
 * ENG-FAC-001 CLI — native installer artifact generation and install.
 *
 *   npm run factory:generate
 *   npm run factory:install -- <artifact-dir>
 *   npm run factory:certify
 *   npm run factory:certify -- --lock   (PMO ceremony)
 */
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import {
  formatCeremonyConsole,
  runFactoryCertificationCeremony,
} from "../factory/factoryCertificationCeremony.js";
import {
  generateInstallerArtifact,
  getFactoryDistDir,
  installFromArtifact,
  verifyInstallerArtifact,
} from "../factory/factoryInstallerService.js";

const cmd = process.argv[2] ?? "generate";

bootstrapApp();
try {
  if (cmd === "generate") {
    const result = generateInstallerArtifact();
    const check = verifyInstallerArtifact(result.artifact_dir);
    console.log(JSON.stringify({ ...result, verification: check, dist_root: getFactoryDistDir() }, null, 2));
  } else if (cmd === "install") {
    const artifactDir = process.argv[3];
    if (!artifactDir) {
      console.error("Usage: factory:install -- <artifact-dir>");
      process.exit(1);
    }
    const record = installFromArtifact(artifactDir);
    console.log(JSON.stringify({ record }, null, 2));
  } else if (cmd === "certify") {
    const lock = process.argv.includes("--lock");
    const ceremony = runFactoryCertificationCeremony(lock);
    console.log(formatCeremonyConsole(ceremony.report, ceremony.locked));
    console.log("");
    console.log(`Artifacts written to ${ceremony.artifact_dir}`);
    if (!ceremony.report.certified) process.exit(1);
    if (lock && !ceremony.locked) process.exit(1);
  } else {
    console.error("Commands: generate | install | certify");
    process.exit(1);
  }
} finally {
  shutdownApp();
}
