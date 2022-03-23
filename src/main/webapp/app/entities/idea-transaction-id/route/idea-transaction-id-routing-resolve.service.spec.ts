jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IIdeaTransactionId, IdeaTransactionId } from '../idea-transaction-id.model';
import { IdeaTransactionIdService } from '../service/idea-transaction-id.service';

import { IdeaTransactionIdRoutingResolveService } from './idea-transaction-id-routing-resolve.service';

describe('IdeaTransactionId routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: IdeaTransactionIdRoutingResolveService;
  let service: IdeaTransactionIdService;
  let resultIdeaTransactionId: IIdeaTransactionId | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(IdeaTransactionIdRoutingResolveService);
    service = TestBed.inject(IdeaTransactionIdService);
    resultIdeaTransactionId = undefined;
  });

  describe('resolve', () => {
    it('should return IIdeaTransactionId returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaTransactionId = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIdeaTransactionId).toEqual({ id: 123 });
    });

    it('should return new IIdeaTransactionId if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaTransactionId = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultIdeaTransactionId).toEqual(new IdeaTransactionId());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as IdeaTransactionId })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaTransactionId = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIdeaTransactionId).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
