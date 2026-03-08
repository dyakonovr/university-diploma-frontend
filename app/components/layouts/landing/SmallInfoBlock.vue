<template>
  <div class="sib">
    <p class="sib__text text-14">{{ $t('landing.smallInfoBlock.text') }}</p>
  </div>
</template>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.sib {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 14px 12px;
  background: linear-gradient(271.82deg, #667eea -3.15%, #764ba2 111.2%);

  &__text {
    color: colors.$white;
  }
}
</style>
