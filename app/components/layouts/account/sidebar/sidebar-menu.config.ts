import ChevronRightDoubleIcon from '@/assets/images/icons/chevron-right-double.svg';
import CpuIcon from '@/assets/images/icons/cpu.svg';
import CreditCardIcon from '@/assets/images/icons/credit-card.svg';
import DashboardIcon from '@/assets/images/icons/dashboard.svg';
import FlowIcon from '@/assets/images/icons/flow.svg';
import FolderIcon from '@/assets/images/icons/folder.svg';
import GlobeIcon from '@/assets/images/icons/globe.svg';
import GridIcon from '@/assets/images/icons/grid.svg';
import HashIcon from '@/assets/images/icons/hash.svg';
import LayersIcon from '@/assets/images/icons/layers.svg';
import LockIcon from '@/assets/images/icons/lock.svg';
import LogOutIcon from '@/assets/images/icons/logout.svg';
import NewspaperIcon from '@/assets/images/icons/newspaper.svg';
import ReceiptIcon from '@/assets/images/icons/receipt.svg';
import SendIcon from '@/assets/images/icons/send.svg';
import ServerIcon from '@/assets/images/icons/server.svg';
import SettingsIcon from '@/assets/images/icons/settings.svg';
import ShieldIcon from '@/assets/images/icons/shield.svg';
import ProfileIcon from '@/assets/images/icons/user.svg';
import UsersIcon from '@/assets/images/icons/users.svg';

import type { SidebarMenuGroup } from './sidebar-menu.types';

export const SIDEBAR_MENU_GROUPS: SidebarMenuGroup[] = [
  {
    title: 'Дашборд',
    children: [
      {
        type: 'route',
        routeName: 'account-index',
        icon: DashboardIcon,
      },
    ],
  },
  {
    title: 'Шаблоны',
    children: [
      {
        type: 'route',
        routeName: 'account-artifacts',
        icon: LayersIcon,
      },
      {
        type: 'route',
        routeName: 'account-flows',
        icon: FlowIcon,
      },
    ],
  },
  {
    title: 'Тарифы',
    children: [
      {
        type: 'route',
        routeName: 'account-pricing',
        icon: CreditCardIcon,
      },
    ],
  },
  {
    title: 'Постинг и аккаунты',
    children: [
      {
        type: 'route',
        routeName: 'account-posts',
        icon: SendIcon,
      },
      {
        type: 'route',
        routeName: 'account-social-accounts',
        icon: GlobeIcon,
      },
    ],
  },
  {
    title: '[A] Новости',
    children: [
      {
        type: 'route',
        routeName: 'account-news-categories',
        icon: FolderIcon,
      },
      {
        type: 'route',
        routeName: 'account-news-subcategories',
        icon: FolderIcon,
      },
      {
        type: 'route',
        routeName: 'account-news-hashtags',
        icon: HashIcon,
      },
      {
        type: 'route',
        routeName: 'account-news',
        icon: NewspaperIcon,
      },
    ],
  },
  {
    title: '[A] Провайдеры и модели',
    key: 'admin-section',
    adminOnly: true,
    children: [
      {
        type: 'route',
        routeName: 'account-models',
        icon: CpuIcon,
      },
      {
        type: 'route',
        routeName: 'account-providers',
        icon: ServerIcon,
      },
    ],
  },
  {
    title: '[A] Шаблоны',
    adminOnly: true,
    children: [
      {
        type: 'route',
        routeName: 'account-flow-categories',
        icon: GridIcon,
      },
    ],
  },
  {
    title: '[A] Пользователи',
    children: [
      {
        type: 'route',
        routeName: 'account-users',
        icon: UsersIcon,
      },
      {
        type: 'route',
        routeName: 'account-roles',
        icon: ShieldIcon,
      },
      {
        type: 'route',
        routeName: 'account-permissions',
        icon: LockIcon,
      },
      {
        type: 'route',
        routeName: 'account-subscriptions',
        icon: ReceiptIcon,
      },
    ],
  },
  {
    title: '',
    toBottom: true,
    children: [
      {
        type: 'route',
        routeName: 'account-settings',
        icon: SettingsIcon,
      },
      {
        type: 'route',
        routeName: 'account-profile',
        icon: ProfileIcon,
      },
      {
        type: 'action',
        actionTitle: 'Выйти',
        actionKey: 'logout',
        actionItemClass: 'logout-button',
        actionIcon: LogOutIcon,
      },
    ],
  },
  {
    title: '',
    toBottom: true,
    children: [
      {
        type: 'action',
        actionTitle: 'Развернуть',
        actionItemClass: 'collapse-button',
        actionAltTitle: 'Свернуть',
        actionKey: 'collapse',
        actionIcon: ChevronRightDoubleIcon,
      },
    ],
  },
];
