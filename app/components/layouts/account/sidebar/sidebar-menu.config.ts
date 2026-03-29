import ArrowLeftIcon from '@/assets/images/icons/arrow-left.svg';
import ChevronRightDoubleIcon from '@/assets/images/icons/chevron-right-double.svg';
import CpuIcon from '@/assets/images/icons/cpu.svg';
import DashboardIcon from '@/assets/images/icons/dashboard.svg';
import GlobeIcon from '@/assets/images/icons/globe.svg';
import LayersIcon from '@/assets/images/icons/layers.svg';
import ReceiptIcon from '@/assets/images/icons/receipt.svg';
import SendIcon from '@/assets/images/icons/send.svg';
import ServerIcon from '@/assets/images/icons/server.svg';
import UsersIcon from '@/assets/images/icons/users.svg';

import type { SidebarMenuGroup } from './sidebar-menu.types';

export const SIDEBAR_MENU_GROUPS: SidebarMenuGroup[] = [
  {
    title: '',
    workspaceOnly: true,
    children: [
      {
        type: 'workspace-route',
        workspacePath: '',
        title: 'Дашборд',
        icon: DashboardIcon,
      },
      {
        type: 'workspace-route',
        workspacePath: '/tasks',
        title: 'Задачи',
        icon: LayersIcon,
      },
      {
        type: 'workspace-route',
        workspacePath: '/commands',
        title: 'Команды',
        icon: SendIcon,
      },
      {
        type: 'workspace-route',
        workspacePath: '/employees',
        title: 'Сотрудники',
        icon: UsersIcon,
      },
      {
        type: 'workspace-route',
        workspacePath: '/reports',
        title: 'Отчёты',
        icon: ReceiptIcon,
      },
      {
        type: 'workspace-route',
        workspacePath: '/ai-context',
        title: 'AI Контекст',
        icon: CpuIcon,
      },
      {
        type: 'workspace-route',
        workspacePath: '/integrations',
        title: 'Интеграции',
        icon: GlobeIcon,
      },
      {
        type: 'workspace-route',
        workspacePath: '/settings',
        title: 'Настройки',
        icon: ServerIcon,
      },
    ],
  },
  {
    title: '',
    toBottom: true,
    children: [
      {
        type: 'action',
        actionTitle: 'Все воркспейсы',
        actionKey: 'back-to-hub',
        actionIcon: ArrowLeftIcon,
      },
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
