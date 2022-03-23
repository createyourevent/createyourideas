import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMonthlyIncomeInvoice } from '../monthly-income-invoice.model';
import { MonthlyIncomeInvoiceService } from '../service/monthly-income-invoice.service';

@Component({
  templateUrl: './monthly-income-invoice-delete-dialog.component.html',
})
export class MonthlyIncomeInvoiceDeleteDialogComponent {
  monthlyIncomeInvoice?: IMonthlyIncomeInvoice;

  constructor(protected monthlyIncomeInvoiceService: MonthlyIncomeInvoiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.monthlyIncomeInvoiceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
