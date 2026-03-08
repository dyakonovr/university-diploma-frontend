<template>
  <account-form-header @get-back="getBack" />

  <form-container
    class="post divided"
    :loading="loading">
    <template #header>
      <div class="post__header">
        <p class="form-container__title">Информация о генерации</p>
        <post-status-tag
          v-if="data"
          :status="data.status" />
        <schedule-tag
          v-if="data?.schedule_id"
          :schedule-id="data.schedule_id"
          :flow-id="data.flow_id"
          clickable
          fetch-slot
        />
      </div>
    </template>

    <div class="form-container-padding">
      <div
        v-if="loading && !data"
        class="post__loading-state">
        <spinner-ui />
      </div>

      <template v-else-if="data">
        <div class="post__info-grid">
          <div class="post__info-row">
            <span class="post__info-label">ID поста:</span>
            <span class="post__info-value">{{ data.id }}</span>
          </div>
          <div class="post__info-row">
            <span class="post__info-label">ID Flow:</span>
            <span class="post__info-value">{{ data.flow_id }}</span>
          </div>
          <div class="post__info-row">
            <span class="post__info-label">Создан:</span>
            <span class="post__info-value">{{
              formatDate(data.created_at)
            }}</span>
          </div>
          <div class="post__info-row">
            <span class="post__info-label">Обновлен:</span>
            <span class="post__info-value">{{
              formatDate(data.updated_at)
            }}</span>
          </div>
          <div
            v-if="contentStageTokensTotal > 0"
            class="post__info-row">
            <span class="post__info-label"
            >Использовано в работе контекстных этапов:</span
            >
            <span class="post__info-value">
              {{ contentStageTokensTotal }}
              {{
                pluralizeRu(
                  contentStageTokensTotal,
                  'токен',
                  'токена',
                  'токенов',
                )
              }}
            </span>
          </div>
          <div
            v-if="totalTokens > 0"
            class="post__info-row">
            <span class="post__info-label">Всего использовано токенов:</span>
            <span class="post__info-value">
              {{ totalTokens }}
              {{ pluralizeRu(totalTokens, 'токен', 'токена', 'токенов') }}
            </span>
          </div>
        </div>

        <div
          v-if="data.error"
          class="post__error">
          <div class="post__error-icon">⚠</div>
          <div class="post__error-content">
            <div class="post__error-title">Ошибка генерации</div>
            <pre class="post__error-message">{{ data.error }}</pre>
          </div>
        </div>

        <!-- Блоки поста -->
        <div class="post__blocks-section">
          <button
            type="button"
            class="text-18 weight-600 post__blocks-section-title"
            :class="{ 'post__blocks-section-title--opened': isOpened }"
            @click="toggle"
          >
            Блоки генерации
            <chevron-down-icon />
          </button>

          <template v-if="isOpened">
            <p
              v-if="!data.blocks.length"
              class="post__no-data">
              Блоков пока нет...
            </p>

            <div class="post__blocks-list">
              <post-form-block
                v-for="(block, idx) in data.blocks"
                :key="block.id"
                :block="block"
                :index="idx"
              />
            </div>
          </template>
        </div>
      </template>
    </div>
  </form-container>

  <form-container
    v-if="isPostingBlockShowed && data"
    class="divided"
    :loading="postingLoading"
  >
    <template #header>
      <p class="form-container__title">Постинг</p>
    </template>

    <div class="post__posting-form">
      <raw-post-form-all-artifacts :post-blocks="data.blocks" />
      <raw-post-posting-form />
    </div>
  </form-container>

  <form-container
    v-if="data?.status === 'completed' && socialPostsData.data.value?.length"
    class="divided"
    :loading="postingLoading"
  >
    <template #header>
      <p class="form-container__title">Посты в соц. сетях</p>
    </template>

    <div class="form-container-padding-x">
      <social-post-cards-view
        v-model:pagination="socialPostsData.meta.value"
        :loading="loading"
        :data="socialPostsData.data.value"
      />
    </div>
  </form-container>

  <form-buttons
    :with-submit="false"
    cancel-text="Назад"
    @cancel="getBack" />
</template>

<script setup lang="ts">
import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import PostStatusTag from '~/domain/raw-post/ui/RawPostStatusTag.vue';
import ScheduleTag from '~/domain/schedule/ui/ScheduleTag.vue';
import useSocialPostsTableData from '~/domain/social-post/composables/useSocialPostsTableData';
import SocialPostCardsView from '~/domain/social-post/ui/SocialPostCardsView.vue';
import useAccordion from '~/shared/composables/useAccordion';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { pluralizeRu } from '~/shared/utils/pluralizeRu';

