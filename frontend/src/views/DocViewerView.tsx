import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchEpoDocContent } from "../api/epo";

export function DocViewerView() {
  const [params] = useSearchParams();
  const docPath = params.get("path") ?? "";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docPath) {
      setError("No document path specified.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    void fetchEpoDocContent(docPath)
      .then((doc) => {
        setTitle(doc.title);
        setContent(doc.content);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load document");
      })
      .finally(() => setLoading(false));
  }, [docPath]);

  return (
    <div className="doc-viewer">
      <header className="doc-viewer__header">
        <p className="doc-viewer__back">
          <Link to="/program-office">← Program Office</Link>
        </p>
        <h1>{title || "Documentation"}</h1>
        {docPath ? <code className="doc-viewer__path">{docPath}</code> : null}
      </header>
      {loading ? <p className="doc-viewer__status">Loading…</p> : null}
      {error ? <p className="doc-viewer__error">{error}</p> : null}
      {!loading && !error ? (
        <pre className="doc-viewer__body">{content}</pre>
      ) : null}
    </div>
  );
}
