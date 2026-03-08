<template>
  <section
    id="tools"
    class="tools">
    <div class="tools__container landing-container">
      <ul class="tools__list list-reset">
        <li
          v-for="(item, idx) in items"
          :key="rt(item.title)"
          class="tools__item"
        >
          <div class="tools__item-main">
            <p
              class="tools__item-main-title headline-1"
              v-html="rt(item.title)"
            />

            <p
              class="tools__item-main-descr text-18"
              v-html="rt(item.description)"
            />

            <tools-section-item-features-list
              :features="item.features"
              class="tools__item-features-list tools__item-features-list--mobile"
            />

            <div class="tools__item-main-footer">
              <nuxt-link class="tools__item-main-link text-14">{{
                t('landing.tools.checkLink')
              }}</nuxt-link>
              <component
                :is="icons[idx]"
                v-if="icons[idx]"
                class="tools__item-main-icon"
              />
            </div>
          </div>

          <div class="tools__item-features">
            <p
              class="tools__item-features-title headline-1"
              v-html="rt(item.featuresTitle)"
            />

            <tools-section-item-features-list
              :features="item.features"
              class="tools__item-features-list tools__item-features-list--desktop"
            />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { ToolItem } from '~/shared/types/ui/landing.types';

import ToolsSectionItemFeaturesList from './ToolsSectionItemFeaturesList.vue';

const { t, tm, rt } = useI18n();

const items = computed<ToolItem[]>(() => {
  return tm('landing.tools.items') as ToolItem[];
});

const svgModules = import.meta.glob('/assets/images/landing/tools/*.svg', {
  eager: true,
  import: 'default',
});
const icons = computed(() => {
  return items.value.map((_, idx) => {
    const key = `/assets/images/landing/tools/${idx + 1}.svg`;
    return svgModules[key];
  });
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.tools {
  &__list {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-40;

    @media screen and (max-width: 576px) {
      gap: offsets.$offset-24;
    }
  }

  &__item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: offsets.$offset-40;
    min-height: 350px;

    @media screen and (max-width: 992px) {
      grid-template-columns: 1fr;
    }

    &:nth-child(even) {
      .tools__item-features {
        order: -1;
      }
    }

    &-main {
      --border-color: #{colors.$border};

      display: flex;
      flex-direction: column;
      gap: 4px;
      border-radius: 24px;
      border: 1px solid var(--border-color);
      padding: offsets.$offset-24;
      background: linear-gradient(299.83deg, #667eea 14.15%, #764ba2 85.85%);

      @media screen and (max-width: 992px) {
        gap: 20px;
      }

      &-title {
        color: colors.$white;
      }

      &-descr {
        color: colors.$white;
      }

      &-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: offsets.$offset-8;
        margin-top: auto;
      }

      &-link {
        display: block;
        width: fit-content;
        border: 2px solid colors.$white;
        border-radius: 8px;
        padding: 14px 10px;
        color: colors.$white;
        transition:
          background-color 0.2s ease,
          color 0.2s ease;

        &:hover {
          color: colors.$primary;
          background-color: colors.$white;
        }

        @media screen and (max-width: 576px) {
          width: 100%;
          text-align: center;
        }
      }

      &-icon {
        @media screen and (max-width: 576px) {
          display: none;
        }
      }
    }

    &-features {
      margin-top: 28px;

      @media screen and (max-width: 992px) {
        display: none;
      }

      &-list {
        @media screen and (min-width: 992px) {
          &--desktop {
            display: flex;
          }

          &--mobile {
            display: none !important;
          }
        }

        @media screen and (max-width: 992px) {
          &--desktop {
            display: none;
          }

          &--mobile {
            display: flex;
          }
        }
      }
    }
  }
}

[data-theme='dark'] .tools {
  &__item {
    &-main {
      --border-color: #{colors.$primary-dark};
    }
  }
}
</style>
