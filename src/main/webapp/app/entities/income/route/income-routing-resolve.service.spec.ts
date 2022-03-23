jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IIncome, Income } from '../income.model';
import { IncomeService } from '../service/income.service';

import { IncomeRoutingResolveService } from './income-routing-resolve.service';

describe('Income routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: IncomeRoutingResolveService;
  let service: IncomeService;
  let resultIncome: IIncome | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(IncomeRoutingResolveService);
    service = TestBed.inject(IncomeService);
    resultIncome = undefined;
  });

  describe('resolve', () => {
    it('should return IIncome returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIncome = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIncome).toEqual({ id: 123 });
    });

    it('should return new IIncome if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIncome = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultIncome).toEqual(new Income());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Income })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIncome = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIncome).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
