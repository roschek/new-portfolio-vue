import { createThemeComposable } from "../composables/useTheme";

const { isLightTheme, toggleTheme, initTheme } = createThemeComposable();

export const useThemeStore = () => {
  return {
    isLightTheme,
    toggleTheme,
    initTheme,
  };
};
