import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, defaultIfEmpty, filter, map, of, switchMap, throwError } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  userId:any
  idToken:any
    constructor(private http: HttpClient, private userService: UserService, private authService: AuthService) {
       }

       
  
    // getProducts(): any {
  
    //   return this.authService.getUserData().pipe(
  
      
    //     switchMap((userData) => {
    //       console.log(userData);
    //       this.userId = userData?.userId;
    //       this.idToken = userData?.idToken
  
    //       const url = `/api/database/loaddata/${this.userId}/products`;
    //       // const headers = { Authorization: `Bearer ${this.idToken}` };
  
    //       return this.http.get<{ documents: Customer[] }>(url).pipe(
    //         map(response => response.documents || []),
    //         catchError((error) => {
    //           console.error('Error fetching products:', error);
    //           return of([]);
    //         })
    //       );
    //     }),
  
    //     defaultIfEmpty([])
    //   );
    // }
    getProducts(): Observable<any[]> {
      const url = `/api/database/loaddata/${this.userId}/products`;
      return this.http.get<any[]>(url).pipe(
        catchError((error) => {
          console.error('Error fetching products:', error);
          return throwError(() => new Error('Failed to fetch products.'));
        })
      );;
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
  
    createProduct(data: any): Observable<any> {
 
      return this.authService.getUserData().pipe(
        switchMap((userData: any) => {
  
          if (userData) {
            this.userId = userData.userId;
            this.idToken = userData.token;
            console.log('User ID:', this.userId, 'ID Token:', this.idToken);
  
            const customerPayload = {
              fields: {
                productName: { stringValue: data.productName },
                productCode: { stringValue: data.productCode},
                pack: { stringValue: data.pack },
                price: { stringValue: data.price },
              }
            };
  
            // API call to create product in Firestore
            const url = `/api/database/products/create/${this.userId}/products`;
            const headers = { Authorization: `Bearer ${this.idToken}` };
  
            return this.http.post(url, customerPayload, { headers });
          } else {
            console.error('Product data is invalid or missing.');
            return of(null);
          }
        }),
        catchError((error) => {
          console.error('Error creating product:', error);
          return of(error);
        })
      );
    }
  
  
    getSingleProduct(id: any) {
  
      return this.authService.getUserData().pipe(
  
  
        switchMap((userData) => {
          console.log(userData);
          this.userId = userData?.userId;
          this.idToken = userData?.idToken
          id = id;
          // /api/database/users/{userId}/customers/{documentId}/customers/{customerId}
          const url = `/api/database/getSingle/${this.userId}/products/${id}`;
          console.log(url);
  
          const headers = { Authorization: `Bearer ${this.idToken}` };
  
  
          return this.http.get<any>(url).pipe(
            map(response => {
              console.log(response);
  
              // Assuming the response has 'fields' property to map into 'Customer'
              return response;
            }),
            catchError((error) => {
              console.error('Error fetching product:', error);
              return of([]);
            })
          );
        }),
  
        defaultIfEmpty([])
      );
    }
  
    deleteProduct(customerId: string): Observable<void> {
      return this.authService.getUserData().pipe(
        switchMap((userData) => {
          this.userId = userData?.userId;
          this.idToken = userData?.idToken
  
          const url = `/api/database/deleteCustomer/${this.userId}/products/${customerId}`;
  
          return this.http.delete<void>(url).pipe(
            catchError((error) => {
              console.error('Error deleting product:', error);
              return throwError(() => new Error('Failed to delete product.'));
            })
          )
        }))
    }
  
  
  
  
    updateProduct(data: any, documentId: string): Observable<any> {
  
      return this.authService.getUserData().pipe(
        switchMap((userData: any) => {
  
  
          if (userData) {
            this.userId = userData.userId;
            this.idToken = userData.token;
            console.log('User ID:', this.userId, 'ID Token:', this.idToken);
  
            const customerPayload = {
              fields: {
                
                productName: { stringValue: data.productName },
                productCode: { stringValue: data.productCode},
                pack: { stringValue: data.pack },
                price: { stringValue: data.price },
              }
            };
  
            // API call to update customer in Firestore
            const url = `/api/database/editCustomer/${this.userId}/products/${documentId}`;
            // const headers = { Authorization: `Bearer ${this.idToken}` };
  
            return this.http.patch(url, customerPayload,);
          } else {
            console.error('Product data is invalid or missing.');
            return of(null);
          }
        }),
        catchError((error) => {
          console.error('Error creating product:', error);
          return of(error);
        })
      );
  
    }
  }

