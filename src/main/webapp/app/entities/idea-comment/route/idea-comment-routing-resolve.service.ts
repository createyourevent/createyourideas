import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIdeaComment, IdeaComment } from '../idea-comment.model';
import { IdeaCommentService } from '../service/idea-comment.service';

@Injectable({ providedIn: 'root' })
export class IdeaCommentRoutingResolveService implements Resolve<IIdeaComment> {
  constructor(protected service: IdeaCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIdeaComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ideaComment: HttpResponse<IdeaComment>) => {
          if (ideaComment.body) {
            return of(ideaComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new IdeaComment());
  }
}
