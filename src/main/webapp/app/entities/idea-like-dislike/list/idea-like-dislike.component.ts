import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdeaLikeDislike } from '../idea-like-dislike.model';
import { IdeaLikeDislikeService } from '../service/idea-like-dislike.service';
import { IdeaLikeDislikeDeleteDialogComponent } from '../delete/idea-like-dislike-delete-dialog.component';

@Component({
  selector: 'jhi-idea-like-dislike',
  templateUrl: './idea-like-dislike.component.html',
})
export class IdeaLikeDislikeComponent implements OnInit {
  ideaLikeDislikes?: IIdeaLikeDislike[];
  isLoading = false;

  constructor(protected ideaLikeDislikeService: IdeaLikeDislikeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ideaLikeDislikeService.query().subscribe(
      (res: HttpResponse<IIdeaLikeDislike[]>) => {
        this.isLoading = false;
        this.ideaLikeDislikes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IIdeaLikeDislike): number {
    return item.id!;
  }

  delete(ideaLikeDislike: IIdeaLikeDislike): void {
    const modalRef = this.modalService.open(IdeaLikeDislikeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ideaLikeDislike = ideaLikeDislike;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
