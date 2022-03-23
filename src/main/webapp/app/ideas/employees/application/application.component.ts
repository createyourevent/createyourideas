import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser, User } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { ApplicationService } from 'app/entities/application/service/application.service';
import { Application, IApplication } from 'app/entities/application/application.model';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-application-update',
  templateUrl: './application.component.html',
})
export class ApplicationComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  ideasSharedCollection: IIdea[] = [];

  idea: IIdea;
  user: IUser;

  onlyOnce = false;

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
    protected fb: FormBuilder,
    private generalService: GeneralService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.idea = idea;
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body;
        const found = this.idea.applications.findIndex(x => x.user.id === this.user.id)
        if(found >= 0) {
          this.onlyOnce = true;
        }
      })
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
    this.subscribeToSaveResponse(this.applicationService.create(application));
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
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected createFromForm(): IApplication {
    return {
      ...new Application(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      date: dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT),
      desiredHourlyWage: this.editForm.get(['desiredHourlyWage'])!.value,
      seen: this.editForm.get(['seen'])!.value,
      responded: this.editForm.get(['responded'])!.value,
      idea: this.idea,
      user: this.user,
    };
  }
}
