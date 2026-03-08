import type { Transaction } from '~/domain/subscription/models/subscription.types';
import { getMyTransactions } from '~/domain/user/api/tarification/tarification.my-api';
import { getUserTransactions } from '~/domain/user/api/tarification/tarification.admin-api';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';

const DEFAULT_PER_PAGE = 15;

/**
 * Composable for fetching user transactions with pagination.
 *
 * @param userId - Optional reactive user ID. When provided, fetches transactions
 *   for that specific user (admin context). When omitted, fetches the current
 *   user's own transactions (profile context).
 *
 * @example
 * // Profile page (current user)
 * const { transactions, loading, page, totalPages, fetchTransactions } = useUserTransactions();
 *
 * // Admin user form
 * const { transactions, loading, page, totalPages, fetchTransactions } = useUserTransactions(editId);
 *
 * @returns {{ transactions, loading, page, totalPages, fetchTransactions }}
 */
function useUserTransactions(userId?: Ref<EntityId | null>) {
  const loading = ref(false);
  const transactions = ref<Transaction[]>([]);
  const page = ref(1);
  const totalPages = ref(1);

  const fetchTransactions = async () => {
    if (userId !== undefined && userId.value === null) return;

    try {
      loading.value = true;

      const params = objectToQueryString({
        page: page.value,
        per_page: DEFAULT_PER_PAGE,
      });

      const response =
        userId !== undefined
          ? await getUserTransactions(userId.value!, params)
          : await getMyTransactions(params);

      transactions.value = response.data;
      totalPages.value = response.meta.pagination.total_pages;
    } catch {
      // silent
    } finally {
      loading.value = false;
    }
  };

  watch(page, fetchTransactions);

  return {
    loading,
    transactions,
    page,
    totalPages,
    fetchTransactions,
  };
}

export default useUserTransactions;
