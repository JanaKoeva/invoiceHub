import { U } from '@angular/cdk/keycodes';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.development';



@Injectable()
export class AppInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.startsWith('/api/register')) {
      const firestoreUrl = environment.apiEndpoints.register;
      const apyKey = environment.firebase.apiKey

      req = req.clone({
        url: req.url.replace('/api/register', `${firestoreUrl}${apyKey}`),
        withCredentials: true,
      })
    } else if (req.url.startsWith('/api/login')) {
      const firestoreUrl = environment.apiEndpoints.proxy;
      const apyKey = environment.firebase.apiKey

      req = req.clone({
        url: req.url.replace(`/api/login`, `${firestoreUrl}${apyKey}`),
        withCredentials: true,
      });
    } else if (req.url.startsWith('/api/create/register')) {

      const firestoreUrl = environment.apiEndpoints.firestore;
      let urlParts = req.url.split('/')
      const userId = urlParts[urlParts.length - 1];


      console.log(userId);


      console.log(`${firestoreUrl}/users/${userId}`);


      req = req.clone({
        url: req.url.replace('/api/create/register', `${firestoreUrl}/users/${userId}`),
        withCredentials: true,
      })
    }
    else if (req.url.startsWith('/api/database/customer/create/')) {

      const firestoreUrl = environment.apiEndpoints.firestore;
      const urlParts = req.url.split('/');
      const collection = urlParts[urlParts.length - 1];
      const userId = urlParts[urlParts.length - 2];

      console.log(userId);
      console.log(collection);

      console.log(`${firestoreUrl}/users/${userId}/${collection}`);


      req = req.clone({
        url: req.url.replace(req.url, `${firestoreUrl}/users/${userId}/${collection}`),
        withCredentials: true,
      })

    } else if (req.url.startsWith('/api/database/loaddata')) {


      const firestoreUrl = environment.apiEndpoints.firestore;
      let urlParts = req.url.split('/')
      const collection = urlParts[urlParts.length - 1];
      const userId = urlParts[urlParts.length - 2]

      req = req.clone({
        url: req.url.replace(req.url, `${firestoreUrl}/users/${userId}/${collection}`),
        withCredentials: true,
      })
    } else if (req.url.startsWith('/api/database/getSingle')) {
      console.log(req.url);

      const firestoreUrl = environment.apiEndpoints.firestore;
      let urlParts = req.url.split('/')
      console.log(urlParts);
      const docId = urlParts[urlParts.length - 1];
      const collection = urlParts[urlParts.length - 2]
      const userId = urlParts[urlParts.length - 3]

      console.log(userId);
      console.log(`${firestoreUrl}/users/${userId}/${collection}/${docId}`);

      // /api/database/users/{userId}/customers/{documentId}/customers/{customerId}
      req = req.clone({
        url: req.url.replace(req.url, `${firestoreUrl}/users/${userId}/${collection}/${docId}`),
        withCredentials: true,
      })
    }else if (req.url.startsWith('/api/database/editCustomer')) {
      console.log(req.url);

      const firestoreUrl = environment.apiEndpoints.firestore;
      let urlParts = req.url.split('/')
      console.log(urlParts);
      const docId = urlParts[urlParts.length - 1];
      const collection = urlParts[urlParts.length - 2]
      const userId = urlParts[urlParts.length - 3]

      console.log(userId);
      console.log(`${firestoreUrl}/users/${userId}/${collection}/${docId}`);
      
      req = req.clone({
        url: req.url.replace(req.url, `${firestoreUrl}/users/${userId}/${collection}/${docId}`),
        withCredentials: true,
      })
    }else if (req.url.startsWith('/api/database/deleteCustomer')) {
      console.log(req.url);

      const firestoreUrl = environment.apiEndpoints.firestore;
      let urlParts = req.url.split('/')
      console.log(urlParts);
      const docId = urlParts[urlParts.length - 1];
      const collection = urlParts[urlParts.length - 2]
      const userId = urlParts[urlParts.length - 3]

      console.log(userId);
      console.log(`${firestoreUrl}/users/${userId}/${collection}/${docId}`);
      
      req = req.clone({
        url: req.url.replace(req.url, `${firestoreUrl}/users/${userId}/${collection}/${docId}`),
        withCredentials: true,
      })
    }

    return next.handle(req);

  }


};

export const appInterceptorProvider: Provider = {
  multi: true,
  useClass: AppInterceptor,
  provide: HTTP_INTERCEPTORS
}
