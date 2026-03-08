import {
  format,
  parseISO,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ru } from 'date-fns/locale';

import { TRANSACTIONS_LABEL } from '~/domain/subscription/constants/transactions.const';
import type { Transaction } from '~/domain/subscription/models/subscription.types';
import { getMyTransactions } from '~/domain/user/api/tarification/tarification.my-api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { formatThousands } from '~/shared/utils/core/formatThousands';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';

type Granularity = 'month' | 'week' | 'day' | 'hour';

function getGroupDate(date: Date, g: Granularity): Date {
  if (g === 'month') return startOfMonth(date);
  if (g === 'week') return startOfWeek(date, { weekStartsOn: 1 });
  if (g === 'day') return startOfDay(date);
  return startOfHour(date);
}

type TransactionChartPoint = {
  formattedTime: string;
  isoTime: string;
  amount: number;
};

/**
 * Composable для получения и группировки статистики транзакций пользователя.
 * Загружает все транзакции и агрегирует сумму amount по периодам.
 */
function useTransactionStatistic() {
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const { toastError } = useCustomToast();

  const currentDate = new Date();
  const minDate = ref<Date>(currentDate);
  const maxDate = ref<Date>(currentDate);

  const granularity = ref<Granularity>('day');
  const dateRange = ref<Date[]>([]);

  const chartData = computed<TransactionChartPoint[]>(() => {
    if (!transactions.value.length) return [];

    let filtered = transactions.value;

    // Filter by date range
    if (dateRange.value.length === 2) {
      const [from, to] = dateRange.value;
      filtered = filtered.filter((t) => {
        const date = parseISO(t.created_at);
        return date >= from && date <= to;
      });
    }

    // Group by period (net change per period)
    const map = new Map<number, { periodStart: Date; amount: number }>();

    for (const tx of filtered) {
      const date = parseISO(tx.created_at);
      const periodStart = getGroupDate(date, granularity.value);
      const key = periodStart.getTime();

      const existing = map.get(key);
      if (existing) {
        existing.amount += tx.amount;
      } else {
        map.set(key, { periodStart, amount: tx.amount });
      }
    }

    // Sort by time, then compute cumulative running balance
    const sorted = Array.from(map.values()).sort(
      (a, b) => a.periodStart.getTime() - b.periodStart.getTime(),
    );

    let runningBalance = 0;
    return sorted.map((g) => {
      runningBalance += g.amount;
      return {
        formattedTime: format(g.periodStart, 'dd.MM.yyyy HH:mm'),
        isoTime: g.periodStart.toISOString(),
        amount: runningBalance,
      };
    });
  });

  const xFormatter = (tick: number): string => {
    const item = chartData.value[tick];
    if (!item) return '';

    const date = parseISO(item.isoTime);

    if (granularity.value === 'month') {
      return format(date, 'MMMM yyyy', { locale: ru });
    }
    if (granularity.value === 'week') {
      return `Неделя с ${format(date, 'dd MMMM', { locale: ru })}`;
    }
    if (granularity.value === 'hour') {
      return format(date, 'dd MMMM, HH:mm', { locale: ru });
    }
    return format(date, 'dd MMMM', { locale: ru });
  };

  const yFormatter = (tick: number): string => {
    return formatThousands(String(tick));
  };

  async function fetchData() {
    try {
      loading.value = true;

      const params = objectToQueryString({ per_page: 9999 });
      const response = await getMyTransactions(params);
      const items = response.data;

      transactions.value = items.sort(
        (a, b) =>
          parseISO(a.created_at).getTime() - parseISO(b.created_at).getTime(),
      );

      if (transactions.value.length) {
        minDate.value = parseISO(transactions.value[0].created_at);
        maxDate.value = parseISO(
          transactions.value[transactions.value.length - 1].created_at,
        );
        dateRange.value = [minDate.value, maxDate.value];
      }
    } catch {
      toastError('Ошибка при получении транзакций');
    } finally {
      loading.value = false;
    }
  }

  return {
    chartData,
    loading,
    minDate,
    maxDate,
    granularity,
    dateRange,
    xFormatter,
    fetchData,
    yFormatter,
    TRANSACTIONS_LABEL,
  };
}

export default useTransactionStatistic;
