import { Customer } from "./customer";
import { Product } from "./product";

export interface Invoice {
    id: string,
    invoiceNumber: string,
    date:string,
    custumer: Customer,
    products: Product[],
    vat: string,
    amount: string,
    isNewInvoice: boolean;

}
