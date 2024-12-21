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
import { InvoiceService } from 'src/app/services/invoice.service';
import { Invoice } from 'src/app/interfaces/invoice';


@Component({
  selector: 'app-invoices-list',
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
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class InvoicesListComponent {
  displayedColumns: string[] = ['id', 'Number', 'Date', 'Customer', 'VAt Number', 'Amount', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  customers$!: Observable<Array<Customer>>;
  customers: Customer[] = [];
  customer!: Customer;
  userId: any;
  customerId: any;
  private customersSubscription!: Subscription;
  invoices!: any;

  // @ViewChild('shoes') shoes: MatSelectionList | undefined;
  // typesOfShoes = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];


  // customers!: Observable<any[]>;  // Observable to hold customer data

  constructor(private http: HttpClient, private invoiceServices:InvoiceService, public snackBar: SnackbarService, private route: ActivatedRoute, private router: Router, private firestore: AngularFirestore, private customerService: CustomerService) {

  }



  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.customerId = this.route.snapshot.params['customerId'];

    this.invoiceServices.getAll().subscribe((customers: any[]) => {

      const transformedCustomers = customers.map((invoice: {
         id: string, name: string; 
         fields: { 
          
          id: { stringValue: any; }; 
         number: { stringValue: any; }; 
         date: { stringValue: any; }; 
         custumer: { stringValue: any; }; 
         vat: { stringValue: any; },
         amount: { stringValue: any; } }; }) => (
        {
          id: invoice.name.split('/').pop(),
          date:invoice.fields.date?.stringValue || 'N/A',
          number: invoice.fields.number?.stringValue || 'N/A',
          custumer: invoice.fields.custumer?.stringValue || 'N/A',
          vat: invoice.fields.vat?.stringValue || 'N/A',
          amount: invoice.fields.amount?.stringValue || 'N/A',
          
        }));
      this.dataSource.data = transformedCustomers;
      this.invoices = this.dataSource.data||[];

    });
  

  
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
  selectInvoice(invoice: any): void {
    console.log('Selected inv:', invoice);
    
    this.router.navigate(['/invoices/invoiceForm'], {
      queryParams: { invoceId: invoice },
    });
  }
  
  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.customersSubscription) {
      this.customersSubscription.unsubscribe();
    }
  }
}


