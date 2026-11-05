import { describe, it, expect } from "vitest";
import { formatTime, toMarkdown, toText } from "../../src/translate/services/exporter.js";

const session = {
  title: "Linear algebra",
  createdAt: Date.UTC(2026, 10, 5, 10, 0),
  durationMs: 3725000,
  targetLang: "ru",
  paragraphs: [
    { startMs: 0, original: " Shalom", translation: " Привет" },
    { startMs: 65000, original: "Matrix", translation: "Матрица" },
  ],
  summary: { markdown: "## Суть\nМатрицы." },
};

describe("exporter", () => {
  it("formats times", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(65000)).toBe("01:05");
    expect(formatTime(3725000)).toBe("1:02:05");
  });

  it("exports markdown with summary and both columns", () => {
    const md = toMarkdown(session, { summary: "Саммари", transcript: "Расшифровка" });
    expect(md).toContain("# Linear algebra");
    expect(md).toContain("## Саммари\n\n## Суть\nМатрицы.");
    expect(md).toContain("**[01:05]** Матрица\n\n> Matrix");
  });

  it("exports markdown without summary", () => {
    const md = toMarkdown({ ...session, summary: null }, { summary: "S", transcript: "T" });
    expect(md).not.toContain("## S");
  });

  it("exports plain translated text", () => {
    expect(toText(session)).toBe("Linear algebra\n\n[00:00] Привет\n\n[01:05] Матрица\n");
  });
});
