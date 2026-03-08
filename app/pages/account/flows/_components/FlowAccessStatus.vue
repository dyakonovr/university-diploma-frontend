<template>
  <tag-ui :type="accessible ? 'success' : 'error'">
    {{ accessible ? 'Доступен для генерации' : 'Не доступен для генерации' }}
  </tag-ui>
</template>

<script setup lang="ts">
import TagUi from '~/components/ui/TagUi.vue';

defineProps<{
  accessible: boolean;
}>();
</script>
