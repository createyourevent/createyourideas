jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProperties, Properties } from '../properties.model';
import { PropertiesService } from '../service/properties.service';

import { PropertiesRoutingResolveService } from './properties-routing-resolve.service';

describe('Properties routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PropertiesRoutingResolveService;
  let service: PropertiesService;
  let resultProperties: IProperties | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(PropertiesRoutingResolveService);
    service = TestBed.inject(PropertiesService);
    resultProperties = undefined;
  });

  describe('resolve', () => {
    it('should return IProperties returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProperties = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProperties).toEqual({ id: 123 });
    });

    it('should return new IProperties if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProperties = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultProperties).toEqual(new Properties());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Properties })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProperties = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProperties).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
