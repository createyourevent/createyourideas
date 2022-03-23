import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { WorksheetService } from 'app/entities/worksheet/service/worksheet.service';
import { IWorksheet, Worksheet } from 'app/entities/worksheet/worksheet.model';
import { GeneralService } from 'app/general.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IdeaService } from 'app/views/idea/dashboard-idea/idea.service';
import dayjs from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import { map } from 'jquery';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
let duration = require('dayjs/plugin/duration')

@Component({
  selector: 'jhi-worksheets',
  templateUrl: './worksheets.component.html',
  styleUrls: ['./worksheets.component.scss']
})
export class WorksheetsComponent implements OnInit {

  isSaving = false;

  idea: IIdea;
  user: IUser;
  employee: IEmployee;

  loading: boolean = true;

  worksheets: IWorksheet[];

  editForm = this.fb.group({
    id: [],
    jobtitle: [null, [Validators.required]],
    jobdescription: [null, [Validators.required]],
    dateStart: [null, [Validators.required]],
    dateEnd: [null, [Validators.required]],
    costHour: [null, [Validators.required]],
    hours: [],
    total: [],
    user: [],
    idea: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected worksheetService: WorksheetService,
    protected userService: UserService,
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private generalService: GeneralService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.idea = idea;
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body;
        this.generalService.queryEmployeeByUserId(this.user.id).subscribe(e => {
          this.employee = e.body;
          this.worksheets = this.idea.worksheets;
          this.loading = false;
        });
      });
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

  reloadPage(): void {
    this.generalService.queryIdeaByActiveTrueEagerAll(this.idea.id).subscribe(res => {
      this.worksheets = res.body.worksheets;
      this.router.navigate(['/employee', this.idea.id, 'worksheets']);
    });

  }

  save(): void {
    this.isSaving = true;
    const worksheet = this.createFromForm();
    this.subscribeToSaveResponse(this.worksheetService.create(worksheet));
  }

  trackUserById(index: number, item: IUser): string {
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
    this.reloadPage();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected createFromForm(): IWorksheet {
    dayjs.extend(duration);
    let  x = dayjs(this.editForm.get(['dateStart'])!.value, DATE_TIME_FORMAT);
    let y = dayjs(this.editForm.get(['dateEnd'])!.value, DATE_TIME_FORMAT);
    let dur: Duration = dayjs.duration(y.diff(x));
    let min = dur.asMinutes();
    let total = min * Number(this.editForm.get(['costHour']).value)/60;


    return {
      ...new Worksheet(),
      id: this.editForm.get(['id'])!.value,
      jobtitle: this.editForm.get(['jobtitle'])!.value,
      jobdescription: this.editForm.get(['jobdescription'])!.value,
      dateStart: this.editForm.get(['dateStart'])!.value ? dayjs(this.editForm.get(['dateStart'])!.value, DATE_TIME_FORMAT) : undefined,
      dateEnd: this.editForm.get(['dateEnd'])!.value ? dayjs(this.editForm.get(['dateEnd'])!.value, DATE_TIME_FORMAT) : undefined,
      costHour: this.editForm.get(['costHour'])!.value,
      hours: dur,
      total: total,
      employee: this.employee,
      idea: this.idea,
    };
  }

}
