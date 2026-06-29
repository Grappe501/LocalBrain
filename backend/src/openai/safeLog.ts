import { getDatabase } from "../db/database.js";

export function migrateCommandLogTable(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS command_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      intent TEXT NOT NULL,
      action_class TEXT NOT NULL,
      message_preview TEXT NOT NULL DEFAULT '',
      response_preview TEXT NOT NULL DEFAULT '',
      tokens_estimate INTEGER,
      model TEXT,
      key_configured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function preview(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max)}…`;
}

export function logCommandExchange(entry: {
  intent: string;
  action_class: string;
  user_message: string;
  response_message: string;
  tokens_estimate: number | null;
  model: string | null;
  key_configured: boolean;
}): void {
  const safe = {
    intent: entry.intent,
    action_class: entry.action_class,
    message_preview: preview(entry.user_message),
    response_preview: preview(entry.response_message),
    tokens_estimate: entry.tokens_estimate,
    model: entry.model,
    key_configured: entry.key_configured ? 1 : 0,
  };

  getDatabase()
    .prepare(
      `INSERT INTO command_log (
        intent, action_class, message_preview, response_preview,
        tokens_estimate, model, key_configured
      ) VALUES (
        @intent, @action_class, @message_preview, @response_preview,
        @tokens_estimate, @model, @key_configured
      )`,
    )
    .run(safe);

  console.info(
    `[command] intent=${safe.intent} class=${safe.action_class} tokens=${safe.tokens_estimate ?? "?"} key=${safe.key_configured ? "yes" : "no"}`,
  );
}
