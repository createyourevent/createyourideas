import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IWorksheet, Worksheet } from '../worksheet.model';

import { WorksheetService } from './worksheet.service';

describe('Worksheet Service', () => {
  let service: WorksheetService;
  let httpMock: HttpTestingController;
  let elemDefault: IWorksheet;
  let expectedResult: IWorksheet | IWorksheet[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WorksheetService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      jobtitle: 'AAAAAAA',
      jobdescription: 'AAAAAAA',
      dateStart: currentDate,
      dateEnd: currentDate,
      costHour: 0,
      hours: 'PT1S',
      total: 0,
      billed: false,
      auto: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateStart: currentDate.format(DATE_TIME_FORMAT),
          dateEnd: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Worksheet', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateStart: currentDate.format(DATE_TIME_FORMAT),
          dateEnd: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateStart: currentDate,
          dateEnd: currentDate,
        },
        returnedFromService
      );

      service.create(new Worksheet()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Worksheet', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobtitle: 'BBBBBB',
          jobdescription: 'BBBBBB',
          dateStart: currentDate.format(DATE_TIME_FORMAT),
          dateEnd: currentDate.format(DATE_TIME_FORMAT),
          costHour: 1,
          hours: 'BBBBBB',
          total: 1,
          billed: true,
          auto: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateStart: currentDate,
          dateEnd: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Worksheet', () => {
      const patchObject = Object.assign(
        {
          jobtitle: 'BBBBBB',
          jobdescription: 'BBBBBB',
          dateStart: currentDate.format(DATE_TIME_FORMAT),
          auto: true,
        },
        new Worksheet()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateStart: currentDate,
          dateEnd: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Worksheet', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobtitle: 'BBBBBB',
          jobdescription: 'BBBBBB',
          dateStart: currentDate.format(DATE_TIME_FORMAT),
          dateEnd: currentDate.format(DATE_TIME_FORMAT),
          costHour: 1,
          hours: 'BBBBBB',
          total: 1,
          billed: true,
          auto: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateStart: currentDate,
          dateEnd: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Worksheet', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addWorksheetToCollectionIfMissing', () => {
      it('should add a Worksheet to an empty array', () => {
        const worksheet: IWorksheet = { id: 123 };
        expectedResult = service.addWorksheetToCollectionIfMissing([], worksheet);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(worksheet);
      });

      it('should not add a Worksheet to an array that contains it', () => {
        const worksheet: IWorksheet = { id: 123 };
        const worksheetCollection: IWorksheet[] = [
          {
            ...worksheet,
          },
          { id: 456 },
        ];
        expectedResult = service.addWorksheetToCollectionIfMissing(worksheetCollection, worksheet);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Worksheet to an array that doesn't contain it", () => {
        const worksheet: IWorksheet = { id: 123 };
        const worksheetCollection: IWorksheet[] = [{ id: 456 }];
        expectedResult = service.addWorksheetToCollectionIfMissing(worksheetCollection, worksheet);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(worksheet);
      });

      it('should add only unique Worksheet to an array', () => {
        const worksheetArray: IWorksheet[] = [{ id: 123 }, { id: 456 }, { id: 8199 }];
        const worksheetCollection: IWorksheet[] = [{ id: 123 }];
        expectedResult = service.addWorksheetToCollectionIfMissing(worksheetCollection, ...worksheetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const worksheet: IWorksheet = { id: 123 };
        const worksheet2: IWorksheet = { id: 456 };
        expectedResult = service.addWorksheetToCollectionIfMissing([], worksheet, worksheet2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(worksheet);
        expect(expectedResult).toContain(worksheet2);
      });

      it('should accept null and undefined values', () => {
        const worksheet: IWorksheet = { id: 123 };
        expectedResult = service.addWorksheetToCollectionIfMissing([], null, worksheet, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(worksheet);
      });

      it('should return initial array if no Worksheet is added', () => {
        const worksheetCollection: IWorksheet[] = [{ id: 123 }];
        expectedResult = service.addWorksheetToCollectionIfMissing(worksheetCollection, undefined, null);
        expect(expectedResult).toEqual(worksheetCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
