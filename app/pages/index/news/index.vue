<template>
  <section class="news-page landing-container">
    <news-breadcrumbs :crumbs="breadcrumbs" />

    <h1 class="news-page__title headline-1 landing-title">
      {{ $t('news.title') }}
    </h1>

    <div class="news-filters">
      <input-ui
        v-model="filters.title"
        :input-props="{
          placeholder: $t('news.filters.titlePlaceholder'),
          disabled: pending,
        }"
        form-wrapper-class="news-filters__field"
      />

      <select-ui
        v-model="filters.subcategory_id"
        :options="subcategories.data.value || []"
        :loading="subcategories.loading.value"
        :select-props="{
          placeholder: $t('news.filters.allSubcategories'),
          disabled: pending || subcategories.loading.value,
        }"
        form-wrapper-class="news-filters__field"
        @update:search-query="subcategories.debouncedGetData(1, true)"
        @reach-end="subcategories.getData(subcategories.meta.value.page + 1)"
      />

      <select-ui
        v-model="filters.hashtag_names"
        :options="hashtags.data.value || []"
        :loading="hashtags.loading.value"
        :select-props="{
          placeholder: $t('news.filters.allHashtags'),
          disabled: pending || hashtags.loading.value,
        }"
        form-wrapper-class="news-filters__field"
        @update:search-query="hashtags.debouncedGetData(1, true)"
        @reach-end="hashtags.getData(hashtags.meta.value.page + 1)"
      />

      <div class="news-filters__actions">
        <button-ui @click="applyFilters">
          {{ $t('news.filters.search') }}
        </button-ui>
        <button-ui
          variant="outlined"
          @click="resetFilters">
          {{ $t('news.filters.reset') }}
        </button-ui>
      </div>
    </div>

    <div
      v-if="pending && !newsList.length"
      class="news-page__loading">
      <spinner-ui :size="48" />
    </div>

    <div
      v-else-if="newsList.length"
      class="news-page__grid">
      <news-card
        v-for="item in newsList"
        :key="item.id"
        :news="item" />
    </div>

    <p
      v-else-if="!pending"
      class="news-page__empty text-16">
      {{ $t('news.empty') }}
    </p>

    <button
      v-if="hasMore"
      class="news-page__load-more text-14"
      type="button"
      :disabled="loadingMore"
      @click="loadMore"
    >
      {{ $t('news.loadMore') }}
    </button>
  </section>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import { getNewsListSSR } from '~/domain/news/api/news.ssr-api';
import type { News } from '~/domain/news/models/news.types';
import { getNewsHashtags } from '~/domain/news-hashtag/api/news-hashtag.api';
import type { NewsHashtag } from '~/domain/news-hashtag/models/news-hashtag.types';
import { getNewsSubcategories } from '~/domain/news-subcategory/api/news-subcategories.api';
import type { NewsSubcategory } from '~/domain/news-subcategory/models/news-subcategory.types';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import { SITE_NAME } from '~/shared/constants/site-info.const';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { stripHtml } from '~/shared/utils/stripHtml';

import NewsBreadcrumbs from './_components/NewsBreadcrumbs.vue';
import NewsCard from './_components/NewsCard.vue';

type NewsFilters = {
  title: string | null;
  subcategory_id: string | null;
  hashtag_names: string | null;
};

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// Parse filters from route.query BEFORE initial request (works in SSR)
const filters = ref<NewsFilters>({
  title: (route.query.title as string) || null,
  subcategory_id: (route.query.subcategory_id as string) || null,
  hashtag_names: (route.query.hashtag_names as string) || null,
});
const loadingMore = ref(false);

const breadcrumbs = computed(() => [
  { label: t('news.breadcrumbs.home'), to: '/' },
  { label: t('news.breadcrumbs.news') },
]);

