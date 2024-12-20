import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  email: any

  constructor(public authService:AuthService, private userService:UserService, public router:Router){
    this.email= localStorage.getItem('firebaseUserEmail');
  }
  
  logout() {
    this.userService.logout();
    
    this.router.navigate([ '/' ]);
  }
  
}
