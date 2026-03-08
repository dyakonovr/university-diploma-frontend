import { generateUuid } from '~/shared/utils/generateUuid';

import type { SettingMessageInputParamData } from '../../../model/setting.types';
import type { InputCapabilityValue, MessageInputCapabilityValue, MessagePair } from '../../view-models/input-capability-values';
import type { InputParamMapper, MapResult } from './types';

/**
 * Парсит массив `{role, content}[]` из domain setting.data
 * в structured VM формат: `{ systemPrompt, pairs }`.
 *
 * Логика:
 * - Первый элемент с role='system' → systemPrompt
 * - Далее пары: role='user' → userContent, следующий role='assistant' → assistantContent
 */
const parseMessagesToViewModel = (
  messages: SettingMessageInputParamData[],
): MessageInputCapabilityValue => {
  const result: MessageInputCapabilityValue = {
    type: 'Message',
    systemPrompt: undefined,
    pairs: [],
  };

  let i = 0;

  if (messages[0]?.role === 'system' && messages[0]?.content) {
    result.systemPrompt = messages[0].content;
    i += 1;
  }

  while (i < messages.length) {
    const message = messages[i];

    const pair: MessagePair = {
      userContent: null,
      uuid: generateUuid(),
    };

    if (message?.role === 'user' && message.content) {
      pair.userContent = message.content;
    }

    if (i + 1 < messages.length) {
      i += 1;
      const nextMessage = messages[i];

      if (
        pair.userContent !== null &&
        nextMessage?.role === 'assistant' &&
        nextMessage.content
      ) {
        pair.assistantContent = nextMessage.content;
      }
    }

    result.pairs.push(pair);
    i += 1;
  }

  return result;
};

export const messageMapper: InputParamMapper = {
  toViewModel(rawValue: unknown): MapResult {
    if (rawValue === undefined || rawValue === null) {
      return {
        success: true,
        value: {
          type: 'Message',
          systemPrompt: undefined,
          pairs: [{ userContent: null, uuid: generateUuid() }],
        },
      };
    }

    if (!Array.isArray(rawValue)) {
      return {
        success: false,
        error: `Expected array for Message param, got ${typeof rawValue}`,
        fallbackValue: {
          type: 'Message',
          systemPrompt: undefined,
          pairs: [{ userContent: null, uuid: generateUuid() }],
        },
      };
    }

    return {
      success: true,
      value: parseMessagesToViewModel(rawValue as SettingMessageInputParamData[]),
    };
  },

  toDomain(value: InputCapabilityValue): unknown {
    const msg = value as MessageInputCapabilityValue;
    const result: SettingMessageInputParamData[] = [];

    if (msg.systemPrompt !== undefined) {
      result.push({
        role: 'system',
        content: msg.systemPrompt || '',
      });
    }

    for (const pair of msg.pairs) {
      result.push({
        role: 'user',
        content: pair.userContent || '',
      });

      if (pair.assistantContent !== undefined) {
        result.push({
          role: 'assistant',
          content: pair.assistantContent || '',
        });
      }
    }

    return result;
  },

  isCompatible(currentValue): boolean {
    return currentValue.type === 'Message';
  },

  createDefault(): MessageInputCapabilityValue {
    return {
      type: 'Message',
      systemPrompt: undefined,
      pairs: [{ userContent: null, uuid: generateUuid() }],
    };
  },
};
