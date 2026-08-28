# CF-004 — Founder Capitalization + Economic Engine

**Status:** COMPLETE — scenario architecture; legal/tax review required before issuance/payment implementation
**Date:** 2026-08-28
**Parent:** CF-003 Corporate + IP Architecture

## 1. Purpose

Build the economic operating system for Company Foundry without prematurely fixing founder ownership percentages. The engine separates four things that must never be confused:

1. **Parent ownership** — long-term equity/control in Company Foundry.
2. **Production compensation** — cash or approved consideration earned for accepted work phases.
3. **Product residual participation** — contractual participation in a product's defined distributable residual.
4. **Capital/property contribution** — cash, equipment, or validly transferred IP contributed to the company.

A person may participate in more than one ledger at the same time. Being a co-owner does not, by itself, prevent the company from separately compensating that person for bona fide work, but entity type, tax status, worker classification, payroll, reasonable-compensation rules, securities rules, and related-party governance must be reviewed by counsel/CPA.

## 2. Core economic doctrine

**Ownership rewards building and bearing risk in the Foundry.**

**Phase compensation rewards accepted production.**

**Residual participation rewards successful product economics.**

**Capital contribution records what someone put at risk.**

These are independent ledgers.

## 3. Parent capitalization model

CF-004 does not set Steve, Chris, Mark, investor, advisor, or builder percentages. Instead it establishes a fully diluted capitalization model with configurable buckets.

Recommended modeling buckets:

- founder / pre-company IP contributor pool;
- CEO/executive pool;
- founding capital/property contributor pool;
- employee/builder long-term incentive pool;
- advisor/strategic pool;
- future financing reserve/dilution scenario;
- acquisition/strategic reserve only if needed.

A large authorized share count may be used for administrative granularity, but the dashboard must always show fully diluted percentages. Shares are units; percentages are economics.

### Required cap-table views

Every scenario must show:

- issued and outstanding;
- options/awards granted;
- unallocated incentive pool;
- fully diluted total;
- each holder's current %;
- each holder's fully diluted %;
- dilution after modeled financing rounds;
- vesting status;
- voting/control class where applicable.

## 4. Founder/equity scenario engine

Before formation documents lock economics, model at least three scenarios:

### Scenario A — Founder-control weighted
Designed to preserve strong founder/product-architect control while reserving meaningful executive, builder, and financing capacity.

### Scenario B — Executive-team weighted
Allocates more long-term ownership to a committed CEO/founding leadership team subject to vesting and performance.

### Scenario C — Capital-growth weighted
Reserves a larger financing/incentive pool for outside capital and rapid builder recruitment.

No scenario becomes doctrine merely because it appears favorable on day one. Model dilution at seed, Series A-equivalent, and later financing assumptions before choosing.

## 5. Capital contribution ledger

Each capital/property contribution receives its own record:

- contributor;
- contribution type;
- date;
- documented value;
- evidence/invoice/appraisal where appropriate;
- whether contribution is equity purchase, capital contribution, loan, lease, license, reimbursement, or other approved treatment;
- securities/tax approval if equity is involved;
- board/company authorization;
- repayment or liquidation rights if any.

### Mark London server

The approximately $8,000 GPU server is recorded in this ledger separately from Mark's production work. CF-004 does not assume $8,000 equals a predetermined ownership percentage.

The final instrument may be equipment contribution for equity, company purchase funded by Mark, founder loan, lease/use agreement, or another CPA/counsel-approved structure.

## 6. Production Ledger — pay by accepted phase

Company Foundry may establish phase-based compensation for qualified builders, including people who also hold parent-company equity, subject to the company's entity/tax/payroll structure.

Every phase has a **Phase Value Record (PVR)**.

Required PVR fields:

