import type { ContactContextLinkWithContext } from "@localbrain/shared";

type Props = {
  links: readonly ContactContextLinkWithContext[];
  onPromote?: (linkId: string) => void;
  onEnd?: (linkId: string) => void;
  disabled?: boolean;
};

export function ContactContextChips({ links, onPromote, onEnd, disabled }: Props) {
  if (links.length === 0) {
    return <p className="contact-dept__empty">No relationship contexts assigned.</p>;
  }

  return (
    <ul className="contact-context__chips">
      {links.map((link) => (
        <li key={link.link_id} className="contact-context__chip">
          <span
            className={
              link.rank === "primary"
                ? "contact-context__chip-label contact-context__chip-label--primary"
                : "contact-context__chip-label"
            }
          >
            {link.context.label}
            <em>{link.context.category}</em>
            {link.rank === "primary" ? <strong>Primary</strong> : null}
          </span>
          {onPromote && link.rank !== "primary" ? (
            <button
              type="button"
              className="contact-dept__secondary contact-context__chip-action"
              disabled={disabled}
              onClick={() => onPromote(link.link_id)}
            >
              Make primary
            </button>
          ) : null}
          {onEnd ? (
            <button
              type="button"
              className="contact-dept__secondary contact-context__chip-action"
              disabled={disabled}
              onClick={() => onEnd(link.link_id)}
            >
              End
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
