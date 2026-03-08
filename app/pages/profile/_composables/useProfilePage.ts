import useUserTransactions from '~/domain/user/composables/useUserTransactions';
import type { User } from '~/domain/user/models/user.types';
import useUserStore from '~/domain/user/stores/user';
import { useCustomToast } from '~/shared/composables/useCustomToast';

function useProfilePage() {
  const { toastError } = useCustomToast();
  const userStore = useUserStore();

  const initialLoading = ref(false);

  const user = ref<User | null>(null);

  const {
    loading: transactionsLoading,
    transactions,
    page: transactionsPage,
    totalPages: transactionsTotalPages,
    fetchTransactions,
  } = useUserTransactions();

  const getData = async () => {
    try {
      const response = await userStore.fetchCurrentUser();

      user.value = response;
    } catch (e) {
      console.error('Error while profile data fetching:', e);
      toastError('Ошибка загрузки профиля');
    }
  };

  return {
    initialLoading,
    transactionsLoading,
    user,
    transactions,
    transactionsPage,
    transactionsTotalPages,
    getData,
    fetchTransactions,
  };
}

export default useProfilePage;
