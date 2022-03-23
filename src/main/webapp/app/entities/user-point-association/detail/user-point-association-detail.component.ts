import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserPointAssociation } from '../user-point-association.model';

@Component({
  selector: 'jhi-user-point-association-detail',
  templateUrl: './user-point-association-detail.component.html',
})
export class UserPointAssociationDetailComponent implements OnInit {
  userPointAssociation: IUserPointAssociation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPointAssociation }) => {
      this.userPointAssociation = userPointAssociation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
