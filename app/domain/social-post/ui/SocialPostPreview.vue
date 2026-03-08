<template>
  <form-wrapper-ui label="Превью">
    <p v-if="loading && !preview">Загрузка превью...</p>

    <template v-else-if="preview">
      <!-- Warnings -->
      <div
        v-if="warnings.length"
        class="preview__warnings">
        <p class="preview__warnings-title">Предупреждения:</p>
        <ul
        >
          <li
            v-for="(warning, index) in warnings"
            :key="index"
            class="preview__warning"
          >
            {{ warning }}
          </li>
        </ul>
      </div>

      <telegram-post-preview
        v-if="preview.social_network === 'telegram'"
        :preview="preview.post.preview" />
      <!-- <telegraph-article-preview
      v-if="preview.social_network === 'telegram'"
      :preview="preview.post.preview" /> -->
      <yandex-dzen-preview
        v-else-if="preview.social_network === 'yandex_dzen'"
        :preview="preview.post.preview" />
      <p v-else>Ошибка отображения превью. Обратитесь к администратору</p>
    </template>

    <p v-else>Здесь будет превью, когда вы выберите соц. сеть...</p>
  </form-wrapper-ui>
</template>

<script setup lang="ts">
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import type { SocialPostData } from '~/domain/social-post/models/social-post-preview.types';
import TelegramPostPreview from '~/domain/social-post/ui/previews/telegram/TelegramPostPreview.vue';
import TelegraphArticlePreview from '~/domain/social-post/ui/previews/telegram/TelegraphArticlePreview.vue';
import WordpressArticlePreview from '~/domain/social-post/ui/previews/wordpress/WordpressArticlePreview.vue';
import WordpressCardsListPreview from '~/domain/social-post/ui/previews/wordpress/WordpressCardsListPreview.vue';
import YandexDzenPreview from '~/domain/social-post/ui/previews/yandex-dzen/YandexDzenPreview.vue';

type Props = {
  preview: SocialPostData | null;
  loading: boolean;
};
const props = defineProps<Props>();

const warnings = computed<string[]>(() => {
  if (!props.preview) return [];

  return props.preview.post?.preview.warnings ?? [];
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.preview {
  &__warnings {
    margin-bottom: 16px;
    padding: 12px;
    background-color: rgba(colors.$accent, 0.08);
    border: 1px solid colors.$accent;
    border-radius: 8px;

    &-title {
      color: colors.$accent;
      font-weight: 600;
    }
  }

  &__warning {
    font-size: 13px;
    line-height: 1.4;
    color: colors.$accent;

    &:not(:last-child) {
      margin-bottom: 6px;
    }
  }
}
</style>
