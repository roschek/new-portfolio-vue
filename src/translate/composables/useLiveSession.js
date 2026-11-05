// Orchestrates a live lecture: Soniox stream, transcript, clock,
// autosave, wake lock and recovery. One shared instance per app so that
// switching screens does not stop the recording.
import { ref, shallowRef, computed } from "vue";
import * as defaultStore from "../services/sessionStore.js";
import { startStream as defaultStartStream } from "../services/sonioxStream.js";
import { MeteredMicSource } from "../audio/meteredMicSource.js";
import { createTranscript, applyTokens, detectedLangs, countWords } from "../services/transcriptBuilder.js";

const SDK_STATUS = {
  starting: "connecting",
  connecting: "connecting",
  recording: "recording",
  reconnecting: "reconnecting",
  paused: "paused",
};

export function useLiveSession({
  store = defaultStore,
  startStream = defaultStartStream,
  createSource = () => new MeteredMicSource(),
  now = () => Date.now(),
  autosaveMs = 5000,
} = {}) {
  const status = ref("idle");
  const error = ref(null);
  const session = shallowRef(null);
  const transcript = shallowRef(createTranscript());
  const elapsedMs = ref(0);
  const paragraphs = computed(() => transcript.value.paragraphs);
  const tail = computed(() => transcript.value.tail);
  const wordCount = computed(() => countWords(transcript.value.paragraphs));

  let handle = null;
  let source = null;
  let apiKey = null;
  let baseMs = 0;
  let runningSince = null;
  let offsetMs = 0;
  let timers = [];
  let wakeLock = null;
  const listeners = new Set();

  const currentElapsed = () => baseMs + (runningSince === null ? 0 : now() - runningSince);
  const runClock = () => {
    if (runningSince === null) runningSince = now();
  };
  const holdClock = () => {
    if (runningSince !== null) baseMs += now() - runningSince;
    runningSince = null;
    elapsedMs.value = baseMs;
  };

  function snapshot(statusOverride) {
    const list = transcript.value.paragraphs;
    return {
      ...session.value,
      paragraphs: list,
      durationMs: currentElapsed(),
      detectedLangs: detectedLangs(list),
      status: statusOverride ?? session.value.status,
    };
  }

  async function persist(statusOverride) {
    if (!session.value) return;
    session.value = snapshot(statusOverride);
    await store.saveSession(session.value);
  }

  const emit = (paragraph) => listeners.forEach((cb) => cb(paragraph));

  function handleTokens(tokens) {
    const before = transcript.value.paragraphs.length;
    transcript.value = applyTokens(transcript.value, tokens, offsetMs);
    const after = transcript.value.paragraphs.length;
    for (let i = Math.max(before - 1, 0); i < after - 1; i++) emit(transcript.value.paragraphs[i]);
  }

  function handleState(sdkState) {
    const next = SDK_STATUS[sdkState];
    if (!next || status.value === "stopping" || status.value === "error") return;
    status.value = next;
    if (next === "recording") runClock();
  }

  async function acquireWakeLock() {
    try {
      wakeLock = (await navigator.wakeLock?.request("screen")) ?? null;
    } catch {
      wakeLock = null; // Not fatal: the screen may just turn off sooner.
    }
  }

  function releaseWakeLock() {
    wakeLock?.release?.();
    wakeLock = null;
  }

  function teardown(mode) {
    timers.forEach(clearInterval);
    timers = [];
    releaseWakeLock();
    if (mode === "cancel") handle?.cancel();
    source?.stop?.();
    handle = null;
    source = null;
  }

  function handleError(kind) {
    holdClock();
    teardown("cancel");
    status.value = "error";
    error.value = kind;
    persist();
  }

  function openStream() {
    error.value = null;
    status.value = "connecting";
    source = createSource();
    handle = startStream({
      key: apiKey,
      targetLang: session.value.targetLang,
      context: session.value.context,
      source,
      onTokens: handleTokens,
      onState: handleState,
      onError: handleError,
      onRestart: () => {
        offsetMs = currentElapsed();
      },
    });
    timers.push(setInterval(() => persist(), autosaveMs));
    timers.push(setInterval(() => (elapsedMs.value = currentElapsed()), 500));
    acquireWakeLock();
  }

  function load(saved) {
    session.value = saved;
    transcript.value = createTranscript(saved.paragraphs);
    baseMs = saved.durationMs;
    elapsedMs.value = baseMs;
    runningSince = null;
    offsetMs = baseMs;
  }

  async function start({ title, targetLang, context, key }) {
    apiKey = key;
    load(await store.createSession({ title, targetLang, context }));
    openStream();
  }

  async function continueSession(saved, key) {
    apiKey = key;
    load(saved);
    openStream();
  }

  async function pause() {
    if (!handle || !["recording", "reconnecting", "connecting"].includes(status.value)) return;
    handle.pause();
    holdClock();
    releaseWakeLock();
    status.value = "paused";
    await persist();
  }

  async function resume(key) {
    if (key) apiKey = key;
    if (status.value === "paused" && handle) {
      handle.resume();
      runClock();
      status.value = "recording";
      acquireWakeLock();
    } else if (status.value === "error" && session.value) {
      openStream();
    }
  }

  async function stop() {
    if (!session.value) return null;
    status.value = "stopping";
    holdClock();
    try {
      await handle?.stop();
    } catch {
      // Whatever arrived before the failure is already in the transcript.
    }
    teardown("stop");
    const last = transcript.value.paragraphs.at(-1);
    if (last) emit(last);
    let id = session.value.id;
    if (transcript.value.paragraphs.length) await persist("done");
    else {
      await store.deleteSession(id);
      id = null;
    }
    session.value = null;
    transcript.value = createTranscript();
    elapsedMs.value = 0;
    baseMs = 0;
    status.value = "idle";
    error.value = null;
    return id;
  }

  function onVisibility() {
    if (!handle) return;
    if (document.visibilityState === "hidden") persist();
    else if (status.value === "recording") acquireWakeLock();
  }
  document.addEventListener("visibilitychange", onVisibility);

  function dispose() {
    document.removeEventListener("visibilitychange", onVisibility);
    teardown("cancel");
  }

  return {
    status,
    error,
    session,
    paragraphs,
    tail,
    elapsedMs,
    wordCount,
    start,
    continueSession,
    pause,
    resume,
    stop,
    getLevel: () => source?.getLevel?.() ?? 0,
    onParagraph(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    dispose,
  };
}

let shared = null;
export const getLiveSession = () => (shared ??= useLiveSession());
