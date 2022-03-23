import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMonthlyOutgoingsInvoice } from '../monthly-outgoings-invoice.model';
import { MonthlyOutgoingsInvoiceService } from '../service/monthly-outgoings-invoice.service';

@Component({
  templateUrl: './monthly-outgoings-invoice-delete-dialog.component.html',
})
export class MonthlyOutgoingsInvoiceDeleteDialogComponent {
  monthlyOutgoingsInvoice?: IMonthlyOutgoingsInvoice;

  constructor(protected monthlyOutgoingsInvoiceService: MonthlyOutgoingsInvoiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.monthlyOutgoingsInvoiceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
