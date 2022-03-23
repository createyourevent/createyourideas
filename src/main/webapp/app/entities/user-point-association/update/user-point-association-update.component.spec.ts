jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserPointAssociationService } from '../service/user-point-association.service';
import { IUserPointAssociation, UserPointAssociation } from '../user-point-association.model';
import { IPoint } from 'app/entities/point/point.model';
import { PointService } from 'app/entities/point/service/point.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserPointAssociationUpdateComponent } from './user-point-association-update.component';

describe('UserPointAssociation Management Update Component', () => {
  let comp: UserPointAssociationUpdateComponent;
  let fixture: ComponentFixture<UserPointAssociationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userPointAssociationService: UserPointAssociationService;
  let pointService: PointService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserPointAssociationUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(UserPointAssociationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPointAssociationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userPointAssociationService = TestBed.inject(UserPointAssociationService);
    pointService = TestBed.inject(PointService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Point query and add missing value', () => {
      const userPointAssociation: IUserPointAssociation = { id: 456 };
      const points: IPoint = { id: 42411 };
      userPointAssociation.points = points;

      const pointCollection: IPoint[] = [{ id: 34643 }];
      jest.spyOn(pointService, 'query').mockReturnValue(of(new HttpResponse({ body: pointCollection })));
      const additionalPoints = [points];
      const expectedCollection: IPoint[] = [...additionalPoints, ...pointCollection];
      jest.spyOn(pointService, 'addPointToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userPointAssociation });
      comp.ngOnInit();

      expect(pointService.query).toHaveBeenCalled();
      expect(pointService.addPointToCollectionIfMissing).toHaveBeenCalledWith(pointCollection, ...additionalPoints);
      expect(comp.pointsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const userPointAssociation: IUserPointAssociation = { id: 456 };
      const users: IUser = { id: 'dfa1fc69-e6aa-42a2-897c-193c5e5d7d65' };
      userPointAssociation.users = users;

      const userCollection: IUser[] = [{ id: '1bc032b3-d371-4117-82d1-1dd741f6272b' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [users];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userPointAssociation });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userPointAssociation: IUserPointAssociation = { id: 456 };
      const points: IPoint = { id: 98879 };
      userPointAssociation.points = points;
      const users: IUser = { id: '332323ae-3442-41a7-8388-4418c4dc9c96' };
      userPointAssociation.users = users;

      activatedRoute.data = of({ userPointAssociation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(userPointAssociation));
      expect(comp.pointsSharedCollection).toContain(points);
      expect(comp.usersSharedCollection).toContain(users);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserPointAssociation>>();
      const userPointAssociation = { id: 123 };
      jest.spyOn(userPointAssociationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPointAssociation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPointAssociation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(userPointAssociationService.update).toHaveBeenCalledWith(userPointAssociation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserPointAssociation>>();
      const userPointAssociation = new UserPointAssociation();
      jest.spyOn(userPointAssociationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPointAssociation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPointAssociation }));
      saveSubject.complete();

      // THEN
      expect(userPointAssociationService.create).toHaveBeenCalledWith(userPointAssociation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserPointAssociation>>();
      const userPointAssociation = { id: 123 };
      jest.spyOn(userPointAssociationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPointAssociation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userPointAssociationService.update).toHaveBeenCalledWith(userPointAssociation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPointById', () => {
      it('Should return tracked Point primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPointById(0, entity);
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
  });
});
