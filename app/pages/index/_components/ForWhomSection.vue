<template>
  <section
    id="forWhom"
    class="for-whom">
    <ul class="landing-container for-whom__container list-reset">
      <li class="for-whom__item for-whom__item--intro">
        <p class="headline-1 for-whom__item-title">
          {{ $t('landing.forWhom.title') }}
        </p>
        <p class="for-whom__item-descr">
          {{ $t('landing.forWhom.introDescription') }}
        </p>
      </li>

      <li
        v-for="(item, idx) in items"
        :key="rt(item.title)"
        class="for-whom__item"
      >
        <p
          class="headline-1 for-whom__item-title"
          v-html="rt(item.title)" />
        <div class="for-whom__item-content">
          <div
            class="for-whom__item-descr text-14"
            v-html="rt(item.description)"
          />

          <ul class="for-whom__item-list">
            <li
              v-for="listItem in item.list"
              :key="listItem"
              class="text-14"
              v-html="rt(listItem)"
            />
          </ul>

          <div
            v-if="icons[idx]"
            class="for-whom__item-icon-wrapper">
            <component
              :is="icons[idx]"
              class="for-whom__item-icon" />
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { ForWhomItem } from '~/shared/types/ui/landing.types';

const { tm, rt } = useI18n();

const items = computed(() => tm('landing.forWhom.items') as ForWhomItem[]);
const svgModules = import.meta.glob('/assets/images/landing/for-whom/*.svg', {
  eager: true,
  import: 'default',
});
const icons = computed(() => {
  return items.value.map((_, idx) => {
    const key = `/assets/images/landing/for-whom/${idx + 1}.svg`;
    return svgModules[key];
  });
});
</script>

<style lang="scss">
@use '/assets/styles/mixins/text' as textMixins;
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.for-whom {
  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  &__item {
    --descr-color: #{colors.$text-light};
    --border-color: #{colors.$border};
    --background-color: #{colors.$white};

    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 350px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background-color: var(--background-color);

    &--intro {
      border: none;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      min-height: unset;
      padding: 0;

      .for-whom__item {
        &-title {
          position: relative;
          text-align: center;

          &::before {
            content: '';
            position: absolute;
            display: block;
            width: calc(100% - 55px * 2 + 20px);
            height: 50px;
            border-radius: 12px;
            background-color: #818cf8bf;
            transform: rotate(3deg) translate(-10px);
            z-index: -1;

            @media screen and (max-width: 992px) {
              width: 100%;
              height: 80%;
            }
          }
        }

        &-descr {
          @media screen and (max-width: 992px) {
            display: none;
          }
        }
      }
    }

    &-title {
      padding: 45px 55px 0;

      @media screen and (max-width: 992px) {
        padding: 15px 10px 0;
      }
    }

    &-descr {
      @include textMixins.text-14;

      padding: 0 55px 20px;
      font-weight: 500;
      color: var(--descr-color);
      word-wrap: break-word;

      @media screen and (max-width: 992px) {
        padding: 0 15px 10px;
      }
    }

    &-list {
      padding: 0 55px 45px 75px;
      width: calc(100% - 175px);

      @media screen and (max-width: 768px) {
        width: 100%;
        padding: 0 15px 10px 35px;
      }
    }

    &-icon {
      margin: 44px 24px 24px 44px;

      &-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;

        width: 175px;
        height: 175px;
        background-color: colors.$primary;
        border-top-left-radius: 100px;
        border-bottom-right-radius: 12px;

        @media screen and (max-width: 768px) {
          display: none;
        }
      }
    }
  }
}

[data-theme='dark'] .for-whom {
  &__item {
    --descr-color: #{colors.$border};
    --border-color: #667eea;
    --background-color: #{colors.$dark-grey};
  }
}
</style>
