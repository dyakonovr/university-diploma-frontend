<template>
  <div>
    <nuxt-link
      :prefetch="false"
      :to="userType === USER_TYPE_PATIENT ? '/patient/home' : '/'"
      class="logo">
      <img
        src="/assets/images/icons/logo.svg?url"
        alt="Logo"
        class="logo">
      <div class="logo__texts">
        <p class="text-14 weight-500">Городская больница</p>
        <p class="text-10 logo__subtitle">Пункт управления</p>
      </div>
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { USER_TYPE_PATIENT } from '~/constants/user-type-values';

const userStore = useUserStore();
const userType = userStore.getUserType();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.logo {
  display: flex;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
  }

  &__texts {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0 0 0 10px;

    @media screen and (min-width: 1200px) {
      padding: 0 offsets.$offset-24 0 10px;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background-color: colors.$gray-300;
        display: block;
      }
    }
  }

  &__subtitle {
    color: colors.$gray-600;
  }
}
</style>
