jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IIdeaLikeDislike, IdeaLikeDislike } from '../idea-like-dislike.model';
import { IdeaLikeDislikeService } from '../service/idea-like-dislike.service';

import { IdeaLikeDislikeRoutingResolveService } from './idea-like-dislike-routing-resolve.service';

describe('IdeaLikeDislike routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: IdeaLikeDislikeRoutingResolveService;
  let service: IdeaLikeDislikeService;
  let resultIdeaLikeDislike: IIdeaLikeDislike | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(IdeaLikeDislikeRoutingResolveService);
    service = TestBed.inject(IdeaLikeDislikeService);
    resultIdeaLikeDislike = undefined;
  });

  describe('resolve', () => {
    it('should return IIdeaLikeDislike returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaLikeDislike = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIdeaLikeDislike).toEqual({ id: 123 });
    });

    it('should return new IIdeaLikeDislike if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaLikeDislike = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultIdeaLikeDislike).toEqual(new IdeaLikeDislike());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as IdeaLikeDislike })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaLikeDislike = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIdeaLikeDislike).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
