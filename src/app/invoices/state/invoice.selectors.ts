// invoice.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InvoiceState } from './invoice.state';

export const selectInvoiceState = createFeatureSelector<InvoiceState>('invoice');

export const selectSelectedCustomer = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.selectedCustomer
);

export const loadSavedProducts = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => {
    console.log('selectSavedProducts:', state.products);
    
    return state.products
  })

  export const selectIsNewInvoice = createSelector(
    selectInvoiceState,
    (state: InvoiceState) => state.isNewInvoice
  );

  export const selectInvoiceTotal = createSelector(
    selectInvoiceState,
    (state) => state.totalAmount 
  );

