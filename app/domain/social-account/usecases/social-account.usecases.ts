import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';

import {
  createSocialAccount,
  deleteSocialAccount as deleteSocialAccountReq,
  updateSocialAccount,
} from '../api/social-account.api';
import type {
  SocialAccount,
  SocialAccountCreate,
} from '../models/social-account.types';

/** Создаёт или сохраняет изменения SocialAccount */
export async function saveSocialAccount(
  id: EntityId | null,
  SocialAccount: SocialAccountCreate,
): Promise<Response<SocialAccount>> {
  return id !== null
    ? await updateSocialAccount(id, SocialAccount)
    : await createSocialAccount(SocialAccount);
}

export async function deleteSocialAccount(
  id: EntityId,
): Promise<Response<SocialAccount>> {
  return await deleteSocialAccountReq(id);
}
