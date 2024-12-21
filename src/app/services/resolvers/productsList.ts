import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, catchError, defaultIfEmpty, forkJoin, map, of, switchMap, zip } from "rxjs";
import { ProductsService } from "../products.service";
import { AuthService } from "../auth.service";
import { Customer } from "src/app/interfaces/customer";
import { HttpClient } from "@angular/common/http";


@Injectable({ providedIn: 'root' })
export class ProductListResolver implements Resolve<any> {

    constructor(private http: HttpClient, private productService: ProductsService, private authService: AuthService) { }

    userId: any
    idToken: any
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {


        return this.authService.getUserData().pipe(


            switchMap((userData) => {
                console.log(userData);
                this.userId = userData?.userId;
                this.idToken = userData?.idToken

                const url = `/api/database/loaddata/${this.userId}/products`;
                // const headers = { Authorization: `Bearer ${this.idToken}` };

                return this.http.get<{ documents: Customer[] }>(url).pipe(
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
}