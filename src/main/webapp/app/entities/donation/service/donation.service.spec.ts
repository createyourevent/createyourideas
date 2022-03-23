import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDonation, Donation } from '../donation.model';

import { DonationService } from './donation.service';

describe('Donation Service', () => {
  let service: DonationService;
  let httpMock: HttpTestingController;
  let elemDefault: IDonation;
  let expectedResult: IDonation | IDonation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DonationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      amount: 0,
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

    it('should create a Donation', () => {
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

      service.create(new Donation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Donation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          amount: 1,
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

    it('should partial update a Donation', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
          billed: true,
        },
        new Donation()
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

    it('should return a list of Donation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          amount: 1,
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

    it('should delete a Donation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDonationToCollectionIfMissing', () => {
      it('should add a Donation to an empty array', () => {
        const donation: IDonation = { id: 123 };
        expectedResult = service.addDonationToCollectionIfMissing([], donation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(donation);
      });

      it('should not add a Donation to an array that contains it', () => {
        const donation: IDonation = { id: 123 };
        const donationCollection: IDonation[] = [
          {
            ...donation,
          },
          { id: 456 },
        ];
        expectedResult = service.addDonationToCollectionIfMissing(donationCollection, donation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Donation to an array that doesn't contain it", () => {
        const donation: IDonation = { id: 123 };
        const donationCollection: IDonation[] = [{ id: 456 }];
        expectedResult = service.addDonationToCollectionIfMissing(donationCollection, donation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(donation);
      });

      it('should add only unique Donation to an array', () => {
        const donationArray: IDonation[] = [{ id: 123 }, { id: 456 }, { id: 78345 }];
        const donationCollection: IDonation[] = [{ id: 123 }];
        expectedResult = service.addDonationToCollectionIfMissing(donationCollection, ...donationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const donation: IDonation = { id: 123 };
        const donation2: IDonation = { id: 456 };
        expectedResult = service.addDonationToCollectionIfMissing([], donation, donation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(donation);
        expect(expectedResult).toContain(donation2);
      });

      it('should accept null and undefined values', () => {
        const donation: IDonation = { id: 123 };
        expectedResult = service.addDonationToCollectionIfMissing([], null, donation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(donation);
      });

      it('should return initial array if no Donation is added', () => {
        const donationCollection: IDonation[] = [{ id: 123 }];
        expectedResult = service.addDonationToCollectionIfMissing(donationCollection, undefined, null);
        expect(expectedResult).toEqual(donationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
