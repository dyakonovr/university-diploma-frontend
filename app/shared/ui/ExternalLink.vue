<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="external-link"
    @click.stop
  >
    <slot>{{ label }}</slot>
    <external-link-icon class="external-link__icon" />
  </a>
</template>

<script setup lang="ts">
import ExternalLinkIcon from '~/assets/images/icons/external-link.svg';

type Props = {
  href: string;
  label?: string;
};

withDefaults(defineProps<Props>(), {
  label: 'Открыть',
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.external-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: colors.$primary;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }

  &__icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
}
</style>
