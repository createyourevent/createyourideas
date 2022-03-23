import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIdeaTransactionId } from '../idea-transaction-id.model';

@Component({
  selector: 'jhi-idea-transaction-id-detail',
  templateUrl: './idea-transaction-id-detail.component.html',
})
export class IdeaTransactionIdDetailComponent implements OnInit {
  ideaTransactionId: IIdeaTransactionId | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ideaTransactionId }) => {
      this.ideaTransactionId = ideaTransactionId;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
