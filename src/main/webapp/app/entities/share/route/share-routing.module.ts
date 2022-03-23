import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShareComponent } from '../list/share.component';
import { ShareDetailComponent } from '../detail/share-detail.component';
import { ShareUpdateComponent } from '../update/share-update.component';
import { ShareRoutingResolveService } from './share-routing-resolve.service';

const shareRoute: Routes = [
  {
    path: '',
    component: ShareComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShareDetailComponent,
    resolve: {
      share: ShareRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShareUpdateComponent,
    resolve: {
      share: ShareRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShareUpdateComponent,
    resolve: {
      share: ShareRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shareRoute)],
  exports: [RouterModule],
})
export class ShareRoutingModule {}
