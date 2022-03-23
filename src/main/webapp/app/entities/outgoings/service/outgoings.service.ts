import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOutgoings, getOutgoingsIdentifier } from '../outgoings.model';

export type EntityResponseType = HttpResponse<IOutgoings>;
export type EntityArrayResponseType = HttpResponse<IOutgoings[]>;

@Injectable({ providedIn: 'root' })
export class OutgoingsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/outgoings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(outgoings: IOutgoings): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(outgoings);
    return this.http
      .post<IOutgoings>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(outgoings: IOutgoings): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(outgoings);
    return this.http
      .put<IOutgoings>(`${this.resourceUrl}/${getOutgoingsIdentifier(outgoings) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(outgoings: IOutgoings): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(outgoings);
    return this.http
      .patch<IOutgoings>(`${this.resourceUrl}/${getOutgoingsIdentifier(outgoings) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOutgoings>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOutgoings[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOutgoingsToCollectionIfMissing(
    outgoingsCollection: IOutgoings[],
    ...outgoingsToCheck: (IOutgoings | null | undefined)[]
  ): IOutgoings[] {
    const outgoings: IOutgoings[] = outgoingsToCheck.filter(isPresent);
    if (outgoings.length > 0) {
      const outgoingsCollectionIdentifiers = outgoingsCollection.map(outgoingsItem => getOutgoingsIdentifier(outgoingsItem)!);
      const outgoingsToAdd = outgoings.filter(outgoingsItem => {
        const outgoingsIdentifier = getOutgoingsIdentifier(outgoingsItem);
        if (outgoingsIdentifier == null || outgoingsCollectionIdentifiers.includes(outgoingsIdentifier)) {
          return false;
        }
        outgoingsCollectionIdentifiers.push(outgoingsIdentifier);
        return true;
      });
      return [...outgoingsToAdd, ...outgoingsCollection];
    }
    return outgoingsCollection;
  }

  protected convertDateFromClient(outgoings: IOutgoings): IOutgoings {
    return Object.assign({}, outgoings, {
      date: outgoings.date?.isValid() ? outgoings.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((outgoings: IOutgoings) => {
        outgoings.date = outgoings.date ? dayjs(outgoings.date) : undefined;
      });
    }
    return res;
  }
}
