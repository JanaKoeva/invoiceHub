
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input'; // If using mat-datepicker with input
import { MatFormFieldModule } from '@angular/material/form-field'; // If using form fields
import { MatNativeDateModule } from '@angular/material/core'; // For native date handling
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { UserService } from 'src/app/services/user.service';
import { CompanyData } from 'src/app/interfaces/companyData';
import { InvoiceService } from 'src/app/services/invoice.service';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatTable,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss'
})


export class InvoiceFormComponent implements OnInit {



  invoice = {
    number:'1000000001',
    date: new Date(),
  };


  selectedClient: any = null;
  products: any = [];
  displayedColumns: string[] = ['product', 'quantity', 'price', 'total'];

  subtotal = 0;
  tax = 0;
  total = 0;
  totalInWords = '';
  invoiceForm: FormGroup = Object.create(null);
  ownerDetails!: any;
invoiceNumber:any
  constructor(private authService:AuthService, private invoiceService:InvoiceService, public dialog: MatDialog, private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {
   
    this.ownerDetails = this.authService.getUserData();
    console.log(this.ownerDetails);
  console.log(this.invoiceNumber=this.invoiceService.getLastAndInclementInvoiceNumber());
  


    this.products = [
      {
        name: 'Product 1',
        quantityControl: new FormControl(1),
        priceControl: new FormControl(10),
      },
      {
        name: 'Product 2',
        quantityControl: new FormControl(2),
        priceControl: new FormControl(15),
      },
    ];

    // Initialize the form group with form controls
    this.invoiceForm = this.fb.group({
      invoiceNumber: new FormControl({ value: '', disabled: true }), // Disabled by default
      invoiceDate: new FormControl('', Validators.required),
      companyName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
    });
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      console.log('Form Submitted', this.invoiceForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  // Open dialog to select or add client
  openClientDialog(): void {
    const dialogRef = this.dialog.open(this.ClientDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedClient = result;
      }
    });
  }

  // Open dialog to select or add product
  openProductDialog(): void {
    const dialogRef = this.dialog.open(this.ClientDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.products.push(result);
        this.calculateTotals();
      }
    });
  }

  // Add new product row
  addNewProduct(): void {
    this.products.push({ name: '', quantity: 1, price: 0 });
  }

  // Calculate totals
  calculateTotals(): void {
    this.subtotal = this.products.reduce((sum: number, product: { quantity: number; price: number; }) => sum + (product.quantity * product.price), 0);
    this.tax = this.subtotal * 0.2; // Assuming 20% tax
    this.total = this.subtotal + this.tax;
    this.totalInWords = this.convertNumberToWords(this.total);
  }

  // Convert total amount to words
  convertNumberToWords(amount: number): string {
    // Implement number to words conversion logic (e.g., using a library or custom logic)
    return 'One Hundred Fifty'; // Example
  }


  ClientDialogComponent: any

}
