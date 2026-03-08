<template>
  <div class="flow-stats-inline">
    <div class="flow-stats-inline__counters">
      <span class="flow-stats-inline__counter">
        <heart-icon
          class="flow-stats-inline__icon flow-stats-inline__icon--heart"
        />
        {{ likes }}
      </span>

      <span class="flow-stats-inline__counter">
        <copy-icon class="flow-stats-inline__icon" />
        {{ copies }}
      </span>
    </div>

    <div
      v-if="showActions"
      class="flow-stats-inline__actions">
      <button-ui
        v-if="showLike"
        size="icon"
        :variant="isLiked ? 'filled' : 'outlined'"
        color="danger"
        @click.stop.prevent="$emit('toggle-like')"
      >
        <heart-icon class="flow-stats-inline__btn-icon" />
      </button-ui>

      <button-ui
        v-if="showCopy"
        size="icon"
        :variant="isCopied ? 'filled' : 'outlined'"
        color="primary"
        @click.stop.prevent="$emit('copy')"
      >
        <copy-icon class="flow-stats-inline__btn-icon" />
      </button-ui>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CopyIcon from '~/assets/images/icons/copy.svg';
import HeartIcon from '~/assets/images/icons/heart.svg';
import ButtonUi from '~/components/ui/ButtonUi.vue';

defineProps<{
  likes: number;
  copies: number;
  isLiked?: boolean;
  isCopied?: boolean;
  showLike?: boolean;
  showCopy?: boolean;
  showActions?: boolean;
}>();

defineEmits<{
  (e: 'toggle-like'): void;
  (e: 'copy'): void;
}>();
</script>

<style scoped lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as textMixins;

.flow-stats-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;

  &__counters {
    display: flex;
    gap: 12px;
    color: colors.$text-light;
  }

  &__counter {
    @include textMixins.text-14;

    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__actions {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  &__btn {
    border: 1px solid colors.$border;
    background: transparent;
    border-radius: 6px;
    padding: 2px 6px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      border-color: colors.$accent;
    }

    &--active {
      color: #ef4444;
      border-color: #ef4444;
    }
  }

  &__copied {
    color: colors.$success;
    font-size: 12px;
  }

  &__icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;

    &--heart {
      color: colors.$danger;
    }
  }

  &__btn-icon {
    width: 14px;
    height: 14px;
  }
}
</style>
