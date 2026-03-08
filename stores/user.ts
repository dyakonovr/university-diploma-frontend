import { getUserInfo } from '~/api/auth';
import type { User } from '~/types/user.types';

type UserState = {
  status: 'pending' | 'success' | 'error',
  user: User | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    status: 'pending',
    user: null
  }),
  actions: {
    async getUser() {
      if (this.user !== null) return;

      try {
        this.status = 'pending';
        const userResponse = await getUserInfo();

        this.user = userResponse.data.value;
        this.status = 'success';
      } catch (e) {
        console.error(e);
        this.status = 'error';
        throw new Error('Ошибка обновления пользователя');
      }
    },
    clearUser() {
      this.user = null;
      useCookie('access-token').value = null;
      useCookie('refresh-token').value = null;
    }
  },
});