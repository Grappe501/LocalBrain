# CF-003 — Foundry Corporate + IP Architecture

**Status:** COMPLETE — planning architecture, counsel gate required
**Date:** 2026-08-28
**Parent:** Company Foundry Master Plan
**Previous:** CF-002 Portfolio Audit

## 1. Purpose

Create a durable corporate/IP/compensation architecture for the Company Foundry before additional people create material intellectual property or receive equity/economic promises.

This document is a **founder planning blueprint, not legal or tax advice**. Formation documents, securities issuances, employment agreements, restrictive covenants, tax elections, and IP transfers require qualified counsel and tax/accounting review.

## 2. Recommended baseline structure

### Parent Operating Company — preferred starting point

Create one for-profit parent operating company that owns or controls:

- Company Foundry brand and operating method
- FoundryOS/internal production infrastructure
- shared code libraries and reusable primitives
- LocalBrain Company Foundry control-plane materials
- employment/training system IP
- product trademarks/domains where assigned
- product source code created after valid company IP assignment
- central compute/server infrastructure
- security, finance, legal, HR, and shared services

### Product ventures

Initially operate most products as internally tracked product lines with separate product ledgers and economic pools rather than immediately forming a legal subsidiary for every idea.

A separate subsidiary becomes appropriate when one or more of these gates are met:

1. outside financing requires ring-fenced ownership;
2. regulatory/liability exposure is materially different;
3. a strategic partner needs product-specific ownership;
4. sale/spinout is reasonably foreseeable;
5. tax/accounting counsel recommends separation;
6. product economics can support separate administration.

This avoids creating dozens of empty entities while preserving an eventual venture-studio structure.

## 3. Arkansas versus Delaware decision gate

Do **not** lock the jurisdiction merely because operations begin in Arkansas.

### Arkansas entity advantages

- operational simplicity for an Arkansas-centered early company;
- direct state formation and administration;
- appropriate for a closely held business if outside institutional financing is not imminent.

### Delaware C-corporation advantages to evaluate

- familiar institutional venture-capital governance;
- mature corporate case law;
- conventional preferred-stock financing architecture;
- easier investor familiarity if outside venture financing becomes central.

### Decision

Counsel/CPA should compare at minimum:

- Arkansas corporation
- Arkansas LLC taxed as partnership or corporation where appropriate
- Delaware C-corporation registered to transact business in Arkansas

The Secretary of State itself recommends professional legal/tax advice when selecting entity form. The Foundry should select based on financing, tax, control, equity-compensation, and liability goals rather than filing fee alone.

## 4. Proposed governance architecture

### Founder Board / Board of Directors

The board controls ultimate company governance, equity authorization, major financings, executive appointments, acquisitions/sales, new subsidiaries, and major IP dispositions.

### CEO

Proposed role for Dr. Chris Jones, subject to negotiated appointment and due diligence. CEO domain should include capital strategy, external partnerships, executive leadership, organizational development, major recruiting, and commercialization coordination.

### Founder / Chief Product & Foundry Architect

Proposed role for Steve Grappe: portfolio vision, product doctrine, Foundry build methodology, product admission, master build architecture, technical/product acceptance system, reusable system design, and strategic product integration.

### Technical leadership

Do not assume a traditional CTO role must immediately belong to one person. Initially distinguish:

- Foundry architecture
- infrastructure/security
- product engineering
- AI/model infrastructure
- QA/release engineering

These may later consolidate under a CTO when the company has sufficient scale.

### Mark London

Proposed initial classification: founding capital/equipment contributor plus builder candidate. Any executive title or founder-level governance rights should arise from a separate documented decision rather than automatically from the server purchase.

## 5. Existing IP Contribution Ledger

Before a repository becomes commercial company property, create one **IP Contribution Record**.

Required fields:

