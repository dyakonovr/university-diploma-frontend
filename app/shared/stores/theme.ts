import type { Theme } from "~/shared/types/ui/theme.types";

const VALID_THEMES: Theme[] = ["light", "professional", "dark"];

type ThemeState = {
  theme: Theme;
};

export const useThemeStore = defineStore("theme", {
  state: (): ThemeState => ({
    theme: "professional",
  }),

  actions: {
    setTheme(value: Theme) {
      this.theme = value;
      localStorage.setItem("theme", value);
    },

    toggleTheme() {
      const currentIndex = VALID_THEMES.indexOf(this.theme);
      const nextIndex = (currentIndex + 1) % VALID_THEMES.length;
      this.setTheme(VALID_THEMES[nextIndex]);
    },

    setInitialTheme() {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme && VALID_THEMES.includes(savedTheme)) {
        this.theme = savedTheme;
        return;
      }

      // Default to professional
      this.theme = "professional";
    },
  },
});
