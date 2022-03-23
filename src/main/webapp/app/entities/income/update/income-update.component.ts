import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IIncome, Income } from '../income.model';
import { IncomeService } from '../service/income.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-income-update',
  templateUrl: './income-update.component.html',
})
export class IncomeUpdateComponent implements OnInit {
  isSaving = false;

  ideasSharedCollection: IIdea[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [null, [Validators.required]],
    date: [null, [Validators.required]],
    value: [null, [Validators.required]],
    billed: [],
    fromParentIdea: [],
    auto: [],
    incomeIdeas: [],
    idea: [],
  });

  constructor(
    protected incomeService: IncomeService,
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ income }) => {
      if (income.id === undefined) {
        const today = dayjs().startOf('day');
        income.date = today;
      }

      this.updateForm(income);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const income = this.createFromForm();
    if (income.id !== undefined) {
      this.subscribeToSaveResponse(this.incomeService.update(income));
    } else {
      this.subscribeToSaveResponse(this.incomeService.create(income));
    }
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  getSelectedIdea(option: IIdea, selectedVals?: IIdea[]): IIdea {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIncome>>): void {
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

  protected updateForm(income: IIncome): void {
    this.editForm.patchValue({
      id: income.id,
      title: income.title,
      description: income.description,
      date: income.date ? income.date.format(DATE_TIME_FORMAT) : null,
      value: income.value,
      billed: income.billed,
      fromParentIdea: income.fromParentIdea,
      auto: income.auto,
      incomeIdeas: income.incomeIdeas,
      idea: income.idea,
    });

    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(
      this.ideasSharedCollection,
      ...(income.incomeIdeas ?? []),
      income.idea
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(
        map((ideas: IIdea[]) =>
          this.ideaService.addIdeaToCollectionIfMissing(
            ideas,
            ...(this.editForm.get('incomeIdeas')!.value ?? []),
            this.editForm.get('idea')!.value
          )
        )
      )
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));
  }

  protected createFromForm(): IIncome {
    return {
      ...new Income(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      value: this.editForm.get(['value'])!.value,
      billed: this.editForm.get(['billed'])!.value,
      fromParentIdea: this.editForm.get(['fromParentIdea'])!.value,
      auto: this.editForm.get(['auto'])!.value,
      incomeIdeas: this.editForm.get(['incomeIdeas'])!.value,
      idea: this.editForm.get(['idea'])!.value,
    };
  }
}
