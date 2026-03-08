import type { Artifact } from '../models/artifact.types';

export const mockTextArtifacts: Artifact[] = [
  {
    id: 'artifact-text-1',
    name: 'Заголовок поста',
    type: 'text',
    data: '10 способов повысить продуктивность',
    s3_key: null,
    order: 1,
    created_at: '2025-02-01T10:00:00Z',
  },
  {
    id: 'artifact-text-2',
    name: 'Описание',
    type: 'text',
    data: 'В этом посте мы рассмотрим практические советы...',
    s3_key: null,
    order: 2,
    created_at: '2025-02-01T10:01:00Z',
  },
  {
    id: 'artifact-text-3',
    name: 'Хештеги',
    type: 'text',
    data: '#продуктивность #работа #it',
    s3_key: null,
    order: 3,
    created_at: '2025-02-01T10:02:00Z',
  },
  {
    id: 'artifact-text-4',
    name: null,
    type: 'text',
    data: 'Заключительный текст без названия',
    s3_key: null,
    order: 4,
    created_at: '2025-02-01T10:03:00Z',
  },
];

export const mockBinaryArtifacts: Artifact[] = [
  {
    id: 'artifact-bin-1',
    name: 'Обложка',
    type: 'binary',
    data: null,
    s3_key: 'artifacts/images/cover-1.png',
    content_type: 'image/png',
    order: 1,
    created_at: '2025-02-02T09:00:00Z',
  },
  {
    id: 'artifact-bin-2',
    name: 'Иллюстрация',
    type: 'binary',
    data: null,
    s3_key: 'artifacts/images/illustration-1.jpg',
    content_type: 'image/jpeg',
    order: 2,
    created_at: '2025-02-02T09:01:00Z',
  },
  {
    id: 'artifact-bin-3',
    name: 'PDF файл',
    type: 'binary',
    data: null,
    s3_key: 'artifacts/docs/manual.pdf',
    content_type: 'application/pdf',
    order: null,
    created_at: '2025-02-02T09:02:00Z',
  },
];

export const mockAllArtifacts: Artifact[] = [
  ...mockTextArtifacts,
  ...mockBinaryArtifacts,
];
