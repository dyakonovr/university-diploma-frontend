<template>
  <div class="post-form-block">
    <div class="post-form-block__header">
      <div class="post-form-block__title">
        <h4>Блок {{ index + 1 }}</h4>
        <span class="post__block-id">ID: {{ block.id }}</span>
      </div>
      <post-block-status-tag :status="block.status" />
    </div>

    <div class="post-form-block__content">
      <div class="post-form-block__row">
        <span class="post-form-block__label">Stage ID:</span>
        <span class="post-form-block__value">{{ block.stage_id }}</span>
      </div>

      <div
        v-if="block.step_tokens?.length"
        class="post-form-block__row">
        <span class="post-form-block__label">Токены:</span>
        <ul class="post-form-block__tokens-list list-reset">
          <li
            v-for="(entry, idx) in block.step_tokens"
            :key="entry.step_id"
            class="post-form-block__value"
          >
            Шаг {{ idx + 1 }}: {{ entry.tokens_used }}
            {{ pluralizeRu(entry.tokens_used, 'токен', 'токена', 'токенов') }}
          </li>
        </ul>
      </div>

      <template v-if="block.status === 'completed'">
        <div
          v-if="!artifacts?.length"
          class="post-form-block__actions">
          <button-ui
            variant="outlined"
            color="accent"
            @click="fetchArtifacts()"
          >
            Получить артефакты блока
          </button-ui>
        </div>

        <!-- Отображение артефактов -->
        <div
          v-else
          class="post-form-block__artifacts">
          <h5 class="post-form-block__artifacts-title">Артефакты</h5>
          <div class="post-form-block__artifacts-list">
            <post-form-block-artifact
              v-for="artifact in artifacts"
              :key="artifact.id"
              :artifact="artifact"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import ButtonUi from '~/components/ui/ButtonUi.vue';
import type { RawPostBlock } from '~/domain/raw-post/models/raw-post.types';
import { pluralizeRu } from '~/shared/utils/pluralizeRu';

import { useRawPostStore } from '../../_stores/raw-post-form';
import PostBlockStatusTag from './RawPostBlockStatusTag.vue';
import PostFormBlockArtifact from './RawPostFormBlockArtifact.vue';

type Props = {
  block: RawPostBlock;
  index: number;
};

const props = defineProps<Props>();
const postStore = useRawPostStore();

const artifacts = computed(() => postStore.getArtifactsByBlock(props.block.id));

const fetchArtifacts = () => {
  postStore.fetchBlockArtifactsList(props.block.id);
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.post-form-block {
  position: relative;
  border: 1px solid colors.$border;
  border-radius: 12px;
  padding: 20px;
  background: colors.$white;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(colors.$border, 0.5);
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 4px;

    h4 {
      font-size: 16px;
      font-weight: 600;
      color: colors.$text;
      margin: 0;
    }
  }

  &__block-id {
    font-size: 12px;
    color: colors.$text-light;
    font-family: monospace;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  &__label {
    font-size: 13px;
    color: colors.$text-light;
  }

  &__value {
    font-size: 14px;
    font-weight: 500;
    color: colors.$text;
    font-family: monospace;
  }

  &__tokens-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__actions {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &__artifacts {
    margin-top: 12px;
    border-top: 1px solid colors.$border;
    padding-top: 16px;
  }

  &__artifacts-title {
    font-size: 16px;
    font-weight: 600;
    color: colors.$text;
    margin-bottom: 16px;
  }

  &__artifacts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
