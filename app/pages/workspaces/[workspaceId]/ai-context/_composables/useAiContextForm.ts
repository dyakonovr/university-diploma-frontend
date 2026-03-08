import { getAiContext, updateAiContext } from '~/domain/ai-context/api/ai-context.api';
import type { AiContext } from '~/domain/ai-context/models/ai-context.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useAiContextForm(workspaceId: string) {
  const { toastSuccess, toastError } = useCustomToast();

  const context = ref<AiContext | null>(null);
  const content = ref('');
  const loading = ref(false);
  const saving = ref(false);

  const fetchContext = async () => {
    loading.value = true;
    try {
      const response = await getAiContext(workspaceId);
      context.value = response.data;
      content.value = response.data.content;
    } catch {
      content.value = '';
    } finally {
      loading.value = false;
    }
  };

  const saveContext = async () => {
    saving.value = true;
    try {
      const response = await updateAiContext(workspaceId, { content: content.value });
      context.value = response.data;
      toastSuccess('Контекст сохранён');
    } catch (e) {
      toastError('Ошибка при сохранении контекста');
      showRequestError(e);
    } finally {
      saving.value = false;
    }
  };

  return {
    context,
    content,
    loading,
    saving,
    fetchContext,
    saveContext,
  };
}

export default useAiContextForm;
