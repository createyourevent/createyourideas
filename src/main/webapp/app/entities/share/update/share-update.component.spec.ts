jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ShareService } from '../service/share.service';
import { IShare, Share } from '../share.model';

import { ShareUpdateComponent } from './share-update.component';

describe('Share Management Update Component', () => {
  let comp: ShareUpdateComponent;
  let fixture: ComponentFixture<ShareUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shareService: ShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShareUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ShareUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShareUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shareService = TestBed.inject(ShareService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const share: IShare = { id: 456 };

      activatedRoute.data = of({ share });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(share));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Share>>();
      const share = { id: 123 };
      jest.spyOn(shareService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ share });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: share }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(shareService.update).toHaveBeenCalledWith(share);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Share>>();
      const share = new Share();
      jest.spyOn(shareService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ share });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: share }));
      saveSubject.complete();

      // THEN
      expect(shareService.create).toHaveBeenCalledWith(share);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Share>>();
      const share = { id: 123 };
      jest.spyOn(shareService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ share });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shareService.update).toHaveBeenCalledWith(share);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
