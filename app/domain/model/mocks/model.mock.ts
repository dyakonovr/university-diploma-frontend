import type { Model } from '~/domain/model/models/model.types';

export const modelsMock: Model[] = [
  {
    capabilities: {
      input_params: {
        height: {
          limit_up: 1024,
          limit_down: 512,
        },
        prompt: {
          limit_up: 2000,
          limit_down: 1,
        },
        width: {
          limit_up: 1024,
          limit_down: 512,
        },
      },
    },
    created_at: '2026-01-15T13:50:17.438132Z',
    id: '9e6d1a3f-73e0-4a30-b390-7f97f8985e8f',
    is_configured: false,
    name: 'image',
    params: null,
    provider_id: 'a36557f2-9402-4d9c-b4f4-237f9e3e14f2',
  },
  {
    capabilities: {
      input_params: {
        height: {
          limit_up: 4096,
          limit_down: 1024,
        },
        prompt: {
          limit_up: 10000,
          limit_down: 1,
        },
        width: {
          limit_up: 4096,
          limit_down: 1024,
        },
      },
    },
    created_at: '2026-01-15T13:50:17.437096Z',
    id: 'b591e11a-3e64-4b7b-b33d-efb225a8850c',
    is_configured: false,
    name: 'banana',
    params: null,
    provider_id: 'a8363c65-987b-4d1e-9a52-035dbb00f50b',
  },
  {
    capabilities: {
      input_params: {
        height: {
          limit_up: 1024,
          limit_down: 512,
        },
        prompt: {
          limit_up: 2000,
          limit_down: 1,
        },
        width: {
          limit_up: 1024,
          limit_down: 512,
        },
      },
    },
    created_at: '2026-01-15T13:50:17.435072Z',
    id: '91b8e12c-ad4b-49a0-881e-9307c05b1a2a',
    is_configured: false,
    name: 'dev2',
    params: null,
    provider_id: '38d70ed5-1dec-43e9-af3f-73ac07440fa6',
  },
  {
    capabilities: {
      input_params: {
        height: {
          type: 'Setting',
          variable_type: 'string',
          limit_up: 1024,
          limit_down: 512,
          default: '1024',
          is_optional: true,
        },
        prompt: {
          type: 'Setting',
          variable_type: 'string',
          limit_up: 2000,
          limit_down: 1,
          default: '1024',
          is_optional: true,
        },
        width: {
          type: 'Setting',
          variable_type: 'string',
          limit_up: 1024,
          limit_down: 512,
          default: '1024',
          is_optional: true,
        },
      },
      output_params: {
        Text: 1,
      },
    },
    created_at: '2026-01-15T13:50:17.413714Z',
    id: '8cbfa248-3a46-4f08-8d2c-f83cfadea709',
    is_configured: true,
    name: 'schnell',
    params: null,
    provider_id: '38d70ed5-1dec-43e9-af3f-73ac07440fa6',
  },
];
