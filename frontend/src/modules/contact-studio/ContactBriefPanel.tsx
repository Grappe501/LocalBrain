import { useCallback, useEffect, useState } from "react";
import type { ContactBrief } from "@localbrain/shared";
import { fetchContactBrief, regenerateContactBriefApi } from "../../api/contactBrief";

type Props = {
  contactId: string;
  disabled?: boolean;
};

export function ContactBriefPanel({ contactId, disabled }: Props) {
  const [brief, setBrief] = useState<ContactBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBrief(await fetchContactBrief(contactId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load contact brief");
      setBrief(null);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !brief) {
    return <p className="contact-dept__empty">Loading contact brief…</p>;
  }

  return (
    <section className="contact-brief">
      <div className="contact-brief__header">
        <h3>Contact brief</h3>
        <button
          type="button"
          className="contact-dept__secondary"
          disabled={disabled || saving}
          onClick={() => {
            setSaving(true);
            void regenerateContactBriefApi(contactId)
              .then(setBrief)
              .catch((e) => setError(e instanceof Error ? e.message : "Regenerate failed"))
              .finally(() => setSaving(false));
          }}
        >
          Regenerate
        </button>
      </div>
      <p className="contact-dept__meta">CONTACT-V3-020 · advisory only · summarize, don't speculate</p>
      {error ? <p className="contact-dept__error">{error}</p> : null}

      {brief ? (
        <>
          <p className="contact-brief__notice">{brief.notice}</p>
          {brief.executive_summary ? (
            <div className="contact-brief__executive">
              <h4>Executive summary</h4>
              <p>{brief.executive_summary}</p>
            </div>
          ) : (
            <p className="contact-dept__empty">Insufficient evidence for an executive summary.</p>
          )}

          <div className="contact-brief__sections">
            {brief.sections.map((section) => (
              <article key={section.section_id}>
                <h4>{section.title}</h4>
                {section.withheld ? (
                  <p className="contact-dept__empty">{section.withheld_reason}</p>
                ) : (
                  <p>{section.body}</p>
                )}
              </article>
            ))}
          </div>

          {brief.opportunities.length > 0 ? (
            <div className="contact-brief__recs">
              <h4>Opportunities</h4>
              <ul>
                {brief.opportunities.map((rec) => (
                  <li key={rec.recommendation_id}>
                    <strong>{rec.title}</strong> · {rec.confidence} confidence
                    <p>{rec.rationale}</p>
                    <details>
                      <summary>Why?</summary>
                      <p>{rec.why}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {brief.risks.length > 0 ? (
            <div className="contact-brief__recs contact-brief__recs--risk">
              <h4>Risks</h4>
              <ul>
                {brief.risks.map((rec) => (
                  <li key={rec.recommendation_id}>
                    <strong>{rec.title}</strong> · {rec.confidence} confidence
                    <p>{rec.rationale}</p>
                    <details>
                      <summary>Why?</summary>
                      <p>{rec.why}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {brief.recommendations.length > 0 ? (
            <div className="contact-brief__recs">
              <h4>Recommended next steps</h4>
              <ul>
                {brief.recommendations.map((rec) => (
                  <li key={rec.recommendation_id}>
                    <strong>{rec.title}</strong> · {rec.confidence} confidence
                    <details>
                      <summary>Why?</summary>
                      <p>{rec.why}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <details className="contact-brief__evidence">
            <summary>Evidence ({brief.evidence.length})</summary>
            <ul>
              {brief.evidence.map((item) => (
                <li key={item.citation_id}>
                  [{item.engine_id}] {item.label} — {item.detail}
                </li>
              ))}
            </ul>
          </details>

          <p className="contact-dept__meta">
            Generated {brief.metadata.generated_at.slice(0, 19)} · regen #{brief.metadata.regeneration_count} · engines:{" "}
            {brief.metadata.source_engines.join(", ") || "none"}
          </p>
        </>
      ) : null}
    </section>
  );
}
