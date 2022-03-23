import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIdeaStarRating, IdeaStarRating } from '../idea-star-rating.model';
import { IdeaStarRatingService } from '../service/idea-star-rating.service';

@Injectable({ providedIn: 'root' })
export class IdeaStarRatingRoutingResolveService implements Resolve<IIdeaStarRating> {
  constructor(protected service: IdeaStarRatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIdeaStarRating> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ideaStarRating: HttpResponse<IdeaStarRating>) => {
          if (ideaStarRating.body) {
            return of(ideaStarRating.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new IdeaStarRating());
  }
}
