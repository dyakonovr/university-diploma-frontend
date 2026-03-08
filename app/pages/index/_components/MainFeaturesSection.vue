<template>
  <section
    id="mainFeatures"
    class="main-features">
    <div class="landing-container main-features__container">
      <h2 class="headline-1 main-features__title landing-title">
        {{ t('landing.mainFeatures.title') }}
      </h2>

      <ul class="main-features__list list-reset">
        <li
          v-for="(item, idx) in items"
          :key="item.title"
          class="main-features__item"
        >
          <p
            class="main-features__item-title headline-3"
            v-html="rt(item.title)"
          />
          <p
            class="main-features__item-descr text-14"
            v-html="rt(item.description)"
          />
          <div class="main-features__item-footer">
            <img
              :src="`/images/landing/main-features/${idx + 1}.png`"
              class="main-features__item-icon"
            >

            <nuxt-link
              class="main-features__item-button text-14"
              :to="item.link"
            >
              {{ t('landing.mainFeatures.howItWorks') }}

              <span class="main-features__item-button-arrow">
                <arrow-right-circle-icon />
              </span>
            </nuxt-link>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import ArrowRightCircleIcon from '@/assets/images/icons/arrow-right-circle.svg';
import type { MainFeatureItem } from '~/shared/types/ui/landing.types';

const { tm, rt, t } = useI18n();

const items = computed<MainFeatureItem[]>(() => {
  return tm('landing.mainFeatures.items') as MainFeatureItem[];
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.main-features {
  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 24px;

    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  &__item {
    --background-color: #ebedef;

    position: relative;
    display: flex;
    flex-direction: column;
    gap: 18px;
    border-radius: 24px;
    padding: 30px 30px 30px 20px;
    background-color: var(--background-color);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 40%;
      display: block;
      width: 3px;
      height: 80%;
      transform: translateY(-40%);
      background-color: transparent;
      transition: background-color 0.15s ease;
    }

    &:hover {
      &::before {
        background-color: colors.$primary-light;
      }
    }

    &-descr {
      line-height: 24px;
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: auto;

      @media screen and (max-width: 768px) {
        flex-wrap: wrap;
      }
    }

    &-button {
      --border-color: #{colors.$border};
      --background-color: #{colors.$white};
      --text-color: #{colors.$text-light};
      --hover-arrow-background-color: #{colors.$primary-light};

      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 12px 15px;
      color: var(--text-color);
      background-color: var(--background-color);
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease;

      &:hover {
        --text-color: colors.$primary-light;

        .main-features__item-button-arrow {
          background-color: var(--hover-arrow-background-color);
        }
      }

      &-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 100%;
        background-color: colors.$text-light;
        transition: background-color 0.15s ease;
      }
    }
  }
}

[data-theme='dark'] .main-features {
  &__item {
    --background-color: #{colors.$dark-grey};

    &-button {
      --background-color: #{colors.$text};
      --text-color: #{colors.$border};

      &:hover {
        --background-color: #{colors.$primary-light};
        --border-color: #{colors.$text};
        --hover-arrow-background-color: #{colors.$text};
      }
    }
  }
}
</style>
