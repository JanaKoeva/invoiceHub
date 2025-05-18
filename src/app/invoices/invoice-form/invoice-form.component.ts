
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
import { UserService } from 'src/app/services/user.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from 'src/app/services/customer.service';
import { SnackbarService } from 'src/app/services/openSnackBar.service';
import { ProductsService } from 'src/app/services/products.service';
import { ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { InvoiceState } from 'src/app/interfaces/state';
import { Customer } from 'src/app/interfaces/customer';
import { Product } from 'src/app/interfaces/product';
import * as InvoiceActions from '../state/invoice.actions';
import { loadSavedProducts, selectInvoiceState, selectInvoiceTotal, selectIsNewInvoice, selectSelectedCustomer } from '../state/invoice.selectors';
import { distinctUntilChanged, flatMap, take } from 'rxjs';
import { P } from '@angular/cdk/keycodes';




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


  dataSource: any[] = [];
  customerForm: FormGroup = Object.create(null);
  userForm: FormGroup = Object.create(null);
  productForm: FormGroup = Object.create(null);
  invoiceForm: FormGroup = Object.create(null);

  isOptional = false;

  customers: any;

  loggedInUser!: any;
  customerId: any;
  productId: any;
  customer: any;
  selectedCustomer: any = null;
  isCustomerSelected: boolean = false;
  isProductSelected = false;
  currentInvoiceNumber: any;
  private isExitingInvoice: boolean = true;

  displayedColumns: string[] = ['product', 'quantity', 'price', 'total'];

  rowIndex: any;
  // selectedCustomer$: Observable<Customer | null>;
  // selectedProducts$: Observable<Product[]>;
  amountExclVat: number = 0;
  vatRate: number = 0;
  vatAmount: number = 0;
  totalAmount: number = 0;
  totalInWords: string = '';

  constructor(
    // @Inject(DOCUMENT) private document: Document,
    private store: Store<InvoiceState>,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private productService: ProductsService,
    private userService: UserService,
    private auth: AuthService,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: SnackbarService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
debugger
    //clear the store
    this.store.select(selectIsNewInvoice).pipe(take(1)).subscribe((isNewInvoice) => {

      if (isNewInvoice) {
        // this.isExitingInvoice=false;
        this.store.dispatch(InvoiceActions.clearInvoice());
        this.store.dispatch(InvoiceActions.setNewInvoice({ isNewInvoice: false }));
      }
    });



    // init UserForm
    this.userForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      // country: [this.loggedInUser?.country || '', [Validators.required]],
      vat: ['', [Validators.required, Validators.pattern('^[0-9]{9,12}$')]],
      prefix: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      bankName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      iban: ['', [Validators.required, Validators.pattern(/[A-Z]{2}[0-9]{2}[A-Z]{4}[0-9]{14}/)]],
      swift: ['', [Validators.required, Validators.pattern(/^[A-Z]{6}/)]],
      userId:['']
      // email: [this.loggedInUser?.email || '', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)]],
      // phone: [this.loggedInUser?.phone || '', [Validators.required, Validators.pattern(/\d{9}/)]],
    });

    this.userService.getFullCompanyData().subscribe(data => {
      console.log(data);
      
      this.userForm.patchValue({
        companyName: data?.fields.userData.mapValue.fields.companyName.stringValue || '',
        vat: data?.fields.userData.mapValue.fields.vat.stringValue || '',
        prefix: data?.fields.userData.mapValue.fields.prefix.stringValue || '',
        address: data?.fields.userData.mapValue.fields.address.stringValue || '',
        bankName: data?.fields.userData.mapValue.fields.bankName.stringValue || '',
        iban: data?.fields.userData.mapValue.fields.iban.stringValue || '',
        swift: data?.fields.userData.mapValue.fields.swift.stringValue || '',

      });

    });


    //init Invoice Form

    this.invoiceForm = this.fb.group({
      date: [new Date(), Validators.required],
      invoiceNumber: [this.currentInvoiceNumber, Validators.required],
    })

    this.currentInvoiceNumber = this.invoiceService.getLatsInvoiceNumber().subscribe(number => {
      if (number) {
        this.invoiceForm.patchValue({
          invoiceNumber: String(number) || '',
        })


      }
    });



    //init customer form 

    this.customerForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      vat: ['', [Validators.required, Validators.pattern('^[0-9]{9,12}$')]],
      prefix: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      bankName: [this.loggedInUser?.bankName || '', Validators.required],
      iban: [this.loggedInUser?.iban || '', Validators.required],
      swift: [this.loggedInUser?.swift || '', [Validators.required]],

    })



    // init products form------------------------------------------------------------------------------
    this.productForm = this.fb.group({
      products: this.fb.array([]),
      totalAmount: [{ value: 0, disabled: true }, Validators.required],
    })
    this.products.controls.forEach((control, index) => {
      control.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
        console.log('product control', control);
        this.updateProductInStore(index);


      });
    });

    //this.dataSource = [...this.products.controls];
    //check if have chosed customer and product
    this.route.queryParams.subscribe(params => {

      if (params['customerId']) {
        this.customerId = params['customerId'];
        if (this.customerId) {
          console.log('Received Customer ID from query params:', this.customerId);
        } else {
          console.error('Customer ID not found in query parameters.');
        }
      }
      if (params['productId']) {
       
        this.productId = params['productId'];
        this.productService.getSingleProduct(this.productId).subscribe(product => {
          if (product) {

            product.price = Number(product.fields.price.stringValue) || 0;
            product.pieces = 1;
            product.total = product.price * product.pieces;
            product.index = this.rowIndex;
            //Number(this.products.at(this.rowIndex).get('pieces')?.value) ||
            const transformedProduct = this.transformProduct(product);
            const dataSourceLength = this.dataSource.length - 1;
            if ((product.index < dataSourceLength) && dataSourceLength > 0) {
              this.correctProductInStore(this.rowIndex, transformedProduct)
            } else {
              this.selectProduct(transformedProduct)
              this.loadProducts()
            }
             this.updateTotal()
            this.updateTotalinStore([...product])
            // this.onProductSelect(transformedProduct, this.rowIndex, this.customerId);

            // this.updateTotalAmount(index);
          }

        });


      }
      if (params['rowIndex']) {
        this.rowIndex = params['rowIndex'];

        if (this.rowIndex) {
          console.log('Received rowIndex from query params:', this.rowIndex);
        } else {
          console.error('rowIndex not found in query parameters.');
        }
      } else if (!params['customerId']) {
        this.store.dispatch(InvoiceActions.clearCustomer());
      }

    });


    if (this.customerId) {
      this.customerService.getSingleCustomer(this.customerId).subscribe(customer => {
        if (customer) {
          this.customer = customer;
          this.selectCustomer(customer.fields)
          this.customerForm.patchValue({
            companyName: this.customer.fields.companyName.stringValue || '',
            vat: this.customer.fields.vat.stringValue || '',
            prefix: this.customer.fields.prefix.stringValue || '',
            address: this.customer.fields.address.stringValue || '',
            bankName: this.customer.fields.bankName.stringValue || '',
            iban: this.customer.fields.iban.stringValue || '',
            swift: this.customer.fields.swift.stringValue || '',
          });
        } else {
          console.error('Customer not found.');
        }
      });
    } else {
      this.store.select(selectSelectedCustomer).subscribe((customer) => {
        console.log('from store:', customer);

        if (customer) {
          this.isCustomerSelected = true;
          this.updateCustomerFields(customer);
        }
      });

    }

    this.loadProducts();

    this.store.select(selectInvoiceTotal).subscribe(value => {
      this.totalAmount = value;
      this.totalInWords = this.numberToWords(value);
      this.vatRate = value / 6;
      this.amountExclVat = value / 1.2;
      this.changeDetector.detectChanges();
    });



  }

  ngOnDestroy(): void {
    // Изчистване на стора при напускане на компонента
    if (!this.isExitingInvoice) {
      this.store.dispatch(InvoiceActions.clearInvoice());
      this.store.dispatch(InvoiceActions.clearCustomer());
      this.store.dispatch(InvoiceActions.setNewInvoice({ isNewInvoice: true }));
    }
  }



  // Create an individual product form group
  get products(): FormArray {
    console.log(this.productForm.get('products') as FormArray);

    return this.productForm.get('products') as FormArray;
  }


  createProductRow(product: any = null): FormGroup {

    return this.fb.group({
      button: new FormControl('Select'),
      productName: new FormControl(product ? product.name : '', Validators.required),
      pieces: new FormControl(1, [Validators.required, Validators.min(1)]),
      price: new FormControl(product ? product.price : '', [Validators.required, Validators.min(0)]),
      total: new FormControl({ value: product ? product.price : 0, disabled: true })
    });
  }


  addProduct(): void {

    const productForm = this.createProductRow();
    this.products.push(productForm);

    this.dataSource = [... this.products.controls];
    console.log('Data source 310', this.dataSource);


    this.changeDetector.detectChanges();
  }

  deleteProductRow(index: number): void {

    const productsArray = this.productForm.get('products') as FormArray;

    if (productsArray.length >= 1) {
      productsArray.removeAt(index);
      this.dataSource = [...this.products.controls];

    } else {
      console.warn('At least one product must remain in the list.');
      productsArray.removeAt(index);
      this.products.push(this.createProductRow());
      this.dataSource = [...this.products.controls];
    }
    this.removeProduct(index)

    this.changeDetector.detectChanges();
    if (productsArray.length == 0) {
      this.products.push(this.createProductRow());
      this.changeDetector.detectChanges();
    }

  }

  onProductSelect(product: any, index: number, customerId: any, savedProducts: any): void {

    while (this.products.length <= index) {
      this.addProduct();
    }

    const productRow = this.products.at(index) as FormGroup;

    if (productRow) {
      productRow.patchValue({
        productName: product.productName,
        pieces: product.pieces,
        price: product.price,
        total: (product.price) * Number(product.pieces),
        index: index
      });
    } else {
      console.warn(`No product control found at index ${index}`);
    }


    this.updateTotalAmount(index);

  }


  transformProduct(raw: any) {
    return {
      productName: raw.fields?.productName?.stringValue || "",
      pack: raw.fields?.pack?.stringValue || "",
      price: typeof raw.fields?.price?.stringValue === 'string' ? raw.fields?.price?.stringValue : String(Number(raw.fields?.price?.stringValue) || 0),
      productCode: raw.fields?.productCode?.stringValue || "",
      createTime: raw.createTime || "",
      updateTime: raw.updateTime || "",
      pieces: raw.pieces,
      index: raw.index,
      total: raw.total


    };
  };

  goToCustomerList() {
    this.router.navigate(['customers/customersList']);
  }

  goToProductsList(index: number) {

    this.router.navigate(['products/productsList'], { queryParams: { rowIndex: index, customerId: this.customerId } });
  }

  createInvoice() {
    const userId=this.auth.getUserId();
    this.userForm.patchValue({ userId });
    const total=this.totalAmount;

    const productsArray = this.productForm.get('products')?.value || [];

    const productsFirestoreFormat = {
      arrayValue: {
        values: productsArray
          .filter((p: { productName: any; pieces: any; price: any; }) => p.productName && p.pieces && p.price) // Skip empty products
          .map((product: { productName: any; pieces: any; price: string; }) => ({
            mapValue: {
              fields: {
                productName: { stringValue: product.productName },
                pieces: { integerValue: String(product.pieces) },
                price: { doubleValue: parseFloat(product.price) }
              }
            }
          }))
      }
    };
    
    if (this.userForm.valid && this.customerForm.valid && this.invoiceForm.valid && this.productForm.valid) {

      const combinedData = {
        userData:this.userForm.value,
        customerData:this.customerForm.value,
        productsData:productsFirestoreFormat,
        invoiceData:this.invoiceForm.value,
        total:total
      };
      console.log(combinedData);


      this.invoiceService.createInvoice(combinedData).subscribe({
        next: (response: any) => {

          if (response && response.message === 'User data is invalid or missing') {

            this.snackBar.openSnackBar('Failed to create customer. Reason: ' + response.message, 'Close');
            return;
          }
          // Successful registration
          this.snackBar.openSnackBar('Successful save new invoice No ' + combinedData.invoiceData.invoiceNumber, 'Close');
          this.router.navigate(['/invoices/invoiceForm']).then(() => {
            this.invoiceForm.reset(); 
          });;
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

  selectCustomer(customer: Customer) {

    //this.selectedCustomerData = customer;
    this.store.dispatch(InvoiceActions.selectCustomer({ customer }));

    this.store.select(selectInvoiceState).subscribe((state) => {
      console.log('Invoice State:', state);
      if (state) {
        console.log('Data exists:', state);
      } else {
        console.log('No data in the state.');
      }
    });

  }

  selectProduct(product: any) {

    this.store.dispatch(InvoiceActions.addsProduct({ product }));
    // this.loadProducts();
    this.store.select(selectInvoiceState).subscribe((state) => {
      console.log('Invoice State:', state);
      if (state) {
        console.log('Product exists:', state);
      } else {
        console.log('No data in the state.');
      }
    });

  }

  loadProducts() {
    this.store.select(loadSavedProducts).pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      take(1)
    ).subscribe((savedProducts) => {
      console.log(savedProducts);
      if (savedProducts.length > 0) {

        savedProducts.forEach((product, index) => {

          this.onProductSelect(product, index, this.customerId, savedProducts);
          // this.totalAmount = this.updateTotal(savedProducts);
          this.updateTotalinStore(savedProducts)
          // if (savedProducts.length >= index) {
          //   this.addProduct();
          // }


        });
        // this.addProduct();
      }
      else {
        this.addProduct();
      }
    });
  }

  // to redux

  // addsProduct(product: Product) {
  //   this.store.dispatch(InvoiceActions.addsProduct({ product }));
  // }

  updateTotalinStore(products: Product[]) {
    this.store.dispatch(InvoiceActions.updateTotalinStore({ products }));
  }
  removeProduct(index: number) {
    this.store.dispatch(InvoiceActions.removeProduct({ index }));
  }

  clearInvoice() {
    this.store.dispatch(InvoiceActions.clearInvoice());
  }


  private updateCustomerFields(customer: any): void {
    this.customerForm.patchValue({
      companyName: customer.companyName?.stringValue || '',
      vat: customer.vat.stringValue || '',
      prefix: customer.prefix.stringValue || '',
      address: customer.address.stringValue || '',
      bankName: customer.bankName.stringValue || '',
      iban: customer.iban.stringValue || '',
      swift: customer.swift.stringValue || '',
    });



  }
  trackByIndex(item: any): number {
    return item.productCode || '';
  }

  updateTotal() {
    let sum = 0;
    this.products.controls.forEach(control => {
      const total = Number(control.get('total')?.value) || 0;
      sum += total;
    });
  
    this.amountExclVat = sum/1.2;
    this.vatRate = sum/6 // example 0.20
    this.totalAmount = sum;

  }

  updateTotalAmount(index: number) {
  
    const control = this.productForm.get(['products', index]);
    if (control) {
      const quantity = control.get('pieces')?.value || 0;
      const price = control.get('price')?.value || 0;
      const total = quantity * price;

      control.get('total')?.setValue(total, { emitEvent: true });
      const product = control.value as Product;
      this.updateTotal();
      this.totalInWords =this.numberToWords(this.totalAmount)
      this.store.dispatch(InvoiceActions.updateProduct({ index, product }));
      this.cdr.detectChanges();
    };
  }

  updateProductInStore(index: number) {
    const productRow = this.products.at(index) as FormGroup;

    const updatedProduct: Product = {
      ...productRow.value,
      total: Number(productRow.get('pieces')?.value) * Number(productRow.get('price')?.value),
    };

    this.store.dispatch(InvoiceActions.updateStoredProducts({ index, product: updatedProduct }));
    // this.dataSource = this.products.controls.map(control => control.value);

    this.updateProductFields(updatedProduct, index)
    // this.updateTotal();


  }

  correctProductInStore(index: number, product: any) {

    const updatedProduct: Product = product

    this.store.dispatch(InvoiceActions.updateStoredProducts({ index, product: updatedProduct }));
    // this.dataSource = this.products.controls.map(control => control.value);

    //this.updateProductFields(updatedProduct, index)
    //this.updateTotalAmount();


  }

  private updateProductFields(product: any, index: number): void {
    const productRow = this.products.at(index) as FormGroup;

    productRow.patchValue({
      productName: product.productName,
      pieces: product.pieces,
      price: product.price,
      total: product.price * Number(productRow.get('pieces')?.value),
    });



  }

  numberToWords(value: number): string {
    const leva = Math.floor(value);
    const stotinki = Math.round((value - leva) * 100);

    const levaText = this.convertNumberToWords(leva);
    const stotinkiText = stotinki > 0 ? ` и ${this.convertNumberToWords(stotinki)} стотинки` : '';

    return `${levaText} лева${stotinkiText}`;
  }

  convertNumberToWords(num: number): string {
    const ones = ['нула', 'едно', 'две', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'];
    const teens = ['десет', 'единадесет', 'дванадесет', 'тринадесет', 'четиринадесет', 'петнадесет', 'шестнадесет', 'седемнадесет', 'осемнадесет', 'деветнадесет'];
    const tens = ['', '', 'двадесет', 'тридесет', 'четиридесет', 'петдесет', 'шестдесет', 'седемдесет', 'осемдесет', 'деветдесет'];
    const hundreds = ['', 'сто', 'двеста', 'триста', 'четиристотин', 'петстотин', 'шестстотин', 'седемстотин', 'осемстотин', 'деветстотин'];
    const tousends = ["", 'хиляда', 'две хиляди', 'три хиляди', 'четири хиляди', 'пет хиляди', 'шест хиляди', 'седем хиляди', 'осем хиляди', 'девет хиляди'];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return one ? `${tens[ten]} и ${ones[one]}` : `${tens[ten]}`;
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const rest = num % 100;
      return rest ? `${hundreds[hundred]} и ${this.convertNumberToWords(rest)}` : `${hundreds[hundred]}`;
    }
    if (num < 10000) {
      const tousend = Math.floor(num / 1000);;
      const rest = num % 1000;
      return rest ? `${tousends[tousend]} ${this.convertNumberToWords(rest)}` : `${tousends[tousend]} хиляди`;
    }
    return 'неподдържано число';
  }

  

}
