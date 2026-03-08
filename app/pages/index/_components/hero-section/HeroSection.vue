<template>
  <section
    id="hero"
    class="hero">
    <div class="hero__container landing-container">
      <div class="hero__main">
        <h1 class="hero__title">
          {{ $t('landing.hero.titlePart1') }}
          <span v-html="$t('landing.hero.titleHighlight')" />
          {{ $t('landing.hero.titlePart2') }}
        </h1>
        <h3 class="weight-500">{{ $t('landing.hero.subtitle') }}</h3>
        <div class="hero__footer">
          <div class="hero__buttons">
            <nuxt-link
              class="hero__button hero__button--main"
              to="/">{{
                $t('landing.hero.startFreeButton')
              }}</nuxt-link>
            <nuxt-link
              class="hero__button hero__button--yellow"
              to="/">{{
                $t('landing.hero.howItWorksButton')
              }}</nuxt-link>
          </div>
          <p class="hero__descr text-12 weight-500">
            {{ $t('landing.hero.trialPeriod') }}
          </p>
        </div>
      </div>

      <div class="hero__tabs">
        <hero-section-tabs />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import HeroSectionTabs from './HeroSectionTabs.vue';
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.hero {
  &__container {
    --lines-color: #818cf8bf;

    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    overflow: hidden;

    @media screen and (max-width: 1200px) {
      grid-template-columns: 1fr;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 55%;
      display: block;
      height: 50px;
      border-radius: 12px;
      background-color: var(--lines-color);
      z-index: -1;

      @media screen and (max-width: 1200px) {
        display: none;
      }
    }

    &::before {
      top: 30%;
      width: 600px;
      transform: rotate(-30deg) translate(-50%);

      @media screen and (max-width: 1200px) {
        top: 20%;
      }

      @media screen and (max-width: 576px) {
        top: 50%;
        width: 200px;
      }
    }

    &::after {
      top: 70%;
      width: 300px;
      transform: rotate(15deg) translate(-50%);

      @media screen and (max-width: 1200px) {
        top: 55%;
      }

      @media screen and (max-width: 576px) {
        top: 50%;
        width: 150px;
      }
    }
  }

  &__title {
    line-height: 55px;
    margin-bottom: 15px;

    @media screen and (max-width: 576px) {
      font-size: 36px;
      line-height: 48px;
    }

    span {
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 5px;
        display: block;
        width: calc(110%);
        height: 50px;
        border-radius: 12px;
        background-color: #818cf8bf;
        transform: rotate(-3deg) translate(-5%, 10px);
        z-index: -1;

        @media screen and (max-width: 576px) {
          height: 35px;
        }
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    width: fit-content;
    margin: 85px 0 0 auto;

    @media screen and (max-width: 1200px) {
      margin: 40px 0 0 0;
    }
  }

  &__buttons {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: offsets.$offset-24;
    width: fit-content;

    @media screen and (max-width: 576px) {
      gap: 12px;
    }
  }

  &__button {
    display: block;
    border: 2px solid;
    border-radius: 8px;
    padding: 20px;

    @media screen and (max-width: 576px) {
      padding: 16px 8px;
    }

    &--main {
      --border-color: currentColor;
      --background-color: transparent;
      --color: #{colors.$primary-dark};

      border-color: var(--border-color);
      color: var(--color);
      background-color: var(--background-color);
    }

    &--yellow {
      --border-color: currentColor;
      --background-color: #ffffffd3;
      --color: #{colors.$accent};

      border-color: var(--border-color);
      color: var(--color);
      background: var(--background-color);
    }
  }

  &__descr {
    --color: #{colors.$text-light};

    width: fit-content;
    margin-top: offsets.$offset-40;
    color: var(--color);
  }
}

[data-theme='dark'] .hero {
  &__container {
    --lines-color: #9fa7f8;
  }

  &__button {
    &--main {
      --border-color: #{colors.$primary-light};
      --background-color: #6873c8;
      --color: #{colors.$white};
    }

    &--yellow {
      --border-color: #{colors.$accent};
      --background-color: #{colors.$accent};
      --color: #{colors.$text};
    }
  }

  &__descr {
    --color: #{colors.$border};
  }
}
</style>
