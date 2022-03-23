import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IIdeaComment, IdeaComment } from '../idea-comment.model';
import { IdeaCommentService } from '../service/idea-comment.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-idea-comment-update',
  templateUrl: './idea-comment-update.component.html',
})
export class IdeaCommentUpdateComponent implements OnInit {
  isSaving = false;

  ideaCommentsSharedCollection: IIdeaComment[] = [];
  ideasSharedCollection: IIdea[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    date: [],
    idea: [],
    user: [],
    ideaComment: [],
  });

  constructor(
    protected ideaCommentService: IdeaCommentService,
    protected ideaService: IdeaService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ideaComment }) => {
      if (ideaComment.id === undefined) {
        const today = dayjs().startOf('day');
        ideaComment.date = today;
      }

      this.updateForm(ideaComment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ideaComment = this.createFromForm();
    if (ideaComment.id !== undefined) {
      this.subscribeToSaveResponse(this.ideaCommentService.update(ideaComment));
    } else {
      this.subscribeToSaveResponse(this.ideaCommentService.create(ideaComment));
    }
  }

  trackIdeaCommentById(index: number, item: IIdeaComment): number {
    return item.id!;
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIdeaComment>>): void {
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

  protected updateForm(ideaComment: IIdeaComment): void {
    this.editForm.patchValue({
      id: ideaComment.id,
      comment: ideaComment.comment,
      date: ideaComment.date ? ideaComment.date.format(DATE_TIME_FORMAT) : null,
      idea: ideaComment.idea,
      user: ideaComment.user,
      ideaComment: ideaComment.ideaComment,
    });

    this.ideaCommentsSharedCollection = this.ideaCommentService.addIdeaCommentToCollectionIfMissing(
      this.ideaCommentsSharedCollection,
      ideaComment.ideaComment
    );
    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, ideaComment.idea);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, ideaComment.user);
  }

  protected loadRelationshipsOptions(): void {
    this.ideaCommentService
      .query()
      .pipe(map((res: HttpResponse<IIdeaComment[]>) => res.body ?? []))
      .pipe(
        map((ideaComments: IIdeaComment[]) =>
          this.ideaCommentService.addIdeaCommentToCollectionIfMissing(ideaComments, this.editForm.get('ideaComment')!.value)
        )
      )
      .subscribe((ideaComments: IIdeaComment[]) => (this.ideaCommentsSharedCollection = ideaComments));

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

  protected createFromForm(): IIdeaComment {
    return {
      ...new IdeaComment(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      idea: this.editForm.get(['idea'])!.value,
      user: this.editForm.get(['user'])!.value,
      ideaComment: this.editForm.get(['ideaComment'])!.value,
    };
  }
}
