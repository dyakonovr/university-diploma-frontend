<template>
  <client-only>
    <button
      v-if="size === 'default'"
      type="button"
      class="theme-button"
      @click="themeStore.toggleTheme"
    >
      <component
        :is="themeStore.theme === 'light' ? SunIcon : MoonIcon"
        class="theme-switcher__icon"
      />
    </button>

    <div
      v-else
      class="theme-switcher"
      :class="{ [themeStore.theme]: themeStore.theme }"
      @click="themeStore.toggleTheme"
    >
      <div class="theme-switcher__track">
        <span class="theme-switcher__text text-14 weight-500">
          {{ themeStore.theme === 'dark' ? 'dark' : 'light' }}
        </span>

        <div class="theme-switcher__thumb">
          <component
            :is="themeStore.theme === 'light' ? SunIcon : MoonIcon"
            class="theme-switcher__icon"
          />
        </div>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import MoonIcon from '~/assets/images/icons/moon.svg';
import SunIcon from '~/assets/images/icons/sun.svg';
import { useThemeStore } from '~/shared/stores/theme';

type Props = {
  size?: 'default' | 'large';
};

withDefaults(defineProps<Props>(), {
  size: 'default',
});

const themeStore = useThemeStore();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

$size-default: 18px;

.theme-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $size-default;
  height: $size-default;

  &__img {
    width: $size-default;
    height: $size-default;
    border-radius: 100%;
    color: colors.$white;
    object-fit: cover;
  }
}

.theme-switcher {
  display: flex;
  align-items: center;

  &.dark {
    .theme-switcher__track {
      background: colors.$primary-dark;
    }

    .theme-switcher__text {
      color: colors.$white;
      left: 8px; /* переезжает влево, слева от thumb */
    }

    /* thumb плавно едет в правый угол */
    .theme-switcher__thumb {
      left: calc(100% - 30px);
      background-color: colors.$white;
    }

    .theme-switcher__icon {
      color: colors.$primary-dark;
    }
  }

  &__track {
    position: relative;
    width: 76px;
    height: 32px;
    background: colors.$border;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.3s;
  }

  &__text {
    position: absolute;
    left: 34px; /* light: справа от thumb */
    top: 50%;
    color: colors.$primary;
    transform: translateY(-50%);
    text-transform: capitalize;
    user-select: none;
    transition:
      color 0.3s,
      left 0.3s ease;
  }

  &__thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 28px;
    height: 28px;
    background: colors.$primary;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.3s,
      left 0.3s ease;
  }

  &__icon {
    width: 20px;
    height: 20px;
    color: colors.$white;
  }
}
</style>
