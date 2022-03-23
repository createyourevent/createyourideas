import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BalanceComponent } from '../list/balance.component';
import { BalanceDetailComponent } from '../detail/balance-detail.component';
import { BalanceUpdateComponent } from '../update/balance-update.component';
import { BalanceRoutingResolveService } from './balance-routing-resolve.service';

const balanceRoute: Routes = [
  {
    path: '',
    component: BalanceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BalanceDetailComponent,
    resolve: {
      balance: BalanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BalanceUpdateComponent,
    resolve: {
      balance: BalanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BalanceUpdateComponent,
    resolve: {
      balance: BalanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(balanceRoute)],
  exports: [RouterModule],
})
export class BalanceRoutingModule {}
