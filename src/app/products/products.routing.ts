import { Routes } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import {  ProductFormComponent } from './product-form/product-form.component';
import { AuthGuard } from '../services/auth.guard';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductListResolver } from '../services/resolvers/productsList';


export const ProductsRoutes: Routes = [
  {
  path: 'productsList',
  component: ProductsListComponent,
  canActivate:[AuthGuard],
  resolve: {
    products: ProductListResolver ,  
  },
},
{
  path: 'productForm',
  component: ProductFormComponent,
  canActivate:[AuthGuard]
},
{
  path: 'productDetails/:id',
  component: EditProductComponent,
  canActivate:[AuthGuard]
},

];