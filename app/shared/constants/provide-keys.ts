import type { InjectionKey } from 'vue';

/** Inject key for the current workspace ID within [workspaceId] route group */
export const WORKSPACE_ID_KEY: InjectionKey<string> = Symbol('workspaceId');
