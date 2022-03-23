jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MonthlyOutgoingsInvoiceService } from '../service/monthly-outgoings-invoice.service';
import { IMonthlyOutgoingsInvoice, MonthlyOutgoingsInvoice } from '../monthly-outgoings-invoice.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

import { MonthlyOutgoingsInvoiceUpdateComponent } from './monthly-outgoings-invoice-update.component';

describe('MonthlyOutgoingsInvoice Management Update Component', () => {
  let comp: MonthlyOutgoingsInvoiceUpdateComponent;
  let fixture: ComponentFixture<MonthlyOutgoingsInvoiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let monthlyOutgoingsInvoiceService: MonthlyOutgoingsInvoiceService;
  let ideaService: IdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MonthlyOutgoingsInvoiceUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(MonthlyOutgoingsInvoiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MonthlyOutgoingsInvoiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    monthlyOutgoingsInvoiceService = TestBed.inject(MonthlyOutgoingsInvoiceService);
    ideaService = TestBed.inject(IdeaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Idea query and add missing value', () => {
      const monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice = { id: 456 };
      const idea: IIdea = { id: 21983 };
      monthlyOutgoingsInvoice.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 81770 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ monthlyOutgoingsInvoice });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice = { id: 456 };
      const idea: IIdea = { id: 94761 };
      monthlyOutgoingsInvoice.idea = idea;

      activatedRoute.data = of({ monthlyOutgoingsInvoice });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(monthlyOutgoingsInvoice));
      expect(comp.ideasSharedCollection).toContain(idea);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MonthlyOutgoingsInvoice>>();
      const monthlyOutgoingsInvoice = { id: 123 };
      jest.spyOn(monthlyOutgoingsInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ monthlyOutgoingsInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: monthlyOutgoingsInvoice }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(monthlyOutgoingsInvoiceService.update).toHaveBeenCalledWith(monthlyOutgoingsInvoice);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MonthlyOutgoingsInvoice>>();
      const monthlyOutgoingsInvoice = new MonthlyOutgoingsInvoice();
      jest.spyOn(monthlyOutgoingsInvoiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ monthlyOutgoingsInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: monthlyOutgoingsInvoice }));
      saveSubject.complete();

      // THEN
      expect(monthlyOutgoingsInvoiceService.create).toHaveBeenCalledWith(monthlyOutgoingsInvoice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MonthlyOutgoingsInvoice>>();
      const monthlyOutgoingsInvoice = { id: 123 };
      jest.spyOn(monthlyOutgoingsInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ monthlyOutgoingsInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(monthlyOutgoingsInvoiceService.update).toHaveBeenCalledWith(monthlyOutgoingsInvoice);
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
