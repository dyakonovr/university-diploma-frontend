import type { NewsSubcategory } from '~/domain/news-subcategory/models/news-subcategory.types';
import type { ResponseWithPagination } from '~/shared/types/core/request.types';
import { ssrRequest } from '~/shared/utils/core/request.ssr';

export function getNewsSubcategoriesSSR(params?: string) {
  return ssrRequest<ResponseWithPagination<NewsSubcategory[]>>({
    url: '/subcategories',
    params,
  });
}