- asset/product/repository name
- GitHub repository and local canonical path
- original creator(s)
- dates of material creation
- current legal owner if known
- whether built for a campaign, nonprofit, client, employer, coalition, grant, or personal project
- third-party open-source dependencies/licenses
- third-party datasets/content/licenses
- trademarks/domains/accounts
- secrets/API credentials excluded from transfer
- personal/campaign/nonprofit data that must never transfer
- transferable source-code components
- documentation/design assets
- transfer mechanism: assignment, exclusive license, nonexclusive license, clean-room rewrite, or do-not-use
- representations/uncertainties
- counsel approval status

### Critical rule

**Code being in Steve's GitHub account does not by itself prove that a new company owns all rights to commercialize it.**

Campaign-specific repositories, nonprofit work, client work, contributor code, data licenses, and third-party materials must be separated before transfer.

## 6. Clean extraction rule

For products derived from politically or organizationally specific systems — especially CampaignOS/RedDirt, VoteMatch, civic systems, and county/field tools — commercial extraction should follow this pipeline:

1. inventory reusable architecture;
2. identify restricted/tenant-specific data and content;
3. exclude secrets and production credentials;
4. identify external licenses and terms;
5. document original ownership/provenance;
6. isolate generic code into company-owned modules only after valid assignment/license;
7. create a clean demo/test dataset;
8. build a neutral commercial brand/configuration;
9. security review;
10. counsel signoff where election/campaign rules matter.

## 7. Contribution categories

Every founder/contributor contribution is classified separately.

### A. Cash capital
Cash invested into the company under a documented financing or founder-purchase instrument.

### B. Equipment/property
Hardware, domains, intellectual property, or other property transferred or licensed to the company at a documented value and under explicit terms.

### C. Existing intellectual property
Assigned or licensed under a written IP contribution agreement after provenance review.

### D. Future services
Labor, management, coding, sales, fundraising, recruiting, and product leadership compensated under employment/contract/equity arrangements. Future labor is **not automatically treated as cash capital**.

### E. Network/reputation/intangibles
Valuable but difficult to price. These influence negotiated founder/executive equity and vesting, but should not be casually assigned dollar values without agreement.

## 8. Mark London's proposed server contribution

Working process:

1. Obtain purchase invoice and exact specifications.
2. Determine whether Mark buys the equipment personally and contributes it, loans it, leases it, or causes the company to purchase it.
3. Record fair/documented contribution value.
4. Transfer title to the company if it is an equity/property contribution.
5. Record serial numbers, warranty, insurance, depreciation/tax treatment, and physical custody.
6. Keep this **capital contribution ledger separate from Mark's builder-performance ledger**.

Possible structures for counsel/CPA comparison:

- equipment purchased in exchange for founder shares;
- equipment contribution to LLC capital account;
- founder loan to company followed by company purchase;
- equipment lease/use agreement;
- reimbursable organizational/startup expense if appropriate.

**Not adopted:** "$8,000 equals X% of the company" without agreed company valuation/capitalization mechanics.

## 9. Capitalization architecture

### Share count is a unit system, not ownership economics

The company may authorize a large number of shares for administrative granularity. Whether that is 1,000,000, 10,000,000, or another number does not itself determine company value.

Ownership percentage = fully diluted securities held / fully diluted securities outstanding.

### Required capitalization buckets to model

CF-004 should model scenarios for:

- founder shares
- CEO/executive allocation
- founding contributor allocation
- employee/builder equity incentive pool
- future outside financing reserve/dilution
- advisor allocation
- acquisition/strategic reserve if desired

No bucket is final in CF-003.

### Founder vesting

Even founding equity should be evaluated for vesting/repurchase mechanics so that a person who commits to a long-term operating role cannot leave almost immediately while retaining the same economics as a founder who continues building for years.

Potential baseline for counsel modeling: time-based vesting with acceleration rules plus credit for substantial pre-company IP/capital contributions where justified.

## 10. Compensation instrument library

The Foundry requires multiple independent compensation levers.

### Instrument 1 — Cash wage/hourly pay
Best for apprentices, operations, required labor, and predictable work. Initial founder concept: $20/hour paid training/internship, subject to wage/hour and classification review.

### Instrument 2 — Fixed phase payment
A pre-priced amount released after objective phase acceptance. Appropriate for contractors or graduates working project phases.

