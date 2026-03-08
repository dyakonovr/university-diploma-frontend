import type { Artifact } from '~/domain/artifact/models/artifact.types';
import type { RawPost } from '~/domain/raw-post/models/raw-post.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getPosts(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<RawPost[]>>({
    baseUrl: 'FLOW',
    url: '/posts',
    method: 'GET',
    params,
    signal,
  });
}

export function getPostRequest(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<RawPost>>({
    baseUrl: 'FLOW',
    url: `/posts/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function getPostBlockArtifactsRequest(
  blockId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<Artifact[]>>({
    baseUrl: 'FLOW',
    url: `/blocks/${blockId}/artifacts`,
    method: 'GET',
    params,
    signal,
  });
}
