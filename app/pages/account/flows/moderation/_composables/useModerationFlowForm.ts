import {
  finishPublicFlowModeration,
  getPublicFlowOnModeration,
} from '~/domain/flow/api/public-flows.api';
import type { Stage } from '~/domain/flow/model/stage.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useModerationFlowForm() {
  const route = useRoute();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/flows?tab=requestsForPublish');

  const loading = ref(false);
  const actionLoading = ref(false);
  const editId = ref<EntityId | null>(null);
  const stages = ref<Stage[] | null>(null);

  const flowName = ref<string | null>(null);
  const flowDescription = ref<string | null>(null);
  const flowCategoryName = ref<string | null>(null);

  const getData = async () => {
    try {
      if (route.params.id) {
        editId.value = route.params.id as EntityId;

        const params = objectToQueryString({
          include_details: true,
        });

        const response = await getPublicFlowOnModeration(editId.value, params);
        flowName.value = response.data.name;
        flowDescription.value = response.data.description;
        flowCategoryName.value = response.data.category?.name ?? null;
        stages.value = response.data.flow_data?.stages ?? [];
      }
    } catch (e) {
      toastError('Ошибка при получении данных шаблона на модерации');
      showRequestError(e);
    }
  };

  const onApprove = async () => {
    if (!editId.value) return;

    try {
      actionLoading.value = true;
      await finishPublicFlowModeration(editId.value, { status: 'Approve' });
      toastSuccess('Шаблон одобрен!');
      getBack();
    } catch (e) {
      if (e instanceof RequestError) {
        toastError(`Ошибка при одобрении шаблона: ${e.message}`);
      } else {
        console.error('Error in approve public flow:', e);
        toastError('Ошибка одобрении шаблона');
      }
    } finally {
      actionLoading.value = false;
    }
  };

  return {
    loading,
    actionLoading,
    editId,
    stages,
    flowName,
    flowDescription,
    flowCategoryName,

    getData,
    onApprove,
    getBack,
  };
}

export default useModerationFlowForm;
