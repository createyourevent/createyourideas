jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IdeaStarRatingService } from '../service/idea-star-rating.service';
import { IIdeaStarRating, IdeaStarRating } from '../idea-star-rating.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { IdeaStarRatingUpdateComponent } from './idea-star-rating-update.component';

describe('IdeaStarRating Management Update Component', () => {
  let comp: IdeaStarRatingUpdateComponent;
  let fixture: ComponentFixture<IdeaStarRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ideaStarRatingService: IdeaStarRatingService;
  let ideaService: IdeaService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaStarRatingUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(IdeaStarRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdeaStarRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ideaStarRatingService = TestBed.inject(IdeaStarRatingService);
    ideaService = TestBed.inject(IdeaService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Idea query and add missing value', () => {
      const ideaStarRating: IIdeaStarRating = { id: 456 };
      const idea: IIdea = { id: 99420 };
      ideaStarRating.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 26523 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ideaStarRating });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const ideaStarRating: IIdeaStarRating = { id: 456 };
      const user: IUser = { id: '98ae87e0-34cc-4433-ba47-7a447053f92a' };
      ideaStarRating.user = user;

      const userCollection: IUser[] = [{ id: '7ae8d835-c515-4e57-9497-c99272679502' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ideaStarRating });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ideaStarRating: IIdeaStarRating = { id: 456 };
      const idea: IIdea = { id: 54361 };
      ideaStarRating.idea = idea;
      const user: IUser = { id: '7228be8f-a2ef-4cd2-93eb-bf79206e3bf1' };
      ideaStarRating.user = user;

      activatedRoute.data = of({ ideaStarRating });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ideaStarRating));
      expect(comp.ideasSharedCollection).toContain(idea);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaStarRating>>();
      const ideaStarRating = { id: 123 };
      jest.spyOn(ideaStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ideaStarRating }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ideaStarRatingService.update).toHaveBeenCalledWith(ideaStarRating);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaStarRating>>();
      const ideaStarRating = new IdeaStarRating();
      jest.spyOn(ideaStarRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ideaStarRating }));
      saveSubject.complete();

      // THEN
      expect(ideaStarRatingService.create).toHaveBeenCalledWith(ideaStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaStarRating>>();
      const ideaStarRating = { id: 123 };
      jest.spyOn(ideaStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ideaStarRatingService.update).toHaveBeenCalledWith(ideaStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackIdeaById', () => {
      it('Should return tracked Idea primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIdeaById(0, entity);
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
