<template>
  <input-ui
    v-model="formattedValue"
    :clearable="clearable"
    :label="label"
    :description="description"
    :error="error"
    :input-props="{ ...inputProps, type: 'text' }"
    :form-wrapper-class="formWrapperClass"
    :label-hint="labelHint"
    :autofocus="autofocus"
    :direction="direction"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
    @clear-button-click="normalValue = (resetToValue as number | null) ?? null"
    @keydown.up="incrementValue"
    @keydown.down="decrementValue"
  >
    <template
      v-if="$slots.preIcon"
      #postIcon
    ><slot name="postIcon"
    /></template>
    <template
      v-if="$slots.afterLabel"
      #afterLabel
    ><slot name="afterLabel"
    /></template>
  </input-ui>
</template>

<script setup lang="ts">
import { formatThousands } from '~/shared/utils/core/formatThousands';

import InputUi, { type InputUiProps } from './InputUi.vue';

type Props = InputUiProps & {
  formatNormalValue?: (value: number | null) => number | null;
  separator?: ',' | '.';
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  zeroPreview?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  formatNormalValue: (value: number | null) => value,
  separator: ',',
  clearable: true,
  required: false,
  step: 1,
  min: undefined,
  max: undefined,
});

const normalValue = defineModel<number | null>({
  required: true,
});
const formattedValue = ref<string | null>(
  normalValue.value !== null
    ? formatThousands(normalValue.value.toString())
    : null,
);

const emit = defineEmits<{
  (e: 'input' | 'blur', fv: string, nv: number | null): void;
}>();

const onInput = (value: string) => {
  let fValue = value ?? '';

  if (fValue === '') {
    normalValue.value = null;
    return;
  }

  // Заменяем все запятые на точки или наоборот
  // в зависимости от пропсов
  if (props.separator === ',') fValue = fValue.replace(/\./g, ',');
  else fValue = fValue.replace(/,/g, '.');

  // Удаляем все сепараторы, кроме первой
  const firstDotIndex = fValue.indexOf(props.separator);
  if (firstDotIndex !== -1) {
    fValue =
      fValue.substring(0, firstDotIndex + 1) +
      fValue
        .substring(firstDotIndex + 1)
        .replace(props.separator === '.' ? /\./g : /,/g, '');
  }

  const decimalParts = fValue.split(props.separator);
  if (
    decimalParts.length > 1 &&
    decimalParts[1] &&
    decimalParts[1].length > 2
  ) {
    // Если больше 2 знаков после запятой, обрезаем
    fValue = `${decimalParts[0]}.${decimalParts[1].slice(0, 2)}`;
  }

  let cleanedValue = fValue.replace(/\s/g, '').replace(/[^\d.,]/g, '');

  if (props.separator === ',') cleanedValue = cleanedValue.replace(/\./g, ',');
  else cleanedValue = cleanedValue.replace(/,/g, '.');

  if (cleanedValue[cleanedValue.length - 1] === props.separator) {
    normalValue.value = props.formatNormalValue(
      Number(cleanedValue.slice(0, -1)),
    );
    formattedValue.value = formatThousands(
      `${(normalValue.value ?? 0).toString()}${props.separator}`,
    );
    return;
  }

  const parsedNumber = Number(cleanedValue.replace(',', '.'));

  if (Number.isNaN(parsedNumber)) {
    formattedValue.value = '';
    normalValue.value = null;
    return;
  }

  normalValue.value = props.formatNormalValue(parsedNumber);

  if (cleanedValue.slice(-2) === `${props.separator}0`) {
    formattedValue.value = formatThousands(
      `${String(normalValue.value ?? 0)}${props.separator}0`,
    );
  } else {
    formattedValue.value = formatThousands(String(normalValue.value ?? 0));
  }

  emit('input', formattedValue.value, normalValue.value);
};

const onBlur = () => {
  if (formattedValue.value?.endsWith(props.separator)) {
    formattedValue.value = formattedValue.value.slice(0, -1);
  }

  if (!props.required) {
    // not required: пустое поле → ошибка, но normalValue НЕ трогаем
    if (!formattedValue.value || normalValue.value === null) {
      formattedValue.value = '';
      emit('blur', '', null);
      return;
    }
  }

  // required:
  // zeroPreview: null → показываем "0" (но normalValue остаётся null)
  else if (props.required && props.zeroPreview && normalValue.value === null) {
    formattedValue.value = '0';
    emit('blur', '0', null);
    return;
  }

  emit('blur', formattedValue.value ?? '', normalValue.value);
};

// helper: определяем максимальную точность среди чисел
const getPrecision = (...nums: Array<number | null | undefined>) => {
  let prec = 0;

  for (const n of nums) {
    if (n == null) continue;
    const s = String(n);
    if (s.includes('e-')) {
      const m = s.match(/e-(\d+)$/);
      if (m) prec = Math.max(prec, parseInt(m[1] ?? '', 10));
    } else if (s.includes('.')) {
      prec = Math.max(prec, s.split('.')[1]?.length ?? 0);
    }
  }
  return prec;
};

const clampValue = (value: number): number => {
  let result = value;
  // используем precision, основанную на step/min/max/current
  const precision = getPrecision(
    props.step,
    props.min ?? 0,
    props.max ?? 0,
    normalValue.value ?? 0,
  );
  if (props.min !== undefined) {
    result = Math.max(result, props.min);
  }
  if (props.max !== undefined) {
    result = Math.min(result, props.max);
  }
  // аккуратное округление к нужной точности
  return +result.toFixed(precision);
};

const incrementValue = (e: Event) => {
  e.preventDefault();
  const precision = getPrecision(
    props.step,
    normalValue.value ?? 0,
    props.min ?? 0,
    props.max ?? 0,
  );
  const factor = 10 ** precision;
  if (normalValue.value === null) {
    // можно заменить на props.min ?? 0 по предпочтению
    normalValue.value = props.min ?? 0;
  } else {
    const scaled =
      Math.round(normalValue.value * factor) + Math.round(props.step * factor);
    const newValue = clampValue(scaled / factor);
    if (newValue !== normalValue.value) {
      normalValue.value = newValue;
    }
  }
};

const decrementValue = (e: Event) => {
  e.preventDefault();
  const precision = getPrecision(
    props.step,
    normalValue.value ?? 0,
    props.min ?? 0,
    props.max ?? 0,
  );
  const factor = 10 ** precision;
  if (normalValue.value === null) {
    normalValue.value = props.min ?? 0;
  } else {
    const scaled =
      Math.round(normalValue.value * factor) - Math.round(props.step * factor);
    const newValue = clampValue(scaled / factor);
    if (newValue !== normalValue.value) {
      normalValue.value = newValue;
    }
  }
};

const onFocus = () => {
  // required: если было null → показывали пустое → оставляем как есть
  // zeroPreview: если показываем "0" при null → очистить превью
  if (props.zeroPreview && normalValue.value === null) {
    formattedValue.value = '';
  }

  if (normalValue.value === 0 && !props.zeroPreview) {
    normalValue.value = null;
    formattedValue.value = '';
  }
};

watch(
  normalValue,
  (newValue) => {
    if (newValue === null) {
      if (props.zeroPreview) formattedValue.value = '0';
      else formattedValue.value = '';
      return;
    }
    formattedValue.value = formatThousands(String(newValue));
  },
  { immediate: true },
);
</script>
