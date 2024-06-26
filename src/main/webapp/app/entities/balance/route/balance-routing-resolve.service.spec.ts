jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBalance, Balance } from '../balance.model';
import { BalanceService } from '../service/balance.service';

import { BalanceRoutingResolveService } from './balance-routing-resolve.service';

describe('Balance routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BalanceRoutingResolveService;
  let service: BalanceService;
  let resultBalance: IBalance | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(BalanceRoutingResolveService);
    service = TestBed.inject(BalanceService);
    resultBalance = undefined;
  });

  describe('resolve', () => {
    it('should return IBalance returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBalance = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBalance).toEqual({ id: 123 });
    });

    it('should return new IBalance if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBalance = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBalance).toEqual(new Balance());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Balance })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBalance = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBalance).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
