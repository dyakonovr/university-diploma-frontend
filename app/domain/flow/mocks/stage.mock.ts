import type { Stage } from '~/domain/flow/model/stage.types';

export const mockStages: Stage[] = [
  {
    id: 'stage-1',
    name: 'Подготовка запроса',
    flow_id: 'flow-1',
    is_context: true,
    order: 1,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
    steps: [
      {
        id: 'step-1-1',
        stage_id: 'stage-1',
        description: 'Сбор пользовательского контекста',
        order: 1,
        created_at: '2025-01-10T10:01:00Z',
        updated_at: '2025-01-10T10:01:00Z',
        setting: {
          id: 'setting-1-1',
          step_id: 'step-1-1',
          model_id: 'model-gpt-4o',
          provider_id: 'provider-openai',
          created_at: '2025-01-10T10:02:00Z',
          updated_at: '2025-01-10T10:02:00Z',
          data: {
            temperature: 0,
            system_prompt:
              'Ты помощник, который структурирует ввод пользователя',
          },
        },
      },
    ],
  },

  {
    id: 'stage-2',
    name: 'Генерация ответа',
    flow_id: 'flow-1',
    is_context: false,
    order: 2,
    created_at: '2025-01-10T10:05:00Z',
    updated_at: '2025-01-10T10:05:00Z',
    steps: [
      {
        id: 'step-2-1',
        stage_id: 'stage-2',
        description: 'Основная генерация ответа',
        order: 1,
        created_at: '2025-01-10T10:06:00Z',
        updated_at: '2025-01-10T10:06:00Z',
        setting: {
          id: 'setting-2-1',
          step_id: 'step-2-1',
          model_id: 'model-gpt-4o',
          provider_id: 'provider-openai',
          created_at: '2025-01-10T10:06:30Z',
          updated_at: '2025-01-10T10:06:30Z',
          data: {
            temperature: 0.7,
            max_tokens: 1024,
            prompt_template:
              'Ответь на запрос пользователя максимально подробно',
          },
        },
      },
      {
        id: 'step-2-2',
        stage_id: 'stage-2',
        description: 'Уточнение и форматирование ответа',
        order: 2,
        created_at: '2025-01-10T10:07:00Z',
        updated_at: '2025-01-10T10:07:00Z',
        setting: {
          id: 'setting-2-2',
          step_id: 'step-2-2',
          model_id: 'model-gpt-4o-mini',
          provider_id: 'provider-openai',
          created_at: '2025-01-10T10:07:30Z',
          updated_at: '2025-01-10T10:07:30Z',
          data: {
            temperature: 0.3,
            output_format: 'markdown',
          },
        },
      },
    ],
  },

  {
    id: 'stage-3',
    name: 'Постобработка',
    flow_id: 'flow-1',
    is_context: false,
    order: 3,
    created_at: '2025-01-10T10:10:00Z',
    updated_at: '2025-01-10T10:10:00Z',
    steps: [
      {
        id: 'step-3-1',
        stage_id: 'stage-3',
        description: 'Проверка ответа на ограничения',
        order: 1,
        created_at: '2025-01-10T10:11:00Z',
        updated_at: '2025-01-10T10:11:00Z',
        setting: {
          id: 'setting-3-1',
          step_id: 'step-3-1',
          model_id: 'model-gpt-4o-mini',
          provider_id: 'provider-openai',
          created_at: '2025-01-10T10:11:30Z',
          updated_at: '2025-01-10T10:11:30Z',
          data: {
            temperature: 0,
            ruleset: ['no_hate', 'no_personal_data'],
          },
        },
      },
    ],
  },
];
