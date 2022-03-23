import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBalance, Balance } from '../balance.model';
import { BalanceService } from '../service/balance.service';

@Injectable({ providedIn: 'root' })
export class BalanceRoutingResolveService implements Resolve<IBalance> {
  constructor(protected service: BalanceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBalance> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((balance: HttpResponse<Balance>) => {
          if (balance.body) {
            return of(balance.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Balance());
  }
}
