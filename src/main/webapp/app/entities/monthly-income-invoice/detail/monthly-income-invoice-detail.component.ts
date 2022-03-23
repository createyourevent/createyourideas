import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMonthlyIncomeInvoice } from '../monthly-income-invoice.model';

@Component({
  selector: 'jhi-monthly-income-invoice-detail',
  templateUrl: './monthly-income-invoice-detail.component.html',
})
export class MonthlyIncomeInvoiceDetailComponent implements OnInit {
  monthlyIncomeInvoice: IMonthlyIncomeInvoice | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ monthlyIncomeInvoice }) => {
      this.monthlyIncomeInvoice = monthlyIncomeInvoice;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
