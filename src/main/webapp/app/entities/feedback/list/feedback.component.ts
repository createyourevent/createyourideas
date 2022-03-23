import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFeedback } from '../feedback.model';
import { FeedbackService } from '../service/feedback.service';
import { FeedbackDeleteDialogComponent } from '../delete/feedback-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-feedback',
  templateUrl: './feedback.component.html',
})
export class FeedbackComponent implements OnInit {
  feedbacks?: IFeedback[];
  isLoading = false;

  constructor(protected feedbackService: FeedbackService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.feedbackService.query().subscribe(
      (res: HttpResponse<IFeedback[]>) => {
        this.isLoading = false;
        this.feedbacks = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFeedback): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(feedback: IFeedback): void {
    const modalRef = this.modalService.open(FeedbackDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.feedback = feedback;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
