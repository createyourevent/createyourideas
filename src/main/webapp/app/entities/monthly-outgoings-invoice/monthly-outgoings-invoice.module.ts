import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MonthlyOutgoingsInvoiceComponent } from './list/monthly-outgoings-invoice.component';
import { MonthlyOutgoingsInvoiceDetailComponent } from './detail/monthly-outgoings-invoice-detail.component';
import { MonthlyOutgoingsInvoiceUpdateComponent } from './update/monthly-outgoings-invoice-update.component';
import { MonthlyOutgoingsInvoiceDeleteDialogComponent } from './delete/monthly-outgoings-invoice-delete-dialog.component';
import { MonthlyOutgoingsInvoiceRoutingModule } from './route/monthly-outgoings-invoice-routing.module';

@NgModule({
  imports: [SharedModule, MonthlyOutgoingsInvoiceRoutingModule],
  declarations: [
    MonthlyOutgoingsInvoiceComponent,
    MonthlyOutgoingsInvoiceDetailComponent,
    MonthlyOutgoingsInvoiceUpdateComponent,
    MonthlyOutgoingsInvoiceDeleteDialogComponent,
  ],
  entryComponents: [MonthlyOutgoingsInvoiceDeleteDialogComponent],
})
export class MonthlyOutgoingsInvoiceModule {}
