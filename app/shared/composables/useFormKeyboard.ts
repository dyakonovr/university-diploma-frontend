import { type ComputedRef, onMounted, onUnmounted, type Ref } from 'vue';

type UseFormKeyboardOptions = {
  onSubmit: () => void;
  onCancel: () => void;
  disabled?: Ref<boolean> | ComputedRef<boolean>;
};

/**
 * Adds Enter (submit) and Escape (cancel) keyboard shortcuts to form pages.
 * Skips shortcuts when a dialog is open, or when focus is on textarea/select/contenteditable.
 *
 * @example
 * useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });
 */
function useFormKeyboard(options: UseFormKeyboardOptions) {
  function isDialogOpen(): boolean {
    return !!document.querySelector('.dialog-backdrop');
  }

  function isInteractiveElement(el: Element | null): boolean {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if ((el as HTMLElement).isContentEditable) return true;
    if (el.closest('.select-ui')) return true;
    return false;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (isDialogOpen()) return;

    if (e.key === 'Escape') {
      if (isInteractiveElement(document.activeElement)) return;
      e.preventDefault();
      options.onCancel();
      return;
    }

    if (e.key === 'Enter') {
      if (isInteractiveElement(document.activeElement)) return;
      if (options.disabled?.value) return;
      e.preventDefault();
      options.onSubmit();
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
  });
}

export default useFormKeyboard;
