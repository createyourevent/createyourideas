import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';


import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IProfitBalance } from 'app/entities/profit-balance/profit-balance.model';
import { ProfitBalanceService } from 'app/entities/profit-balance/service/profit-balance.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Ideatype } from 'app/entities/enumerations/ideatype.model';
import { IIdea, Idea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { GeneralService } from 'app/general.service';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import dayjs from 'dayjs';
import { Employee, IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

@Component({
  selector: 'jhi-create-idea',
  templateUrl: './create-idea.component.html',
})
export class CreateIdeaComponent implements OnInit {
  isSaving = false;
  ideatypeValues = Object.keys(Ideatype);

  profitBalancesCollection: IProfitBalance[] = [];
  ideasSharedCollection: IIdea[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    logo: [null, [Validators.required]],
    logoContentType: [],
    description: [null, [Validators.required]],
    ideatype: [],
    interest: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
    distribution: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
    investment: [null, [Validators.required]],
    active: [],
    date: [],
    profitBalance: [],
    user: [],
    idea: [],
  });

  modules = {};
  quillEditorRef: any;

  user: IUser;
  employee: IEmployee;

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected ideaService: IdeaService,
    protected profitBalanceService: ProfitBalanceService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private generalService: GeneralService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'], // remove formatting button

        ['link', 'image', 'video'] // link and image, video
      ]
    };

    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
    });

    this.activatedRoute.data.subscribe(({ idea }) => {
      this.updateForm(idea);

      this.loadRelationshipsOptions();
    });
  }

  getEditorInstance(editorInstance: any): void {
    this.quillEditorRef = editorInstance;
    const toolbar = editorInstance.getModule('toolbar');
    // toolbar.addHandler('image', this.imageHandler);
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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const idea = this.createFromForm();
    if (idea.id !== undefined) {
      this.subscribeToSaveResponse(this.ideaService.update(idea));
    } else {
      this.subscribeToSaveResponse(this.ideaService.create(idea));
    }
  }

  trackProfitBalanceById(index: number, item: IProfitBalance): number {
    return item.id!;
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIdea>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (idea) => this.onSaveSuccess(idea.body),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(idea: IIdea): void {
    this.generalService.queryEmployeeByUserId(this.user.id).subscribe(e => {
      this.employee = e.body;
      idea.employees.push(this.employee);
      this.ideaService.update(idea).subscribe(() => {
        this.previousState();
      });
    });
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(idea: IIdea): void {
    this.editForm.patchValue({
      id: idea.id,
      title: idea.title,
      logo: idea.logo,
      logoContentType: idea.logoContentType,
      description: idea.description,
      ideatype: idea.ideatype,
      interest: idea.interest,
      distribution: idea.distribution,
      investment: idea.investment,
      active: idea.active,
      date: idea.date ? idea.date.format(DATE_TIME_FORMAT) : null,
      profitBalance: idea.profitBalance,
      user: idea.user,
      idea: idea.idea,
    });

    this.profitBalancesCollection = this.profitBalanceService.addProfitBalanceToCollectionIfMissing(
      this.profitBalancesCollection,
      idea.profitBalance
    );
    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, idea.idea);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, idea.user);
  }

  protected loadRelationshipsOptions(): void {
    this.profitBalanceService
      .query({ filter: 'idea-is-null' })
      .pipe(map((res: HttpResponse<IProfitBalance[]>) => res.body ?? []))
      .pipe(
        map((profitBalances: IProfitBalance[]) =>
          this.profitBalanceService.addProfitBalanceToCollectionIfMissing(profitBalances, this.editForm.get('profitBalance')!.value)
        )
      )
      .subscribe((profitBalances: IProfitBalance[]) => (this.profitBalancesCollection = profitBalances));

    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(map((ideas: IIdea[]) => this.ideaService.addIdeaToCollectionIfMissing(ideas, this.editForm.get('idea')!.value)))
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IIdea {
    return {
      ...new Idea(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      description: this.editForm.get(['description'])!.value,
      ideatype: this.editForm.get(['ideatype'])!.value,
      interest: this.editForm.get(['interest'])!.value / 100,
      distribution: this.editForm.get(['distribution'])!.value / 100,
      investment: this.editForm.get(['investment'])!.value,
      active: this.editForm.get(['active'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      profitBalance: this.editForm.get(['profitBalance'])!.value,
      user: this.user,
      idea: this.editForm.get(['idea'])!.value,
    };
  }
}
