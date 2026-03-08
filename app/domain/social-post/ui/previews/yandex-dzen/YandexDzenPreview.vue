<template>
  <yandex-dzen-article-list-preview
    v-if="!isArticleShowed"
    :preview="preview"
    @on-article-click="isArticleShowed = true" />
  <yandex-dzen-article-preview
    v-else
    :preview="preview"
    @on-get-back-button-click="isArticleShowed = false" />
</template>

<script lang="ts" setup>
import type { SocialPostData } from '~/domain/social-post/models/social-post-preview.types';

import YandexDzenArticleListPreview from './YandexDzenArticleListPreview.vue';
import YandexDzenArticlePreview from './YandexDzenArticlePreview.vue';

type Props = {
  preview: SocialPostData['post']['preview'];
};
defineProps<Props>();

const isArticleShowed = ref(false);
</script>
