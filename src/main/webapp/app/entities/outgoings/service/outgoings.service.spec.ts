import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOutgoings, Outgoings } from '../outgoings.model';

import { OutgoingsService } from './outgoings.service';

describe('Outgoings Service', () => {
  let service: OutgoingsService;
  let httpMock: HttpTestingController;
  let elemDefault: IOutgoings;
  let expectedResult: IOutgoings | IOutgoings[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OutgoingsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      description: 'AAAAAAA',
      date: currentDate,
      value: 0,
      billed: false,
      toChildIdea: false,
      auto: false,
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

    it('should create a Outgoings', () => {
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

      service.create(new Outgoings()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Outgoings', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
          value: 1,
          billed: true,
          toChildIdea: true,
          auto: true,
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

    it('should partial update a Outgoings', () => {
      const patchObject = Object.assign(
        {
          title: 'BBBBBB',
          description: 'BBBBBB',
          value: 1,
          billed: true,
        },
        new Outgoings()
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

    it('should return a list of Outgoings', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
          value: 1,
          billed: true,
          toChildIdea: true,
          auto: true,
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

    it('should delete a Outgoings', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOutgoingsToCollectionIfMissing', () => {
      it('should add a Outgoings to an empty array', () => {
        const outgoings: IOutgoings = { id: 123 };
        expectedResult = service.addOutgoingsToCollectionIfMissing([], outgoings);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(outgoings);
      });

      it('should not add a Outgoings to an array that contains it', () => {
        const outgoings: IOutgoings = { id: 123 };
        const outgoingsCollection: IOutgoings[] = [
          {
            ...outgoings,
          },
          { id: 456 },
        ];
        expectedResult = service.addOutgoingsToCollectionIfMissing(outgoingsCollection, outgoings);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Outgoings to an array that doesn't contain it", () => {
        const outgoings: IOutgoings = { id: 123 };
        const outgoingsCollection: IOutgoings[] = [{ id: 456 }];
        expectedResult = service.addOutgoingsToCollectionIfMissing(outgoingsCollection, outgoings);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(outgoings);
      });

      it('should add only unique Outgoings to an array', () => {
        const outgoingsArray: IOutgoings[] = [{ id: 123 }, { id: 456 }, { id: 48939 }];
        const outgoingsCollection: IOutgoings[] = [{ id: 123 }];
        expectedResult = service.addOutgoingsToCollectionIfMissing(outgoingsCollection, ...outgoingsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const outgoings: IOutgoings = { id: 123 };
        const outgoings2: IOutgoings = { id: 456 };
        expectedResult = service.addOutgoingsToCollectionIfMissing([], outgoings, outgoings2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(outgoings);
        expect(expectedResult).toContain(outgoings2);
      });

      it('should accept null and undefined values', () => {
        const outgoings: IOutgoings = { id: 123 };
        expectedResult = service.addOutgoingsToCollectionIfMissing([], null, outgoings, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(outgoings);
      });

      it('should return initial array if no Outgoings is added', () => {
        const outgoingsCollection: IOutgoings[] = [{ id: 123 }];
        expectedResult = service.addOutgoingsToCollectionIfMissing(outgoingsCollection, undefined, null);
        expect(expectedResult).toEqual(outgoingsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
