<template>
  <footer class="layout-footer">
    <div class="layout-footer__left">
      <p class="text-12 layout-footer__text layout-footer__text--upper">Связаться с нами</p>
      <!-- <p class="text-12 layout-footer__text layout-footer__text--upper layout-footer__text--hover">{{
        settingsStore.phoneNumber }}</p>
      <p class="text-12 layout-footer__text layout-footer__text--lower layout-footer__text--hover">{{
        settingsStore.contactEmail }}
      </p>
      <p class="text-12 layout-footer__text layout-footer__text--lower layout-footer__text--hover">{{
        settingsStore.phoneNumber }}</p> -->
    </div>
    <div class="layout-footer__right">
      <p class="text-10 layout-footer__base">Разработано</p>
      <p class="text-12 layout-footer__ai">Министреством здравоохранения РФ</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.layout-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: offsets.$offset-24;
  background-color: colors.$gray-900;
  padding: offsets.$offset-24;

  &__left {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: offsets.$offset-8 offsets.$offset-16;
  }

  &__text {
    width: fit-content;

    &--upper {
      color: colors.$gray-500;
    }

    &--lower {
      color: colors.$gray-400;
    }
  }

  &__base {
    color: colors.$gray-500;
  }

  &__ai {
    margin: offsets.$offset-4 0 0;
    color: colors.$gray-400;
  }
}
</style>