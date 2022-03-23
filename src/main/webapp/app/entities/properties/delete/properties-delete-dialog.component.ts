import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProperties } from '../properties.model';
import { PropertiesService } from '../service/properties.service';

@Component({
  templateUrl: './properties-delete-dialog.component.html',
})
export class PropertiesDeleteDialogComponent {
  properties?: IProperties;

  constructor(protected propertiesService: PropertiesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.propertiesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
