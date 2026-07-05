import { Link } from "react-router-dom";
import {
  CAMPAIGN_NEXT_VALID_INPUT,
  CAMPAIGN_RESERVED_SUBSYSTEMS,
  CAMPAIGN_TRUST_DOMAINS,
  EXECUTIVE_NAVIGATION,
  INSTITUTION_MAP_RESERVATION,
  workbenchDocHref,
  workbenchRouteHref,
} from "@localbrain/shared";

export function CampaignOperatingSystemPanel() {
  return (
    <section
      className="epo-campaign-os"
      id="campaign-institution-os"
      aria-label="Executive Navigation Model"
    >
      <header className="epo-campaign-os__header">
        <h2>Executive Navigation Model</h2>
        <p className="epo-campaign-os__subtitle">
          Routes answer executive questions — not module names. Program Office is the institution cockpit.
          Documentation is navigable from inside the product. The platform is waiting on people, not engineering.
        </p>
        <p className="epo-campaign-os__links">
          <Link to={workbenchDocHref("docs/platform/EXECUTIVE-NAVIGATION-MODEL.md")}>
            Read navigation doctrine
          </Link>
        </p>
      </header>

      <table className="epo-campaign-os__nav-table">
        <thead>
          <tr>
            <th>Executive question</th>
            <th>Trust domain</th>
            <th>Route</th>
          </tr>
        </thead>
        <tbody>
          {EXECUTIVE_NAVIGATION.map((row) => (
            <tr key={row.route}>
              <td>
                <strong>{row.executive_question}</strong>
              </td>
              <td>{row.trust_domain}</td>
              <td>
                <Link to={workbenchRouteHref(row.route)}>{row.route}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <article className="epo-campaign-os__next">
        <h3>Next valid input — not a new module</h3>
        <p>{CAMPAIGN_NEXT_VALID_INPUT.summary}</p>
        <p className="epo-campaign-os__links">
          {CAMPAIGN_NEXT_VALID_INPUT.route ? (
            <Link to={workbenchRouteHref(CAMPAIGN_NEXT_VALID_INPUT.route)}>Institution cockpit</Link>
          ) : null}
          {CAMPAIGN_NEXT_VALID_INPUT.doc_path ? (
            <>
              {" · "}
              <Link to={workbenchDocHref(CAMPAIGN_NEXT_VALID_INPUT.doc_path)}>PRL-4 Exit Contract</Link>
            </>
          ) : null}
          {" · "}
          <Link to={workbenchDocHref("docs/platform/PLATFORM-CONSTITUTION.md")}>Platform Constitution</Link>
        </p>
      </article>

      <h3 className="epo-governed__subtitle">Live — answer these questions</h3>
      <div className="epo-governed__capabilities">
        {CAMPAIGN_TRUST_DOMAINS.map((item) => (
          <article key={item.label} className="epo-governed__cap-card epo-governed__cap-card--live">
            <header>
              <strong>{item.executive_question ?? item.label}</strong>
              <span className="epo-governed__cap-status epo-governed__cap-status--production">live</span>
            </header>
            <p className="epo-campaign-os__domain">{item.label}</p>
            <p>{item.summary}</p>
            <p className="epo-campaign-os__links">
              {item.route ? (
                <Link to={workbenchRouteHref(item.route)}>Go there</Link>
              ) : null}
              {item.route && item.doc_path ? " · " : null}
              {item.doc_path ? <Link to={workbenchDocHref(item.doc_path)}>Read doctrine</Link> : null}
            </p>
          </article>
        ))}
      </div>

      <h3 className="epo-governed__subtitle">Reserved — do not build during PRL-4</h3>
      <div className="epo-governed__capabilities">
        {CAMPAIGN_RESERVED_SUBSYSTEMS.map((item) => (
          <article key={item.label} className="epo-governed__cap-card epo-governed__cap-card--reserved">
            <header>
              <strong>{item.label}</strong>
              <span className="epo-governed__cap-status epo-governed__cap-status--reserved">reserved</span>
            </header>
            <p>{item.summary}</p>
            {item.doc_path ? (
              <p className="epo-campaign-os__links">
                <Link to={workbenchDocHref(item.doc_path)}>Read reservation</Link>
              </p>
            ) : null}
          </article>
        ))}
        <article className="epo-governed__cap-card epo-governed__cap-card--reserved">
          <header>
            <strong>{INSTITUTION_MAP_RESERVATION.label}</strong>
            <span className="epo-governed__cap-status epo-governed__cap-status--reserved">
              post-PRL-4
            </span>
          </header>
          <p>{INSTITUTION_MAP_RESERVATION.summary}</p>
          <p className="epo-campaign-os__links">
            <Link to={workbenchDocHref(INSTITUTION_MAP_RESERVATION.doc_path)}>Read reservation</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
