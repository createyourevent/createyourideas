import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBalance, Balance } from '../balance.model';

import { BalanceService } from './balance.service';

describe('Balance Service', () => {
  let service: BalanceService;
  let httpMock: HttpTestingController;
  let elemDefault: IBalance;
  let expectedResult: IBalance | IBalance[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BalanceService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      dailyBalance: 0,
      netProfit: 0,
      date: currentDate,
      billed: false,
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

    it('should create a Balance', () => {
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

      service.create(new Balance()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Balance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dailyBalance: 1,
          netProfit: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          billed: true,
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

    it('should partial update a Balance', () => {
      const patchObject = Object.assign(
        {
          netProfit: 1,
          billed: true,
        },
        new Balance()
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

    it('should return a list of Balance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dailyBalance: 1,
          netProfit: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          billed: true,
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

    it('should delete a Balance', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBalanceToCollectionIfMissing', () => {
      it('should add a Balance to an empty array', () => {
        const balance: IBalance = { id: 123 };
        expectedResult = service.addBalanceToCollectionIfMissing([], balance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(balance);
      });

      it('should not add a Balance to an array that contains it', () => {
        const balance: IBalance = { id: 123 };
        const balanceCollection: IBalance[] = [
          {
            ...balance,
          },
          { id: 456 },
        ];
        expectedResult = service.addBalanceToCollectionIfMissing(balanceCollection, balance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Balance to an array that doesn't contain it", () => {
        const balance: IBalance = { id: 123 };
        const balanceCollection: IBalance[] = [{ id: 456 }];
        expectedResult = service.addBalanceToCollectionIfMissing(balanceCollection, balance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(balance);
      });

      it('should add only unique Balance to an array', () => {
        const balanceArray: IBalance[] = [{ id: 123 }, { id: 456 }, { id: 36750 }];
        const balanceCollection: IBalance[] = [{ id: 123 }];
        expectedResult = service.addBalanceToCollectionIfMissing(balanceCollection, ...balanceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const balance: IBalance = { id: 123 };
        const balance2: IBalance = { id: 456 };
        expectedResult = service.addBalanceToCollectionIfMissing([], balance, balance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(balance);
        expect(expectedResult).toContain(balance2);
      });

      it('should accept null and undefined values', () => {
        const balance: IBalance = { id: 123 };
        expectedResult = service.addBalanceToCollectionIfMissing([], null, balance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(balance);
      });

      it('should return initial array if no Balance is added', () => {
        const balanceCollection: IBalance[] = [{ id: 123 }];
        expectedResult = service.addBalanceToCollectionIfMissing(balanceCollection, undefined, null);
        expect(expectedResult).toEqual(balanceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
