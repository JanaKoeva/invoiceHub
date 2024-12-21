
import { Component, Input, OnInit, ɵɵdeferPrefetchOnViewport } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { UserService } from 'src/app/services/user.service';
import { CompanyData } from 'src/app/interfaces/companyData';
import { InvoiceService } from 'src/app/services/invoice.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { startWith, map } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { SnackbarService } from 'src/app/services/openSnackBar.service';
import { ProductsService } from 'src/app/services/products.service';
import { User } from 'src/app/interfaces/user';
import { ChangeDetectorRef } from '@angular/core';



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
    MatTableModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss'
})


export class InvoiceFormComponent implements OnInit {


  @Input() customerData: any; // Optional input for pre-filling the form
  countries: { name: string, prefix: string }[] = [];
  filteredCountries!: Observable<string[]>;


  customerForm: FormGroup = Object.create(null);
  userForm: FormGroup = Object.create(null);
  productForm: FormGroup = Object.create(null);
  invoiceForm: FormGroup = Object.create(null);

  isOptional = false;
  isLogged: any;
  customers: any;
  
  loggedInUser!: any;
  customerId: any;
  productId: any;
  customer: any;
  get f(): any {
    return this.loggedInUser?.fields?.userData?.mapValue?.fields || '';
  }
  displayedColumns: string[] = ['product', 'quantity', 'price', 'total'];

