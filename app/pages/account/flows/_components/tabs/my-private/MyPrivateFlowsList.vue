<template>
  <section>
    <table-filters
      v-if="isFiltersOpened"
      :filters="filters"
      :loading="loading"
      @search="onSearchFilterClick"
      @reset="onResetFiltersClick"
    >
      <input-ui
        v-model="filters.name"
        :input-props="{ placeholder: 'Название', disabled: loading }"
      />
    </table-filters>

    <div class="my-private-flows__actions">
      <button-ui
        variant="outlined"
        @click="importDialog.open">
        Импортировать
      </button-ui>
    </div>

    <private-flow-list
      v-model:current-page="meta.page"
      :data="data || []"
      :total-pages="meta.total_pages"
      :loading="loading"
      :empty-html="MY_PRIVATE_FLOWS_EMPTY_DESCRIPTION"
      @delete="handleDelete"
      @generate="onGenerate"
      @publish="onPublishClick"
    />

    <delete-confirmation-dialog
      v-model="deleteDialogVisible"
      v-bind="deleteItemDialogContent"
      @confirm="confirmDelete"
    />

    <import-flow-dialog v-model="importDialog.visible.value" />

    <publish-flow-dialog
      v-if="publishFlowId"
      v-model="publishDialog.visible.value"
      :flow-id="publishFlowId"
      :flow-name="publishFlowName"
    />
  </section>
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import TableFilters from '~/components/ui/tables/TableFilters.vue';
import {
  deletePrivateFlow,
  startPrivateFlowGeneration,
} from '~/domain/flow/api/private-flows.api';
import type { PrivateFlow } from '~/domain/flow/model/private-flow.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import useDialogControl from '~/shared/composables/useDialogControl';
import { MY_PRIVATE_FLOWS_EMPTY_DESCRIPTION } from '~/shared/constants/empty-descriptions.const';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import PublishFlowDialog from '../../../../flows/private/_components/PublishFlowDialog.vue';
import useMyPrivateFlowsData from '../../../_composables/my-private-flows/useMyPrivateFlowsData';
import useMyPrivateFlowsFilters from '../../../_composables/my-private-flows/useMyPrivateFlowsFilters';
import PrivateFlowList from '../PrivateFlowList.vue';
import ImportFlowDialog from './ImportFlowDialog.vue';

defineProps<{
  isFiltersOpened?: boolean;
}>();

const { filters, parseFiltersFromUrl, resetFilters } =
  useMyPrivateFlowsFilters();

const { data, loading, meta, getTableData } = useMyPrivateFlowsData({
  requestParams: () => ({
    name: filters.value.name || null,
  }),
});

const router = useRouter();
const { toastSuccess, toastError } = useCustomToast();
const importDialog = useDialogControl();
const publishDialog = useDialogControl();
const publishFlowId = ref<PrivateFlow['id'] | null>(null);
const publishFlowName = ref('');

const onPublishClick = (item: PrivateFlow) => {
  publishFlowId.value = item.id;
  publishFlowName.value = item.name;
  publishDialog.open();
};

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<PrivateFlow>({
  errorMessage: 'Ошибка при удалении шаблона',
  successMessage: 'Шаблон успешно удалён',
  deleteFunc: deletePrivateFlow,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.name,
});

const onGenerate = async (item: PrivateFlow) => {
  try {
    const response = await startPrivateFlowGeneration(item.id);
    toastSuccess('Генерация запущена');
    router.push(`/account/posts/raw/${response.data.post_id}`);
  } catch {
    toastError('Ошибка при запуске генерации');
  }
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
  await getTableData();
  loading.value = false;
});
</script>

<style lang="scss" scoped>
.my-private-flows__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px 0 0;
}
</style>
