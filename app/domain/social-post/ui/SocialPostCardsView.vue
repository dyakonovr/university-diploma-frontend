<template>
  <cards-view
    v-model:current-page="meta.page"
    with-pagination
    :data="data || []"
    :total-pages="meta.total_pages"
    :loading="loading"
    :card-link="(item) => `/account/posts/social/${item.id}`"
  >
    <template #title="{ item }">
      <div class="social-posts__item-title">
        <div class="social-posts__item-title-left">
          Пост в соц. сети
          <social-badge :provider="item.preview.social_network" />
        </div>
        <schedule-tag
          v-if="item.schedule_id"
          :schedule-id="item.schedule_id"
          :clickable="false"
        />
      </div>
    </template>

    <template #body="{ item }">
      <div class="social-posts__item-body">
        <div class="social-posts__preview">
          <div
            v-if="getPreviewImage(item)"
            class="social-posts__preview-image-wrapper"
          >
            <img
              :src="getPreviewImage(item) || ''"
              alt="preview"
              class="social-posts__preview-image"
            >
          </div>

          <div class="social-posts__preview-content">
            <p class="social-posts__preview-text">
              {{ getPreviewText(item) }}
            </p>
          </div>
        </div>

        <div class="social-posts__meta">
          <p>
            Запланирован —
            {{ formatDateToNormalized(item.post_at) }}
          </p>
          <p>
            Фактически опубликован —
            {{ formatDateToNormalized(item.posted_at) }}
          </p>
          <p>
            Создан —
            {{ formatDateToNormalized(item.created_at) }}
          </p>
          <external-link
            v-if="item.post_url"
            :href="item.post_url"
            label="Открыть в соц. сети"
            class="social-posts__link"
          />
        </div>
      </div>
    </template>
  </cards-view>
</template>

<script lang="ts" setup>
import CardsView from '~/components/list-views/CardsView.vue';
import SocialBadge from '~/components/SocialBadge.vue';
import ScheduleTag from '~/domain/schedule/ui/ScheduleTag.vue';
import type { ResponsePagination } from '~/shared/types/core/request.types';
import ExternalLink from '~/shared/ui/ExternalLink.vue';
import { formatDateToNormalized } from '~/shared/utils/core/formatDateToNormalized';

import type { SocialPost } from '../models/social-post.types';

type Props = {
  data: SocialPost[] | null;
  loading: boolean;
};

defineProps<Props>();

const meta = defineModel<ResponsePagination>('pagination', { required: true });

function getPreviewImage(item: SocialPost): string | null {
  return item.preview?.post?.preview?.images?.[0] || null;
}

function getPreviewText(item: SocialPost): string {
  return item.preview?.post?.preview?.preview_text ?? '';
}
</script>

<style lang="scss">
.social-posts {
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
    gap: 12px;
  }

  &__preview {
    display: flex;
    gap: 12px;
    padding: 12px;
    border-radius: 10px;
    background: #f9fafb;
    border: 1px solid #f1f5f9;
  }

  &__preview-image-wrapper {
    flex: 0 0 72px;
    width: 72px;
    height: 72px;
    border-radius: 8px;
    overflow: hidden;
    background: #e5e7eb;
  }

  &__preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__preview-content {
    flex: 1;
    min-width: 0;
  }

  &__preview-text {
    font-size: 14px;
    line-height: 1.45;
    color: #111827;
    font-weight: 500;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-top: 8px;
    border-top: 1px dashed #e5e7eb;

    font-size: 12px;
    color: #6b7280;
  }

  &__link {
    margin-top: 8px;
  }
}
</style>
