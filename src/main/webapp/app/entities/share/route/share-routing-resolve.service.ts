import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShare, Share } from '../share.model';
import { ShareService } from '../service/share.service';

@Injectable({ providedIn: 'root' })
export class ShareRoutingResolveService implements Resolve<IShare> {
  constructor(protected service: ShareService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShare> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((share: HttpResponse<Share>) => {
          if (share.body) {
            return of(share.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Share());
  }
}
