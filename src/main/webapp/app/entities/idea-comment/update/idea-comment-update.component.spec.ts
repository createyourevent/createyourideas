jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IdeaCommentService } from '../service/idea-comment.service';
import { IIdeaComment, IdeaComment } from '../idea-comment.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { IdeaCommentUpdateComponent } from './idea-comment-update.component';

describe('IdeaComment Management Update Component', () => {
  let comp: IdeaCommentUpdateComponent;
  let fixture: ComponentFixture<IdeaCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ideaCommentService: IdeaCommentService;
  let ideaService: IdeaService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaCommentUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(IdeaCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdeaCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ideaCommentService = TestBed.inject(IdeaCommentService);
    ideaService = TestBed.inject(IdeaService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call IdeaComment query and add missing value', () => {
      const ideaComment: IIdeaComment = { id: 456 };
      const ideaComment: IIdeaComment = { id: 13571 };
      ideaComment.ideaComment = ideaComment;

      const ideaCommentCollection: IIdeaComment[] = [{ id: 21483 }];
      jest.spyOn(ideaCommentService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCommentCollection })));
      const additionalIdeaComments = [ideaComment];
      const expectedCollection: IIdeaComment[] = [...additionalIdeaComments, ...ideaCommentCollection];
      jest.spyOn(ideaCommentService, 'addIdeaCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ideaComment });
      comp.ngOnInit();

      expect(ideaCommentService.query).toHaveBeenCalled();
      expect(ideaCommentService.addIdeaCommentToCollectionIfMissing).toHaveBeenCalledWith(ideaCommentCollection, ...additionalIdeaComments);
      expect(comp.ideaCommentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Idea query and add missing value', () => {
      const ideaComment: IIdeaComment = { id: 456 };
      const idea: IIdea = { id: 56309 };
      ideaComment.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 31654 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ideaComment });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const ideaComment: IIdeaComment = { id: 456 };
      const user: IUser = { id: '64551d5e-dfa0-4287-bc2c-8407270059fc' };
      ideaComment.user = user;

      const userCollection: IUser[] = [{ id: '4e41949f-0c9a-40bc-99cf-9b376542ed6b' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ideaComment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ideaComment: IIdeaComment = { id: 456 };
      const ideaComment: IIdeaComment = { id: 12779 };
      ideaComment.ideaComment = ideaComment;
      const idea: IIdea = { id: 33944 };
      ideaComment.idea = idea;
      const user: IUser = { id: '35c76020-b657-48da-bc21-79ee5bd8a791' };
      ideaComment.user = user;

      activatedRoute.data = of({ ideaComment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ideaComment));
      expect(comp.ideaCommentsSharedCollection).toContain(ideaComment);
      expect(comp.ideasSharedCollection).toContain(idea);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaComment>>();
      const ideaComment = { id: 123 };
      jest.spyOn(ideaCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ideaComment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ideaCommentService.update).toHaveBeenCalledWith(ideaComment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaComment>>();
      const ideaComment = new IdeaComment();
      jest.spyOn(ideaCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ideaComment }));
      saveSubject.complete();

      // THEN
      expect(ideaCommentService.create).toHaveBeenCalledWith(ideaComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaComment>>();
      const ideaComment = { id: 123 };
      jest.spyOn(ideaCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ideaCommentService.update).toHaveBeenCalledWith(ideaComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackIdeaCommentById', () => {
      it('Should return tracked IdeaComment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIdeaCommentById(0, entity);
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

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
