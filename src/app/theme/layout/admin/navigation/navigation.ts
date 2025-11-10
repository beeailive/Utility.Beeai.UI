export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'network-server',
    title: 'Network Server',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home'
      },
      {
        id: 'tenants',
        title: 'Tenants',
        type: 'item',
        url: '/tenants',
        icon: 'feather icon-home'
      },
      {
        id: 'users',
        title: 'Users',
        type: 'item',
        url: '/users',
        icon: 'feather icon-user'
      },
      {
        id: 'api-keys',
        title: 'API Keys',
        type: 'item',
        url: '/api-keys',
        icon: 'feather icon-key'
      },
      {
        id: 'device-profile-templates',
        title: 'Device Profile Templates',
        type: 'item',
        url: '/device-profile-templates',
        icon: 'feather icon-smartphone'
      },
      {
        id: 'regions',
        title: 'Regions',
        type: 'item',
        url: '/regions',
        icon: 'feather icon-compass'
      }
    ]
  },
  {
    id: 'tenant',
    title: 'Tenant',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'tenant-dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/tenant-dashboard',
        icon: 'feather icon-home'
      },
      {
        id: 'tenant-users',
        title: 'Users',
        type: 'item',
        url: '/tenant-users',
        icon: 'feather icon-user'
      },
      {
        id: 'tenant-api-keys',
        title: 'API Keys',
        type: 'item',
        url: '/tenant-api-keys',
        icon: 'feather icon-key'
      },
      {
        id: 'device-profiles',
        title: 'Device Profiles',
        type: 'item',
        url: '/device-profiles',
        icon: 'feather icon-smartphone'
      },
      {
        id: 'gateways',
        title: 'Gateways',
        type: 'item',
        url: '/gateways',
        icon: 'feather icon-wifi'
      },
      {
        id: 'gateway-mesh',
        title: 'Gateway Mesh',
        type: 'item',
        url: '/gateway-mesh',
        icon: 'feather icon-share-2'
      },
      {
        id: 'applications',
        title: 'Applications',
        type: 'item',
        url: '/applications',
        icon: 'feather icon-grid'
      }
    ]
  }
];
