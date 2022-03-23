import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDonation } from '../donation.model';
import { DonationService } from '../service/donation.service';

@Component({
  templateUrl: './donation-delete-dialog.component.html',
})
export class DonationDeleteDialogComponent {
  donation?: IDonation;

  constructor(protected donationService: DonationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.donationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
