<template>
  <section
    id="tariff"
    class="tariff">
    <div class="tariff__container landing-container">
      <h2 class="tariff__title landing-title headline-1">
        {{ t('landing.tariff.title') }}
      </h2>
      <ul class="tariff__list list-reset">
        <li
          v-for="(plan, index) in items"
          :key="rt(plan.name)"
          class="tariff__item"
          :class="{ 'tariff__item--focus': index === FOCUSED_PLAN_INDEX }"
        >
          <p class="tariff__item-name">{{ rt(plan.name) }}</p>
          <div class="tariff__item-price">
            <p class="tariff__item-price-value headline-1">
              {{ rt(plan.price.toString()) }}$
            </p>
            <p class="tariff__item-price-period text-14">
              /{{ rt(plan.period) }}
            </p>
          </div>

          <ul class="tariff__item-features list-reset">
            <li
              v-for="feature in plan.features"
              :key="feature.text"
              class="tariff__item-feature text-14"
            >
              <span class="tariff__item-feature-icon">
                <check-icon v-if="rt(feature.included) === 'true'" />
                <x-icon
                  v-else
                  class="tariff__item-feature-icon--x" />
              </span>
              {{ rt(feature.text) }}
            </li>
          </ul>

          <nuxt-link class="tariff__item-button">{{
            t('landing.tariff.buttonText')
          }}</nuxt-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import CheckIcon from '@/assets/images/icons/check.svg';
import XIcon from '@/assets/images/icons/x.svg';
import type { TariffPlan } from '~/shared/types/ui/landing.types';

const { t, tm, rt } = useI18n();

const items = computed<TariffPlan[]>(() => {
  return tm('landing.tariff.plans') as TariffPlan[];
});

const FOCUSED_PLAN_INDEX = 2;
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.tariff {
  &__list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: offsets.$offset-24;
    margin-top: offsets.$offset-40;

    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 576px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  &__item {
    --features-border-color: #{colors.$border};
    --background-color: #{colors.$white};
    --color: #{colors.$text-light};

    display: flex;
    flex-direction: column;
    gap: offsets.$offset-24;
    border: 1px solid colors.$border;
    border-radius: 12px;
    padding: 20px;
    color: var(--color);
    background-color: var(--background-color);

    &--focus {
      box-shadow: 0px 0px 10px 0px #6366f140;
      border-color: colors.$primary;
    }

    &-name {
      font-size: 24px;
      font-weight: 600;
      text-align: center;
    }

    &-price {
      --price-text-color: #{colors.$primary};

      display: flex;
      align-self: center;

      &-value {
        color: var(--price-text-color);
      }

      &-period {
        align-self: flex-end;
      }
    }

    &-features {
      display: flex;
      flex-direction: column;
      gap: 9px;
      border-top: 1px solid var(--features-border-color);
      border-bottom: 1px solid var(--features-border-color);
      padding: offsets.$offset-24 0;
    }

    &-feature {
      display: flex;
      align-items: center;
      gap: 10px;

      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;

        &--x {
          color: colors.$danger;
        }
      }
    }

    &-button {
      --color: #{colors.$primary-dark};
      --border-color: #{colors.$primary-dark};
      --background-color: transparent;

      display: block;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      margin-top: auto;
      padding: 10px;
      font-weight: 500;
      text-align: center;
      color: var(--color);
      background-color: var(--background-color);
      transition:
        background-color 0.2s ease,
        color 0.2s ease;

      &:hover {
        --color: #{colors.$white};
        --background-color: #{colors.$primary-dark};
      }
    }
  }
}

[data-theme='dark'] .tariff {
  &__item {
    --background-color: transparent;
    --color: #{colors.$border};
    --border-color: #{colors.$border};

    &-price {
      --price-text-color: #{colors.$primary-light};
    }

    &-button {
      --color: #{colors.$primary-light};

      &:hover {
        --color: #{colors.$white};
        --background-color: #{colors.$primary};
      }
    }
  }
}
</style>
