import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  [x: string]: any;

  constructor(private snackBar: MatSnackBar) {}

 
  openSnackBar(name: string, message: string) {
    this.snackBar.open(`${name}`, `${message}`, {
      duration: 2000,
      panelClass: ['snackbar-success'] 
    });
  }
}
