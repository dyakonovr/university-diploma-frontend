import { defineStore } from 'pinia';

import { downloadBinaryArtifact } from '~/domain/artifact/api/artifacts.api';
import type { Artifact } from '~/domain/artifact/models/artifact.types';
import { getPostBlockArtifacts } from '~/domain/raw-post/usecases/raw-post.usecases';
import type { EntityId } from '~/shared/types/core/base-entity.types';

export type ArtifactState = {
  blob: Blob | null;
  previewUrl: string | null;
  isPreviewShowed: boolean;
  loading: boolean;
  error: string | null;
};

export type RawPostState = {
  /** Артефакты по блокам */
  artifactsByBlock: Record<EntityId, Artifact[]>;

  /** Состояние бинарных данных артефактов */
  artifactStates: Record<EntityId, ArtifactState>;

  postId: EntityId | null;

  /** Глобальный счётчик загрузок. Помогает бороться с тем, что `loading` одна форма включила, а другая - выключила */
  globalLoadingCount: number;

  /** Загрузка постинга (публикация / превью) — не блокирует основную форму */
  postingLoading: boolean;

  /** Счётчик ревизий превью. Инкрементируется при изменении артефактов (текст, порядок),
   * чтобы форма постинга могла перезапросить превью */
  previewRevision: number;

  /** Счётчик ревизий списка соц. постов. Инкрементируется после успешной публикации */
  socialPostsRevision: number;
};

export const useRawPostStore = defineStore('raw-post', {
  state: (): RawPostState => ({
    artifactsByBlock: {},
    artifactStates: {},
    postId: null,
    globalLoadingCount: 0,
    postingLoading: false,
    previewRevision: 0,
    socialPostsRevision: 0,
  }),

  getters: {
    getArtifactsByBlock: (state) => {
      return (blockId: EntityId) => state.artifactsByBlock[blockId] ?? [];
    },

    getArtifactState: (state) => {
      return (artifactId: EntityId): ArtifactState | undefined =>
        state.artifactStates[artifactId];
    },

    getAllArtifacts: (state) => {
      return () => Object.values(state.artifactsByBlock).flat();
    },

    isGlobalLoading: (state) => state.globalLoadingCount > 0,
  },

  actions: {
    clear() {
      this.artifactStates = {};
      this.artifactsByBlock = {};
      this.postId = null;
      this.globalLoadingCount = 0;
      this.postingLoading = false;
      this.previewRevision = 0;
      this.socialPostsRevision = 0;
    },

    /** Инициализация состояния артефакта */
    initArtifactState(artifactId: EntityId) {
      if (!this.artifactStates[artifactId]) {
        this.artifactStates[artifactId] = {
          blob: null,
          previewUrl: null,
          isPreviewShowed: false,
          loading: false,
          error: null,
        };
      }
    },

    /** Получить артефакты блока без загрузки файлов */
    async fetchBlockArtifactsList(blockId: EntityId) {
      // Проверяем кэш
      if (this.artifactsByBlock[blockId]?.length) return;

      const { data } = await getPostBlockArtifacts(blockId);
      this.artifactsByBlock[blockId] = data;

      // Инициализация состояния артефактов
      data.forEach((a) => {
        if (a.id) this.initArtifactState(a.id);
      });
    },

    /** Получить все артефакты всех блоков и загрузить blob-файлы (PostAllArtifacts) */
    async fetchAllBlocksArtifacts(blockIds: EntityId[]) {
      for (const blockId of blockIds) {
        // Если артефакты уже есть, используем кэш
        let blockArtifacts = this.artifactsByBlock[blockId];
        if (!blockArtifacts?.length) {
          const { data } = await getPostBlockArtifacts(blockId);
          blockArtifacts = data;
          this.artifactsByBlock[blockId] = data;

          data.forEach((a) => {
            if (a.id) this.initArtifactState(a.id);
          });
        }

        // Теперь подгружаем blob для каждого артефакта
        for (const artifact of blockArtifacts) {
          if (!artifact.id) continue;
          const state = this.artifactStates[artifact.id];
          if (!state) continue;

          // Если blob уже есть, пропускаем
          if (!state.blob && artifact.type === 'binary') {
            await this.fetchArtifactBlob(artifact.id, state);
          }

          // Все preview закрыты по умолчанию
          state.isPreviewShowed = false;
        }
      }
    },

    /** Получить preview конкретного артефакта (PostFormBlockArtifact) */
    async fetchArtifactPreview(artifactId: EntityId) {
      const state = this.artifactStates[artifactId];
      if (!state) return null;

      if (!state.blob) {
        await this.fetchArtifactBlob(artifactId, state);
      }

      state.isPreviewShowed = true;
      return state.blob;
    },

    async fetchArtifactBlob(
      artifactId: EntityId,
      state: ArtifactState,
    ): Promise<Blob | null> {
      try {
        const blob = await downloadBinaryArtifact(artifactId);
        state.blob = blob;
        state.previewUrl = URL.createObjectURL(blob);
        return blob;
      } catch (e) {
        console.error(e);
        state.error = 'Файл недоступен';
        return null;
      }
    },

    showPreview(artifactId: EntityId) {
      const state = this.artifactStates[artifactId];
      if (state) state.isPreviewShowed = true;
    },

    hidePreview(artifactId: EntityId) {
      const state = this.artifactStates[artifactId];
      if (state) state.isPreviewShowed = false;
    },

    startLoading() {
      this.globalLoadingCount += 1;
    },

    stopLoading() {
      if (this.globalLoadingCount > 0) {
        this.globalLoadingCount -= 1;
      }
    },

    bumpPreviewRevision() {
      this.previewRevision += 1;
    },

    bumpSocialPostsRevision() {
      this.socialPostsRevision += 1;
    },

    /** Обновляет текст артефакта в локальном кэше */
    updateArtifactText(artifactId: EntityId, newText: string) {
      for (const blockArtifacts of Object.values(this.artifactsByBlock)) {
        const artifact = blockArtifacts.find((a) => a.id === artifactId);
        if (artifact) {
          artifact.data = newText;
          break;
        }
      }
    },
  },
});
