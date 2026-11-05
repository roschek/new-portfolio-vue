import { describe, it, expect, vi } from "vitest";
import { summarize, buildPrompt, estimateTokens, SummaryError } from "../../src/translate/services/summarizer.js";
import { probeKey } from "../../src/translate/services/keyProbe.js";

const reply = (status, body) =>
  vi.fn().mockResolvedValue({
    ok: status < 400,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });

const callOf = (fetchImpl) => {
  const [url, init] = fetchImpl.mock.calls[0];
  return { url, init, body: init.body ? JSON.parse(init.body) : null };
};

describe("buildPrompt", () => {
  it("asks for the summary in the target language", () => {
    const { system, user } = buildPrompt({ text: "Shalom", lang: "ru" });
    expect(system).toContain("Russian");
    expect(user).toContain("Shalom");
  });
});

describe("summarize", () => {
  it("calls Gemini and joins the parts", async () => {
    const fetchImpl = reply(200, { candidates: [{ content: { parts: [{ text: "## A" }, { text: "\nB" }] } }] });
    const md = await summarize({ provider: "gemini", key: "g", text: "t", lang: "en", fetchImpl });
    expect(md).toBe("## A\nB");
    const { url, init, body } = callOf(fetchImpl);
    expect(url).toMatch(/generativelanguage\.googleapis\.com\/v1beta\/models\/.+:generateContent$/);
    expect(init.headers["x-goog-api-key"]).toBe("g");
    expect(body.contents[0].parts[0].text).toContain("t");
  });

  it("calls Anthropic with the browser access header", async () => {
    const fetchImpl = reply(200, { content: [{ type: "text", text: "sum" }] });
    expect(await summarize({ provider: "anthropic", key: "a", text: "t", lang: "en", fetchImpl })).toBe("sum");
    const { url, init, body } = callOf(fetchImpl);
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(init.headers["x-api-key"]).toBe("a");
    expect(init.headers["anthropic-dangerous-direct-browser-access"]).toBe("true");
    expect(body.system).toContain("English");
  });

  it("calls OpenAI chat completions", async () => {
    const fetchImpl = reply(200, { choices: [{ message: { content: "sum" } }] });
    expect(await summarize({ provider: "openai", key: "o", text: "t", lang: "en", fetchImpl })).toBe("sum");
    const { url, init, body } = callOf(fetchImpl);
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer o");
    expect(body.messages[0].role).toBe("system");
  });

  it.each([
    [401, {}, "auth"],
    [403, {}, "auth"],
    [429, {}, "rate"],
    [500, {}, "other"],
  ])("maps HTTP %s to %s", async (status, body, kind) => {
    await expect(
      summarize({ provider: "openai", key: "o", text: "t", lang: "en", fetchImpl: reply(status, body) })
    ).rejects.toMatchObject({ kind });
  });

  it("treats Gemini's invalid key 400 as auth", async () => {
    const fetchImpl = reply(400, { error: { details: [{ reason: "API_KEY_INVALID" }] } });
    await expect(summarize({ provider: "gemini", key: "g", text: "t", lang: "en", fetchImpl })).rejects.toMatchObject({ kind: "auth" });
  });

  it("maps a thrown fetch to network", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    const err = await summarize({ provider: "openai", key: "o", text: "t", lang: "en", fetchImpl }).catch((e) => e);
    expect(err).toBeInstanceOf(SummaryError);
    expect(err.kind).toBe("network");
  });

  it("fails on an empty answer", async () => {
    await expect(
      summarize({ provider: "openai", key: "o", text: "t", lang: "en", fetchImpl: reply(200, { choices: [] }) })
    ).rejects.toMatchObject({ kind: "other" });
  });

  it("estimates tokens", () => {
    expect(estimateTokens("abcdefgh")).toBe(2);
  });
});

describe("probeKey", () => {
  it.each(["soniox", "gemini", "anthropic", "openai"])("reports ok for %s", async (name) => {
    expect(await probeKey({ name, key: "k", fetchImpl: reply(200, {}) })).toBe("ok");
  });

  it("reports invalid on 401 and unknown when fetch throws", async () => {
    expect(await probeKey({ name: "openai", key: "k", fetchImpl: reply(401, {}) })).toBe("invalid");
    expect(await probeKey({ name: "gemini", key: "k", fetchImpl: reply(400, {}) })).toBe("invalid");
    expect(await probeKey({ name: "soniox", key: "k", fetchImpl: vi.fn().mockRejectedValue(new TypeError()) })).toBe("unknown");
  });

  it("reports unknown for server errors", async () => {
    expect(await probeKey({ name: "openai", key: "k", fetchImpl: reply(503, {}) })).toBe("unknown");
  });
});
