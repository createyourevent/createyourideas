jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DonationService } from '../service/donation.service';
import { IDonation, Donation } from '../donation.model';
import { IIdeaTransactionId } from 'app/entities/idea-transaction-id/idea-transaction-id.model';
import { IdeaTransactionIdService } from 'app/entities/idea-transaction-id/service/idea-transaction-id.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

import { DonationUpdateComponent } from './donation-update.component';

describe('Donation Management Update Component', () => {
  let comp: DonationUpdateComponent;
  let fixture: ComponentFixture<DonationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let donationService: DonationService;
  let ideaTransactionIdService: IdeaTransactionIdService;
  let userService: UserService;
  let ideaService: IdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DonationUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(DonationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DonationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    donationService = TestBed.inject(DonationService);
    ideaTransactionIdService = TestBed.inject(IdeaTransactionIdService);
    userService = TestBed.inject(UserService);
    ideaService = TestBed.inject(IdeaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call txId query and add missing value', () => {
      const donation: IDonation = { id: 456 };
      const txId: IIdeaTransactionId = { id: 75497 };
      donation.txId = txId;

      const txIdCollection: IIdeaTransactionId[] = [{ id: 98409 }];
      jest.spyOn(ideaTransactionIdService, 'query').mockReturnValue(of(new HttpResponse({ body: txIdCollection })));
      const expectedCollection: IIdeaTransactionId[] = [txId, ...txIdCollection];
      jest.spyOn(ideaTransactionIdService, 'addIdeaTransactionIdToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      expect(ideaTransactionIdService.query).toHaveBeenCalled();
      expect(ideaTransactionIdService.addIdeaTransactionIdToCollectionIfMissing).toHaveBeenCalledWith(txIdCollection, txId);
      expect(comp.txIdsCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const donation: IDonation = { id: 456 };
      const user: IUser = { id: '6a331b0e-4c14-491a-8a95-b0817faae644' };
      donation.user = user;

      const userCollection: IUser[] = [{ id: '9ce4190a-6eae-4b36-b50d-85264bf15e52' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Idea query and add missing value', () => {
      const donation: IDonation = { id: 456 };
      const idea: IIdea = { id: 64447 };
      donation.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 70452 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const donation: IDonation = { id: 456 };
      const txId: IIdeaTransactionId = { id: 25517 };
      donation.txId = txId;
      const user: IUser = { id: 'd7343538-6511-45dc-8946-3a6605876172' };
      donation.user = user;
      const idea: IIdea = { id: 85203 };
      donation.idea = idea;

      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(donation));
      expect(comp.txIdsCollection).toContain(txId);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.ideasSharedCollection).toContain(idea);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Donation>>();
      const donation = { id: 123 };
      jest.spyOn(donationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(donationService.update).toHaveBeenCalledWith(donation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Donation>>();
      const donation = new Donation();
      jest.spyOn(donationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donation }));
      saveSubject.complete();

      // THEN
      expect(donationService.create).toHaveBeenCalledWith(donation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Donation>>();
      const donation = { id: 123 };
      jest.spyOn(donationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(donationService.update).toHaveBeenCalledWith(donation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackIdeaTransactionIdById', () => {
      it('Should return tracked IdeaTransactionId primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIdeaTransactionIdById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackIdeaById', () => {
      it('Should return tracked Idea primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIdeaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
