import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-expansion',
  standalone: true,
  imports: [DemoMaterialModule,DemoMaterialModule, FormsModule, ReactiveFormsModule, MatInputModule, MatExpansionModule],
  templateUrl: './expansion.component.html',
  styleUrls: ['./expansion.component.scss']
})
export class ExpansionComponent {
  panelOpenState = false;
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  optionalfirstFormGroup: FormGroup = Object.create(null);


  constructor(private _formBuilder: FormBuilder) { }

	ngOnInit() {
		
		// optional
		this.optionalfirstFormGroup = this._formBuilder.group({
			optionalfirstCtrl: ['', Validators.required]
		});
}
}