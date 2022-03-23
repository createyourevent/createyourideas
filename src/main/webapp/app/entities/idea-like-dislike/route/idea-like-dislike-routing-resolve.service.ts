import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIdeaLikeDislike, IdeaLikeDislike } from '../idea-like-dislike.model';
import { IdeaLikeDislikeService } from '../service/idea-like-dislike.service';

@Injectable({ providedIn: 'root' })
export class IdeaLikeDislikeRoutingResolveService implements Resolve<IIdeaLikeDislike> {
  constructor(protected service: IdeaLikeDislikeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIdeaLikeDislike> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ideaLikeDislike: HttpResponse<IdeaLikeDislike>) => {
          if (ideaLikeDislike.body) {
            return of(ideaLikeDislike.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new IdeaLikeDislike());
  }
}
