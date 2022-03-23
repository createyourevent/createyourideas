import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOutgoings } from '../outgoings.model';

@Component({
  selector: 'jhi-outgoings-detail',
  templateUrl: './outgoings-detail.component.html',
})
export class OutgoingsDetailComponent implements OnInit {
  outgoings: IOutgoings | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ outgoings }) => {
      this.outgoings = outgoings;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
