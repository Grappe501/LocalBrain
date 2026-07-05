import type { RelationshipContext } from "@localbrain/shared";

type Props = {
  contexts: RelationshipContext[];
  contextId: string;
  primaryOnly: boolean;
  onContextIdChange: (value: string) => void;
  onPrimaryOnlyChange: (value: boolean) => void;
};

export function ContactContextFilterDrawer({
  contexts,
  contextId,
  primaryOnly,
  onContextIdChange,
  onPrimaryOnlyChange,
}: Props) {
  return (
    <div className="contact-context__filter">
      <label className="contact-dept__field">
        <span>Context filter</span>
        <select value={contextId} onChange={(e) => onContextIdChange(e.target.value)}>
          <option value="">All contacts</option>
          {contexts.map((ctx) => (
            <option key={ctx.context_id} value={ctx.context_id}>
              {ctx.label}
            </option>
          ))}
        </select>
      </label>
      {contextId ? (
        <label className="contact-dept__checkbox">
          <input
            type="checkbox"
            checked={primaryOnly}
            onChange={(e) => onPrimaryOnlyChange(e.target.checked)}
          />
          Primary context only
        </label>
      ) : null}
    </div>
  );
}
