import useUserStore from '~/domain/user/stores/user';

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();

  if (userStore.user) return;

  try {
    await userStore.fetchCurrentUser();
  } catch {
    return navigateTo('/auth/login');
  }
});
