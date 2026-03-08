import { getPrivateFlow, getPrivateFlows } from '~/domain/flow/api/private-flows.api';
import type { PrivateFlow } from '~/domain/flow/model/private-flow.types';
import type { RawPostStatus } from '~/domain/raw-post/models/raw-post.types';
import { getScheduleTimeSlots } from '~/domain/schedule/api/schedule.api';
import type { ScheduleTimeSlot } from '~/domain/schedule/models/schedule.types';
import { formatScheduleSlotLabel } from '~/domain/schedule/utils/schedule.utils';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
import {
  parseUrlParams,
  type URLParamsParsingConfig,
} from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  flow_id: EntityId | null;
  status: string | null;
  schedule_id: EntityId | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'flow_id', type: 'string' },
  { fieldName: 'status', type: 'string' },
  { fieldName: 'schedule_id', type: 'string' },
];

function useRawPostsTableFilters() {
  const filters = ref<TableFilters>({
    flow_id: null,
    status: null,
    schedule_id: null,
  });

  const STATUS_SELECT_OPTIONS: SelectOption<RawPostStatus>[] = [
    { label: 'Генерация завершена успешно', value: 'completed' },
    { label: 'Ошибка генерации', value: 'failed' },
    { label: 'В процессе генерации', value: 'processing' },
  ];

  const flows = useSelectInfiniteScroll<PrivateFlow>({
    mapFunc: (item) => ({ label: item.name, value: item.id }),
    requestFunc: getPrivateFlows,
    errorMessage: 'Ошибка при получении шаблонов',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
    getOneRequestFunc: getPrivateFlow,
    currentModelValue: () => filters.value.flow_id,
  });

  const scheduleSlots = useSelectInfiniteScroll<ScheduleTimeSlot>({
    mapFunc: (item) => ({
      label: formatScheduleSlotLabel(item),
      value: item.id,
    }),
    requestFunc: getScheduleTimeSlots,
    errorMessage: 'Ошибка при получении слотов расписания',
    currentModelValue: () => filters.value.schedule_id,
  });

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      flow_id: params.flow_id ?? null,
      status: params.status ?? null,
      schedule_id: params.schedule_id ?? null,
    };
  };

  const resetFilters = () => {
    filters.value = {
      flow_id: null,
      status: null,
      schedule_id: null,
    };
  };

  return {
    filters,
    flows,
    scheduleSlots,
    STATUS_SELECT_OPTIONS,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useRawPostsTableFilters;
