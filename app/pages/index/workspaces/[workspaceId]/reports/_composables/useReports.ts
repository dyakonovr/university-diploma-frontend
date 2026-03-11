import { getTasks } from '~/domain/task/api/task.api';
import { postWorkspaceCommand } from '~/domain/workspace/api/workspace-command.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useReports(workspaceId: string) {
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);
  const generating = ref(false);
  const aiReport = ref('');
  const stats = ref({
    total: 0,
    done: 0,
    inProgress: 0,
    cancelled: 0,
  });

  const completionRate = computed(() => {
    if (!stats.value.total) return 0;
    return Math.round((stats.value.done / stats.value.total) * 100);
  });

  const fetchStats = async () => {
    loading.value = true;
    try {
      const response = await getTasks(workspaceId);
      const tasks = response.data;
      stats.value = {
        total: tasks.length,
        done: tasks.filter((t) => t.status === 'done').length,
        inProgress: tasks.filter((t) => t.status === 'in_progress').length,
        cancelled: tasks.filter((t) => t.status === 'cancelled').length,
      };
    } catch (e) {
      toastError('Ошибка при загрузке статистики');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  const generateReport = async () => {
    generating.value = true;
    try {
      const response = await postWorkspaceCommand(workspaceId, {
        text: 'Сгенерируй сводный отчёт по всем задачам команды за последнее время',
      });
      aiReport.value = response.data.human_response;
      toastSuccess('Отчёт сгенерирован');
    } catch (e) {
      toastError('Ошибка при генерации отчёта');
      showRequestError(e);
    } finally {
      generating.value = false;
    }
  };

  return {
    loading,
    generating,
    aiReport,
    stats,
    completionRate,
    fetchStats,
    generateReport,
  };
}

export default useReports;
