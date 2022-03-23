jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMonthlyIncomeInvoice, MonthlyIncomeInvoice } from '../monthly-income-invoice.model';
import { MonthlyIncomeInvoiceService } from '../service/monthly-income-invoice.service';

import { MonthlyIncomeInvoiceRoutingResolveService } from './monthly-income-invoice-routing-resolve.service';

describe('MonthlyIncomeInvoice routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: MonthlyIncomeInvoiceRoutingResolveService;
  let service: MonthlyIncomeInvoiceService;
  let resultMonthlyIncomeInvoice: IMonthlyIncomeInvoice | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(MonthlyIncomeInvoiceRoutingResolveService);
    service = TestBed.inject(MonthlyIncomeInvoiceService);
    resultMonthlyIncomeInvoice = undefined;
  });

  describe('resolve', () => {
    it('should return IMonthlyIncomeInvoice returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMonthlyIncomeInvoice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMonthlyIncomeInvoice).toEqual({ id: 123 });
    });

    it('should return new IMonthlyIncomeInvoice if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMonthlyIncomeInvoice = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultMonthlyIncomeInvoice).toEqual(new MonthlyIncomeInvoice());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as MonthlyIncomeInvoice })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMonthlyIncomeInvoice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMonthlyIncomeInvoice).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
