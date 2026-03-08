<template>
  <div class="form-header">
    <button
      v-if="withBackButton"
      type="button"
      class="form-header__back-button"
      @click="$emit('getBack')"
    >
      <arrow-left-icon />
    </button>

    <account-section-title />
  </div>
</template>

<script setup lang="ts">
import ArrowLeftIcon from '~/assets/images/icons/arrow-left.svg';

import AccountSectionTitle from './AccountSectionTitle.vue';

type Props = {
  withBackButton?: boolean;
};
withDefaults(defineProps<Props>(), {
  withBackButton: true,
});

defineEmits<{
  (e: 'getBack'): void;
}>();
</script>

<style lang="scss">
.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  &__back-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
  }
}
</style>
