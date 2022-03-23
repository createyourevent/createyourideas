import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IDonation, Donation } from '../donation.model';
import { DonationService } from '../service/donation.service';
import { IIdeaTransactionId } from 'app/entities/idea-transaction-id/idea-transaction-id.model';
import { IdeaTransactionIdService } from 'app/entities/idea-transaction-id/service/idea-transaction-id.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-donation-update',
  templateUrl: './donation-update.component.html',
})
export class DonationUpdateComponent implements OnInit {
  isSaving = false;

  txIdsCollection: IIdeaTransactionId[] = [];
  usersSharedCollection: IUser[] = [];
  ideasSharedCollection: IIdea[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [],
    date: [],
    billed: [],
    txId: [],
    user: [],
    idea: [],
  });

  constructor(
    protected donationService: DonationService,
    protected ideaTransactionIdService: IdeaTransactionIdService,
    protected userService: UserService,
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ donation }) => {
      if (donation.id === undefined) {
        const today = dayjs().startOf('day');
        donation.date = today;
      }

      this.updateForm(donation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const donation = this.createFromForm();
    if (donation.id !== undefined) {
      this.subscribeToSaveResponse(this.donationService.update(donation));
    } else {
      this.subscribeToSaveResponse(this.donationService.create(donation));
    }
  }

  trackIdeaTransactionIdById(index: number, item: IIdeaTransactionId): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackIdeaById(index: number, item: IIdea): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDonation>>): void {
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

  protected updateForm(donation: IDonation): void {
    this.editForm.patchValue({
      id: donation.id,
      amount: donation.amount,
      date: donation.date ? donation.date.format(DATE_TIME_FORMAT) : null,
      billed: donation.billed,
      txId: donation.txId,
      user: donation.user,
      idea: donation.idea,
    });

    this.txIdsCollection = this.ideaTransactionIdService.addIdeaTransactionIdToCollectionIfMissing(this.txIdsCollection, donation.txId);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, donation.user);
    this.ideasSharedCollection = this.ideaService.addIdeaToCollectionIfMissing(this.ideasSharedCollection, donation.idea);
  }

  protected loadRelationshipsOptions(): void {
    this.ideaTransactionIdService
      .query({ filter: 'idea-is-null' })
      .pipe(map((res: HttpResponse<IIdeaTransactionId[]>) => res.body ?? []))
      .pipe(
        map((ideaTransactionIds: IIdeaTransactionId[]) =>
          this.ideaTransactionIdService.addIdeaTransactionIdToCollectionIfMissing(ideaTransactionIds, this.editForm.get('txId')!.value)
        )
      )
      .subscribe((ideaTransactionIds: IIdeaTransactionId[]) => (this.txIdsCollection = ideaTransactionIds));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.ideaService
      .query()
      .pipe(map((res: HttpResponse<IIdea[]>) => res.body ?? []))
      .pipe(map((ideas: IIdea[]) => this.ideaService.addIdeaToCollectionIfMissing(ideas, this.editForm.get('idea')!.value)))
      .subscribe((ideas: IIdea[]) => (this.ideasSharedCollection = ideas));
  }

  protected createFromForm(): IDonation {
    return {
      ...new Donation(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      billed: this.editForm.get(['billed'])!.value,
      txId: this.editForm.get(['txId'])!.value,
      user: this.editForm.get(['user'])!.value,
      idea: this.editForm.get(['idea'])!.value,
    };
  }
}
