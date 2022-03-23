import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MonthlyIncomeInvoiceComponent } from './list/monthly-income-invoice.component';
import { MonthlyIncomeInvoiceDetailComponent } from './detail/monthly-income-invoice-detail.component';
import { MonthlyIncomeInvoiceUpdateComponent } from './update/monthly-income-invoice-update.component';
import { MonthlyIncomeInvoiceDeleteDialogComponent } from './delete/monthly-income-invoice-delete-dialog.component';
import { MonthlyIncomeInvoiceRoutingModule } from './route/monthly-income-invoice-routing.module';

@NgModule({
  imports: [SharedModule, MonthlyIncomeInvoiceRoutingModule],
  declarations: [
    MonthlyIncomeInvoiceComponent,
    MonthlyIncomeInvoiceDetailComponent,
    MonthlyIncomeInvoiceUpdateComponent,
    MonthlyIncomeInvoiceDeleteDialogComponent,
  ],
  entryComponents: [MonthlyIncomeInvoiceDeleteDialogComponent],
})
export class MonthlyIncomeInvoiceModule {}
