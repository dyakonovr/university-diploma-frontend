import { getMyWorkspaces, getWorkspace } from '~/domain/workspace/api/workspace.api';
import type { Workspace } from '~/domain/workspace/models/workspace.types';

type State = {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
};

const useWorkspaceStore = defineStore('workspace', {
  state: (): State => ({
    workspaces: [],
    currentWorkspace: null,
    loading: false,
  }),
  getters: {
    currentWorkspaceId(): string | null {
      return this.currentWorkspace?.id ?? null;
    },
  },
  actions: {
    async fetchWorkspaces() {
      this.loading = true;
      try {
        const response = await getMyWorkspaces();
        this.workspaces = response.data;
      } catch (e) {
        console.error('@Error fetching workspaces:', e);
      } finally {
        this.loading = false;
      }
    },
    async fetchWorkspace(id: string) {
      try {
        const response = await getWorkspace(id);
        this.currentWorkspace = response.data;
      } catch (e) {
        console.error('@Error fetching workspace:', e);
      }
    },
    setCurrentWorkspace(workspace: Workspace | null) {
      this.currentWorkspace = workspace;
    },
  },
});

export default useWorkspaceStore;
