<template>
  <article class="news-card">
    <nuxt-link
      :to="`/news/${slug}`"
      class="news-card__link">
      <div class="news-card__image-wrapper">
        <img
          :src="displaySrc"
          :alt="news.title"
          class="news-card__image" >
      </div>

      <div class="news-card__body">
        <h3 class="news-card__title text-18">
          {{ news.title }}
        </h3>

        <p class="news-card__excerpt text-14">
          {{ excerpt }}
        </p>

        <div class="news-card__footer">
          <news-hashtag-list :hashtags="news.hashtags" />

          <time
            :datetime="news.created_at"
            class="news-card__date text-12">
            {{ formattedDate }}
          </time>
        </div>
      </div>
    </nuxt-link>
  </article>
</template>

<script setup lang="ts">
import type { News } from '~/domain/news/models/news.types';
import { getNewsSlug } from '~/domain/news/services/news-slug.service';
import { formatDateToNormalized } from '~/shared/utils/core/formatDateToNormalized';
import { stripHtml } from '~/shared/utils/stripHtml';

import NewsHashtagList from './NewsHashtagList.vue';

const props = defineProps<{
  news: News;
}>();

const placeholderImage = '/images/account/dzen-article-placeholder.jpg';

const displaySrc = props.news.preview_image_url || placeholderImage;

const slug = computed(() => getNewsSlug(props.news));

const excerpt = computed(() => {
  const text = stripHtml(props.news.content, 2);
  return text.length > 150 ? text.slice(0, 150) + '...' : text;
});

const formattedDate = computed(() =>
  formatDateToNormalized(props.news.created_at, {
    second: undefined,
    outputPattern: '$3.$2.$1',
  }),
);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.news-card {
  --border-color: #{colors.$border};
  --background-color: #{colors.$white};

  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--background-color);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &__link {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }

  &__image-wrapper {
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: offsets.$offset-16;
    gap: offsets.$offset-8;
  }

  &__title {
    font-weight: 600;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__excerpt {
    --color: #{colors.$text-light};

    color: var(--color);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: offsets.$offset-8;
    margin-top: auto;
    padding-top: offsets.$offset-8;
  }

  &__date {
    --color: #{colors.$text-light};

    color: var(--color);
    white-space: nowrap;
  }
}

[data-theme='dark'] .news-card {
  --background-color: #{colors.$dark-grey};

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.24);
  }

  &__excerpt {
    --color: #{colors.$background};
  }

  &__date {
    --color: #{colors.$background};
  }
}
</style>
