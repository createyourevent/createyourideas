jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IdeaTransactionIdService } from '../service/idea-transaction-id.service';
import { IIdeaTransactionId, IdeaTransactionId } from '../idea-transaction-id.model';

import { IdeaTransactionIdUpdateComponent } from './idea-transaction-id-update.component';

describe('IdeaTransactionId Management Update Component', () => {
  let comp: IdeaTransactionIdUpdateComponent;
  let fixture: ComponentFixture<IdeaTransactionIdUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ideaTransactionIdService: IdeaTransactionIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaTransactionIdUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(IdeaTransactionIdUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdeaTransactionIdUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ideaTransactionIdService = TestBed.inject(IdeaTransactionIdService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const ideaTransactionId: IIdeaTransactionId = { id: 456 };

      activatedRoute.data = of({ ideaTransactionId });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ideaTransactionId));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaTransactionId>>();
      const ideaTransactionId = { id: 123 };
      jest.spyOn(ideaTransactionIdService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaTransactionId });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ideaTransactionId }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ideaTransactionIdService.update).toHaveBeenCalledWith(ideaTransactionId);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaTransactionId>>();
      const ideaTransactionId = new IdeaTransactionId();
      jest.spyOn(ideaTransactionIdService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaTransactionId });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ideaTransactionId }));
      saveSubject.complete();

      // THEN
      expect(ideaTransactionIdService.create).toHaveBeenCalledWith(ideaTransactionId);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IdeaTransactionId>>();
      const ideaTransactionId = { id: 123 };
      jest.spyOn(ideaTransactionIdService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ideaTransactionId });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ideaTransactionIdService.update).toHaveBeenCalledWith(ideaTransactionId);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
