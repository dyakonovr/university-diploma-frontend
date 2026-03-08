import type { News } from '~/domain/news/models/news.types';
import { transliterate } from '~/shared/utils/transliterate';

/**
 * Returns the URL slug for a news item.
 * Uses `news.url` if available, otherwise transliterates the title.
 *
 * @example
 * getNewsSlug({ url: 'my-slug', title: 'Заголовок' }) // 'my-slug'
 * getNewsSlug({ url: null, title: 'Заголовок' })      // 'zagolovok'
 */
export function getNewsSlug(news: News): string {
  return news.url || transliterate(news.title);
}
