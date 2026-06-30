import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateExecutiveOfficeStructureFile } from "../integration/executiveOfficeService.js";

const result = generateExecutiveOfficeStructureFile();
console.log(
  `Executive Office structure written: ${result.path}\n${result.department_count} departments · ${result.domain_count} intelligence domains · ${result.generated_at}`,
);
