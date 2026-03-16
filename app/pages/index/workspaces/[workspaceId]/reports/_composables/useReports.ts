import { marked } from 'marked';

import { generateReport } from '~/domain/report/api/report.api';
import { getReportPresets, seedReportPresets } from '~/domain/report/api/report-preset.api';
import type { ReportPreset } from '~/domain/report/models/report.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useReports(workspaceId: string) {
  const { toastSuccess, toastError } = useCustomToast();

  const presets = ref<ReportPreset[]>([]);
  const presetsLoading = ref(false);

  const additionalQueries = ref<Record<string, string>>({});
  const generating = ref(false);
  const generatingPresetId = ref<string | null>(null);
  const reportHtml = ref('');
  const activePresetTitle = ref('');

  const fetchPresets = async () => {
    presetsLoading.value = true;
    try {
      const response = await getReportPresets(workspaceId);
      presets.value = response.data;

      // Auto-seed if empty
      if (!presets.value.length) {
        try {
          const seedResponse = await seedReportPresets(workspaceId);
          presets.value = seedResponse.data;
        } catch {
          // Seed failed silently
        }
      }
    } catch (e) {
      toastError('Ошибка при загрузке пресетов');
      showRequestError(e);
    } finally {
      presetsLoading.value = false;
    }
  };

  const generate = async (preset: ReportPreset) => {
    generating.value = true;
    generatingPresetId.value = preset.id;

    try {
      const response = await generateReport(workspaceId, {
        preset_id: preset.id,
        additional_query: additionalQueries.value[preset.id] || undefined,
      });

      reportHtml.value = marked.parse(response.data.markdown) as string;
      activePresetTitle.value = preset.title;
      toastSuccess('Отчёт сгенерирован');
    } catch (e) {
      toastError('Ошибка при генерации отчёта');
      showRequestError(e);
    } finally {
      generating.value = false;
      generatingPresetId.value = null;
    }
  };

  return {
    presets,
    presetsLoading,
    additionalQueries,
    generating,
    generatingPresetId,
    reportHtml,
    activePresetTitle,
    fetchPresets,
    generate,
  };
}

export default useReports;
