import type { BaseEntity } from '~/shared/types/core/base-entity.types';

type ArtifactBase = {
  name: string | null;
  /** Поле != null, если type = 'binary' (ссылка на файл) */
  s3_key: string | null;
  type: 'text' | 'binary';
};

export type ArtifactCreate = ArtifactBase & {
  /** Поле != null, если type === 'Text' */
  text: string | null;
};

export type Artifact = BaseEntity &
  ArtifactBase & {
    /** Поле != null, если type === 'Text' */
    data: string | null;
    /** Только у type = 'binary' */
    content_type?: string;
    /** Порядок артефакта. Используется при конструировании Social Post для выстраивания
     * артефактов по порядку. У общего (group_id: null) артефакта order = null
     */
    order: number | null;
    created_at: string;
  };
