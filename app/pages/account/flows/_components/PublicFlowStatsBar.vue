<template>
  <div class="public-flow-stats-bar">
    <div class="public-flow-stats-bar__left">
      <div
        class="public-flow-stats-bar__counter public-flow-stats-bar__counter--likes"
      >
        <heart-icon class="public-flow-stats-bar__svg-icon" /> {{ likes }}
      </div>
      <div class="public-flow-stats-bar__counter">
        <copy-icon class="public-flow-stats-bar__svg-icon" /> {{ copies }}
      </div>

      <div
        v-if="socialNetworks?.length"
        class="public-flow-stats-bar__socials">
        <social-badge
          v-for="sn in socialNetworks"
          :key="sn"
          :provider="sn" />
      </div>

      <flow-access-status
        v-if="accessible !== undefined"
        :accessible="accessible"
        class="public-flow-stats-bar__accessiable"
      />
    </div>

    <div class="public-flow-stats-bar__right">
      <button-ui
        :variant="isLiked ? 'outlined' : 'filled'"
        color="danger"
        @click="$emit('toggle-like')"
      >
        <heart-icon class="public-flow-stats-bar__btn-icon" />
        {{ isLiked ? 'Нравится' : 'Нравится' }}
      </button-ui>

      <button-ui
        :variant="isCopied ? 'outlined' : 'filled'"
        color="primary"
        @click="$emit('copy')"
      >
        <copy-icon class="public-flow-stats-bar__btn-icon" />
        Копировать
      </button-ui>
    </div>
  </div>
</template>

<script setup lang="ts">
import CopyIcon from '~/assets/images/icons/copy.svg';
import HeartIcon from '~/assets/images/icons/heart.svg';
import SocialBadge from '~/components/SocialBadge.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';

import FlowAccessStatus from './FlowAccessStatus.vue';

defineProps<{
  likes: number;
  copies: number;
  isLiked: boolean;
  isCopied: boolean;
  socialNetworks: SocialAccountProviderName[];
  accessible?: boolean;
}>();

defineEmits<{
  (e: 'toggle-like'): void;
  (e: 'copy'): void;
}>();
</script>

<style scoped lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as textMixins;

.public-flow-stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 0;

  &__left {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    color: colors.$text-light;
    font-size: 14px;
  }

  &__right {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  &__copied {
    color: colors.$success;
    font-size: 14px;
  }

  &__counter {
    @include textMixins.text-18;

    display: flex;
    align-items: center;
    gap: 4px;

    &--likes {
      color: colors.$danger;
    }
  }

  &__svg-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &__btn-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &__socials {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>
