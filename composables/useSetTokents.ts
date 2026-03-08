import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from '~/constants/cookies';
import type { Tokens } from '~/types/auth.types';
import { useCookie } from '#app';

const useSetTokens = () => {
  const setTokens = (payload: Tokens): void => {
    useCookie(COOKIE_ACCESS_TOKEN, {
      expires: new Date(new Date().getTime() + 15 * 60 * 1000), // set on 15 minutes
    }).value = payload.accessToken;

    useCookie(COOKIE_REFRESH_TOKEN, {
      expires: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000), // set on 90 days
    }).value = payload.refreshToken;
  };

  return { setTokens };
};

export default useSetTokens;