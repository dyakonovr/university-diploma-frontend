import { SIDEBAR_MENU_GROUPS } from '~/components/layouts/account/sidebar/sidebar-menu.config';
import type { SidebarMenuGroup } from '~/components/layouts/account/sidebar/sidebar-menu.types';
import useUserStore from '~/domain/user/stores/user';

const SIDEBAR_COLLAPSED_LOCALSTORAGE_KEY = 'sidebar_menu_is_collapsed';

const useSidebarMenuStore = defineStore('sidebar-menu', {
  state: () => ({
    isCollapsed: false as boolean,
    isMobileOpen: false as boolean,
    refreshKey: 0 as number,
  }),
  getters: {
    visibleItems(): SidebarMenuGroup[] {
      const userStore = useUserStore();
      return SIDEBAR_MENU_GROUPS.filter((group) => {
        if (group.adminOnly && !userStore.isAdmin) {
          return false;
        }
        return true;
      });
    },
  },
  actions: {
    fetchIsToggleFromLocalStorage() {
      const v = localStorage.getItem(SIDEBAR_COLLAPSED_LOCALSTORAGE_KEY);
      if (!v || !['true', 'false'].includes(v)) return;

      this.isCollapsed = v === 'true';
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      localStorage.setItem(
        SIDEBAR_COLLAPSED_LOCALSTORAGE_KEY,
        String(this.isCollapsed),
      );
    },
    openMobile() {
      this.isMobileOpen = true;
      document.body.style.overflow = 'hidden';
    },
    closeMobile() {
      this.isMobileOpen = false;
      document.body.style.overflow = '';
    },
    refreshRoutes() {
      this.refreshKey += 1;
    },
  },
});

export default useSidebarMenuStore;