- phase_id;
- master_plan_id;
- product_id;
- phase title and scope;
- dependencies;
- acceptance criteria;
- estimated difficulty;
- expected business value;
- risk/security/compliance weight;
- estimated time band for planning only;
- assigned builder/team;
- accepting authority;
- approved compensation package;
- accepted evidence: commits/tests/deployment/artifacts;
- acceptance/rejection/rework state;
- settlement state.

### Phase pricing score

Use a configurable weighted score rather than lines of code:

`PVS = complexity + business_value + risk + scarcity + ownership_of_outcome + urgency - reuse_discount`

Each factor receives a governed score. The resulting Phase Value Score maps to a compensation band approved before work begins.

### Compensation packages

A phase may offer one or more approved packages, for example:

- **Cash:** 100% approved cash value.
- **Hybrid:** lower cash + approved long-term parent-equity award.
- **Venture:** lower cash + approved product residual units/rights where the product permits them.
- **Leadership:** phase cash + milestone bonus tied to launch/revenue/quality.

The company does not promise that every phase offers every package. Equity awards require the formal equity plan and approvals. Residual rights require a signed product agreement.

## 7. Apprentice economics

The initial Builder Academy working assumption remains **$20/hour during the finite learning/internship stage**, subject to wage/hour and classification review.

Apprentices are not paid solely for accepted phases while the company is treating them as controlled trainees/employees. Phase acceptance during apprenticeship is used primarily to measure capability and progression.

Graduation unlocks eligibility for phase-priced production work and, selectively, ownership/residual instruments.

## 8. Capability ladder and pay bands

Create governed capability levels rather than negotiating every task from zero:

- L0 — Apprentice
- L1 — Guided Builder
- L2 — Independent Builder
- L3 — Senior/Venture Builder
- L4 — Product Lead
- L5 — Foundry Architect / Executive Technical Leader

Each level has demonstrated requirements and a permitted phase-value range. Promotion depends on accepted evidence, quality, independence, teamwork, security discipline, and business judgment — not simply time served.

## 9. Capstone admission gate

The special residual formula applies **only** to an accepted Master Build Plan approved as the builder's Capstone.

A Capstone must pass all gates before residual economics are granted:

1. validated customer/problem hypothesis;
2. written Master Build Plan;
3. product admitted by Foundry governance;
4. IP/provenance clearance;
5. budget/resource allocation;
6. team plan;
7. security/legal/compliance classification;
8. measurable beta/launch definition;
9. commercial model and pricing hypothesis;
10. residual waterfall and team allocation approved in writing;
11. capstone acceptance authority designated.

An existing company product does not become someone's Capstone merely because they work on it.

## 10. Capstone residual doctrine

**No Capstone residual percentage conveys ownership.**

For an accepted Capstone product:

`Collected Product Revenue`
`- refunds / chargebacks / transaction taxes`
`- payment processing`
`- direct hosting / AI / data / API costs`
`- product-specific customer support`
`- product-specific sales / marketing`
`- approved labor/contractor obligations not already excluded by policy`
`- Foundry shared-services allocation`
`- capital recoupment if the approved plan includes it`
`- required operating / warranty / tax / refund reserve`
`= Distributable Product Residual (DPR)`

The residual percentages apply to **DPR**, never gross revenue.

### Mandatory allocation boundaries

- Company Foundry receives **at least 25% of DPR**.
- The Capstone lead may receive **up to 51% of DPR**.
- Participating Capstone team members receive individually defined percentages of DPR.
- Other authorized pools, if any, must be disclosed in the Capstone agreement.
- All allocations must equal **100% of DPR**.

The company may retain more than 25% where it provides greater capital, IP, staff, sales, infrastructure, guarantees, risk, or continuing support.

## 11. Example Capstone residual allocations

These examples illustrate the engine; they are not promises.

### Builder-max model

- Capstone Lead: 51%
- Team Member A: 8%
- Team Member B: 6%
- Team Member C: 5%
- Company: 30%

Total: 100%.

### Larger-team model

