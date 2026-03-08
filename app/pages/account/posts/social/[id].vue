<template>
  <account-form-header @get-back="getBack" />

  <form-container
    class="divided social-post"
    :loading="loading">
    <template #header>
      <div class="social-post__form-header">
        <p class="form-container__title">Информация о посте</p>
        <schedule-tag
          v-if="data?.schedule_id"
          :schedule-id="data.schedule_id"
          clickable
          fetch-slot
        />
      </div>
    </template>

    <div class="form-container-padding">
      <div
        v-if="loading && !data"
        class="social-post__loading-state">
        <spinner-ui />
      </div>

      <template v-else-if="data">
        <div class="social-post__info-grid">
          <div class="social-post__info-row">
            <span class="social-post__info-label">ID поста:</span>
            <span class="social-post__info-value">{{ data.id }}</span>
          </div>

          <!-- <div class="social-post__info-row">
            <span class="social-post__info-label">Raw Post ID:</span>
            <span class="social-post__info-value">{{ data.post_id }}</span>
          </div> -->

          <div class="social-post__info-row">
            <span class="social-post__info-label"
            >Запланированная публикация:</span
            >
            <span class="social-post__info-value">
              {{ formatDate(data.post_at) }}
            </span>
          </div>

          <div class="social-post__info-row">
            <span class="social-post__info-label">Опубликован:</span>
            <span class="social-post__info-value">
              {{ data.posted_at ? formatDate(data.posted_at) : '—' }}
            </span>
          </div>

          <div class="social-post__info-row">
            <span class="social-post__info-label">Создан:</span>
            <span class="social-post__info-value">
              {{ formatDate(data.created_at) }}
            </span>
          </div>

          <div class="social-post__info-row">
            <span class="social-post__info-label">Обновлён:</span>
            <span class="social-post__info-value">
              {{ formatDate(data.updated_at) }}
            </span>
          </div>

          <div
            v-if="data.post_url"
            class="social-post__info-row">
            <span class="social-post__info-label">Ссылка на пост:</span>
            <span class="social-post__info-value">
              <external-link
                :href="data.post_url"
                label="Открыть в соц. сети"
              />
            </span>
          </div>
        </div>

        <!-- Превью поста -->
        <div class="social-post__preview-section">
          <social-post-preview
            :preview="data.preview"
            :loading="loading" />
        </div>
      </template>
    </div>
  </form-container>

  <social-post-statistic
    v-if="data"
    :request-func="requestStatistic"
    dynamic-title="Динамика по посту"
    total-title="Общая статистика поста"
  />

  <form-buttons
    :with-submit="false"
    cancel-text="Назад"
    @cancel="getBack" />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import ScheduleTag from '~/domain/schedule/ui/ScheduleTag.vue';
import { getSocialPostDynamicStatistic } from '~/domain/social-post/api/social-post-statistic.api';
import SocialPostPreview from '~/domain/social-post/ui/SocialPostPreview.vue';
import SocialPostStatistic from '~/domain/social-post/ui/statistic/SocialPostStatistic.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import type { QueryParams } from '~/shared/types/core/request.types';
import ExternalLink from '~/shared/ui/ExternalLink.vue';

import useSocialPostForm from './_composables/useSocialPostForm';

const { data, loading, getBack, getData } = useSocialPostForm();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const requestStatistic = async (params: QueryParams) => {
  if (!data.value) return [];

  const response = await getSocialPostDynamicStatistic(data.value.id, params);
  return response.data.data;
};

onBeforeMount(async () => {
  loading.value = true;
  await getData();
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Просмотр поста в соц. сети' });
useAccountSeoTitle(() => (data.value?.id ? `Пост #${data.value.id}` : null), {
  snapshot: true,
  fallback: 'Просмотр поста в соц. сети',
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.social-post {
  &__form-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid colors.$border;
  }

  &__info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  &__info-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: colors.$background;
    border: 1px solid colors.$border;
    border-radius: 8px;
  }

  &__info-label {
    font-size: 13px;
    color: colors.$text-light;
    font-weight: 500;
  }

  &__info-value {
    font-size: 15px;
    font-weight: 500;
    color: colors.$text;
    word-break: break-word;
  }

  &__preview-section {
    margin-top: 32px;
  }
}

@media (max-width: 640px) {
  .social-post {
    &__info-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
