import { generateExecutiveCapabilityAtlasFile } from "../integration/capabilityAtlasService.js";

const result = generateExecutiveCapabilityAtlasFile();
console.log(`Executive Capability Atlas written: ${result.path}`);
console.log(`${result.capability_count} capabilities · ${result.generated_at}`);
