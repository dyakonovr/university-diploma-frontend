import type { Artifact } from '~/domain/artifact/models/artifact.types';
import {
  updateArtifactOrders,
  updateTextArtifactUsecase,
} from '~/domain/artifact/usecases/artifact.usecase';
import type { RawPostBlock } from '~/domain/raw-post/models/raw-post.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import { useRawPostStore } from '../_stores/raw-post-form';

function useRawPostFormAllArtifacts() {
  const { toastError } = useCustomToast();

  const postStore = useRawPostStore();

  const loading = computed(() => postStore.isGlobalLoading);
  const error = ref<string | null>(null);

  const artifacts = ref<Artifact[]>([]);
  const isAnyEditing = ref(false);

  const fetchAllArtifacts = async (blockIds: EntityId[]) => {
    postStore.startLoading();
    error.value = null;

    try {
      await postStore.fetchAllBlocksArtifacts(blockIds);
    } catch (e) {
      console.error(e);
      error.value = 'Не удалось загрузить артефакты';
    } finally {
      postStore.stopLoading();
    }
  };

  const initArtifacts = (blocks: RawPostBlock[]) => {
    artifacts.value = [];
    blocks.forEach((block) => {
      artifacts.value.push(...postStore.getArtifactsByBlock(block.id));
    });
    artifacts.value.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  /** Функция, которая срабатывает после перетаскивания артефактов.
   * Учитывая, что артефактов не может быть очень много, будем отправлять весь список */
  const onReorderArtifacts = async () => {
    try {
      postStore.startLoading();

      const data = artifacts.value.map((a, idx) => ({
        artifact_id: a.id,
        order: idx,
      }));

      await updateArtifactOrders(data);
      postStore.bumpPreviewRevision();
    } catch (error) {
      console.error('@Artifacts dragging error:', error);
      toastError('Ошибка при смене порядка артефактов');
    } finally {
      postStore.stopLoading();
    }
  };

  /** Сохранение текста артефакта */
  const onUpdateTextArtifact = async (
    artifactId: EntityId,
    newText: string,
  ) => {
    try {
      postStore.startLoading();
      await updateTextArtifactUsecase(artifactId, { text: newText });
      postStore.updateArtifactText(artifactId, newText);
      postStore.bumpPreviewRevision();
    } catch (e) {
      console.error('@Artifact text update error:', e);
      toastError('Ошибка при обновлении текста артефакта');
    } finally {
      postStore.stopLoading();
    }
  };

  return {
    loading,
    error,
    artifacts,
    isAnyEditing,
    fetchAllArtifacts,
    initArtifacts,
    onReorderArtifacts,
    onUpdateTextArtifact,
  };
}

export default useRawPostFormAllArtifacts;
