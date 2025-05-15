import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { SnackbarService } from 'src/app/services/openSnackBar.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerFormComponent {
  @Input() customerData: any; // Optional input for pre-filling the form
  countries: { name: string, prefix: string }[] = [];
  filteredCountries!: Observable<string[]>;
  

  optionalfirstFormGroup: FormGroup = Object.create(null);
  
  isOptional = false;
  isLogged: any;


  constructor( private router: Router,private auth:AuthService, private customerService: CustomerService, private fb: FormBuilder, private http: HttpClient, private snackBar:SnackbarService) { }

  ngOnInit(): void {
    this.isLogged=this.auth.isAuthenticated()

    // create fg
    this.optionalfirstFormGroup = this.fb.group({
      companyName: [this.customerData?.companyName ||'', [Validators.required, Validators.minLength(3)]],
      country: [this.customerData?.country || '', [Validators.required]],
      vat: [this.customerData?.vat || '', [Validators.required, Validators.pattern('^[0-9]{9,12}$')]],
      prefix: [this.customerData?.prefix || '', Validators.required],
      address: [this.customerData?.address || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      bankName: [this.customerData?.bankName || '', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      iban: [this.customerData?.iban || '', [Validators.required, Validators.pattern(/[A-Z]{2}[0-9]{2}[A-Z]{4}[0-9]{14}/)]],
      swift: [this.customerData?.swift || '', [Validators.required, Validators.pattern(/^[A-Z]{6}/)]],
      name: [this.customerData?.name || '',[ Validators.required,Validators.pattern(/[A-Z][a-z]+\s[A-Z][a-z]+/), Validators.minLength(3), Validators.maxLength(30)]],
      email: [this.customerData?.email|| '', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)]],
      phone: [this.customerData?.phone || '', [Validators.required,Validators.pattern(/\d{9}/)]],
    });
    
   


    //fetch data
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(data => {
      this.countries = data.map(country => {
        const name = country.name?.common || 'Unknoun country';
        const prefix = country.altSpellings[0]
          ? `${country.altSpellings?.[0] || ''}` : '';

        return { name, prefix };

      },

      );
      this.setupFilter();
    });
  }



  //filter

  setupFilter() {
    this.filteredCountries = this.optionalfirstFormGroup
      .get('country')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(this.countries.map(c => c.name).filter(name => name.toLowerCase().includes(filterValue)));

    return this.countries.map(c => c.name).filter(name => name.toLowerCase().includes(filterValue));


  }

  onCountrySelect(event: any) {
    const selectedCountry = this.countries.find(c => c.name === event.option.value);
    if (selectedCountry) {
      this.optionalfirstFormGroup.get('prefix')?.setValue(selectedCountry.prefix);
    }

  }

 
  createCustomer() {
   
        if (this.optionalfirstFormGroup.valid ) {

      const combinedData = {
        ...this.optionalfirstFormGroup.value,
        
      };
      console.log(combinedData);
      

        this.customerService.createCustomer(combinedData).subscribe({
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


 


  
}