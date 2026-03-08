<template>
  <div
    v-if="account"
    class="schedule-account-badge">
    <span class="schedule-account-badge__name">{{ account.account_name }}</span>
    <social-badge :provider="account.provider" />
  </div>
  <span v-else>{{ accountId }}</span>
</template>

<script lang="ts" setup>
import SocialBadge from '~/components/SocialBadge.vue';
import type { SocialAccount } from '~/domain/social-account/models/social-account.types';

type Props = {
  accounts: SocialAccount[] | null;
  accountId: string;
};

const props = defineProps<Props>();

const account = computed(
  () => props.accounts?.find((a) => a.id === props.accountId) ?? null,
);
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.schedule-account-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;

  &__name {
    font-size: 13px;
    font-weight: 500;
    color: colors.$text;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
