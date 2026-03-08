/** Одна пара user/assistant в Message */
export type MessagePair = {
  userContent: string | null;
  assistantContent?: string | null;
  uuid: string;
};

/** Structured message input value: system prompt + user/assistant pairs */
export type MessageInputValue = {
  systemPrompt?: string | null;
  pairs: MessagePair[];
};

/** Ошибки валидации для message input editor */
export type MessageInputErrors = {
  systemPrompt?: string | null;
  pairs?: Record<
    number,
    {
      userContent?: string | null;
      assistantContent?: string | null;
    }
  >;
};
