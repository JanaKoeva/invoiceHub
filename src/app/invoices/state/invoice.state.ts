import { InvoiceState } from "src/app/interfaces/state";


export const initialInvoiceState: InvoiceState = {
  selectedCustomer: null,
  products: [],
  lastUsedInvoiceNumber: null,
  invoices: [],
  isNewInvoice:true,
  totalAmount:0,
 
};

export { InvoiceState };
