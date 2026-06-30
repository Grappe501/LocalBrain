import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CAPABILITY_REGISTRY,
  EXECUTIVE_DEPARTMENTS,
  EXECUTIVE_OFFICE_ENGINE_ID,
  INTELLIGENCE_DOMAINS,
  buildExecutiveOfficeProjection,
  getCapabilitiesForDepartment,
  getDepartmentsForDomain,
  getExecutiveDepartment,
  getIntelligenceDomain,
  resolveDepartmentsForCapability,
  resolveDomainsForCapability,
} from "@localbrain/shared";

describe("ENG-EO-001 executive office structure", () => {
  it("defines executive office separate from departments and domains", () => {
    assert.equal(EXECUTIVE_OFFICE_ENGINE_ID, "ENG-EO-001");
    assert.ok(EXECUTIVE_DEPARTMENTS.length >= 10);
    assert.ok(INTELLIGENCE_DOMAINS.length >= 12);
    const deptIds = new Set(EXECUTIVE_DEPARTMENTS.map((d) => d.department_id));
    const domainIds = new Set(INTELLIGENCE_DOMAINS.map((d) => d.domain_id));
    assert.equal(deptIds.size, EXECUTIVE_DEPARTMENTS.length);
    assert.equal(domainIds.size, INTELLIGENCE_DOMAINS.length);
  });

  it("reserves Chief Knowledge Officer with knowledge domain only", () => {
    const cko = getExecutiveDepartment("DEPT-CKO-001");
    assert.ok(cko);
    assert.equal(cko?.lifecycle, "reserved");
    assert.deepEqual(cko?.intelligence_domain_ids, ["IDN-KNOWLEDGE-001"]);
    assert.ok(cko?.charter.cannot.includes("Approve spending"));
    assert.ok(cko?.objectives.measures_of_success.includes("Low entropy"));
  });

  it("assigns Chief of Staff synthesis role across identity time relationship projects", () => {
    const cos = getExecutiveDepartment("DEPT-COS-001");
    assert.ok(cos?.synthesis_role);
    assert.ok(cos?.intelligence_domain_ids.includes("IDN-IDENTITY-001"));
    assert.ok(cos?.intelligence_domain_ids.includes("IDN-TIME-001"));
    assert.ok(cos?.intelligence_domain_ids.includes("IDN-RELATIONSHIP-001"));
    assert.ok(cos?.intelligence_domain_ids.includes("IDN-PROJECTS-001"));
  });

  it("shares Financial intelligence across CFO and Campaign Director", () => {
    const cfo = getExecutiveDepartment("DEPT-CFO-001");
    const cam = getExecutiveDepartment("DEPT-CAM-001");
    assert.ok(cfo?.intelligence_domain_ids.includes("IDN-FINANCIAL-001"));
    assert.ok(cam?.intelligence_domain_ids.includes("IDN-FINANCIAL-001"));
    assert.notEqual(cfo?.department_id, cam?.department_id);
    const financialOwners = getDepartmentsForDomain("IDN-FINANCIAL-001");
    assert.ok(financialOwners.length >= 2);
  });

  it("maps future capabilities to departments and domains explicitly", () => {
    const gml = CAPABILITY_REGISTRY.find((c) => c.capability_id === "CAP-FUT-GML-001");
    assert.ok(gml);
    const depts = resolveDepartmentsForCapability(gml!);
    const domains = resolveDomainsForCapability(gml!);
    assert.ok(depts.includes("DEPT-COM-001"));
    assert.ok(domains.includes("IDN-IDENTITY-001"));
    assert.ok(domains.includes("IDN-COMMUNICATIONS-001"));
  });

  it("builds office projection with hierarchy and synthesis department", () => {
    const projection = buildExecutiveOfficeProjection();
    assert.equal(projection.slice_id, "LB-OS-026.67");
    assert.equal(projection.synthesis_department_id, "DEPT-COS-001");
    assert.ok(projection.executive_departments.length >= 8);
    assert.ok(projection.intelligence_domains.length >= 12);
    assert.equal(
      projection.hierarchy[0],
      "Executive",
      projection.hierarchy.join(" → "),
    );
    const cos = projection.executive_departments.find((d) => d.synthesis_role);
    assert.ok(cos);
    assert.ok(cos!.owned_domains.length >= 4);
  });

  it("every reserved future capability maps to at least one executive department", () => {
    const planned = CAPABILITY_REGISTRY.filter((c) => c.completion_status === "planned");
    for (const cap of planned) {
      const depts = resolveDepartmentsForCapability(cap);
      assert.ok(depts.length > 0, `${cap.capability_id} has no department`);
      const domains = resolveDomainsForCapability(cap);
      assert.ok(domains.length > 0, `${cap.capability_id} has no intelligence domain`);
    }
  });

  it("Chief of Staff owns briefing inbox future capability", () => {
    const caps = getCapabilitiesForDepartment("DEPT-COS-001");
    assert.ok(caps.some((c) => c.capability_id === "CAP-EO-001"));
    assert.ok(caps.some((c) => c.capability_id === "CAP-FUT-INB-001"));
  });

  it("identity and time domains are reserved cognitive substrates not departments", () => {
    const identity = getIntelligenceDomain("IDN-IDENTITY-001");
    const time = getIntelligenceDomain("IDN-TIME-001");
    assert.equal(identity?.lifecycle, "reserved");
    assert.equal(time?.lifecycle, "reserved");
    assert.ok(!EXECUTIVE_DEPARTMENTS.some((d) => d.title === "Identity"));
    assert.ok(!EXECUTIVE_DEPARTMENTS.some((d) => d.title === "Time"));
  });

  it("Chief of Staff has standing orders and escalation policy", () => {
    const cos = getExecutiveDepartment("DEPT-COS-001");
    assert.ok(cos?.standing_orders.orders.includes("Always protect executive attention."));
    assert.ok(cos?.escalation_policy.remain_silent.includes("unread"));
    assert.ok(cos?.operating_personality.traits.includes("Synthesis-first"));
  });

  it("Communications ignores volume; escalates stakeholder impact", () => {
    const com = getExecutiveDepartment("DEPT-COM-001");
    assert.ok(com?.escalation_policy.remain_silent.toLowerCase().includes("unread"));
    assert.ok(com?.escalation_policy.notify_chief_of_staff.toLowerCase().includes("county"));
    assert.ok(com?.operating_personality.traits.includes("Narrative-aware"));
  });

  it("every department has standing orders, escalation policy, and operating personality", () => {
    for (const dept of EXECUTIVE_DEPARTMENTS) {
      assert.ok(dept.standing_orders.orders.length >= 3, dept.department_id);
      assert.ok(dept.escalation_policy.interrupt_executive.length > 0, dept.department_id);
      assert.ok(dept.operating_personality.traits.length >= 2, dept.department_id);
      assert.ok(dept.operating_personality.influences_reasoning.length > 0, dept.department_id);
    }
  });
});