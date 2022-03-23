import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IIdeaLikeDislike, IdeaLikeDislike } from '../idea-like-dislike.model';
import { IdeaLikeDislikeService } from '../service/idea-like-dislike.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-idea-like-dislike-update',
  templateUrl: './idea-like-dislike-update.component.html',
})
export class IdeaLikeDislikeUpdateComponent implements OnInit {
  isSaving = false;

  ideasSharedCollection: IIdea[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    like: [],
    dislike: [],
    date: [],
    comment: [],
    idea: [],
    user: [],
  });

  constructor(
    protected ideaLikeDislikeService: IdeaLikeDislikeService,
    protected ideaService: IdeaService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ideaLikeDislike }) => {
      if (ideaLikeDislike.id === undefined) {
        const today = dayjs().startOf('day');
        ideaLikeDislike.date = today;
      }

      this.updateForm(ideaLikeDislike);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ideaLikeDislike = this.createFromForm();
    if (ideaLikeDislike.id !== undefined) {
      this.subscribeToSaveResponse(this.ideaLikeDislikeService.update(ideaLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.ideaLikeDislikeService.create(ideaLikeDislike));
    }
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIdeaLikeDislike>>): void {
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

  protected updateForm(ideaLikeDislike: IIdeaLikeDislike): void {
    this.editForm.patchValue({
      id: ideaLikeDislike.id,
      like: ideaLikeDislike.like,
      dislike: ideaLikeDislike.dislike,
      date: ideaLikeDislike.date ? ideaLikeDislike.date.format(DATE_TIME_FORMAT) : null,
      comment: ideaLikeDislike.comment,
      idea: ideaLikeDislike.idea,
      user: ideaLikeDislike.user,
    });

    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, ideaLikeDislike.idea);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, ideaLikeDislike.user);
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

  protected createFromForm(): IIdeaLikeDislike {
    return {
      ...new IdeaLikeDislike(),
      id: this.editForm.get(['id'])!.value,
      like: this.editForm.get(['like'])!.value,
      dislike: this.editForm.get(['dislike'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      idea: this.editForm.get(['idea'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
