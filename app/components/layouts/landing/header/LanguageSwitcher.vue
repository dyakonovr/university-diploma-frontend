<template>
  <div
    ref="root"
    class="language-switcher"
    :class="{ [size]: size }"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <button
      type="button"
      class="language-switcher__button"
      @click="onButtonClick"
    >
      <img
        :src="`/images/langs/${locale}.svg`"
        :alt="`${locale} Language icon`"
        class="language-switcher__button-img"
      >
    </button>

    <transition name="fade">
      <div
        v-show="isOpen"
        class="language-switcher__menu">
        <div class="language-switcher__item language-switcher__item--active">
          {{ locale }}
          <img
            :src="`/images/langs/${locale}.svg`"
            :alt="`${locale} Language icon`"
            class="language-switcher__item-img"
          >
        </div>

        <button
          v-for="l in otherLocales"
          :key="l.code"
          type="button"
          class="language-switcher__item"
          @click="changeLang(l.code)"
        >
          {{ l.code }}
          <img
            :src="`/images/langs/${l.code}.svg`"
            :alt="`${l.code} Language icon`"
            class="language-switcher__item-img"
          >
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
type Props = {
  size?: 'default' | 'large';
};

withDefaults(defineProps<Props>(), {
  size: 'default',
});

const { locale, locales, setLocale } = useI18n();

const otherLocales = computed(() =>
  locales.value.filter((l) => l.code !== locale.value),
);

const isOpen = ref(false);
const root = ref<HTMLElement | null>(null);

// определяем touch-устройства
const isTouch = window?.matchMedia('(pointer: coarse)')?.matches;

const onPointerEnter = () => {
  if (!isTouch) {
    isOpen.value = true;
  }
};

const onPointerLeave = () => {
  if (!isTouch) {
    isOpen.value = false;
  }
};

const onButtonClick = () => {
  if (isTouch) {
    isOpen.value = !isOpen.value;
  }
};

const changeLang = (code: string) => {
  setLocale(code as typeof locale.value);
  isOpen.value = false;
};

const onClickOutside = (e: Event) => {
  if (root.value && !root.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.language-switcher {
  --size-default: 18px;
  --size-large: 32px;
  --current-size: var(--size-default);

  position: relative;

  &.large {
    --current-size: var(--size-large);
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--current-size);
    height: var(--current-size);
    border: 1px solid colors.$primary;
    border-radius: 100%;
    user-select: none;

    &-img {
      width: var(--current-size);
      height: var(--current-size);
      border-radius: 100%;
      object-fit: cover;
      background-position: center;
    }
  }

  &__wrapper {
    width: var(--current-size);
    height: var(--current-size);
  }

  &__menu {
    --border-width: 1px;
    --padding: 5px;

    position: absolute;
    top: calc((var(--border-width) + var(--padding)) * -1);
    left: calc(
      -100% - var(--border-width) - var(--padding) - var(--current-size) + 2px
    );

    display: flex;
    flex-direction: column;
    gap: 4px;
    border: var(--border-width) solid colors.$border;
    border-radius: 9px;
    padding: var(--padding);
    background: colors.$primary-light;
    box-shadow: 0px 4px 4px 0px #00000040;

    @media screen and (max-width: 1200px) {
      top: auto;
      bottom: calc(0% - var(--border-width) - var(--padding));
      left: calc(-100% - var(--border-width) - var(--padding) - 2.5px);
      flex-direction: column-reverse;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: colors.$border;
    text-transform: capitalize;
    user-select: none;

    &--active {
      color: colors.$primary-dark;
    }

    &-img {
      width: var(--current-size);
      height: var(--current-size);
      border-radius: 100%;
      object-fit: cover;
      background-position: center;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
