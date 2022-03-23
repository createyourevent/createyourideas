import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProperties } from '../properties.model';
import { PropertiesService } from '../service/properties.service';
import { PropertiesDeleteDialogComponent } from '../delete/properties-delete-dialog.component';

@Component({
  selector: 'jhi-properties',
  templateUrl: './properties.component.html',
})
export class PropertiesComponent implements OnInit {
  properties?: IProperties[];
  isLoading = false;

  constructor(protected propertiesService: PropertiesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.propertiesService.query().subscribe(
      (res: HttpResponse<IProperties[]>) => {
        this.isLoading = false;
        this.properties = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProperties): number {
    return item.id!;
  }

  delete(properties: IProperties): void {
    const modalRef = this.modalService.open(PropertiesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.properties = properties;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
