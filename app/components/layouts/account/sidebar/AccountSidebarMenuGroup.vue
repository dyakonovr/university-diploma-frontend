<template>
  <div
    v-if="isVisible"
    class="sidebar-menu-group"
    :class="{
      'sidebar-menu-group--bottom': group.toBottom,
      'sidebar-menu-group--collapsed': isCollapsed && !group.toBottom,
      'sidebar-menu-group--border':
        (isCollapsed && groupIndex !== 0) || withBorder,
    }"
  >
    <!-- Заголовок группы -->
    <p
      v-if="!isCollapsed && group.title"
      class="sidebar-menu-group__title text-12 weight-500"
      @click="isOpened = !isOpened"
      @keydown.enter="isOpened = !isOpened"
    >
      {{ group.title }}

      <span
        class="sidebar-menu-group__arrow"
        :class="{ rotated: isOpened && !isCollapsed }"
      >
        <chevron-down-icon />
      </span>
    </p>

    <div
      v-show="isOpened"
      class="sidebar-menu-group__content">
      <!-- Элементы группы -->
      <template
        v-for="(child, cIndex) in visibleChildren"
        :key="cIndex">
        <!-- Кнопка = ссылка -->
        <sidebar-menu-item
          v-if="child.type === 'route' && child.route"
          :collapsed="isCollapsed"
          :title="(child.route.meta?.title as string) ?? ''"
          :active="isButtonActive(child.route.path)"
          :to="child.route.path"
        >
          <template #icon>
            <component :is="child.icon" />
          </template>
        </sidebar-menu-item>

        <!-- Кнопка = workspace-route -->
        <sidebar-menu-item
          v-else-if="child.type === 'workspace-route'"
          :collapsed="isCollapsed"
          :title="child.title"
          :active="isButtonActive(`${workspaceBasePath}${child.workspacePath}`)"
          :to="`${workspaceBasePath}${child.workspacePath}`"
        >
          <template #icon>
            <component :is="child.icon" />
          </template>
        </sidebar-menu-item>

        <!-- Кнопка = action -->
        <sidebar-menu-item
          v-else-if="child.type === 'action'"
          :collapsed="isCollapsed"
          :title="
            !isCollapsed && child.actionAltTitle
              ? child.actionAltTitle
              : child.actionTitle
          "
          is-action
          :additional-class="child.actionItemClass"
          @click="doActionByKey(child.actionKey)"
        >
          <template #icon>
            <component :is="child.actionIcon" />
          </template>
        </sidebar-menu-item>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type Ref, ref } from 'vue';
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router';

import ChevronDownIcon from '@/assets/images/icons/chevron-down.svg';
import useUserStore from '~/domain/user/stores/user';
import useSidebarMenuStore from '~/shared/stores/sidebar-menu';

import type { SidebarMenuFormattedGroup } from './AccountSidebarMenu.vue';
import SidebarMenuItem from './AccountSidebarMenuItem.vue';

type Props = {
  group: SidebarMenuFormattedGroup;
  groupIndex: number;
  withBorder?: boolean;
};

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();

const sidebarMenuStore = useSidebarMenuStore();
const userStore = useUserStore();

const isCollapsed = inject<Ref<boolean>>(
  'sidebar-collapsed',
  ref(sidebarMenuStore.isCollapsed),
);

const isOpened = ref(true);

const logout = () => {
  userStore.changeUserData(null);
  router.push('/auth/login');
};

function doActionByKey(key: string) {
  if (key === 'logout') logout();
  if (key === 'collapse') sidebarMenuStore.toggleCollapse();
  if (key === 'back-to-hub') router.push('/workspaces');
}

function isAdminRoute(r: RouteRecordRaw): boolean {
  const middleware = r.meta?.middleware;
  if (!middleware) return false;
  if (typeof middleware === 'string') return middleware === 'admin';
  if (Array.isArray(middleware))
    return (middleware as string[]).includes('admin');
  return false;
}

const currentWorkspaceId = computed(() => route.params.workspaceId as string | undefined);

const workspaceBasePath = computed(() =>
  currentWorkspaceId.value ? `/workspaces/${currentWorkspaceId.value}` : '/workspaces',
);

const visibleChildren = computed(() =>
  props.group.children.filter((child) => {
    if (child.type === 'action') return true;
    if (child.type === 'workspace-route') return true;
    if (!child.route) return false;
    return !isAdminRoute(child.route) || userStore.isAdmin;
  }),
);

const isVisible = computed(() => {
  if (props.group.workspaceOnly && !currentWorkspaceId.value) return false;
  return visibleChildren.value.length > 0;
});

function isButtonActive(currentRoutePath: string) {
  const normalizedTo = currentRoutePath.endsWith('/')
    ? currentRoutePath.slice(0, -1)
    : currentRoutePath;
  const normalizedPath = route.path.endsWith('/')
    ? route.path.slice(0, -1)
    : route.path;

  // Для списка воркспейсов и корня воркспейса — только точное совпадение
  if (/^\/workspaces(\/[^/]+)?$/.test(normalizedTo)) {
    return normalizedPath === normalizedTo;
  }

  // Для остальных — точное совпадение или путь начинается с to/
  return (
    normalizedPath === normalizedTo ||
    normalizedPath.startsWith(normalizedTo + '/')
  );
}
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/components/sidebar' as sidebar;

.sidebar-menu-group {
  display: flex;
  flex-direction: column;
  padding: sidebar.$sidebar-menu-group-padding-y
    sidebar.$sidebar-menu-group-padding-x 0;

  &--bottom {
    margin-top: auto;
  }

  &--collapsed {
    // Чтобы сделать разделитель групп не на всю ширину в collapsed режиме
    padding: sidebar.$sidebar-menu-group-padding-y 0;
  }

  &--border {
    border-top: 1px solid sidebar.$sidebar-divider-color;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    margin-top: 16px;
    padding-bottom: sidebar.$sidebar-menu-group-title-bottom-offset;
    position: relative;
    cursor: pointer;
    user-select: none;

    &:first-of-type {
      margin-top: 0;
    }
  }

  &__arrow {
    width: 15px;
    height: 15px;
    margin-right: 12px;
    color: colors.$text-light;
    transition: transform ease-in-out
      sidebar.$sidebar-submenu-collapse-transition-time;

    &.rotated {
      transform: rotate(180deg);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: sidebar.$sidebar-menu-item-padding-bottom;
  }

  &:last-of-type,
  &--bottom {
    padding-bottom: sidebar.$sidebar-menu-group-padding-y;
  }
}
</style>
