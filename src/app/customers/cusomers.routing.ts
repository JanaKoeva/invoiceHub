import { Routes } from '@angular/router';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { AuthGuard } from '../services/auth.guard';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';


export const CustomerRoutes: Routes = [
  {
  path: 'customersList',
  component: CustomersListComponent,
  canActivate:[AuthGuard]
},
{
  path: 'customerForm',
  component: CustomerFormComponent,
  canActivate:[AuthGuard]
},
{
  path: 'customerDetails/:id',
  component: EditCustomerComponent,
  canActivate:[AuthGuard]
},

];