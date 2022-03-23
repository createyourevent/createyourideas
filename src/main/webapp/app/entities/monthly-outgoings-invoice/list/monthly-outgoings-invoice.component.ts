import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMonthlyOutgoingsInvoice } from '../monthly-outgoings-invoice.model';
import { MonthlyOutgoingsInvoiceService } from '../service/monthly-outgoings-invoice.service';
import { MonthlyOutgoingsInvoiceDeleteDialogComponent } from '../delete/monthly-outgoings-invoice-delete-dialog.component';

@Component({
  selector: 'jhi-monthly-outgoings-invoice',
  templateUrl: './monthly-outgoings-invoice.component.html',
})
export class MonthlyOutgoingsInvoiceComponent implements OnInit {
  monthlyOutgoingsInvoices?: IMonthlyOutgoingsInvoice[];
  isLoading = false;

  constructor(protected monthlyOutgoingsInvoiceService: MonthlyOutgoingsInvoiceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.monthlyOutgoingsInvoiceService.query().subscribe(
      (res: HttpResponse<IMonthlyOutgoingsInvoice[]>) => {
        this.isLoading = false;
        this.monthlyOutgoingsInvoices = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMonthlyOutgoingsInvoice): number {
    return item.id!;
  }

  delete(monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice): void {
    const modalRef = this.modalService.open(MonthlyOutgoingsInvoiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.monthlyOutgoingsInvoice = monthlyOutgoingsInvoice;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
