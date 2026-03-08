<template>
  <form-container class="divided">
    <template #header>
      <p class="form-container__title">Выходные параметры</p>
      <p class="form-container__description">
        Параметры получены при синхронизации с моделью. Укажите тип каждого
        параметра. Для нетекстовых параметров обязательно укажите стоимость в
        токенах — она будет списываться за каждый сгенерированный артефакт.
        Укажите ожидаемое количество артефактов для валидации результатов
        генерации.
      </p>
    </template>

    <div class="form-container-padding">
      <div
        v-if="!outputParams || outputParams.length === 0"
        class="output-params-editor__empty"
      >
        Выходные параметры не получены от модели
      </div>

      <template v-else>
        <div class="output-params-editor__list">
          <param-card
            v-for="paramName in outputParams"
            :key="paramName"
            :title="paramName"
          >
            <select-ui
              :model-value="innerTypes[paramName] ?? null"
              :options="typeOptions"
              label="Тип"
              placeholder="Выберите тип"
              :clearable="false"
              :searchable="false"
              :error="displayTypeErrors[paramName]"
              @update:model-value="setType(paramName, $event as string | null)"
            />

            <number-input-ui
              v-if="showCostInput(paramName)"
              :model-value="innerCosts[paramName] ?? null"
              label="Стоимость (токены)"
              :required="true"
              :min="1"
              :step="1"
              :error="displayCostErrors[paramName]"
              :input-props="{ placeholder: 'Количество токенов' }"
              @update:model-value="innerCosts[paramName] = $event"
            />

            <number-input-ui
              :model-value="innerCounts[paramName] ?? null"
              label="Кол-во артефактов"
              :required="true"
              :min="1"
              :max="1000"
              :step="1"
              :error="displayCountErrors[paramName]"
              :input-props="{ placeholder: 'Ожидаемое количество' }"
              @update:model-value="innerCounts[paramName] = $event"
            />

            <template #footer>
              <button-ui
                :loading="loading"
                @click="save">
                Сохранить
              </button-ui>
            </template>
          </param-card>
        </div>
      </template>
    </div>
  </form-container>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import NumberInputUi from '~/components/ui/form/NumberInputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import { updateOutputParamCosts } from '~/domain/model/api/models.api';
import type {
  ModelOutputParamCosts,
  ModelOutputParamCounts,
  ModelOutputParams,
  ModelOutputParamTypes,
} from '~/domain/model/models/model.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import ParamCard from './ParamCard.vue';

const availableTypes = ['Text', 'Photo', 'Video', 'Audio'] as const;
const typeOptions = availableTypes.map((t) => ({ label: t, value: t }));

const props = defineProps<{
  modelId: EntityId;
  outputParams: ModelOutputParams | null;
  outputParamCosts: ModelOutputParamCosts | null;
  outputParamTypes: ModelOutputParamTypes | null;
  outputParamCounts: ModelOutputParamCounts | null;
}>();

const emit = defineEmits<{
  (e: 'updated'): void;
}>();

const { toastSuccess, toastError } = useCustomToast();
const loading = ref(false);

/** Флаг первой попытки сохранения — ошибки валидации показываются только после нажатия «Сохранить» */
const submitted = ref(false);

const innerTypes = ref<Record<string, string>>({});
const innerCosts = ref<Record<string, number | null>>({});
const innerCounts = ref<Record<string, number | null>>({});

/**
 * Показывать ли поле стоимости: только для не-Text типов.
 *
 * @example
 * showCostInput('image_output') // true, если тип — Photo/Video/Audio
 */
const showCostInput = (paramName: string): boolean => {
  const type = innerTypes.value[paramName];
  return !!type && type !== 'Text';
};

// ─── Validation ──────────────────────────────────────────

/**
 * Создаёт Record ошибок валидации для каждого параметра.
 *
 * @example
 * buildParamErrors(params, (name) => !values[name])
 * // => { paramA: 'Обязательное поле', paramB: null }
 */
const buildParamErrors = (
  hasError: (paramName: string) => boolean,
): Record<string, string | null> => {
  const errors: Record<string, string | null> = {};
  for (const name of props.outputParams ?? []) {
    errors[name] = hasError(name) ? 'Обязательное поле' : null;
  }
  return errors;
};

const typeErrors = computed(() =>
  buildParamErrors((name) => !innerTypes.value[name]),
);

