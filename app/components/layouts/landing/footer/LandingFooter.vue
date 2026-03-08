<template>
  <footer class="footer">
    <div class="footer__container landing-container">
      <nuxt-link
        to="/"
        class="footer__logo">
        <img
          src="/assets/logos/logo-artweb-white.svg?url"
          alt="Artweb Logo" >
      </nuxt-link>

      <ul class="footer__links list-reset">
        <li
          v-for="link in FOOTER_LINKS"
          :key="link.key"
          class="footer__link text-14 weight-500"
        >
          <nuxt-link
            v-if="link.anchor.startsWith('/')"
            :to="link.anchor">
            {{ $t(`landing.${link.key}`) }}
          </nuxt-link>
          <a
            v-else
            :href="link.anchor">
            {{ $t(`landing.${link.key}`) }}
          </a>
        </li>
      </ul>

      <div class="footer__news">
        <nuxt-link
          to="/news"
          class="footer__news-title text-18 weight-500">
          {{ $t('landing.header.news') }}
        </nuxt-link>

        <ul class="footer__news-list list-reset">
          <li
            v-for="item in newsList"
            :key="item.id"
            class="footer__news-item text-14 weight-500"
          >
            <nuxt-link :to="`/news/${getNewsSlug(item)}`">
              {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { getNewsListSSR } from '~/domain/news/api/news.ssr-api';
import type { News } from '~/domain/news/models/news.types';
import { getNewsSlug } from '~/domain/news/services/news-slug.service';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';

const FOOTER_LINKS = [
  { key: 'header.forWhom', anchor: '#forWhom' },
  { key: 'header.mainFeatures', anchor: '#mainFeatures' },
  { key: 'header.tools', anchor: '#tools' },
  { key: 'header.tariff', anchor: '#tariff' },
  { key: 'header.reviews', anchor: '#reviews' },
  { key: 'header.faq', anchor: '#faq' },
];

const { data } = await useAsyncData('footer-news', () =>
  getNewsListSSR(objectToQueryString({ is_visible: 1, per_page: 5 })),
);

const newsList = computed<News[]>(() => data.value?.data ?? []);
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.footer {
  padding: offsets.$offset-40 0;
  background: linear-gradient(271.82deg, #667eea -3.15%, #764ba2 111.2%);

  &__container {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__logo {
    display: flex;
    align-items: center;

    img {
      height: 14px;
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-left: 32px;
  }

  &__link {
    color: #ffffff;
    margin: 0;

    a {
      color: inherit;
      text-decoration: none;
      transition: opacity 0.15s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  &__news {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-left: 16px;
  }

  &__news-title {
    color: #ffffff;
    text-decoration: none;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  &__news-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__news-item {
    a {
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      transition: opacity 0.15s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

@media (max-width: 768px) {
  .footer {
    &__container {
      flex-direction: column;
      align-items: flex-start;
    }

    &__links {
      margin-left: 0;
    }
  }
}
</style>
