import { createHash, randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  APP_VERSION,
  CAPABILITY_REGISTRY,
  CONVENTION_CONTRACT_BUNDLE,
  FACTORY_CERT_DIMENSION_LABELS,
  FACTORY_CONTRACT_VERSION,
  type FactoryCertificationReport,
} from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";
import { isModuleCertificationLocked } from "../buildState/v1CertificationRegistry.js";
import { certifyFactory } from "./factoryCertificationEngine.js";
import { buildBirthCertificate, FACTORY_VERSION, MIGRATION_VERSION } from "./factoryCore.js";
import { buildFactoryPackage } from "./factoryPackageService.js";

export const FACTORY_RELEASE_TAG = "v1.0.0-factory-certified";
export const FACTORY_CERTIFICATION_DIR = "docs/factory/certification";

export type FactoryCeremonyResult = {
  report: FactoryCertificationReport;
  locked: boolean;
  artifact_dir: string;
  artifacts: string[];
};

function gitHead(): string | null {
  try {
    return execSync("git rev-parse HEAD", { cwd: getRepoRoot(), encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function writeJson(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function formatGateLine(label: string, status: "pass" | "needs_work" | "pending"): string {
  const dots = ".".repeat(Math.max(1, 22 - label.length));
  const verdict = status === "pass" ? "PASS" : status.toUpperCase();
  return `${label} ${dots} ${verdict}`;
}

export function formatCeremonyConsole(report: FactoryCertificationReport, locked: boolean): string {
  const lines = report.dimensions.map((d) =>
    formatGateLine(d.label, d.status),
  );
  lines.push("");
  lines.push("FACTORY STATUS");
  lines.push("==============");
  if (report.certified) {
    lines.push("CERTIFIED");
    lines.push(locked ? "LOCKED" : "UNLOCKED");
    lines.push(locked ? "READY FOR MEMORY OS" : "LOCK PENDING");
  } else {
    lines.push("NOT CERTIFIED");
    lines.push("NEEDS WORK");
  }
  return lines.join("\n");
}

function buildManufacturingReportMd(
  report: FactoryCertificationReport,
  pkg: ReturnType<typeof buildFactoryPackage>,
  locked: boolean,
): string {
  const gateTable = report.dimensions
    .map((d) => `| ${d.label} | ${d.status === "pass" ? "PASS" : d.status.toUpperCase()} | ${d.evidence ?? "—"} |`)
    .join("\n");

  return `# PMO Factory Manufacturing Report

> **Release:** ${FACTORY_RELEASE_TAG}  
> **Engine:** ENG-FAC-001 · LB-OS-PROD-010  
> **Contract:** ${FACTORY_CONTRACT_VERSION}  
> **Observed:** ${report.observed_at}  
> **Status:** ${report.certified ? "CERTIFIED" : "NOT CERTIFIED"} · ${locked ? "LOCKED" : "UNLOCKED"}

---

## Success test

> Could a customer with no knowledge of Steve install LocalBrain and receive exactly the same institution?

**Verdict:** ${report.certified ? "YES — manufacturing parity confirmed" : "NO — gates failed"}

---

## PMO ten-gate certification

| Gate | Status | Evidence |
| ---- | ------ | -------- |
${gateTable}

---

## Manufacturing record

| Field | Value |
| ----- | ----- |
| Structural hash | \`${pkg.structural_hash}\` |
| Integrity hash | \`${pkg.integrity_hash}\` |
| Package ID | \`${pkg.package_id}\` |
| Factory version | ${FACTORY_VERSION} |
| Migration version | ${MIGRATION_VERSION} |
| App version | ${APP_VERSION} |

---

## Governance rule (post-lock)

\`\`\`txt
Factory
├── NEVER learns
├── NEVER stores memories
├── NEVER personalizes
├── NEVER changes behavior
└── ONLY manufactures institutions
\`\`\`

Everything intelligent happens **after installation**.

---

*PMO Factory Certification Ceremony · LocalBrain V1*
`;
}

/** Run PMO certification ceremony, lock Factory, write immutable artifacts. */
export function runFactoryCertificationCeremony(lockOnPass = true): FactoryCeremonyResult {
  const report = certifyFactory({ include_installer_flow: true, lock_on_pass: lockOnPass });
  const locked = isModuleCertificationLocked("factory");
  const pkg = buildFactoryPackage();
  const ceremonialInstanceId = `CER-${randomUUID()}`;
  const birthCertificate = buildBirthCertificate(ceremonialInstanceId);
  const head = gitHead();
  const artifactDir = path.join(getRepoRoot(), FACTORY_CERTIFICATION_DIR);

  const certificationPath = path.join(artifactDir, "factory-certification.json");
  const lockPath = path.join(artifactDir, "factory-lock.json");
  const releasePath = path.join(artifactDir, "factory-release.json");
  const birthPath = path.join(artifactDir, "factory-birth-certificate.json");
  const reportPath = path.join(artifactDir, "factory-manufacturing-report.md");
  const custodyPath = path.join(artifactDir, "factory-chain-of-custody.json");
  const capabilityPath = path.join(artifactDir, "factory-capability-manifest.json");

  writeJson(certificationPath, report);

  writeJson(lockPath, {
    module_id: "factory",
    module_name: "Empty Brain Factory",
    locked,
    certified: report.certified,
    locked_at: locked ? report.observed_at : null,
    release_tag: FACTORY_RELEASE_TAG,
    governance_rule:
      "Factory ONLY manufactures institutions — never learns, stores memories, personalizes, or changes behavior post-lock.",
  });

  writeJson(releasePath, {
    release_tag: FACTORY_RELEASE_TAG,
    release_type: "factory_certified",
    app_version: APP_VERSION,
    factory_version: FACTORY_VERSION,
    factory_contract_version: FACTORY_CONTRACT_VERSION,
    migration_version: MIGRATION_VERSION,
    engine_id: "ENG-FAC-001",
    slice_id: "LB-OS-PROD-010",
    structural_hash: pkg.structural_hash,
    integrity_hash: pkg.integrity_hash,
    package_id: pkg.package_id,
    certified_at: report.observed_at,
    certified: report.certified,
    locked,
    ready_for: report.certified && locked ? "memory_os" : null,
  });

  writeJson(birthPath, {
    ...birthCertificate,
    ceremonial: true,
    note: "Reference birth certificate schema at Factory lock — not a live instance.",
    structural_hash: pkg.structural_hash,
  });

  fs.writeFileSync(reportPath, buildManufacturingReportMd(report, pkg, locked), "utf8");

  const artifactManifest = {
    factory_certification: "factory-certification.json",
    factory_lock: "factory-lock.json",
    factory_release: "factory-release.json",
    factory_birth_certificate: "factory-birth-certificate.json",
    factory_manufacturing_report: "factory-manufacturing-report.md",
    factory_chain_of_custody: "factory-chain-of-custody.json",
    factory_capability_manifest: "factory-capability-manifest.json",
  };

  writeJson(custodyPath, {
    ceremony_id: `PMO-FAC-${report.observed_at.slice(0, 10)}`,
    observed_at: report.observed_at,
    release_tag: FACTORY_RELEASE_TAG,
    git_commit: head,
    certification_report_hash: createHash("sha256")
      .update(JSON.stringify(report))
      .digest("hex"),
    structural_hash: pkg.structural_hash,
    integrity_hash: pkg.integrity_hash,
    convention_contracts: CONVENTION_CONTRACT_BUNDLE,
    gates: Object.fromEntries(
      report.dimensions.map((d) => [d.dimension_id, d.status]),
    ),
    gate_labels: FACTORY_CERT_DIMENSION_LABELS,
    artifacts: artifactManifest,
    locked,
    next_authorized_module: locked ? "memory_os" : null,
  });

  writeJson(capabilityPath, {
    generated_at: report.observed_at,
    capability_count: CAPABILITY_REGISTRY.length,
    graph_certified: report.dimensions.find((d) => d.dimension_id === "capability_graph")?.status === "pass",
    capabilities: CAPABILITY_REGISTRY.map((c) => ({
      capability_id: c.capability_id,
      title: c.title,
      departments: c.departments,
      completion_status: c.completion_status,
      maturity: c.maturity,
    })),
    structural_hash: pkg.structural_hash,
  });

  return {
    report,
    locked,
    artifact_dir: artifactDir,
    artifacts: Object.values(artifactManifest).map((f) => path.join(artifactDir, f)),
  };
}
