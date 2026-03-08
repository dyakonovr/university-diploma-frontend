import {
  updateArtifactsOrdersRequest,
  updateTextArtifact,
} from '../api/artifacts.api';

type OrdersRequestFunc = typeof updateArtifactsOrdersRequest;
type TextRequestFunc = typeof updateTextArtifact;
const IS_MOCK: boolean = false;

export async function updateArtifactOrders(
  ...args: Parameters<OrdersRequestFunc>
): ReturnType<OrdersRequestFunc> {
  if (IS_MOCK) return Promise.resolve();
  else return await updateArtifactsOrdersRequest(...args);
}

export async function updateTextArtifactUsecase(
  ...args: Parameters<TextRequestFunc>
): ReturnType<TextRequestFunc> {
  if (IS_MOCK) return Promise.resolve({ data: {} as any, meta: { requestID: '' } });
  else return await updateTextArtifact(...args);
}
