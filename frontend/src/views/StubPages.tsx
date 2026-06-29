import type { ReactNode } from "react";

type StubPageProps = {
  title: string;
  description: string;
  slice?: string;
  extra?: ReactNode;
};

export function StubPage({ title, description, slice, extra }: StubPageProps) {
  return (
    <article className="stub-page">
      <h1>{title}</h1>
      <p>{description}</p>
      {slice ? <p className="stub-page__slice">{slice}</p> : null}
      {extra}
    </article>
  );
}

/** Route `/explorer` — internal name: Knowledge Explorer (LB-OS-005). */
export function KnowledgeExplorerStub() {
  return (
    <StubPage
      title="Knowledge Explorer"
      description="Not a file manager clone — six lenses over workspace roots: Physical, Knowledge, Workspace, Activity, Relationships, and AI. LocalBrain thinks Knowledge Source → Workspace → executive context; you still see folders."
      slice="LB-OS-005 — Knowledge Explorer tree + metadata index"
      extra={
        <ul className="stub-page__list">
          <li>Startup: workspace registry → cached metadata → visible tree → background index</li>
          <li>Search: file: · workspace: prefixes</li>
          <li>Signature: Explain this folder</li>
        </ul>
      }
    />
  );
}

/** @deprecated use KnowledgeExplorerStub */
export const ExplorerStub = KnowledgeExplorerStub;

export function ActionsStub() {
  return (
    <StubPage
      title="Actions"
      description="Approval cockpit for file moves, edits, and sends. Gated by LB-OS-010."
      slice="LB-OS-010 — Approval-gated file management"
    />
  );
}
