<template>
  <div class="auth-page">
    <div class="auth-page__container">
      <div class="auth-page__card">
        <nuxt-page />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/mixins/text' as textMixins;

.auth-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: offsets.$offset-24;
  background: linear-gradient(135deg, colors.$background 0%, #eef2ff 100%);
  overflow: hidden;

  // фоновое primary-пятно
  &::before {
    content: '';
    position: absolute;
    top: -200px;
    right: -200px;
    width: 500px;
    height: 500px;
    background: radial-gradient(
      circle,
      rgba(colors.$primary, 0.25) 0%,
      rgba(colors.$primary, 0.08) 40%,
      transparent 70%
    );
    filter: blur(60px);
    z-index: 0;
  }

  // фоновое accent-пятно
  &::after {
    content: '';
    position: absolute;
    bottom: -250px;
    left: -200px;
    width: 500px;
    height: 500px;
    background: radial-gradient(
      circle,
      rgba(colors.$accent, 0.2) 0%,
      rgba(colors.$accent, 0.06) 40%,
      transparent 70%
    );
    filter: blur(70px);
    z-index: 0;
  }

  .form-wrapper.with-label.row {
    grid-template-columns: 3fr 7fr;
  }

  &__container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 500px;
  }

  &__card {
    background: colors.$white;
    border: 1px solid colors.$border;
    border-radius: 12px;
    padding: offsets.$offset-40;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
  }

  &__header {
    margin-bottom: offsets.$offset-24;
    padding-bottom: offsets.$offset-16;
    border-bottom: 1px solid colors.$border;
    text-align: center;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    color: colors.$text;
    margin: 0;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-16;
  }

  &__submit {
    align-self: center;
    width: 100% !important;
    max-width: unset;
    margin-top: offsets.$offset-8;
  }

  &__footer {
    margin-top: offsets.$offset-24;
    padding-top: offsets.$offset-16;
    border-top: 1px solid colors.$border;
    text-align: center;
    font-size: 14px;
    color: colors.$text-light;
  }

  &__links {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  &__link {
    @include textMixins.text-14;

    color: colors.$primary-light;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: offsets.$offset-16;

    &__card {
      padding: offsets.$offset-24;
    }
  }
}
</style>
