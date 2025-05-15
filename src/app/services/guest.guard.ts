import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SnackbarService } from './openSnackBar.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,public snackBar: SnackbarService) {}

  canActivate(): boolean {
    console.log(this.authService.isLoggedIn());

    
    if (this.authService.isLoggedIn()) {
      this.snackBar.openSnackBar(`${this.authService.userSubject.getValue()?.email}  is logged already.`, 'Close');
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true; 
  }
}