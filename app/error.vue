<template>
  <nuxt-layout :name="'default'">
    <error-content
      :error="error"
      :variant="'account'"
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
</script>
