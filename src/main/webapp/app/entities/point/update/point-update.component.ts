import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPoint, Point } from '../point.model';
import { PointService } from '../service/point.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { PointsCategory } from 'app/entities/enumerations/points-category.model';

@Component({
  selector: 'jhi-point-update',
  templateUrl: './point-update.component.html',
})
export class PointUpdateComponent implements OnInit {
  isSaving = false;
  pointsCategoryValues = Object.keys(PointsCategory);

  editForm = this.fb.group({
    id: [],
    key: [],
    name: [],
    keyName: [],
    description: [],
    keyDescription: [],
    category: [],
    points: [],
    countPerDay: [],
    creationDate: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected pointService: PointService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ point }) => {
      if (point.id === undefined) {
        const today = dayjs().startOf('day');
        point.creationDate = today;
      }

      this.updateForm(point);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('createyourideasApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const point = this.createFromForm();
    if (point.id !== undefined) {
      this.subscribeToSaveResponse(this.pointService.update(point));
    } else {
      this.subscribeToSaveResponse(this.pointService.create(point));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoint>>): void {
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

  protected updateForm(point: IPoint): void {
    this.editForm.patchValue({
      id: point.id,
      key: point.key,
      name: point.name,
      keyName: point.keyName,
      description: point.description,
      keyDescription: point.keyDescription,
      category: point.category,
      points: point.points,
      countPerDay: point.countPerDay,
      creationDate: point.creationDate ? point.creationDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IPoint {
    return {
      ...new Point(),
      id: this.editForm.get(['id'])!.value,
      key: this.editForm.get(['key'])!.value,
      name: this.editForm.get(['name'])!.value,
      keyName: this.editForm.get(['keyName'])!.value,
      description: this.editForm.get(['description'])!.value,
      keyDescription: this.editForm.get(['keyDescription'])!.value,
      category: this.editForm.get(['category'])!.value,
      points: this.editForm.get(['points'])!.value,
      countPerDay: this.editForm.get(['countPerDay'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value
        ? dayjs(this.editForm.get(['creationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
