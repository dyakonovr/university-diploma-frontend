<template>
  <section>
    <account-table-header
      create-link-to="/account/artifacts/create"
      :filters-props="{
        filters,
        loading,
      }"
      @filters-search="onSearchFilterClick"
      @filters-reset="onResetFiltersClick"
    >
      <template #filters>
        <input-ui
          v-model="filters.name"
          :input-props="{ placeholder: 'Название', disabled: loading }"
        />
        <select-ui
          v-model="filters.type"
          :options="ARTIFACTS_TYPE"
          :searchable="false"
          :select-props="{ placeholder: 'Тип артефакта', disabled: loading }"
        />
        <select-ui
          v-if="filters.type === 'binary'"
          v-model="filters.content_type"
          :options="ARTIFACTS_CONTENT_TYPE"
          :searchable="false"
          :select-props="{ placeholder: 'Content type', disabled: loading }"
        />
      </template>
    </account-table-header>

    <cards-view
      v-model:current-page="meta.page"
      with-pagination
      :data="data || []"
      :total-pages="meta.total_pages"
      :loading="loading"
      :empty-html="ARTIFACTS_EMPTY_DESCRIPTION"
      :card-link="(item) => `/account/artifacts/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #title="{ item }">
        <span class="artifacts__type-icon">{{
          getArtifactTypeIcon(item)
        }}</span>
        {{ item.name || 'Без названия' }}
      </template>

      <template #body="{ item }">
        <span
          v-if="item.type === 'text'"
          class="artifacts__text-value"
          v-html="buildTextArtifactPreview(item.data || '', 200)"
        />
        <div
          v-else
          class="artifacts__binary-value">
          <artifact-preview :artifact="item" />
          {{ getArtifactTypeLabel(item) }}
          <artifact-download-link :artifact-id="item.id" />
        </div>
      </template>

      <template #actions="{ item }">
        <table-action-menu
          :edit-link="`/account/artifacts/${item.id}`"
          @delete-click="handleDelete(item)"
        />
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
import { deleteArtifact } from '~/domain/artifact/api/artifacts.api';
import {
  ARTIFACTS_CONTENT_TYPE,
  ARTIFACTS_TYPE,
} from '~/domain/artifact/constants/artifact.const';
import type { Artifact } from '~/domain/artifact/models/artifact.types';
import {
  isAudioArtifact,
  isImageArtifact,
  isVideoArtifact,
} from '~/domain/artifact/services/artifact-type';
import ArtifactDownloadLink from '~/domain/artifact/ui/ArtifactDownloadLink.vue';
import ArtifactPreview from '~/domain/artifact/ui/ArtifactPreview.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { ARTIFACTS_EMPTY_DESCRIPTION } from '~/shared/constants/empty-descriptions.const';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useArtifactsTableData from './_composables/useArtifactsTableData';
import useArtifactsTableFilters from './_composables/useArtifactsTableFilters';

const { filters, parseFiltersFromUrl, resetFilters } =
  useArtifactsTableFilters();

const { data, loading, meta, getTableData } = useArtifactsTableData({
  requestParams: () => ({
    name: filters.value.name || null,
    type: filters.value.type || null,
    content_type: filters.value.content_type || null,
  }),
});

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<Artifact>({
  errorMessage: 'Ошибка при удалении Артефакта',
  successMessage: 'Артефакт успешно удалён',
  deleteFunc: deleteArtifact,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.name || 'Артефакт без названия',
});

const getArtifactTypeIcon = (artifact: Artifact): string => {
  if (artifact.type === 'text') return 'T';
  if (isImageArtifact(artifact)) return '\uD83D\uDDBC\uFE0F';
  if (isVideoArtifact(artifact)) return '\uD83C\uDFAC';
  if (isAudioArtifact(artifact)) return '\uD83C\uDFB5';
  return '\uD83D\uDCC4';
};

const getArtifactTypeLabel = (artifact: Artifact): string => {
  if (isImageArtifact(artifact)) return 'Изображение';
  if (isVideoArtifact(artifact)) return 'Видео';
  if (isAudioArtifact(artifact)) return 'Аудио';
  return artifact.content_type ?? 'Файл';
};

const buildTextArtifactPreview = (html?: string, limit = 200) => {
  if (!html) return '';

  const container = document.createElement('div');
  container.innerHTML = html;

  container.querySelectorAll('table').forEach((table) => {
    const badge = document.createElement('span');
    badge.textContent = '\uD83D\uDCCA Таблица';
    badge.className = 'artifact-preview__badge';
    table.replaceWith(badge);
  });

  container.querySelectorAll('img, iframe, video').forEach((el) => {
    el.remove();
  });

  const text = container.textContent || '';

  if (text.length <= limit) {
    return container.innerHTML;
  }

  const trimmed = text.slice(0, limit) + '\u2026';

  return trimmed;
};

const onSearchFilterClick = () => {
  meta.value.page = 1;
  getTableData();
};

const onResetFiltersClick = () => {
  resetFilters();
  onSearchFilterClick();
};

onBeforeMount(async () => {
  parseFiltersFromUrl();
  parsePaginationFromUrl(meta);

  loading.value = true;
  await Promise.all([getTableData()]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Артефакты';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style scoped lang="scss">
@use '/assets/styles/base/colors' as colors;

.artifacts {
  &__type-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-right: 4px;
    padding: 8px;
    border-radius: 12px;
    color: colors.$white;
    background-color: colors.$primary;
  }

  &__text-value {
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      font-size: 18px;
    }

    :deep(.artifact-preview__badge) {
      display: inline-block;
      padding: 2px 6px;
      font-size: 12px;
      background: #eef2ff;
      color: #3b82f6;
      border-radius: 6px;
    }
  }

  &__binary-value {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
