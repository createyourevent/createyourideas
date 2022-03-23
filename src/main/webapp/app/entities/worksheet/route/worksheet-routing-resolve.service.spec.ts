jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IWorksheet, Worksheet } from '../worksheet.model';
import { WorksheetService } from '../service/worksheet.service';

import { WorksheetRoutingResolveService } from './worksheet-routing-resolve.service';

describe('Worksheet routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: WorksheetRoutingResolveService;
  let service: WorksheetService;
  let resultWorksheet: IWorksheet | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(WorksheetRoutingResolveService);
    service = TestBed.inject(WorksheetService);
    resultWorksheet = undefined;
  });

  describe('resolve', () => {
    it('should return IWorksheet returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWorksheet = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultWorksheet).toEqual({ id: 123 });
    });

    it('should return new IWorksheet if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWorksheet = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultWorksheet).toEqual(new Worksheet());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Worksheet })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWorksheet = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultWorksheet).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