### Instrument 3 — Parent-company equity incentive
Restricted stock, options, or another counsel-approved instrument. Best reserved for people whose contribution increases the long-term value of the entire Foundry, not just one project.

### Instrument 4 — Product Economic Units (PEUs)
Contractual units tied to a specifically defined product economic pool. PEUs do not necessarily convey voting rights or ownership of source-code IP.

### Instrument 5 — Revenue royalty
A specified percentage of defined collected product revenue for a defined term/cap/condition.

### Instrument 6 — Profit participation
A percentage of defined distributable product profit after explicitly listed costs/reserves.

### Instrument 7 — Performance bonus
Cash/equivalent paid for objective targets such as launch, revenue, uptime, customer adoption, or accepted build output.

These instruments can be combined only under a signed phase compensation record.

## 11. Phase Value Record

Each paid build phase should eventually have a machine-readable record containing:

- phase ID
- product ID
- scope
- acceptance criteria
- estimated complexity
- dependencies
- security/legal risk
- assigned builder(s)
- reviewer/acceptor
- cash value
- parent-equity value if any
- PEU/product-pool value if any
- royalty/profit-share value if any
- vesting/earning condition
- rejection/rework rules
- accepted commit/build/deployment evidence
- acceptance date

### Why this matters

This turns "vibe coding" into auditable production economics. The company pays for verified capability and accepted product value rather than raw lines of code or hours alone after graduation.

## 12. Builder Academy economic model

### Stage 1 — Apprentice

- employee or other counsel-approved classification;
- paid hourly;
- no assumption that every apprentice receives company equity;
- structured curriculum plus real production tasks;
- work created within role assigned to company under written IP/invention agreement.

### Stage 2 — Qualified Builder

- demonstrates independent accepted-phase capacity;
- may receive phase pricing;
- may be eligible for product economic participation;
- parent equity remains selective.

### Stage 3 — Venture Builder

- can own product outcomes, mentor teams, estimate phases, handle architecture, and deliver commercially accepted systems;
- eligible for larger PEU/product-founder pools and potentially parent equity.

### Stage 4 — Product Lead / Venture Founder

- owns accountable product P&L/outcomes within company governance;
- can recruit/build a team;
- can qualify for very substantial product economics;
- parent retains agreed IP/control unless a later spinout transaction changes ownership.

## 13. 51% capstone concept — refined

The proposed 51% concept is preserved as an aggressive ownership-incentive idea but defined safely:

A qualifying capstone leader may earn **up to 51% of a designated Product Founder Pool**, not automatically 51% of:

- the parent company;
- all revenue;
- source-code IP;
- a subsidiary's voting stock;
- gross receipts before costs.

The pool agreement must define:

- pool size and denominator;
- what "profit" or distributable cash means;
- direct product expenses;
- shared-services allocation;
- AI/compute costs;
- sales/refunds/taxes/chargebacks;
- reserves;
- company recoupment of launch capital if used;
- vesting and continuing production thresholds;
- treatment on leave/termination;
- treatment if product is sold;
- treatment if product is merged into another venture;
- audit/reporting rights;
- whether participation expires or persists.

The goal is **founder-scale upside without accidental fragmentation of IP or control**.

## 14. Residual income architecture

Do not promise "1% of residual income" without specifying a denominator.

Create product ledgers with a waterfall such as:

**Collected revenue**
− refunds/chargebacks/taxes
− direct infrastructure/API/data costs
− customer support/payment processing
− product-specific sales/marketing
− agreed Foundry shared-services allocation
− required reserve
= **Distributable Product Profit**

Then apply the authorized Product Economic Pool.

Alternative products may use revenue royalties rather than profit pools when simpler and defensible.

## 15. Weekly payout concept

Weekly residual payouts are operationally possible but may create cash-flow, accounting, tax, refund, and reserve problems. Recommended baseline:

- calculate continuously internally;
- report dashboard estimates frequently;
- distribute on a monthly or quarterly settlement cycle unless finance determines weekly settlement is prudent;
- preserve reserve/true-up rights.

The psychological benefit of visible weekly earnings can still be delivered through accrued dashboards without draining working capital every seven days.

