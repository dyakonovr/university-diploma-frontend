<template>
  <teleport to="body">
    <transition name="dialog-fade">
      <div
        v-if="model"
        class="dialog-backdrop"
        @click.self="closeDialog">
        <div
          class="dialog"
          :class="dialogClass">
          <header class="dialog__header">
            <h3 class="dialog__title">{{ title }}</h3>
          </header>

          <section class="dialog__body">
            <p
              v-if="message"
              v-html="message" />

            <slot v-else />
          </section>

          <footer class="dialog__footer">
            <slot
              v-if="$slots.footer"
              name="footer" />

            <template v-else>
              <button-ui
                variant="outlined"
                v-bind="cancelButtonProps"
                @click="closeDialog"
              >
                {{ cancelButtonText }}
              </button-ui>

              <button-ui
                v-bind="confirmButtonProps"
                @click="confirm">
                {{ confirmButtonText }}
              </button-ui>
            </template>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import ButtonUi from './ButtonUi.vue';

type Props = {
  title: string;
  message?: string;
  dialogClass?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  cancelButtonText?: string;
  confirmButtonText?: string;
  cancelButtonProps?: Record<string, unknown>;
  confirmButtonProps?: Record<string, unknown>;
  /** When false, dialog won't auto-close on confirm — use `done` callback instead */
  autoCloseOnConfirm?: boolean;
};

const model = defineModel<boolean>();

const props = withDefaults(defineProps<Props>(), {
  cancelButtonText: 'Отмена',
  confirmButtonText: 'Подтвердить',
  message: undefined,
  dialogClass: undefined,
  cancelButtonProps: undefined,
  confirmButtonProps: undefined,
  autoCloseOnConfirm: true,
});

const emit = defineEmits<{
  (e: 'confirm', done: () => void): void;
}>();

const closeDialog = () => {
  model.value = false;
};

const confirm = () => {
  emit('confirm', closeDialog);
  if (props.autoCloseOnConfirm) {
    closeDialog();
  }
};

const handleGlobalKeyDown = (e: KeyboardEvent) => {
  if (!model.value) return;

  if (e.key === 'Enter') {
    e.preventDefault();
    confirm();
  }

  if (e.key === 'Escape') {
    e.preventDefault();
    closeDialog();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown, true);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown, true);
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.dialog {
  background: var(--color-bg, #fff);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 32px);

  &__header {
    padding: 16px;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
  }

  &__title {
    margin: 0;
    font-size: 16px;
  }

  &__body {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;

    p {
      line-height: 1.35;
    }
  }

  &__footer {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid colors.$border;
    flex-shrink: 0;

    @media screen and (max-width: 480px) {
      flex-direction: column;
    }
  }
}

.dialog-fade-enter-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-active .dialog {
  transition: transform 0.2s ease;
}

.dialog-fade-leave-active {
  transition: opacity 0.15s ease;
}

.dialog-fade-leave-active .dialog {
  transition: transform 0.15s ease;
}

.dialog-fade-enter-from {
  opacity: 0;
}

.dialog-fade-enter-from .dialog {
  transform: scale(0.95);
}

.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-leave-to .dialog {
  transform: scale(0.95);
}
</style>
