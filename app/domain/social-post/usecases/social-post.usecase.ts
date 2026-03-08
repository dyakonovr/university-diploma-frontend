import { getSocialPostRequest } from '../api/social-post.api';
import { MOCK_SOCIAL_POSTS } from '../mocks/social-post.mocks';

type RequestFunc = typeof getSocialPostRequest;
const IS_MOCK: boolean = false;

export async function getSocialPost(
  ...args: Parameters<RequestFunc>
): ReturnType<RequestFunc> {
  if (IS_MOCK)
    return Promise.resolve({
      data: MOCK_SOCIAL_POSTS[0]!,
      meta: {
        requestID: '',
      },
    });
  else return await getSocialPostRequest(...args);
}
