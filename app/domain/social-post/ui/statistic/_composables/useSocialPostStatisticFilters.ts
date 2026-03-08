import { differenceInDays } from 'date-fns';

import type { ButtonGroupItems } from '~/shared/types/ui/button-group.types';

import type { SocialPostStatisticGranularity } from './socialPostStatistic.utils';

const GRANULARITY_BUTTONS: ButtonGroupItems<SocialPostStatisticGranularity> = [
  { label: 'Месяц', key: 'month' },
  { label: 'Неделя', key: 'week' },
  { label: 'День', key: 'day' },
  { label: 'Час', key: 'hour' },
];

function useSocialPostStatisticFilters(options: {
  minDate: Ref<Date>;
  maxDate: Ref<Date>;
}) {
  const granularity = ref<SocialPostStatisticGranularity>('day');
  const availableGranularities = computed<SocialPostStatisticGranularity[]>(
    () => {
      const diffDays = differenceInDays(
        options.maxDate.value,
        options.minDate.value,
      );

      const result: SocialPostStatisticGranularity[] = ['hour'];

      if (diffDays >= 1) result.push('day');
      if (diffDays >= 7) result.push('week');
      if (diffDays >= 30) result.push('month');

      return result;
    },
  );
  const availableGranularitiesButtons = computed<
    ButtonGroupItems<SocialPostStatisticGranularity>
  >(() => {
    return GRANULARITY_BUTTONS.filter((opt) =>
      availableGranularities.value.includes(opt.key),
    );
  });

  const dateRange = ref<Date[]>([]);

  return {
    granularity,
    availableGranularitiesButtons,
    dateRange,
  };
}

export default useSocialPostStatisticFilters;
