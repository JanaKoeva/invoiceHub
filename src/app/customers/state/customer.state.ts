import { CustomerState } from "src/app/interfaces/state";

export const initialState: CustomerState = {
    customers: [],
    selectedCustomer: null,
    error: null,
  };