<template>
  <cards-view
    v-model:current-page="currentPage"
    with-pagination
    :data="data"
    :total-pages="totalPages"
    :loading="loading"
    :card-link="(item) => `/account/flows/private/${item.id}`"
    :empty-html="emptyHtml"
  >
    <template #actions="{ item }">
      <table-action-menu
        :edit-link="`/account/flows/private/${item.id}`"
        @delete-click="$emit('delete', item)"
      >
        <table-action-menu-item
          v-if="item.access?.accessible"
          @click="$emit('generate', item)"
        >
          <generate-icon />
          Сгенерировать
        </table-action-menu-item>
        <table-action-menu-item @click="$emit('publish', item)">
          <send-icon />
          Опубликовать
        </table-action-menu-item>
        <table-action-menu-item
          is-link
          :link-to="`/account/flows/private/${item.id}?tab=publish`"
        >
          <calendar-clock-icon />
          Расписание
        </table-action-menu-item>
      </table-action-menu>
    </template>
    <template #title="{ item }">
      {{ item.name }}
    </template>
    <template #body="{ item }">
      <div class="private-flow-list__item-body">
        <flow-access-status
          v-if="item.access"
          :accessible="item.access.accessible"
        />
        <p>
          {{ formatDateToNormalized(item.created_at, { second: undefined }) }}
        </p>
      </div>
    </template>
  </cards-view>
</template>

<script setup lang="ts">
import CalendarClockIcon from '@/assets/images/icons/calendar-clock.svg';
import GenerateIcon from '@/assets/images/icons/generate.svg';
import SendIcon from '@/assets/images/icons/send.svg';
import CardsView from '~/components/list-views/CardsView.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TableActionMenuItem from '~/components/ui/tables/dropdowns/TableActionMenuItem.vue';
import type { PrivateFlow } from '~/domain/flow/model/private-flow.types';
import { formatDateToNormalized } from '~/shared/utils/core/formatDateToNormalized';

import FlowAccessStatus from '../FlowAccessStatus.vue';

defineProps<{
  data: PrivateFlow[];
  loading: boolean;
  totalPages: number;
  emptyHtml?: string;
}>();

defineEmits<{
  (e: 'delete', item: PrivateFlow): void;
  (e: 'generate', item: PrivateFlow): void;
  (e: 'publish', item: PrivateFlow): void;
}>();

const currentPage = defineModel<number>('currentPage', { required: true });
</script>

<style lang="scss">
.private-flow-list {
  &__item-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
