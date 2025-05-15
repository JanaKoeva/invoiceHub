// invoice.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { InvoiceState, initialInvoiceState } from './invoice.state';
import * as InvoiceActions from './invoice.actions';


export const invoiceReducer = createReducer(

  
  initialInvoiceState,

  on(InvoiceActions.selectCustomer, (state, { customer }) => ({
    ...state,
    selectedCustomer: customer,
  })),

  on(InvoiceActions.loadSavedProducts, (state, { products }) => ({
    ...state,
    products
  })),

  on(InvoiceActions.addsProduct, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
  })),

  on(InvoiceActions.updateProduct, (state, { index, product }) => ({
    ...state,
    products: state.products.map((p, i) =>
      i === index ? { ...p, ...product } : p
    ),
  })),

  
  on(InvoiceActions.updateStoredProducts, (state, { index, product }) => {

    return{
    ...state,
    products: state.products.map((p, i) =>
      i === +index ? product  : p
    ),
    
    
  }
}),

on(InvoiceActions.updateTotalinStore, (state, { products }) => ({
  ...state,
  totalAmount: products.reduce((acc, p) => acc + p.total, 0)
})),

  on(InvoiceActions.removeProduct, (state, { index }) => ({
    ...state,
    products: state.products.filter((_, i) => i !== index),
  })),
  on(InvoiceActions.clearCustomer, (state) => ({
    ...state,
    selectedCustomer: null,
  })),

  on(InvoiceActions.clearInvoice, (state) => ({
    ...state,
    products: [],
    selectedCustomer: null,
    isNewInvoice: true,
  })),

  on(InvoiceActions.setNewInvoice, (state, { isNewInvoice }) => ({
    ...state,
    isNewInvoice: isNewInvoice
  }))
);
