import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IApplication } from '../application.model';
import { ApplicationService } from '../service/application.service';
import { ApplicationDeleteDialogComponent } from '../delete/application-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-application',
  templateUrl: './application.component.html',
})
export class ApplicationComponent implements OnInit {
  applications?: IApplication[];
  isLoading = false;

  constructor(protected applicationService: ApplicationService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.applicationService.query().subscribe(
      (res: HttpResponse<IApplication[]>) => {
        this.isLoading = false;
        this.applications = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IApplication): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(application: IApplication): void {
    const modalRef = this.modalService.open(ApplicationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.application = application;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
