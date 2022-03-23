import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IWorksheet, Worksheet } from '../worksheet.model';
import { WorksheetService } from '../service/worksheet.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-worksheet-update',
  templateUrl: './worksheet-update.component.html',
})
export class WorksheetUpdateComponent implements OnInit {
  isSaving = false;

  employeesSharedCollection: IEmployee[] = [];
  ideasSharedCollection: IIdea[] = [];

  editForm = this.fb.group({
    id: [],
    jobtitle: [null, [Validators.required]],
    jobdescription: [null, [Validators.required]],
    dateStart: [],
    dateEnd: [],
    costHour: [null, [Validators.required]],
    hours: [],
    total: [],
    billed: [],
    auto: [],
    employee: [],
    idea: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected worksheetService: WorksheetService,
    protected employeeService: EmployeeService,
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ worksheet }) => {
      if (worksheet.id === undefined) {
        const today = dayjs().startOf('day');
        worksheet.dateStart = today;
        worksheet.dateEnd = today;
      }

      this.updateForm(worksheet);

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
    const worksheet = this.createFromForm();
    if (worksheet.id !== undefined) {
      this.subscribeToSaveResponse(this.worksheetService.update(worksheet));
    } else {
      this.subscribeToSaveResponse(this.worksheetService.create(worksheet));
    }
  }

  trackEmployeeById(index: number, item: IEmployee): number {
    return item.id!;
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorksheet>>): void {
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

  protected updateForm(worksheet: IWorksheet): void {
    this.editForm.patchValue({
      id: worksheet.id,
      jobtitle: worksheet.jobtitle,
      jobdescription: worksheet.jobdescription,
      dateStart: worksheet.dateStart ? worksheet.dateStart.format(DATE_TIME_FORMAT) : null,
      dateEnd: worksheet.dateEnd ? worksheet.dateEnd.format(DATE_TIME_FORMAT) : null,
      costHour: worksheet.costHour,
      hours: worksheet.hours,
      total: worksheet.total,
      billed: worksheet.billed,
      auto: worksheet.auto,
      employee: worksheet.employee,
      idea: worksheet.idea,
    });

    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing(
      this.employeesSharedCollection,
      worksheet.employee
    );
    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, worksheet.idea);
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing(employees, this.editForm.get('employee')!.value)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));

    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(map((ideas: IIdea[]) => this.ideaService.addIdeaToCollectionIfMissing(ideas, this.editForm.get('idea')!.value)))
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));
  }

  protected createFromForm(): IWorksheet {
    return {
      ...new Worksheet(),
      id: this.editForm.get(['id'])!.value,
      jobtitle: this.editForm.get(['jobtitle'])!.value,
      jobdescription: this.editForm.get(['jobdescription'])!.value,
      dateStart: this.editForm.get(['dateStart'])!.value ? dayjs(this.editForm.get(['dateStart'])!.value, DATE_TIME_FORMAT) : undefined,
      dateEnd: this.editForm.get(['dateEnd'])!.value ? dayjs(this.editForm.get(['dateEnd'])!.value, DATE_TIME_FORMAT) : undefined,
      costHour: this.editForm.get(['costHour'])!.value,
      hours: this.editForm.get(['hours'])!.value,
      total: this.editForm.get(['total'])!.value,
      billed: this.editForm.get(['billed'])!.value,
      auto: this.editForm.get(['auto'])!.value,
      employee: this.editForm.get(['employee'])!.value,
      idea: this.editForm.get(['idea'])!.value,
    };
  }
}
