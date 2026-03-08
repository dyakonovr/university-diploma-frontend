1. Default layout doesn't work for me. I don't know why
2. For @/app/pages/workspaces/index.vue i don't see composable, logic stay in component script. MY RULES: common situation is useEntityTableData + useEntityTableFilters + useEntityForm. If we have several forms on one page, do for each block it's own composable
3. Notices used only for information for user, not for empty states or error states. For empty state we can use `:empty-html` in cards-view or custom realization
4. Constants like @/app/pages/workspaces/[workspaceId]/employees/index.vue stay in domain constants, it's can be useful. Also check common ui types, you can use SelectOption @/app/shared/types/ui
5. I don't see forms for create/update entities (tasks, calendar events, etc). I need to check my CRUD on backend
6. Place
```
// --- SEO ---
const PAGE_TITLE = 'Интеграции';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
```
ONLY at the bottom, never at the top of script setup. Also ever divide it by comment at the top
7. For create/update ONLY forms, not dialogs. For first time dialogs only for delete item/specific situations, when i ask you to use dialogs
8. For table/cards filters use
```
<account-table-header
      create-link-to="/account/flow-categories/create"
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
        ...
      </template>
    </account-table-header>
```
9. Please, check shared dir for correct work on project (especially for delete-table-item, cache-request (not needed now, but don't delete), useSelectInfiniteScroll, etc). @/app/shared
10. Example of common module:
```
<template>
  <section>
    <account-table-header
      create-link-to="/account/flow-categories/create"
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
          v-model="filters.is_public"
          :options="IS_PUBLIC_SELECT_OPTIONS"
          :searchable="false"
          :select-props="{
            placeholder: 'Публичная категория?',
            disabled: loading,
          }"
        />
      </template>
    </account-table-header>

    <table-view
      v-model:current-page="meta.page"
      with-pagination
      :header-columns="TABLE_HEADER_COLUMNS"
      :table-data="data || []"
      :total-count-value="meta.total"
      :total-pages="meta.total_pages"
      :loading="loading"
      :row-link="(item) => `/account/flow-categories/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/flow-categories/${item.id}`"
          @delete-click="handleDelete(item)"
        />
      </template>
    </table-view>
  </section>

  <delete-confirmation-dialog
    v-bind="deleteItemDialogContent"
    v-model="deleteDialogVisible"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import { deletePublicFlowCategory } from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategory } from '~/domain/flow-category/models/flow-category.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useFlowCategoriesTableData from './_composables/useFlowCategoriesTableData';
import useFlowCategoriesTableFilters from './_composables/useFlowCategoriesTableFilters';

const { IS_PUBLIC_SELECT_OPTIONS, filters, parseFiltersFromUrl, resetFilters } =
  useFlowCategoriesTableFilters();

const { TABLE_HEADER_COLUMNS, data, loading, meta, getTableData } =
  useFlowCategoriesTableData({
    requestParams: () => ({
      name: filters.value.name || null,
      is_public:
        filters.value.is_public === null
          ? null
          : String(filters.value.is_public),
    }),
  });

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<PublicFlowCategory>({
  errorMessage: 'Ошибка при удалении категории шаблонов',
  successMessage: 'Категория шаблона успешно удалена',
  deleteFunc: deletePublicFlowCategory,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.name,
});

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
const PAGE_TITLE = 'Категории публичных шаблонов';
definePageMeta({ title: 'Категории публичных шаблонов', middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>


<template>
  <section>
    <account-table-header
      create-link-to="/account/flow-categories/create"
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
          v-model="filters.is_public"
          :options="IS_PUBLIC_SELECT_OPTIONS"
          :searchable="false"
          :select-props="{
            placeholder: 'Публичная категория?',
            disabled: loading,
          }"
        />
      </template>
    </account-table-header>

    <table-view
      v-model:current-page="meta.page"
      with-pagination
      :header-columns="TABLE_HEADER_COLUMNS"
      :table-data="data || []"
      :total-count-value="meta.total"
      :total-pages="meta.total_pages"
      :loading="loading"
      :row-link="(item) => `/account/flow-categories/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/flow-categories/${item.id}`"
          @delete-click="handleDelete(item)"
        />
      </template>
    </table-view>
  </section>

  <delete-confirmation-dialog
    v-bind="deleteItemDialogContent"
    v-model="deleteDialogVisible"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import { deletePublicFlowCategory } from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategory } from '~/domain/flow-category/models/flow-category.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useFlowCategoriesTableData from './_composables/useFlowCategoriesTableData';
import useFlowCategoriesTableFilters from './_composables/useFlowCategoriesTableFilters';

const { IS_PUBLIC_SELECT_OPTIONS, filters, parseFiltersFromUrl, resetFilters } =
  useFlowCategoriesTableFilters();

const { TABLE_HEADER_COLUMNS, data, loading, meta, getTableData } =
  useFlowCategoriesTableData({
    requestParams: () => ({
      name: filters.value.name || null,
      is_public:
        filters.value.is_public === null
          ? null
          : String(filters.value.is_public),
    }),
  });

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<PublicFlowCategory>({
  errorMessage: 'Ошибка при удалении категории шаблонов',
  successMessage: 'Категория шаблона успешно удалена',
  deleteFunc: deletePublicFlowCategory,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.name,
});

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
const PAGE_TITLE = 'Категории публичных шаблонов';
definePageMeta({ title: 'Категории публичных шаблонов', middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>

import { useDebounceFn } from '@vueuse/core';

import { getPublicFlowCategories } from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategory } from '~/domain/flow-category/models/flow-category.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useFlowCategoriesTableData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const TABLE_HEADER_COLUMNS = ref<TableViewHeaderColumn[]>([
    {
      prop: 'name',
      label: 'Название',
      minWidth: 180,
    },
    {
      prop: 'actions',
      label: 'Действия',
      fixed: 'right',
      width: 120,
    },
  ]);

  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<PublicFlowCategory[] | null>(null);
  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 10,
    per_page: 10,
    total: 10,
  });

  const getTableData = async (sortableProp?: string, sortableDir?: string) => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        // sortBy: sortableProp ?? 'created_at',
        // sortDirection: sortableDir ?? 'desc',
        ...options?.requestParams?.(),
      });

      const response = await getPublicFlowCategories(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении категорий шаблонов');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  const debouncedGetTableData = useDebounceFn(getTableData, 500);

  return {
    TABLE_HEADER_COLUMNS,
    loading,
    data,
    meta,
    getTableData,
    debouncedGetTableData,
  };
}

export default useFlowCategoriesTableData;


import type { SelectOption } from '~/shared/types/ui/select.types';
import { parseUrlParams, type URLParamsParsingConfig } from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  name: string | null;
  is_public: boolean | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'is_public', type: 'boolean' },
  { fieldName: 'name', type: 'string' },
];

function useFlowCategoriesTableFilters() {
  const filters = ref<TableFilters>({
    name: null,
    is_public: null,
  });

  const IS_PUBLIC_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Публичная категория', value: true },
    { label: 'Непубличная категория', value: false },
  ];

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      name: params.name ?? null,
      is_public: params.is_public ?? null
    };
  };

  const resetFilters = () => {
    filters.value = {
      name: null,
      is_public: null,
    };
  };

  return {
    filters,
    IS_PUBLIC_SELECT_OPTIONS,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useFlowCategoriesTableFilters;

import {
  createPublicFlowCategory,
  getPublicFlowCategory,
  updatePublicFlowCategory,
} from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategoryCreate } from '~/domain/flow-category/models/flow-category.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import {
  ERROR_MAX_LENGTH,
  ERROR_REQUIRED_FIELD,
} from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import {
  clearFormValidation,
  setBackendErrors,
  validateForm,
} from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useFlowCategoryForm() {
  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/flow-categories');

  const formData = ref<FormFields<PublicFlowCategoryCreate>>({
    name: null,
  });

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const formErrors = reactive<FormErrors<PublicFlowCategoryCreate>>({
    name: '',
  });
  const formRules = ref<FormRules<PublicFlowCategoryCreate>>({
    name: () => {
      if (!formData.value.name) {
        formErrors.name = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (formData.value.name.length > 255) {
        formErrors.name = ERROR_MAX_LENGTH(255);
        return false;
      }

      return true;
    },
  });

  const route = useRoute();
  const router = useRouter();

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;
        const response = await getPublicFlowCategory(editId.value);
        formData.value = {
          name: response.data.name,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных категории шаблона');
      showRequestError(e);
    }
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;
      if (editId.value) {
        await updatePublicFlowCategory(
          editId.value,
          formData.value as PublicFlowCategoryCreate,
        );
      } else {
        await createPublicFlowCategory(
          formData.value as PublicFlowCategoryCreate,
        );
      }

      toastSuccess(
        editId.value
          ? 'Категория шаблона создана!'
          : 'Категория шаблона обновлена!',
      );
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in flow category create/update:', e);
        toastError('Ошибка создания или редактирования категории шаблонов');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(
          `Ошибка создания или редактирования категории шаблонов: ${e.message}`,
        );
        return;
      }

      setBackendErrors(formErrors, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    formRules,
    formErrors,
    route,
    router,
    loading,
    editId,
    getData,
    onSubmit,
    getBack,
  };
}

export default useFlowCategoryForm;

```
Use table-view only for admin pages (for first time we don't have admin at all)

Before start of work create .md file in @/docs/specs and write all, that you need to keep rules, conventions
Preview useful docs: @/docs/specs
Ui components (check api): @/app/components/ui