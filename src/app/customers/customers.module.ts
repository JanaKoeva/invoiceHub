import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';
import { CustomerRoutes } from './cusomers.routing';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { StoreModule } from '@ngrx/store';
import { customerReducer } from './state/customer.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTabsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatCardModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    RouterModule.forChild(CustomerRoutes),
    StoreModule.forFeature('customer', customerReducer),
  ]
})
export class CustomersModule { 
  
}
