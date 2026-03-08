/**
 * Discriminated union type infrastructure for Setting input capability values.
 *
 * Каждый тип входного параметра модели (Setting, Text, Message, Photo, Video, Audio)
 * представлен отдельным типом с полем-дискриминантом `type`.
 *
 * ### Как добавить новый тип:
 * 1. Создать новый тип: `type NewTypeValue = BaseInputCapabilityValue<'NewType'> & { value: ... }`
 * 2. Добавить в union `InputCapabilityValue`
 * 3. TypeScript покажет все switch/case, которые нужно обновить (exhaustive check)
 * 4. Создать маппер в `mappers/setting-to-vm/mapNewTypeValue.ts`
 * 5. Зарегистрировать маппер в registry (`mappers/setting-to-vm/index.ts`)
 *
 * @example
 * // Type guard
 * if (isMessageCapability(value)) {
 *   value.pairs; // typed
 * }
 *
 * // Exhaustive switch
 * switch (value.type) {
 *   case 'Setting': ...
 *   case 'Text': ...
 *   case 'Message': ...
 *   case 'Photo': ...
 *   case 'Video': ...
 *   case 'Audio': ...
 * }
 */

import type {
  MessageInputValue,
  MessagePair as SharedMessagePair,
} from '~/shared/types/message-input.types';

/** Все поддерживаемые типы input capability */
export type InputCapabilityType =
  | 'Setting'
  | 'Text'
  | 'Message'
  | 'Photo'
  | 'Video'
  | 'Audio';

/** Базовый тип с дискриминантом */
type BaseInputCapabilityValue<T extends InputCapabilityType> = {
  type: T;
};

/** Setting: числа, строки, булевы (sliders, inputs, toggles) */
export type SettingInputCapabilityValue =
  BaseInputCapabilityValue<'Setting'> & {
    value: number | string | boolean | null;
  };

/** Text: строка промпта с поддержкой переменных */
export type TextInputCapabilityValue = BaseInputCapabilityValue<'Text'> & {
  value: string | null;
};

/** Re-export shared MessagePair */
export type MessagePair = SharedMessagePair;

/** Message: structured pairs (system prompt + user/assistant pairs) */
export type MessageInputCapabilityValue = BaseInputCapabilityValue<'Message'> &
  MessageInputValue;

/** Photo: ссылка на артефакт, переменная или null */
export type PhotoInputCapabilityValue = BaseInputCapabilityValue<'Photo'> & {
  value: string | null;
};

/** Video: ссылка на артефакт, переменная или null */
export type VideoInputCapabilityValue = BaseInputCapabilityValue<'Video'> & {
  value: string | null;
};

/** Audio: ссылка на артефакт, переменная или null */
export type AudioInputCapabilityValue = BaseInputCapabilityValue<'Audio'> & {
  value: string | null;
};

/** Discriminated union — все возможные значения input capability */
export type InputCapabilityValue =
  | SettingInputCapabilityValue
  | TextInputCapabilityValue
  | MessageInputCapabilityValue
  | PhotoInputCapabilityValue
  | VideoInputCapabilityValue
  | AudioInputCapabilityValue;

/** Type guards */
export const isSettingCapability = (
  v: InputCapabilityValue,
): v is SettingInputCapabilityValue => v.type === 'Setting';

export const isTextCapability = (
  v: InputCapabilityValue,
): v is TextInputCapabilityValue => v.type === 'Text';

export const isMessageCapability = (
  v: InputCapabilityValue,
): v is MessageInputCapabilityValue => v.type === 'Message';

export const isPhotoCapability = (
  v: InputCapabilityValue,
): v is PhotoInputCapabilityValue => v.type === 'Photo';

export const isVideoCapability = (
  v: InputCapabilityValue,
): v is VideoInputCapabilityValue => v.type === 'Video';

export const isAudioCapability = (
  v: InputCapabilityValue,
): v is AudioInputCapabilityValue => v.type === 'Audio';

/** Бинарные типы (Photo/Video/Audio) */
export type BinaryInputCapabilityValue =
  | PhotoInputCapabilityValue
  | VideoInputCapabilityValue
  | AudioInputCapabilityValue;

export const isBinaryCapability = (
  v: InputCapabilityValue,
): v is BinaryInputCapabilityValue =>
  v.type === 'Photo' || v.type === 'Video' || v.type === 'Audio';
