import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfitBalanceComponent } from '../list/profit-balance.component';
import { ProfitBalanceDetailComponent } from '../detail/profit-balance-detail.component';
import { ProfitBalanceUpdateComponent } from '../update/profit-balance-update.component';
import { ProfitBalanceRoutingResolveService } from './profit-balance-routing-resolve.service';

const profitBalanceRoute: Routes = [
  {
    path: '',
    component: ProfitBalanceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProfitBalanceDetailComponent,
    resolve: {
      profitBalance: ProfitBalanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProfitBalanceUpdateComponent,
    resolve: {
      profitBalance: ProfitBalanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProfitBalanceUpdateComponent,
    resolve: {
      profitBalance: ProfitBalanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(profitBalanceRoute)],
  exports: [RouterModule],
})
export class ProfitBalanceRoutingModule {}
