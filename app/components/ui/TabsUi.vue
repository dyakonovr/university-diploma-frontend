<template>
  <div
    class="tabs-ui"
    v-bind="$attrs">
    <slot name="preButtons" />
    <div
      ref="buttonsRef"
      class="tabs-ui__buttons">
      <template
        v-for="tab in tabs"
        :key="tab.value">
        <button
          v-if="tab.visible === undefined || tab.visible"
          type="button"
          class="tabs-ui__button text-18 weight-500"
          :class="{ 'tabs-ui__button--active': tab.value === activeTab }"
          @click="select(tab.value)"
        >
          {{ tab.label }}
        </button>
      </template>
    </div>
    <slot name="postButtons" />
  </div>

  <slot :name="activeTab" />
</template>

<script setup lang="ts">
import type { TabItem } from '~/shared/types/ui/tabs.types';
import { parseUrlParams } from '~/shared/utils/core/parseURLParams';

type Props = {
  tabs: TabItem[];
  parseFromUrl?: boolean;
  resetUrlOnTabChange?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  parseFromUrl: true,
  resetUrlOnTabChange: true,
});
const activeTab = defineModel<string>();
const buttonsRef = ref<HTMLDivElement | null>(null);

const emit = defineEmits<{
  (e: 'tab-change', value: string): void;
}>();

const router = useRouter();
const route = useRoute();

function buildQuery(name: string) {
  if (props.resetUrlOnTabChange) {
    return { tab: name };
  }

  return {
    ...route.query,
    tab: name,
  };
}

function select(name: string) {
  activeTab.value = name;
  router.replace({ query: buildQuery(name) });
  emit('tab-change', name);
}

const parseActiveTabFromUrl = () => {
  if (!props.parseFromUrl) return;

  const { tab } = parseUrlParams<{ tab: string }>([
    { fieldName: 'tab', type: 'string' },
  ]);

  if (!tab) return;

  const exists = props.tabs.some((t) => t.value === tab);
  if (!exists) return;

  activeTab.value = tab;
};

const scrollToActiveTab = () => {
  if (!buttonsRef.value) return;
  const activeButton = buttonsRef.value.querySelector(
    '.tabs-ui__button--active',
  ) as HTMLElement | null;
  if (!activeButton) return;

  activeButton.scrollIntoView({ inline: 'center', block: 'nearest' });
};

onMounted(() => {
  parseActiveTabFromUrl();
  nextTick(scrollToActiveTab);
});

defineExpose({
  select,
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.tabs-ui {
  .form-container__loader {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__buttons {
    display: flex;
    align-items: center;
    gap: 24px;
    border-bottom: 1px solid colors.$border;
    width: fit-content;
    overflow-x: auto;
    max-width: 100%;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__button {
    border-bottom: 2px solid transparent;
    color: colors.$text-light;
    opacity: 0.6;
    white-space: nowrap;
    transition:
      opacity 0.2s,
      color 0.2s,
      border-color 0.2s;

    &:hover {
      opacity: 0.85;
      color: colors.$text;
    }

    &--active {
      border-color: colors.$primary;
      color: colors.$text;
      opacity: 1;
    }
  }
}
</style>
