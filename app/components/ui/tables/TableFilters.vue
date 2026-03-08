<template>
  <form
    class="table-filters"
    @submit.prevent="handleSearchClick">
    <div class="table-filters__fields">
      <slot />
    </div>
    <div class="table-filters__buttons">
      <button-ui
        class="table-filters__button"
        @click="handleSearchClick">Поиск</button-ui>
      <button-ui
        class="table-filters__button"
        variant="outlined"
        @click="handleResetClick"
      >Очистить</button-ui
      >
    </div>
  </form>
</template>

<script lang="ts" setup>
import type { LocationQueryRaw } from 'vue-router';

import ButtonUi from '../ButtonUi.vue';

export type TableFiltersProps = {
  // filterable?: boolean;
  // withCreateButton?: boolean;
  // createButtonText?: string;
  // link: string;
  loading?: boolean;
  saveFiltersToUrlOnChange?: boolean;
  isUrlPageResetOnChange?: boolean;
  filters?: Record<string, unknown>;
  submitAfterReset?: boolean;
};

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['reset', 'search']);
const props = withDefaults(defineProps<TableFiltersProps>(), {
  loading: false,
  initiallyOpened: false,
  saveFiltersToUrlOnChange: true,
  filters: undefined,
  submitAfterReset: true,
});

const filtersCountForCSSGrid = computed(() => {
  const length = Object.keys(props.filters ?? {}).length;
  return Math.min(length, 4);
});

function isEmpty(value: unknown) {
  if (value === null || value === undefined) return true;
  if (value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;

  return false;
}

function handleSearchClick() {
  if (props.saveFiltersToUrlOnChange && props.filters) {
    // Начинаем с текущего query
    const newQuery: LocationQueryRaw = { ...route.query };

    // Сначала удаляем ВСЕ ключи фильтров из query
    Object.keys(props.filters).forEach((key) => {
      delete newQuery[key];
    });

    // Затем добавляем только непустые фильтры
    Object.entries(props.filters).forEach(([key, value]) => {
      if (!isEmpty(value)) {
        newQuery[key] = value as LocationQueryRaw[string];
      }
    });

    router.push({
      path: route.path,
      query: newQuery,
    });
  }

  emit('search');
}

function handleResetClick() {  
  if (props.saveFiltersToUrlOnChange && props.filters) {
    const currentQuery = { ...route.query };

    const filterKeys = Object.keys(props.filters);
    filterKeys.forEach((key) => {
      delete currentQuery[key];
    });

    router.push({
      path: route.path,
      query: currentQuery,
    });
  }

  emit('reset');
  if (props.submitAfterReset) emit('search');
}
</script>

<style lang="scss">
.table-filters {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 18px 0;

  &__fields {
    display: grid;
    grid-template-columns: repeat(v-bind(filtersCountForCSSGrid), 1fr);
    gap: 12px;

    @media screen and (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__buttons {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    @media screen and (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__button {
    @media screen and (max-width: 992px) {
      width: 50%;
      max-width: unset;
    }

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
}
</style>
