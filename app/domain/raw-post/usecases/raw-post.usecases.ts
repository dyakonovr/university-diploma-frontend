import { mockTextArtifacts } from '~/domain/artifact/mocks/artifact.mock';

import {
  getPostBlockArtifactsRequest,
  getPostRequest,
} from '../api/raw-posts.api';
import { mockRawPosts } from '../mocks/raw-post.mock';

const IS_MOCK: boolean = false;

type GetPostBlockArtifactsRequestFunc = typeof getPostBlockArtifactsRequest;
export async function getPostBlockArtifacts(
  ...args: Parameters<GetPostBlockArtifactsRequestFunc>
): ReturnType<GetPostBlockArtifactsRequestFunc> {
  if (IS_MOCK)
    return Promise.resolve({
      data: mockTextArtifacts,
      meta: {
        requestID: '',
      },
    });
  else return await getPostBlockArtifactsRequest(...args);
}

type GetRawPostByIdRequestFunc = typeof getPostRequest;
export async function getRawPostById(
  ...args: Parameters<GetRawPostByIdRequestFunc>
): ReturnType<GetRawPostByIdRequestFunc> {
  if (IS_MOCK)
    return Promise.resolve({
      data: mockRawPosts[0]!,
      meta: {
        requestID: '',
      },
    });
  else return await getPostRequest(...args);
}
