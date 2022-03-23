import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWorksheet, Worksheet } from '../worksheet.model';
import { WorksheetService } from '../service/worksheet.service';

@Injectable({ providedIn: 'root' })
export class WorksheetRoutingResolveService implements Resolve<IWorksheet> {
  constructor(protected service: WorksheetService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWorksheet> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((worksheet: HttpResponse<Worksheet>) => {
          if (worksheet.body) {
            return of(worksheet.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Worksheet());
  }
}
