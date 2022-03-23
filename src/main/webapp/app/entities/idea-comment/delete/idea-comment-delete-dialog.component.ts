import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdeaComment } from '../idea-comment.model';
import { IdeaCommentService } from '../service/idea-comment.service';

@Component({
  templateUrl: './idea-comment-delete-dialog.component.html',
})
export class IdeaCommentDeleteDialogComponent {
  ideaComment?: IIdeaComment;

  constructor(protected ideaCommentService: IdeaCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ideaCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
