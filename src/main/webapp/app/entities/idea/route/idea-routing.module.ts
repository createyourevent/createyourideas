import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IdeaComponent } from '../list/idea.component';
import { IdeaDetailComponent } from '../detail/idea-detail.component';
import { IdeaUpdateComponent } from '../update/idea-update.component';
import { IdeaRoutingResolveService } from './idea-routing-resolve.service';

const ideaRoute: Routes = [
  {
    path: '',
    component: IdeaComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IdeaDetailComponent,
    resolve: {
      idea: IdeaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IdeaUpdateComponent,
    resolve: {
      idea: IdeaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IdeaUpdateComponent,
    resolve: {
      idea: IdeaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ideaRoute)],
  exports: [RouterModule],
})
export class IdeaRoutingModule {}
