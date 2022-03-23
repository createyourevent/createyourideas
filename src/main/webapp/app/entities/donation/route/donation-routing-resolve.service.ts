import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDonation, Donation } from '../donation.model';
import { DonationService } from '../service/donation.service';

@Injectable({ providedIn: 'root' })
export class DonationRoutingResolveService implements Resolve<IDonation> {
  constructor(protected service: DonationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDonation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((donation: HttpResponse<Donation>) => {
          if (donation.body) {
            return of(donation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Donation());
  }
}
