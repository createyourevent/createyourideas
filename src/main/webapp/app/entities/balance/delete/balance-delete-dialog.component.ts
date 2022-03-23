import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBalance } from '../balance.model';
import { BalanceService } from '../service/balance.service';

@Component({
  templateUrl: './balance-delete-dialog.component.html',
})
export class BalanceDeleteDialogComponent {
  balance?: IBalance;

  constructor(protected balanceService: BalanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.balanceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
