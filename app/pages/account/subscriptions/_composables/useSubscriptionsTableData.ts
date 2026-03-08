import { getSubscriptions } from '~/domain/subscription/api/subscriptions.api';
import type { Subscription } from '~/domain/subscription/models/subscription.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  ResponsePagination,
} from '~/shared/types/core/request.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

const TABLE_HEADER_COLUMNS: TableViewHeaderColumn[] = [
  {
    prop: 'name',
    label: 'Название',
    minWidth: 200,
  },
  {
    prop: 'price',
    label: 'Цена',
    minWidth: 150,
  },
  {
    prop: 'tokens_amount',
    label: 'Токенов',
    minWidth: 120,
  },
  {
    prop: 'tokens_interval',
    label: 'Интервал (часов)',
    minWidth: 150,
  },
  {
    prop: 'created_at',
    label: 'Дата создания',
    width: 180,
  },
  {
    prop: 'actions',
    label: 'Действия',
    fixed: 'right',
    width: 120,
  },
];

function useSubscriptionsTableData() {
  const { toastError } = useCustomToast();

  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 10,
    per_page: 10,
    total: 10,
  });

  const loading = ref(false);
  const data = ref<Subscription[] | null>(null);

  const getTableData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
      });

      const response = await getSubscriptions(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении подписок');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    TABLE_HEADER_COLUMNS,
    loading,
    data,
    meta,
    getTableData,
  };
}

export default useSubscriptionsTableData;
