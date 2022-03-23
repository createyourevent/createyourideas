import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IShare } from '../share.model';
import { ShareService } from '../service/share.service';
import { ShareDeleteDialogComponent } from '../delete/share-delete-dialog.component';

@Component({
  selector: 'jhi-share',
  templateUrl: './share.component.html',
})
export class ShareComponent implements OnInit {
  shares?: IShare[];
  isLoading = false;

  constructor(protected shareService: ShareService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.shareService.query().subscribe(
      (res: HttpResponse<IShare[]>) => {
        this.isLoading = false;
        this.shares = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IShare): number {
    return item.id!;
  }

  delete(share: IShare): void {
    const modalRef = this.modalService.open(ShareDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.share = share;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
