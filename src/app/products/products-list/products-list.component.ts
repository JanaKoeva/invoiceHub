import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input'; // If using mat-datepicker with input
import { MatFormFieldModule } from '@angular/material/form-field'; // If using form fields
import { MatNativeDateModule } from '@angular/material/core'; // For native date handling
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule, MatSelectionList } from '@angular/material/list';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../interfaces/customer';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../services/openSnackBar.service';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports:
    [RouterModule,
      MatTableModule,
      CommonModule,
      MatDatepickerModule,
      MatSelectModule,
      MatListModule,
      MatInputModule,
      MatSelectModule,
      MatFormFieldModule,
      MatNativeDateModule,
      MatCardModule,
      MatSelectModule,
      MatSlideToggleModule,
      ReactiveFormsModule,
      FormsModule,
      MatTableModule,
    ]
  ,
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ProductsListComponent {
  displayedColumns: string[] = ['code', 'name', 'pack', 'price', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  products$!: Observable<Array<Customer>>;
  products: Customer[] = [];
  product!: Customer;
  userId: any;
  prductId: any;
  private customersSubscription!: Subscription;



  constructor(private http: HttpClient, public snackBar: SnackbarService, private route: ActivatedRoute, private router: Router, private firestore: AngularFirestore, private productService: ProductsService) {

  }



  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.prductId = this.route.snapshot.params['productId'];


    console.log(this.products);
    const products = this.route.snapshot.data['products']

    const transformedCustomers = products.map((customer: {
      id: string,
      name: string;
      fields: {
        productName: { stringValue: any; },
        price: { stringValue: any; },
        pack: { stringValue: any; },
        productCode: { stringValue: any; };
        vat: { stringValue: any; }
      }
    }) => (
      {
        id: customer.name.split('/').pop(),
        name: customer.fields.productName?.stringValue || 'N/A',
        code: customer.fields.productCode?.stringValue || 'N/A',
        pack: customer.fields.pack?.stringValue || 'N/A',
        price: customer.fields.price?.stringValue || 'N/A',

      }));
    this.dataSource.data = transformedCustomers;
    console.log(this.dataSource.data);

    this.products = this.dataSource.data || [];
    console.log(this.products);
  }



  selectProduct(product: any): void {
    
    const rowIndex = this.route.snapshot.queryParams['rowIndex'];
    const customerId = this.route.snapshot.queryParams['customerId'];

    this.router.navigate(['/invoices/invoiceForm'], {
      queryParams:  { productId: product, rowIndex, customerId } ,
    });
  }

  deleteProduct(id: any): void {

    this.prductId = id;


    if (!this.prductId) {
      console.error('Product ID is missing.');
      return;
    }


    // Confirm before deleting
    const confirmation = window.confirm(`Are you sure you want to delete the customer with ID ${this.prductId}?`);
    if (!confirmation) {
      return;
    }

    this.productService.deleteProduct(this.prductId).subscribe(
      () => {
        this.snackBar.openSnackBar(`${this.prductId} isdeleted successfully.`, 'Close');
        this.loadProducts();
        // this.customers = this.customers.filter(customer =>this.customer.id !== this.customerId);
        this.router.navigate(['products/productsList']);
      },
      (error) => {
        console.error('Error deleting customer:', error);
        
        this.snackBar.openSnackBar('Failed to delete customer. Please try again.', 'Close');
      }
    )


  }



  loadProducts() {
    this.productService.getProducts().subscribe(
      (customers: any[]) => {
        // Transform the customer data
        const transformedCustomers = customers.map((customer: { id: string, fields: any }) => ({
          id: customer.id, // Assuming you get the ID as 'id'
          name: customer.fields.name?.stringValue || 'N/A',
          code: customer.fields.productCode?.stringValue || 'N/A',
          price: customer.fields.price?.stringValue || 'N/A',
          pack: customer.fields.pack?.stringValue || 'N/A',
        }));

        // Set the transformed data to the dataSource
        this.dataSource.data = transformedCustomers;
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
      }
    );
  }
  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.customersSubscription) {
      this.customersSubscription.unsubscribe();
    }
  }
}

