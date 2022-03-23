import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdeaStarRating } from '../idea-star-rating.model';
import { IdeaStarRatingService } from '../service/idea-star-rating.service';

@Component({
  templateUrl: './idea-star-rating-delete-dialog.component.html',
})
export class IdeaStarRatingDeleteDialogComponent {
  ideaStarRating?: IIdeaStarRating;

  constructor(protected ideaStarRatingService: IdeaStarRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ideaStarRatingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
