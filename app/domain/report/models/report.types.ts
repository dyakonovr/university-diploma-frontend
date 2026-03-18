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

// --- Statistics (no AI) ---

export type TaskStatistics = {
  total: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
  external: number;
};

export type DeadlineStatistics = {
  overdue: number;
  due_this_week: number;
  due_later: number;
  no_deadline: number;
};

export type MemberStats = {
  user_id: string;
  name: string;
  role: string;
  task_count: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
};

export type StatisticsReport = {
  tasks: TaskStatistics;
  deadlines: DeadlineStatistics;
  members: MemberStats[];
};

// --- Workload ---

export type MemberWorkload = {
  user_id: string;
  name: string;
  openTasks: number;
};

export type WorkloadReport = {
  members: MemberWorkload[];
};
