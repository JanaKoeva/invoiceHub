import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InvoiceService } from 'src/app/services/invoice.service';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as InvoiceActions from './invoice.actions';
import { Action } from '@ngrx/store';

@Injectable()
export class InvoiceEffects {
  constructor(
    private actions$: Actions,
    private invoiceService: InvoiceService
  ) {}


  loadLastInvoiceNumber$ = createEffect((): Observable<Action> =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadLastInvoiceNumber),
      mergeMap(() =>
        this.invoiceService.getLatsInvoiceNumber().pipe(  // Ensure this returns Observable<number>
          map((lastNumber: number) =>
            InvoiceActions.loadLastInvoiceNumberSuccess({ lastNumber })  // Correct action with proper type
          ),
          catchError((error) =>
            of(InvoiceActions.loadLastInvoiceNumberFailure({ error }))  // Error action
          )
        )
      )
    )
  );
}
