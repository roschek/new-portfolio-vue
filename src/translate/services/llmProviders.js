// Request builders for the three summary providers. All of them accept
// direct browser calls with the user's own key.

const json = (headers, body) => ({
  method: "POST",
  headers: { "content-type": "application/json", ...headers },
  body: JSON.stringify(body),
});

const ANTHROPIC_HEADERS = (key) => ({
  "x-api-key": key,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
});

export const PROVIDERS = {
  gemini: {
    label: "Google Gemini",
    model: "gemini-flash-latest",
    keyUrl: "https://aistudio.google.com/apikey",
    request({ key, system, user }) {
      return [
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`,
        json({ "x-goog-api-key": key }, {
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
        }),
      ];
    },
    parse: (data) => (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join(""),
    probe: (key) => ["https://generativelanguage.googleapis.com/v1beta/models", { headers: { "x-goog-api-key": key } }],
  },
  anthropic: {
    label: "Anthropic Claude",
    model: "claude-haiku-5-5",
    keyUrl: "https://console.anthropic.com/settings/keys",
    request({ key, system, user }) {
      return [
        "https://api.anthropic.com/v1/messages",
        json(ANTHROPIC_HEADERS(key), {
          model: this.model,
          max_tokens: 4096,
          system,
          messages: [{ role: "user", content: user }],
        }),
      ];
    },
    parse: (data) => (data.content ?? []).filter((b) => b.type === "text").map((b) => b.text).join(""),
    probe: (key) => ["https://api.anthropic.com/v1/models", { headers: ANTHROPIC_HEADERS(key) }],
  },
  openai: {
    label: "OpenAI",
    model: "gpt-5-mini",
    keyUrl: "https://platform.openai.com/api-keys",
    request({ key, system, user }) {
      return [
        "https://api.openai.com/v1/chat/completions",
        json({ Authorization: `Bearer ${key}` }, {
          model: this.model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      ];
    },
    parse: (data) => data.choices?.[0]?.message?.content ?? "",
    probe: (key) => ["https://api.openai.com/v1/models", { headers: { Authorization: `Bearer ${key}` } }],
  },
};
