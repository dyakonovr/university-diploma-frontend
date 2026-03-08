import type { SubscriptionUserWithDetails } from '~/domain/subscription/models/subscription.types';
import { getCurrentUser } from '~/domain/user/api/auth.api';
import { getMySubscriptions, getMyTokenBalance } from '~/domain/user/api/tarification/tarification.my-api';
import type { User } from '~/domain/user/models/user.types';

let _balanceIntervalId: ReturnType<typeof setInterval> | null = null;

type State = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;

  getMePromise: Promise<User | null> | null;

  balance: number | null;
  subscriptions: SubscriptionUserWithDetails[] | null;
};

const useUserStore = defineStore('user', {
  state: (): State => ({
    user: null,
    isAdmin: false,
    loading: false,
    getMePromise: null,
    balance: null,
    subscriptions: null,
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

    async fetchBalance() {
      try {
        const response = await getMyTokenBalance();
        this.balance = response.data.balance;
      } catch (e) {
        console.error('@Error when fetching balance:', e);
      }
    },

    async fetchSubscriptions() {
      try {
        const response = await getMySubscriptions();
        this.subscriptions = response.data;
      } catch (e) {
        console.error('@Error when fetching subscriptions:', e);
      }
    },

    startBalancePolling() {
      this.stopBalancePolling();
      void this.fetchBalance();
      _balanceIntervalId = setInterval(() => void this.fetchBalance(), 30_000);
    },

    stopBalancePolling() {
      if (_balanceIntervalId !== null) {
        clearInterval(_balanceIntervalId);
        _balanceIntervalId = null;
      }
    },
  },
});

export default useUserStore;
