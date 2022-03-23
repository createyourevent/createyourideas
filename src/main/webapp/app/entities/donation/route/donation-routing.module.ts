import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DonationComponent } from '../list/donation.component';
import { DonationDetailComponent } from '../detail/donation-detail.component';
import { DonationUpdateComponent } from '../update/donation-update.component';
import { DonationRoutingResolveService } from './donation-routing-resolve.service';

const donationRoute: Routes = [
  {
    path: '',
    component: DonationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DonationDetailComponent,
    resolve: {
      donation: DonationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DonationUpdateComponent,
    resolve: {
      donation: DonationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DonationUpdateComponent,
    resolve: {
      donation: DonationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(donationRoute)],
  exports: [RouterModule],
})
export class DonationRoutingModule {}
