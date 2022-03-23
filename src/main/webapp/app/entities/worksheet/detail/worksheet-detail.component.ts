import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorksheet } from '../worksheet.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-worksheet-detail',
  templateUrl: './worksheet-detail.component.html',
})
export class WorksheetDetailComponent implements OnInit {
  worksheet: IWorksheet | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ worksheet }) => {
      this.worksheet = worksheet;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
