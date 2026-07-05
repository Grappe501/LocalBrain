# Factory PMO Certification Record

> **Status:** CERTIFIED · LOCKED  
> **Release:** `v1.0.0-factory-certified`  
> **Engine:** ENG-FAC-001

This directory is the immutable manufacturing record for LocalBrain V1 Factory.

| Artifact | Purpose |
| -------- | ------- |
| [Factory Constitution v1.0](../FACTORY_CONSTITUTION_v1.0.md) | Constitutional document for the manufacturing layer |
| [factory-certification.json](./factory-certification.json) | Full ten-gate PMO certification report |
| [factory-lock.json](./factory-lock.json) | Factory lock record and governance rule |
| [factory-release.json](./factory-release.json) | Release metadata and structural hashes |
| [factory-birth-certificate.json](./factory-birth-certificate.json) | Reference birth certificate schema at lock |
| [factory-manufacturing-report.md](./factory-manufacturing-report.md) | Human-readable manufacturing report |
| [factory-chain-of-custody.json](./factory-chain-of-custody.json) | Ceremony chain of custody |
| [factory-capability-manifest.json](./factory-capability-manifest.json) | Capability registry snapshot at certification |

Re-run ceremony: `npm run factory:certify -- --lock` (blocked while Factory is locked unless registry is reset).

*PMO Factory Certification · LocalBrain V1*
