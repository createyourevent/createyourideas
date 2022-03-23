import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IMonthlyIncomeInvoice, MonthlyIncomeInvoice } from '../monthly-income-invoice.model';
import { MonthlyIncomeInvoiceService } from '../service/monthly-income-invoice.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-monthly-income-invoice-update',
  templateUrl: './monthly-income-invoice-update.component.html',
})
export class MonthlyIncomeInvoiceUpdateComponent implements OnInit {
  isSaving = false;

  ideasSharedCollection: IIdea[] = [];

  editForm = this.fb.group({
    id: [],
    total: [],
    date: [],
    idea: [],
  });

  constructor(
    protected monthlyIncomeInvoiceService: MonthlyIncomeInvoiceService,
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ monthlyIncomeInvoice }) => {
      if (monthlyIncomeInvoice.id === undefined) {
        const today = dayjs().startOf('day');
        monthlyIncomeInvoice.date = today;
      }

      this.updateForm(monthlyIncomeInvoice);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const monthlyIncomeInvoice = this.createFromForm();
    if (monthlyIncomeInvoice.id !== undefined) {
      this.subscribeToSaveResponse(this.monthlyIncomeInvoiceService.update(monthlyIncomeInvoice));
    } else {
      this.subscribeToSaveResponse(this.monthlyIncomeInvoiceService.create(monthlyIncomeInvoice));
    }
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMonthlyIncomeInvoice>>): void {
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

  protected updateForm(monthlyIncomeInvoice: IMonthlyIncomeInvoice): void {
    this.editForm.patchValue({
      id: monthlyIncomeInvoice.id,
      total: monthlyIncomeInvoice.total,
      date: monthlyIncomeInvoice.date ? monthlyIncomeInvoice.date.format(DATE_TIME_FORMAT) : null,
      idea: monthlyIncomeInvoice.idea,
    });

    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, monthlyIncomeInvoice.idea);
  }

  protected loadRelationshipsOptions(): void {
    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(map((ideas: IIdea[]) => this.ideaService.addIdeaToCollectionIfMissing(ideas, this.editForm.get('idea')!.value)))
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));
  }

  protected createFromForm(): IMonthlyIncomeInvoice {
    return {
      ...new MonthlyIncomeInvoice(),
      id: this.editForm.get(['id'])!.value,
      total: this.editForm.get(['total'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      idea: this.editForm.get(['idea'])!.value,
    };
  }
}
