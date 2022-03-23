jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IdeaLikeDislikeService } from '../service/idea-like-dislike.service';
import { IIdeaLikeDislike, IdeaLikeDislike } from '../idea-like-dislike.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { IdeaLikeDislikeUpdateComponent } from './idea-like-dislike-update.component';

describe('IdeaLikeDislike Management Update Component', () => {
  let comp: IdeaLikeDislikeUpdateComponent;
  let fixture: ComponentFixture<IdeaLikeDislikeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ideaLikeDislikeService: IdeaLikeDislikeService;
  let ideaService: IdeaService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaLikeDislikeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(IdeaLikeDislikeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdeaLikeDislikeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ideaLikeDislikeService = TestBed.inject(IdeaLikeDislikeService);
    ideaService = TestBed.inject(IdeaService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Idea query and add missing value', () => {
      const ideaLikeDislike: IIdeaLikeDislike = { id: 456 };
      const idea: IIdea = { id: 8252 };
      ideaLikeDislike.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 86487 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ideaLikeDislike });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const ideaLikeDislike: IIdeaLikeDislike = { id: 456 };
      const user: IUser = { id: 'f0fd4fb8-3b98-43b0-9b8c-cec8aa17a7a5' };
      ideaLikeDislike.user = user;

      const userCollection: IUser[] = [{ id: '95aa9ce8-ef32-4505-b898-b672922bda3f' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ideaLikeDislike });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ideaLikeDislike: IIdeaLikeDislike = { id: 456 };
      const idea: IIdea = { id: 55159 };
      ideaLikeDislike.idea = idea;
      const user: IUser = { id: 'd00d784a-9608-404d-827d-eabfad01ebc9' };
      ideaLikeDislike.user = user;

      activatedRoute.data = of({ ideaLikeDislike });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ideaLikeDislike));
      expect(comp.ideasSharedCollection).toContain(idea);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaLikeDislike>>();
      const ideaLikeDislike = { id: 123 };
      jest.spyOn(ideaLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ideaLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ideaLikeDislikeService.update).toHaveBeenCalledWith(ideaLikeDislike);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaLikeDislike>>();
      const ideaLikeDislike = new IdeaLikeDislike();
      jest.spyOn(ideaLikeDislikeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ideaLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(ideaLikeDislikeService.create).toHaveBeenCalledWith(ideaLikeDislike);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaLikeDislike>>();
      const ideaLikeDislike = { id: 123 };
      jest.spyOn(ideaLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ideaLikeDislikeService.update).toHaveBeenCalledWith(ideaLikeDislike);
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
