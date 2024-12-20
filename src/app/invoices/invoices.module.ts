import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input'; // If using mat-datepicker with input
import { MatFormFieldModule } from '@angular/material/form-field'; // If using form fields
import { MatNativeDateModule } from '@angular/material/core'; // For native date handling
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { InvoicesRoutes } from './invoices.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
     MatTable, 
     MatIcon, 
     MatButton,
    RouterModule.forChild(InvoicesRoutes),
    MatCardModule,
    MatSelectModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTableModule,

  ]
})
export class InvoicesModule {



 }
