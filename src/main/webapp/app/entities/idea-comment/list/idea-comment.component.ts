import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdeaComment } from '../idea-comment.model';
import { IdeaCommentService } from '../service/idea-comment.service';
import { IdeaCommentDeleteDialogComponent } from '../delete/idea-comment-delete-dialog.component';

@Component({
  selector: 'jhi-idea-comment',
  templateUrl: './idea-comment.component.html',
})
export class IdeaCommentComponent implements OnInit {
  ideaComments?: IIdeaComment[];
  isLoading = false;

  constructor(protected ideaCommentService: IdeaCommentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ideaCommentService.query().subscribe(
      (res: HttpResponse<IIdeaComment[]>) => {
        this.isLoading = false;
        this.ideaComments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IIdeaComment): number {
    return item.id!;
  }

  delete(ideaComment: IIdeaComment): void {
    const modalRef = this.modalService.open(IdeaCommentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ideaComment = ideaComment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
