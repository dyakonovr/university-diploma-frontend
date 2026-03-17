<template>
  <div class="tv">
    <table-ui
      class="tv__table"
      :class="{ [tableClass]: tableClass }"
      :is-fixed-header="isFixedHeader"
    >
      <template #head="{ hasRightScroll }">
        <template
          v-for="(column, index) in headerColumns"
          :key="index">
          <th
            :style="getColumnStyle(column)"
            :class="{
              'table-ui__cell--fixed-right': column.fixed === 'right',
              'is-shadow': column.fixed === 'right' && hasRightScroll,
            }"
            @click="
              column.sortable &&
                onSortableButtonClick(column.sortableProp ?? column.prop)
            "
          >
            <div
              class="tv__th-wrapper"
              :class="{
                clickable:
                  column.sortable &&
                  (column.sortableProp ?? column.prop) &&
                  !loading,
              }"
            >
              <component
                :is="column.label"
                v-if="isComponent(column.label)" />
              <template v-else>{{ column.label }}</template>

              <button
                v-if="column.sortable"
                type="button"
                class="tv__sortable-button"
                :class="{
                  'tv__sortable-button--active':
                    (column.sortableProp ?? column.prop) ===
                    activeSortButton?.prop,
                  [activeSortButton?.dir ?? '']:
                    (column.sortableProp ?? column.prop) ===
                    activeSortButton?.prop && activeSortButton?.dir,
                }"
                :disabled="loading"
              >
                <caret-down-icon
                  class="tv__sortable-button-icon tv__sortable-button-icon--asc"
                />
                <caret-down-icon
                  class="tv__sortable-button-icon tv__sortable-button-icon--desc"
                />
              </button>
            </div>
          </th>
        </template>
      </template>

      <template #body="{ hasRightScroll }">
        <template v-if="loading">
          <tr
            v-for="index in 5"
            :key="index"
            class="tv__loading-row">
            <td
              :colspan="
                !withCheckboxes
                  ? headerColumns.length
                  : headerColumns.length + 1
              "
              class="tv__cell--loading tv__cell tv__cell--center"
            >
              <div class="tv__skeleton-row" />
            </td>
          </tr>
        </template>

        <template v-else-if="!loading && tableData.length === 0">
          <tr>
            <td
              :colspan="headerColumns.length"
              class="tv__cell tv__cell--empty tv__cell--center"
            >
              Нет данных
            </td>
          </tr>
        </template>

        <template v-else>
          <tr
            v-for="item in tableData"
            :key="item.id"
            :class="{ [rowClass]: rowClass }"
            @click="emit('rowClick', item)"
          >
            <td
              v-for="(column, colIndex) in headerColumns"
              :key="colIndex"
              :style="getColumnStyle(column)"
              :class="{
                'table-ui__cell--fixed-right': column.fixed === 'right',
                'is-shadow': column.fixed === 'right' && hasRightScroll,
              }"
              class="tv__cell"
            >
              <!-- Если есть слот с именем пропа, используем его -->
              <slot
                v-if="$slots[column.prop]"
                :name="column.prop"
                v-bind="item"
              />

              <!-- Если слота нет, просто показываем значение -->
              <template v-else>
                {{ item[column.prop as keyof typeof item] }}
              </template>

              <router-link
                v-if="rowLink"
                class="row-link"
                :to="rowLink(item)"
                tabindex="-1"
              />
            </td>
          </tr>
        </template>
      </template>
    </table-ui>

    <div
      v-if="withPagination && tableData.length && totalPages > 1"
      ref="footerBlockRef"
      class="tv__footer"
    >
      <table-pagination
        v-model:current-page="currentPage"
        class="tv__pagination"
        :total-pages="totalPages"
        :disabled="loading"
        @update:current-page="onCurrentPageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup generic="T extends { id: EntityId }">
import type { Component, CSSProperties } from 'vue';

import CaretDownIcon from '@/assets/images/icons/caret-down.svg';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  TableViewActiveSortButton,
  TableViewHeaderColumn,
} from '~/shared/types/ui/table-view.types';

import TablePagination from '../ui/pagination/PaginationUi.vue';
import TableUi, { type TableElementProps } from '../ui/tables/TableUi.vue';

