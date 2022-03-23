import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIdeaStarRating } from '../idea-star-rating.model';

@Component({
  selector: 'jhi-idea-star-rating-detail',
  templateUrl: './idea-star-rating-detail.component.html',
})
export class IdeaStarRatingDetailComponent implements OnInit {
  ideaStarRating: IIdeaStarRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ideaStarRating }) => {
      this.ideaStarRating = ideaStarRating;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
