jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProfitBalance, ProfitBalance } from '../profit-balance.model';
import { ProfitBalanceService } from '../service/profit-balance.service';

import { ProfitBalanceRoutingResolveService } from './profit-balance-routing-resolve.service';

describe('ProfitBalance routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ProfitBalanceRoutingResolveService;
  let service: ProfitBalanceService;
  let resultProfitBalance: IProfitBalance | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ProfitBalanceRoutingResolveService);
    service = TestBed.inject(ProfitBalanceService);
    resultProfitBalance = undefined;
  });

  describe('resolve', () => {
    it('should return IProfitBalance returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProfitBalance = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProfitBalance).toEqual({ id: 123 });
    });

    it('should return new IProfitBalance if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProfitBalance = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultProfitBalance).toEqual(new ProfitBalance());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ProfitBalance })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProfitBalance = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProfitBalance).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
