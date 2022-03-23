import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOutgoings, Outgoings } from '../outgoings.model';
import { OutgoingsService } from '../service/outgoings.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-outgoings-update',
  templateUrl: './outgoings-update.component.html',
})
export class OutgoingsUpdateComponent implements OnInit {
  isSaving = false;

  ideasSharedCollection: IIdea[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [null, [Validators.required]],
    date: [null, [Validators.required]],
    value: [null, [Validators.required]],
    billed: [],
    toChildIdea: [],
    auto: [],
    outgoingIdeas: [],
    idea: [],
  });

  constructor(
    protected outgoingsService: OutgoingsService,
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ outgoings }) => {
      if (outgoings.id === undefined) {
        const today = dayjs().startOf('day');
        outgoings.date = today;
      }

      this.updateForm(outgoings);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const outgoings = this.createFromForm();
    if (outgoings.id !== undefined) {
      this.subscribeToSaveResponse(this.outgoingsService.update(outgoings));
    } else {
      this.subscribeToSaveResponse(this.outgoingsService.create(outgoings));
    }
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  getSelectedIdea(option: IIdea, selectedVals?: IIdea[]): IIdea {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOutgoings>>): void {
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

  protected updateForm(outgoings: IOutgoings): void {
    this.editForm.patchValue({
      id: outgoings.id,
      title: outgoings.title,
      description: outgoings.description,
      date: outgoings.date ? outgoings.date.format(DATE_TIME_FORMAT) : null,
      value: outgoings.value,
      billed: outgoings.billed,
      toChildIdea: outgoings.toChildIdea,
      auto: outgoings.auto,
      outgoingIdeas: outgoings.outgoingIdeas,
      idea: outgoings.idea,
    });

    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(
      this.ideasSharedCollection,
      ...(outgoings.outgoingIdeas ?? []),
      outgoings.idea
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(
        map((ideas: IIdea[]) =>
          this.ideaService.addIdeaToCollectionIfMissing(
            ideas,
            ...(this.editForm.get('outgoingIdeas')!.value ?? []),
            this.editForm.get('idea')!.value
          )
        )
      )
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));
  }

  protected createFromForm(): IOutgoings {
    return {
      ...new Outgoings(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      value: this.editForm.get(['value'])!.value,
      billed: this.editForm.get(['billed'])!.value,
      toChildIdea: this.editForm.get(['toChildIdea'])!.value,
      auto: this.editForm.get(['auto'])!.value,
      outgoingIdeas: this.editForm.get(['outgoingIdeas'])!.value,
      idea: this.editForm.get(['idea'])!.value,
    };
  }
}
