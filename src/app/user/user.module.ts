import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardRoutes } from '../dashboard/dashboard.routing';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { initializeApp } from '@angular/fire/app';
import { AuthService } from '../services/auth.service';


export const UserRoutes: Routes = [
  {
  path: 'register',
  component: RegisterComponent
},
{
  path: 'login',
  component: LoginComponent
}
];



@NgModule({
  
  declarations: [
    
  ],
  imports: [
    RegisterComponent,
    LoginComponent,
    CommonModule,
    RouterModule.forChild(UserRoutes),
    MatCardModule,
  ],
  providers:[
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true,
    },
  ],
})
export class UserModule { }
