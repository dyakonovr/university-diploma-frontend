<template>
  <section class="cards-view">
    <div v-if="data.length" class="cards-view__list">
      <component
        :is="cardLink ? NuxtLink : 'div'"
        v-for="(item, itemIdx) in data"
        :key="item.id"
        :to="cardLink ? cardLink(item) : undefined"
      >
        <li class="cards-view__card">
          <div
            v-if="$slots.actions"
            class="cards-view__card-actions"
            @click.stop.prevent
          >
            <slot name="actions" v-bind="{ item, itemIdx }" />
          </div>
          <p class="weight-500">
            <slot name="title" v-bind="{ item, itemIdx }" />
          </p>
          <div class="text-14 cards-view__card-body">
            <slot name="body" v-bind="{ item, itemIdx }" />
          </div>
        </li>
      </component>
    </div>

    <div v-if="loading && !data.length" class="cards-view__loading">
      <spinner-ui />
    </div>

    <div
      v-else-if="!loading && !data.length && emptyHtml"
      class="cards-view__empty"
      v-html="emptyHtml"
    />
    <p v-else-if="!loading && !data.length" class="cards-view__empty">
      Нет данных
    </p>

    <div v-if="withPagination" class="cards-view__pagination">
      <pagination-ui
        v-if="withPagination && data.length"
        v-model:current-page="currentPage"
        class="tv__pagination"
        :total-pages="totalPages"
        :disabled="loading"
        @update:current-page="onCurrentPageChange"
      />
    </div>
  </section>
</template>

<script lang="ts" setup generic="T extends { id: EntityId }">
import type { EntityId } from "~/shared/types/core/base-entity.types";

import PaginationUi from "../ui/pagination/PaginationUi.vue";
import SpinnerUi from "../ui/SpinnerUi.vue";
import { NuxtLink } from "#components";

type Props = {
  data: T[];
  cardLink?: ((item: T) => string) | null;

  loading?: boolean;
  /** Текст, который отображается при отсутствии данных (v-html) */
  emptyHtml?: string | null;

  withPagination?: boolean;
  totalPages?: number;
};

const props = withDefaults(defineProps<Props>(), {
  cardLink: null,
  loading: false,
  emptyHtml: null,
  withPagination: true,
  totalPages: 0,
});

const route = useRoute();
const router = useRouter();

const currentPage = defineModel<number>("currentPage", { default: 1 });

const setCurrentPageToUrl = (value: number) => {
  if (!props.withPagination) return;

  router.push({
    path: route.path,
    query: {
      ...route.query,
      page: value,
    },
  });
};

const onCurrentPageChange = (value: number) => {
  setCurrentPageToUrl(value);
};
</script>

<style lang="scss" scoped>
@use "/assets/styles/base/colors" as colors;
@use "/assets/styles/base/offsets" as offsets;
@use "/assets/styles/mixins/other" as mixins;

.cards-view {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: offsets.$offset-24;
    margin: offsets.$offset-16 0 0;
    transition:
      max-height 1s ease-in-out,
      opacity 1s ease-in-out;

    @media screen and (max-width: 1400px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  &__card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: offsets.$offset-24;
    border: 1px solid #0000000d;
    border-radius: 12px;
    min-height: 180px;
    height: 100%;
    overflow: hidden;
    background-color: colors.$white;
    background-image: url("/images/account/prompt-list-item-bg.png");
    box-shadow: 0px 7px 15px 0px #00000008;
    transition:
      border-color 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;

    &:hover {
      border-color: #002bff66;
      box-shadow: 0px 7px 15px 0px #002bff12;
    }

    &--extra {
      background:
        url("/images/account/prompt-list-item-extra-bg.png"),
        linear-gradient(
          109.45deg,
          rgba(28, 67, 255, 0.09),
          rgba(28, 221, 255, 0) 100.37%
        );
    }

    &__extra-icon {
      display: none;
      position: absolute;
      left: 0;
      top: 0;
      padding: 4px 12px;
      background-color: colors.$danger;
      border-bottom-right-radius: 100px;

      img {
        width: 12px;
        height: 12px;
      }
    }

    /* &__trigger {
      display: flex;
      align-items: center;
  
      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        margin: 0 0 0 offsets.$offset-8;
        transform: rotate(-90deg);
        transition: transform 0.3s ease-out;
  
        &--opened {
          transform: rotate(0);
        }
      }
    } */

    &-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 1;
    }

    &-body {
      margin: 12px 0 0;
      height: 100%;
      color: colors.$text-light;
    }
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: offsets.$offset-40 0;
  }

  &__empty {
    text-align: center;
    padding: offsets.$offset-24;
    color: colors.$text-light;
  }

  &__pagination {
    margin: 0 auto;
  }
}

.line-clamp {
  @include mixins.line-clamp(3);

  @media screen and (max-width: 576px) {
    @include mixins.line-clamp(2);
  }
}

.accordion-enter-active {
  transition: all 0.3s ease-out;
}

.accordion-leave-active {
  transition: all 0.3s ease-out;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
}
</style>
