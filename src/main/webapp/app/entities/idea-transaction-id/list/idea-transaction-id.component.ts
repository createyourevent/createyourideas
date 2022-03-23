import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdeaTransactionId } from '../idea-transaction-id.model';
import { IdeaTransactionIdService } from '../service/idea-transaction-id.service';
import { IdeaTransactionIdDeleteDialogComponent } from '../delete/idea-transaction-id-delete-dialog.component';

@Component({
  selector: 'jhi-idea-transaction-id',
  templateUrl: './idea-transaction-id.component.html',
})
export class IdeaTransactionIdComponent implements OnInit {
  ideaTransactionIds?: IIdeaTransactionId[];
  isLoading = false;

  constructor(protected ideaTransactionIdService: IdeaTransactionIdService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ideaTransactionIdService.query().subscribe(
      (res: HttpResponse<IIdeaTransactionId[]>) => {
        this.isLoading = false;
        this.ideaTransactionIds = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IIdeaTransactionId): number {
    return item.id!;
  }

  delete(ideaTransactionId: IIdeaTransactionId): void {
    const modalRef = this.modalService.open(IdeaTransactionIdDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ideaTransactionId = ideaTransactionId;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
