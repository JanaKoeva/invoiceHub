import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, defaultIfEmpty, filter, map, of, switchMap, throwError } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { T } from '@angular/cdk/keycodes';
import { Customer } from '../interfaces/customer';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  userId: any
  idToken: any


  constructor(private http: HttpClient, private userService: UserService, private authService: AuthService) { }

  getCustomers(): any {

    return this.authService.getUserData().pipe(

      // filter((userData): userData is { userId: string; token: string, email:string } => 
      //   !!userData && !!userData.userId && !!userData.token&& !!userData.email

      // ),
      switchMap((userData) => {
        console.log(userData);
        this.userId = userData?.userId;
        this.idToken = userData?.idToken

        const url = `/api/database/loaddata/${this.userId}/customers`;
        const headers = { Authorization: `Bearer ${this.idToken}` };

        return this.http.get<{ documents: Customer[] }>(url, { headers }).pipe(
          map(response => response.documents || []),
          catchError((error) => {
            console.error('Error fetching customers:', error);
            return of([]);
          })
        );
      }),

      defaultIfEmpty([])
    );
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
      } else if (Array.isArray(value)) {
        // Handle arrays, if necessary (you may want to store arrays in Firestore as an array of values)
        firestoreFields[key] = {
          arrayValue: {
            values: value.map((item: any) => this.convertToFirestoreFields(item)) // Recursively convert array items
          }
        };
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects
        firestoreFields[key] = {
          mapValue: {
            fields: this.convertToFirestoreFields(value), // Recursively convert nested objects
          }
        };
      }
    });

    return firestoreFields;

  }

  createCustomer(data: any): Observable<any> {

    return this.authService.getUserData().pipe(
      switchMap((userData: any) => {

        if (userData) {
          this.userId = userData.userId;
          this.idToken = userData.token;
          console.log('User ID:', this.userId, 'ID Token:', this.idToken);

          const customerPayload = {
            fields: {
              companyName: { stringValue: data.companyName },
              country: { stringValue: data.country },
              vat: { stringValue: data.vat },
              prefix: { stringValue: data.prefix },
              address: { stringValue: data.address },
              email: { stringValue: data.email },
              phone: { stringValue: data.phone },
              name: { stringValue: data.name }
            }
          };

          // API call to create customer in Firestore
          const url = `/api/database/customer/create/${this.userId}/customers`;
          const headers = { Authorization: `Bearer ${this.idToken}` };

          return this.http.post(url, customerPayload, { headers });
        } else {
          console.error('User data is invalid or missing.');
          return of(null);
        }
      }),
      catchError((error) => {
        console.error('Error creating customer:', error);
        return of(error);
      })
    );
  }


  getSingleCustomer(id: any) {

    return this.authService.getUserData().pipe(


      switchMap((userData) => {
        console.log(userData);
        this.userId = userData?.userId;
        this.idToken = userData?.idToken
        id = id;
        // /api/database/users/{userId}/customers/{documentId}/customers/{customerId}
        const url = `/api/database/getSingle/${this.userId}/customers/${id}`;
        console.log(url);

        const headers = { Authorization: `Bearer ${this.idToken}` };


        return this.http.get<any>(url).pipe(
          map(response => {
            console.log(response);

            // Assuming the response has 'fields' property to map into 'Customer'
            return response;
          }),
          catchError((error) => {
            console.error('Error fetching customers:', error);
            return of([]);
          })
        );
      }),

      defaultIfEmpty([])
    );
  }

  deleteCustomer(customerId: string): Observable<void> {
    return this.authService.getUserData().pipe(
      switchMap((userData) => {
        this.userId = userData?.userId;
        this.idToken = userData?.idToken

        const url = `/api/database/deleteCustomer/${this.userId}/customers/${customerId}`;

        return this.http.delete<void>(url).pipe(
          catchError((error) => {
            console.error('Error deleting customer:', error);
            return throwError(() => new Error('Failed to delete customer.'));
          })
        )
      }))
  }




  updateCustomer(data: any, documentId: string): Observable<any> {

    return this.authService.getUserData().pipe(
      switchMap((userData: any) => {


        if (userData) {
          this.userId = userData.userId;
          this.idToken = userData.token;
          console.log('User ID:', this.userId, 'ID Token:', this.idToken);

          const customerPayload = {
            fields: {
              companyName: { stringValue: data.companyName },
              country: { stringValue: data.country },
              vat: { stringValue: data.vat },
              prefix: { stringValue: data.prefix },
              address: { stringValue: data.address },
              email: { stringValue: data.email },
              phone: { stringValue: data.phone },
              name: { stringValue: data.name },
              iban: { stringValue: data.iban },
              swift: { stringValue: data.swift },
              bankName: { stringValue: data.bankName },
            }
          };

          // API call to update customer in Firestore
          const url = `/api/database/editCustomer/${this.userId}/customers/${documentId}`;
          // const headers = { Authorization: `Bearer ${this.idToken}` };

          return this.http.patch(url, customerPayload,);
        } else {
          console.error('User data is invalid or missing.');
          return of(null);
        }
      }),
      catchError((error) => {
        console.error('Error creating customer:', error);
        return of(error);
      })
    );

  }


}