type Props = {
  withCheckboxes?: boolean;

  withPagination?: boolean;

  withQuantityPicker?: boolean;
  quantityPickerItems?: number[];

  isResetFiltersButtonShowed?: boolean;

  totalPages?: number;
  tableData: T[];
  tableClass?: string;

  totalCountValue?: number;
  totalCountText?: string;

  isCustomTableMaxHeight?: boolean;

  headerColumns: TableViewHeaderColumn[];
  rowClass?: string;
  rowLink?: (item: T) => string;
} & TableElementProps;

const props = withDefaults(defineProps<Props>(), {
  withCheckboxes: false,

  withPagination: true,

  withQuantityPicker: false,
  quantityPickerItems: undefined,

  isFixedHeader: true,

  resetFiltersBtnShowed: false,

  totalPages: 0,
  totalCountText: 'Всего записей',
  tableClass: '',
  isCustomTableMaxHeight: false,

  rowClass: '',
  rowLink: undefined,
});

const emit = defineEmits<{
  (e: 'sortButtonClick', sortableProp?: string, sortableDir?: string): void;
  (e: 'metaChange', page: number): void;
  (e: 'rowClick', item: T): void;
}>();

const route = useRoute();
const router = useRouter();

const footerBlockRef = ref<HTMLDivElement | null>(null);

// ONLY withPagination: true
const currentPage = defineModel<number>('currentPage', { default: 1 });

const activeSortButton = defineModel<TableViewActiveSortButton>(
  'activeSortButton',
  { default: null },
);

const getColumnStyle = (column: TableViewHeaderColumn) => {
  const styles: CSSProperties = {
    minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
    maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined,
    width: column.width ? `${column.width}px` : undefined,
  };
  return styles;
};
const isComponent = (text: string | Component): text is Component => {
  return typeof text !== 'string';
};

const onSortableButtonClick = (sortableProp: string) => {
  let newV: TableViewActiveSortButton = activeSortButton.value;

  // null -> asc -> desc -> repeat
  if (newV !== null && newV.prop === sortableProp) {
    if (newV.dir === 'asc') newV.dir = 'desc';
    else newV = null;
  } else {
    newV = {
      prop: sortableProp,
      dir: 'asc',
    };
  }

  if (newV) {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        sortBy: newV?.prop,
        sortDir: newV?.dir,
      },
    });
  }

  activeSortButton.value = newV;

  emit('sortButtonClick', activeSortButton.value?.prop, activeSortButton.value?.dir);
};

// ONLY withPagination: true
const setCurrentPageToUrl = (value: number) => {
  if (!props.withPagination) return;

  router.push({
    path: route.path,
    query: {
      ...route.query,
      page: value,
    },
  });

  emit('metaChange', value);
};

const onCurrentPageChange = (value: number) => {
  setCurrentPageToUrl(value);
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as textMixins;

.tv {
  margin: 16px 0;

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
    padding: 24px;
  }

  &__total-text {
    @include textMixins.text-14;

    display: flex;
    align-items: center;
    gap: 8px;
    color: colors.$text-light;

    span {
      font-weight: 500;
    }
  }

  td.tv__cell {
    position: relative;

    .row-link {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }

    a:not(.row-link),
    button {
      position: relative;
      z-index: 3;
    }

    &--center {
      vertical-align: middle !important;
      text-align: center !important;
    }

    &--empty {
      @include textMixins.headline-3;

      color: colors.$text;
      padding: 60px 16px !important;
    }
  }

  tr:has(td.tv__cell--empty):hover {
    &:hover {
      background-color: transparent !important;
    }
  }

  &__th-wrapper {
    display: flex;
    align-items: center;
    gap: 7px;

    &.clickable {
      cursor: pointer;
    }
  }

  &__sortable-button {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    gap: 4px;
    min-width: 8px;
    max-width: 8px;
    height: 14px;
    color: colors.$text-light;

    svg {
      width: 8px;
      height: 5px;
    }

    &--active {
      color: colors.$text;
    }

    &.asc {
      .tv__sortable-button-icon--desc {
        display: none;
      }
    }

    &.desc {
      .tv__sortable-button-icon--asc {
        display: none;
      }
    }

    &-icon {
      &--asc {
        transform: rotate(180deg);
      }
    }
  }

  &__skeleton-row {
    height: 25px;
    border-radius: 6px;
    background: linear-gradient(90deg, colors.$border 25%, #e8e8e8 50%, colors.$border 75%);
    background-size: 200% 100%;
    animation: tv-skeleton-shimmer 1.5s ease-in-out infinite;
  }
}

@keyframes tv-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
