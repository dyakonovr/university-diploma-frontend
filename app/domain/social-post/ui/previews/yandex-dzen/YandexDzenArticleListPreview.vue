<template>
  <yandex-dzen-layout>
    <div class="dzen-cards">
      <article
        class="dzen-cards__item"
        @click="onArticleClick">
        <div class="dzen-cards__item-preview">
          <img
            v-if="preview.cover_image"
            :src="preview.cover_image"
            alt="Preview photo"
          >

          <img src="/images/account/dzen-article-placeholder.jpg" >
        </div>

        <div class="dzen-cards__item-header">
          <div class="dzen-cards__item-header-left">
            <img
              src="https://picsum.photos/600/400?2"
              class="dzen-cards__item-channel-logo"
            >
          </div>
          <div class="dzen-cards__item-header-right">
            <p class="dzen-cards__item-channel-title">Аккаунт Dzen</p>
            <p class="dzen-cards__item-subtitle">9000 читали</p>
          </div>
        </div>

        <div class="dzen-cards__item-content">
          <p
            v-if="preview.title"
            class="dzen-cards__item-title"
            v-html="preview.title"
          />
          <p
            class="dzen-cards__item-description"
            v-html="preview.preview_text"
          />
        </div>
      </article>
    </div>
  </yandex-dzen-layout>
</template>

<script setup lang="ts">
import type { SocialPostData } from '~/domain/social-post/models/social-post-preview.types';

import YandexDzenLayout from './YandexDzenLayout.vue';

type Props = {
  preview: SocialPostData['post']['preview'];
};
defineProps<Props>();

const emit = defineEmits<{
  (e: 'on-article-click'): void;
}>();

const onArticleClick = () => emit('on-article-click');
</script>

<style lang="scss">
// "Stella Sans",-apple-system,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,"Helvetica Neue","Helvetica",roboto,arial,sans-serif
.dzen-cards {
  display: flex;
  gap: 16px;
  margin-top: 16px;

  &__item {
    --zenColorTextPrimary: rgba(6, 6, 15, 0.87);
    --zenColorStrokePrimary: rgba(6, 6, 15, 0.25);
    --zenColorTextSecondary: rgba(6, 6, 15, 0.6);

    display: flex;
    flex-direction: column;
    border-radius: 20px;
    max-width: 360px;
    background-color: #fff;
    border: 0.5px solid var(--zenColorStrokePrimary);
    padding-bottom: 16px;
    cursor: pointer;

    &-preview {
      height: 202.5px;
      overflow: hidden;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-header,
    &-content {
      padding: 0 16px;
    }

    &-header {
      display: flex;
      gap: 8px;
      padding-top: 12px;

      &-right {
        display: flex;
        flex-direction: column;
      }
    }

    &-channel-logo {
      min-width: 32px;
      max-width: 32px;
      min-height: 32px;
      max-height: 32px;
      border-radius: 100%;
      background-color: var(--zenColorStrokePrimary);
    }

    &-channel-title {
      color: var(--zenColorTextPrimary);
      letter-spacing: 0.04px;
      font-size: 13px;
      line-height: 16px;
      font-weight: 600;
    }

    &-subtitle {
      color: var(--zenColorTextSecondary);
      font-size: 13px;
      line-height: 16px;
      font-weight: 600;
    }

    &-title {
      font-size: 16px;
      line-height: 20px;
      font-weight: 600;
      letter-spacing: 0.12px;
      margin: 4px 0;
    }

    &-description {
      color: var(--zenColorTextSecondary);
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
    }
  }
}
</style>
