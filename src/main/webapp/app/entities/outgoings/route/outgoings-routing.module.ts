import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OutgoingsComponent } from '../list/outgoings.component';
import { OutgoingsDetailComponent } from '../detail/outgoings-detail.component';
import { OutgoingsUpdateComponent } from '../update/outgoings-update.component';
import { OutgoingsRoutingResolveService } from './outgoings-routing-resolve.service';

const outgoingsRoute: Routes = [
  {
    path: '',
    component: OutgoingsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OutgoingsDetailComponent,
    resolve: {
      outgoings: OutgoingsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OutgoingsUpdateComponent,
    resolve: {
      outgoings: OutgoingsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OutgoingsUpdateComponent,
    resolve: {
      outgoings: OutgoingsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(outgoingsRoute)],
  exports: [RouterModule],
})
export class OutgoingsRoutingModule {}
