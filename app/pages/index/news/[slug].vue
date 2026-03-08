<template>
  <article class="news-detail landing-container">
    <news-breadcrumbs :crumbs="breadcrumbs" />

    <div
      v-if="news"
      class="news-detail__content">
      <div class="news-detail__header">
        <h1 class="news-detail__title headline-1">
          {{ news.title }}
        </h1>

        <div class="news-detail__meta">
          <time
            :datetime="news.created_at"
            class="news-detail__date text-14">
            {{ formattedDate }}
          </time>

          <news-hashtag-list
            :hashtags="news.hashtags"
            as-links />
        </div>
      </div>

      <div
        v-if="news.preview_image_url"
        class="news-detail__preview-wrapper">
        <img
          :src="previewDisplaySrc"
          :alt="news.title"
          class="news-detail__preview-image"
        >
      </div>

      <div
        class="news-detail__body text-16"
        v-html="sanitizedContent" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { getNewsByUrlSSR } from '~/domain/news/api/news.ssr-api';
import { SITE_NAME } from '~/shared/constants/site-info.const';
import { formatDateToNormalized } from '~/shared/utils/core/formatDateToNormalized';
import { stripHtml } from '~/shared/utils/stripHtml';

import NewsBreadcrumbs from './_components/NewsBreadcrumbs.vue';
import NewsHashtagList from './_components/NewsHashtagList.vue';

const { t } = useI18n();
const route = useRoute();
const slug = route.params.slug as string;

const { data: newsResponse } = await useAsyncData(`news-detail-${slug}`, () =>
  getNewsByUrlSSR(slug),
);

if (!newsResponse.value) {
  throw createError({ statusCode: 404, statusMessage: 'News not found' });
}

const news = computed(() => newsResponse.value!.data);

const breadcrumbs = computed(() => [
  { label: t('news.breadcrumbs.home'), to: '/' },
  { label: t('news.breadcrumbs.news'), to: '/news' },
  { label: news.value.title },
]);

const sanitizedContent = computed(() =>
  news.value.content.replace(
    /<table([\s\S]*?<\/table>)/g,
    '<div class="table-container"><table$1</div>',
  ),
);

const placeholderImage = '/images/account/dzen-article-placeholder.jpg';
const previewDisplaySrc = placeholderImage || news.value.preview_image_url;

const formattedDate = computed(() =>
  formatDateToNormalized(news.value.created_at, {
    second: undefined,
    outputPattern: '$3.$2.$1',
  }),
);

const pageTitle = computed(() => {
  const title = news.value.seo_title || news.value.title;
  return `${title} - ${SITE_NAME}`;
});

const pageDescription = computed(
  () => news.value.seo_description || stripHtml(news.value.content, 2),
);

useHead({
  title: pageTitle,
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('news.breadcrumbs.home'),
            item: '/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('news.breadcrumbs.news'),
            item: '/news',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: news.value.title,
          },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: news.value.title,
        datePublished: news.value.created_at,
        dateModified: news.value.updated_at,
        description: pageDescription.value,
      }),
    },
  ],
});

useServerSeoMeta({
  title: pageTitle.value,
  ogTitle: pageTitle.value,
  description: pageDescription.value,
  ogDescription: pageDescription.value,
});
</script>

<style scoped lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.news-detail {
  display: flex;
  flex-direction: column;
  gap: offsets.$offset-24;

  &__content {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-24;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-16;
  }

  &__title {
    line-height: 1.3;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: offsets.$offset-16;
    flex-wrap: wrap;
  }

  &__date {
    --color: #{colors.$text-light};

    color: var(--color);
  }

  &__preview-wrapper {
    width: 100%;
    overflow: hidden;
    border-radius: 12px;
  }

  &__preview-image {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    border-radius: 12px;
  }

  &__body {
    :deep(p) {
      line-height: 1.7;
      margin-bottom: offsets.$offset-16;
    }

    :deep(.table-container) {
      margin: 16px 0;
      overflow-x: auto;
    }

    :deep(table th),
    :deep(table td) {
      padding: 8px;
      border-color: colors.$border;
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }

    :deep(a) {
      color: colors.$primary;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(h2),
    :deep(h3),
    :deep(h4) {
      margin-top: offsets.$offset-24;
      margin-bottom: offsets.$offset-8;
    }

    :deep(ul),
    :deep(ol) {
      margin-bottom: offsets.$offset-16;
      padding-left: offsets.$offset-24;
    }
  }
}

[data-theme='dark'] .news-detail {
  &__date {
    --color: #{colors.$background};
  }
}
</style>
