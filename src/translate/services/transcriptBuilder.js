// Turns the Soniox real-time token stream into paragraphs that pair the
// original speech with its translation. All functions are pure.

export const END_TOKEN = "<end>";

const emptyTail = () => ({ original: "", translation: "" });

export function createTranscript(paragraphs = []) {
  return { paragraphs: paragraphs.map((p) => ({ ...p })), tail: emptyTail() };
}

function newParagraph(token, offsetMs, passthrough) {
  return {
    startMs: offsetMs + (token.start_ms ?? 0),
    lang: token.language ?? null,
    original: "",
    translation: "",
    passthrough,
    translated: false,
    ended: false,
  };
}

function needsNewParagraph(current, status) {
  if (!current) return true;
  if (status === "none") return current.ended || !current.passthrough;
  return current.translated || current.passthrough;
}

export function applyTokens(state, tokens, offsetMs = 0) {
  const paragraphs = state.paragraphs.slice();
  const tail = emptyTail();
  // Paragraphs are copied lazily, only when touched, to keep updates cheap.
  const touched = new Set();
  const edit = (index) => {
    if (!touched.has(index)) {
      paragraphs[index] = { ...paragraphs[index] };
      touched.add(index);
    }
    return paragraphs[index];
  };

  for (const token of tokens) {
    const status = token.translation_status ?? "none";

    if (token.text === END_TOKEN) {
      if (paragraphs.length) edit(paragraphs.length - 1).ended = true;
      continue;
    }

    if (!token.is_final) {
      if (status !== "translation") tail.original += token.text;
      if (status !== "original") tail.translation += token.text;
      continue;
    }

    if (status === "translation") {
      let index = paragraphs.findLastIndex((p) => !p.passthrough);
      if (index === -1) {
        paragraphs.push(newParagraph(token, offsetMs, false));
        index = paragraphs.length - 1;
      }
      const target = edit(index);
      target.translation += token.text;
      target.translated = true;
      continue;
    }

    if (needsNewParagraph(paragraphs.at(-1), status)) {
      paragraphs.push(newParagraph(token, offsetMs, status === "none"));
      touched.add(paragraphs.length - 1);
    }
    const current = edit(paragraphs.length - 1);
    current.original += token.text;
    if (status === "none") current.translation += token.text;
  }

  return { paragraphs, tail };
}

export function detectedLangs(paragraphs) {
  return [...new Set(paragraphs.map((p) => p.lang).filter(Boolean))];
}

export function countWords(paragraphs) {
  return paragraphs.reduce(
    (sum, p) => sum + (p.translation.trim() ? p.translation.trim().split(/\s+/).length : 0),
    0
  );
}
