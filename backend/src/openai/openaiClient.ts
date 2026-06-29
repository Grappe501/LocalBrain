import { getModelConfig } from "./modelConfig.js";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatCompletionOptions = {
  apiKey: string;
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
};

export type OpenAiChatResult = {
  content: string;
  model: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
};

export class OpenAiClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "OpenAiClientError";
  }
}

/**
 * Direct OpenAI Chat Completions — **openaiAdapter only** (LB-OS-017).
 * Do not call from business logic; use providers/router.ts.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions,
): Promise<OpenAiChatResult> {
  const key = options.apiKey?.trim();
  if (!key) {
    throw new OpenAiClientError("OPENAI_API_KEY not configured");
  }

  const defaults = getModelConfig();
  const model = options.model ?? defaults.model;
  const maxOutputTokens = options.maxOutputTokens ?? defaults.maxOutputTokens;
  const temperature = options.temperature ?? defaults.temperature;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxOutputTokens,
      temperature,
    }),
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const errBody = (await res.json()) as { error?: { message?: string } };
      detail = errBody.error?.message ?? detail;
    } catch {
      /* ignore parse errors */
    }
    throw new OpenAiClientError(`OpenAI API error: ${detail}`, res.status);
  }

  const data = (await res.json()) as {
    model?: string;
    choices?: { message?: { content?: string } }[];
    usage?: OpenAiChatResult["usage"];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new OpenAiClientError("OpenAI returned empty response");
  }

  return {
    content,
    model: data.model ?? model,
    usage: data.usage,
  };
}
