import { describe, it, expect, beforeEach } from "vitest";
import * as vault from "../../src/translate/services/keyVault.js";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("keyVault", () => {
  it("remembers keys on the device by default", () => {
    vault.setKey("soniox", " abc ");
    expect(vault.getRemember()).toBe(true);
    expect(vault.getKey("soniox")).toBe("abc");
    expect(localStorage.getItem("translate:key:soniox")).toBe("abc");
    expect(sessionStorage.length).toBe(0);
  });

  it("moves keys between storages when the remember flag flips", () => {
    vault.setKey("gemini", "g");
    vault.setRemember(false);
    expect(vault.getRemember()).toBe(false);
    expect(sessionStorage.getItem("translate:key:gemini")).toBe("g");
    expect(localStorage.getItem("translate:key:gemini")).toBeNull();
    vault.setRemember(true);
    expect(localStorage.getItem("translate:key:gemini")).toBe("g");
    expect(sessionStorage.getItem("translate:key:gemini")).toBeNull();
  });

  it("keeps the opt-out across reloads", () => {
    vault.setRemember(false);
    expect(localStorage.getItem("translate:remember")).toBe("0");
    expect(vault.getRemember()).toBe(false);
  });

  it("still finds a key saved in session storage by an older version", () => {
    sessionStorage.setItem("translate:key:soniox", "old");
    expect(vault.getKey("soniox")).toBe("old");
  });

  it("removes a key when set to empty and forgets all keys", () => {
    vault.setKey("openai", "o");
    vault.setKey("openai", "");
    expect(vault.getKey("openai")).toBe("");
    vault.setRemember(true);
    vault.setKey("soniox", "s");
    vault.forgetKeys();
    expect(vault.getKey("soniox")).toBe("");
  });

  it("remembers the summary provider with gemini as default", () => {
    expect(vault.getSummaryProvider()).toBe("gemini");
    vault.setSummaryProvider("anthropic");
    expect(vault.getSummaryProvider()).toBe("anthropic");
  });
});
