import type { Provider, ProviderUpdate } from '~/domain/provider/models/provider.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getProviders(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Provider[]>>({
    baseUrl: 'MODEL_PROVIDER',
    url: '/providers',
    method: 'GET',
    params,
    signal,
  });
}

export function getProvider(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<Provider>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/providers/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function updateProvider(
  id: EntityId,
  body: ProviderUpdate,
  signal: AbortSignal | null = null,
) {
  return request<Response<Provider>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/providers/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function bindProviderPermission(
  providerId: EntityId,
  permissionId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<any>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/providers/${providerId}/permissions`,
    method: 'POST',
    signal,
    data: {
      permission_id: permissionId,
    },
  });
}

export function unbindProviderPermission(
  providerId: EntityId,
  permissionId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<any>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/providers/${providerId}/permissions/${permissionId}`,
    method: 'DELETE',
    signal,
  });
}
