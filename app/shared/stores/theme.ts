import type { Theme } from '~/shared/types/ui/theme.types';

type ThemeState = {
  theme: Theme;
};

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    theme: 'light',
  }),

  actions: {
    setTheme(value: Theme) {
      this.theme = value;
      localStorage.setItem('theme', value);
    },

    toggleTheme() {
      const nextTheme: Theme = this.theme === 'light' ? 'dark' : 'light';
      this.theme = nextTheme;
      localStorage.setItem('theme', nextTheme);
    },

    setInitialTheme() {
      // 1. localStorage
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.theme = savedTheme;
        return;
      }

      // 2. системная тема
      if (window.matchMedia) {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches;
        this.theme = prefersDark ? 'dark' : 'light';
        return;
      }

      // 3. дефолт
      this.theme = 'light';
    },
  },
});
