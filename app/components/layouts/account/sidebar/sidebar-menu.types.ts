import type { Component } from 'vue';

/** SVG icons imported via nuxt-svgo-loader are Component at runtime but typed as string */
type SidebarIcon = Component | string;

export type SidebarMenuRouteItem = {
  type: 'route';
  routeName: string;
  icon: SidebarIcon;
};

export type SidebarMenuActionItem = {
  type: 'action';
  actionKey: string;
  actionTitle: string;
  actionAltTitle?: string;
  actionIcon: SidebarIcon;
  actionItemClass?: string;
};

export type SidebarMenuGroupChildren =
  | SidebarMenuRouteItem
  | SidebarMenuActionItem;

export type SidebarMenuGroup = {
  title: string;
  key?: string;
  children: SidebarMenuGroupChildren[];
  toBottom?: boolean;
  adminOnly?: boolean;
};