- Capstone Lead: 35%
- Four team members: 7.5% each = 30%
- Company: 35%

Total: 100%.

### Company-capital-heavy model

- Capstone Lead: 25%
- Team pool: 15%
- Company: 60%

Total: 100%.

The allocation is established before material Capstone build work begins and cannot be casually changed after success becomes visible.

## 12. Residual scenario calculator

For a product with monthly DPR of:

| DPR | Lead 51% | Team 19% | Company 30% |
|---:|---:|---:|---:|
| $1,000 | $510 | $190 | $300 |
| $10,000 | $5,100 | $1,900 | $3,000 |
| $100,000 | $51,000 | $19,000 | $30,000 |
| $1,000,000 | $510,000 | $190,000 | $300,000 |

This is why residual economics can create founder-scale upside without transferring product ownership.

## 13. Team residual allocation

Every qualifying team member has a named residual allocation in the Capstone Product Agreement.

The team pool can be allocated by:

- fixed percentages established at admission;
- role bands;
- milestone-earned tranches;
- a hybrid base + earned tranche system.

Recommended model for CF-005 testing: reserve the full team pool at Capstone admission, assign a guaranteed base portion to named core team members, and leave an explicitly bounded earned tranche for later contributors. This prevents unlimited dilution of the lead/team economics.

## 14. Continuing-production requirement

The founder concept includes continued profitable production after graduation. CF-004 separates this from already-earned ownership.

A residual agreement may condition **future unvested residual rights** or enhanced residual tiers on measurable continuing contribution, but earned amounts and post-termination treatment must be precisely defined and legally reviewed.

Do not use vague language such as "produce enough profitable code." Define objective standards such as:

- accepted Phase Value Points per rolling quarter;
- product leadership obligations;
- uptime/support duties;
- release cadence;
- revenue/customer milestones;
- mentoring/team contribution;
- security/compliance performance.

## 15. Parent equity versus product residuals

Parent equity should be rarer than product residual participation.

A builder can become economically motivated without continuously diluting the parent cap table.

Suggested doctrine:

- Apprentices: cash wages.
- Qualified builders: phase cash; selective residual opportunities.
- Venture builders: phase compensation + meaningful product residual opportunities.
- Product leads: Capstone residual leadership + possible selective parent equity.
- Executives/Foundry architects: parent equity tied to company-wide value creation, plus normal approved compensation.

## 16. Co-owner phase compensation

A parent-company shareholder/member may also perform paid production work. The Production Ledger records that work independently of ownership.

However, the legal mechanism depends on entity/tax status. Examples requiring professional review include shareholder-employees of corporations, partners/members of partnership-taxed LLCs, guaranteed payments, wages, distributions, reasonable compensation, payroll withholding, and related-party approval.

**Foundry rule:** never disguise wages for services as owner distributions merely to avoid payroll/tax obligations.

## 17. Product sale / spinout economics

Residual participation does not automatically equal sale ownership.

Every Capstone agreement must separately state what happens if:

- product is sold;
- product assets are licensed;
- product becomes a subsidiary;
- outside investors purchase product equity;
- product is merged into another Foundry product;
- product is shut down.

Possible sale-event instruments for counsel to model include a defined transaction bonus pool, conversion of residual rights into a sale participation amount, continuation of residual rights against license revenue, or negotiated subsidiary equity. None is automatic.

## 18. Liquidity controls

The company must be able to survive success.

Before residual distribution, finance may maintain approved reserves for:

- taxes;
- refunds/chargebacks;
- infrastructure commitments;
- customer obligations;
- payroll;
- legal/compliance;
- debt/capital recoupment where authorized;
- planned reinvestment specifically defined by policy.

The company cannot arbitrarily manufacture expenses after the fact to erase a team's residual. Shared-services allocations and reserves must follow the pre-approved formula and be visible to participants.

## 19. Settlement cadence

Recommended baseline:

