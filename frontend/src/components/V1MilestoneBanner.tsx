import { Link } from "react-router-dom";
import type { V1AcceptanceReport } from "@localbrain/shared";

type GovernedBanner = {
  platform_readiness_level: string;
  current_gate: string;
  prime_directive: string;
};

type Props = {
  report: V1AcceptanceReport | null;
  governed?: GovernedBanner | null;
};

export function V1MilestoneBanner({ report, governed }: Props) {
  if (!report) return null;

  const rc = report.release_candidate;

  return (
    <section
      className={`v1-banner ${rc ? "v1-banner--ready" : "v1-banner--progress"}`}
      aria-label="Executive OS V1 milestone"
    >
      {governed ? (
        <div className="v1-banner__governed">
          <strong>{governed.prime_directive}</strong>
          <span>
            {governed.platform_readiness_level} · {governed.current_gate}
          </span>
        </div>
      ) : null}
      <div className="v1-banner__head">
        <strong>Executive OS V1</strong>
        <span>
          {report.passed_count}/{report.total_count} spine checks
          {rc ? " · Release candidate" : " · Hardening"}
        </span>
      </div>
      <p className="v1-banner__loop">
        Operational loop: {report.operational_loop.join(" → ")}
      </p>
      <p className="v1-banner__links">
        <Link to="/studio/volunteer">Volunteer Operations</Link>
        {" · "}
        <Link to="/program-office#campaign-institution-os">Executive navigation</Link>
        {" · "}
        <Link to="/program-office">Program Office</Link>
        {" · "}
        <Link to="/studio/contacts">Contacts</Link>
        {" · "}
        <Link to="/studio/ingestion">Identity Acquisition</Link>
        {" · "}
        <Link to="/studio/relationships">Relationships</Link>
        {" · "}
        <Link to="/studio/engineering">Engineering</Link>
        {" · "}
        <Link to="/studio/writing">Writing</Link>
        {" · "}
        <Link to="/studio/data">Data</Link>
        {" · "}
        <Link to="/explorer">Explorer</Link>
        {" · "}
        <Link to="/actions">Actions</Link>
        {" · "}
        <Link to="/system">System</Link>
      </p>
    </section>
  );
}
