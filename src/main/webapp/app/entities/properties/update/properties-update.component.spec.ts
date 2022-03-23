jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PropertiesService } from '../service/properties.service';
import { IProperties, Properties } from '../properties.model';

import { PropertiesUpdateComponent } from './properties-update.component';

describe('Properties Management Update Component', () => {
  let comp: PropertiesUpdateComponent;
  let fixture: ComponentFixture<PropertiesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let propertiesService: PropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PropertiesUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(PropertiesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PropertiesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    propertiesService = TestBed.inject(PropertiesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const properties: IProperties = { id: 456 };

      activatedRoute.data = of({ properties });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(properties));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Properties>>();
      const properties = { id: 123 };
      jest.spyOn(propertiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ properties });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: properties }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(propertiesService.update).toHaveBeenCalledWith(properties);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Properties>>();
      const properties = new Properties();
      jest.spyOn(propertiesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ properties });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: properties }));
      saveSubject.complete();

      // THEN
      expect(propertiesService.create).toHaveBeenCalledWith(properties);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Properties>>();
      const properties = { id: 123 };
      jest.spyOn(propertiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ properties });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(propertiesService.update).toHaveBeenCalledWith(properties);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
