import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IIdeaLikeDislike, IdeaLikeDislike } from '../idea-like-dislike.model';

import { IdeaLikeDislikeService } from './idea-like-dislike.service';

describe('IdeaLikeDislike Service', () => {
  let service: IdeaLikeDislikeService;
  let httpMock: HttpTestingController;
  let elemDefault: IIdeaLikeDislike;
  let expectedResult: IIdeaLikeDislike | IIdeaLikeDislike[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IdeaLikeDislikeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      like: 0,
      dislike: 0,
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

    it('should create a IdeaLikeDislike', () => {
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

      service.create(new IdeaLikeDislike()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a IdeaLikeDislike', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          like: 1,
          dislike: 1,
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

    it('should partial update a IdeaLikeDislike', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new IdeaLikeDislike()
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

    it('should return a list of IdeaLikeDislike', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          like: 1,
          dislike: 1,
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

    it('should delete a IdeaLikeDislike', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIdeaLikeDislikeToCollectionIfMissing', () => {
      it('should add a IdeaLikeDislike to an empty array', () => {
        const ideaLikeDislike: IIdeaLikeDislike = { id: 123 };
        expectedResult = service.addIdeaLikeDislikeToCollectionIfMissing([], ideaLikeDislike);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ideaLikeDislike);
      });

      it('should not add a IdeaLikeDislike to an array that contains it', () => {
        const ideaLikeDislike: IIdeaLikeDislike = { id: 123 };
        const ideaLikeDislikeCollection: IIdeaLikeDislike[] = [
          {
            ...ideaLikeDislike,
          },
          { id: 456 },
        ];
        expectedResult = service.addIdeaLikeDislikeToCollectionIfMissing(ideaLikeDislikeCollection, ideaLikeDislike);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a IdeaLikeDislike to an array that doesn't contain it", () => {
        const ideaLikeDislike: IIdeaLikeDislike = { id: 123 };
        const ideaLikeDislikeCollection: IIdeaLikeDislike[] = [{ id: 456 }];
        expectedResult = service.addIdeaLikeDislikeToCollectionIfMissing(ideaLikeDislikeCollection, ideaLikeDislike);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ideaLikeDislike);
      });

      it('should add only unique IdeaLikeDislike to an array', () => {
        const ideaLikeDislikeArray: IIdeaLikeDislike[] = [{ id: 123 }, { id: 456 }, { id: 74282 }];
        const ideaLikeDislikeCollection: IIdeaLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addIdeaLikeDislikeToCollectionIfMissing(ideaLikeDislikeCollection, ...ideaLikeDislikeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ideaLikeDislike: IIdeaLikeDislike = { id: 123 };
        const ideaLikeDislike2: IIdeaLikeDislike = { id: 456 };
        expectedResult = service.addIdeaLikeDislikeToCollectionIfMissing([], ideaLikeDislike, ideaLikeDislike2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ideaLikeDislike);
        expect(expectedResult).toContain(ideaLikeDislike2);
      });

      it('should accept null and undefined values', () => {
        const ideaLikeDislike: IIdeaLikeDislike = { id: 123 };
        expectedResult = service.addIdeaLikeDislikeToCollectionIfMissing([], null, ideaLikeDislike, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ideaLikeDislike);
      });

      it('should return initial array if no IdeaLikeDislike is added', () => {
        const ideaLikeDislikeCollection: IIdeaLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addIdeaLikeDislikeToCollectionIfMissing(ideaLikeDislikeCollection, undefined, null);
        expect(expectedResult).toEqual(ideaLikeDislikeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
