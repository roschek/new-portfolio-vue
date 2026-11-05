import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import {
  createSession, saveSession, getSession, listSessions, deleteSession, findInterrupted,
} from "../../src/translate/services/sessionStore.js";

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

describe("sessionStore", () => {
  it("creates a recording session with defaults", async () => {
    const s = await createSession({ title: "Calculus", targetLang: "ru", context: { topic: "", terms: [] } });
    expect(s).toMatchObject({
      title: "Calculus", targetLang: "ru", status: "recording", durationMs: 0,
      paragraphs: [], detectedLangs: [], summary: null,
    });
    expect(await getSession(s.id)).toEqual(s);
  });

  it("saves, lists newest first and deletes", async () => {
    const a = await createSession({ title: "A", targetLang: "en" });
    const b = await createSession({ title: "B", targetLang: "en" });
    await saveSession({ ...a, createdAt: 1 });
    await saveSession({ ...b, createdAt: 2, status: "done" });
    expect((await listSessions()).map((s) => s.title)).toEqual(["B", "A"]);
    await deleteSession(a.id);
    expect((await listSessions()).map((s) => s.title)).toEqual(["B"]);
    expect(await getSession(a.id)).toBeNull();
  });

  it("finds the latest interrupted recording", async () => {
    expect(await findInterrupted()).toBeNull();
    const a = await createSession({ title: "A", targetLang: "en" });
    const b = await createSession({ title: "B", targetLang: "en" });
    await saveSession({ ...a, createdAt: 1 });
    await saveSession({ ...b, createdAt: 2, status: "done" });
    expect((await findInterrupted()).title).toBe("A");
  });

  it("stores plain copies, not reactive proxies", async () => {
    const s = await createSession({ title: "A", targetLang: "en" });
    const proxy = new Proxy({ ...s, paragraphs: [{ original: "x" }] }, {});
    await saveSession(proxy);
    expect((await getSession(s.id)).paragraphs).toEqual([{ original: "x" }]);
  });
});
