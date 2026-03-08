<template>
  <div
    class="faq-accordion"
    :class="{ opened: isOpen }">
    <button
      class="faq-accordion__header text-18 weight-700"
      @click="isOpen = !isOpen"
    >
      {{ rt(content.name) }}

      <chevron-down-icon class="faq-accordion__header-icon" />
    </button>

    <div
      v-show="isOpen"
      class="faq-accordion__content text-14"
      v-html="formattedText"
    />
  </div>
</template>

<script lang="ts" setup>
import ChevronDownIcon from '@/assets/images/icons/chevron-down.svg';
import type { FaqItem } from '~/shared/types/ui/landing.types';

type Props = {
  content: FaqItem;
};

const props = defineProps<Props>();

const isOpen = ref(false);

const { rt } = useI18n();

const formattedText = computed(() => {
  return rt(props.content.text).replace(/\n/g, '<br>');
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.faq-accordion {
  --border-color: #{colors.$border};
  --background-color: #{colors.$white};
  --color: #{colors.$text-light};

  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--color);
  background-color: var(--background-color);

  &.opened {
    .faq-accordion__header-icon {
      transform: rotate(180deg);
    }
  }

  &__header {
    --color: #{colors.$text};

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    text-align: start;
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    color: var(--color);
    cursor: pointer;

    &-icon {
      --color: #{colors.$text-light};

      width: 24px;
      height: 23px;
      color: var(--color);
      transition: none;
    }
  }

  &__content {
    padding: 0 20px 20px;
    margin-top: -10px;
  }
}

[data-theme='dark'] .faq-accordion {
  --border-color: #{colors.$border};
  --background-color: #{colors.$dark-grey};
  --color: #{colors.$border};

  &__header {
    --color: #{colors.$border};

    &-icon {
      --color: currentColor;
    }
  }
}
</style>
