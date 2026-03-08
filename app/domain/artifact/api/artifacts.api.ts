import type { Artifact } from '~/domain/artifact/models/artifact.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request, {
  API_BASES,
  API_PREFIX,
} from '~/shared/utils/core/request.client';

export function getArtifacts(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Artifact[]>>({
    baseUrl: 'FLOW',
    url: '/artifacts',
    method: 'GET',
    params,
    signal,
  });
}

export function getArtifact(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<Artifact>>({
    baseUrl: 'FLOW',
    url: `/artifacts/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function createTextArtifact(
  body: Record<string, string>,
  signal: AbortSignal | null = null,
) {
  return request<Response<Artifact>>({
    baseUrl: 'FLOW',
    url: '/artifacts/text',
    method: 'POST',
    signal,
    data: body,
  });
}

export function createBinaryArtifact(
  body: FormData,
  signal: AbortSignal | null = null,
) {
  return request<Response<Artifact>>({
    baseUrl: 'FLOW',
    url: '/artifacts/binary',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateTextArtifact(
  id: EntityId,
  body: Record<string, string>,
  signal: AbortSignal | null = null,
) {
  return request<Response<Artifact>>({
    baseUrl: 'FLOW',
    url: `/artifacts/${id}/text`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function updateBinaryArtifact(
  id: EntityId,
  body: FormData,
  signal: AbortSignal | null = null,
) {
  return request<Response<Artifact>>({
    baseUrl: 'FLOW',
    url: `/artifacts/${id}/binary`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deleteArtifact(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<Artifact>>({
    baseUrl: 'FLOW',
    url: `/artifacts/${id}`,
    method: 'DELETE',
    signal,
  });
}

export async function downloadBinaryArtifact(
  id: string | number,
  signal: AbortSignal | null = null,
) {
  const url = `${API_BASES.FLOW}${API_PREFIX}/artifacts/${id}/download`;
  const response = await fetch(url, {
    method: 'GET',
    signal,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки файла');
  }

  const blob = await response.blob();
  return blob;
}

/** Изменяет порядок артефактов внутри Raw Post */
export function updateArtifactsOrdersRequest(
  body: { artifact_id: EntityId; order: number }[],
  signal: AbortSignal | null = null,
) {
  return request({
    baseUrl: 'FLOW',
    url: '/artifacts/batch-order',
    method: 'PUT',
    signal,
    data: { artifacts: body },
  });
}
