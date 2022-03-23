import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMonthlyOutgoingsInvoice, MonthlyOutgoingsInvoice } from '../monthly-outgoings-invoice.model';

import { MonthlyOutgoingsInvoiceService } from './monthly-outgoings-invoice.service';

describe('MonthlyOutgoingsInvoice Service', () => {
  let service: MonthlyOutgoingsInvoiceService;
  let httpMock: HttpTestingController;
  let elemDefault: IMonthlyOutgoingsInvoice;
  let expectedResult: IMonthlyOutgoingsInvoice | IMonthlyOutgoingsInvoice[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MonthlyOutgoingsInvoiceService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      total: 0,
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

    it('should create a MonthlyOutgoingsInvoice', () => {
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

      service.create(new MonthlyOutgoingsInvoice()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MonthlyOutgoingsInvoice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          total: 1,
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

    it('should partial update a MonthlyOutgoingsInvoice', () => {
      const patchObject = Object.assign(
        {
          total: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new MonthlyOutgoingsInvoice()
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

    it('should return a list of MonthlyOutgoingsInvoice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          total: 1,
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

    it('should delete a MonthlyOutgoingsInvoice', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMonthlyOutgoingsInvoiceToCollectionIfMissing', () => {
      it('should add a MonthlyOutgoingsInvoice to an empty array', () => {
        const monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice = { id: 123 };
        expectedResult = service.addMonthlyOutgoingsInvoiceToCollectionIfMissing([], monthlyOutgoingsInvoice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(monthlyOutgoingsInvoice);
      });

      it('should not add a MonthlyOutgoingsInvoice to an array that contains it', () => {
        const monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice = { id: 123 };
        const monthlyOutgoingsInvoiceCollection: IMonthlyOutgoingsInvoice[] = [
          {
            ...monthlyOutgoingsInvoice,
          },
          { id: 456 },
        ];
        expectedResult = service.addMonthlyOutgoingsInvoiceToCollectionIfMissing(
          monthlyOutgoingsInvoiceCollection,
          monthlyOutgoingsInvoice
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MonthlyOutgoingsInvoice to an array that doesn't contain it", () => {
        const monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice = { id: 123 };
        const monthlyOutgoingsInvoiceCollection: IMonthlyOutgoingsInvoice[] = [{ id: 456 }];
        expectedResult = service.addMonthlyOutgoingsInvoiceToCollectionIfMissing(
          monthlyOutgoingsInvoiceCollection,
          monthlyOutgoingsInvoice
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(monthlyOutgoingsInvoice);
      });

      it('should add only unique MonthlyOutgoingsInvoice to an array', () => {
        const monthlyOutgoingsInvoiceArray: IMonthlyOutgoingsInvoice[] = [{ id: 123 }, { id: 456 }, { id: 65024 }];
        const monthlyOutgoingsInvoiceCollection: IMonthlyOutgoingsInvoice[] = [{ id: 123 }];
        expectedResult = service.addMonthlyOutgoingsInvoiceToCollectionIfMissing(
          monthlyOutgoingsInvoiceCollection,
          ...monthlyOutgoingsInvoiceArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice = { id: 123 };
        const monthlyOutgoingsInvoice2: IMonthlyOutgoingsInvoice = { id: 456 };
        expectedResult = service.addMonthlyOutgoingsInvoiceToCollectionIfMissing([], monthlyOutgoingsInvoice, monthlyOutgoingsInvoice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(monthlyOutgoingsInvoice);
        expect(expectedResult).toContain(monthlyOutgoingsInvoice2);
      });

      it('should accept null and undefined values', () => {
        const monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice = { id: 123 };
        expectedResult = service.addMonthlyOutgoingsInvoiceToCollectionIfMissing([], null, monthlyOutgoingsInvoice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(monthlyOutgoingsInvoice);
      });

      it('should return initial array if no MonthlyOutgoingsInvoice is added', () => {
        const monthlyOutgoingsInvoiceCollection: IMonthlyOutgoingsInvoice[] = [{ id: 123 }];
        expectedResult = service.addMonthlyOutgoingsInvoiceToCollectionIfMissing(monthlyOutgoingsInvoiceCollection, undefined, null);
        expect(expectedResult).toEqual(monthlyOutgoingsInvoiceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
