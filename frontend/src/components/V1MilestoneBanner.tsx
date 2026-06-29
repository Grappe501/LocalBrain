import { Link } from "react-router-dom";
import type { V1AcceptanceReport } from "@localbrain/shared";

type Props = {
  report: V1AcceptanceReport | null;
};

export function V1MilestoneBanner({ report }: Props) {
  if (!report) return null;

  const rc = report.release_candidate;

  return (
    <section
      className={`v1-banner ${rc ? "v1-banner--ready" : "v1-banner--progress"}`}
      aria-label="Executive OS V1 milestone"
    >
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
        <Link to="/program-office">Program Office</Link>
        {" · "}
        <Link to="/studio/engineering">Engineering</Link>
        {" · "}
        <Link to="/studio/writing">Writing</Link>
        {" · "}
        <Link to="/studio/data">Data</Link>
        {" · "}
        <Link to="/studio/relationships">Relationships</Link>
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
