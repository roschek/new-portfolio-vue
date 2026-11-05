import { describe, it, expect } from "vitest";
import {
  createTranscript,
  applyTokens,
  detectedLangs,
  countWords,
} from "../../src/translate/services/transcriptBuilder.js";

const orig = (text, start_ms = 0, language = "he", is_final = true) => ({
  text, start_ms, language, is_final, translation_status: "original",
});
const tr = (text, is_final = true) => ({
  text, language: "ru", is_final, translation_status: "translation",
});
const none = (text, start_ms = 0, is_final = true) => ({
  text, start_ms, language: "ru", is_final, translation_status: "none",
});
const end = { text: "<end>", is_final: true };

const texts = (state) =>
  state.paragraphs.map((p) => [p.original.trim(), p.translation.trim()]);

describe("transcriptBuilder", () => {
  it("pairs an original run with its translation", () => {
    const s = applyTokens(createTranscript(), [
      orig("Shalom", 1200), orig(" olam", 1500), end, tr("Привет"), tr(" мир"),
    ]);
    expect(texts(s)).toEqual([["Shalom olam", "Привет мир"]]);
    expect(s.paragraphs[0]).toMatchObject({ startMs: 1200, lang: "he" });
  });

  it("starts a new paragraph when original follows a translation", () => {
    let s = applyTokens(createTranscript(), [orig("A"), tr("А")]);
    s = applyTokens(s, [orig("B", 5000), tr("Б")]);
    expect(texts(s)).toEqual([["A", "А"], ["B", "Б"]]);
    expect(s.paragraphs[1].startMs).toBe(5000);
  });

  it("keeps non-final tokens only in the tail and replaces them", () => {
    let s = applyTokens(createTranscript(), [orig("A"), orig(" b", 0, "he", false)]);
    expect(s.tail).toEqual({ original: " b", translation: "" });
    s = applyTokens(s, [tr("а", false)]);
    expect(s.tail).toEqual({ original: "", translation: "а" });
    expect(texts(s)).toEqual([["A", ""]]);
  });

  it("puts passthrough text into both columns and splits on <end>", () => {
    let s = applyTokens(createTranscript(), [none("Один", 0), none(" два", 300), end]);
    s = applyTokens(s, [none("Три", 4000)]);
    expect(texts(s)).toEqual([["Один два", "Один два"], ["Три", "Три"]]);
  });

  it("splits when the speaker switches between source and target language", () => {
    let s = applyTokens(createTranscript(), [none("Да")]);
    s = applyTokens(s, [orig("Ken"), tr("Да")]);
    s = applyTokens(s, [none("Хорошо")]);
    expect(texts(s)).toEqual([["Да", "Да"], ["Ken", "Да"], ["Хорошо", "Хорошо"]]);
  });

  it("attaches a late translation to the last translated-language paragraph", () => {
    let s = applyTokens(createTranscript(), [orig("Ken")]);
    s = applyTokens(s, [none("Да"), tr("Да")]);
    expect(texts(s)).toEqual([["Ken", "Да"], ["Да", "Да"]]);
  });

  it("creates a paragraph for a translation with no original", () => {
    const s = applyTokens(createTranscript(), [tr("Сироты")]);
    expect(texts(s)).toEqual([["", "Сироты"]]);
  });

  it("applies the time offset after a session restart", () => {
    const s = applyTokens(createTranscript(), [orig("A", 100)], 60000);
    expect(s.paragraphs[0].startMs).toBe(60100);
  });

  it("does not mutate the previous state", () => {
    const first = applyTokens(createTranscript(), [orig("A")]);
    const snapshot = JSON.stringify(first);
    applyTokens(first, [orig(" b"), tr("а")]);
    expect(JSON.stringify(first)).toBe(snapshot);
  });

  it("restores from saved paragraphs", () => {
    const s = createTranscript([{ startMs: 0, lang: "he", original: "A", translation: "А", translated: true, passthrough: false, ended: true }]);
    expect(applyTokens(s, [orig("B"), tr("Б")]).paragraphs).toHaveLength(2);
  });

  it("lists detected languages and counts translated words", () => {
    let s = applyTokens(createTranscript(), [orig("A", 0, "he"), tr("раз два")]);
    s = applyTokens(s, [orig("B", 0, "en"), tr(" три ")]);
    expect(detectedLangs(s.paragraphs)).toEqual(["he", "en"]);
    expect(countWords(s.paragraphs)).toBe(3);
    expect(countWords([])).toBe(0);
  });
});
