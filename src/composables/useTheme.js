import { ref } from "vue";
export const createThemeComposable = () => {
  const isLightTheme = ref(false);

  function toggleTheme() {
    isLightTheme.value = !isLightTheme.value;
    localStorage.setItem("theme", isLightTheme.value ? "light" : "dark");
    document.documentElement.classList.toggle(
      "light-theme",
      isLightTheme.value
    );
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      isLightTheme.value = savedTheme === "light";
    } else {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      isLightTheme.value = !prefersDarkMode;
    }

    document.documentElement.classList.toggle(
      "light-theme",
      isLightTheme.value
    );
  }

  return {
    isLightTheme,
    toggleTheme,
    initTheme,
  };
};
