<template>
  <tag-ui
    :type="getStatusType(status)"
    :loading="status === 'processing' || status === 'waiting'">
    {{ getStatusText(status) }}
  </tag-ui>
</template>

<script setup lang="ts">
import TagUi from '~/components/ui/TagUi.vue';
import type { RawPostBlockStatus } from '~/domain/raw-post/models/raw-post.types';
import type { TagType } from '~/shared/types/ui/tag.types';

type Props = {
  status: RawPostBlockStatus;
};
defineProps<Props>();

const statusMap: Record<RawPostBlockStatus, string> = {
  failed: 'Ошибка',
  processing: 'В процессе',
  completed: 'Завершен',
  waiting: 'Ожидает очереди',
};

// Текстовые представления статусов
const getStatusText = (status: RawPostBlockStatus) => {
  return statusMap[status] || status;
};

const statusTypeMap: Record<RawPostBlockStatus, TagType> = {
  failed: 'error',
  processing: 'warning',
  completed: 'success',
  waiting: 'warning',
};

const getStatusType = (status: RawPostBlockStatus): TagType => {
  return statusTypeMap[status] || 'info';
};
</script>
