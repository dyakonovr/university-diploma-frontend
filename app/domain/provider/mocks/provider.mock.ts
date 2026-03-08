import type { Provider } from '~/domain/provider/models/provider.types';

export const providersMock: Provider[] = [
  {
    computing_type: 'cloud',
    content_type: 'text',
    created_at: '2026-01-15T13:50:17.437642Z',
    default_model_id: null,
    id: 'a36557f2-9402-4d9c-b4f4-237f9e3e14f2',
    is_configured: false,
    name: 'qwen',
  },
  {
    computing_type: 'cloud',
    content_type: 'image',
    created_at: '2026-01-15T13:50:17.435768Z',
    default_model_id: null,
    id: 'a8363c65-987b-4d1e-9a52-035dbb00f50b',
    is_configured: false,
    name: 'kieAi',
  },
  {
    computing_type: 'cloud',
    content_type: 'image',
    created_at: '2026-01-15T13:50:17.386215Z',
    default_model_id: null,
    id: '38d70ed5-1dec-43e9-af3f-73ac07440fa6',
    is_configured: false,
    name: 'flux',
  },
];
