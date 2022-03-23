import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIdeaComment } from '../idea-comment.model';

@Component({
  selector: 'jhi-idea-comment-detail',
  templateUrl: './idea-comment-detail.component.html',
})
export class IdeaCommentDetailComponent implements OnInit {
  ideaComment: IIdeaComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ideaComment }) => {
      this.ideaComment = ideaComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
