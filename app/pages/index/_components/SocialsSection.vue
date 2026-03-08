<template>
  <section
    id="socials"
    class="socials">
    <div class="socials__container landing-container">
      <h2 class="socials__title headline-1 landing-title">
        {{ $t('landing.socials.title') }}
      </h2>
      <ul class="socials__list list-reset">
        <li
          v-for="(item, idx) in SOCIALS"
          :key="item"
          class="socials__item">
          <component
            :is="icons[idx]"
            v-if="icons[idx]" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
const SOCIALS = [
  'vk',
  'telegram',
  'dzen',
  'ok',
  'youtube',
  'instagram',
  'tiktok',
];

const svgModules = import.meta.glob('/assets/images/landing/socials/*.svg', {
  eager: true,
  import: 'default',
});
const icons = computed(() => {
  return SOCIALS.map((v) => {
    const key = `/assets/images/landing/socials/${v}.svg`;
    return svgModules[key];
  });
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.socials {
  padding: 30px 0;
  background: linear-gradient(271.82deg, #667eea -3.15%, #764ba2 111.2%);

  &__title {
    color: colors.$border;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    align-items: center;
    justify-items: center;
    gap: offsets.$offset-16;
    margin-top: 30px;
    color: colors.$border;

    @media screen and (max-width: 992px) {
      grid-template-columns: repeat(7, 1fr);
      gap: offsets.$offset-24;
    }

    @media screen and (max-width: 576px) {
      gap: 10px;
    }
  }

  &__item svg {
    width: 60px;
    height: 60px;

    @media screen and (max-width: 992px) {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
