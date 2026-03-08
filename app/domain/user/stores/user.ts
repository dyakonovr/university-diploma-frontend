import { getCurrentUser } from '~/domain/user/api/auth.api';
import type { User } from '~/domain/user/models/user.types';

type State = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;

  getMePromise: Promise<User | null> | null;
};

const useUserStore = defineStore('user', {
  state: (): State => ({
    user: null,
    isAdmin: false,
    loading: false,
    getMePromise: null,
  }),
  actions: {
    async fetchCurrentUser(): Promise<User | null> {
      // Если уже есть активный запрос — просто возвращаем его
      if (this.getMePromise) {
        return this.getMePromise;
      }

      this.loading = true;

      this.getMePromise = (async () => {
        try {
          const response = await getCurrentUser();
          this.changeUserData(response.data);
          return response.data;
        } catch (e) {
          console.error('@Error when fetching user data:', e);
          this.changeUserData(null);
          return null;
        } finally {
          this.loading = false;
          this.getMePromise = null; // обязательно очищаем
        }
      })();

      return this.getMePromise;
    },

    changeUserData(newData: User | null) {
      this.user = newData;
      this.isAdmin = newData?.roles?.includes('admin') ?? false;
    },
  },
});

export default useUserStore;
