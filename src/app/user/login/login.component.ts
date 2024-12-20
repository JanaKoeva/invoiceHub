import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DemoMaterialModule } from '../../demo-material-module';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/openSnackBar.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthService } from '../../services/auth.service';





@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatSnackBarModule, DemoMaterialModule, FormsModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})



export class LoginComponent {
  loginForm: FormGroup = Object.create(null);
  email: any;


  constructor(private authService: AuthService, private afAuth: AngularFireAuth, public snackBar: SnackbarService, private router: Router, private userService: UserService, private fb: FormBuilder, private http: HttpClient) { }



  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)]],
        password: ['', [Validators.required, Validators.minLength(5)]],
      })
  }

  login() {

    if (this.loginForm.valid) {
      const formData = { ...this.loginForm.value, };


      this.userService.login(formData.email, formData.password).subscribe(
        (res) => {
          console.log(res);

          const userData = {
            idToken: res.idToken,
            userId: res.localId,
            email: res.email,
          };
          console.log(res);
          const idToken = userData.idToken;
          const userId = userData.userId;
          localStorage.setItem('firebaseIdToken', idToken);
          localStorage.setItem('firebaseUserEmail', formData.email);
          localStorage.setItem('firebaseUserId', userId);
          
          this.authService.setUserData(userData);
          this.snackBar.openSnackBar(`${formData.email} logged in successfully.`, 'Close');
          this.router.navigate(['/']);
        },
        (error: any) => {
          console.error('Login error:', error);
          if (error.error && error.error.error.message === 'INVALID_PASSWORD') {
            this.snackBar.openSnackBar('Invalid password. Please try again.', 'Close');
          } else {
            this.snackBar.openSnackBar('An error occurred during login. Please try again.', 'Close');
          }
        })

    } else {
      this.snackBar.openSnackBar('Please fill in the form correctly.', 'Close');
      console.log('Form is invalid');
      return;
    }
  }


}

