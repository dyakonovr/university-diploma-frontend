import { getUserTokenBalance } from '~/domain/user/api/tarification/tarification.admin-api';
import useUserTransactions from '~/domain/user/composables/useUserTransactions';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { EntityId } from '~/shared/types/core/base-entity.types';

function useUserTarification(userId: Ref<EntityId | null>) {
  const { toastError } = useCustomToast();

  const tarificationLoading = ref(false);
  const balance = ref<number | null>(null);

  const {
    loading: transactionsLoading,
    transactions,
    page: transactionsPage,
    totalPages: transactionsTotalPages,
    fetchTransactions: loadTransactions,
  } = useUserTransactions(userId);

  const loadTarificationData = async () => {
    if (!userId.value) return;
    try {
      tarificationLoading.value = true;
      const balanceRes = await getUserTokenBalance(userId.value);
      balance.value = balanceRes.data.balance;
    } catch {
      toastError('Ошибка загрузки данных подписок');
    } finally {
      tarificationLoading.value = false;
    }
  };

  return {
    tarificationLoading,
    transactionsLoading,
    balance,
    transactions,
    transactionsPage,
    transactionsTotalPages,

    loadTarificationData,
    loadTransactions,
  };
}

export default useUserTarification;
