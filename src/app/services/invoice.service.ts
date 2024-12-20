import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from './user.service';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  initialInvoiceNumber: string = '1000000001'; // Start invoice number
  invoiceNumber!: string;
  lastInvoiceNumber: number = 0;
  clientName: string = '';
  amount: number = 0;
  newInvoiceNumber: string = '';
   userData!: any;
  constructor(private http: HttpClient, private userService:UserService,private authService:AuthService) {
    this.userData=authService.getUserData();
    console.log(this.userData);
    
   }

 
  getLastAndInclementInvoiceNumber(){
    // const url = `${this.apiUrl}/invoice_counter/last_invoice_number`;

    this.http.get('/api/database/loaddata/invoices', this.userData).subscribe(res => {
      const inv:any = res;

      if (inv.length > 0) {
        const lastInvoice = inv.reduce((max:any, inv:any) => {
          const currentInvoiceNumber = parseInt(inv.fields.invoiceNumber.stringValue);
          return currentInvoiceNumber > max ? currentInvoiceNumber : max;
      },0);

       // Увеличаване на последния номер с 1
       this.lastInvoiceNumber = lastInvoice + 1;
       this.newInvoiceNumber = this.lastInvoiceNumber.toString();
    } else {
      // Ако няма фактури, започваме от 1001
      this.newInvoiceNumber = this.initialInvoiceNumber;
    }
  })
return  this.newInvoiceNumber
}

  // incrementInvoiceNumber(): string {
  //   const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD
  //   const number: number = (+this.getLastAndInclementInvoiceNumber() + 1);
  //   this.invoiceNumber = number.toString();
  //   return `INV-${datePart}-${this.invoiceNumber}`;
  // }



  // Създайте нова фактура
  createInvoice(userId: string, invoiceNumber: string, clientName: string, amount: number): Observable<any> {
    const url = `${'/api/database/create'}/users/${userId}/invoices`;
    const body = {
      fields: {
        invoiceNumber: { stringValue: invoiceNumber },
        client: { stringValue: clientName },
        amount: { doubleValue: amount },
        date: { timestampValue: new Date().toISOString() }
      }
    };
    return this.http.post(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
