<template>
  <nav
    class="sidebar-menu"
    :class="{ 'sidebar-menu--collapsed': isCollapsed }">
    <!-- Logo -->
    <router-link
      to="/account"
      class="sidebar-menu__logo-link">
      <div class="sidebar-menu__logo-wrapper">
        <component
          :is="isCollapsed ? LogoCollapsed : LogoFull"
          class="sidebar-menu__main-logo"
        />
      </div>
    </router-link>

    <!-- Top groups -->
    <div
      class="sidebar-menu__groups"
      :class="{
        'sidebar-menu__groups--collapsed': isCollapsed,
      }"
    >
      <sidebar-menu-group
        v-for="(group, gIndex) in topGroups"
        :key="group.title"
        :group="group"
        :group-index="gIndex"
      />
    </div>

    <!-- Bottom groups -->
    <div class="sidebar-menu__footer">
      <sidebar-menu-group
        v-for="(group, gIndex) in bottomGroups"
        :key="group.title"
        :group="group"
        :group-index="gIndex"
        with-border
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { type RouteRecordRaw, RouterLink, useRouter } from 'vue-router';

import LogoFull from '@/assets/logos/logo-artweb.svg';
import LogoCollapsed from '@/assets/logos/logo-aw.svg';
import useSidebarMenuStore from '~/shared/stores/sidebar-menu';

import SidebarMenuGroup from './AccountSidebarMenuGroup.vue';
import type {
  SidebarMenuGroup as SidebarMenuGroupType,
  SidebarMenuGroupChildren,
} from './sidebar-menu.types';

type Props = {
  forceExpanded?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  forceExpanded: false,
});

type SidebarIcon = Component | string;

/* ---------- Тип для готового меню ---------- */
export type SidebarMenuRouteWithChildren =
  | {
      type: 'route';
      icon: SidebarIcon;
      route: RouteRecordRaw | null;
    }
  | {
      type: 'action';
      actionKey: string;
      actionTitle: string;
      actionAltTitle?: string;
      actionIcon: SidebarIcon;
      actionItemClass?: string;
    };

const router = useRouter();
const sidebarMenuStore = useSidebarMenuStore();

const isCollapsed = computed(
  () => !props.forceExpanded && sidebarMenuStore.isCollapsed,
);

provide('sidebar-collapsed', isCollapsed);

function getRouteByName(name: string, allRoutes: RouteRecordRaw[]) {
  const rt = allRoutes.find((r) => r.name === name);
  return rt ?? null;
}

/* ---------- Трансформация стора -> готовые элементы ---------- */
function includeRouteToChildren(
  groupItem: SidebarMenuGroupChildren,
  allRoutes: RouteRecordRaw[],
): SidebarMenuRouteWithChildren {
  switch (groupItem.type) {
    case 'action':
      return {
        type: 'action',
        actionKey: groupItem.actionKey,
        actionTitle: groupItem.actionTitle,
        actionAltTitle: groupItem.actionAltTitle,
        actionIcon: groupItem.actionIcon,
        actionItemClass: groupItem.actionItemClass,
      };

    case 'route':
      return {
        type: 'route',
        icon: groupItem.icon,
        route: getRouteByName(groupItem.routeName, allRoutes),
      };

    default:
      return { type: 'route', icon: '', route: null };
  }
}

/* ---------------- Sidebar items ---------------- */
export type SidebarMenuFormattedGroup = Omit<
  SidebarMenuGroupType,
  'children'
> & {
  children: SidebarMenuRouteWithChildren[];
};

const menuItems = computed<SidebarMenuFormattedGroup[]>(() => {
  const allRoutes = router.getRoutes();

  return sidebarMenuStore.visibleItems.map((el) => ({
    ...el,
    children: el.children.map((c) => includeRouteToChildren(c, allRoutes)),
  }));
});

const topGroups = computed(() => menuItems.value.filter((g) => !g.toBottom));
const bottomGroups = computed(() => menuItems.value.filter((g) => g.toBottom));

onBeforeMount(() => {
  sidebarMenuStore.fetchIsToggleFromLocalStorage();
});
</script>

<style lang="scss">
@use '/assets/styles/components/sidebar' as sidebar;

.sidebar-menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;

  min-height: 100%;
  color: sidebar.$sidebar-menu-color;
  background-color: sidebar.$sidebar-menu-background-color;

  &--collapsed {
    .sidebar-menu__main-logo {
      --width: #{sidebar.$sidebar-menu-collapsed-logo-width};
    }
  }

  &__logo-wrapper {
    display: flex;
    align-items: center;
    padding: sidebar.$sidebar-menu-logo-wrapper-padding;
    border-bottom: sidebar.$sidebar-menu-logo-wrapper-divider;
  }

  &__main-logo {
    --width: #{sidebar.$sidebar-menu-uncollapsed-logo-width};

    min-width: var(--width);
    max-width: var(--width);
    height: sidebar.$sidebar-menu-logo-height;
  }

  &__logo-text {
    margin-left: 7px;
  }

  &__groups {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;

    &--collapsed {
      // Чтобы сделать разделитель групп не на всю ширину в collapsed режиме
      padding: 0 sidebar.$sidebar-menu-group-padding-x;
    }

    .sidebar-menu-group {
      &:first-of-type {
        padding-top: sidebar.$sidebar-menu-group-first-top-padding;
      }
    }

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.35)
      sidebar.$sidebar-menu-background-color;

    /* Chrome / Edge / Safari */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: sidebar.$sidebar-menu-background-color;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.25);
      border-radius: 6px;
      border: 2px solid sidebar.$sidebar-menu-background-color;
      transition: background-color 0.15s ease-in-out;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(255, 255, 255, 0.35);
    }

    /* Убираем кнопки (если вдруг появятся) */
    &::-webkit-scrollbar-button {
      display: none;
      height: 0;
      width: 0;
    }
  }
}
</style>
