jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOutgoings, Outgoings } from '../outgoings.model';
import { OutgoingsService } from '../service/outgoings.service';

import { OutgoingsRoutingResolveService } from './outgoings-routing-resolve.service';

describe('Outgoings routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OutgoingsRoutingResolveService;
  let service: OutgoingsService;
  let resultOutgoings: IOutgoings | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(OutgoingsRoutingResolveService);
    service = TestBed.inject(OutgoingsService);
    resultOutgoings = undefined;
  });

  describe('resolve', () => {
    it('should return IOutgoings returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOutgoings = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOutgoings).toEqual({ id: 123 });
    });

    it('should return new IOutgoings if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOutgoings = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOutgoings).toEqual(new Outgoings());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Outgoings })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOutgoings = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOutgoings).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
