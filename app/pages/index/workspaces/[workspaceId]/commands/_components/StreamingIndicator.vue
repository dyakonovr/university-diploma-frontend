<template>
  <div class="streaming-indicator">
    <span class="streaming-indicator__dots">
      <span class="streaming-indicator__dot" />
      <span class="streaming-indicator__dot" />
      <span class="streaming-indicator__dot" />
    </span>
    <span class="streaming-indicator__label">{{ stageLabel }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stageLabel: string;
}>();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.streaming-indicator {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: colors.$background;
  border: 1px solid colors.$border;
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  font-size: 13px;
  color: colors.$text-light;

  &__dots {
    display: flex;
    gap: 4px;
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: colors.$primary;
    animation: streaming-pulse 1.4s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  &__label {
    font-weight: 500;
  }
}

@keyframes streaming-pulse {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
