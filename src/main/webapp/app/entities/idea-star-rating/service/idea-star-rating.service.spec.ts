import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IIdeaStarRating, IdeaStarRating } from '../idea-star-rating.model';

import { IdeaStarRatingService } from './idea-star-rating.service';

describe('IdeaStarRating Service', () => {
  let service: IdeaStarRatingService;
  let httpMock: HttpTestingController;
  let elemDefault: IIdeaStarRating;
  let expectedResult: IIdeaStarRating | IIdeaStarRating[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IdeaStarRatingService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      stars: 0,
      date: currentDate,
      comment: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a IdeaStarRating', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new IdeaStarRating()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a IdeaStarRating', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          stars: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          comment: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a IdeaStarRating', () => {
      const patchObject = Object.assign(
        {
          stars: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          comment: 'BBBBBB',
        },
        new IdeaStarRating()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of IdeaStarRating', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          stars: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          comment: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a IdeaStarRating', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIdeaStarRatingToCollectionIfMissing', () => {
      it('should add a IdeaStarRating to an empty array', () => {
        const ideaStarRating: IIdeaStarRating = { id: 123 };
        expectedResult = service.addIdeaStarRatingToCollectionIfMissing([], ideaStarRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ideaStarRating);
      });

      it('should not add a IdeaStarRating to an array that contains it', () => {
        const ideaStarRating: IIdeaStarRating = { id: 123 };
        const ideaStarRatingCollection: IIdeaStarRating[] = [
          {
            ...ideaStarRating,
          },
          { id: 456 },
        ];
        expectedResult = service.addIdeaStarRatingToCollectionIfMissing(ideaStarRatingCollection, ideaStarRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a IdeaStarRating to an array that doesn't contain it", () => {
        const ideaStarRating: IIdeaStarRating = { id: 123 };
        const ideaStarRatingCollection: IIdeaStarRating[] = [{ id: 456 }];
        expectedResult = service.addIdeaStarRatingToCollectionIfMissing(ideaStarRatingCollection, ideaStarRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ideaStarRating);
      });

      it('should add only unique IdeaStarRating to an array', () => {
        const ideaStarRatingArray: IIdeaStarRating[] = [{ id: 123 }, { id: 456 }, { id: 28876 }];
        const ideaStarRatingCollection: IIdeaStarRating[] = [{ id: 123 }];
        expectedResult = service.addIdeaStarRatingToCollectionIfMissing(ideaStarRatingCollection, ...ideaStarRatingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ideaStarRating: IIdeaStarRating = { id: 123 };
        const ideaStarRating2: IIdeaStarRating = { id: 456 };
        expectedResult = service.addIdeaStarRatingToCollectionIfMissing([], ideaStarRating, ideaStarRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ideaStarRating);
        expect(expectedResult).toContain(ideaStarRating2);
      });

      it('should accept null and undefined values', () => {
        const ideaStarRating: IIdeaStarRating = { id: 123 };
        expectedResult = service.addIdeaStarRatingToCollectionIfMissing([], null, ideaStarRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ideaStarRating);
      });

      it('should return initial array if no IdeaStarRating is added', () => {
        const ideaStarRatingCollection: IIdeaStarRating[] = [{ id: 123 }];
        expectedResult = service.addIdeaStarRatingToCollectionIfMissing(ideaStarRatingCollection, undefined, null);
        expect(expectedResult).toEqual(ideaStarRatingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
