import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOutgoings } from '../outgoings.model';
import { OutgoingsService } from '../service/outgoings.service';

@Component({
  templateUrl: './outgoings-delete-dialog.component.html',
})
export class OutgoingsDeleteDialogComponent {
  outgoings?: IOutgoings;

  constructor(protected outgoingsService: OutgoingsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.outgoingsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
