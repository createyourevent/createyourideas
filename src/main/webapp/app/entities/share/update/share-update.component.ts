import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IShare, Share } from '../share.model';
import { ShareService } from '../service/share.service';

@Component({
  selector: 'jhi-share-update',
  templateUrl: './share-update.component.html',
})
export class ShareUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    value: [],
    date: [],
  });

  constructor(protected shareService: ShareService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ share }) => {
      if (share.id === undefined) {
        const today = dayjs().startOf('day');
        share.date = today;
      }

      this.updateForm(share);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const share = this.createFromForm();
    if (share.id !== undefined) {
      this.subscribeToSaveResponse(this.shareService.update(share));
    } else {
      this.subscribeToSaveResponse(this.shareService.create(share));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShare>>): void {
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

  protected updateForm(share: IShare): void {
    this.editForm.patchValue({
      id: share.id,
      value: share.value,
      date: share.date ? share.date.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IShare {
    return {
      ...new Share(),
      id: this.editForm.get(['id'])!.value,
      value: this.editForm.get(['value'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
