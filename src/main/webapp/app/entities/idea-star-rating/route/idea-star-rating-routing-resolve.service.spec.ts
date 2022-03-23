jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IIdeaStarRating, IdeaStarRating } from '../idea-star-rating.model';
import { IdeaStarRatingService } from '../service/idea-star-rating.service';

import { IdeaStarRatingRoutingResolveService } from './idea-star-rating-routing-resolve.service';

describe('IdeaStarRating routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: IdeaStarRatingRoutingResolveService;
  let service: IdeaStarRatingService;
  let resultIdeaStarRating: IIdeaStarRating | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(IdeaStarRatingRoutingResolveService);
    service = TestBed.inject(IdeaStarRatingService);
    resultIdeaStarRating = undefined;
  });

  describe('resolve', () => {
    it('should return IIdeaStarRating returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaStarRating = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIdeaStarRating).toEqual({ id: 123 });
    });

    it('should return new IIdeaStarRating if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaStarRating = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultIdeaStarRating).toEqual(new IdeaStarRating());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as IdeaStarRating })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaStarRating = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIdeaStarRating).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
