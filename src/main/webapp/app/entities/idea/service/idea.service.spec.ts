import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Ideatype } from 'app/entities/enumerations/ideatype.model';
import { IIdea, Idea } from '../idea.model';

import { IdeaService } from './idea.service';

describe('Idea Service', () => {
  let service: IdeaService;
  let httpMock: HttpTestingController;
  let elemDefault: IIdea;
  let expectedResult: IIdea | IIdea[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IdeaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      logoContentType: 'image/png',
      logo: 'AAAAAAA',
      description: 'AAAAAAA',
      ideatype: Ideatype.LEVEL1,
      interest: 0,
      distribution: 0,
      investment: 0,
      active: false,
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

    it('should create a Idea', () => {
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

      service.create(new Idea()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Idea', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          logo: 'BBBBBB',
          description: 'BBBBBB',
          ideatype: 'BBBBBB',
          interest: 1,
          distribution: 1,
          investment: 1,
          active: true,
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

    it('should partial update a Idea', () => {
      const patchObject = Object.assign(
        {
          ideatype: 'BBBBBB',
        },
        new Idea()
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

    it('should return a list of Idea', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          logo: 'BBBBBB',
          description: 'BBBBBB',
          ideatype: 'BBBBBB',
          interest: 1,
          distribution: 1,
          investment: 1,
          active: true,
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

    it('should delete a Idea', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIdeaToCollectionIfMissing', () => {
      it('should add a Idea to an empty array', () => {
        const idea: IIdea = { id: 123 };
        expectedResult = service.addIdeaToCollectionIfMissing([], idea);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(idea);
      });

      it('should not add a Idea to an array that contains it', () => {
        const idea: IIdea = { id: 123 };
        const ideaCollection: IIdea[] = [
          {
            ...idea,
          },
          { id: 456 },
        ];
        expectedResult = service.addIdeaToCollectionIfMissing(ideaCollection, idea);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Idea to an array that doesn't contain it", () => {
        const idea: IIdea = { id: 123 };
        const ideaCollection: IIdea[] = [{ id: 456 }];
        expectedResult = service.addIdeaToCollectionIfMissing(ideaCollection, idea);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(idea);
      });

      it('should add only unique Idea to an array', () => {
        const ideaArray: IIdea[] = [{ id: 123 }, { id: 456 }, { id: 37996 }];
        const ideaCollection: IIdea[] = [{ id: 123 }];
        expectedResult = service.addIdeaToCollectionIfMissing(ideaCollection, ...ideaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const idea: IIdea = { id: 123 };
        const idea2: IIdea = { id: 456 };
        expectedResult = service.addIdeaToCollectionIfMissing([], idea, idea2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(idea);
        expect(expectedResult).toContain(idea2);
      });

      it('should accept null and undefined values', () => {
        const idea: IIdea = { id: 123 };
        expectedResult = service.addIdeaToCollectionIfMissing([], null, idea, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(idea);
      });

      it('should return initial array if no Idea is added', () => {
        const ideaCollection: IIdea[] = [{ id: 123 }];
        expectedResult = service.addIdeaToCollectionIfMissing(ideaCollection, undefined, null);
        expect(expectedResult).toEqual(ideaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
