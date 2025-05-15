
import { createAction, props } from '@ngrx/store';
import { Customer } from 'src/app/interfaces/customer';
import { Product } from 'src/app/interfaces/product';

export const selectCustomer = createAction(
  '[Invoice] Select Customer',
  props<{ customer: Customer }>()
);

export const loadSavedProducts = createAction(
  '[Invoice] Load Saved Products',
  props<{ products: []}>()
);


export const addsProduct = createAction(
  '[Invoice] Add Product',
  props<{ product: Product}>()
);

export const updateProduct = createAction(
  '[Invoice] Update Product',
  props<{ index: number; product: Product }>()
);

export const updateStoredProducts = createAction(
  '[Invoice] Update Product in Store',
  props<{ index: number; product: Product }>()
);

export const updateTotalinStore = createAction(
  '[Invoice] Update Total',
  props<{ products:Product[] }>() 
);

export const removeProduct = createAction(
  '[Invoice] Remove Product',
  props<{ index:number }>() 
);

export const clearInvoice = createAction('[Invoice] Clear Invoice');

export const clearCustomer = createAction('[Invoice] Clear Customer');

export const setNewInvoice = createAction(
  '[Invoice] Set New Invoice',
  props<{ isNewInvoice: boolean }>()
);

export const loadLastInvoiceNumber = createAction('[Invoice] Load Last Invoice Number');
export const loadLastInvoiceNumberSuccess = createAction(
  '[Invoice] Load Last Invoice Number Success',
  props<{ lastNumber: number }>()
);
export const loadLastInvoiceNumberFailure = createAction(
  '[Invoice] Load Last Invoice Number Failure',
  props<{ error: any }>()
);
