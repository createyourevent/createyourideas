import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IIdea, Idea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { GeneralService } from 'app/general.service';


@Injectable({ providedIn: 'root' })
export class BillingResolveService implements Resolve<IIdea> {
  constructor(protected generalService: GeneralService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIdea> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.generalService.queryIdeaByActiveTrueEagerAll(id).pipe(
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
