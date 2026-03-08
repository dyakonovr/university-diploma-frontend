<template>
  <div
    v-show="totalPages > 1"
    class="table-pagination">
    <button-ui
      size="small"
      variant="outlined"
      :disabled="currentPage === 1"
      class="table-pagination__button"
      @click="currentPage -= 1">
      <chevron-down-icon class="table-pagination__button-icon table-pagination__button-icon--prev" />
    </button-ui>

    <template v-if="totalPages <= 5">
      <button-ui
        v-for="n in totalPages"
        :key="n"
        size="small"
        variant="outlined"
        class="table-pagination__button"
        :class="{ 'active': currentPage === n }"
        @click="currentPage = n">
        {{ n }}
      </button-ui>
    </template>

    <template v-else-if="totalPages - currentPage > 3">
      <button-ui
        size="small"
        variant="outlined"
        class="table-pagination__button"
        :class="{ 'active': currentPage === 1 }"
        @click="currentPage = 1">
        1
      </button-ui>

      <template v-if="currentPage === 1">
        <button-ui
          v-for="n in 2"
          :key="n"
          size="small"
          variant="outlined"
          class="table-pagination__button"
          :class="{ 'active': currentPage === currentPage + n }"
          @click="currentPage = currentPage + n">
          {{ currentPage + n }}
        </button-ui>
      </template>

      <template v-else>
        <button-ui
          v-if="currentPage !== 2"
          size="small"
          variant="outlined"
          class="table-pagination__button"
          @click="currentPage = currentPage - 1">
          {{ currentPage - 1 }}
        </button-ui>
        <button-ui
          size="small"
          variant="outlined"
          class="table-pagination__button active">
          {{ currentPage }}
        </button-ui>
        <button-ui
          size="small"
          variant="outlined"
          class="table-pagination__button"
          @click="currentPage = currentPage + 1">
          {{ currentPage + 1 }}
        </button-ui>
      </template>
      
      <button-ui
        size="small"
        variant="outlined"
        class="table-pagination__button table-pagination__button--points">...</button-ui>
      
      <button-ui
        size="small"
        variant="outlined"
        class="table-pagination__button"
        @click="currentPage = totalPages - 1">{{ totalPages - 1 }}</button-ui>

      <button-ui
        size="small"
        variant="outlined"
        class="table-pagination__button"
        @click="currentPage = totalPages">{{ totalPages }}</button-ui>
    </template>

    <template v-else>
      <button-ui
        size="small"
        variant="outlined"
        class="table-pagination__button"
        @click="currentPage = 1">
        1
      </button-ui>
      
      <button-ui
        size="small"
        variant="outlined"
        class="table-pagination__button table-pagination__button--points">...</button-ui>

      <button-ui
        v-for="n in [4, 3, 2, 1, 0]"
        :key="n"
        size="small"
        variant="outlined"
        class="table-pagination__button"
        :class="{ 'active': currentPage === totalPages - n }"
        @click="currentPage = totalPages - n">
        {{ totalPages - n }}
      </button-ui>
    </template>

    <button-ui
      size="small"
      variant="outlined"
      :disabled="currentPage === totalPages"
      class="table-pagination__button"
      @click="currentPage += 1">
      <chevron-down-icon class="table-pagination__button-icon table-pagination__button-icon--next" />
    </button-ui>
  </div>
</template>

<script lang="ts" setup>
import ButtonUi from '../form/ButtonUi.vue';
import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';

const currentPage = defineModel<number>('currentPage', { required: true });

type Props = {
  totalPages: number;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as mixins;

.table-pagination {
  display: flex;
  align-items: center;
  gap: offsets.$offset-8;

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    max-width: 32px;
    height: 32px;

    @include mixins.text-12;

    &--points {
      border: none;
      cursor: default;

      &:hover {
        background-color: transparent;
      }
    }

    &-icon {
      &--prev {
        transform: rotate(90deg);
      }

      &--next {
        transform: rotate(-90deg);
      }
    }

    &.active {
      cursor: default;
      background-color: colors.$gray-300;
      border-color: colors.$gray-300;
    }
  }
}
</style>