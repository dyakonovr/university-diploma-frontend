import type { Model, ModelUpdate } from '~/domain/model/models/model.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getModels(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Model[]>>({
    baseUrl: 'MODEL_PROVIDER',
    url: '/models',
    method: 'GET',
    params,
    signal,
  });
}

export function getModel(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<Model>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/models/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function updateModel(
  id: EntityId,
  body: ModelUpdate,
  signal: AbortSignal | null = null,
) {
  return request<Response<Model>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/models/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function updateInputParam(
  modelId: EntityId,
  paramKey: string,
  body: {
    type?: string;
    variable_type?: string;
    default?: any;
    is_optional?: boolean;
    name?: string;
    description?: string;
  },
  signal: AbortSignal | null = null,
) {
  if (body.type !== 'Setting') body.variable_type = 'string';

  return request<Response<{ message: string }>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/models/${modelId}/capabilities/input-params/${paramKey}`,
    method: 'PATCH',
    signal,
    data: body,
  });
}

export function updateOutputParamCosts(
  modelId: EntityId,
  body: {
    output_param_costs: Record<string, number>;
    output_param_types: Record<string, string>;
    output_param_counts: Record<string, number>;
  },
  signal: AbortSignal | null = null,
) {
  return request<Response<{ message: string }>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/models/${modelId}/capabilities/output-params`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function bindModelPermission(
  modelId: EntityId,
  permissionId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<any>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/models/${modelId}/permissions`,
    method: 'POST',
    signal,
    data: {
      permission_id: permissionId,
    },
  });
}

export function unbindModelPermission(
  modelId: EntityId,
  permissionId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<any>>({
    baseUrl: 'MODEL_PROVIDER',
    url: `/models/${modelId}/permissions/${permissionId}`,
    method: 'DELETE',
    signal,
  });
}
