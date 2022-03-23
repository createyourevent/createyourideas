import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IIdeaComment, IdeaComment } from '../idea-comment.model';

import { IdeaCommentService } from './idea-comment.service';

describe('IdeaComment Service', () => {
  let service: IdeaCommentService;
  let httpMock: HttpTestingController;
  let elemDefault: IIdeaComment;
  let expectedResult: IIdeaComment | IIdeaComment[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IdeaCommentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      comment: 'AAAAAAA',
      date: currentDate,
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

    it('should create a IdeaComment', () => {
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

      service.create(new IdeaComment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a IdeaComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          comment: 'BBBBBB',
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

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a IdeaComment', () => {
      const patchObject = Object.assign(
        {
          comment: 'BBBBBB',
        },
        new IdeaComment()
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

    it('should return a list of IdeaComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          comment: 'BBBBBB',
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

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a IdeaComment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIdeaCommentToCollectionIfMissing', () => {
      it('should add a IdeaComment to an empty array', () => {
        const ideaComment: IIdeaComment = { id: 123 };
        expectedResult = service.addIdeaCommentToCollectionIfMissing([], ideaComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ideaComment);
      });

      it('should not add a IdeaComment to an array that contains it', () => {
        const ideaComment: IIdeaComment = { id: 123 };
        const ideaCommentCollection: IIdeaComment[] = [
          {
            ...ideaComment,
          },
          { id: 456 },
        ];
        expectedResult = service.addIdeaCommentToCollectionIfMissing(ideaCommentCollection, ideaComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a IdeaComment to an array that doesn't contain it", () => {
        const ideaComment: IIdeaComment = { id: 123 };
        const ideaCommentCollection: IIdeaComment[] = [{ id: 456 }];
        expectedResult = service.addIdeaCommentToCollectionIfMissing(ideaCommentCollection, ideaComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ideaComment);
      });

      it('should add only unique IdeaComment to an array', () => {
        const ideaCommentArray: IIdeaComment[] = [{ id: 123 }, { id: 456 }, { id: 85080 }];
        const ideaCommentCollection: IIdeaComment[] = [{ id: 123 }];
        expectedResult = service.addIdeaCommentToCollectionIfMissing(ideaCommentCollection, ...ideaCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ideaComment: IIdeaComment = { id: 123 };
        const ideaComment2: IIdeaComment = { id: 456 };
        expectedResult = service.addIdeaCommentToCollectionIfMissing([], ideaComment, ideaComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ideaComment);
        expect(expectedResult).toContain(ideaComment2);
      });

      it('should accept null and undefined values', () => {
        const ideaComment: IIdeaComment = { id: 123 };
        expectedResult = service.addIdeaCommentToCollectionIfMissing([], null, ideaComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ideaComment);
      });

      it('should return initial array if no IdeaComment is added', () => {
        const ideaCommentCollection: IIdeaComment[] = [{ id: 123 }];
        expectedResult = service.addIdeaCommentToCollectionIfMissing(ideaCommentCollection, undefined, null);
        expect(expectedResult).toEqual(ideaCommentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
