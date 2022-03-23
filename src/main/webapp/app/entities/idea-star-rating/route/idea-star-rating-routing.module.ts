import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IdeaStarRatingComponent } from '../list/idea-star-rating.component';
import { IdeaStarRatingDetailComponent } from '../detail/idea-star-rating-detail.component';
import { IdeaStarRatingUpdateComponent } from '../update/idea-star-rating-update.component';
import { IdeaStarRatingRoutingResolveService } from './idea-star-rating-routing-resolve.service';

const ideaStarRatingRoute: Routes = [
  {
    path: '',
    component: IdeaStarRatingComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IdeaStarRatingDetailComponent,
    resolve: {
      ideaStarRating: IdeaStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IdeaStarRatingUpdateComponent,
    resolve: {
      ideaStarRating: IdeaStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IdeaStarRatingUpdateComponent,
    resolve: {
      ideaStarRating: IdeaStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ideaStarRatingRoute)],
  exports: [RouterModule],
})
export class IdeaStarRatingRoutingModule {}
