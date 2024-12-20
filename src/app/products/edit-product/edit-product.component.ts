import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { DemoMaterialModule } from '../../demo-material-module';
import { CustomerService } from '../../services/customer.service';
import { SnackbarService } from '../../services/openSnackBar.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditProductComponent {

  documentId!: string;

  optionalfirstFormGroup: FormGroup = Object.create(null);

  isOptional = false;
  product: any;


  constructor(private changeDetector: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private productService: ProductsService, private fb: FormBuilder, private http: HttpClient, private snackBar: SnackbarService) { }

  ngOnInit(): void {

    this.optionalfirstFormGroup = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      productCode: ['', [Validators.required,Validators.pattern('^[0-9]{1,4}$')]],
      pack: ['', [Validators.required, ]],
      price: ['',[ Validators.required, Validators.min(0)] ],
      
      
    });
    this.editProduct(this.route.snapshot.params['id'])
  }


  editProduct(id: any): void {
    debugger
    if (!id) {
      console.error('Product ID is missing!');
      this.snackBar.openSnackBar('Product ID is missing!', 'Close');
      return;
    }

    this.documentId = id
    this.productService.getSingleProduct(id).subscribe((data) => {
      const responceFields = data.fields;
      console.log('API response:', responceFields);


      this.optionalfirstFormGroup.patchValue({
        productName: responceFields.productName?.stringValue,
        productCode: responceFields.productCode?.stringValue || '',
        pack: responceFields.pack?.stringValue || '',
        price: responceFields.price?.stringValue || '',
        
      });

      console.log('Form patched with data:', this.optionalfirstFormGroup.value);
      this.changeDetector.detectChanges();
    },
      (error) => {
        this.snackBar.openSnackBar('Error fetch!', 'Close');



      })

    console.log('Edit customer:', id);

 
}
updateProduct(){

  if (this.optionalfirstFormGroup.valid) {

    const combinedData = {
      ...this.optionalfirstFormGroup.value,

    };
    console.log(combinedData);
    this.documentId = this.route.snapshot.paramMap.get('id') ?? ''

    this.productService.updateProduct(combinedData, this.documentId).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response && response.message === 'User data is invalid or missing') {

          this.snackBar.openSnackBar('Failed to update product. Reason: ' + response.message, 'Close');
          return;
        }
        // Successful registration
        this.snackBar.openSnackBar('Successful update product!' + combinedData.email, 'Close');
        this.router.navigate(['/products/productsList']);
      },
      error: (error: any) => {

          this.snackBar.openSnackBar('An error occurred during registration. Please try again.', 'Close');
       
    }})
  } else {

    console.log('Form is invalid');
    return;
  }
}

}





