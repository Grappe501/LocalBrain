import type { ContactContextLinkWithContext } from "@localbrain/shared";

type Props = {
  links: readonly ContactContextLinkWithContext[];
  value: string;
  disabled?: boolean;
  onChange: (contextId: string) => void;
};

export function ContactContextSelector({ links, value, disabled, onChange }: Props) {
  if (links.length === 0) {
    return (
      <p className="contact-dept__meta contact-context__selector-empty">
        No contexts assigned — log without context or assign on Profile tab.
      </p>
    );
  }

  return (
    <label className="contact-dept__field">
      <span>Relationship context (optional)</span>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        <option value="">No context</option>
        {links.map((link) => (
          <option key={link.link_id} value={link.context_id}>
            {link.context.label}
            {link.rank === "primary" ? " (primary)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
