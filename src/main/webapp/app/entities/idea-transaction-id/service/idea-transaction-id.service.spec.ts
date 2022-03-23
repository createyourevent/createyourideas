import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IIdeaTransactionId, IdeaTransactionId } from '../idea-transaction-id.model';

import { IdeaTransactionIdService } from './idea-transaction-id.service';

describe('IdeaTransactionId Service', () => {
  let service: IdeaTransactionIdService;
  let httpMock: HttpTestingController;
  let elemDefault: IIdeaTransactionId;
  let expectedResult: IIdeaTransactionId | IIdeaTransactionId[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IdeaTransactionIdService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      transactionId: 'AAAAAAA',
      refNo: 'AAAAAAA',
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

    it('should create a IdeaTransactionId', () => {
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

      service.create(new IdeaTransactionId()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a IdeaTransactionId', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transactionId: 'BBBBBB',
          refNo: 'BBBBBB',
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

    it('should partial update a IdeaTransactionId', () => {
      const patchObject = Object.assign(
        {
          transactionId: 'BBBBBB',
          refNo: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new IdeaTransactionId()
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

    it('should return a list of IdeaTransactionId', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transactionId: 'BBBBBB',
          refNo: 'BBBBBB',
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

    it('should delete a IdeaTransactionId', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIdeaTransactionIdToCollectionIfMissing', () => {
      it('should add a IdeaTransactionId to an empty array', () => {
        const ideaTransactionId: IIdeaTransactionId = { id: 123 };
        expectedResult = service.addIdeaTransactionIdToCollectionIfMissing([], ideaTransactionId);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ideaTransactionId);
      });

      it('should not add a IdeaTransactionId to an array that contains it', () => {
        const ideaTransactionId: IIdeaTransactionId = { id: 123 };
        const ideaTransactionIdCollection: IIdeaTransactionId[] = [
          {
            ...ideaTransactionId,
          },
          { id: 456 },
        ];
        expectedResult = service.addIdeaTransactionIdToCollectionIfMissing(ideaTransactionIdCollection, ideaTransactionId);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a IdeaTransactionId to an array that doesn't contain it", () => {
        const ideaTransactionId: IIdeaTransactionId = { id: 123 };
        const ideaTransactionIdCollection: IIdeaTransactionId[] = [{ id: 456 }];
        expectedResult = service.addIdeaTransactionIdToCollectionIfMissing(ideaTransactionIdCollection, ideaTransactionId);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ideaTransactionId);
      });

      it('should add only unique IdeaTransactionId to an array', () => {
        const ideaTransactionIdArray: IIdeaTransactionId[] = [{ id: 123 }, { id: 456 }, { id: 92778 }];
        const ideaTransactionIdCollection: IIdeaTransactionId[] = [{ id: 123 }];
        expectedResult = service.addIdeaTransactionIdToCollectionIfMissing(ideaTransactionIdCollection, ...ideaTransactionIdArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ideaTransactionId: IIdeaTransactionId = { id: 123 };
        const ideaTransactionId2: IIdeaTransactionId = { id: 456 };
        expectedResult = service.addIdeaTransactionIdToCollectionIfMissing([], ideaTransactionId, ideaTransactionId2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ideaTransactionId);
        expect(expectedResult).toContain(ideaTransactionId2);
      });

      it('should accept null and undefined values', () => {
        const ideaTransactionId: IIdeaTransactionId = { id: 123 };
        expectedResult = service.addIdeaTransactionIdToCollectionIfMissing([], null, ideaTransactionId, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ideaTransactionId);
      });

      it('should return initial array if no IdeaTransactionId is added', () => {
        const ideaTransactionIdCollection: IIdeaTransactionId[] = [{ id: 123 }];
        expectedResult = service.addIdeaTransactionIdToCollectionIfMissing(ideaTransactionIdCollection, undefined, null);
        expect(expectedResult).toEqual(ideaTransactionIdCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
