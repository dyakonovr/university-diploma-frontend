<template>
  <span class="expandable-text">
    <span v-if="!expanded">
      {{ displayText }}
      <button
        v-if="isTruncated"
        type="button"
        class="expandable-text__more"
        :title="t('expandTextButton')"
        @click="expand"
      >
        …
      </button>
    </span>

    <span
      v-show="expanded"
      class="expandable-text__full">
      {{ text }}
    </span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string;
    maxLength: number;
    softThreshold?: number; // 0..1
  }>(),
  {
    softThreshold: 0.15,
  },
);

const expanded = ref(false);

const overflowRatio = computed(() => {
  if (props.text.length <= props.maxLength) return 0;
  return (props.text.length - props.maxLength) / props.text.length;
});

const isTruncated = computed(() => {
  return (
    props.text.length > props.maxLength &&
    overflowRatio.value > props.softThreshold
  );
});

const displayText = computed(() => {
  return isTruncated.value ? props.text.slice(0, props.maxLength) : props.text;
});

function expand() {
  expanded.value = true;
}

const { t } = useI18n({
  useScope: 'local',
});
</script>

<style scoped>
.expandable-text__more {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
}
</style>

<i18n lang="json">
{
  "ru": {
    "expandTextButton": "Развернуть текст"
  },
  "en": {
    "expandTextButton": "Expand text"
  }
}
</i18n>
