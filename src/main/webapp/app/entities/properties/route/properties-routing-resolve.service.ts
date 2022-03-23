import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProperties, Properties } from '../properties.model';
import { PropertiesService } from '../service/properties.service';

@Injectable({ providedIn: 'root' })
export class PropertiesRoutingResolveService implements Resolve<IProperties> {
  constructor(protected service: PropertiesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProperties> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((properties: HttpResponse<Properties>) => {
          if (properties.body) {
            return of(properties.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Properties());
  }
}
