// customer.actions.ts
import { createAction, props } from '@ngrx/store';
import { Customer } from '../../interfaces/customer';

export const loadCustomers = createAction('[Customer] Load Customers');
export const loadCustomersSuccess = createAction(
  '[Customer] Load Customers Success',
  props<{ customers: Customer[] }>()
);
export const loadCustomersFailure = createAction(
  '[Customer] Load Customers Failure',
  props<{ error: string }>()
);

export const setSelectedCustomer = createAction(
  '[Customer] Set Selected Customer',
  props<{ customer: Customer }>()
);

export const clearSelectedCustomer = createAction('[Customer] Clear Selected Customer');
