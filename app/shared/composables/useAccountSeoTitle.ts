import { computed, type MaybeRefOrGetter, ref, toValue, watch } from "vue";

import { useHead } from "#imports";

const ACCOUNT_TITLE_SUFFIX = "Secretary AI";

/**
 * Sets the browser `<title>` with the account suffix: `${title} - Secretary AI`.
 * Does NOT affect `route.meta.title` — breadcrumbs and sidebar keep using `definePageMeta`.
 *
 * @param title - Static string, ref, computed, or getter returning the title.
 * @param options.fallback - Fallback title used while the dynamic value is not yet available.
 * @param options.snapshot - If `true`, captures the first truthy value and freezes it
 *   (useful for form pages so user edits don't change the page title). Default: `false`.
 *
 * @example
 * // Static (list page)
 * useAccountSeoTitle('Категории публичных шаблонов');
 *
 * @example
 * // Reactive (tabs page)
 * const title = computed(() => `Посты: ${activeTabLabel.value}`);
 * useAccountSeoTitle(title);
 *
 * @example
 * // Snapshot (form page — freezes after first data load)
 * useAccountSeoTitle(() => formData.value.name, {
 *   snapshot: true,
 *   fallback: 'Категория шаблонов',
 * });
 */
function useAccountSeoTitle(
  title: MaybeRefOrGetter<string | null | undefined>,
  options?: { fallback?: string; snapshot?: boolean },
) {
  const { fallback = "", snapshot = false } = options ?? {};

  const snapshotValue = ref<string | null>(null);

  if (snapshot) {
    const stop = watch(
      () => toValue(title),
      (newVal) => {
        if (newVal) {
          snapshotValue.value = newVal;
          stop();
        }
      },
      { immediate: true },
    );
  }

  const baseTitle = computed(() => {
    return snapshot
      ? (snapshotValue.value ?? fallback)
      : (toValue(title) ?? fallback);
  });

  const fullTitle = computed(() => {
    return baseTitle.value
      ? `${baseTitle.value} - ${ACCOUNT_TITLE_SUFFIX}`
      : ACCOUNT_TITLE_SUFFIX;
  });

  useHead({ title: fullTitle });
}

export default useAccountSeoTitle;
