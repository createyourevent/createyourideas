import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserPointAssociation, UserPointAssociation } from '../user-point-association.model';
import { UserPointAssociationService } from '../service/user-point-association.service';

@Injectable({ providedIn: 'root' })
export class UserPointAssociationRoutingResolveService implements Resolve<IUserPointAssociation> {
  constructor(protected service: UserPointAssociationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserPointAssociation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userPointAssociation: HttpResponse<UserPointAssociation>) => {
          if (userPointAssociation.body) {
            return of(userPointAssociation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserPointAssociation());
  }
}
