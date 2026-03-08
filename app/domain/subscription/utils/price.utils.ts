const MICROCENTS_IN_DOLLAR = 1_000_000;

/**
 * Парсинг цены подписки от сервера. Конвертирует микроценты в доллары
 *
 * @example parseSubscriptionPrice(1_500_000) // 1.5
 */
export function parseSubscriptionPrice(microcents: number): number {
  return microcents / MICROCENTS_IN_DOLLAR;
}

/**
 * Подготовка цены подписки для сервера. Конвертирует доллары в микроценты
 *
 * @example prepareSubscriptionPrice(1.5) // 1_500_000
 */
export function prepareSubscriptionPrice(dollars: number): number {
  return Math.round(dollars * MICROCENTS_IN_DOLLAR);
}

/**
 * Форматирует микроценты как строку в долларах
 *
 * @example formatSubscriptionPrice(1_500_000) // "1.50"
 */
export function formatSubscriptionPrice(microcents: number): string {
  return parseSubscriptionPrice(microcents).toFixed(2);
}
