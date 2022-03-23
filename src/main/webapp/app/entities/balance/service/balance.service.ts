import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBalance, getBalanceIdentifier } from '../balance.model';

export type EntityResponseType = HttpResponse<IBalance>;
export type EntityArrayResponseType = HttpResponse<IBalance[]>;

@Injectable({ providedIn: 'root' })
export class BalanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/balances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(balance: IBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(balance);
    return this.http
      .post<IBalance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(balance: IBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(balance);
    return this.http
      .put<IBalance>(`${this.resourceUrl}/${getBalanceIdentifier(balance) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(balance: IBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(balance);
    return this.http
      .patch<IBalance>(`${this.resourceUrl}/${getBalanceIdentifier(balance) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBalance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBalance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBalanceToCollectionIfMissing(balanceCollection: IBalance[], ...balancesToCheck: (IBalance | null | undefined)[]): IBalance[] {
    const balances: IBalance[] = balancesToCheck.filter(isPresent);
    if (balances.length > 0) {
      const balanceCollectionIdentifiers = balanceCollection.map(balanceItem => getBalanceIdentifier(balanceItem)!);
      const balancesToAdd = balances.filter(balanceItem => {
        const balanceIdentifier = getBalanceIdentifier(balanceItem);
        if (balanceIdentifier == null || balanceCollectionIdentifiers.includes(balanceIdentifier)) {
          return false;
        }
        balanceCollectionIdentifiers.push(balanceIdentifier);
        return true;
      });
      return [...balancesToAdd, ...balanceCollection];
    }
    return balanceCollection;
  }

  protected convertDateFromClient(balance: IBalance): IBalance {
    return Object.assign({}, balance, {
      date: balance.date?.isValid() ? balance.date.toJSON() : undefined,
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
      res.body.forEach((balance: IBalance) => {
        balance.date = balance.date ? dayjs(balance.date) : undefined;
      });
    }
    return res;
  }
}
