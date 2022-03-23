jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OutgoingsService } from '../service/outgoings.service';
import { IOutgoings, Outgoings } from '../outgoings.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

import { OutgoingsUpdateComponent } from './outgoings-update.component';

describe('Outgoings Management Update Component', () => {
  let comp: OutgoingsUpdateComponent;
  let fixture: ComponentFixture<OutgoingsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let outgoingsService: OutgoingsService;
  let ideaService: IdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OutgoingsUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(OutgoingsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OutgoingsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    outgoingsService = TestBed.inject(OutgoingsService);
    ideaService = TestBed.inject(IdeaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Idea query and add missing value', () => {
      const outgoings: IOutgoings = { id: 456 };
      const outgoingIdeas: IIdea[] = [{ id: 34362 }];
      outgoings.outgoingIdeas = outgoingIdeas;
      const idea: IIdea = { id: 64421 };
      outgoings.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 90003 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [...outgoingIdeas, idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ outgoings });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const outgoings: IOutgoings = { id: 456 };
      const outgoingIdeas: IIdea = { id: 3578 };
      outgoings.outgoingIdeas = [outgoingIdeas];
      const idea: IIdea = { id: 24709 };
      outgoings.idea = idea;

      activatedRoute.data = of({ outgoings });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(outgoings));
      expect(comp.ideasSharedCollection).toContain(outgoingIdeas);
      expect(comp.ideasSharedCollection).toContain(idea);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Outgoings>>();
      const outgoings = { id: 123 };
      jest.spyOn(outgoingsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ outgoings });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: outgoings }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(outgoingsService.update).toHaveBeenCalledWith(outgoings);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Outgoings>>();
      const outgoings = new Outgoings();
      jest.spyOn(outgoingsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ outgoings });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: outgoings }));
      saveSubject.complete();

      // THEN
      expect(outgoingsService.create).toHaveBeenCalledWith(outgoings);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Outgoings>>();
      const outgoings = { id: 123 };
      jest.spyOn(outgoingsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ outgoings });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(outgoingsService.update).toHaveBeenCalledWith(outgoings);
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
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedIdea', () => {
      it('Should return option if no Idea is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedIdea(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Idea for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedIdea(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Idea is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedIdea(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
