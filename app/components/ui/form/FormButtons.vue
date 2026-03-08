<template>
  <teleport
    v-if="canTeleport"
    to="#afterMain">
    <div class="form-buttons">
      <div class="form-buttons__left">
        <slot name="left" />
      </div>

      <div class="form-buttons__right">
        <button-ui
          v-if="withCancel"
          variant="outlined"
          :disabled="disabled"
          class="form-buttons__right-button"
          @click="$emit('cancel')"
        >
          {{ cancelText }}
        </button-ui>

        <slot />

        <button-ui
          v-if="withSubmit"
          :disabled="disabled"
          class="form-buttons__right-button"
          @click="$emit('submit')"
        >
          {{ submitText }}
        </button-ui>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import ButtonUi from '../ButtonUi.vue';

type Props = {
  disabled?: boolean;
  withCancel?: boolean;
  withSubmit?: boolean;
  cancelText?: string;
  submitText?: string;
};

withDefaults(defineProps<Props>(), {
  withCancel: true,
  withSubmit: true,
  cancelText: 'Отмена',
  submitText: 'Сохранить',
});

defineEmits<{
  (e: 'cancel' | 'submit'): void;
}>();

const canTeleport = ref(false);

onMounted(() => {
  canTeleport.value = !!document.querySelector('#afterMain');
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.form-buttons {
  position: sticky;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid colors.$border;
  padding: 24px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    gap: 24px;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;

    @media screen and (max-width: 768px) {
      align-items: baseline;
      flex-direction: column;
      width: 100%;
    }

    button {
      @media screen and (max-width: 768px) {
        width: 100%;
        max-width: unset;
      }
    }
  }

  &__right {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-left: auto;

    @media screen and (max-width: 768px) {
      align-items: baseline;
      flex-direction: column;
      width: 100%;
    }

    &-button {
      @media screen and (max-width: 768px) {
        width: 100%;
        max-width: unset;
      }
    }
  }
}
</style>
