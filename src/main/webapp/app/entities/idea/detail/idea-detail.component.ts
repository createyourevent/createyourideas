import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIdea } from '../idea.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-idea-detail',
  templateUrl: './idea-detail.component.html',
})
export class IdeaDetailComponent implements OnInit {
  idea: IIdea | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.idea = idea;
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
