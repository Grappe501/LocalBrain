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

export function ExplorerStub() {
  return (
    <StubPage
      title="Explorer"
      description="File explorer is a route — not the left-column spine. Real indexing arrives after LB-OS-005."
      slice="LB-OS-005 — Explorer tree + file metadata"
    />
  );
}

export function ActionsStub() {
  return (
    <StubPage
      title="Actions"
      description="Approval cockpit for file moves, edits, and sends. Gated by LB-OS-010."
      slice="LB-OS-010 — Approval-gated file management"
    />
  );
}
