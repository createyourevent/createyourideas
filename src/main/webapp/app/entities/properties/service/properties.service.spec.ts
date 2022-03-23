import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProperties, Properties } from '../properties.model';

import { PropertiesService } from './properties.service';

describe('Properties Service', () => {
  let service: PropertiesService;
  let httpMock: HttpTestingController;
  let elemDefault: IProperties;
  let expectedResult: IProperties | IProperties[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PropertiesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      key: 'AAAAAAA',
      value: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Properties', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Properties()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Properties', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          key: 'BBBBBB',
          value: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Properties', () => {
      const patchObject = Object.assign(
        {
          key: 'BBBBBB',
          value: 'BBBBBB',
        },
        new Properties()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Properties', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          key: 'BBBBBB',
          value: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Properties', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPropertiesToCollectionIfMissing', () => {
      it('should add a Properties to an empty array', () => {
        const properties: IProperties = { id: 123 };
        expectedResult = service.addPropertiesToCollectionIfMissing([], properties);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(properties);
      });

      it('should not add a Properties to an array that contains it', () => {
        const properties: IProperties = { id: 123 };
        const propertiesCollection: IProperties[] = [
          {
            ...properties,
          },
          { id: 456 },
        ];
        expectedResult = service.addPropertiesToCollectionIfMissing(propertiesCollection, properties);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Properties to an array that doesn't contain it", () => {
        const properties: IProperties = { id: 123 };
        const propertiesCollection: IProperties[] = [{ id: 456 }];
        expectedResult = service.addPropertiesToCollectionIfMissing(propertiesCollection, properties);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(properties);
      });

      it('should add only unique Properties to an array', () => {
        const propertiesArray: IProperties[] = [{ id: 123 }, { id: 456 }, { id: 68564 }];
        const propertiesCollection: IProperties[] = [{ id: 123 }];
        expectedResult = service.addPropertiesToCollectionIfMissing(propertiesCollection, ...propertiesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const properties: IProperties = { id: 123 };
        const properties2: IProperties = { id: 456 };
        expectedResult = service.addPropertiesToCollectionIfMissing([], properties, properties2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(properties);
        expect(expectedResult).toContain(properties2);
      });

      it('should accept null and undefined values', () => {
        const properties: IProperties = { id: 123 };
        expectedResult = service.addPropertiesToCollectionIfMissing([], null, properties, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(properties);
      });

      it('should return initial array if no Properties is added', () => {
        const propertiesCollection: IProperties[] = [{ id: 123 }];
        expectedResult = service.addPropertiesToCollectionIfMissing(propertiesCollection, undefined, null);
        expect(expectedResult).toEqual(propertiesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
