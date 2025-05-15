import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './services/auth.guard';
import { GuestGuard } from './services/guest.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canActivate: [GuestGuard]
      },
      {
        path: 'invoices',
        loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule),
        canActivate: [AuthGuard]
      },

      {
        path: 'customers',
        loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule,),
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module ').then(m => m.ProductsModule,),
        canActivate: [AuthGuard]
      }
    ]
  }
];
