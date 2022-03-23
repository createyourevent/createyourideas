import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorksheet } from '../worksheet.model';
import { WorksheetService } from '../service/worksheet.service';
import { WorksheetDeleteDialogComponent } from '../delete/worksheet-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-worksheet',
  templateUrl: './worksheet.component.html',
})
export class WorksheetComponent implements OnInit {
  worksheets?: IWorksheet[];
  isLoading = false;

  constructor(protected worksheetService: WorksheetService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.worksheetService.query().subscribe(
      (res: HttpResponse<IWorksheet[]>) => {
        this.isLoading = false;
        this.worksheets = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IWorksheet): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(worksheet: IWorksheet): void {
    const modalRef = this.modalService.open(WorksheetDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.worksheet = worksheet;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
