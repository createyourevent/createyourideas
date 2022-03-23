jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { WorksheetService } from '../service/worksheet.service';
import { IWorksheet, Worksheet } from '../worksheet.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

import { WorksheetUpdateComponent } from './worksheet-update.component';

describe('Worksheet Management Update Component', () => {
  let comp: WorksheetUpdateComponent;
  let fixture: ComponentFixture<WorksheetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let worksheetService: WorksheetService;
  let employeeService: EmployeeService;
  let ideaService: IdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WorksheetUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(WorksheetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorksheetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    worksheetService = TestBed.inject(WorksheetService);
    employeeService = TestBed.inject(EmployeeService);
    ideaService = TestBed.inject(IdeaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Employee query and add missing value', () => {
      const worksheet: IWorksheet = { id: 456 };
      const employee: IEmployee = { id: 74920 };
      worksheet.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: 72990 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [employee];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, ...additionalEmployees);
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Idea query and add missing value', () => {
      const worksheet: IWorksheet = { id: 456 };
      const idea: IIdea = { id: 74651 };
      worksheet.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 25995 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const worksheet: IWorksheet = { id: 456 };
      const employee: IEmployee = { id: 73613 };
      worksheet.employee = employee;
      const idea: IIdea = { id: 55565 };
      worksheet.idea = idea;

      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(worksheet));
      expect(comp.employeesSharedCollection).toContain(employee);
      expect(comp.ideasSharedCollection).toContain(idea);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Worksheet>>();
      const worksheet = { id: 123 };
      jest.spyOn(worksheetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: worksheet }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(worksheetService.update).toHaveBeenCalledWith(worksheet);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Worksheet>>();
      const worksheet = new Worksheet();
      jest.spyOn(worksheetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: worksheet }));
      saveSubject.complete();

      // THEN
      expect(worksheetService.create).toHaveBeenCalledWith(worksheet);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Worksheet>>();
      const worksheet = { id: 123 };
      jest.spyOn(worksheetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(worksheetService.update).toHaveBeenCalledWith(worksheet);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEmployeeById', () => {
      it('Should return tracked Employee primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEmployeeById(0, entity);
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
  });
});
