import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IdeaLikeDislikeComponent } from '../list/idea-like-dislike.component';
import { IdeaLikeDislikeDetailComponent } from '../detail/idea-like-dislike-detail.component';
import { IdeaLikeDislikeUpdateComponent } from '../update/idea-like-dislike-update.component';
import { IdeaLikeDislikeRoutingResolveService } from './idea-like-dislike-routing-resolve.service';

const ideaLikeDislikeRoute: Routes = [
  {
    path: '',
    component: IdeaLikeDislikeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IdeaLikeDislikeDetailComponent,
    resolve: {
      ideaLikeDislike: IdeaLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IdeaLikeDislikeUpdateComponent,
    resolve: {
      ideaLikeDislike: IdeaLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IdeaLikeDislikeUpdateComponent,
    resolve: {
      ideaLikeDislike: IdeaLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ideaLikeDislikeRoute)],
  exports: [RouterModule],
})
export class IdeaLikeDislikeRoutingModule {}
