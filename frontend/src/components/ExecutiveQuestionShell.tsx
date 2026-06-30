import { getRelatedLinksForRoute } from "@localbrain/shared";
import { LiveSurfaceBanner } from "./LiveSurfaceBanner";
import { ExecutiveCrossLinks, ExecutiveQuestionHeader } from "./ExecutiveQuestionHeader";
import { MigrationPipelineStrip } from "./MigrationPipelineStrip";
import { WorkflowNavigation } from "./WorkflowNavigation";

type Props = {
  route: string;
  observedAt?: string;
  showCrossLinks?: boolean;
};

/** Live surface + EQ header + graph-derived workflow nav (LB-OS-026.6) */
export function ExecutiveQuestionShell({ route, observedAt, showCrossLinks = true }: Props) {
  const links = getRelatedLinksForRoute(route);
  const isMigration = route.startsWith("/migration");

  return (
    <>
      <LiveSurfaceBanner route={route} observedAt={observedAt} />
      <ExecutiveQuestionHeader route={route} />
      {isMigration ? <MigrationPipelineStrip route={route} /> : null}
      <WorkflowNavigation route={route} />
      {showCrossLinks && links.length > 0 ? (
        <ExecutiveCrossLinks links={links} />
      ) : null}
    </>
  );
}
