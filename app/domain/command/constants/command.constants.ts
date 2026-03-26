import type { SelectOption } from '~/shared/types/ui/select.types';
import type { TagType } from '~/shared/types/ui/tag.types';

import type { CommandActionType, CommandSessionStatus, PreviewStage } from '../models/command.types';

export const SESSION_STATUS_LABELS: Record<CommandSessionStatus, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  rejected: 'Отклонено',
  failed: 'Ошибка',
};

export const SESSION_STATUS_TAG: Record<CommandSessionStatus, TagType> = {
  pending: 'warning',
  confirmed: 'success',
  rejected: 'error',
  failed: 'error',
};

export const SESSION_STATUS_OPTIONS: SelectOption<CommandSessionStatus>[] = [
  { label: 'Ожидает', value: 'pending' },
  { label: 'Подтверждено', value: 'confirmed' },
  { label: 'Отклонено', value: 'rejected' },
  { label: 'Ошибка', value: 'failed' },
];

export const PREVIEW_STAGE_LABELS: Record<PreviewStage, string> = {
  building_context: 'Загрузка контекста...',
  calling_ai: 'ИИ обрабатывает запрос...',
  parsing_response: 'Анализ ответа...',
  saving_session: 'Сохранение...',
};

export const ACTION_TYPE_LABELS: Record<CommandActionType, string> = {
  'task.create': 'Создание задачи',
  'task.update': 'Обновление задачи',
  'task.assign': 'Назначение задачи',
  'task.status': 'Смена статуса задачи',
  'task.delete': 'Удаление задачи',
  'calendar_event.create': 'Создание события',
  'calendar_event.update': 'Обновление события',
  'calendar_event.delete': 'Удаление события',
  'message.send': 'Отправка сообщения',
};

export const ACTION_TYPE_TAG: Record<CommandActionType, TagType> = {
  'task.create': 'success',
  'task.update': 'info',
  'task.assign': 'info',
  'task.status': 'warning',
  'task.delete': 'error',
  'calendar_event.create': 'success',
  'calendar_event.update': 'info',
  'calendar_event.delete': 'error',
  'message.send': 'warning',
};