const subcategories = useSelectInfiniteScroll<NewsSubcategory>({
  mapFunc: (item) => ({ label: item.name, value: item.id }),
  requestFunc: getNewsSubcategories,
  errorMessage: 'Ошибка при получении подкатегорий новостей',
  requestParams: (_meta, searchValue) => ({
    is_visible_on_landing: 1,
    name: searchValue,
  }),
});

const hashtags = useSelectInfiniteScroll<NewsHashtag>({
  mapFunc: (item) => ({ label: item.name, value: item.name }),
  requestFunc: getNewsHashtags,
  errorMessage: 'Ошибка при получении хэштегов новостей',
  requestParams: (_meta, searchValue) => ({
    name: searchValue,
  }),
});

function buildParams(page = 1) {
  return objectToQueryString({
    is_visible_on_landing: 1,
    page,
    per_page: 12,
    title: filters.value.title || null,
    subcategory_id: filters.value.subcategory_id || null,
    hashtag_names: filters.value.hashtag_names
      ? [filters.value.hashtag_names]
      : null,
  });
}

// SSR initial fetch — filters are already parsed synchronously above
const {
  data: newsData,
  pending,
  refresh,
} = await useAsyncData('news-list', () => {
  const params = buildParams();
  return getNewsListSSR(params);
});

const newsList = ref<News[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);

watch(
  newsData,
  (val) => {
    if (val) {
      newsList.value = val.data;
      totalPages.value = val.meta.pagination.total_pages;
      currentPage.value = val.meta.pagination.page;
    }
  },
  { immediate: true },
);

const hasMore = computed(() => currentPage.value < totalPages.value);

async function loadMore() {
  loadingMore.value = true;
  try {
    const result = await getNewsListSSR(buildParams(currentPage.value + 1));
    newsList.value = [...newsList.value, ...result.data];
    currentPage.value = result.meta.pagination.page;
    totalPages.value = result.meta.pagination.total_pages;
  } finally {
    loadingMore.value = false;
  }
}

function applyFilters() {
  const query: Record<string, string> = {};
  if (filters.value.title) query.title = filters.value.title;
  if (filters.value.subcategory_id)
    query.subcategory_id = filters.value.subcategory_id;
  if (filters.value.hashtag_names)
    query.hashtag_names = filters.value.hashtag_names;

  router.push({ query });
  refresh();
}

function resetFilters() {
  filters.value = {
    title: null,
    subcategory_id: null,
    hashtag_names: null,
  };
  router.push({ query: {} });
  refresh();
}

onMounted(() => {
  subcategories.getData(1);
  hashtags.getData(1);
});

const pageTitle = `${t('news.title')} - ${SITE_NAME}`;

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
          },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: t('news.title'),
        itemListElement: newsList.value.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `/news/${item.url || item.id}`,
          name: item.seo_title || item.title,
          description: item.seo_description || stripHtml(item.content, 2),
        })),
      }),
    },
  ],
});

useServerSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: t('news.seoDescription'),
  ogDescription: t('news.seoDescription'),
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.news-page {
  display: flex;
  flex-direction: column;
  gap: offsets.$offset-24;

  &__title {
    text-align: left;
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: offsets.$offset-40 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: offsets.$offset-24;

    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__empty {
    --color: #{colors.$text-light};

    color: var(--color);
    text-align: center;
    padding: offsets.$offset-40 0;
  }

  &__load-more {
    align-self: center;
    padding: 12px 32px;
    border: 1px solid colors.$primary;
    border-radius: 8px;
    background-color: transparent;
    color: colors.$primary;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
      background-color: colors.$primary;
      color: colors.$white;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.news-filters {
  display: flex;
  gap: offsets.$offset-16;
  flex-wrap: wrap;
  align-items: flex-end;

  &__field {
    width: 100%;
    max-width: 300px;
  }

  &__actions {
    display: flex;
    gap: offsets.$offset-8;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

[data-theme='dark'] .news-page {
  &__empty {
    --color: #{colors.$background};
  }
}
</style>
