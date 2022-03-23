import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserPointAssociationComponent } from '../list/user-point-association.component';
import { UserPointAssociationDetailComponent } from '../detail/user-point-association-detail.component';
import { UserPointAssociationUpdateComponent } from '../update/user-point-association-update.component';
import { UserPointAssociationRoutingResolveService } from './user-point-association-routing-resolve.service';

const userPointAssociationRoute: Routes = [
  {
    path: '',
    component: UserPointAssociationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserPointAssociationDetailComponent,
    resolve: {
      userPointAssociation: UserPointAssociationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserPointAssociationUpdateComponent,
    resolve: {
      userPointAssociation: UserPointAssociationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserPointAssociationUpdateComponent,
    resolve: {
      userPointAssociation: UserPointAssociationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userPointAssociationRoute)],
  exports: [RouterModule],
})
export class UserPointAssociationRoutingModule {}
