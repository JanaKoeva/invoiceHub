import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'all_inclusive', auth:'authService.isAuthenticated()' },
  {state: 'invoices/invoiceForm', name: 'Add new Invoice', type: 'link', icon: 'web' , auth:'authService.isAuthenticated()'},
  { state: 'invoices/invoicesList', type: 'link', name: 'Invoices List', icon: 'view_headline', auth:'authService.isAuthenticated()' },
  { state: 'products/productForm', type: 'link', name: 'Add new product', icon: 'av_timer', auth:'authService.isAuthenticated()' },
  { state: 'products/productsList', type: 'link', name: 'Products List', icon: 'view_headline', auth:'authService.isAuthenticated()' },
  { state: 'customers/customerForm', type: 'link', name: 'Add new custumer', icon: 'adb',auth:'authService.isAuthenticated()' },
  { state: 'customers/customersList', type: 'link', name: 'Customers list', icon: 'view_headline',auth:'authService.isAuthenticated()' },
  // { state: 'tabs', type: 'link', name: 'Tabs', icon: 'tab' },
  // { state: 'stepper', type: 'link', name: 'Stepper', icon: 'web' },
  // {
  //   state: 'expansion',
  //   type: 'link',
  //   name: 'Expansion Panel',
  //   icon: 'vertical_align_center'
  // },
  // { state: 'chips', type: 'link', name: 'Chips', icon: 'vignette' },
  // { state: 'toolbar', type: 'link', name: 'Toolbar', icon: 'voicemail' },
  // {
  //   state: 'progress-snipper',
  //   type: 'link',
  //   name: 'Progress snipper',
  //   icon: 'border_horizontal'
  // },
  // {
  //   state: 'progress',
  //   type: 'link',
  //   name: 'Progress Bar',
  //   icon: 'blur_circular'
  // },
  // {
  //   state: 'dialog',
  //   type: 'link',
  //   name: 'Dialog',
  //   icon: 'assignment_turned_in'
  // },
  // { state: 'tooltip', type: 'link', name: 'Tooltip', icon: 'assistant' },
  // { state: 'snackbar', type: 'link', name: 'Snackbar', icon: 'adb' },
  // { state: 'slider', type: 'link', name: 'Slider', icon: 'developer_mode' },
  // {
  //   state: 'slide-toggle',
  //   type: 'link',
  //   name: 'Slide Toggle',
  //   icon: 'all_inclusive'
  // }
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
