import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorksheet } from '../worksheet.model';
import { WorksheetService } from '../service/worksheet.service';

@Component({
  templateUrl: './worksheet-delete-dialog.component.html',
})
export class WorksheetDeleteDialogComponent {
  worksheet?: IWorksheet;

  constructor(protected worksheetService: WorksheetService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.worksheetService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
