import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IShare, Share } from '../share.model';

import { ShareService } from './share.service';

describe('Share Service', () => {
  let service: ShareService;
  let httpMock: HttpTestingController;
  let elemDefault: IShare;
  let expectedResult: IShare | IShare[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShareService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      value: 0,
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

    it('should create a Share', () => {
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

      service.create(new Share()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Share', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          value: 1,
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

    it('should partial update a Share', () => {
      const patchObject = Object.assign({}, new Share());

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

    it('should return a list of Share', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          value: 1,
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

    it('should delete a Share', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addShareToCollectionIfMissing', () => {
      it('should add a Share to an empty array', () => {
        const share: IShare = { id: 123 };
        expectedResult = service.addShareToCollectionIfMissing([], share);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(share);
      });

      it('should not add a Share to an array that contains it', () => {
        const share: IShare = { id: 123 };
        const shareCollection: IShare[] = [
          {
            ...share,
          },
          { id: 456 },
        ];
        expectedResult = service.addShareToCollectionIfMissing(shareCollection, share);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Share to an array that doesn't contain it", () => {
        const share: IShare = { id: 123 };
        const shareCollection: IShare[] = [{ id: 456 }];
        expectedResult = service.addShareToCollectionIfMissing(shareCollection, share);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(share);
      });

      it('should add only unique Share to an array', () => {
        const shareArray: IShare[] = [{ id: 123 }, { id: 456 }, { id: 18095 }];
        const shareCollection: IShare[] = [{ id: 123 }];
        expectedResult = service.addShareToCollectionIfMissing(shareCollection, ...shareArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const share: IShare = { id: 123 };
        const share2: IShare = { id: 456 };
        expectedResult = service.addShareToCollectionIfMissing([], share, share2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(share);
        expect(expectedResult).toContain(share2);
      });

      it('should accept null and undefined values', () => {
        const share: IShare = { id: 123 };
        expectedResult = service.addShareToCollectionIfMissing([], null, share, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(share);
      });

      it('should return initial array if no Share is added', () => {
        const shareCollection: IShare[] = [{ id: 123 }];
        expectedResult = service.addShareToCollectionIfMissing(shareCollection, undefined, null);
        expect(expectedResult).toEqual(shareCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
