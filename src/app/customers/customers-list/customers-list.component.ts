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


@Component({
  selector: 'app-customers-list',
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
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class CustomersListComponent {
  displayedColumns: string[] = ['id', 'name', 'vat', 'address', 'email', 'phone', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  customers$!: Observable<Array<Customer>>;
  customers: Customer[] = [];
  customer!: Customer;
  userId: any;
  customerId: any;
  private customersSubscription!: Subscription;

  // @ViewChild('shoes') shoes: MatSelectionList | undefined;
  // typesOfShoes = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];


  // customers!: Observable<any[]>;  // Observable to hold customer data

  constructor(private http: HttpClient, public snackBar: SnackbarService, private route: ActivatedRoute, private router: Router, private firestore: AngularFirestore, private customerService: CustomerService) {

  }



  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.customerId = this.route.snapshot.params['customerId'];

    this.customerService.getCustomers().subscribe((customers: any[]) => {

      const transformedCustomers = customers.map((customer: { id: string, name: string; fields: { companyName: { stringValue: any; }; email: { stringValue: any; }; phone: { stringValue: any; }; address: { stringValue: any; }; vat: { stringValue: any; } }; }) => (
        {
          id: customer.name.split('/').pop(),
          name: customer.fields.companyName?.stringValue || 'N/A',
          vat: customer.fields.vat?.stringValue || 'N/A',
          email: customer.fields.email?.stringValue || 'N/A',
          phone: customer.fields.phone?.stringValue || 'N/A',
          address: customer.fields.address?.stringValue || 'N/A'
        }));
      this.dataSource.data = transformedCustomers;
      this.customers = this.dataSource.data  || [];

    });
  }

  deleteCustomer(id: any): void {
    this.customerId = id;
    

    if (!this.customerId) {
      console.error('Customer ID is missing.');
      return;
    }


    // Confirm before deleting
    const confirmation = window.confirm(`Are you sure you want to delete the customer with ID ${this.customerId}?`);
    if (!confirmation) {
      return;
    }

    this.customerService.deleteCustomer(this.customerId).subscribe(
      () => {
        this.snackBar.openSnackBar(`${this.customerId} isdeleted successfully.`, 'Close');
        this.loadCustomers();
        // this.customers = this.customers.filter(customer =>this.customer.id !== this.customerId);
        this.router.navigate(['customers/customerList']);
      },
      (error) => {
        console.error('Error deleting customer:', error);
        this.snackBar.openSnackBar('Failed to delete customer. Please try again.', 'Close');
      }
    )


  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(
      (customers: any[]) => {
        // Transform the customer data
        const transformedCustomers = customers.map((customer: { id: string, fields: any }) => ({
          id: customer.id, // Assuming you get the ID as 'id'
          name: customer.fields.companyName?.stringValue || 'N/A',
          vat: customer.fields.vat?.stringValue || 'N/A',
          email: customer.fields.email?.stringValue || 'N/A',
          phone: customer.fields.phone?.stringValue || 'N/A',
          address: customer.fields.address?.stringValue || 'N/A'
        }));
        
        // Set the transformed data to the dataSource
        this.dataSource.data = transformedCustomers;
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
      }
    );
  }
    // .subscribe({
    //   next: () => {
    //     console.log('Customer deleted successfully');
    //     // Redirect to customer list or other desired page
    //     this.router.navigate(['/customers']);
    //   },
    //   error: (err) => {
    //     console.error('Error deleting customer:', err);
    //   }
    // });




    // updateCustomer(customerId: string, updatedData: any): Observable<any> {
    //   const url = `/${customerId}`;

    //   // Format the body data to match the Firestore structure
    //   const body = {
    //     fields: this.convertToFirestoreFields(updatedData)
    //   };

    //   return this.http.patch(url, body);
    // }


    // getCustomerData(customerId: string): Observable<any> {
    //   const url = `/${customerId}`;
    //   return this.http.get(url);
    // }

    // Convert data to the Firestore fields format
    // private convertToFirestoreFields(data: any): any {
    //   const fields: any = {};
    //   Object.keys(data).forEach(key => {
    //     fields[key] = { stringValue: data[key] };
    //   });
    //   return fields;
    // }
    ngOnDestroy(): void {
      // Unsubscribe to avoid memory leaks
      if (this.customersSubscription) {
        this.customersSubscription.unsubscribe();
      }
    }
  }

