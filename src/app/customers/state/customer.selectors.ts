
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from '../../interfaces/state'; 

export const selectCustomerState = createFeatureSelector<CustomerState>('customer');

export const selectAllCustomers = createSelector(
  selectCustomerState,
  (state) => state.customers
);

export const selectSelectedCustomer = createSelector(
  selectCustomerState,
  (state) => state.selectedCustomer
);

export const selectCustomerError = createSelector(
  selectCustomerState,
  (state) => state.error
);