import RawPostFormAllArtifacts from './_components/all-artifacts/RawPostFormAllArtifactsList.vue';
import PostFormBlock from './_components/blocks/RawPostFormBlock.vue';
import RawPostPostingForm from './_components/RawPostPostingForm.vue';
import useRawPostForm from './_composables/useRawPostForm';
import { useRawPostStore } from './_stores/raw-post-form';

const { data, editId, getBack, getData } = useRawPostForm();

const { isOpened, toggle } = useAccordion();

const socialPostsData = useSocialPostsTableData({
  requestParams: () => ({
    post_id: data.value?.id ?? null,
  }),
});

const postsStore = useRawPostStore();
const loading = computed(() => postsStore.isGlobalLoading);
const postingLoading = computed(() => postsStore.postingLoading);

const contentStageTokensTotal = computed(() =>
  (data.value?.context_stage_tokens ?? []).reduce(
    (sum, t) => sum + t.tokens_used,
    0,
  ),
);

const totalTokens = computed(() => {
  const blockTokens = (data.value?.blocks ?? []).reduce(
    (sum, block) =>
      sum + block.step_tokens.reduce((s, t) => s + t.tokens_used, 0),
    0,
  );
  return blockTokens + contentStageTokensTotal.value;
});

const isPostingBlockShowed = computed(
  () =>
    !!data.value?.blocks &&
    !!postsStore.postId &&
    data.value?.status === 'completed',
);

// Форматирование даты
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

// onBeforeMount(async () => {
//   loading.value = true;
//   await Promise.all([
//     getData()
//   ]);
//   loading.value = false;
// });

let intervalId: number | null = null;

async function loadData() {
  postsStore.startLoading();
  await getData();
  postsStore.postId = editId.value;
  postsStore.stopLoading();
}

watch(
  () => [data.value?.status, data.value?.id],
  ([status, id]) => {
    if (status === 'completed' && id) {
      socialPostsData.getTableData();
    }
  },
  { immediate: true },
);

watch(
  () => postsStore.socialPostsRevision,
  (revision) => {
    if (revision > 0) socialPostsData.getTableData();
  },
);

onBeforeMount(async () => {
  await loadData();

  intervalId = window.setInterval(() => {
    if (data.value?.status === 'processing') getData();
  }, 5000);
});

onUnmounted(() => {
  postsStore.clear();

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});

provide('postId', editId);

// --- SEO ---
definePageMeta({ title: 'Просмотр генерации поста' });
useAccountSeoTitle(
  () => (data.value?.id ? `Генерация #${data.value.id}` : null),
  {
    snapshot: true,
    fallback: 'Просмотр генерации поста',
  },
);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/components/form' as form;

.post {
  &__header {
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

  &__info {
    &-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    &-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px;
      background: colors.$background;
      border: 1px solid colors.$border;
      border-radius: 8px;
    }

    &-label {
      font-size: 13px;
      color: colors.$text-light;
      font-weight: 500;
    }

    &-value {
      font-size: 15px;
      font-weight: 500;
      color: colors.$text;
      word-break: break-word;
    }
  }

  &__error {
    display: flex;
    gap: 16px;
    padding: 16px;
    margin-bottom: 24px;

    background: #fff5f5;
    border: 1px solid #f5c2c7;
    border-left: 4px solid #dc3545;
    border-radius: 8px;

    &-icon {
      font-size: 20px;
      line-height: 1;
    }

    &-title {
      font-weight: 600;
      margin-bottom: 6px;
      color: #b02a37;
    }

    &-message {
      margin: 0;
      font-family: monospace;
      font-size: 13px;
      white-space: pre-wrap;
      word-break: break-word;
      color: #842029;
    }
  }

  &__blocks-section {
    margin-top: 32px;

    &-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;

      svg {
        width: 14px;
        height: 14px;
        transform: rotate(0deg);
      }

      &--opened {
        svg {
          transform: rotate(180deg);
        }
      }
    }
  }

  &__no-data {
    text-align: center;
    padding: 40px;
    color: colors.$text-light;
    font-style: italic;
  }

  &__blocks-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__posting-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    @media screen and (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 640px) {
  .post {
    &__info-grid {
      grid-template-columns: 1fr;
    }

    &__block-card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    &__block-card-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    &__block-card-actions {
      width: 100%;
      justify-content: flex-start;
    }

    &__artifact-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    &__artifact-info {
      width: 100%;
    }
  }
}
</style>
