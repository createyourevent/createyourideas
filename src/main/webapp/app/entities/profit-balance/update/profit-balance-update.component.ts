import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProfitBalance, ProfitBalance } from '../profit-balance.model';
import { ProfitBalanceService } from '../service/profit-balance.service';

@Component({
  selector: 'jhi-profit-balance-update',
  templateUrl: './profit-balance-update.component.html',
})
export class ProfitBalanceUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    profit: [],
    profitToSpend: [],
    netProfit: [],
    date: [],
  });

  constructor(protected profitBalanceService: ProfitBalanceService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profitBalance }) => {
      this.updateForm(profitBalance);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const profitBalance = this.createFromForm();
    if (profitBalance.id !== undefined) {
      this.subscribeToSaveResponse(this.profitBalanceService.update(profitBalance));
    } else {
      this.subscribeToSaveResponse(this.profitBalanceService.create(profitBalance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfitBalance>>): void {
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

  protected updateForm(profitBalance: IProfitBalance): void {
    this.editForm.patchValue({
      id: profitBalance.id,
      profit: profitBalance.profit,
      profitToSpend: profitBalance.profitToSpend,
      netProfit: profitBalance.netProfit,
      date: profitBalance.date,
    });
  }

  protected createFromForm(): IProfitBalance {
    return {
      ...new ProfitBalance(),
      id: this.editForm.get(['id'])!.value,
      profit: this.editForm.get(['profit'])!.value,
      profitToSpend: this.editForm.get(['profitToSpend'])!.value,
      netProfit: this.editForm.get(['netProfit'])!.value,
      date: this.editForm.get(['date'])!.value,
    };
  }
}
