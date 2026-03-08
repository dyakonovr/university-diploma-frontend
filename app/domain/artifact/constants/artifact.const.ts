import type { SelectOption } from '~/shared/types/ui/select.types';

export const ARTIFACTS_TYPE: SelectOption[] = [
  { label: 'Текстовый артефакт', value: 'text' },
  { label: 'Бинарный артефакт', value: 'binary' },
];

export const ARTIFACTS_CONTENT_TYPE: SelectOption[] = [
  { label: 'Изображение', value: 'image' },
  { label: 'Видео', value: 'video' },
  { label: 'Аудио', value: 'audio' },
  // { label: 'Текст', value: 'text' },
];

export const ARTIFACT_PHOTO_FILE_EXTENSIONS: string[] = [
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
];
export const ARTIFACT_AUDIO_FILE_EXTENSIONS: string[] = [
  'mp3',
  'wav',
  'ogg',
  'm4a',
];
export const ARTIFACT_VIDEO_FILE_EXTENSIONS: string[] = [
  'mp4',
  'mov',
  'webm',
  'avi',
  'mkv',
];
export const ARTIFACT_BINARY_FILE_EXTENSIONS: string[] = [
  ...ARTIFACT_PHOTO_FILE_EXTENSIONS,
  ...ARTIFACT_VIDEO_FILE_EXTENSIONS,
  ...ARTIFACT_AUDIO_FILE_EXTENSIONS,
];
