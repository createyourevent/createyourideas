import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDonation } from '../donation.model';
import { DonationService } from '../service/donation.service';
import { DonationDeleteDialogComponent } from '../delete/donation-delete-dialog.component';

@Component({
  selector: 'jhi-donation',
  templateUrl: './donation.component.html',
})
export class DonationComponent implements OnInit {
  donations?: IDonation[];
  isLoading = false;

  constructor(protected donationService: DonationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.donationService.query().subscribe(
      (res: HttpResponse<IDonation[]>) => {
        this.isLoading = false;
        this.donations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDonation): number {
    return item.id!;
  }

  delete(donation: IDonation): void {
    const modalRef = this.modalService.open(DonationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.donation = donation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
