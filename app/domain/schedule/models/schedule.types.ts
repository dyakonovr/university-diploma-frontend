import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

type ScheduleTimeSlotBase = {
  name: string;
  /** День недели, на который назначен слот.
   * Понедельник = 1, вторник = 2, ... */
  day_of_week: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Время (в минутах), за которое должна запуститься генерация Raw Post */
  lead_time_min: number;
  /** Шаблон, по которому будет запускаться генерация */
  flow_id: EntityId;
  /** Аккаунт в соц. сети, куда будет опубликован пост */
  social_account_ids: EntityId[];
  /** Время, в которое должен быть опубликован пост.
   * @example "12:00"
   */
  time: string;
  /** Timezone пользователя */
  timezone: string;
};

export type ScheduleTimeSlotCreate = ScheduleTimeSlotBase;

export type ScheduleTimeSlotStatus = 'active' | 'paused';

/** Слот, в который будет запускаться генерация и последующий постинг. Слот запускается КАЖДУЮ НЕДЕЛЮ */
export type ScheduleTimeSlot = BaseEntity &
  ScheduleTimeSlotBase & {
    status: ScheduleTimeSlotStatus;
    created_at: string;
    updated_at: string;
  };
