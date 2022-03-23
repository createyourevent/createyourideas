import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIdea, Idea } from '../idea.model';
import { IdeaService } from '../service/idea.service';

@Injectable({ providedIn: 'root' })
export class IdeaRoutingResolveService implements Resolve<IIdea> {
  constructor(protected service: IdeaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIdea> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((idea: HttpResponse<Idea>) => {
          if (idea.body) {
            return of(idea.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Idea());
  }
}
