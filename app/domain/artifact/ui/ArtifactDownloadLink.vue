<template>
  <nuxt-link
    :to="downloadFileLink"
    class="artifact-link"
  >Скачать текущий файл</nuxt-link
  >
</template>

<script lang="ts" setup>
import { API_BASES, API_PREFIX } from '~/shared/utils/core/request.client';

type Props = {
  artifactId: string;
};

const props = defineProps<Props>();

const downloadFileLink = computed(() => {
  return `${API_BASES.FLOW}${API_PREFIX}/artifacts/${props.artifactId}/download`;
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.artifact-link {
  color: colors.$primary;
}
</style>
