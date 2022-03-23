import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProperties } from '../properties.model';

@Component({
  selector: 'jhi-properties-detail',
  templateUrl: './properties-detail.component.html',
})
export class PropertiesDetailComponent implements OnInit {
  properties: IProperties | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ properties }) => {
      this.properties = properties;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
