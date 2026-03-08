<template>
  <nuxt-layout :name="layoutName">
    <error-content
      :error="error"
      :variant="isAccountRoute ? 'account' : 'landing'"
    />
  </nuxt-layout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import ErrorContent from '~/components/errors/ErrorContent.vue';

type Props = {
  error: NuxtError;
};

defineProps<Props>();

const requestUrl = useRequestURL();
const isAccountRoute = requestUrl.pathname.startsWith('/account');
const layoutName = isAccountRoute ? 'account' : 'landing';
</script>
