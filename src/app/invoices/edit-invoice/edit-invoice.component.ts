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
import { T } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-invoice.component.html',
  styleUrl: './edit-invoice.component.scss',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditInvoiceComponent {

  countries: { name: string, prefix: string }[] = [];
  filteredCountries!: Observable<string[]>;
  documentId!: string;

  optionalfirstFormGroup: FormGroup = Object.create(null);

  isOptional = false;
  customer: any;


  constructor(private changeDetector: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private customerService: CustomerService, private fb: FormBuilder, private http: HttpClient, private snackBar: SnackbarService) { }

  ngOnInit(): void {

    this.optionalfirstFormGroup = this.fb.group({
      companyName: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      vat: ['', Validators.required],
      bankName: ['', Validators.required],
      swift: ['', Validators.required],
      iban: ['', Validators.required],
      prefix: ['', Validators.required],
    });
    this.editCustomer(this.route.snapshot.params['id'])
  }


  editCustomer(id: any): void {
    if (!id) {
      console.error('Customer ID is missing!');
      this.snackBar.openSnackBar('нее намерен ID за редакция!', 'Затвори');
      return;
    }

    this.documentId = id
    this.customerService.getSingleCustomer(id).subscribe((data) => {
      const responceFields = data.fields;
      console.log('API response:', responceFields);


      this.optionalfirstFormGroup.patchValue({
        companyName: responceFields.companyName?.stringValue,
        name: responceFields.name?.stringValue || '',
        email: responceFields.email?.stringValue || '',
        phone: responceFields.phone?.stringValue || '',
        address: responceFields.address?.stringValue || '',
        country: responceFields.country?.stringValue || '',
        vat: responceFields.vat?.stringValue || '',
        prefix: responceFields.prefix?.stringValue || '',
        bankName: responceFields.bankName?.stringValue || '',
        swift: responceFields.swift?.stringValue || '',
        iban: responceFields.iban?.stringValue || '',
      });

      console.log('Form patched with data:', this.optionalfirstFormGroup.value);
      this.changeDetector.detectChanges();
    },
      (error) => {
        this.snackBar.openSnackBar('Грешка при зареждане на данни!', 'Затвори');



      })

    console.log('Edit customer:', id);

    // this.router.navigate(['/customers/customersList']);



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


  updateCustomer() {

    if (this.optionalfirstFormGroup.valid) {

      const combinedData = {
        ...this.optionalfirstFormGroup.value,

      };
      console.log(combinedData);
      this.documentId = this.route.snapshot.paramMap.get('id') ?? ''

      this.customerService.updateCustomer(combinedData, this.documentId).subscribe({
        next: (response: any) => {
          console.log(response);

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








