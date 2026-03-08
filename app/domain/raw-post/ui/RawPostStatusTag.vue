<template>
  <tag-ui
    :type="getStatusType(status)"
    :loading="status === 'processing'">
    {{ getStatusText(status) }}
  </tag-ui>
</template>

<script setup lang="ts">
import TagUi from '~/components/ui/TagUi.vue';
import type { RawPostStatus } from '~/domain/raw-post/models/raw-post.types';
import type { TagType } from '~/shared/types/ui/tag.types';

type Props = {
  status: RawPostStatus;
};
defineProps<Props>();

const statusMap: Record<RawPostStatus, string> = {
  failed: 'Ошибка',
  processing: 'В процессе',
  completed: 'Завершена',
};

// Текстовые представления статусов
const getStatusText = (status: RawPostStatus) => {
  return statusMap[status] || status;
};

const statusTypeMap: Record<RawPostStatus, TagType> = {
  failed: 'error',
  processing: 'warning',
  completed: 'success',
};

// Текстовые представления статусов
const getStatusType = (status: RawPostStatus): TagType => {
  return statusTypeMap[status] || 'info';
};
</script>
