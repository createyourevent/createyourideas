import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIdeaLikeDislike } from '../idea-like-dislike.model';

@Component({
  selector: 'jhi-idea-like-dislike-detail',
  templateUrl: './idea-like-dislike-detail.component.html',
})
export class IdeaLikeDislikeDetailComponent implements OnInit {
  ideaLikeDislike: IIdeaLikeDislike | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ideaLikeDislike }) => {
      this.ideaLikeDislike = ideaLikeDislike;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
