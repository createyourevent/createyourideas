import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShare } from '../share.model';
import { ShareService } from '../service/share.service';

@Component({
  templateUrl: './share-delete-dialog.component.html',
})
export class ShareDeleteDialogComponent {
  share?: IShare;

  constructor(protected shareService: ShareService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shareService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
