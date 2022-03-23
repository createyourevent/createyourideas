jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IIdeaComment, IdeaComment } from '../idea-comment.model';
import { IdeaCommentService } from '../service/idea-comment.service';

import { IdeaCommentRoutingResolveService } from './idea-comment-routing-resolve.service';

describe('IdeaComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: IdeaCommentRoutingResolveService;
  let service: IdeaCommentService;
  let resultIdeaComment: IIdeaComment | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(IdeaCommentRoutingResolveService);
    service = TestBed.inject(IdeaCommentService);
    resultIdeaComment = undefined;
  });

  describe('resolve', () => {
    it('should return IIdeaComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIdeaComment).toEqual({ id: 123 });
    });

    it('should return new IIdeaComment if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaComment = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultIdeaComment).toEqual(new IdeaComment());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as IdeaComment })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIdeaComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIdeaComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
