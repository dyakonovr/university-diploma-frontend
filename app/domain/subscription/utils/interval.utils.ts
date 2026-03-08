/**
 * Форматирует интервал в часах в читаемый вид.
 *
 * @example formatInterval(24) // "каждые 1 дн."
 * @example formatInterval(720) // "каждые 30 дн."
 * @example formatInterval(12) // "каждые 12 ч."
 */
export function formatSubscriptionInterval(hours: number): string {
  if (hours < 24) return `каждые ${hours} ч.`;
  const days = Math.floor(hours / 24);
  return `каждые ${days} дн.`;
}
