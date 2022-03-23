import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShare } from '../share.model';

@Component({
  selector: 'jhi-share-detail',
  templateUrl: './share-detail.component.html',
})
export class ShareDetailComponent implements OnInit {
  share: IShare | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ share }) => {
      this.share = share;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
