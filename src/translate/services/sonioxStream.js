// The only module that talks to Soniox. Streams microphone audio and
// reports tokens with one-way translation into the target language.
import {
  SonioxClient, AuthError, QuotaError, NetworkError, ConnectionError,
  AudioPermissionError, AudioDeviceError, AudioUnavailableError,
} from "@soniox/client";
import { TARGET_LANGUAGES } from "../languages.js";

export const SONIOX_MODEL = "stt-rt-v5";

export function buildSessionConfig({ targetLang, context = {} }) {
  const config = {
    model: SONIOX_MODEL,
    audio_format: "auto",
    language_hints: TARGET_LANGUAGES.map((lang) => lang.code),
    enable_language_identification: true,
    enable_endpoint_detection: true,
    translation: { type: "one_way", target_language: targetLang },
    auto_reconnect: true,
    max_reconnect_attempts: 3,
    reconnect_base_delay_ms: 1000,
  };
  const topic = context.topic?.trim();
  const terms = (context.terms ?? []).map((t) => t.trim()).filter(Boolean);
  if (topic || terms.length) {
    config.context = {};
    if (topic) config.context.general = [{ key: "topic", value: topic }];
    if (terms.length) config.context.terms = terms;
  }
  return config;
}

export function classifyError(err) {
  if (err instanceof AuthError) return "auth";
  if (err instanceof QuotaError) return "balance";
  if (err instanceof NetworkError || err instanceof ConnectionError) return "network";
  if (err instanceof AudioPermissionError || err?.name === "NotAllowedError") return "mic-denied";
  if (err instanceof AudioDeviceError || err?.name === "NotFoundError") return "no-mic";
  if (err instanceof AudioUnavailableError) return "unsupported";
  return "other";
}

export function startStream({ key, targetLang, context, source, onTokens, onState, onError, onRestart }) {
  const client = new SonioxClient({ config: { api_key: key } });
  const recording = client.realtime.record({ ...buildSessionConfig({ targetLang, context }), source });
  recording.on("result", (result) => onTokens(result.tokens));
  recording.on("state_change", (update) => onState(update.new_state));
  recording.on("session_restart", () => onRestart());
  recording.on("error", (err) => onError(classifyError(err), err));
  return {
    pause: () => recording.pause(),
    resume: () => recording.resume(),
    stop: () => recording.stop(),
    cancel: () => recording.cancel(),
  };
}
