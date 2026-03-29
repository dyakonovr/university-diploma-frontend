import { ref, watch } from 'vue';

import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  JsonSerializable,
  Response,
  ResponsePagination,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
import { mapPagination } from '~/shared/utils/core/mapPagination';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

import useAbortRequests from './useAbortRequests';
import { useCustomToast } from './useCustomToast';

/** ВАЖНО: при использовании этого composable внутри другого composable
 * возвращаемые значения в <template> ПРОПИСЫВАЮТСЯ С ИСПОЛЬЗОВАНИЕМ .value.
 * Пример: return { ..., category: { data: ... } };  v-model="category.data.value"
 */
function useSelectInfiniteScroll<Item>(options: {
  errorMessage: string;
  requestParams?: (
    meta: ResponsePagination,
    searchValue: string | null,
  ) => Record<string, JsonSerializable>;
  debounceTimeout?: number;
  requestFunc: (
    params?: string,
    signal?: AbortSignal | null,
  ) => Promise<ResponseWithPagination<Item[]>>;
  mapFunc: (item: Item) => SelectOption;
  /** Функция для получения одной сущности по ID (для initialOption) */
  getOneRequestFunc?: (id: EntityId) => Promise<Response<Item>>;
  /** Геттер текущего значения модели (для автозагрузки initialOption) */
  currentModelValue?: () => EntityId | null | undefined;
}) {
  // const { abortController } = useAbortRequests();
  const { toastError } = useCustomToast();

  const searchValue = ref<string | null>(null);
  const rawData = ref<Item[] | null>(null);
  const data = ref<SelectOption[] | null>(null);
  const loading = ref(false);
  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 1,
    per_page: 10,
    total: 10,
  });

  const getData = async (page: number, searchValueChanged: boolean = false) => {
    if (
      (page > (meta.value.total_pages || 1) && !searchValueChanged) ||
      loading.value
    ) {
      return;
    }

    loading.value = true;

    try {
      const params = objectToQueryString({
        page,
        per_page: 10,
        ...(options.requestParams?.(meta.value, searchValue.value) || {}),
      });

      // abortController.value.signal
      const response = await options.requestFunc(params);

      // if (abortController.value.signal.aborted) {
      //   return;
      // }

      const newData = response.data.map(options.mapFunc);
      if (page === 1) {
        data.value = newData;
        rawData.value = response.data;
      } else {
        data.value?.push(...newData);
        rawData.value?.push(...response.data);
      }
      meta.value = mapPagination(response.meta.pagination);
    } catch (e) {
      console.error(`${options.errorMessage}:`, e);
      toastError(options.errorMessage);
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };
  const debouncedGetData = useDebounceFn(
    getData,
    options.debounceTimeout ?? 750,
  );

  const initialOption = ref<SelectOption | null>(null);

  if (options.getOneRequestFunc && options.currentModelValue) {
    watch(options.currentModelValue, async (newValue) => {
      if (!newValue) {
        initialOption.value = null;
        return;
      }

      const existsInData = data.value?.some((opt) => opt.value === newValue);
      if (existsInData) return;

      try {
        const response = await options.getOneRequestFunc!(newValue);
        initialOption.value = options.mapFunc(response.data);
      } catch (e) {
        console.error('Error fetching initial select option:', e);
      }
    });
  }

  return {
    data,
    rawData,
    searchValue,
    loading,
    meta,
    initialOption,
    getData,
    debouncedGetData,
  };
}

export default useSelectInfiniteScroll;
