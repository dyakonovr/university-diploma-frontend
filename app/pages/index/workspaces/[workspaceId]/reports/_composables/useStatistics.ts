import { getReportStatistics } from '~/domain/report/api/report.api';
import type { StatisticsReport } from '~/domain/report/models/report.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useStatistics(workspaceId: string) {
  const { toastError } = useCustomToast();

  const statistics = ref<StatisticsReport | null>(null);
  const loading = ref(false);

  const fetchStatistics = async () => {
    loading.value = true;
    try {
      const response = await getReportStatistics(workspaceId);
      statistics.value = response.data;
    } catch (e) {
      toastError('Ошибка при загрузке статистики');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    statistics,
    loading,
    fetchStatistics,
  };
}

export default useStatistics;
