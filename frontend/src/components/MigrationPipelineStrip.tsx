import { Link } from "react-router-dom";
import { getMigrationPipelineStrip, getWorkflowNavigation } from "@localbrain/shared";

type Props = {
  route: string;
};

/** Migration lifecycle strip — projection of WF-MIG-001 (ENG-CAP-001) */
export function MigrationPipelineStrip({ route }: Props) {
  const strip = getMigrationPipelineStrip();
  const current = getWorkflowNavigation(route).capability_id;

  return (
    <nav className="migration-pipeline" aria-label="Migration execution pipeline">
      <ol className="migration-pipeline__list">
        {strip.map((step) => (
          <li key={step.capability_id}>
            <Link
              to={step.href}
              className={
                step.capability_id === current
                  ? "migration-pipeline__step migration-pipeline__step--active"
                  : "migration-pipeline__step"
              }
            >
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
