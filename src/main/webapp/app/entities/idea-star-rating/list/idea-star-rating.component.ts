import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdeaStarRating } from '../idea-star-rating.model';
import { IdeaStarRatingService } from '../service/idea-star-rating.service';
import { IdeaStarRatingDeleteDialogComponent } from '../delete/idea-star-rating-delete-dialog.component';

@Component({
  selector: 'jhi-idea-star-rating',
  templateUrl: './idea-star-rating.component.html',
})
export class IdeaStarRatingComponent implements OnInit {
  ideaStarRatings?: IIdeaStarRating[];
  isLoading = false;

  constructor(protected ideaStarRatingService: IdeaStarRatingService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ideaStarRatingService.query().subscribe(
      (res: HttpResponse<IIdeaStarRating[]>) => {
        this.isLoading = false;
        this.ideaStarRatings = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IIdeaStarRating): number {
    return item.id!;
  }

  delete(ideaStarRating: IIdeaStarRating): void {
    const modalRef = this.modalService.open(IdeaStarRatingDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ideaStarRating = ideaStarRating;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
