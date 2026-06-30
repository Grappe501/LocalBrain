import { Link } from "react-router-dom";
import { getWorkflowNavigation } from "@localbrain/shared";

type Props = {
  route: string;
};

/** Workflow navigation derived from ENG-CAP-001 — not hardcoded links */
export function WorkflowNavigation({ route }: Props) {
  const projection = getWorkflowNavigation(route);
  if (projection.links.length === 0 && projection.breadcrumbs.length <= 1) return null;

  const workflowLinks = projection.links.filter((l) => l.capability_id !== "CAP-EO-001");
  const backLink = projection.links.find((l) => l.capability_id === "CAP-EO-001");

  return (
    <div className="workflow-nav">
      {projection.breadcrumbs.length > 1 ? (
        <nav className="workflow-nav__breadcrumbs" aria-label="Breadcrumb">
          {projection.breadcrumbs.map((crumb, i) => (
            <span key={crumb.href}>
              {i > 0 ? " / " : null}
              {i < projection.breadcrumbs.length - 1 ? (
                <Link to={crumb.href}>{crumb.label}</Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}

      {projection.workflow_title ? (
        <p className="workflow-nav__workflow">
          Workflow: {projection.workflow_title}
          {projection.position_in_workflow != null && projection.position_in_workflow >= 0
            ? ` · Step ${projection.position_in_workflow + 1}`
            : null}
        </p>
      ) : null}

      {workflowLinks.length > 0 ? (
        <p className="workflow-nav__links migration__link-row">
          {workflowLinks.map((link, i) => (
            <span key={link.capability_id}>
              {i > 0 ? " · " : null}
              <Link to={link.href} title={link.reason}>
                {link.relation === "previous" ? "← " : null}
                {link.title}
                {link.relation === "next" ? " →" : null}
                {link.relation === "prerequisite" ? " (prerequisite)" : null}
              </Link>
            </span>
          ))}
        </p>
      ) : null}

      {backLink ? (
        <p className="workflow-nav__back">
          <Link to={backLink.href}>← Executive Briefing</Link>
        </p>
      ) : null}
    </div>
  );
}
