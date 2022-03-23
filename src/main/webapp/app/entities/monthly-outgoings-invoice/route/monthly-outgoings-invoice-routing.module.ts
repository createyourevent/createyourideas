import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MonthlyOutgoingsInvoiceComponent } from '../list/monthly-outgoings-invoice.component';
import { MonthlyOutgoingsInvoiceDetailComponent } from '../detail/monthly-outgoings-invoice-detail.component';
import { MonthlyOutgoingsInvoiceUpdateComponent } from '../update/monthly-outgoings-invoice-update.component';
import { MonthlyOutgoingsInvoiceRoutingResolveService } from './monthly-outgoings-invoice-routing-resolve.service';

const monthlyOutgoingsInvoiceRoute: Routes = [
  {
    path: '',
    component: MonthlyOutgoingsInvoiceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MonthlyOutgoingsInvoiceDetailComponent,
    resolve: {
      monthlyOutgoingsInvoice: MonthlyOutgoingsInvoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MonthlyOutgoingsInvoiceUpdateComponent,
    resolve: {
      monthlyOutgoingsInvoice: MonthlyOutgoingsInvoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MonthlyOutgoingsInvoiceUpdateComponent,
    resolve: {
      monthlyOutgoingsInvoice: MonthlyOutgoingsInvoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(monthlyOutgoingsInvoiceRoute)],
  exports: [RouterModule],
})
export class MonthlyOutgoingsInvoiceRoutingModule {}
