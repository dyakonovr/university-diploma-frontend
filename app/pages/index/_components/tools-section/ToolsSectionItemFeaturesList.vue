<template>
  <ul class="tool-features list-reset">
    <li
      v-for="feature in features"
      :key="rt(feature)"
      class="tool-features__item text-18"
    >
      <check-blue-bg-icon
        class="tool-features__item-icon tool-features__item-icon--blue"
      />
      <check-white-bg-icon
        class="tool-features__item-icon tool-features__item-icon--white"
      />
      <span v-html="rt(feature)" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import CheckBlueBgIcon from '@/assets/images/icons/check-with-blue-bg.svg';
import CheckWhiteBgIcon from '@/assets/images/icons/check-with-white-bg.svg';
import type { ToolItem } from '~/shared/types/ui/landing.types';

type Props = {
  features: ToolItem['features'];
};

defineProps<Props>();

const { rt } = useI18n();
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.tool-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: offsets.$offset-16;

  @media screen and (max-width: 992px) {
    margin-top: 0;
  }

  &__item {
    --color: #{colors.$text-light};

    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--color);

    @media screen and (max-width: 992px) {
      color: colors.$background;
    }

    &-icon {
      @media screen and (min-width: 992px) {
        &--blue {
          display: block;
        }

        &--white {
          display: none;
        }
      }

      @media screen and (max-width: 992px) {
        &--blue {
          display: none;
        }

        &--white {
          display: block;
        }
      }
    }
  }
}

[data-theme='dark'] .tool-features {
  &__item {
    --color: #{colors.$border};
  }
}
</style>
