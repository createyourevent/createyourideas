import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMonthlyOutgoingsInvoice } from '../monthly-outgoings-invoice.model';

@Component({
  selector: 'jhi-monthly-outgoings-invoice-detail',
  templateUrl: './monthly-outgoings-invoice-detail.component.html',
})
export class MonthlyOutgoingsInvoiceDetailComponent implements OnInit {
  monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ monthlyOutgoingsInvoice }) => {
      this.monthlyOutgoingsInvoice = monthlyOutgoingsInvoice;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
