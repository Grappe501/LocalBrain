# CF-015 — LocalBrain Product & IP Inventory Integration
Status: IMPLEMENTED / WORKSTATION CERTIFICATION PENDING

## Purpose
Deploy the Company Foundry Product & IP Inventory natively into the LocalBrain workbench rather than iframe or depend on FoundryOS rendering.

## Native LocalBrain routes
- `/foundry/inventory` — portfolio control plane
- `/foundry/inventory/:id` — asset executive drill-down

## Navigation
`Inventory` is now a first-class Company Foundry navigation tab between Overview and Academy.

## Canonical LocalBrain-side contract
`frontend/src/companyFoundry/inventory.ts`

The integration ports the 21 audited product/IP families and their current planning data from the FoundryOS inventory work: readiness, customer, problem, product thesis, repositories, remaining build, annual revenue scenarios, replacement/build value, risk-adjusted current IP value, commercial potential, and evidence confidence.

## Operating portfolio layer
LocalBrain derives:
- operating band: SELL/PILOT NOW, FINISH→SELL, INCUBATE/VALIDATE, PUBLISHING TRACK, HOLD/RESOLVE;
- evidence-aware priority score;
- next executive action;
- next commercial proof requirement.

A high priority score is a focus signal, not proof of market demand.

## Portfolio dashboard
The native workbench shows:
- asset count and average readiness;
- aggregate planning ranges for revenue, replacement value, current risk-adjusted IP, and commercial potential;
- top-five executive priority queue;
- search/filter/sort across all assets;
- direct drill-down to each asset;
- Founder Executive Book entry point.

## Asset drill-down
Each asset shows customer/problem/thesis, readiness, evidence confidence, priority, annual revenue scenario, replacement value, risk-adjusted IP, commercial potential, operating posture, next proof, remaining build, evidence notes, and source repositories.

## Valuation doctrine
Projected revenue is not enterprise value. Replacement value, current risk-adjusted IP value, commercial potential, and enterprise value remain separate concepts. All ranges are internal planning assumptions until replaced by external evidence.

## Architecture decision
LocalBrain owns a native inventory presentation/operating contract. It does not iframe FoundryOS. FoundryOS remains a source/audit environment; future synchronization should be an explicit data-contract slice rather than runtime UI coupling.

## Certification required
Before declaring production-ready on the workstation:
1. run LocalBrain frontend typecheck;
2. run LocalBrain frontend production build;
3. navigate `/foundry/inventory`;
4. test search, filters and sorts;
5. open multiple asset drill-down routes;
6. verify Founder Executive Book link behavior;
7. run CF-014 workstation certification;
8. log any failures into CF-013 stabilization.

No financial execution, valuation appraisal, equity issuance, residual settlement, or money movement is introduced by this slice.
