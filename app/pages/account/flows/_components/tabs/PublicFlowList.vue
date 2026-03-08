<template>
  <cards-view
    v-model:current-page="currentPage"
    with-pagination
    :data="data"
    :total-pages="totalPages"
    :loading="loading"
    :card-link="cardLink ?? ((item) => `/account/flows/public/${item.id}`)"
    :empty-html="emptyHtml"
  >
    <template
      v-if="showActions"
      #actions="{ item }">
      <table-action-menu
        :edit-link="`/account/flows/public/${item.id}`"
        @delete-click="$emit('delete', item)"
      />
    </template>
    <template #title="{ item }">
      {{ item.name }}
    </template>
    <template #body="{ item }">
      <div class="public-flow-list__item-body">
        <p
          v-html="
            item.description.length > 100
              ? item.description.slice(0, 100) + '...'
              : item.description
          "
        />
        <p v-if="item.category">Категория: {{ item.category.name }}</p>

        <div
          v-if="showStatus"
          class="public-flow-list__status-row">
          <tag-ui :type="statusTagType(item.status)">
            {{ statusLabel(item.status) }}
          </tag-ui>
        </div>

        <flow-access-status :accessible="item.access?.accessible" />

        <div
          v-if="item.social_networks?.length"
          class="public-flow-list__socials"
        >
          <social-badge
            v-for="sn in item.social_networks"
            :key="sn"
            :provider="sn"
          />
        </div>

        <flow-card-stats
          :likes="item.likes_count ?? 0"
          :copies="item.copy_count ?? 0"
          :is-liked="item.is_liked"
          :is-copied="item.is_copied"
          :show-like="showLike"
          :show-copy="showCopy && item.status === 'Approve'"
          :show-actions="showLike || showCopy"
          @toggle-like="$emit('toggle-like', item)"
          @copy="$emit('copy', item)"
        />
      </div>
    </template>
  </cards-view>
</template>

<script setup lang="ts">
import CardsView from '~/components/list-views/CardsView.vue';
import SocialBadge from '~/components/SocialBadge.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TagUi from '~/components/ui/TagUi.vue';
import type {
  PublicFlow,
  PublicFlowStatus,
} from '~/domain/flow/model/public-flow.types';
import type { TagType } from '~/shared/types/ui/tag.types';

import FlowAccessStatus from '../FlowAccessStatus.vue';
import FlowCardStats from './FlowCardStats.vue';

defineProps<{
  data: PublicFlow[];
  loading: boolean;
  totalPages: number;
  cardLink?: (item: PublicFlow) => string;
  showStatus?: boolean;
  showActions?: boolean;
  showLike?: boolean;
  showCopy?: boolean;
  emptyHtml?: string;
}>();

defineEmits<{
  (e: 'delete', item: PublicFlow): void;
  (e: 'toggle-like', item: PublicFlow): void;
  (e: 'copy', item: PublicFlow): void;
}>();

const currentPage = defineModel<number>('currentPage', { required: true });

const statusTagType = (status: PublicFlowStatus): TagType => {
  const map: Record<PublicFlowStatus, TagType> = {
    Approve: 'success',
    Review: 'warning',
    Decline: 'error',
  };
  return map[status];
};

const statusLabel = (status: PublicFlowStatus): string => {
  const map: Record<PublicFlowStatus, string> = {
    Approve: 'Опубликован',
    Review: 'На модерации',
    Decline: 'Отклонён',
  };
  return map[status];
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.public-flow-list {
  &__item-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: 100%;
  }

  &__status-row {
    margin-top: 4px;
  }

  &__socials {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
    margin-bottom: auto;
  }

  &__stats {
    display: flex;
    gap: 12px;
    margin-top: 4px;
    font-size: 12px;
    color: colors.$text-light;
  }

  &__actions-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }

  &__copy-button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border: 1px solid colors.$border;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    background: transparent;
    color: colors.$text-light;
    transition:
      color 0.2s,
      border-color 0.2s;
    width: fit-content;

    &:hover {
      color: colors.$accent;
      border-color: colors.$accent;
    }
  }

  &__copied-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    font-size: 12px;
    color: colors.$success;
  }

  &__like-button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border: 1px solid colors.$border;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    background: transparent;
    color: colors.$text-light;
    transition:
      color 0.2s,
      border-color 0.2s;
    width: fit-content;

    &:hover {
      color: #ef4444;
      border-color: #ef4444;
    }

    &--active {
      color: #ef4444;
      border-color: #ef4444;
    }
  }
}
</style>
