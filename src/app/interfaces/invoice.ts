import { Customer } from "./customer";
import { Product } from "./product";

export interface Invoice {
    id: string,
    number: string,
    custumer: Customer,
    products: Product[],
    vat: string,
    amount: string,
    isNewInvoice: boolean;

}
