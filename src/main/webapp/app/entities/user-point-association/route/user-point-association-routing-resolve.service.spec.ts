jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUserPointAssociation, UserPointAssociation } from '../user-point-association.model';
import { UserPointAssociationService } from '../service/user-point-association.service';

import { UserPointAssociationRoutingResolveService } from './user-point-association-routing-resolve.service';

describe('UserPointAssociation routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: UserPointAssociationRoutingResolveService;
  let service: UserPointAssociationService;
  let resultUserPointAssociation: IUserPointAssociation | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(UserPointAssociationRoutingResolveService);
    service = TestBed.inject(UserPointAssociationService);
    resultUserPointAssociation = undefined;
  });

  describe('resolve', () => {
    it('should return IUserPointAssociation returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserPointAssociation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUserPointAssociation).toEqual({ id: 123 });
    });

    it('should return new IUserPointAssociation if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserPointAssociation = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultUserPointAssociation).toEqual(new UserPointAssociation());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserPointAssociation })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserPointAssociation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUserPointAssociation).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
