jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IncomeService } from '../service/income.service';
import { IIncome, Income } from '../income.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

import { IncomeUpdateComponent } from './income-update.component';

describe('Income Management Update Component', () => {
  let comp: IncomeUpdateComponent;
  let fixture: ComponentFixture<IncomeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let incomeService: IncomeService;
  let ideaService: IdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IncomeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(IncomeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IncomeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    incomeService = TestBed.inject(IncomeService);
    ideaService = TestBed.inject(IdeaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Idea query and add missing value', () => {
      const income: IIncome = { id: 456 };
      const incomeIdeas: IIdea[] = [{ id: 17750 }];
      income.incomeIdeas = incomeIdeas;
      const idea: IIdea = { id: 68009 };
      income.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 50883 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [...incomeIdeas, idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ income });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const income: IIncome = { id: 456 };
      const incomeIdeas: IIdea = { id: 7730 };
      income.incomeIdeas = [incomeIdeas];
      const idea: IIdea = { id: 43253 };
      income.idea = idea;

      activatedRoute.data = of({ income });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(income));
      expect(comp.ideasSharedCollection).toContain(incomeIdeas);
      expect(comp.ideasSharedCollection).toContain(idea);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Income>>();
      const income = { id: 123 };
      jest.spyOn(incomeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ income });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: income }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(incomeService.update).toHaveBeenCalledWith(income);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Income>>();
      const income = new Income();
      jest.spyOn(incomeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ income });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: income }));
      saveSubject.complete();

      // THEN
      expect(incomeService.create).toHaveBeenCalledWith(income);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Income>>();
      const income = { id: 123 };
      jest.spyOn(incomeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ income });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(incomeService.update).toHaveBeenCalledWith(income);
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
