import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMonthlyOutgoingsInvoice, MonthlyOutgoingsInvoice } from '../monthly-outgoings-invoice.model';
import { MonthlyOutgoingsInvoiceService } from '../service/monthly-outgoings-invoice.service';

@Injectable({ providedIn: 'root' })
export class MonthlyOutgoingsInvoiceRoutingResolveService implements Resolve<IMonthlyOutgoingsInvoice> {
  constructor(protected service: MonthlyOutgoingsInvoiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMonthlyOutgoingsInvoice> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((monthlyOutgoingsInvoice: HttpResponse<MonthlyOutgoingsInvoice>) => {
          if (monthlyOutgoingsInvoice.body) {
            return of(monthlyOutgoingsInvoice.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MonthlyOutgoingsInvoice());
  }
}
