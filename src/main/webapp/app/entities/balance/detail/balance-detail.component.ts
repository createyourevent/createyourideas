import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBalance } from '../balance.model';

@Component({
  selector: 'jhi-balance-detail',
  templateUrl: './balance-detail.component.html',
})
export class BalanceDetailComponent implements OnInit {
  balance: IBalance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ balance }) => {
      this.balance = balance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
