import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIdeaTransactionId, getIdeaTransactionIdIdentifier } from '../idea-transaction-id.model';

export type EntityResponseType = HttpResponse<IIdeaTransactionId>;
export type EntityArrayResponseType = HttpResponse<IIdeaTransactionId[]>;

@Injectable({ providedIn: 'root' })
export class IdeaTransactionIdService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/idea-transaction-ids');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ideaTransactionId: IIdeaTransactionId): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaTransactionId);
    return this.http
      .post<IIdeaTransactionId>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ideaTransactionId: IIdeaTransactionId): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaTransactionId);
    return this.http
      .put<IIdeaTransactionId>(`${this.resourceUrl}/${getIdeaTransactionIdIdentifier(ideaTransactionId) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(ideaTransactionId: IIdeaTransactionId): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaTransactionId);
    return this.http
      .patch<IIdeaTransactionId>(`${this.resourceUrl}/${getIdeaTransactionIdIdentifier(ideaTransactionId) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIdeaTransactionId>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIdeaTransactionId[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIdeaTransactionIdToCollectionIfMissing(
    ideaTransactionIdCollection: IIdeaTransactionId[],
    ...ideaTransactionIdsToCheck: (IIdeaTransactionId | null | undefined)[]
  ): IIdeaTransactionId[] {
    const ideaTransactionIds: IIdeaTransactionId[] = ideaTransactionIdsToCheck.filter(isPresent);
    if (ideaTransactionIds.length > 0) {
      const ideaTransactionIdCollectionIdentifiers = ideaTransactionIdCollection.map(
        ideaTransactionIdItem => getIdeaTransactionIdIdentifier(ideaTransactionIdItem)!
      );
      const ideaTransactionIdsToAdd = ideaTransactionIds.filter(ideaTransactionIdItem => {
        const ideaTransactionIdIdentifier = getIdeaTransactionIdIdentifier(ideaTransactionIdItem);
        if (ideaTransactionIdIdentifier == null || ideaTransactionIdCollectionIdentifiers.includes(ideaTransactionIdIdentifier)) {
          return false;
        }
        ideaTransactionIdCollectionIdentifiers.push(ideaTransactionIdIdentifier);
        return true;
      });
      return [...ideaTransactionIdsToAdd, ...ideaTransactionIdCollection];
    }
    return ideaTransactionIdCollection;
  }

  protected convertDateFromClient(ideaTransactionId: IIdeaTransactionId): IIdeaTransactionId {
    return Object.assign({}, ideaTransactionId, {
      date: ideaTransactionId.date?.isValid() ? ideaTransactionId.date.toJSON() : undefined,
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
      res.body.forEach((ideaTransactionId: IIdeaTransactionId) => {
        ideaTransactionId.date = ideaTransactionId.date ? dayjs(ideaTransactionId.date) : undefined;
      });
    }
    return res;
  }
}
