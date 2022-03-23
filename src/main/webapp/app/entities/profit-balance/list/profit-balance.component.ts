import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfitBalance } from '../profit-balance.model';
import { ProfitBalanceService } from '../service/profit-balance.service';
import { ProfitBalanceDeleteDialogComponent } from '../delete/profit-balance-delete-dialog.component';

@Component({
  selector: 'jhi-profit-balance',
  templateUrl: './profit-balance.component.html',
})
export class ProfitBalanceComponent implements OnInit {
  profitBalances?: IProfitBalance[];
  isLoading = false;

  constructor(protected profitBalanceService: ProfitBalanceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.profitBalanceService.query().subscribe(
      (res: HttpResponse<IProfitBalance[]>) => {
        this.isLoading = false;
        this.profitBalances = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProfitBalance): number {
    return item.id!;
  }

  delete(profitBalance: IProfitBalance): void {
    const modalRef = this.modalService.open(ProfitBalanceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.profitBalance = profitBalance;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
