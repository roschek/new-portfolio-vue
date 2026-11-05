import { describe, it, expect } from "vitest";
import {
  AuthError, QuotaError, NetworkError, ConnectionError,
  AudioPermissionError, AudioDeviceError, AudioUnavailableError,
} from "@soniox/client";
import { buildSessionConfig, classifyError, SONIOX_MODEL } from "../../src/translate/services/sonioxStream.js";

describe("buildSessionConfig", () => {
  it("configures one-way translation with auto language detection", () => {
    const config = buildSessionConfig({ targetLang: "ru", context: { topic: "", terms: [] } });
    expect(config).toMatchObject({
      model: SONIOX_MODEL,
      audio_format: "auto",
      enable_language_identification: true,
      enable_endpoint_detection: true,
      translation: { type: "one_way", target_language: "ru" },
      auto_reconnect: true,
    });
    expect(config.language_hints).toEqual(["en", "he", "ru", "de", "es"]);
    expect(config.context).toBeUndefined();
  });

  it("passes topic and terms as context", () => {
    const config = buildSessionConfig({ targetLang: "en", context: { topic: "Linear algebra", terms: ["eigenvalue", " "] } });
    expect(config.context).toEqual({
      general: [{ key: "topic", value: "Linear algebra" }],
      terms: ["eigenvalue"],
    });
  });

  it("omits empty topic but keeps terms", () => {
    const config = buildSessionConfig({ targetLang: "en", context: { topic: " ", terms: ["x"] } });
    expect(config.context).toEqual({ terms: ["x"] });
  });
});

describe("classifyError", () => {
  it.each([
    [new AuthError("bad key", 401), "auth"],
    [new QuotaError("no balance", 402), "balance"],
    [new NetworkError("down"), "network"],
    [new ConnectionError("closed"), "network"],
    [new AudioPermissionError(), "mic-denied"],
    [new AudioDeviceError(), "no-mic"],
    [new AudioUnavailableError(), "unsupported"],
    [Object.assign(new Error("x"), { name: "NotAllowedError" }), "mic-denied"],
    [Object.assign(new Error("x"), { name: "NotFoundError" }), "no-mic"],
    [new Error("weird"), "other"],
  ])("classifies %o", (err, kind) => {
    expect(classifyError(err)).toBe(kind);
  });
});
