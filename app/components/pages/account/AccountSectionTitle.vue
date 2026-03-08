<template>
  <div class="section-title">
    <h1 class="headline-3 weight-500">{{ title }}</h1>
    <!-- <pre>{{ JSON.stringify(breadcrumbs) }}</pre> -->
    <client-only>
      <ul class="section-title__breadcrumbs list-reset">
        <li
          v-for="(breadcrumb, idx) in breadcrumbs"
          :key="breadcrumb.path"
          class="section-title__breadcrumb text-12 weight-500"
          :class="{
            'section-title__breadcrumb--inactive':
              idx !== breadcrumbs.length - 1,
          }"
        >
          <nuxt-link
            v-if="idx !== breadcrumbs.length - 1"
            :to="breadcrumb.path"
            class="section-title__breadcrumb-link"
          >
            {{ breadcrumb.name }}
          </nuxt-link>
          <span v-else>{{ breadcrumb.name }}</span>

          <span
            v-if="idx !== breadcrumbs.length - 1"
            class="section-title__breadcrumb"
          >/</span
          >
        </li>
      </ul>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const route = useRoute();

const title = computed(() => {
  return route.meta?.title ?? '';
});

const HOME_PATH = '/account';
const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean);
  const crumbs: { name: string; path: string }[] = [
    { name: 'Главная', path: HOME_PATH },
  ];
  if (route.path === HOME_PATH) return crumbs;

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += '/' + segment;

    const resolved = router.resolve(currentPath);
    const matchedRoute = resolved.matched[resolved.matched.length - 1];
    const name = matchedRoute?.meta?.title as string;
    if (!name) return;

    if (currentPath !== HOME_PATH) crumbs.push({ name, path: currentPath });
  });

  return crumbs;
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.section-title {
  display: flex;
  flex-direction: column;
  gap: 7px;

  &__breadcrumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 3px;
  }

  &__breadcrumb {
    --active-color: #{colors.$text-light};

    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--active-color);
    line-height: 12px;

    &--inactive {
      color: #00000040;
    }

    &-link {
      transition: color 0.2s ease;

      &:hover {
        color: var(--active-color);
      }
    }
  }
}
</style>
