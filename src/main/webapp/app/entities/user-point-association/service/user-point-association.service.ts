import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserPointAssociation, getUserPointAssociationIdentifier } from '../user-point-association.model';

export type EntityResponseType = HttpResponse<IUserPointAssociation>;
export type EntityArrayResponseType = HttpResponse<IUserPointAssociation[]>;

@Injectable({ providedIn: 'root' })
export class UserPointAssociationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-point-associations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userPointAssociation: IUserPointAssociation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userPointAssociation);
    return this.http
      .post<IUserPointAssociation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(userPointAssociation: IUserPointAssociation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userPointAssociation);
    return this.http
      .put<IUserPointAssociation>(`${this.resourceUrl}/${getUserPointAssociationIdentifier(userPointAssociation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(userPointAssociation: IUserPointAssociation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userPointAssociation);
    return this.http
      .patch<IUserPointAssociation>(`${this.resourceUrl}/${getUserPointAssociationIdentifier(userPointAssociation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUserPointAssociation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUserPointAssociation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserPointAssociationToCollectionIfMissing(
    userPointAssociationCollection: IUserPointAssociation[],
    ...userPointAssociationsToCheck: (IUserPointAssociation | null | undefined)[]
  ): IUserPointAssociation[] {
    const userPointAssociations: IUserPointAssociation[] = userPointAssociationsToCheck.filter(isPresent);
    if (userPointAssociations.length > 0) {
      const userPointAssociationCollectionIdentifiers = userPointAssociationCollection.map(
        userPointAssociationItem => getUserPointAssociationIdentifier(userPointAssociationItem)!
      );
      const userPointAssociationsToAdd = userPointAssociations.filter(userPointAssociationItem => {
        const userPointAssociationIdentifier = getUserPointAssociationIdentifier(userPointAssociationItem);
        if (userPointAssociationIdentifier == null || userPointAssociationCollectionIdentifiers.includes(userPointAssociationIdentifier)) {
          return false;
        }
        userPointAssociationCollectionIdentifiers.push(userPointAssociationIdentifier);
        return true;
      });
      return [...userPointAssociationsToAdd, ...userPointAssociationCollection];
    }
    return userPointAssociationCollection;
  }

  protected convertDateFromClient(userPointAssociation: IUserPointAssociation): IUserPointAssociation {
    return Object.assign({}, userPointAssociation, {
      date: userPointAssociation.date?.isValid() ? userPointAssociation.date.toJSON() : undefined,
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
      res.body.forEach((userPointAssociation: IUserPointAssociation) => {
        userPointAssociation.date = userPointAssociation.date ? dayjs(userPointAssociation.date) : undefined;
      });
    }
    return res;
  }
}
