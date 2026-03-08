<template>
  <section>
    <table-filters
      v-if="isFiltersOpened"
      :filters="filters"
      :loading="loading"
      @search="onSearchFiltersClick"
      @reset="onResetFiltersClick"
    >
      <select-ui
        v-model="filters.flow_id"
        :options="flows.data.value || []"
        :initial-option="flows.initialOption.value"
        :select-props="{
          placeholder: 'Шаблон',
          disabled: loading || flows.loading.value,
        }"
        @update:search-query="flows.debouncedGetData(1, true)"
        @reach-end="flows.getData(flows.meta.value.page + 1)"
      />
      <select-ui
        v-model="filters.status"
        :options="STATUS_SELECT_OPTIONS"
        :searchable="false"
        :select-props="{ placeholder: 'Статус генерации', disabled: loading }"
      />
      <select-ui
        v-model="filters.schedule_id"
        :options="scheduleSlots.data.value || []"
        :select-props="{
          placeholder: 'Слот расписания',
          disabled: loading || scheduleSlots.loading.value,
        }"
        @update:search-query="scheduleSlots.debouncedGetData(1, true)"
        @reach-end="scheduleSlots.getData(scheduleSlots.meta.value.page + 1)"
      />
    </table-filters>

    <cards-view
      v-model:current-page="meta.page"
      with-pagination
      :data="data || []"
      :total-pages="meta.total_pages"
      :loading="loading"
      :empty-html="RAW_POSTS_EMPTY_DESCRIPTION"
      :card-link="(item) => `/account/posts/raw/${item.id}`"
    >
      <template #title="{ item }">
        <div class="raw-posts__item-title">
          <div class="raw-posts__item-title-left">
            Результат генерации
            <post-status-tag :status="item.status" />
          </div>
          <schedule-tag
            v-if="item.schedule_id"
            :schedule-id="item.schedule_id"
            :flow-id="item.flow_id"
          />
        </div>
      </template>
      <template #body="{ item }">
        <div class="raw-posts__item-body">
          <p>Время начала - {{ formatDateToNormalized(item.created_at) }}</p>
          <p>
            Время окончания -
            {{ getFinishedTime(item.status, item.created_at, item.updated_at) }}
          </p>
        </div>
      </template>
    </cards-view>
  </section>
</template>

<script setup lang="ts">
import CardsView from '~/components/list-views/CardsView.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableFilters from '~/components/ui/tables/TableFilters.vue';
import type { RawPostStatus } from '~/domain/raw-post/models/raw-post.types';
import PostStatusTag from '~/domain/raw-post/ui/RawPostStatusTag.vue';
import ScheduleTag from '~/domain/schedule/ui/ScheduleTag.vue';
import { RAW_POSTS_EMPTY_DESCRIPTION } from '~/shared/constants/empty-descriptions.const';
import { formatDateToNormalized } from '~/shared/utils/core/formatDateToNormalized';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useRawPostsTableData from '../_composables/raw-posts/useRawPostsTableData';
import useRawPostsTableFilters from '../_composables/raw-posts/useRawPostsTableFilters';

defineProps<{
  isFiltersOpened?: boolean;
}>();

const {
  filters,
  STATUS_SELECT_OPTIONS,
  flows,
  scheduleSlots,
  parseFiltersFromUrl,
  resetFilters,
} = useRawPostsTableFilters();

const { data, loading, meta, getTableData } = useRawPostsTableData({
  requestParams: () => ({
    flow_id: filters.value.flow_id || null,
    status: filters.value.status || null,
    schedule_id: filters.value.schedule_id || null,
  }),
});

function formatTimeDiff(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  let diff = Math.abs(end.getTime() - start.getTime()); // разница в мс

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  const parts = [];
  if (days) parts.push(`${days} дн`);
  if (hours) parts.push(`${hours} ч`);
  if (minutes) parts.push(`${minutes} мин`);
  if (seconds || parts.length === 0) parts.push(`${seconds} сек`); // показываем 0 сек если всё равно

  return parts.join(', ');
}

const getFinishedTime = (
  status: RawPostStatus,
  created_at: string,
  updated_at: string,
) => {
  if (status === 'processing') return 'Не завершён';
  return `${formatDateToNormalized(updated_at)} (продлился ${formatTimeDiff(created_at, updated_at)})`;
};

const onSearchFiltersClick = () => {
  meta.value.page = 1;
  getTableData();
};

const onResetFiltersClick = () => {
  resetFilters();
  onSearchFiltersClick();
};

onBeforeMount(async () => {
  parseFiltersFromUrl();
  parsePaginationFromUrl(meta);

  loading.value = true;
  await Promise.all([getTableData(), flows.getData(1), scheduleSlots.getData(1)]);
  loading.value = false;
});
</script>

<style lang="scss">
.raw-posts {
  &__item-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;

    &-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &__item-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
