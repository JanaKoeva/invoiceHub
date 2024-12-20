import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, catchError, from, map, of, switchMap, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environment/environment.development';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthResponse } from '../interfaces/authResponce';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  ACCESS_TOKEN: any

  constructor(private authService: AuthService, private http: HttpClient, private afAuth: AngularFireAuth, private firestore: AngularFirestore) {

  }


  login(email: string, password: string) {
    const payload = {
      email: email,
      password: password,
      returnSecureToken: true,
    };


    return this.http.post<AuthResponse>('/api/login', payload)

  }
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCfexypHBvDSXGk9OhRy_nktWRyZ6HmawI

  register(data: any): Observable<any> {
    //add the user in Authentication
    const body = {
      email: data.email,
      password: data.password,
      returnSecureToken: true
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post('/api/register', body, { headers }).pipe(
      switchMap((response: any) => {
        const userId = response.localId;
        const idToken = response.idToken;

        console.log(userId, idToken);

        const firestorePayload = {
          fields: {
            userData: {
              mapValue: {
                fields: {
                  companyName: { stringValue: data.companyName },
                  country: { stringValue: data.country },
                  vat: { stringValue: data.vat },
                  prefix: { stringValue: data.prefix },
                  address: { stringValue: data.address },
                  bankName: { stringValue: data.bankName },
                  iban: { stringValue: data.iban },
                  swift: { stringValue: data.swift },
                  name: { stringValue: data.name },
                  email: { stringValue: data.email },
                  phone: { stringValue: data.phone },
                  password: { stringValue: data.password },
                }

              },
            },
          },
        }

        return this.storeUserInFirestore(userId, idToken, firestorePayload);
      })



    )


  }

  private storeUserInFirestore(userId: string, idToken: string, firestorePayload: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    });

    const userUrl = `/api/create/register/${userId}`;

    return this.http.post(userUrl, firestorePayload, { headers });
  }

  private convertToFirestoreFields(data: any): any {
    const firestoreFields: any = {};

    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (typeof value === 'string') {
        firestoreFields[key] = { stringValue: value };
      } else if (typeof value === 'number') {
        firestoreFields[key] = { integerValue: value };
      } else if (typeof value === 'boolean') {
        firestoreFields[key] = { booleanValue: value };
      } else if (typeof value === 'object' && value !== null) {
        firestoreFields[key] = {
          mapValue: {
            fields: this.convertToFirestoreFields(value),
          },
        };
      }
    });

    return firestoreFields;
  }




  getCompanyData(): Observable<any> {
    return this.authService.getUserData().pipe(
      switchMap((user) => {
        if (!user || !user.userId || !user.idToken) {
          throw new Error('User not authenticated');
        }

        const idToken = user.idToken;
        const userId = user.userId;

        const headers = new HttpHeaders({
          Authorization: `Bearer ${idToken}`
        });

        // Update URL structure based on userId
        const url = `/api/database/loaddata/${userId}/userData.json`;

        return this.http.get<any>(url, { headers }).pipe(
          catchError((error) => {
            console.error('Error fetching company data', error);
            return throwError(() => error);
          })
        );
      })
    );
  }
  logout() {
    localStorage.clear();
  }


}


