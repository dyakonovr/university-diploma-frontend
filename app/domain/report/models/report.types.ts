import type { BaseEntity, EntityId } from '~/shared/types/core/base-entity.types';

export type ReportPreset = BaseEntity & {
  title: string;
  description: string;
  prompt: string;
  workspace_id: EntityId;
  created_at: string;
  updated_at: string;
};

export type ReportPresetCreate = {
  title: string;
  description: string;
  prompt: string;
};

export type ReportGenerateRequest = {
  preset_id: EntityId;
  additional_query?: string;
};

export type ReportGenerateResponse = {
  markdown: string;
};
