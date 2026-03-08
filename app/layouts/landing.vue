<template>
  <small-info-block />
  <landing-header />
  <main class="main">
    <slot v-if="$slots.default" />
    <nuxt-page v-else />
  </main>
  <landing-footer />
</template>

<script setup lang="ts">
import LandingFooter from '~/components/layouts/landing/footer/LandingFooter.vue';
import LandingHeader from '~/components/layouts/landing/header/LandingHeader.vue';
import SmallInfoBlock from '~/components/layouts/landing/SmallInfoBlock.vue';
import { useThemeStore } from '~/shared/stores/theme';

const themeStore = useThemeStore();

onBeforeMount(() => {
  themeStore.setInitialTheme();
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.landing {
  &-container {
    width: 100%;
    max-width: calc(1260px + offsets.$offset-16 * 2);
    margin: 0 auto;
    padding: 0 offsets.$offset-16;
  }

  &-title {
    text-align: center;
  }
}

[data-theme='dark'] .landing {
  &-title {
    color: colors.$border;
  }
}

.main {
  display: flex;
  flex-direction: column;
  gap: offsets.$offset-40;
  padding: offsets.$offset-24 0 offsets.$offset-40;
}
</style>
