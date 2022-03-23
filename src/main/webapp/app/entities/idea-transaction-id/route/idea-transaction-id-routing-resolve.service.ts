import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIdeaTransactionId, IdeaTransactionId } from '../idea-transaction-id.model';
import { IdeaTransactionIdService } from '../service/idea-transaction-id.service';

@Injectable({ providedIn: 'root' })
export class IdeaTransactionIdRoutingResolveService implements Resolve<IIdeaTransactionId> {
  constructor(protected service: IdeaTransactionIdService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIdeaTransactionId> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ideaTransactionId: HttpResponse<IdeaTransactionId>) => {
          if (ideaTransactionId.body) {
            return of(ideaTransactionId.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new IdeaTransactionId());
  }
}
