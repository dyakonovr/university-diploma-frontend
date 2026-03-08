<template>
  <section
    v-if="newsList.length"
    id="news"
    class="news-section">
    <div class="news-section__container landing-container">
      <h2 class="news-section__title headline-1 landing-title">
        {{ $t('landing.news.title') }}
      </h2>

      <div class="news-section__grid">
        <news-card
          v-for="item in newsList"
          :key="item.id"
          :news="item" />
      </div>

      <nuxt-link
        to="/news"
        class="news-section__link text-16">
        {{ $t('landing.news.viewAll') }}
      </nuxt-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getNewsListSSR } from '~/domain/news/api/news.ssr-api';
import type { News } from '~/domain/news/models/news.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';

import NewsCard from '../../news/_components/NewsCard.vue';

const { data } = await useAsyncData('landing-news', () =>
  getNewsListSSR(objectToQueryString({ is_visible: 1, per_page: 5 })),
);

const newsList = computed<News[]>(() => data.value?.data ?? []);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.news-section {
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: offsets.$offset-24;
    margin-top: offsets.$offset-40;

    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__link {
    display: block;
    text-align: center;
    margin-top: offsets.$offset-24;
    color: colors.$primary;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
