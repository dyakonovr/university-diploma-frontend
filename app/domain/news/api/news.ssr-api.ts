import type { News } from '~/domain/news/models/news.types';
import type {
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import { ssrRequest } from '~/shared/utils/core/request.ssr';

export function getNewsListSSR(params?: string) {
  return ssrRequest<ResponseWithPagination<News[]>>({
    url: '/news',
    params,
  });
}

export function getNewsByUrlSSR(slug: string) {
  return ssrRequest<Response<News>>({
    url: `/news/url/${slug}`,
  });
}
