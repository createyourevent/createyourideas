import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBalance, Balance } from '../balance.model';
import { BalanceService } from '../service/balance.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-balance-update',
  templateUrl: './balance-update.component.html',
})
export class BalanceUpdateComponent implements OnInit {
  isSaving = false;

  ideasSharedCollection: IIdea[] = [];

  editForm = this.fb.group({
    id: [],
    dailyBalance: [],
    netProfit: [],
    date: [],
    billed: [],
    idea: [],
  });

  constructor(
    protected balanceService: BalanceService,
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ balance }) => {
      if (balance.id === undefined) {
        const today = dayjs().startOf('day');
        balance.date = today;
      }

      this.updateForm(balance);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const balance = this.createFromForm();
    if (balance.id !== undefined) {
      this.subscribeToSaveResponse(this.balanceService.update(balance));
    } else {
      this.subscribeToSaveResponse(this.balanceService.create(balance));
    }
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBalance>>): void {
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

  protected updateForm(balance: IBalance): void {
    this.editForm.patchValue({
      id: balance.id,
      dailyBalance: balance.dailyBalance,
      netProfit: balance.netProfit,
      date: balance.date ? balance.date.format(DATE_TIME_FORMAT) : null,
      billed: balance.billed,
      idea: balance.idea,
    });

    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, balance.idea);
  }

  protected loadRelationshipsOptions(): void {
    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(map((ideas: IIdea[]) => this.ideaService.addIdeaToCollectionIfMissing(ideas, this.editForm.get('idea')!.value)))
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));
  }

  protected createFromForm(): IBalance {
    return {
      ...new Balance(),
      id: this.editForm.get(['id'])!.value,
      dailyBalance: this.editForm.get(['dailyBalance'])!.value,
      netProfit: this.editForm.get(['netProfit'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      billed: this.editForm.get(['billed'])!.value,
      idea: this.editForm.get(['idea'])!.value,
    };
  }
}
