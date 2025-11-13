// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [

  {
    path: '',
    component: GuestComponent,
    children: [
       {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/login/login.component').then((c) => c.LoginComponent)
      },
      {
        path: 'signup',
        loadComponent: () => import('./demo/pages/authentication/signup/signup.component').then((c) => c.SignupComponent)
      }
    ]
  },
    {
    path: '',
    component: AdminComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: '/dashboard',
      //   pathMatch: 'full'
      // },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component').then((c) => c.DashAnalyticsComponent)
      },
      {
        path: 'tenants',
        loadComponent: () => import('./demo/pages/tenants/tenants.component').then((c) => c.TenantsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./demo/pages/users/users.component').then((c) => c.UsersComponent)
      },
      {
        path: 'api-keys',
        loadComponent: () => import('./demo/pages/api-keys/api-keys.component').then((c) => c.ApiKeysComponent)
      },
      {
        path: 'device-profile-templates',
        loadComponent: () => import('./demo/pages/device-profile-templates/device-profile-templates.component').then((c) => c.DeviceProfileTemplatesComponent)
      },
      {
        path: 'regions',
        loadComponent: () => import('./demo/pages/regions/regions.component').then((c) => c.RegionsComponent)
      },
      {
        path: 'tenant-dashboard',
        loadComponent: () => import('./demo/pages/tenant/tenant-dashboard/tenant-dashboard.component').then((c) => c.TenantDashboardComponent)
      },
      {
        path: 'tenant-users',
        loadComponent: () => import('./demo/pages/tenant/tenant-users/tenant-users.component').then((c) => c.TenantUsersComponent)
      },
      {
        path: 'tenant-api-keys',
        loadComponent: () => import('./demo/pages/tenant/tenant-api-keys/tenant-api-keys.component').then((c) => c.TenantApiKeysComponent)
      },
      {
        path: 'device-profiles',
        loadComponent: () => import('./demo/pages/tenant/device-profiles/device-profiles.component').then((c) => c.DeviceProfilesComponent)
      },
      {
        path: 'gateways',
        loadComponent: () => import('./demo/pages/tenant/gateways/gateways.component').then((c) => c.GatewaysComponent)
      },
      {
        path: 'gateways/:id',
        loadComponent: () => import('./demo/pages/tenant/gateway-detail/gateway-detail.component').then((c) => c.GatewayDetailComponent)
      },
      {
        path: 'gateway-mesh',
        loadComponent: () => import('./demo/pages/tenant/gateway-mesh/gateway-mesh.component').then((c) => c.GatewayMeshComponent)
      },
      {
        path: 'relay-gateways',
        loadComponent: () => import('./demo/pages/relay-gateways/relay-gateways.component').then((c) => c.RelayGatewaysComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./demo/pages/tenant/applications/applications.component').then((c) => c.ApplicationsComponent)
      },
      {
        path: 'applications/:id',
        loadComponent: () => import('./demo/pages/tenant/application-detail/application-detail.component').then((c) => c.ApplicationDetailComponent)
      },
      {
        path: 'devices',
        loadComponent: () => import('./demo/pages/tenant/devices/devices.component').then((c) => c.DevicesComponent)
      },
      {
        path: 'devices/:devEui',
        loadComponent: () => import('./demo/pages/tenant/device-detail/device-detail.component').then((c) => c.DeviceDetailComponent)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
