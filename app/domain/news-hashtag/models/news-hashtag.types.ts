import type {
  BaseEntity,
} from '~/shared/types/core/base-entity.types';

type NewsHashtagBase = {
  name: string;
};

export type NewsHashtagCreate = NewsHashtagBase;

/** Хэштег для новости на лендинге */
export type NewsHashtag = BaseEntity &
  NewsHashtagBase & {
    created_at: string;
  };
