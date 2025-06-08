import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from './user.service';
import { Subject, catchError, defaultIfEmpty, map, of, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  userId: any
  idToken: any
  initialInvoiceNumber: string = '1000000001'; // Start invoice number
  invoiceNumber!: number;
  lastInvoiceNumber: number = 0;
  clientName: string = '';
  amount: number = 0;
  newInvoiceNumber: string = '';
  userData!: any;

  constructor(private http: HttpClient, private userService: UserService, private authService: AuthService) {

    this.userData = authService.getUserData();

  }


  getLatsInvoiceNumber(): Observable<any> {
    
    return this.userData.pipe(
      take(1), 
      switchMap((data: any) => {
        const userId = data?.userId;
  
        if (!userId) {
          console.warn('No userId found in userData');
          return of(this.initialInvoiceNumber);
        }
        console.log('User ID:', userId);
        const body = {
          userId,
          //parent: `projects/invoicehub-467aa/databases/(default)/documents/users/${userId}/invoices`,
            parent: `projects/invoicehub-467aa/databases/(default)/documents/users/${userId}`,
          structuredQuery: {
            from: [{ collectionId: 'invoices' }],
            // where: {
            //   fieldFilter: {
            //     field: { fieldPath: 'userId' },
            //     op: 'EQUAL',
            //     value: { stringValue: userId }
            //   }
            // },
            orderBy: [
              {
                field: { fieldPath: 'invoiceNumber' },
                direction: 'DESCENDING'
              }
            ],
            limit: 1,
           
          }
        };
        console.log('Request Body:', JSON.stringify(body, null, 2));
        const url = '/api/database/lastInvoice'
        //const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
  
        return this.http.post<any[]>(url, body);
      }),
      map((res: any[]) => {
        
      // Log the full response for debugging purposes
      console.log('Response:', res);

      // Check if response contains a document
      if (res.length > 0 && res[0]?.document?.fields) {
        // Access the invoiceNumber field properly
        const invoiceField = res[0]?.document?.fields?.invoiceNumber?.stringValue;
        
        if (invoiceField) {
          console.log('Last Invoice Number (String):', invoiceField);

          // Parse invoiceNumber (string to number)
          const lastInvoice = parseInt(invoiceField, 10);

          if (!isNaN(lastInvoice)) {
            console.log('Last Invoice Number (Parsed):', lastInvoice);
            return lastInvoice + 1;  // Add 1 to the last invoice number
          } else {
            console.warn('Invalid invoiceNumber format:', invoiceField);
            return this.initialInvoiceNumber;
          }
        } else {
          console.warn('No invoiceNumber field in response.');
          return this.initialInvoiceNumber;
        }
      } else {
        console.warn('No invoices found or document structure is unexpected.');
        return this.initialInvoiceNumber;
      }
      }),
      catchError((error) => {
        console.error('Error fetching last invoice number:', error);
        return of(this.initialInvoiceNumber);
      })
    );


  }


  getAll(): any {

    return this.authService.getUserData().pipe(
      switchMap((userData) => {
        console.log(userData);
        this.userId = userData?.userId;
        this.idToken = userData?.idToken

        const url = `/api/database/loadAllInvoices/users/${this.userId}/invoices`;


        return this.http.get<{ documents: [] }>(url).pipe(
          map(response => response.documents || []),
          catchError((error) => {
            console.error('Error fetching products:', error);
            return of([]);
          })
        );
      }),

      defaultIfEmpty([])
    );
  }

  // Създаване на нова фактура
  createInvoice(data: any): Observable<any> {
    const url = `${'/api/database/invoices/create'}/users/${data.userData.userId}`;
   
    const body = {
      fields: {
        invoiceNumber: {  stringValue: data.invoiceData.invoiceNumber 
          },
            
       
        customer: {
          mapValue: {
            fields: {
              companyName: { stringValue: data.customerData.companyName },
              address: { stringValue: data.customerData.companyName },
              vat: { stringValue: data.customerData.vat },
              prefix: { stringValue: data.customerData.prefix },
              bankName: { stringValue: data.customerData.bankName },
              iban: { stringValue: data.customerData.prefix },
              swift: { stringValue: data.customerData.swift },
            }
          }
        },
    date: {
      timestampValue: data.invoiceData.date
    },
        amount: {
          mapValue: {
            fields: { 
              total: { doubleValue: data.total } 
            }
          }
        }, products: data.productsData,
      }
        
      }
      console.log(JSON.stringify(body, null, 2));
    return this.http.post(url, body, {

    });
  }

}
