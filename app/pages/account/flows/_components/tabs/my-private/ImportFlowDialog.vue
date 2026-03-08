<template>
  <dialog-ui
    v-model="model"
    title="Импорт шаблона"
    confirm-button-text="Импортировать"
    :confirm-button-props="{ disabled: !file || loading }"
    @confirm="handleConfirm"
  >
    <div class="import-flow-dialog">
      <upload-file-ui
        v-model="file"
        label="Файл шаблона"
        direction="column"
        allowed-file-extensions="json"
        :disabled="loading"
      />
    </div>
  </dialog-ui>
</template>

<script lang="ts" setup>
import DialogUi from '~/components/ui/DialogUi.vue';
import UploadFileUi from '~/components/ui/form/upload-file/UploadFileUi.vue';
import { importPrivateFlow } from '~/domain/flow/api/private-flows.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';

const model = defineModel<boolean>();

const { toastSuccess, toastError } = useCustomToast();
const router = useRouter();

const file = ref<File | null>(null);
const loading = ref(false);

const handleConfirm = async () => {
  if (!file.value) return;

  try {
    loading.value = true;

    const formData = new FormData();
    formData.append('file', file.value);

    const response = await importPrivateFlow(formData);
    toastSuccess('Шаблон успешно импортирован!');

    router.push(`/account/flows/private/${response.data.flow_id}`);
  } catch {
    toastError('Ошибка при импорте шаблона');
  } finally {
    loading.value = false;
  }
};

watch(model, (newValue) => {
  if (newValue) {
    file.value = null;
  }
});
</script>

<style lang="scss" scoped>
.import-flow-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 600px;
}
</style>
