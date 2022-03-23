import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfitBalance, getProfitBalanceIdentifier } from '../profit-balance.model';

export type EntityResponseType = HttpResponse<IProfitBalance>;
export type EntityArrayResponseType = HttpResponse<IProfitBalance[]>;

@Injectable({ providedIn: 'root' })
export class ProfitBalanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/profit-balances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(profitBalance: IProfitBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(profitBalance);
    return this.http
      .post<IProfitBalance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(profitBalance: IProfitBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(profitBalance);
    return this.http
      .put<IProfitBalance>(`${this.resourceUrl}/${getProfitBalanceIdentifier(profitBalance) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(profitBalance: IProfitBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(profitBalance);
    return this.http
      .patch<IProfitBalance>(`${this.resourceUrl}/${getProfitBalanceIdentifier(profitBalance) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProfitBalance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProfitBalance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProfitBalanceToCollectionIfMissing(
    profitBalanceCollection: IProfitBalance[],
    ...profitBalancesToCheck: (IProfitBalance | null | undefined)[]
  ): IProfitBalance[] {
    const profitBalances: IProfitBalance[] = profitBalancesToCheck.filter(isPresent);
    if (profitBalances.length > 0) {
      const profitBalanceCollectionIdentifiers = profitBalanceCollection.map(
        profitBalanceItem => getProfitBalanceIdentifier(profitBalanceItem)!
      );
      const profitBalancesToAdd = profitBalances.filter(profitBalanceItem => {
        const profitBalanceIdentifier = getProfitBalanceIdentifier(profitBalanceItem);
        if (profitBalanceIdentifier == null || profitBalanceCollectionIdentifiers.includes(profitBalanceIdentifier)) {
          return false;
        }
        profitBalanceCollectionIdentifiers.push(profitBalanceIdentifier);
        return true;
      });
      return [...profitBalancesToAdd, ...profitBalanceCollection];
    }
    return profitBalanceCollection;
  }

  protected convertDateFromClient(profitBalance: IProfitBalance): IProfitBalance {
    return Object.assign({}, profitBalance, {
      date: profitBalance.date?.isValid() ? profitBalance.date.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((profitBalance: IProfitBalance) => {
        profitBalance.date = profitBalance.date ? dayjs(profitBalance.date) : undefined;
      });
    }
    return res;
  }
}
