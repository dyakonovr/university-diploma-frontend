import { getSocialAccountProvidersApi as getSocialAccountProvidersReq } from '../api/social-account-provider.api';
import { mockSocialAccountProviders } from '../mocks/social-account-provider.mocks';

type RequestFunc = typeof getSocialAccountProvidersReq;
const IS_MOCK: boolean = false;

export async function getSocialAccountProviders(
  ...args: Parameters<RequestFunc>
): ReturnType<RequestFunc> {
  if (IS_MOCK)
    return Promise.resolve({
      data: mockSocialAccountProviders,
      meta: {
        pagination: {
          page: 1,
          per_page: mockSocialAccountProviders.length,
          total: mockSocialAccountProviders.length,
          total_pages: 1,
        },
        requestID: '',
      },
    });
  else return await getSocialAccountProvidersReq(...args);
}
