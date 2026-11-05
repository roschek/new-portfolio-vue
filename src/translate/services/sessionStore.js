// Lecture sessions persisted in IndexedDB. API keys never go here.
import { openDB } from "idb";

const DB_NAME = "lecture-translator";
const STORE = "sessions";

const db = () =>
  openDB(DB_NAME, 1, {
    upgrade(database) {
      database.createObjectStore(STORE, { keyPath: "id" });
    },
  });

// Vue reactive proxies cannot be structured-cloned, so store a plain copy.
const plain = (value) => JSON.parse(JSON.stringify(value));

export async function createSession({ title = "", targetLang, context = { topic: "", terms: [] } }) {
  const session = {
    id: crypto.randomUUID(),
    title,
    createdAt: Date.now(),
    durationMs: 0,
    status: "recording",
    targetLang,
    detectedLangs: [],
    context,
    paragraphs: [],
    summary: null,
  };
  await saveSession(session);
  return session;
}

export async function saveSession(session) {
  await (await db()).put(STORE, plain(session));
}

export async function getSession(id) {
  return (await (await db()).get(STORE, id)) ?? null;
}

export async function listSessions() {
  const all = await (await db()).getAll(STORE);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteSession(id) {
  await (await db()).delete(STORE, id);
}

export async function findInterrupted() {
  return (await listSessions()).find((s) => s.status === "recording") ?? null;
}
