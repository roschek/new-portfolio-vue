// Plain-text and Markdown export of a saved lecture.

const pad = (n) => String(n).padStart(2, "0");

export function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function toMarkdown(session, labels) {
  const parts = [`# ${session.title}`, `${new Date(session.createdAt).toLocaleString()} · ${formatTime(session.durationMs)}`];
  if (session.summary) parts.push(`## ${labels.summary}\n\n${session.summary.markdown.trim()}`);
  parts.push(`## ${labels.transcript}`);
  for (const p of session.paragraphs) {
    const line = `**[${formatTime(p.startMs)}]** ${p.translation.trim()}`;
    const original = p.original.trim();
    parts.push(original && original !== p.translation.trim() ? `${line}\n\n> ${original}` : line);
  }
  return parts.join("\n\n") + "\n";
}

export function toText(session) {
  const lines = session.paragraphs.map((p) => `[${formatTime(p.startMs)}] ${p.translation.trim()}`);
  return [session.title, ...lines].join("\n\n") + "\n";
}
