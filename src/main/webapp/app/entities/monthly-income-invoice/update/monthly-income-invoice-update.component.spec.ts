jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MonthlyIncomeInvoiceService } from '../service/monthly-income-invoice.service';
import { IMonthlyIncomeInvoice, MonthlyIncomeInvoice } from '../monthly-income-invoice.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

import { MonthlyIncomeInvoiceUpdateComponent } from './monthly-income-invoice-update.component';

describe('MonthlyIncomeInvoice Management Update Component', () => {
  let comp: MonthlyIncomeInvoiceUpdateComponent;
  let fixture: ComponentFixture<MonthlyIncomeInvoiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let monthlyIncomeInvoiceService: MonthlyIncomeInvoiceService;
  let ideaService: IdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MonthlyIncomeInvoiceUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(MonthlyIncomeInvoiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MonthlyIncomeInvoiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    monthlyIncomeInvoiceService = TestBed.inject(MonthlyIncomeInvoiceService);
    ideaService = TestBed.inject(IdeaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Idea query and add missing value', () => {
      const monthlyIncomeInvoice: IMonthlyIncomeInvoice = { id: 456 };
      const idea: IIdea = { id: 98243 };
      monthlyIncomeInvoice.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 51825 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ monthlyIncomeInvoice });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const monthlyIncomeInvoice: IMonthlyIncomeInvoice = { id: 456 };
      const idea: IIdea = { id: 86343 };
      monthlyIncomeInvoice.idea = idea;

      activatedRoute.data = of({ monthlyIncomeInvoice });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(monthlyIncomeInvoice));
      expect(comp.ideasSharedCollection).toContain(idea);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MonthlyIncomeInvoice>>();
      const monthlyIncomeInvoice = { id: 123 };
      jest.spyOn(monthlyIncomeInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ monthlyIncomeInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: monthlyIncomeInvoice }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(monthlyIncomeInvoiceService.update).toHaveBeenCalledWith(monthlyIncomeInvoice);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MonthlyIncomeInvoice>>();
      const monthlyIncomeInvoice = new MonthlyIncomeInvoice();
      jest.spyOn(monthlyIncomeInvoiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ monthlyIncomeInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: monthlyIncomeInvoice }));
      saveSubject.complete();

      // THEN
      expect(monthlyIncomeInvoiceService.create).toHaveBeenCalledWith(monthlyIncomeInvoice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MonthlyIncomeInvoice>>();
      const monthlyIncomeInvoice = { id: 123 };
      jest.spyOn(monthlyIncomeInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ monthlyIncomeInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(monthlyIncomeInvoiceService.update).toHaveBeenCalledWith(monthlyIncomeInvoice);
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
});
