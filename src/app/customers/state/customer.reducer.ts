
import { createReducer, on } from '@ngrx/store';
import { initialState } from './customer.state';
import * as CustomerActions from './customer.actions';

export const customerReducer = createReducer(
  initialState,
  on(CustomerActions.loadCustomersSuccess, (state, { customers }) => ({
    ...state,
    customers,
    error: null,
  })),
  on(CustomerActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(CustomerActions.setSelectedCustomer, (state, { customer }) => ({
    ...state,
    selectedCustomer: customer,
  })),
  on(CustomerActions.clearSelectedCustomer, (state) => ({
    ...state,
    selectedCustomer: null,
  }))
);
