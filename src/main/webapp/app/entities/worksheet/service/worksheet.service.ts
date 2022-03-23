import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWorksheet, getWorksheetIdentifier } from '../worksheet.model';

export type EntityResponseType = HttpResponse<IWorksheet>;
export type EntityArrayResponseType = HttpResponse<IWorksheet[]>;

@Injectable({ providedIn: 'root' })
export class WorksheetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/worksheets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(worksheet: IWorksheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(worksheet);
    return this.http
      .post<IWorksheet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(worksheet: IWorksheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(worksheet);
    return this.http
      .put<IWorksheet>(`${this.resourceUrl}/${getWorksheetIdentifier(worksheet) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(worksheet: IWorksheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(worksheet);
    return this.http
      .patch<IWorksheet>(`${this.resourceUrl}/${getWorksheetIdentifier(worksheet) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IWorksheet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IWorksheet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addWorksheetToCollectionIfMissing(
    worksheetCollection: IWorksheet[],
    ...worksheetsToCheck: (IWorksheet | null | undefined)[]
  ): IWorksheet[] {
    const worksheets: IWorksheet[] = worksheetsToCheck.filter(isPresent);
    if (worksheets.length > 0) {
      const worksheetCollectionIdentifiers = worksheetCollection.map(worksheetItem => getWorksheetIdentifier(worksheetItem)!);
      const worksheetsToAdd = worksheets.filter(worksheetItem => {
        const worksheetIdentifier = getWorksheetIdentifier(worksheetItem);
        if (worksheetIdentifier == null || worksheetCollectionIdentifiers.includes(worksheetIdentifier)) {
          return false;
        }
        worksheetCollectionIdentifiers.push(worksheetIdentifier);
        return true;
      });
      return [...worksheetsToAdd, ...worksheetCollection];
    }
    return worksheetCollection;
  }

  protected convertDateFromClient(worksheet: IWorksheet): IWorksheet {
    return Object.assign({}, worksheet, {
      dateStart: worksheet.dateStart?.isValid() ? worksheet.dateStart.toJSON() : undefined,
      dateEnd: worksheet.dateEnd?.isValid() ? worksheet.dateEnd.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateStart = res.body.dateStart ? dayjs(res.body.dateStart) : undefined;
      res.body.dateEnd = res.body.dateEnd ? dayjs(res.body.dateEnd) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((worksheet: IWorksheet) => {
        worksheet.dateStart = worksheet.dateStart ? dayjs(worksheet.dateStart) : undefined;
        worksheet.dateEnd = worksheet.dateEnd ? dayjs(worksheet.dateEnd) : undefined;
      });
    }
    return res;
  }
}
