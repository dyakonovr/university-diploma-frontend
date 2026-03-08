<template>
  <div
    v-if="hasOutputParams"
    class="step-output-params">
    <p class="step-output-params__title text-14">Выходные данные шага.</p>
    <p class="step-output-params__subtitle text-14">
      Название, тип и количество артефактов, которые модель создаст на этом шаге. Эти
      результаты могут быть использованы в следующих шагах (или этапах, если шаг последний).
    </p>

    <ul class="step-output-params__list list-reset">
      <li
        v-for="item in formattedOutputParams"
        :key="item.name"
        class="step-output-params__item"
      >
        <span
          class="step-output-params__label"
          v-html="item.label" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import type {
  ModelOutputParamCosts,
  ModelOutputParamCounts,
  ModelOutputParams,
  ModelOutputParamTypes,
} from '~/domain/model/models/model.types';
import { pluralizeRu } from '~/shared/utils/pluralizeRu';

type Props = {
  outputParams?: ModelOutputParams | null;
  outputParamTypes?: ModelOutputParamTypes | null;
  outputParamCounts?: ModelOutputParamCounts | null;
  outputParamCosts?: ModelOutputParamCosts | null;
};

const props = defineProps<Props>();

const TYPE_ADJECTIVES: Record<string, [one: string, other: string]> = {
  Text: ['текстовый', 'текстовых'],
  Photo: ['фото', 'фото'],
  Video: ['видео', 'видео'],
  Audio: ['аудио', 'аудио'],
};

const hasOutputParams = computed(
  () => !!props.outputParams && props.outputParams.length > 0,
);

const formattedOutputParams = computed(() => {
  if (!props.outputParams) return [];

  return props.outputParams.map((name) => {
    const type = props.outputParamTypes?.[name] ?? 'Text';
    const count = props.outputParamCounts?.[name] ?? 1;
    const cost = props.outputParamCosts?.[name];

    const [adjOne, adjOther] = TYPE_ADJECTIVES[type] ?? ['', ''];
    const adjective = pluralizeRu(count, adjOne, adjOther, adjOther);
    const artifact = pluralizeRu(count, 'артефакт', 'артефакта', 'артефактов');

    const parts = [
      `Название выходного параметра: <i>${name}</i>`,
      `${count} ${adjective} ${artifact}`,
    ];

    if (type !== 'Text' && cost != null) {
      parts.push(`${cost} ${pluralizeRu(cost, 'токен', 'токена', 'токенов')}`);
    }

    return {
      name,
      label: parts.join(' - '),
    };
  });
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.step-output-params {
  margin-top: 8px;
  padding: 12px 14px;
  border-radius: 10px;
  background: colors.$background;
  border: 1px dashed colors.$border;

  &__title {
    margin-bottom: 3px;
    color: colors.$text;
    font-weight: 500;
  }

  &__subtitle {
    margin-bottom: 8px;
    color: colors.$text-light;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: colors.$white;
    border: 1px solid colors.$border;
    border-radius: 8px;
    padding: 6px 10px;
  }

  &__label {
    font-size: 14px;
    color: colors.$text;
  }
}
</style>
