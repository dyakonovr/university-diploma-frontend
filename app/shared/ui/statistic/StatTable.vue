<template>
  <table-view
    v-model:active-sort-button="activeSortButtonModel"
    :with-pagination="false"
    :header-columns="columns"
    :table-data="data"
    table-class="stat-table"
  >
    <template
      v-for="col in columns"
      :key="col.prop"
      #[col.prop]="item">
      <slot
        :name="col.prop"
        v-bind="item">
        {{ item[col.prop] ?? 'Нет информации' }}
      </slot>
    </template>
  </table-view>
</template>

<script setup lang="ts">
import TableView from '~/components/list-views/TableView.vue';
import type {
  TableViewActiveSortButton,
  TableViewHeaderColumn,
} from '~/shared/types/ui/table-view.types';

type Props = {
  data: Record<string, unknown>[];
  columns: TableViewHeaderColumn[];
};

defineProps<Props>();
const activeSortButtonModel =
  defineModel<TableViewActiveSortButton>('activeSortButton');
</script>

<style lang="scss">
.stat-table {
  max-height: 1000px;
}
</style>
