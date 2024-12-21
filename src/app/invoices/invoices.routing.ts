import { Routes } from '@angular/router';

import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { CustomerFormComponent } from '../customers/customer-form/customer-form.component';
import { EditCustomerComponent } from '../customers/edit-customer/edit-customer.component';
import { AuthGuard } from '../services/auth.guard';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';



export const InvoicesRoutes: Routes = [
  {
  path: 'invoiceForm',
  component: InvoiceFormComponent,
  canActivate:[AuthGuard]
},
{
  path: 'customerDetails/:id',
  component: EditCustomerComponent,
  canActivate:[AuthGuard]
},{
  path: 'invoicesList',
  component: InvoicesListComponent,
  canActivate:[AuthGuard]
},

];