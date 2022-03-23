import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdeaTransactionId } from '../idea-transaction-id.model';
import { IdeaTransactionIdService } from '../service/idea-transaction-id.service';

@Component({
  templateUrl: './idea-transaction-id-delete-dialog.component.html',
})
export class IdeaTransactionIdDeleteDialogComponent {
  ideaTransactionId?: IIdeaTransactionId;

  constructor(protected ideaTransactionIdService: IdeaTransactionIdService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ideaTransactionIdService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
