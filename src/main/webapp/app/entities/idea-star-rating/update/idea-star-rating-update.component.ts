import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IIdeaStarRating, IdeaStarRating } from '../idea-star-rating.model';
import { IdeaStarRatingService } from '../service/idea-star-rating.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-idea-star-rating-update',
  templateUrl: './idea-star-rating-update.component.html',
})
export class IdeaStarRatingUpdateComponent implements OnInit {
  isSaving = false;

  ideasSharedCollection: IIdea[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    stars: [],
    date: [],
    comment: [],
    idea: [],
    user: [],
  });

  constructor(
    protected ideaStarRatingService: IdeaStarRatingService,
    protected ideaService: IdeaService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ideaStarRating }) => {
      if (ideaStarRating.id === undefined) {
        const today = dayjs().startOf('day');
        ideaStarRating.date = today;
      }

      this.updateForm(ideaStarRating);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ideaStarRating = this.createFromForm();
    if (ideaStarRating.id !== undefined) {
      this.subscribeToSaveResponse(this.ideaStarRatingService.update(ideaStarRating));
    } else {
      this.subscribeToSaveResponse(this.ideaStarRatingService.create(ideaStarRating));
    }
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIdeaStarRating>>): void {
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

  protected updateForm(ideaStarRating: IIdeaStarRating): void {
    this.editForm.patchValue({
      id: ideaStarRating.id,
      stars: ideaStarRating.stars,
      date: ideaStarRating.date ? ideaStarRating.date.format(DATE_TIME_FORMAT) : null,
      comment: ideaStarRating.comment,
      idea: ideaStarRating.idea,
      user: ideaStarRating.user,
    });

    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, ideaStarRating.idea);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, ideaStarRating.user);
  }

  protected loadRelationshipsOptions(): void {
    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(map((ideas: IIdea[]) => this.ideaService.addIdeaToCollectionIfMissing(ideas, this.editForm.get('idea')!.value)))
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IIdeaStarRating {
    return {
      ...new IdeaStarRating(),
      id: this.editForm.get(['id'])!.value,
      stars: this.editForm.get(['stars'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      idea: this.editForm.get(['idea'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
