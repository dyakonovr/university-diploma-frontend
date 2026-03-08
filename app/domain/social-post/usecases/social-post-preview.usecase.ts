import { getSocialPostPreviewRequest } from '../api/social-post.api';
import { RAW_POST_TELEGRAM_PREVIEW } from '../mocks/social-post-preview.mocks';

type RequestFunc = typeof getSocialPostPreviewRequest;
const IS_MOCK: boolean = false;

export async function getSocialPostPreview(
  ...args: Parameters<RequestFunc>
): ReturnType<RequestFunc> {
  if (IS_MOCK)
    return Promise.resolve({
      data: RAW_POST_TELEGRAM_PREVIEW,
      meta: {
        requestID: '',
      },
    });
  else return await getSocialPostPreviewRequest(...args);
}
