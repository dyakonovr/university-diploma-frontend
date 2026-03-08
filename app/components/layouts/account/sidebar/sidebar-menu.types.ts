import type { Component } from 'vue';

/** SVG icons imported via nuxt-svgo-loader are Component at runtime but typed as string */
type SidebarIcon = Component | string;

export type SidebarMenuRouteItem = {
  type: 'route';
  routeName: string;
  icon: SidebarIcon;
};

export type SidebarMenuWorkspaceRouteItem = {
  type: 'workspace-route';
  workspacePath: string;  // e.g., '' for dashboard, '/tasks', '/commands'
  title: string;
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
  | SidebarMenuWorkspaceRouteItem
  | SidebarMenuActionItem;

export type SidebarMenuGroup = {
  title: string;
  key?: string;
  children: SidebarMenuGroupChildren[];
  toBottom?: boolean;
  adminOnly?: boolean;
  workspaceOnly?: boolean;  // only show when in a workspace context
};