const costErrors = computed(() =>
  buildParamErrors((name) => showCostInput(name) && !innerCosts.value[name]),
);

const countErrors = computed(() =>
  buildParamErrors((name) => !innerCounts.value[name]),
);

/** Ошибки типов, видимые пользователю (только после submitted) */
const displayTypeErrors = computed(() =>
  submitted.value ? typeErrors.value : {},
);

/** Ошибки стоимости, видимые пользователю (только после submitted) */
const displayCostErrors = computed(() =>
  submitted.value ? costErrors.value : {},
);

/** Ошибки количества, видимые пользователю (только после submitted) */
const displayCountErrors = computed(() =>
  submitted.value ? countErrors.value : {},
);

const hasErrors = computed(() =>
  [typeErrors, costErrors, countErrors].some((errors) =>
    Object.values(errors.value).some((e) => e !== null),
  ),
);

// ─── Actions ─────────────────────────────────────────────

/**
 * Устанавливает тип выходного параметра.
 * При смене на Text или сбросе — обнуляет стоимость.
 */
const setType = (paramName: string, type: string | null) => {
  if (type) {
    innerTypes.value = { ...innerTypes.value, [paramName]: type };
  } else {
    innerTypes.value = Object.fromEntries(
      Object.entries(innerTypes.value).filter(([key]) => key !== paramName),
    );
  }

  if (!type || type === 'Text') {
    innerCosts.value = { ...innerCosts.value, [paramName]: null };
  }
};

/**
 * Собирает из Record только положительные числовые значения.
 *
 * @example
 * collectPositive({ a: 5, b: null, c: 0 })
 * // => { a: 5 }
 */
const collectPositive = (
  source: Record<string, number | null>,
): Record<string, number> =>
  Object.fromEntries(
    Object.entries(source).filter(
      (e): e is [string, number] => e[1] != null && e[1] > 0,
    ),
  );

/**
 * Собирает из Record только непустые строковые значения.
 *
 * @example
 * collectNonEmpty({ a: 'Text', b: '' })
 * // => { a: 'Text' }
 */
const collectNonEmpty = (
  source: Record<string, string>,
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(source).filter((e): e is [string, string] => !!e[1]),
  );

/**
 * Валидирует форму и отправляет все выходные параметры одним запросом.
 * Ошибки валидации показываются только после первого вызова save.
 */
const save = async () => {
  submitted.value = true;

  if (hasErrors.value) {
    toastError('Заполните обязательные поля');
    return;
  }

  try {
    loading.value = true;

    await updateOutputParamCosts(props.modelId, {
      output_param_costs: collectPositive(innerCosts.value),
      output_param_types: collectNonEmpty(innerTypes.value),
      output_param_counts: collectPositive(innerCounts.value),
    });

    toastSuccess('Параметры успешно сохранены');
    submitted.value = false;
    emit('updated');
  } catch {
    toastError('Ошибка при сохранении параметров');
  } finally {
    loading.value = false;
  }
};

// ─── Props sync ──────────────────────────────────────────

/** Синхронизирует props в локальное реактивное состояние */
const syncFromProps = () => {
  const params = props.outputParams;

  if (!params) {
    innerTypes.value = {};
    innerCosts.value = {};
    innerCounts.value = {};
    return;
  }

  const types: Record<string, string> = {};
  const costs: Record<string, number | null> = {};
  const counts: Record<string, number | null> = {};

  for (const name of params) {
    const type = props.outputParamTypes?.[name];
    if (type) types[name] = type;
    costs[name] = props.outputParamCosts?.[name] ?? null;
    counts[name] = props.outputParamCounts?.[name] ?? null;
  }

  innerTypes.value = types;
  innerCosts.value = costs;
  innerCounts.value = counts;
};

watch(
  () => [
    props.outputParams,
    props.outputParamCosts,
    props.outputParamTypes,
    props.outputParamCounts,
  ],
  syncFromProps,
  { immediate: true },
);
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.output-params-editor {
  &__empty {
    font-size: 14px;
    color: colors.$text-light;
    padding: 20px;
    text-align: center;
    border: 1px solid colors.$border;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      colors.$white 0%,
      rgba(colors.$background, 0.6) 100%
    );
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: offsets.$offset-24;

    @media screen and (max-width: 1400px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
