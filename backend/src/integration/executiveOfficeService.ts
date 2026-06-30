import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import {
  buildExecutiveOfficeProjection,
  renderExecutiveOfficeMarkdown,
} from "@localbrain/shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, "../../../docs");
const OFFICE_DOC = path.join(DOCS_ROOT, "LOCALBRAIN_EXECUTIVE_OFFICE_STRUCTURE.md");

export function getExecutiveOfficeProjection() {
  const projection = buildExecutiveOfficeProjection();
  const markdown = renderExecutiveOfficeMarkdown(projection);
  return { projection, markdown };
}

export function generateExecutiveOfficeStructureFile(): {
  path: string;
  department_count: number;
  domain_count: number;
  generated_at: string;
} {
  const { projection, markdown } = getExecutiveOfficeProjection();
  fs.writeFileSync(OFFICE_DOC, markdown, "utf8");
  return {
    path: OFFICE_DOC,
    department_count: projection.departments.length,
    domain_count: projection.intelligence_domains.length,
    generated_at: projection.generated_at,
  };
}
