import type { BaseEntity, EntityId } from "~/shared/types/core/base-entity.types";

type AiContextBase = {
  /** Содержания контекста предприятия для ИИ (будет использоваться в System Prompt) */
  content: string;
};

export type AiContextCreate = AiContextBase;

export type AiContext = BaseEntity & AiContextBase & {
  workspace_id: EntityId;
  version: number;
  updated_at: string;
};