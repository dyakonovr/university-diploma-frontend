import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

export type RawPostStatus = 'failed' | 'processing' | 'completed';
/** processing = выполняется в данную секудну, waiting = ожидает выполнение предыдущих */
export type RawPostBlockStatus =
  | 'failed'
  | 'processing'
  | 'completed'
  | 'waiting';

export type RawPostBlockTokensUsage = {
  step_id: EntityId;
  tokens_used: number;
};

/** Блок = результат Stage (если Stage НЕ контекстный) */
export type RawPostBlock = {
  id: EntityId;
  stage_id: EntityId;
  status: RawPostBlockStatus;
  /** Расход токенов на генерацию по каждому шагу */
  step_tokens: RawPostBlockTokensUsage[];
};

/** Сущность, которая получается в результате генерации Flow */
export type RawPost = BaseEntity & {
  flow_id: EntityId;
  /** ID слота расписания, если пост создан по расписанию */
  schedule_id?: EntityId;
  blocks: RawPostBlock[];
  status: RawPostStatus;
  /** Ошибка, которая возникла при генерации Raw Post */
  error?: string;
  /** Расход токенов на генерацию по каждому шагу в контекстных этапах */
  context_stage_tokens: RawPostBlockTokensUsage[];
  created_at: string;
  updated_at: string;
};
