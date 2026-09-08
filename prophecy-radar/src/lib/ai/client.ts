import { env } from '@/lib/env';

interface CallOptions {
  system?: string;
  maxTokens?: number;
}

/**
 * Thin wrapper around the Anthropic Messages API. Swap this file out to
 * change AI providers — nothing else in /services should know or care
 * which provider is behind AI_API_KEY.
 */
export async function callAI(prompt: string, options: CallOptions = {}): Promise<string> {
  if (!env.aiApiKey) {
    throw new Error('AI_API_KEY is not configured.');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.aiApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: env.aiModel,
      max_tokens: options.maxTokens ?? 1200,
      system: options.system,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI request failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const textBlock = json.content?.find((b: any) => b.type === 'text');
  return textBlock?.text ?? '';
}

/** Calls the AI and parses its reply as JSON, stripping any stray
 * markdown code fences the model might add despite instructions not to. */
export async function callAIForJSON<T>(prompt: string, options: CallOptions = {}): Promise<T> {
  const raw = await callAI(prompt, options);
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as T;
}
