import useUserStore from '~/domain/user/stores/user';

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();

  if (!userStore.user || !userStore.isAdmin) {
    return navigateTo('/workspaces');
  }
});
