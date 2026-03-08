export type SocialPostStatisticMetrics = {
  likes: number | null;
  reposts: number | null;
  comments: number | null;
  views: number | null;
  subscribers: number | null;
  ctr: number | null;
};

/** Единица сбора статистики */
export type SocialPostStatisticItem = {
  metrics: SocialPostStatisticMetrics;
  /** Дата сбора статистики. Timestamp */
  parsed_at: string;
};

/** Единица сбора статистики */
export type SocialPostStatisticDynamicItem = SocialPostStatisticItem & {
  /** Данные об изменение статистики (дельтах) относительно прошлого сбора данных */
  delta: SocialPostStatisticMetrics;
  multiplier: number;
};