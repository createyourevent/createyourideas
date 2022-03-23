import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProfitBalance } from '../profit-balance.model';

@Component({
  selector: 'jhi-profit-balance-detail',
  templateUrl: './profit-balance-detail.component.html',
})
export class ProfitBalanceDetailComponent implements OnInit {
  profitBalance: IProfitBalance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profitBalance }) => {
      this.profitBalance = profitBalance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
