import { copyPublicFlow } from '~/domain/flow/api/public-flows.api';
import type { PublicFlow } from '~/domain/flow/model/public-flow.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';

function useCopyPublicFlow(options?: {
  data: Ref<PublicFlow[] | null>;
}) {
  const router = useRouter();
  const { toastSuccess, toastError } = useCustomToast();

  const onCopy = async (item: PublicFlow) => {
    try {
      const response = await copyPublicFlow(item.id);

      if (options?.data.value) {
        const idx = options.data.value.findIndex((f) => f.id === item.id);
        if (idx !== -1) {
          options.data.value[idx]!.is_copied = true;
          options.data.value[idx]!.copy_count = (options.data.value[idx]!.copy_count ?? 0) + 1;
        }
      }

      toastSuccess('Шаблон скопирован в приватные!');
      router.push(`/account/flows/private/${response.data.flow_id}`);
    } catch {
      toastError('Ошибка при копировании шаблона');
    }
  };

  return { onCopy };
}

export default useCopyPublicFlow;
