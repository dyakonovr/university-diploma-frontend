import type { News } from '../models/news.types';

export function isNewsVisibleOnLanding(n: News): boolean {
  return n.is_visible &&
    !!n.subcategory?.is_visible &&
    !!n.subcategory?.category?.is_visible;
}