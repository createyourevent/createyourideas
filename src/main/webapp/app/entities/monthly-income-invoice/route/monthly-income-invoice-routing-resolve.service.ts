import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMonthlyIncomeInvoice, MonthlyIncomeInvoice } from '../monthly-income-invoice.model';
import { MonthlyIncomeInvoiceService } from '../service/monthly-income-invoice.service';

@Injectable({ providedIn: 'root' })
export class MonthlyIncomeInvoiceRoutingResolveService implements Resolve<IMonthlyIncomeInvoice> {
  constructor(protected service: MonthlyIncomeInvoiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMonthlyIncomeInvoice> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((monthlyIncomeInvoice: HttpResponse<MonthlyIncomeInvoice>) => {
          if (monthlyIncomeInvoice.body) {
            return of(monthlyIncomeInvoice.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MonthlyIncomeInvoice());
  }
}