## 16. Builder recruitment incentive

Builders may be rewarded for recruiting qualified team members, but compensation must not resemble payment primarily for recruiting people into an investment/equity scheme.

Preferred structure:

- referral bonus for a hired/qualified candidate;
- team leadership compensation for managing accepted production;
- product economics based on product output/results;
- never require a recruit to purchase equity or pay to participate as a condition of employment.

## 17. Securities and equity gate

Company equity is a security. Informal statements like "this phase earns 1/10 of a share" should not be used until the company has a board-approved equity plan and counsel-approved issuance mechanics.

For a private company, Rule 701 may provide a federal registration exemption for certain compensatory securities issued under written compensation arrangements to employees, consultants, and advisors, subject to eligibility, limits, and disclosure rules. State securities law may still apply.

Every equity issuance must have:

- board/company authorization;
- signed agreement;
- recipient eligibility;
- documented number/type of securities;
- fair-market/tax analysis where required;
- vesting/exercise/purchase terms;
- cap-table recording;
- securities exemption/filing analysis;
- tax notices/elections where applicable.

Restricted property recipients may need to consider an IRS §83(b) election within a short statutory window; this requires personal tax advice and a repeatable company notification process.

## 18. Restrictive covenant / post-exit protection

Arkansas law currently recognizes employment non-competes when they protect a legitimate business interest and are not broader in time/scope than necessary; the statute identifies interests including trade secrets, IP, customer information, methods, confidential practices, and employee training. It also contains a presumption regarding a two-year post-termination period, while other agreements such as NDAs and non-solicitation are treated separately.

### Foundry policy

Do not rely on one giant punitive non-compete.

Use a layered protection system:

1. invention and IP assignment;
2. confidentiality/NDA;
3. trade-secret policy and access controls;
4. repository permissions and least privilege;
5. return/deletion/certification of company information;
6. customer/employee non-solicitation where counsel approves;
7. narrowly tailored non-compete only where justified and enforceable;
8. vesting/forfeiture/repurchase mechanics for unearned incentives;
9. product-pool agreements that condition continued economics on agreed obligations where lawful;
10. enforcement of unauthorized copying/misappropriation under applicable IP/trade-secret law.

### Rejected as automatic doctrine

"The company gets 75% of anything a former builder sells for two years."

That is too blunt to encode as a universal rule. Counsel can design protection for company opportunities, inventions, confidential methods, competitive products, customer relationships, or IP-derived ventures without assuming the company owns three quarters of unrelated post-employment work.

## 19. Contractor versus employee gate

The company should not label people "contract labor" merely because payment is by phase. Classification depends on the real relationship and applicable law.

The Builder Academy is especially likely to need careful employee/wage treatment where the company controls training, schedule/process, tools, supervision, and production work.

Counsel/payroll review is required before cohort launch.

## 20. AI-assisted code provenance policy

Because the Foundry method relies heavily on AI-assisted development:

- every repository must have an approved dependency/license policy;
- no proprietary third-party source may be pasted into AI or copied without rights;
- builders must record material external code/assets;
- AI-generated output is reviewed for security, license contamination, correctness, and provenance concerns;
- secrets/customer data must never be casually placed in consumer AI tools;
- company-approved AI providers and data-handling modes are centrally managed;
- important human architectural/acceptance decisions are recorded.

The moat should be the operating method, datasets/knowledge legally controlled, integration architecture, product insight, and accumulated systems — not an assumption that raw AI-generated code is uniquely protectable.

## 21. Campaign/nonprofit/client firewall

Create a formal **Commercial Extraction Firewall**:

- no voter/customer/donor/personally identifying data transferred without lawful basis;
- no campaign funds/assets treated casually as founder property;
- no nonprofit/coalition/grant work presumed transferable;
- no client confidential information used to train or seed commercial products;
- generic architecture must be documented separately from tenant/client content;
- contracts and funding restrictions reviewed before reuse;
- test/demo systems use synthetic or properly licensed data.

## 22. GPU server ownership + access

Once company-owned/controlled, the Foundry server should have:

