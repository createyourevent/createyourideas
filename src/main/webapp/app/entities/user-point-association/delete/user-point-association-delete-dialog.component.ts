import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserPointAssociation } from '../user-point-association.model';
import { UserPointAssociationService } from '../service/user-point-association.service';

@Component({
  templateUrl: './user-point-association-delete-dialog.component.html',
})
export class UserPointAssociationDeleteDialogComponent {
  userPointAssociation?: IUserPointAssociation;

  constructor(protected userPointAssociationService: UserPointAssociationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userPointAssociationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
