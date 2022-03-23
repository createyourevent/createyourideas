import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IUserPointAssociation, UserPointAssociation } from '../user-point-association.model';
import { UserPointAssociationService } from '../service/user-point-association.service';
import { IPoint } from 'app/entities/point/point.model';
import { PointService } from 'app/entities/point/service/point.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-user-point-association-update',
  templateUrl: './user-point-association-update.component.html',
})
export class UserPointAssociationUpdateComponent implements OnInit {
  isSaving = false;

  pointsSharedCollection: IPoint[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    points: [],
    users: [],
  });

  constructor(
    protected userPointAssociationService: UserPointAssociationService,
    protected pointService: PointService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPointAssociation }) => {
      if (userPointAssociation.id === undefined) {
        const today = dayjs().startOf('day');
        userPointAssociation.date = today;
      }

      this.updateForm(userPointAssociation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userPointAssociation = this.createFromForm();
    if (userPointAssociation.id !== undefined) {
      this.subscribeToSaveResponse(this.userPointAssociationService.update(userPointAssociation));
    } else {
      this.subscribeToSaveResponse(this.userPointAssociationService.create(userPointAssociation));
    }
  }

  trackPointById(index: number, item: IPoint): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserPointAssociation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userPointAssociation: IUserPointAssociation): void {
    this.editForm.patchValue({
      id: userPointAssociation.id,
      date: userPointAssociation.date ? userPointAssociation.date.format(DATE_TIME_FORMAT) : null,
      points: userPointAssociation.points,
      users: userPointAssociation.users,
    });

    this.pointsSharedCollection = this.pointService.addPointToCollectionIfMissing(this.pointsSharedCollection, userPointAssociation.points);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, userPointAssociation.users);
  }

  protected loadRelationshipsOptions(): void {
    this.pointService
      .query()
      .pipe(map((res: HttpResponse<IPoint[]>) => res.body ?? []))
      .pipe(map((points: IPoint[]) => this.pointService.addPointToCollectionIfMissing(points, this.editForm.get('points')!.value)))
      .subscribe((points: IPoint[]) => (this.pointsSharedCollection = points));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('users')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IUserPointAssociation {
    return {
      ...new UserPointAssociation(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      points: this.editForm.get(['points'])!.value,
      users: this.editForm.get(['users'])!.value,
    };
  }
}
