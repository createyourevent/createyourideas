import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IdeaCommentComponent } from '../list/idea-comment.component';
import { IdeaCommentDetailComponent } from '../detail/idea-comment-detail.component';
import { IdeaCommentUpdateComponent } from '../update/idea-comment-update.component';
import { IdeaCommentRoutingResolveService } from './idea-comment-routing-resolve.service';

const ideaCommentRoute: Routes = [
  {
    path: '',
    component: IdeaCommentComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IdeaCommentDetailComponent,
    resolve: {
      ideaComment: IdeaCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IdeaCommentUpdateComponent,
    resolve: {
      ideaComment: IdeaCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IdeaCommentUpdateComponent,
    resolve: {
      ideaComment: IdeaCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ideaCommentRoute)],
  exports: [RouterModule],
})
export class IdeaCommentRoutingModule {}
