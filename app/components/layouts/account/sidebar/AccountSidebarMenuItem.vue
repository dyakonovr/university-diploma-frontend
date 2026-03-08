<template>
  <tooltip-ui
    :content="title"
    placement="right-top"
    :offset="0"
    :tooltip-class="`sidebar-item__tooltip ${additionalClass}`"
    :disabled="!collapsed"
    :has-arrow="false"
  >
    <component
      :is="isAction ? 'button' : RouterLink"
      :to="to"
      class="sidebar-item__link"
      :class="{
        'is-submenu-item': isSubmenuItem,
        'is-action': isAction,
        'is-collapsed': collapsed,
        [additionalClass ?? '']: additionalClass,
      }"
    >
      <li
        class="sidebar-item"
        :class="{
          'is-active': active,
          'is-disabled': disabled,
          'is-collapsed': collapsed,
          'with-border': withBorder && collapsed,
        }"
        :title="title.length > MAX_TITLE_LENGTH ? title : undefined"
        @click="handleClick"
        @keydown="handleClick"
      >
        <!-- в collapsed-режиме показываем только иконку (если есть) -->
        <template v-if="collapsed && $slots.icon">
          <div class="sidebar-item__container">
            <span class="sidebar-item__icon">
              <slot name="icon" />
            </span>
          </div>
        </template>

        <!-- В обычном режиме показываем иконку + текст -->
        <template v-else>
          <div class="sidebar-item__container">
            <span
              v-if="$slots.icon"
              class="sidebar-item__icon">
              <slot name="icon" />
            </span>
            <span class="sidebar-item__text">
              {{
                title.length > MAX_TITLE_LENGTH
                  ? `${title.slice(0, MAX_TITLE_LENGTH)}...`
                  : title
              }}
            </span>
          </div>
        </template>
      </li>
    </component>
  </tooltip-ui>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import TooltipUi from '~/components/ui/TooltipUi.vue';

type Props = {
  isAction?: boolean;
  index?: string | number;
  title?: string;
  to?: string;
  disabled?: boolean;
  active?: boolean;
  withBorder?: boolean;
  isSubmenuItem?: boolean;
  additionalClass?: string;
};

const props = withDefaults(defineProps<Props>(), {
  index: undefined,
  title: '',
  disabled: false,
  to: '/',
  active: false,
  withBorder: false,
  additionalClass: undefined,
});

const MAX_TITLE_LENGTH = ref(35);

const emit = defineEmits(['click']);

const collapsed = defineModel<boolean>('collapsed');

const handleClick = () => {
  if (props.disabled) return;
  emit('click', props.index);
};
</script>

<style lang="scss">
@use '/assets/styles/components/sidebar' as sidebar;
@use '/assets/styles/base/colors' as colors;

.sidebar-item {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: sidebar.$sidebar-menu-item-border-radius;
  padding: sidebar.$sidebar-menu-item-padding;
  cursor: pointer;
  transition: background-color sidebar.$sidebar-transition-duration;
  list-style: none;

  &:hover {
    background-color: sidebar.$sidebar-menu-item-color-hover-bg;
  }

  &.is-active {
    background-color: sidebar.$sidebar-menu-item-color-selected-bg;

    .sidebar-item__icon {
      color: sidebar.$sidebar-menu-item-selected-icon-color;
    }
  }

  &.is-active,
  &:hover {
    .sidebar-item__text,
    .sidebar-item__icon {
      color: sidebar.$sidebar-menu-item-color-active-text;
    }
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: none !important;
  }

  &.with-border {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 1px;
      background-color: sidebar.$sidebar-divider-color;
    }
  }

  &__container {
    display: flex;
    align-items: center;
    width: 100%;
    // height: sidebar.$sidebar-menu-item-height;
    gap: 10px;
  }

  // Стили для collapsed-режима
  &.is-collapsed {
    justify-content: center;
    text-align: center;
    padding: 6px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    .sidebar-item__container {
      justify-content: center;
      gap: 0;
    }

    .sidebar-item__icon {
      margin-right: 0;
    }

    .sidebar-item__text {
      display: none;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: sidebar.$sidebar-menu-item-icon-size;
    min-width: sidebar.$sidebar-menu-item-icon-size;
    line-height: sidebar.$sidebar-menu-item-icon-size;
    font-size: sidebar.$sidebar-menu-item-icon-size;
    color: sidebar.$sidebar-menu-item-icon-color;
    transition: color 0.15s ease-in-out;
  }

  &__text {
    font-size: sidebar.$sidebar-menu-item-text-size;
    font-weight: sidebar.$sidebar-menu-item-font-weight;
    line-height: sidebar.$sidebar-menu-item-line-height;
    color: sidebar.$sidebar-color-text;
    transition: color 0.15s ease-in-out;
  }

  &__link {
    display: block;

    &.is-submenu-item {
      margin-left: calc(
        sidebar.$sidebar-menu-item-icon-size +
          sidebar.$sidebar-menu-item-text-and-icon-gap
      );
    }

    &.is-action {
      width: 100%;
    }

    &.collapse-button {
      color: currentColor;

      .sidebar-item__icon {
        transform: rotate(-180deg);
      }

      &.is-collapsed .sidebar-item__icon {
        transform: rotate(0);
      }
    }

    &.logout-button {
      .sidebar-item__icon,
      .sidebar-item__text {
        color: colors.$danger;
      }
    }
  }

  &__tooltip {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: sidebar.$sidebar-menu-item-tooltip-font-size !important;
    font-weight: sidebar.$sidebar-menu-item-tooltip-font-weight !important;
    color: sidebar.$sidebar-menu-item-tooltip-text-color !important;
    border-color: transparent !important;
    background: sidebar.$sidebar-menu-item-tooltip-bg !important;
    // backdrop-filter: blur(100px);
    height: 32px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    &.logout-button {
      color: colors.$danger !important;
    }
  }
}
</style>
