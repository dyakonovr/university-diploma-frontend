<template>
  <div class="stat-report-coming-soon">
    <div class="stat-report-coming-soon__icon">
      <file-icon />
    </div>
    <p class="stat-report-coming-soon__text">
      Отчёты скоро будут доступны, мы работаем над этим
    </p>
  </div>
</template>

<script lang="ts" setup>
import FileIcon from '~/assets/images/icons/file-with-lines.svg';
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.stat-report-coming-soon {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0 0;
  margin-top: 16px;
  border-top: 1px solid colors.$border;

  &__icon {
    color: colors.$text-light;
    opacity: 0.4;
    flex-shrink: 0;

    svg {
      width: 32px;
      height: 32px;
    }
  }

  &__text {
    font-size: 14px;
    color: colors.$text-light;
  }
}
</style>
