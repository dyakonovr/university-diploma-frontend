import { getReportPresets, seedReportPresets } from '~/domain/report/api/report-preset.api';
import type { ReportPreset } from '~/domain/report/models/report.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function usePresetsData(workspaceId: string) {
  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<ReportPreset[]>([]);

  const getData = async () => {
    loading.value = true;
    try {
      const response = await getReportPresets(workspaceId);
      data.value = response.data;

      // Auto-seed if empty on first visit
      if (!data.value.length) {
        try {
          const seedResponse = await seedReportPresets(workspaceId);
          data.value = seedResponse.data;
        } catch {
          // Seed failed silently — presets stay empty
        }
      }
    } catch (e) {
      toastError('Ошибка при загрузке пресетов');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return { loading, data, getData };
}

export default usePresetsData;
