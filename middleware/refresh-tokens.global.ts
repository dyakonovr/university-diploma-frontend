import { useUserStore } from '~/stores/user';
import type { RouteLocationNormalized } from 'vue-router';
import { refreshTokens } from '~/api/auth';
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from '~/constants/tokens';
import useRequestStore from '~/stores/request';
import useSetTokens from '~/composables/useSetTokents';
import { useGetBackStore } from './../stores/get-back';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  if (to.path === '/login') return;

  const getBackStore = useGetBackStore();
  const userStore = useUserStore();
  const requestStore = useRequestStore();
  const { setTokens } = useSetTokens();

  if (useCookie(COOKIE_REFRESH_TOKEN).value && (!userStore.user || !useCookie(COOKIE_ACCESS_TOKEN).value)) {
    try {
      if (!useCookie(COOKIE_ACCESS_TOKEN).value) {
        requestStore.setRefreshing(true);

        const refreshResponse = await refreshTokens();
        setTokens(refreshResponse);

        requestStore.setRefreshing(false);
      }

      if (!userStore.user) {
        await userStore.getUser();
      }
    } catch {
      requestStore.setRefreshing(false);

      useCookie(COOKIE_ACCESS_TOKEN).value = null;
      useCookie(COOKIE_REFRESH_TOKEN).value = null;
      userStore.user = null;

      getBackStore.fromLink = to.path;
      return navigateTo({ path: '/login' });
    }
  } else if (!useCookie(COOKIE_REFRESH_TOKEN).value) {
    useCookie(COOKIE_ACCESS_TOKEN).value = null;
    useCookie(COOKIE_REFRESH_TOKEN).value = null;
    userStore.user = null;
    getBackStore.fromLink = to.path;
    return navigateTo({ path: '/login' });
  }
});