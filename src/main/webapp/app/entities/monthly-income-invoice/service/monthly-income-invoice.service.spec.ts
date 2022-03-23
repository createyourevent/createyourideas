import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMonthlyIncomeInvoice, MonthlyIncomeInvoice } from '../monthly-income-invoice.model';

import { MonthlyIncomeInvoiceService } from './monthly-income-invoice.service';

describe('MonthlyIncomeInvoice Service', () => {
  let service: MonthlyIncomeInvoiceService;
  let httpMock: HttpTestingController;
  let elemDefault: IMonthlyIncomeInvoice;
  let expectedResult: IMonthlyIncomeInvoice | IMonthlyIncomeInvoice[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MonthlyIncomeInvoiceService);
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

    it('should create a MonthlyIncomeInvoice', () => {
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

      service.create(new MonthlyIncomeInvoice()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MonthlyIncomeInvoice', () => {
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

    it('should partial update a MonthlyIncomeInvoice', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new MonthlyIncomeInvoice()
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

    it('should return a list of MonthlyIncomeInvoice', () => {
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

    it('should delete a MonthlyIncomeInvoice', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMonthlyIncomeInvoiceToCollectionIfMissing', () => {
      it('should add a MonthlyIncomeInvoice to an empty array', () => {
        const monthlyIncomeInvoice: IMonthlyIncomeInvoice = { id: 123 };
        expectedResult = service.addMonthlyIncomeInvoiceToCollectionIfMissing([], monthlyIncomeInvoice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(monthlyIncomeInvoice);
      });

      it('should not add a MonthlyIncomeInvoice to an array that contains it', () => {
        const monthlyIncomeInvoice: IMonthlyIncomeInvoice = { id: 123 };
        const monthlyIncomeInvoiceCollection: IMonthlyIncomeInvoice[] = [
          {
            ...monthlyIncomeInvoice,
          },
          { id: 456 },
        ];
        expectedResult = service.addMonthlyIncomeInvoiceToCollectionIfMissing(monthlyIncomeInvoiceCollection, monthlyIncomeInvoice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MonthlyIncomeInvoice to an array that doesn't contain it", () => {
        const monthlyIncomeInvoice: IMonthlyIncomeInvoice = { id: 123 };
        const monthlyIncomeInvoiceCollection: IMonthlyIncomeInvoice[] = [{ id: 456 }];
        expectedResult = service.addMonthlyIncomeInvoiceToCollectionIfMissing(monthlyIncomeInvoiceCollection, monthlyIncomeInvoice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(monthlyIncomeInvoice);
      });

      it('should add only unique MonthlyIncomeInvoice to an array', () => {
        const monthlyIncomeInvoiceArray: IMonthlyIncomeInvoice[] = [{ id: 123 }, { id: 456 }, { id: 15984 }];
        const monthlyIncomeInvoiceCollection: IMonthlyIncomeInvoice[] = [{ id: 123 }];
        expectedResult = service.addMonthlyIncomeInvoiceToCollectionIfMissing(monthlyIncomeInvoiceCollection, ...monthlyIncomeInvoiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const monthlyIncomeInvoice: IMonthlyIncomeInvoice = { id: 123 };
        const monthlyIncomeInvoice2: IMonthlyIncomeInvoice = { id: 456 };
        expectedResult = service.addMonthlyIncomeInvoiceToCollectionIfMissing([], monthlyIncomeInvoice, monthlyIncomeInvoice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(monthlyIncomeInvoice);
        expect(expectedResult).toContain(monthlyIncomeInvoice2);
      });

      it('should accept null and undefined values', () => {
        const monthlyIncomeInvoice: IMonthlyIncomeInvoice = { id: 123 };
        expectedResult = service.addMonthlyIncomeInvoiceToCollectionIfMissing([], null, monthlyIncomeInvoice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(monthlyIncomeInvoice);
      });

      it('should return initial array if no MonthlyIncomeInvoice is added', () => {
        const monthlyIncomeInvoiceCollection: IMonthlyIncomeInvoice[] = [{ id: 123 }];
        expectedResult = service.addMonthlyIncomeInvoiceToCollectionIfMissing(monthlyIncomeInvoiceCollection, undefined, null);
        expect(expectedResult).toEqual(monthlyIncomeInvoiceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
