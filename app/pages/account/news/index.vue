<template>
  <section>
    <account-table-header
      create-link-to="/account/news/create"
      :filters-props="{
        filters,
        loading,
      }"
      @filters-search="onSearchFiltersClick"
      @filters-reset="onResetFiltersClick"
    >
      <template #filters>
        <input-ui
          v-model="filters.title"
          :input-props="{ placeholder: 'Заголовок', disabled: loading }"
        />
        <input-ui
          v-model="filters.content"
          :input-props="{ placeholder: 'Контент', disabled: loading }"
        />
        <select-ui
          v-model="filters.subcategory_id"
          :options="subcategories.data.value || []"
          :select-props="{
            placeholder: 'Подкатегория',
            disabled: loading || subcategories.loading.value,
          }"
          @update:search-query="subcategories.debouncedGetData(1, true)"
          @reach-end="subcategories.getData(subcategories.meta.value.page + 1)"
        >
          <template #option="{ option }">
            {{ option.label }}
            <tag-ui :type="option.is_visible ? 'success' : 'error'">
              {{ option.is_visible ? 'Видна' : 'Скрыта' }}
            </tag-ui>
          </template>
          <template #selected="{ value }">
            {{ findSubcategoryOption(value)?.label }}
            <tag-ui
              v-if="findSubcategoryOption(value)"
              :type="findSubcategoryOption(value) ? 'success' : 'error'"
              class="ml"
            >
              {{ findSubcategoryOption(value) ? 'Видна' : 'Скрыта' }}
            </tag-ui>
          </template>
        </select-ui>
        <select-ui
          v-model="filters.user_id"
          :options="users.data.value || []"
          :select-props="{
            placeholder: 'Пользователь',
            disabled: loading || users.loading.value,
          }"
          @update:search-query="users.debouncedGetData(1, true)"
          @reach-end="users.getData(users.meta.value.page + 1)"
        />
        <select-ui
          v-model="filters.hashtags"
          is-multiple
          :options="hashtags.data.value || []"
          :select-props="{
            placeholder: 'Хэштеги',
            disabled: loading || hashtags.loading.value,
          }"
          @update:search-query="hashtags.debouncedGetData(1, true)"
          @reach-end="hashtags.getData(hashtags.meta.value.page + 1)"
        />
        <select-ui
          v-model="filters.is_visible"
          :options="IS_VISIBLE_SELECT_OPTIONS"
          :searchable="false"
          :select-props="{ placeholder: 'Видна на сайте?', disabled: loading }"
        />
      </template>
    </account-table-header>

    <cards-view
      v-model:current-page="meta.page"
      with-pagination
      :data="data || []"
      :total-pages="meta.total_pages"
      :loading="loading"
      :empty-html="NEWS_EMPTY_DESCRIPTION"
      :card-link="(item) => `/account/news/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #actions="{ item }">
        <table-action-menu
          :edit-link="`/account/news/${item.id}`"
          @delete-click="handleDelete(item)"
        />
      </template>
      <template #title="{ item }">
        {{ item.title }}
      </template>
      <template #body="{ item }">
        <div class="admin-news-card__preview">
          <div
            v-if="item.preview_image_url"
            class="admin-news-card__preview-image-wrapper"
          >
            <img
              :src="item.preview_image_url"
              alt="preview"
              class="admin-news-card__preview-image"
            >
          </div>
          <div class="admin-news-card__preview-content">
            <p class="admin-news-card__preview-text">
              {{ getPreviewText(item) }}
            </p>
          </div>
        </div>

        <div class="admin-news-card__meta">
          <tag-ui :type="isNewsVisibleOnLanding(item) ? 'success' : 'error'">
            {{
              isNewsVisibleOnLanding(item) ? 'Новость видна' : 'Новость скрыта'
            }}
          </tag-ui>
          <p v-if="item.subcategory">
            {{ item.subcategory.name }}
          </p>
          <p class="admin-news-card__date">
            {{ formatDateToNormalized(item.created_at) }}
          </p>
          <external-link
            label="Открыть на сайте"
            :href="`/news/${getNewsSlug(item)}`"
            @click.stop
          />
        </div>
      </template>
    </cards-view>
  </section>

  <delete-confirmation-dialog
    v-bind="deleteItemDialogContent"
    v-model="deleteDialogVisible"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import CardsView from '~/components/list-views/CardsView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TagUi from '~/components/ui/TagUi.vue';
import { deleteNews } from '~/domain/news/api/news.api';
import type { News } from '~/domain/news/models/news.types';
import { getNewsSlug } from '~/domain/news/services/news-slug.service';
import { isNewsVisibleOnLanding } from '~/domain/news/utils/is-visible.utl';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { NEWS_EMPTY_DESCRIPTION } from '~/shared/constants/empty-descriptions.const';
import type { SelectOption } from '~/shared/types/ui/select.types';
import ExternalLink from '~/shared/ui/ExternalLink.vue';
import { formatDateToNormalized } from '~/shared/utils/core/formatDateToNormalized';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';
import { stripHtml } from '~/shared/utils/stripHtml';

import useNewsTableData from './_composables/useNewsTableData';
import useNewsTableFilters from './_composables/useNewsTableFilters';

const {
  filters,
  IS_VISIBLE_SELECT_OPTIONS,
  subcategories,
  users,
  hashtags,
  parseFiltersFromUrl,
  resetFilters,
} = useNewsTableFilters();

const { data, loading, meta, getTableData } = useNewsTableData({
  requestParams: () => ({
    title: filters.value.title || null,
    content: filters.value.content || null,
    subcategory_id: filters.value.subcategory_id || null,
    user_id: filters.value.user_id || null,
    is_visible: filters.value.is_visible || null,
    hashtag_ids: filters.value.hashtags,
  }),
});

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<News>({
  errorMessage: 'Ошибка при удалении новости',
  successMessage: 'Новость успешно удалена',
  deleteFunc: deleteNews,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.title,
});

function findSubcategoryOption(value: unknown): SelectOption | undefined {
  return (subcategories.data.value || []).find((o) => o.value === value);
}

function getPreviewText(item: News): string {
  const text = stripHtml(item.content, 2);
  return text.length > 120 ? text.slice(0, 120) + '...' : text;
}

const onSearchFiltersClick = () => {
  meta.value.page = 1;
  getTableData();
};

const onResetFiltersClick = () => {
  resetFilters();
  onSearchFiltersClick();
};

onBeforeMount(async () => {
  parseFiltersFromUrl();
  parsePaginationFromUrl(meta);

  loading.value = true;
  await Promise.all([
    getTableData(),
    subcategories.getData(1),
    users.getData(1),
    hashtags.getData(1),
  ]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Новости';
definePageMeta({ title: PAGE_TITLE, middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.admin-news-card {
  &__preview {
    display: flex;
    gap: 12px;
    padding: 12px;
    border-radius: 10px;
    background: #f9fafb;
    border: 1px solid #f1f5f9;
  }

  &__preview-image-wrapper {
    flex: 0 0 72px;
    width: 72px;
    height: 72px;
    border-radius: 8px;
    overflow: hidden;
    background: #e5e7eb;
  }

  &__preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__preview-content {
    flex: 1;
    min-width: 0;
  }

  &__preview-text {
    font-size: 14px;
    line-height: 1.45;
    color: #111827;
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 8px;
    border-top: 1px dashed #e5e7eb;
  }

  &__date {
    opacity: 0.7;
  }

  &__external-link {
    display: inline-block;
    font-size: 13px;
    color: #3b82f6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
