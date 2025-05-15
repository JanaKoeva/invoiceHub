import { Customer } from "./customer";
import { Invoice } from "./invoice";
import { Product } from "./product";

export interface CustomerState {
    customers: Customer[];
    selectedCustomer: Customer | null;
    error: string| null;
}

export interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    error: string | null;
}

export interface InvoiceState {
    selectedCustomer: Customer | null;
    products: Product[] ;
  lastUsedInvoiceNumber: number|null;
  invoices: Invoice[];
  isNewInvoice:boolean,
  totalAmount:number,

  }
