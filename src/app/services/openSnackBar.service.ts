import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  [x: string]: any;

  constructor(private snackBar: MatSnackBar) {}

 
  openSnackBar(email: string, message: string) {
    this.snackBar.open(`${email}: ${message}`, 'Close', {
      duration: 2000,
      panelClass: ['snackbar-success'] 
    });
  }
}
