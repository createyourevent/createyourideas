import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdeaLikeDislike } from '../idea-like-dislike.model';
import { IdeaLikeDislikeService } from '../service/idea-like-dislike.service';

@Component({
  templateUrl: './idea-like-dislike-delete-dialog.component.html',
})
export class IdeaLikeDislikeDeleteDialogComponent {
  ideaLikeDislike?: IIdeaLikeDislike;

  constructor(protected ideaLikeDislikeService: IdeaLikeDislikeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ideaLikeDislikeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
