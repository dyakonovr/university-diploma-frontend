<template>
  <div class="param-card">
    <div class="param-card__header">
      <p class="param-card__title">{{ title }}</p>
      <slot name="badge" />
    </div>
    <div class="param-card__body">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.param-card {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid colors.$border;
  max-width: 100%;
  width: 100%;
  height: 100%;

  background: linear-gradient(
    135deg,
    colors.$white 0%,
    rgba(colors.$background, 0.6) 100%
  );

  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
  gap: offsets.$offset-24;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: colors.$text;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-16;
    height: 100%;

    :deep(.form-wrapper.with-label.row) {
      grid-template-columns: 4fr 6fr;
    }
  }
}
</style>
