import { describe, it, expect, beforeEach } from "vitest";
import { nextTick } from "vue";
import { usePrefs } from "../../src/translate/composables/usePrefs.js";

beforeEach(() => localStorage.clear());

describe("usePrefs", () => {
  it("defaults and persists changes", async () => {
    const prefs = usePrefs("ru");
    expect(prefs.targetLang.value).toBe("ru");
    expect(prefs.textSize.value).toBe("md");
    expect(prefs.showOriginal.value).toBe(true);
    prefs.targetLang.value = "he";
    prefs.showOriginal.value = false;
    await nextTick();
    const again = usePrefs("ru");
    expect(again.targetLang.value).toBe("he");
    expect(again.showOriginal.value).toBe(false);
  });
});
