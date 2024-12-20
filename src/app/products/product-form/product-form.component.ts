import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators,EmailValidator, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { SnackbarService } from 'src/app/services/openSnackBar.service';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';
import { matchPasswordValidator } from 'src/app/utils/matchPasswordsValidator';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductFormComponent {
  @Input() customerData: any; // Optional input for pre-filling the form
  countries: { name: string, prefix: string }[] = [];
  filteredCountries!: Observable<string[]>;
  

  optionalfirstFormGroup: FormGroup = Object.create(null);
  
  isOptional = false;
  isLogged: any;


  constructor( private router: Router,private auth:AuthService, private productService: ProductsService, private fb: FormBuilder, private http: HttpClient, private snackBar:SnackbarService) { }

  ngOnInit(): void {
    this.isLogged=this.auth.isAuthenticated()

    // create fg
    this.optionalfirstFormGroup = this.fb.group({
      productName: [this.customerData?.productName ||'', [Validators.required, Validators.minLength(3)]],
      productCode: [this.customerData?.productCode || '', [Validators.required,Validators.pattern('^[0-9]{1,4}$')]],
      pack: [this.customerData?.pack || '', [Validators.required, ]],
      price: [this.customerData?.price || '',[ Validators.required, Validators.min(0)] ],
      
    });
    
  }


  createProduct() {
   
        if (this.optionalfirstFormGroup.valid ) {

      const combinedData = {
        ...this.optionalfirstFormGroup.value,
        
      };
      console.log(combinedData);
      

        this.productService.createProduct(combinedData).subscribe({
          next: (response: any) => {

            if (response && response.message === 'Product data is invalid or missing') {
            
              this.snackBar.openSnackBar('Failed to create product. Reason: ' + response.message, 'Close');
              return;
            }
            // Successful registration
            this.snackBar.openSnackBar('Successful create product!' + combinedData.productName, 'Close');
            this.router.navigate(['/products/productsList']);
          },
          error: (error: any) => {
            
            if (error){
              this.snackBar.openSnackBar('An error occurred during creating. Please try again.', 'Close');
            }
          
        }})
    } else {

      console.log('Form is invalid');
      return;
    }
  }


 


  
}