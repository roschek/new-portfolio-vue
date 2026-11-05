import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useLiveSession } from "../../src/translate/composables/useLiveSession.js";

const orig = (text, start_ms = 0) => ({ text, start_ms, language: "he", is_final: true, translation_status: "original" });
const tr = (text) => ({ text, is_final: true, translation_status: "translation" });

function setup() {
  let clock = 0;
  const saved = new Map();
  const store = {
    createSession: vi.fn(async (input) => {
      const s = { id: "s1", createdAt: 1, durationMs: 0, status: "recording", detectedLangs: [], paragraphs: [], summary: null, ...input };
      saved.set(s.id, s);
      return s;
    }),
    saveSession: vi.fn(async (s) => saved.set(s.id, JSON.parse(JSON.stringify(s)))),
    deleteSession: vi.fn(async (id) => saved.delete(id)),
  };
  const streams = [];
  const startStream = vi.fn((args) => {
    const handle = { args, pause: vi.fn(), resume: vi.fn(), stop: vi.fn(async () => {}), cancel: vi.fn() };
    streams.push(handle);
    return handle;
  });
  const source = { getLevel: () => 0.5, stop: vi.fn() };
  const live = useLiveSession({ store, startStream, createSource: () => source, now: () => clock, autosaveMs: 5000 });
  return { live, store, saved, streams, source, advance: (ms) => { clock += ms; vi.advanceTimersByTime(ms); } };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const startRecording = async (t, extra = {}) => {
  await t.live.start({ title: "L", targetLang: "ru", context: { topic: "", terms: [] }, key: "k", ...extra });
  const stream = t.streams.at(-1);
  stream.args.onRestart();
  stream.args.onState("recording");
  return stream;
};

describe("useLiveSession", () => {
  it("starts a stream with the session settings", async () => {
    const t = setup();
    const stream = await startRecording(t);
    expect(stream.args).toMatchObject({ key: "k", targetLang: "ru", source: t.source });
    expect(t.live.status.value).toBe("recording");
    expect(t.live.getLevel()).toBe(0.5);
  });

  it("builds paragraphs from tokens and reports completed ones", async () => {
    const t = setup();
    const done = [];
    t.live.onParagraph((p) => done.push(p.translation));
    const stream = await startRecording(t);
    stream.args.onTokens([orig("A"), tr("А")]);
    expect(done).toEqual([]);
    stream.args.onTokens([orig("B"), tr("Б")]);
    expect(t.live.paragraphs.value.map((p) => p.translation)).toEqual(["А", "Б"]);
    expect(done).toEqual(["А"]);
    expect(t.live.wordCount.value).toBe(2);
  });

  it("counts time only while recording and autosaves", async () => {
    const t = setup();
    const stream = await startRecording(t);
    t.advance(5000);
    expect(t.store.saveSession).toHaveBeenCalled();
    expect(t.saved.get("s1").durationMs).toBe(5000);
    await t.live.pause();
    expect(stream.pause).toHaveBeenCalled();
    expect(t.live.status.value).toBe("paused");
    t.advance(60000);
    await t.live.resume();
    expect(stream.resume).toHaveBeenCalled();
    t.advance(1000);
    expect(t.live.elapsedMs.value).toBe(6000);
  });

  it("offsets timestamps after a stream restart", async () => {
    const t = setup();
    const stream = await startRecording(t);
    t.advance(10000);
    stream.args.onRestart();
    stream.args.onTokens([orig("A", 200)]);
    expect(t.live.paragraphs.value[0].startMs).toBe(10200);
  });

  it("maps SDK states", async () => {
    const t = setup();
    const stream = await startRecording(t);
    stream.args.onState("reconnecting");
    expect(t.live.status.value).toBe("reconnecting");
    stream.args.onState("connecting");
    expect(t.live.status.value).toBe("connecting");
  });

  it("saves and stops on a stream error, then resumes with a new stream", async () => {
    const t = setup();
    const stream = await startRecording(t);
    stream.args.onTokens([orig("A"), tr("А")]);
    stream.args.onError("auth");
    expect(t.live.status.value).toBe("error");
    expect(t.live.error.value).toBe("auth");
    expect(stream.cancel).toHaveBeenCalled();
    await vi.waitFor(() => expect(t.saved.get("s1").paragraphs).toHaveLength(1));
    await t.live.resume("k2");
    expect(t.streams).toHaveLength(2);
    expect(t.streams[1].args.key).toBe("k2");
    expect(t.live.error.value).toBeNull();
  });

  it("deletes an empty lecture on stop", async () => {
    const t = setup();
    const stream = await startRecording(t);
    expect(await t.live.stop()).toBeNull();
    expect(stream.stop).toHaveBeenCalled();
    expect(t.store.deleteSession).toHaveBeenCalledWith("s1");
    expect(t.live.status.value).toBe("idle");
  });

  it("marks a lecture done on stop and emits the last paragraph", async () => {
    const t = setup();
    const done = [];
    t.live.onParagraph((p) => done.push(p.original));
    const stream = await startRecording(t);
    stream.args.onTokens([orig("A"), tr("А")]);
    expect(await t.live.stop()).toBe("s1");
    expect(t.saved.get("s1").status).toBe("done");
    expect(t.saved.get("s1").detectedLangs).toEqual(["he"]);
    expect(done).toEqual(["A"]);
  });

  it("continues an interrupted lecture", async () => {
    const t = setup();
    const saved = { id: "old", title: "Old", targetLang: "en", context: {}, durationMs: 30000, status: "recording",
      paragraphs: [{ startMs: 0, lang: "he", original: "A", translation: "A1", translated: true, passthrough: false, ended: true }] };
    await t.live.continueSession(saved, "k");
    const stream = t.streams[0];
    stream.args.onRestart();
    stream.args.onState("recording");
    stream.args.onTokens([orig("B", 100), tr("B1")]);
    expect(t.live.paragraphs.value.map((p) => p.translation)).toEqual(["A1", "B1"]);
    expect(t.live.paragraphs.value[1].startMs).toBe(30100);
    t.advance(1000);
    expect(t.live.elapsedMs.value).toBe(31000);
  });

  it("saves when the page is hidden", async () => {
    const t = setup();
    await startRecording(t);
    t.store.saveSession.mockClear();
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(t.store.saveSession).toHaveBeenCalled();
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    t.live.dispose();
  });
});