- asset register entry;
- company administrator accounts;
- encrypted storage where appropriate;
- segmented product environments;
- access logging;
- backup/recovery plan;
- secrets management;
- model/license inventory;
- compute attribution by product/team;
- acceptable-use and privacy rules;
- no assumption that every trainee receives unrestricted access to every venture/data store.

## 23. Required legal document stack

Counsel should ultimately produce or approve:

### Corporate
- formation documents
- bylaws/operating agreement
- founder stock/unit purchase agreements
- board/action consents
- capitalization table
- equity incentive plan
- securities exemption/filing process

### Founders/executives
- founder IP contribution/assignment/license agreements
- executive employment/service agreements
- vesting/repurchase terms
- confidentiality/invention assignment
- conflict-of-interest policy

### Apprentices/builders
- employment or contractor agreement as legally appropriate
- wage/milestone terms
- NDA/confidentiality
- invention/IP assignment
- acceptable-use/security policy
- repository/data access policy
- phase compensation addenda
- product economic participation agreement when applicable
- separation/return-of-property obligations

### Products
- privacy policy/terms
- customer agreement
- DPA/security terms where needed
- sector-specific disclaimers/compliance terms
- open-source attribution/license compliance

## 24. Finance/accounting architecture

From day one, accounting should separately track:

- parent-company operating expenses;
- founder capital contributions;
- loans;
- hardware/fixed assets;
- product direct costs;
- AI/API/compute costs by product;
- labor by product/phase;
- shared Foundry overhead allocation;
- product revenue;
- product economic-pool liability/accrual;
- equity grants separately from cash compensation;
- taxes/payroll obligations.

This is necessary to make residual profit sharing credible rather than discretionary.

## 25. CF-003 gates

### GREEN — adopted architecture

- one parent company as baseline;
- product lines first, subsidiaries when justified;
- IP provenance ledger before transfer;
- cash/property/service contributions separated;
- server contribution separated from earned builder compensation;
- parent equity separated from product economics;
- Product Economic Units/pools concept;
- phase-value records;
- 51% interpreted as a product founder pool concept;
- layered IP/trade-secret protections;
- commercial-extraction firewall;
- no cohort before legal/payroll/IP foundation.

### YELLOW — requires counsel/CPA design

- Arkansas versus Delaware/entity form;
- founder allocations;
- Chris Jones executive/equity package;
- Mark London capital/equity terms;
- authorized share count;
- vesting schedules;
- Rule 701 or other securities exemptions;
- non-compete/non-solicit language;
- employee/contractor classifications;
- tax treatment of PEUs/profit participation.

### RED — do not implement yet

- undocumented equity promises;
- 75% blanket claim on former builders' unrelated projects;
- calling trainees contractors solely to avoid payroll rules;
- transferring campaign/nonprofit/client data/IP without provenance review;
- weekly profit payouts without defined accounting waterfall/reserves;
- uncapped dilution from "shares per phase";
- product leaders personally owning repositories/secrets without company controls.

## 26. CF-004 — next slice

**Founder Capitalization + Economic Engine**

CF-004 should model multiple founder/capitalization scenarios without choosing percentages prematurely. It will define:

1. capitalization table scenarios;
2. founder pre-company IP valuation/credit framework;
3. cash/equipment contribution framework;
4. executive vesting scenarios;
5. Builder Equity Pool size scenarios;
6. Product Founder Pool/PEU mathematics;
7. phase pricing/value algorithm;
8. dilution simulations through seed financing;
9. product-profit waterfall examples;
10. founder control/governance scenarios;
11. what happens when a product succeeds, fails, is sold, or spins out.

## Closeout

**CF-003: PASS — ARCHITECTURE COMPLETE / PROFESSIONAL REVIEW REQUIRED BEFORE EXECUTION.**

The Foundry now has a coherent way to protect its IP while giving builders meaningful ownership economics. The central design principle is separation: **capital is not labor; parent equity is not product profit participation; code possession is not IP ownership; share count is not value; and aggressive upside does not require surrendering the Foundry's core IP.**
