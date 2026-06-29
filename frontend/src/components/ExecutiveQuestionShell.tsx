import { getRelatedLinksForRoute } from "@localbrain/shared";
import { LiveSurfaceBanner } from "./LiveSurfaceBanner";
import { ExecutiveCrossLinks, ExecutiveQuestionHeader } from "./ExecutiveQuestionHeader";

type Props = {
  route: string;
  observedAt?: string;
  showCrossLinks?: boolean;
};

/** Live surface banner + EQ header + related question links (LB-OS-020.5). */
export function ExecutiveQuestionShell({ route, observedAt, showCrossLinks = true }: Props) {
  const links = getRelatedLinksForRoute(route);
  return (
    <>
      <LiveSurfaceBanner route={route} observedAt={observedAt} />
      <ExecutiveQuestionHeader route={route} />
      {showCrossLinks && links.length > 0 ? (
        <ExecutiveCrossLinks links={links} />
      ) : null}
    </>
  );
}
