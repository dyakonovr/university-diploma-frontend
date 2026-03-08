<template>
  <div>
    <container class="table-template-container">
      <div class="table-template__header">
        <h1 class="headline-3">{{ title }}</h1>
        <button-ui
          size="small"
          @click="$nuxt.$router.push(createItemButton.pushTo)">{{ createItemButton.text }}</button-ui>
      </div>

      <div
        v-if="filters && $slots.filters"
        class="table-template__filters gray-rounded-block">
        <h5>Фильтры</h5>
        <div class="table-template__filters-wrapper">
          <slot name="filters" />
        </div>
        <div class="table-template__filters-btns">
          <button-ui
            size="small"
            class="table-template__filters-btn"
            @click="filters.onApplyFilters">Применить фильтры</button-ui>
          <button-ui
            variant="error"
            size="small"
            class="table-template__filters-btn"
            @click="filters.onResetFilters">Сбросить фильтры</button-ui>
        </div>
      </div>

      <slot name="table" />
    </container>
  </div>
</template>

<script lang="ts" setup>
import Container from '~/components/layout/Container.vue';
import ButtonUi from '~/components/ui/form/ButtonUi.vue';

export type TableTemplateProps = {
  title: string;
  createItemButton: {
    text: string;
    pushTo: string;
  };
  filters?: {
    onApplyFilters: () => void;
    onResetFilters: () => void;
  };

}

defineProps<TableTemplateProps>();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.table-template {
  &-container {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-24;
    max-width: 1232px;
  }

  &__header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: offsets.$offset-16;
  }

  &__filters {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-16;

    &-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      align-items: center;
      gap: offsets.$offset-12;

      @media screen and (max-width: 576px) {
        grid-template-columns: repeat(1, 1fr);
      }
    }

    &-btns {
      display: flex;
      align-items: center;
      gap: offsets.$offset-12;
      flex-wrap: wrap;
    }

    &-btn {
      align-self: baseline;

      @media screen and (max-width: 576px) {
        width: 100%
      }
    }
  }
}
</style>