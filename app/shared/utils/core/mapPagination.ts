import type { ResponsePagination } from "~/shared/types/core/request.types";

type BackendPagination = {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
};

/**
 * Maps backend pagination response to frontend ResponsePagination format.
 *
 * @example
 * const response = await getUsers(params);
 * meta.value = mapPagination(response.meta.pagination);
 */
export function mapPagination(raw: BackendPagination): ResponsePagination {
  return {
    page: raw.current_page,
    total_pages: raw.total_pages,
    total: raw.total_count,
    per_page: raw.per_page,
  };
}
