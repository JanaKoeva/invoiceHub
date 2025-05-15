import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface UserData {
  userId: string;
  email: string;
  idToken: string;
  displayName?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  public userSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
  public user$ = this.userSubject.asObservable();

  public isLogged = new BehaviorSubject<boolean>(false); // Initialize as logged out
 
  // isLogged$ = this.isLogged.asObservable(); // Observable for components to subscribe to

  constructor() {

    this.loadUserFromStorage();

    // this.userSubject = new BehaviorSubject<User | null>(null)
    // const user$ = this.userSubject.asObservable();

    // const userToken = localStorage.getItem('firebaseIdToken');
    // if (userToken) {
    //   // If token exists, try to fetch user data (or any other actions like setting user state)
    //   // this.setUser(userToken);
    // }


  }

  ngOnInit() {

  }


  loadUserFromStorage(): void {
    const storedUserData = {

      userId: localStorage.getItem('firebaseUserId'),
      email: localStorage.getItem('firebaseEmail'),
      idToken: localStorage.getItem('firebaseIdToken')
    }
   

    if (storedUserData.userId && storedUserData.email && storedUserData.idToken) {
      const userData: UserData = {
        userId: storedUserData.userId,
        idToken: storedUserData.idToken,
        email: storedUserData.email
      };
      this.userSubject.next(userData);
      this.isLogged.next(true); // Mark user as logged in
    } else {
      this.userSubject.next(null); // No user found in localStorage
      this.isLogged.next(false); // Not logged in
  
  }}


  // setUserData(userData: any) {
  //   this.userSubject.next(userData);
  // }
  
  getUserData(): Observable<{ userId: string; idToken: string, email: string } | null> {
    console.log('Current user data:', this.userSubject.getValue()); 
    return this.user$
  }

  setUserData(userData: UserData): void {
    
    localStorage.setItem('firebaseUserId', userData.userId);
    localStorage.setItem('firebaseEmail', userData.email);
    localStorage.setItem('firebaseIdToken', userData.idToken);

    // Set the user data in the BehaviorSubject
    this.userSubject.next(userData);
  }

  setLoginStatus(status: boolean) {
    this.isLogged.next(status); 
    console.log();
    
  }
  getAuthToken(): any {
    let token = localStorage.getItem('firebaseIdToken')
    return token;
  }
  getUserId(): any {
    let userId = localStorage.getItem('firebaseUserId')
    return userId;
  }

  isAuthenticated() {
    return localStorage.getItem('firebaseIdToken') !== null;
  };

  isLoggedIn(): boolean {
    const token = localStorage.getItem('firebaseIdToken'); 
    return !!token; 
  }

}
