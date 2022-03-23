jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IdeaService } from '../service/idea.service';
import { IIdea, Idea } from '../idea.model';
import { IProfitBalance } from 'app/entities/profit-balance/profit-balance.model';
import { ProfitBalanceService } from 'app/entities/profit-balance/service/profit-balance.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { IdeaUpdateComponent } from './idea-update.component';

describe('Idea Management Update Component', () => {
  let comp: IdeaUpdateComponent;
  let fixture: ComponentFixture<IdeaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ideaService: IdeaService;
  let profitBalanceService: ProfitBalanceService;
  let userService: UserService;
  let employeeService: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(IdeaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdeaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ideaService = TestBed.inject(IdeaService);
    profitBalanceService = TestBed.inject(ProfitBalanceService);
    userService = TestBed.inject(UserService);
    employeeService = TestBed.inject(EmployeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call profitBalance query and add missing value', () => {
      const idea: IIdea = { id: 456 };
      const profitBalance: IProfitBalance = { id: 92363 };
      idea.profitBalance = profitBalance;

      const profitBalanceCollection: IProfitBalance[] = [{ id: 57363 }];
      jest.spyOn(profitBalanceService, 'query').mockReturnValue(of(new HttpResponse({ body: profitBalanceCollection })));
      const expectedCollection: IProfitBalance[] = [profitBalance, ...profitBalanceCollection];
      jest.spyOn(profitBalanceService, 'addProfitBalanceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ idea });
      comp.ngOnInit();

      expect(profitBalanceService.query).toHaveBeenCalled();
      expect(profitBalanceService.addProfitBalanceToCollectionIfMissing).toHaveBeenCalledWith(profitBalanceCollection, profitBalance);
      expect(comp.profitBalancesCollection).toEqual(expectedCollection);
    });

    it('Should call Idea query and add missing value', () => {
      const idea: IIdea = { id: 456 };
      const idea: IIdea = { id: 71107 };
      idea.idea = idea;

      const ideaCollection: IIdea[] = [{ id: 95711 }];
      jest.spyOn(ideaService, 'query').mockReturnValue(of(new HttpResponse({ body: ideaCollection })));
      const additionalIdeas = [idea];
      const expectedCollection: IIdea[] = [...additionalIdeas, ...ideaCollection];
      jest.spyOn(ideaService, 'addIdeaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ idea });
      comp.ngOnInit();

      expect(ideaService.query).toHaveBeenCalled();
      expect(ideaService.addIdeaToCollectionIfMissing).toHaveBeenCalledWith(ideaCollection, ...additionalIdeas);
      expect(comp.ideasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const idea: IIdea = { id: 456 };
      const user: IUser = { id: '276e7084-3169-4774-882a-0e8a0620bf25' };
      idea.user = user;

      const userCollection: IUser[] = [{ id: 'a4fa8542-b888-4505-b9a4-e37c184aed96' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ idea });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Employee query and add missing value', () => {
      const idea: IIdea = { id: 456 };
      const employees: IEmployee[] = [{ id: 75666 }];
      idea.employees = employees;

      const employeeCollection: IEmployee[] = [{ id: 41247 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [...employees];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ idea });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, ...additionalEmployees);
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const idea: IIdea = { id: 456 };
      const profitBalance: IProfitBalance = { id: 95858 };
      idea.profitBalance = profitBalance;
      const idea: IIdea = { id: 52169 };
      idea.idea = idea;
      const user: IUser = { id: '47a79a5d-fb01-4d5e-a387-2c9ef30cddd5' };
      idea.user = user;
      const employees: IEmployee = { id: 93081 };
      idea.employees = [employees];

      activatedRoute.data = of({ idea });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(idea));
      expect(comp.profitBalancesCollection).toContain(profitBalance);
      expect(comp.ideasSharedCollection).toContain(idea);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.employeesSharedCollection).toContain(employees);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Idea>>();
      const idea = { id: 123 };
      jest.spyOn(ideaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ idea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: idea }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ideaService.update).toHaveBeenCalledWith(idea);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Idea>>();
      const idea = new Idea();
      jest.spyOn(ideaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ idea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: idea }));
      saveSubject.complete();

      // THEN
      expect(ideaService.create).toHaveBeenCalledWith(idea);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Idea>>();
      const idea = { id: 123 };
      jest.spyOn(ideaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ idea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ideaService.update).toHaveBeenCalledWith(idea);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProfitBalanceById', () => {
      it('Should return tracked ProfitBalance primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProfitBalanceById(0, entity);
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

    describe('trackEmployeeById', () => {
      it('Should return tracked Employee primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEmployeeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedEmployee', () => {
      it('Should return option if no Employee is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedEmployee(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Employee for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedEmployee(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Employee is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedEmployee(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
