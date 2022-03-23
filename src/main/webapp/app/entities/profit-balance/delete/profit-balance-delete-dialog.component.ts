import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfitBalance } from '../profit-balance.model';
import { ProfitBalanceService } from '../service/profit-balance.service';

@Component({
  templateUrl: './profit-balance-delete-dialog.component.html',
})
export class ProfitBalanceDeleteDialogComponent {
  profitBalance?: IProfitBalance;

  constructor(protected profitBalanceService: ProfitBalanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.profitBalanceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
