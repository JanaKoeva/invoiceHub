import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, startWith, map, switchMap, tap, catchError, throwError } from 'rxjs';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { EmailValidator, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { matchPasswordValidator } from '../../utils/matchPasswordsValidator';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SnackbarService } from '../../services/openSnackBar.service';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterComponent {


  countries: { name: string, prefix: string }[] = [];
  filteredCountries!: Observable<string[]>;


  optionalfirstFormGroup: FormGroup = Object.create(null);
  optionalsecondFormGroup: FormGroup = Object.create(null);
  isOptional = false;


  constructor( private authService:AuthService, private router: Router, private userService: UserService, private fb: FormBuilder, private http: HttpClient, private snackBar:SnackbarService) { }

  ngOnInit(): void {
   
    // create fg
    this.optionalfirstFormGroup = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', [Validators.required]],
      vat: ['', [Validators.required, Validators.pattern('^[0-9]{9,12}$')]],
      prefix: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      bankName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      iban: ['', [Validators.required, Validators.pattern(/[A-Z]{2}[0-9]{2}[A-Z]{4}[0-9]{14}/)]],
      swift: ['', [Validators.required, Validators.pattern(/^[A-Z]{6}/)]],
    });
    
    this.optionalsecondFormGroup = this.fb.group({
      name: ['',[ Validators.required,Validators.pattern(/[A-Z][a-z]+\s[A-Z][a-z]+/), Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)]],
      phone: ['', [Validators.required,Validators.pattern(/\d{9}/)]],
      passGroup: this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(5)]],
          repass: ['', Validators.required]
        },
        {
          validators: [matchPasswordValidator('password', 'repass')]
        }
      )
    });
     console.log(this.optionalsecondFormGroup);


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

 
  register() {

    console.log(this.optionalsecondFormGroup);
    
        if (this.optionalfirstFormGroup.valid && this.optionalsecondFormGroup.valid) {

      const combinedData = {
        ...this.optionalfirstFormGroup.value,
        ...this.optionalsecondFormGroup.value,
        password: this.optionalsecondFormGroup.value.passGroup.password,

      };

     
        this.userService.register(combinedData).subscribe({
          next: (response: any) => { const userData = {
            idToken: response.idToken, // Получено от бекенда
            userId: response.localId,  // Получено от бекенда
            email: combinedData.email,
          };
  
          localStorage.setItem('firebaseIdToken', userData.idToken);
          localStorage.setItem('firebaseUserEmail', userData.email);
          localStorage.setItem('firebaseUserId', userData.userId);
  
          this.authService.setUserData(userData);
          this.snackBar.openSnackBar('Registration and login successful!', 'Close');
          this.router.navigate(['/']); 
          },
          error: (error: any) => {
            // Handling errors from Firebase
            if (error.error?.error?.message === 'EMAIL_EXISTS') {
              this.snackBar.openSnackBar('This email is already registered. Please use another email.', 'Close');
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

