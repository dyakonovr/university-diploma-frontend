import type { ResponsePagination } from '../types/core/request.types';
import {
  parseUrlParams,
  type URLParamsParsingConfig,
} from './core/parseURLParams';

const parsingConfig: URLParamsParsingConfig<Omit<ResponsePagination, 'total' | 'total_pages'>> = [
  { fieldName: 'page', type: 'number' },
  { fieldName: 'per_page', type: 'number' },
];

export const parsePaginationFromUrl = (pagination: Ref<ResponsePagination>) => {
  const params = parseUrlParams(parsingConfig);
  
  if (params['page'] && params['page'] > 0) {
    pagination.value.page = params['page'];
  }
  
  if (params['per_page'] && params['per_page'] > 0) {
    pagination.value.per_page = params['per_page'];
  }
};
