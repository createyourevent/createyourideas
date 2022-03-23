import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShare, getShareIdentifier } from '../share.model';

export type EntityResponseType = HttpResponse<IShare>;
export type EntityArrayResponseType = HttpResponse<IShare[]>;

@Injectable({ providedIn: 'root' })
export class ShareService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shares');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(share: IShare): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(share);
    return this.http
      .post<IShare>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(share: IShare): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(share);
    return this.http
      .put<IShare>(`${this.resourceUrl}/${getShareIdentifier(share) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(share: IShare): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(share);
    return this.http
      .patch<IShare>(`${this.resourceUrl}/${getShareIdentifier(share) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShare>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShare[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShareToCollectionIfMissing(shareCollection: IShare[], ...sharesToCheck: (IShare | null | undefined)[]): IShare[] {
    const shares: IShare[] = sharesToCheck.filter(isPresent);
    if (shares.length > 0) {
      const shareCollectionIdentifiers = shareCollection.map(shareItem => getShareIdentifier(shareItem)!);
      const sharesToAdd = shares.filter(shareItem => {
        const shareIdentifier = getShareIdentifier(shareItem);
        if (shareIdentifier == null || shareCollectionIdentifiers.includes(shareIdentifier)) {
          return false;
        }
        shareCollectionIdentifiers.push(shareIdentifier);
        return true;
      });
      return [...sharesToAdd, ...shareCollection];
    }
    return shareCollection;
  }

  protected convertDateFromClient(share: IShare): IShare {
    return Object.assign({}, share, {
      date: share.date?.isValid() ? share.date.toJSON() : undefined,
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
      res.body.forEach((share: IShare) => {
        share.date = share.date ? dayjs(share.date) : undefined;
      });
    }
    return res;
  }
}
