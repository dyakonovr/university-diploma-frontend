<template>
  <input-ui
    v-model="formattedValue"
    @input="onInput"
    @blur="onBlur" />
</template>

<script setup lang="ts">
import InputUi from './InputUi.vue';
import { formatThousands } from '~/utils/format-thousands';

type Props = {
  formatNormalValue?: (value: number | null) => number | null;
};

const normalValue = defineModel<number | null>({
  required: true
});
const formattedValue = ref<string>('');

const props = withDefaults(defineProps<Props>(), {
  formatNormalValue: (value: number | null) => value
});

const emit = defineEmits<{
  (e: 'input' | 'blur', fv: string, nv: number | null): void;
}>();

const onInput = (value: string) => {
  let fValue = value;

  if (fValue === '') {
    normalValue.value = null;
    return;
  }

  // Заменяем все запятые на точки
  fValue = fValue.replace(/,/g, '.');

  // Удаляем все точки, кроме первой
  const firstDotIndex = fValue.indexOf('.');
  if (firstDotIndex !== -1) {
    fValue = fValue.substring(0, firstDotIndex + 1) + 
             fValue.substring(firstDotIndex + 1).replace(/\./g, '');
  }

  const decimalParts = fValue.split('.');
  if (decimalParts.length > 1 && decimalParts[1].length > 2) {
    // Если больше 2 знаков после запятой, обрезаем
    fValue = `${decimalParts[0]}.${decimalParts[1].slice(0, 2)}`;
  }

  const cleanedValue = fValue
    .replace(/,/g, '.')
    .replace(/\s/g, '')
    .replace(/[^\d.]/g, '');

  if (cleanedValue[cleanedValue.length - 1] === '.') {
    normalValue.value = props.formatNormalValue(Number(cleanedValue.slice(0, -1)));
    formattedValue.value = formatThousands(`${(normalValue.value ?? 0).toString()}.`);
    return;
  }

  const parsedNumber = Number(cleanedValue);

  if (Number.isNaN(parsedNumber)) {
    formattedValue.value = '';
    normalValue.value = null;
    return;
  }

  normalValue.value = props.formatNormalValue(parsedNumber);

  if (cleanedValue.slice(-2) === '.0') {
    formattedValue.value = formatThousands(`${String(normalValue.value ?? 0)}.0`);
  } else {
    formattedValue.value = formatThousands(String(normalValue.value ?? 0));
  }

  emit('input', formattedValue.value, normalValue.value);
};


const onBlur = () => {
  if (formattedValue.value[formattedValue.value.length - 1] === '.') {
    formattedValue.value = formattedValue.value.slice(0, -1);
  }

  emit('blur', formattedValue.value, normalValue.value);
};

watch(() => normalValue.value, (newValue, oldValue) => {
  if (newValue === oldValue) return;

  if (newValue !== null) {
    formattedValue.value = formatThousands(String(newValue));
  } else {
    formattedValue.value = '';
  }
});
</script>