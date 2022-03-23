import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IApplication, Application } from '../application.model';
import { ApplicationService } from '../service/application.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-application-update',
  templateUrl: './application-update.component.html',
})
export class ApplicationUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  ideasSharedCollection: IIdea[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    description: [],
    date: [],
    desiredHourlyWage: [],
    seen: [],
    responded: [],
    user: [],
    idea: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected applicationService: ApplicationService,
    protected userService: UserService,
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ application }) => {
      if (application.id === undefined) {
        const today = dayjs().startOf('day');
        application.date = today;
      }

      this.updateForm(application);

      this.loadRelationshipsOptions();
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
    const application = this.createFromForm();
    if (application.id !== undefined) {
      this.subscribeToSaveResponse(this.applicationService.update(application));
    } else {
      this.subscribeToSaveResponse(this.applicationService.create(application));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplication>>): void {
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

  protected updateForm(application: IApplication): void {
    this.editForm.patchValue({
      id: application.id,
      title: application.title,
      description: application.description,
      date: application.date ? application.date.format(DATE_TIME_FORMAT) : null,
      desiredHourlyWage: application.desiredHourlyWage,
      seen: application.seen,
      responded: application.responded,
      user: application.user,
      idea: application.idea,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, application.user);
    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, application.idea);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(map((ideas: IIdea[]) => this.ideaService.addIdeaToCollectionIfMissing(ideas, this.editForm.get('idea')!.value)))
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));
  }

  protected createFromForm(): IApplication {
    return {
      ...new Application(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      desiredHourlyWage: this.editForm.get(['desiredHourlyWage'])!.value,
      seen: this.editForm.get(['seen'])!.value,
      responded: this.editForm.get(['responded'])!.value,
      user: this.editForm.get(['user'])!.value,
      idea: this.editForm.get(['idea'])!.value,
    };
  }
}
