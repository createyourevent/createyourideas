import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MonthlyIncomeInvoiceComponent } from '../list/monthly-income-invoice.component';
import { MonthlyIncomeInvoiceDetailComponent } from '../detail/monthly-income-invoice-detail.component';
import { MonthlyIncomeInvoiceUpdateComponent } from '../update/monthly-income-invoice-update.component';
import { MonthlyIncomeInvoiceRoutingResolveService } from './monthly-income-invoice-routing-resolve.service';

const monthlyIncomeInvoiceRoute: Routes = [
  {
    path: '',
    component: MonthlyIncomeInvoiceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MonthlyIncomeInvoiceDetailComponent,
    resolve: {
      monthlyIncomeInvoice: MonthlyIncomeInvoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MonthlyIncomeInvoiceUpdateComponent,
    resolve: {
      monthlyIncomeInvoice: MonthlyIncomeInvoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MonthlyIncomeInvoiceUpdateComponent,
    resolve: {
      monthlyIncomeInvoice: MonthlyIncomeInvoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(monthlyIncomeInvoiceRoute)],
  exports: [RouterModule],
})
export class MonthlyIncomeInvoiceRoutingModule {}