  constructor(private invoiceService:InvoiceService, private route: ActivatedRoute, private changeDetector: ChangeDetectorRef, private router: Router, private productService: ProductsService, private userService: UserService, private auth: AuthService, private customerService: CustomerService, private fb: FormBuilder, private http: HttpClient, private snackBar: SnackbarService) {
    // Products form
  // init form
  this.productForm = this.fb.group({
    products: this.fb.array([]), 
    totalAmount: [{ value: 0, disabled: true }, Validators.required],

  })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['customerId']){
      this.customerId = params['customerId'];
      if (this.customerId) {
        console.log('Received Customer ID from query params:', this.customerId);
      } else {
        console.error('Customer ID not found in query parameters.');
      }}else if(params['productId']){this.customerId = params['productId'];
      if (this.productId) {
        console.log('Received productId from query params:', this.productId);
      } else {
        console.error('productId not found in query parameters.');
      }}
    });

    
    
    this.customerForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      vat: ['', [Validators.required, Validators.pattern('^[0-9]{9,12}$')]],
      prefix: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [this.loggedInUser?.email || '', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)]],
      phone: [this.loggedInUser?.phone || '', [Validators.required, Validators.pattern(/\d{9}/)]],
      country: [this.loggedInUser?.country || '', [Validators.required]],
      
    })
    
    this.isLogged = this.auth.isAuthenticated();
    // const navigation = this.router.getCurrentNavigation();
    // console.log('Navigation:', navigation);
    // const customerId = navigation?.extras.state?.['customer'];
    // const state = this.route
    // console.log(navigation?.extras.state)
    
  
    if (this.customerId) {
      
      this.customerService.getSingleCustomer(this.customerId).subscribe(customer => {
        if (customer) {
          this.customer=customer;
          this.customerForm.patchValue({
            companyName: this.customer.fields.companyName.stringValue || '',
            vat: this.customer.fields.vat.stringValue || '',
            prefix: this.customer.fields.prefix.stringValue || '',
            address:this.customer.fields.address.stringValue || '',
            email: this.customer.fields.email.stringValue || '',
            phone: this.customer.fields.phone.stringValue || '',
            country: this.customer.fields.country.stringValue || '',
          });
          this.changeDetector.detectChanges();
        } else {
          console.error('Customer not found.');
        }
      });
    } else {
      console.error('No customer ID received.');
    }


    // UserForm
    this.userForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      // country: [this.loggedInUser?.country || '', [Validators.required]],
      vat: ['', [Validators.required, Validators.pattern('^[0-9]{9,12}$')]],
      prefix: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      bankName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      iban: ['', [Validators.required, Validators.pattern(/[A-Z]{2}[0-9]{2}[A-Z]{4}[0-9]{14}/)]],
      swift: ['', [Validators.required, Validators.pattern(/^[A-Z]{6}/)]],
      // email: [this.loggedInUser?.email || '', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)]],
      // phone: [this.loggedInUser?.phone || '', [Validators.required, Validators.pattern(/\d{9}/)]],
    });

    this.userService.getFullCompanyData().subscribe(data => {
      this.userForm.patchValue({
        companyName: data?.fields.userData.mapValue.fields.companyName.stringValue || '',
        vat: data?.fields.userData.mapValue.fields.vat.stringValue || '',
        prefix: data?.fields.userData.mapValue.fields.prefix.stringValue || '',
        address: data?.fields.userData.mapValue.fields.address.stringValue || '',
        bankName: data?.fields.userData.mapValue.fields.bankName.stringValue || '',
        iban: data?.fields.userData.mapValue.fields.iban.stringValue || '',
        swift: data?.fields.userData.mapValue.fields.swift.stringValue || '',

      });
      console.log('Form values after patching:', this.customerForm.value)
    });


    

    

    if (this.productId) {

      this.productService.getSingleProduct(this.productId).subscribe(product => {
        if (product) {
          this.customerForm.patchValue({
            products: [
              // productName:product .productName?.stringValue,
              // productCode: product.productCode?.stringValue || '',
              // pack: product.pack?.stringValue || '',
              // price: product.price?.stringValue || '',
            ],
          });
          this.changeDetector.detectChanges();
        } else {
          console.error('Customer not found.');
        }
      });
    } else {
      console.error('No customer ID received.');
    }

    // Invoice Form
    this.invoiceForm = this.fb.group({
      date: [new Date(), Validators.required],
      invoiceNumber: ['', Validators.required],
    })

    this.productForm = this.fb.group({
      products: this.fb.array([]), // Динамичен списък със стоки
      totalAmount: [{ value: 0, disabled: true }, Validators.required], // Обща сума

    })
   

    // // add product
    // this.productService.getProducts().subscribe((data: any) => {
    //   this.products = data;
    //   console.log('products', this.products);
    // });


  }

  // ngAfterViewInit(): void {
  //   const navigation = this.router.getCurrentNavigation();
  //   const customer = navigation?.extras.state?.['customer'];

  //   console.log("Received Customer Data in ngAfterViewInit:", customer); // Log to confirm if state is available here

  //   if (customer) {
  //     this.customerForm.patchValue({
  //       companyName: customer.companyName || '',
  //       vat: customer.vat || '',
  //       prefix: customer.prefix || '',
  //       address: customer.address || '',
  //       bankName: customer.bankName || '',
  //       iban: customer.iban || '',
  //       swift: customer.swift || '',
  //     });
  //   } else {
  //     console.error('No customer data received.');
  //   }
  // }

 // Create an individual product form group
 createProduct(): FormGroup {
  return this.fb.group({
    name: new FormControl('', Validators.required),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    total: new FormControl({ value: 0, disabled: true }) // Calculated field
  });
}
  get products(): FormArray {
    return this.invoiceForm.get('products') as FormArray;
  }
  
  addProduct(): void {
    this.products.push(this.createProduct());
  }
  goToCustomerList() {
    this.router.navigate(['customers/customersList']);
  }

  goToProductsList() {
    this.router.navigate(['products/productsList']);
  }
  createInvoce() {

    if (this.userForm.valid&&this.customerForm.valid&&this.invoiceForm.valid&&this.productForm.valid) {

      const combinedData = {
        ...this.userForm.value,
        ...this.customerForm.value,
        ...this.productForm.value,
        ...this.invoiceForm.value,

      };
      console.log(combinedData);


      this.invoiceService.createInvoice(combinedData).subscribe({
        next: (response: any) => {

          if (response && response.message === 'User data is invalid or missing') {

            this.snackBar.openSnackBar('Failed to create customer. Reason: ' + response.message, 'Close');
            return;
          }
          // Successful registration
          this.snackBar.openSnackBar('Successful create customer!' + combinedData.email, 'Close');
          this.router.navigate(['/customers/customersList']);
        },
        error: (error: any) => {

          if (error.error?.error?.message === 'EMAIL_EXISTS') {
            this.snackBar.openSnackBar('This VAT number already registered.', 'Close');
          } else {
            this.snackBar.openSnackBar('An error occurred during registration. Please try again.', 'Close');
          }
        }
      })
    } else {

      console.log('Form is invalid');
      return;
    }
  }


  //   invoice = {
  //     number:'1000000001',
  //     date: new Date(),
  //   };


  //   selectedClient: any = null;
  //   products: any = [];
  //   displayedColumns: string[] = ['product', 'quantity', 'price', 'total'];

  //   subtotal = 0;
  //   tax = 0;
  //   total = 0;
  //   totalInWords = '';
  //   invoiceForm: FormGroup = Object.create(null);
  //   ownerDetails!: any;
  // invoiceNumber:any
  //   constructor(private authService:AuthService, private invoiceService:InvoiceService, public dialog: MatDialog, private userService: UserService, private fb: FormBuilder) { }

  //   ngOnInit(): void {

  //     this.ownerDetails = this.authService.getUserData();
  //     console.log(this.ownerDetails);
  //   console.log(this.invoiceNumber=this.invoiceService.getLastAndInclementInvoiceNumber());



  //     this.products = [
  //       {
  //         name: 'Product 1',
  //         quantityControl: new FormControl(1),
  //         priceControl: new FormControl(10),
  //       },
  //       {
  //         name: 'Product 2',
  //         quantityControl: new FormControl(2),
  //         priceControl: new FormControl(15),
  //       },
  //     ];

  //     // Initialize the form group with form controls
  //     this.invoiceForm = this.fb.group({
  //       invoiceNumber: new FormControl({ value: '', disabled: true }), // Disabled by default
  //       invoiceDate: new FormControl('', Validators.required),
  //       companyName: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //       amount: new FormControl('', [Validators.required, Validators.min(0)]),
  //     });
  //   }

  //   onSubmit(): void {
  //     if (this.invoiceForm.valid) {
  //       console.log('Form Submitted', this.invoiceForm.value);
  //     } else {
  //       console.log('Form is invalid');
  //     }
  //   }

  //   // Open dialog to select or add client
  //   openClientDialog(): void {
  //     const dialogRef = this.dialog.open(this.ClientDialogComponent);

  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         this.selectedClient = result;
  //       }
  //     });
  //   }

  //   // Open dialog to select or add product
  //   openProductDialog(): void {
  //     const dialogRef = this.dialog.open(this.ClientDialogComponent);

  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         this.products.push(result);
  //         this.calculateTotals();
  //       }
  //     });
  //   }

  //   // Add new product row
  //   addNewProduct(): void {
  //     this.products.push({ name: '', quantity: 1, price: 0 });
  //   }

  //   // Calculate totals
  //   calculateTotals(): void {
  //     this.subtotal = this.products.reduce((sum: number, product: { quantity: number; price: number; }) => sum + (product.quantity * product.price), 0);
  //     this.tax = this.subtotal * 0.2; // Assuming 20% tax
  //     this.total = this.subtotal + this.tax;
  //     this.totalInWords = this.convertNumberToWords(this.total);
  //   }

  //   // Convert total amount to words
  //   convertNumberToWords(amount: number): string {
  //     // Implement number to words conversion logic (e.g., using a library or custom logic)
  //     return 'One Hundred Fifty'; // Example
  //   }


  //   ClientDialogComponent: any

}
function createProduct() {
  throw new Error('Function not implemented.');
}

