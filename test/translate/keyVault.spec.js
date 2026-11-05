import { describe, it, expect, beforeEach } from "vitest";
import * as vault from "../../src/translate/services/keyVault.js";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("keyVault", () => {
  it("keeps keys in session storage until asked to remember", () => {
    vault.setKey("soniox", " abc ");
    expect(vault.getKey("soniox")).toBe("abc");
    expect(sessionStorage.length).toBe(1);
    expect(localStorage.length).toBe(0);
  });

  it("moves keys between storages when the remember flag flips", () => {
    vault.setKey("gemini", "g");
    vault.setRemember(true);
    expect(vault.getRemember()).toBe(true);
    expect(localStorage.getItem("translate:key:gemini")).toBe("g");
    expect(sessionStorage.getItem("translate:key:gemini")).toBeNull();
    vault.setRemember(false);
    expect(sessionStorage.getItem("translate:key:gemini")).toBe("g");
    expect(localStorage.getItem("translate:key:gemini")).toBeNull();
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
