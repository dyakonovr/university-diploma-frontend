/**
 * Русское склонение существительных по числительному.
 * @example pluralizeRu(1, 'артефакт', 'артефакта', 'артефактов') // 'артефакт'
 * @example pluralizeRu(3, 'артефакт', 'артефакта', 'артефактов') // 'артефакта'
 * @example pluralizeRu(5, 'артефакт', 'артефакта', 'артефактов') // 'артефактов'
 */
export function pluralizeRu(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}