import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserPointAssociation, UserPointAssociation } from '../user-point-association.model';

import { UserPointAssociationService } from './user-point-association.service';

describe('UserPointAssociation Service', () => {
  let service: UserPointAssociationService;
  let httpMock: HttpTestingController;
  let elemDefault: IUserPointAssociation;
  let expectedResult: IUserPointAssociation | IUserPointAssociation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserPointAssociationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
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

    it('should create a UserPointAssociation', () => {
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

      service.create(new UserPointAssociation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserPointAssociation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should partial update a UserPointAssociation', () => {
      const patchObject = Object.assign({}, new UserPointAssociation());

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

    it('should return a list of UserPointAssociation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a UserPointAssociation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUserPointAssociationToCollectionIfMissing', () => {
      it('should add a UserPointAssociation to an empty array', () => {
        const userPointAssociation: IUserPointAssociation = { id: 123 };
        expectedResult = service.addUserPointAssociationToCollectionIfMissing([], userPointAssociation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userPointAssociation);
      });

      it('should not add a UserPointAssociation to an array that contains it', () => {
        const userPointAssociation: IUserPointAssociation = { id: 123 };
        const userPointAssociationCollection: IUserPointAssociation[] = [
          {
            ...userPointAssociation,
          },
          { id: 456 },
        ];
        expectedResult = service.addUserPointAssociationToCollectionIfMissing(userPointAssociationCollection, userPointAssociation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserPointAssociation to an array that doesn't contain it", () => {
        const userPointAssociation: IUserPointAssociation = { id: 123 };
        const userPointAssociationCollection: IUserPointAssociation[] = [{ id: 456 }];
        expectedResult = service.addUserPointAssociationToCollectionIfMissing(userPointAssociationCollection, userPointAssociation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userPointAssociation);
      });

      it('should add only unique UserPointAssociation to an array', () => {
        const userPointAssociationArray: IUserPointAssociation[] = [{ id: 123 }, { id: 456 }, { id: 90302 }];
        const userPointAssociationCollection: IUserPointAssociation[] = [{ id: 123 }];
        expectedResult = service.addUserPointAssociationToCollectionIfMissing(userPointAssociationCollection, ...userPointAssociationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userPointAssociation: IUserPointAssociation = { id: 123 };
        const userPointAssociation2: IUserPointAssociation = { id: 456 };
        expectedResult = service.addUserPointAssociationToCollectionIfMissing([], userPointAssociation, userPointAssociation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userPointAssociation);
        expect(expectedResult).toContain(userPointAssociation2);
      });

      it('should accept null and undefined values', () => {
        const userPointAssociation: IUserPointAssociation = { id: 123 };
        expectedResult = service.addUserPointAssociationToCollectionIfMissing([], null, userPointAssociation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userPointAssociation);
      });

      it('should return initial array if no UserPointAssociation is added', () => {
        const userPointAssociationCollection: IUserPointAssociation[] = [{ id: 123 }];
        expectedResult = service.addUserPointAssociationToCollectionIfMissing(userPointAssociationCollection, undefined, null);
        expect(expectedResult).toEqual(userPointAssociationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
