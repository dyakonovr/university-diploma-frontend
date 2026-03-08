<template>
  <nav
    class="news-breadcrumbs"
    aria-label="Breadcrumb">
    <ol class="news-breadcrumbs__list list-reset">
      <li
        v-for="(crumb, idx) in crumbs"
        :key="idx"
        class="news-breadcrumbs__item text-14"
      >
        <nuxt-link
          v-if="crumb.to"
          :to="crumb.to"
          class="news-breadcrumbs__link"
        >
          {{ crumb.label }}
        </nuxt-link>
        <span
          v-else
          class="news-breadcrumbs__current">
          {{ crumb.label }}
        </span>

        <span
          v-if="idx < crumbs.length - 1"
          class="news-breadcrumbs__separator"
          aria-hidden="true"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
export type BreadcrumbItem = {
  label: string;
  to?: string;
};

defineProps<{
  crumbs: BreadcrumbItem[];
}>();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.news-breadcrumbs {
  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__link {
    --color: #{colors.$primary};

    color: var(--color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__current {
    --color: #{colors.$text-light};

    color: var(--color);
  }

  &__separator {
    --color: #{colors.$text-light};

    color: var(--color);
  }
}

[data-theme='dark'] .news-breadcrumbs {
  &__current {
    --color: #{colors.$background};
  }

  &__separator {
    --color: #{colors.$background};
  }
}
</style>
