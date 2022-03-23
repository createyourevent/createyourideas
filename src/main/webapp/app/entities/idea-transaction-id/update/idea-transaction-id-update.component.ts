import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IIdeaTransactionId, IdeaTransactionId } from '../idea-transaction-id.model';
import { IdeaTransactionIdService } from '../service/idea-transaction-id.service';

@Component({
  selector: 'jhi-idea-transaction-id-update',
  templateUrl: './idea-transaction-id-update.component.html',
})
export class IdeaTransactionIdUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    transactionId: [],
    refNo: [],
    date: [],
  });

  constructor(
    protected ideaTransactionIdService: IdeaTransactionIdService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ideaTransactionId }) => {
      if (ideaTransactionId.id === undefined) {
        const today = dayjs().startOf('day');
        ideaTransactionId.date = today;
      }

      this.updateForm(ideaTransactionId);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ideaTransactionId = this.createFromForm();
    if (ideaTransactionId.id !== undefined) {
      this.subscribeToSaveResponse(this.ideaTransactionIdService.update(ideaTransactionId));
    } else {
      this.subscribeToSaveResponse(this.ideaTransactionIdService.create(ideaTransactionId));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIdeaTransactionId>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ideaTransactionId: IIdeaTransactionId): void {
    this.editForm.patchValue({
      id: ideaTransactionId.id,
      transactionId: ideaTransactionId.transactionId,
      refNo: ideaTransactionId.refNo,
      date: ideaTransactionId.date ? ideaTransactionId.date.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IIdeaTransactionId {
    return {
      ...new IdeaTransactionId(),
      id: this.editForm.get(['id'])!.value,
      transactionId: this.editForm.get(['transactionId'])!.value,
      refNo: this.editForm.get(['refNo'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
