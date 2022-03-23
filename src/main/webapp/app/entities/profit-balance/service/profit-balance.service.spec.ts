import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IProfitBalance, ProfitBalance } from '../profit-balance.model';

import { ProfitBalanceService } from './profit-balance.service';

describe('ProfitBalance Service', () => {
  let service: ProfitBalanceService;
  let httpMock: HttpTestingController;
  let elemDefault: IProfitBalance;
  let expectedResult: IProfitBalance | IProfitBalance[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProfitBalanceService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      profit: 0,
      profitToSpend: 0,
      netProfit: 0,
      date: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ProfitBalance', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new ProfitBalance()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProfitBalance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          profit: 1,
          profitToSpend: 1,
          netProfit: 1,
          date: currentDate.format(DATE_FORMAT),
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

    it('should partial update a ProfitBalance', () => {
      const patchObject = Object.assign(
        {
          profit: 1,
          date: currentDate.format(DATE_FORMAT),
        },
        new ProfitBalance()
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

    it('should return a list of ProfitBalance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          profit: 1,
          profitToSpend: 1,
          netProfit: 1,
          date: currentDate.format(DATE_FORMAT),
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

    it('should delete a ProfitBalance', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProfitBalanceToCollectionIfMissing', () => {
      it('should add a ProfitBalance to an empty array', () => {
        const profitBalance: IProfitBalance = { id: 123 };
        expectedResult = service.addProfitBalanceToCollectionIfMissing([], profitBalance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profitBalance);
      });

      it('should not add a ProfitBalance to an array that contains it', () => {
        const profitBalance: IProfitBalance = { id: 123 };
        const profitBalanceCollection: IProfitBalance[] = [
          {
            ...profitBalance,
          },
          { id: 456 },
        ];
        expectedResult = service.addProfitBalanceToCollectionIfMissing(profitBalanceCollection, profitBalance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProfitBalance to an array that doesn't contain it", () => {
        const profitBalance: IProfitBalance = { id: 123 };
        const profitBalanceCollection: IProfitBalance[] = [{ id: 456 }];
        expectedResult = service.addProfitBalanceToCollectionIfMissing(profitBalanceCollection, profitBalance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profitBalance);
      });

      it('should add only unique ProfitBalance to an array', () => {
        const profitBalanceArray: IProfitBalance[] = [{ id: 123 }, { id: 456 }, { id: 91223 }];
        const profitBalanceCollection: IProfitBalance[] = [{ id: 123 }];
        expectedResult = service.addProfitBalanceToCollectionIfMissing(profitBalanceCollection, ...profitBalanceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const profitBalance: IProfitBalance = { id: 123 };
        const profitBalance2: IProfitBalance = { id: 456 };
        expectedResult = service.addProfitBalanceToCollectionIfMissing([], profitBalance, profitBalance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profitBalance);
        expect(expectedResult).toContain(profitBalance2);
      });

      it('should accept null and undefined values', () => {
        const profitBalance: IProfitBalance = { id: 123 };
        expectedResult = service.addProfitBalanceToCollectionIfMissing([], null, profitBalance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profitBalance);
      });

      it('should return initial array if no ProfitBalance is added', () => {
        const profitBalanceCollection: IProfitBalance[] = [{ id: 123 }];
        expectedResult = service.addProfitBalanceToCollectionIfMissing(profitBalanceCollection, undefined, null);
        expect(expectedResult).toEqual(profitBalanceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
