import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMonthlyIncomeInvoice } from '../monthly-income-invoice.model';
import { MonthlyIncomeInvoiceService } from '../service/monthly-income-invoice.service';
import { MonthlyIncomeInvoiceDeleteDialogComponent } from '../delete/monthly-income-invoice-delete-dialog.component';

@Component({
  selector: 'jhi-monthly-income-invoice',
  templateUrl: './monthly-income-invoice.component.html',
})
export class MonthlyIncomeInvoiceComponent implements OnInit {
  monthlyIncomeInvoices?: IMonthlyIncomeInvoice[];
  isLoading = false;

  constructor(protected monthlyIncomeInvoiceService: MonthlyIncomeInvoiceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.monthlyIncomeInvoiceService.query().subscribe(
      (res: HttpResponse<IMonthlyIncomeInvoice[]>) => {
        this.isLoading = false;
        this.monthlyIncomeInvoices = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMonthlyIncomeInvoice): number {
    return item.id!;
  }

  delete(monthlyIncomeInvoice: IMonthlyIncomeInvoice): void {
    const modalRef = this.modalService.open(MonthlyIncomeInvoiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.monthlyIncomeInvoice = monthlyIncomeInvoice;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
