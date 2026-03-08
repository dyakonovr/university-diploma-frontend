import { defineNuxtPlugin } from 'nuxt/app';

import { useThemeStore } from '~/shared/stores/theme';

export default defineNuxtPlugin(() => {
  const themeStore = useThemeStore();

  watch(
    () => themeStore.theme,
    (theme) => {
      document.documentElement.dataset.theme = theme;
    },
    { immediate: true },
  );
});
