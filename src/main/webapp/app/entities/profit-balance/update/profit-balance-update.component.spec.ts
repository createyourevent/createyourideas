jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProfitBalanceService } from '../service/profit-balance.service';
import { IProfitBalance, ProfitBalance } from '../profit-balance.model';

import { ProfitBalanceUpdateComponent } from './profit-balance-update.component';

describe('ProfitBalance Management Update Component', () => {
  let comp: ProfitBalanceUpdateComponent;
  let fixture: ComponentFixture<ProfitBalanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let profitBalanceService: ProfitBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProfitBalanceUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ProfitBalanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfitBalanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    profitBalanceService = TestBed.inject(ProfitBalanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const profitBalance: IProfitBalance = { id: 456 };

      activatedRoute.data = of({ profitBalance });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(profitBalance));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProfitBalance>>();
      const profitBalance = { id: 123 };
      jest.spyOn(profitBalanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profitBalance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profitBalance }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(profitBalanceService.update).toHaveBeenCalledWith(profitBalance);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProfitBalance>>();
      const profitBalance = new ProfitBalance();
      jest.spyOn(profitBalanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profitBalance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profitBalance }));
      saveSubject.complete();

      // THEN
      expect(profitBalanceService.create).toHaveBeenCalledWith(profitBalance);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProfitBalance>>();
      const profitBalance = { id: 123 };
      jest.spyOn(profitBalanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profitBalance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(profitBalanceService.update).toHaveBeenCalledWith(profitBalance);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
