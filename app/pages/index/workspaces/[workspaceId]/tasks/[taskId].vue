<template>
  <div class="task-form-page">
    <account-form-header @get-back="getBack" />

    <form-container :loading="loading">
      <input-ui
        v-model="formData.title"
        label="Название"
        :required="true"
        :input-props="{ placeholder: 'Название задачи', disabled: saving }"
        :error="formErrors.title"
      />
      <editor-element-ui
        v-model="formData.description"
        label="Описание"
        :disabled="saving"
      />
      <select-ui
        v-model="formData.assignee_id"
        label="Исполнитель"
        :options="memberOptions"
        :select-props="{ placeholder: 'Не назначен', disabled: saving }"
      />

      <select-ui
        v-model="formData.priority"
        label="Приоритет"
        :options="PRIORITY_OPTIONS"
        :searchable="false"
        :select-props="{ disabled: saving }"
      />
      <select-ui
        v-model="formData.status"
        label="Статус"
        :options="STATUS_OPTIONS"
        :searchable="false"
        :select-props="{ disabled: saving || !isEditMode }"
      />
      <input-ui
        v-model="formData.progress"
        label="Прогресс"
        :input-props="{
          type: 'number',
          min: 0,
          max: 100,
          placeholder: '0',
          disabled: saving || !isEditMode,
        }"
        :clearable="false"
        :error="formErrors.progress"
      />
      <datepicker-ui
        v-model="formData.deadline"
        label="Дедлайн"
        :disabled="saving"
      />
    </form-container>

    <form-buttons
      :disabled="saving"
      :submit-text="editId ? 'Сохранить' : 'Создать'"
      @cancel="getBack"
      @submit="onSubmit"
    />

    <!-- Внешний источник -->
    <div
      v-if="isEditMode && (externalSource || externalLink)"
      class="task-external-info"
    >
      <tag-ui
        v-if="externalSource"
        type="info"
      >
        {{ externalSource }}
        <template v-if="externalId"> #{{ externalId }}</template>
      </tag-ui>
      <a
        v-if="externalLink"
        :href="externalLink"
        target="_blank"
        rel="noopener noreferrer"
        class="task-external-info__link"
      >
        Открыть в {{ externalSource || 'источнике' }}
      </a>
    </div>

    <!-- Комментарии (только в режиме редактирования) -->
    <div
      v-if="isEditMode"
      class="task-comments"
    >
      <p class="task-comments__title">Комментарии</p>

      <div class="task-comments__list">
        <div
          v-if="commentsLoading"
          class="task-comments__loading"
        >
          <spinner-ui />
        </div>

        <p
          v-else-if="!comments.length"
          class="task-comments__empty"
        >
          Комментариев пока нет
        </p>

        <div
          v-for="comment in comments"
          :key="comment.id"
          class="task-comments__item"
        >
          <div class="task-comments__item-header">
            <span class="task-comments__item-date">
              {{ formatDate(comment.created_at) }}
            </span>
            <button
              v-if="comment.author_id === currentUserId"
              class="task-comments__item-delete"
              type="button"
              @click="removeComment(comment.id)"
            >
              Удалить
            </button>
          </div>
          <p class="task-comments__item-text">{{ comment.content }}</p>
        </div>
      </div>

      <div class="task-comments__input-row">
        <input-ui
          v-model="commentText"
          :input-props="{
            placeholder: 'Написать комментарий...',
            disabled: commentsSending,
            onKeydown: handleCommentKeydown,
          }"
        />
        <button-ui
          :loading="commentsSending"
          :disabled="!commentText.trim()"
          @click="sendComment"
        >
          Отправить
        </button-ui>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DatepickerUi from '~/components/ui/form/DatepickerUi.vue';
import EditorElementUi from '~/components/ui/form/EditorElementUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from '~/domain/task/constants/task.constants';
import useUserStore from '~/domain/user/stores/user';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import useTaskComments from './_composables/useTaskComments';
import useTaskForm from './_composables/useTaskForm';

const workspaceId = inject(WORKSPACE_ID_KEY)!;
const userStore = useUserStore();

const currentUserId = computed(() => userStore.user?.id ?? '');

const {
  loading,
  saving,
  editId,
  isEditMode,
  formData,
  formErrors,
  memberOptions,
  externalLink,
  externalId,
  externalSource,
  getData,
  onSubmit,
  getBack,
} = useTaskForm(workspaceId);

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: saving });

const route = useRoute();
const taskId = computed(() => route.params.taskId as string);

const {
  comments,
  loading: commentsLoading,
  sending: commentsSending,
  commentText,
  fetchComments,
  sendComment,
  removeComment,
  handleKeydown: handleCommentKeydown,
} = useTaskComments(workspaceId, taskId.value);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onBeforeMount(async () => {
  try {
    await getData();
    if (isEditMode.value) {
      await fetchComments();
    }
  } catch (error) {
    console.error('@', error);
  }
});

// --- SEO ---
const PAGE_TITLE = computed(() =>
  editId.value ? 'Редактирование задачи' : 'Создание задачи',
);
definePageMeta({ title: 'Задача' });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.task-form-page {
  display: flex;
  flex-direction: column;
}

.task-external-info {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  &__link {
    font-size: 13px;
    color: colors.$primary;
    text-decoration: none;
    transition: color 0.15s;

    &:hover {
      text-decoration: underline;
    }
  }
}

.task-comments {
  margin-top: 24px;
  border: 1px solid colors.$border;
  border-radius: 12px;
  background: colors.$white;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);

  &__title {
    font-size: 14px;
    font-weight: 700;
    padding: 16px 20px;
    border-bottom: 1px solid colors.$border;
    color: colors.$text;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    background: #fafbfc;
  }

  &__list {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: 24px;
  }

  &__empty {
    text-align: center;
    color: colors.$text-light;
    font-size: 14px;
    padding: 24px;
  }

  &__item {
    padding: 14px 16px;
    background: colors.$background;
    border-radius: 10px;
    border: 1px solid colors.$border;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    &-date {
      font-size: 12px;
      color: colors.$text-light;
    }

    &-delete {
      background: none;
      border: none;
      color: colors.$text-light;
      font-size: 12px;
      cursor: pointer;
      padding: 0;
      transition: color 0.15s;

      &:hover {
        color: colors.$danger;
      }
    }

    &-text {
      font-size: 14px;
      color: colors.$text;
      line-height: 1.6;
      white-space: pre-wrap;
    }
  }

  &__input-row {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid colors.$border;
    background: #fafbfc;
    align-items: flex-end;

    .form-wrapper {
      flex: 1;
    }
  }
}
</style>
