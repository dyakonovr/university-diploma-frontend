import {
  createTaskComment,
  deleteTaskComment,
  getTaskComments,
} from '~/domain/task/api/task-comment.api';
import type { TaskComment } from '~/domain/task/models/task-comment.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useTaskComments(workspaceId: string, taskId: string) {
  const { toastSuccess, toastError } = useCustomToast();

  const comments = ref<TaskComment[]>([]);
  const loading = ref(false);
  const sending = ref(false);
  const commentText = ref('');

  const fetchComments = async () => {
    loading.value = true;
    try {
      const response = await getTaskComments(workspaceId, taskId);
      comments.value = response.data;
    } catch (e) {
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  const sendComment = async () => {
    const text = commentText.value.trim();
    if (!text || sending.value) return;

    sending.value = true;
    try {
      const response = await createTaskComment(workspaceId, taskId, { content: text });
      comments.value.push(response.data);
      commentText.value = '';
      toastSuccess('Комментарий добавлен');
    } catch (e) {
      toastError('Ошибка при добавлении комментария');
      showRequestError(e);
    } finally {
      sending.value = false;
    }
  };

  const removeComment = async (commentId: string) => {
    try {
      await deleteTaskComment(commentId, workspaceId, taskId);
      comments.value = comments.value.filter((c) => c.id !== commentId);
      toastSuccess('Комментарий удалён');
    } catch (e) {
      toastError('Ошибка при удалении комментария');
      showRequestError(e);
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendComment();
    }
  };

  return {
    comments,
    loading,
    sending,
    commentText,
    fetchComments,
    sendComment,
    removeComment,
    handleKeydown,
  };
}

export default useTaskComments;