- dashboard accrual estimates: near-real-time or weekly;
- accounting close: monthly;
- residual settlement: monthly initially;
- quarterly true-up;
- annual tax/accounting reconciliation.

Weekly cash settlement may later be enabled for mature products with adequate reserves and accounting automation.

## 20. Economic transparency dashboard

LocalBrain/FoundryOS should eventually show each authorized participant:

- ownership ledger where applicable;
- vested/unvested awards;
- accepted phases;
- Phase Value Points;
- cash earned/settled;
- products participated in;
- residual percentage by product;
- current product revenue/cost waterfall at permitted detail;
- accrued DPR;
- reserve/true-up status;
- next capability level requirements.

This transparency is part of the cultural model: builders should be able to see how their accepted production creates economic value.

## 21. Foundry economics dashboard

Management view should show:

- cash runway;
- payroll burn;
- server/compute utilization and cost;
- product ARR/MRR;
- gross margin;
- DPR by product;
- company residual retained;
- team residual obligations;
- phase compensation committed;
- fully diluted cap table;
- incentive pool remaining;
- revenue per builder;
- accepted Phase Value Points per builder/team;
- time from Master Plan admission to beta;
- time from beta to first dollar;
- product kill/hold/accelerate status.

## 22. Anti-gaming rules

The economic engine must reward value, not code volume.

Do not reward:

- lines of code;
- unnecessary complexity;
- splitting one phase into artificial micro-phases;
- self-acceptance of work;
- generated code that is untested/unmaintainable;
- shipping security debt to gain phase credit;
- recruiting headcount without productive need.

Acceptance authority must be independent enough to reject weak work, and material phases require tests/build/deployment evidence appropriate to the product.

## 23. Financing and dilution simulator

CF-005 software should eventually let founders enter:

- current fully diluted cap table;
- proposed investment amount;
- pre-money or post-money valuation;
- new option-pool target;
- SAFE/note conversion assumptions if ever used;
- financing round size;

and immediately see post-financing ownership/dilution.

This simulator is advisory until counsel/finance approve actual transactions.

## 24. Company residual portfolio effect

The company minimum creates a compounding Foundry engine.

If ten Capstone products each produce $20,000 monthly DPR and the company averages a 30% residual allocation, the company receives $60,000/month from those product residuals before considering revenue from company-owned non-Capstone products, services, licensing, or other ventures.

Those retained economics can finance new apprentices, compute, marketing, legal work, and new Capstones without requiring every growth cycle to be externally funded.

## 25. CF-004 controls

No implementation may:

- promise 51% ownership because of a Capstone;
- reduce Company Foundry below 25% of Capstone DPR;
- apply the Capstone formula to a project without an accepted Master Build Plan and Capstone admission;
- issue parent equity without formal authorization;
- classify a worker based only on ownership or payment method;
- change a signed residual denominator retroactively without the agreement's amendment process;
- treat gross revenue as residual;
- hide shared-service charges from participants;
- treat an $8,000 server contribution as a fixed ownership percentage without approved capitalization terms.

## 26. CF-004 closeout

**PASS.**

The Foundry now has a conceptual economic engine capable of supporting co-owners who are separately paid for production, paid apprentices, phase-priced builders, selective parent equity, Capstone team residuals, and a minimum company residual that recursively finances the factory.

## 27. Next slice — CF-005

**CF-005 — Builder Academy + Phase Value System**

Build:

1. finite apprenticeship curriculum;
2. Steve's AI-assisted build methodology as a teachable operating protocol;
3. capability ladder and graduation gates;
4. Phase Value Score rubric and bands;
5. phase acceptance workflow;
6. Capstone Master Plan template;
7. team formation/recruiting mechanics;
8. 90-day post-graduation production standard;
9. builder performance/capability ledger schema;
10. anti-gaming/quality/security gates;
11. residual allocation workflow;
12. LocalBrain dashboard requirements for the Builder Academy.
