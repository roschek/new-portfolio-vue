// Lecture summary through the user's chosen LLM provider.
import { PROVIDERS } from "./llmProviders.js";
import { languageName } from "../languages.js";

export class SummaryError extends Error {
  constructor(kind, status = null) {
    super(`Summary failed: ${kind}${status ? ` (${status})` : ""}`);
    this.kind = kind; // 'auth' | 'rate' | 'network' | 'other'
    this.status = status;
  }
}

export function buildPrompt({ text, lang }) {
  const language = languageName(lang, "english");
  const system = [
    "You summarize university lectures for a student.",
    "The transcript below was produced by speech recognition and may contain recognition errors; infer the intended meaning.",
    `Write the summary in ${language}, in Markdown, with exactly these sections:`,
    "1. A heading 'Summary' (translated) with 3-5 sentences on what the lecture is about.",
    "2. A heading 'Key points' (translated) with a bullet list of the main ideas.",
    "3. A heading 'Terms' (translated) with a bullet list: term in its original language and spelling — meaning.",
    "4. A heading 'Assignments and dates' (translated), only if the lecturer mentioned homework, deadlines or exams.",
    "Do not invent content that is not in the transcript.",
  ].join("\n");
  return { system, user: `Lecture transcript:\n\n${text}` };
}

export const estimateTokens = (text) => Math.ceil(text.length / 4);

async function classifyResponse(response) {
  if (response.status === 401 || response.status === 403) return "auth";
  if (response.status === 429) return "rate";
  if (response.status === 400 && (await response.text()).includes("API_KEY_INVALID")) return "auth";
  return "other";
}

export async function summarize({ provider, key, text, lang, fetchImpl = fetch }) {
  const adapter = PROVIDERS[provider];
  const [url, init] = adapter.request({ key, ...buildPrompt({ text, lang }) });
  let response;
  try {
    response = await fetchImpl(url, init);
  } catch {
    throw new SummaryError("network");
  }
  if (!response.ok) throw new SummaryError(await classifyResponse(response), response.status);
  const markdown = adapter.parse(await response.json()).trim();
  if (!markdown) throw new SummaryError("other", response.status);
  return markdown;
}
