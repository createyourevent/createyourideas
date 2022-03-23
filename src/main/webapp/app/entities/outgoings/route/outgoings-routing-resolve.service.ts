import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOutgoings, Outgoings } from '../outgoings.model';
import { OutgoingsService } from '../service/outgoings.service';

@Injectable({ providedIn: 'root' })
export class OutgoingsRoutingResolveService implements Resolve<IOutgoings> {
  constructor(protected service: OutgoingsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOutgoings> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((outgoings: HttpResponse<Outgoings>) => {
          if (outgoings.body) {
            return of(outgoings.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Outgoings());
  }
}
