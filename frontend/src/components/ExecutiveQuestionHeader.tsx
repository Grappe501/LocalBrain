import { Link } from "react-router-dom";
import { matchQuestionForRoute, type ExecutiveQuestion } from "@localbrain/shared";

type Props = {
  route: string;
  owner?: string;
};

export function ExecutiveQuestionHeader({ route, owner }: Props) {
  const question: ExecutiveQuestion | null = matchQuestionForRoute(route);
  if (!question) return null;

  return (
    <div className="eq-header">
      <p className="eq-header__id">{question.question_id}</p>
      <h2 className="eq-header__question">{question.canonical_question}</h2>
      <p className="eq-header__owner">
        Owner: {owner ?? question.owner_department}
      </p>
    </div>
  );
}

type CrossLinksProps = {
  questionId?: string;
  links: { href: string; label: string }[];
  title?: string;
};

export function ExecutiveCrossLinks({ links, title = "Related executive questions" }: CrossLinksProps) {
  if (links.length === 0) return null;
  return (
    <nav className="eq-crosslinks" aria-label={title}>
      <h3 className="eq-crosslinks__title">{title}</h3>
      <ul className="eq-crosslinks__list">
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ExecutiveQuestionHub() {
  const briefing = matchQuestionForRoute("/");
  const links =
    briefing != null
      ? [
          { href: "/program-office", label: "How is the build progressing?" },
          { href: "/system", label: "How healthy is my system?" },
          { href: "/explorer", label: "Where is my information?" },
          { href: "/migration/consolidation", label: "What should I consolidate?" },
          { href: "/actions", label: "What actions need my approval?" },
          { href: "/migration", label: "How should I migrate my world?" },
          { href: "/studio/engineering", label: "How healthy is my engineering work?" },
          { href: "/workspace/localbrain", label: "What projects are drifting?" },
        ]
      : [];
  return <ExecutiveCrossLinks links={links} title="Executive questions — authoritative routes" />;
}
