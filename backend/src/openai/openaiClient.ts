import { getModelConfig, getOpenAiApiKey } from "./modelConfig.js";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
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

/** Direct OpenAI Chat Completions — backend only, no SDK. */
export async function chatCompletion(messages: ChatMessage[]): Promise<OpenAiChatResult> {
  const key = getOpenAiApiKey();
  if (!key) {
    throw new OpenAiClientError("OPENAI_API_KEY not configured");
  }

  const { model, maxOutputTokens, temperature } = getModelConfig();

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
