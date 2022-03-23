import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProfitBalance, ProfitBalance } from '../profit-balance.model';
import { ProfitBalanceService } from '../service/profit-balance.service';

@Injectable({ providedIn: 'root' })
export class ProfitBalanceRoutingResolveService implements Resolve<IProfitBalance> {
  constructor(protected service: ProfitBalanceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProfitBalance> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((profitBalance: HttpResponse<ProfitBalance>) => {
          if (profitBalance.body) {
            return of(profitBalance.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProfitBalance());
  }
}
