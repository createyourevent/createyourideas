import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserPointAssociation } from '../user-point-association.model';
import { UserPointAssociationService } from '../service/user-point-association.service';
import { UserPointAssociationDeleteDialogComponent } from '../delete/user-point-association-delete-dialog.component';

@Component({
  selector: 'jhi-user-point-association',
  templateUrl: './user-point-association.component.html',
})
export class UserPointAssociationComponent implements OnInit {
  userPointAssociations?: IUserPointAssociation[];
  isLoading = false;

  constructor(protected userPointAssociationService: UserPointAssociationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userPointAssociationService.query().subscribe(
      (res: HttpResponse<IUserPointAssociation[]>) => {
        this.isLoading = false;
        this.userPointAssociations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUserPointAssociation): number {
    return item.id!;
  }

  delete(userPointAssociation: IUserPointAssociation): void {
    const modalRef = this.modalService.open(UserPointAssociationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userPointAssociation = userPointAssociation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
