import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ExpansionComponent } from '../expansion/expansion.component';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { Observable, startWith, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-stepper',
	standalone: true,
	imports: [CommonModule, DemoMaterialModule, FormsModule, ReactiveFormsModule, ExpansionComponent, MatInputModule],
	templateUrl: './stepper.component.html',
	styleUrls: ['./stepper.component.scss'],
	providers: [{
		provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
	}]
})
export class StepperComponent implements OnInit {

	countries: { name: string, prefix: string }[] = [];
	filteredCountries!: Observable<string[]>;


	optionalfirstFormGroup: FormGroup = Object.create(null);
	optionalsecondFormGroup: FormGroup = Object.create(null);
	isOptional = false;


	constructor(private _formBuilder: FormBuilder, private http: HttpClient) { }

	ngOnInit(): void {

		// create fg
		this.optionalfirstFormGroup = this._formBuilder.group({
			name: ['', Validators.required],
			country: ['', [Validators.required]],
			vat: ['', [Validators.required, Validators.pattern('^[0-9]{9,12}$')]],
			prefix: ['', Validators.required],
			address: ['', Validators.required],
			bankName: ['', Validators.required],
			iban: ['', Validators.required],
			swift: ['', Validators.required],
		});
 console.log();
 

	///this.filteredCountries = this.countries;
		this.optionalsecondFormGroup = this._formBuilder.group({
			optionalsecondCtrl: ['', Validators.required]
		});


		//fetch data
		this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(data => {
			this.countries = data.map(country => {
				const name = country.name?.common || 'Unknoun country';
				const prefix = country.altSpellings[0]
					? `${country.altSpellings?.[0] || ''}` : '';
				// console.log({ name, prefix });

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
	
	

	onSubmit() {
		if (this.optionalfirstFormGroup.valid) {
			console.log('Selected country:', this.optionalfirstFormGroup.get('countryControl')!.value);
		} else {
			console.log('Form is invalid');
		}
	}
}
