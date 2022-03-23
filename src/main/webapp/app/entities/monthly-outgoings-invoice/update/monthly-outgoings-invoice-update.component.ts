import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IMonthlyOutgoingsInvoice, MonthlyOutgoingsInvoice } from '../monthly-outgoings-invoice.model';
import { MonthlyOutgoingsInvoiceService } from '../service/monthly-outgoings-invoice.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-monthly-outgoings-invoice-update',
  templateUrl: './monthly-outgoings-invoice-update.component.html',
})
export class MonthlyOutgoingsInvoiceUpdateComponent implements OnInit {
  isSaving = false;

  ideasSharedCollection: IIdea[] = [];

  editForm = this.fb.group({
    id: [],
    total: [],
    date: [],
    idea: [],
  });

  constructor(
    protected monthlyOutgoingsInvoiceService: MonthlyOutgoingsInvoiceService,
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ monthlyOutgoingsInvoice }) => {
      if (monthlyOutgoingsInvoice.id === undefined) {
        const today = dayjs().startOf('day');
        monthlyOutgoingsInvoice.date = today;
      }

      this.updateForm(monthlyOutgoingsInvoice);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const monthlyOutgoingsInvoice = this.createFromForm();
    if (monthlyOutgoingsInvoice.id !== undefined) {
      this.subscribeToSaveResponse(this.monthlyOutgoingsInvoiceService.update(monthlyOutgoingsInvoice));
    } else {
      this.subscribeToSaveResponse(this.monthlyOutgoingsInvoiceService.create(monthlyOutgoingsInvoice));
    }
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMonthlyOutgoingsInvoice>>): void {
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

  protected updateForm(monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice): void {
    this.editForm.patchValue({
      id: monthlyOutgoingsInvoice.id,
      total: monthlyOutgoingsInvoice.total,
      date: monthlyOutgoingsInvoice.date ? monthlyOutgoingsInvoice.date.format(DATE_TIME_FORMAT) : null,
      idea: monthlyOutgoingsInvoice.idea,
    });

    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, monthlyOutgoingsInvoice.idea);
  }

  protected loadRelationshipsOptions(): void {
    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(map((ideas: IIdea[]) => this.ideaService.addIdeaToCollectionIfMissing(ideas, this.editForm.get('idea')!.value)))
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));
  }

  protected createFromForm(): IMonthlyOutgoingsInvoice {
    return {
      ...new MonthlyOutgoingsInvoice(),
      id: this.editForm.get(['id'])!.value,
      total: this.editForm.get(['total'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      idea: this.editForm.get(['idea'])!.value,
    };
  }
}
