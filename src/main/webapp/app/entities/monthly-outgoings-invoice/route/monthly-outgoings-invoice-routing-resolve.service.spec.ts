jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMonthlyOutgoingsInvoice, MonthlyOutgoingsInvoice } from '../monthly-outgoings-invoice.model';
import { MonthlyOutgoingsInvoiceService } from '../service/monthly-outgoings-invoice.service';

import { MonthlyOutgoingsInvoiceRoutingResolveService } from './monthly-outgoings-invoice-routing-resolve.service';

describe('MonthlyOutgoingsInvoice routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: MonthlyOutgoingsInvoiceRoutingResolveService;
  let service: MonthlyOutgoingsInvoiceService;
  let resultMonthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(MonthlyOutgoingsInvoiceRoutingResolveService);
    service = TestBed.inject(MonthlyOutgoingsInvoiceService);
    resultMonthlyOutgoingsInvoice = undefined;
  });

  describe('resolve', () => {
    it('should return IMonthlyOutgoingsInvoice returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMonthlyOutgoingsInvoice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMonthlyOutgoingsInvoice).toEqual({ id: 123 });
    });

    it('should return new IMonthlyOutgoingsInvoice if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMonthlyOutgoingsInvoice = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultMonthlyOutgoingsInvoice).toEqual(new MonthlyOutgoingsInvoice());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as MonthlyOutgoingsInvoice })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMonthlyOutgoingsInvoice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMonthlyOutgoingsInvoice).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
