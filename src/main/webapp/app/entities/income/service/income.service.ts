import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIncome, getIncomeIdentifier } from '../income.model';

export type EntityResponseType = HttpResponse<IIncome>;
export type EntityArrayResponseType = HttpResponse<IIncome[]>;

@Injectable({ providedIn: 'root' })
export class IncomeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/incomes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(income: IIncome): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(income);
    return this.http
      .post<IIncome>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(income: IIncome): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(income);
    return this.http
      .put<IIncome>(`${this.resourceUrl}/${getIncomeIdentifier(income) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(income: IIncome): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(income);
    return this.http
      .patch<IIncome>(`${this.resourceUrl}/${getIncomeIdentifier(income) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIncome>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIncome[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIncomeToCollectionIfMissing(incomeCollection: IIncome[], ...incomesToCheck: (IIncome | null | undefined)[]): IIncome[] {
    const incomes: IIncome[] = incomesToCheck.filter(isPresent);
    if (incomes.length > 0) {
      const incomeCollectionIdentifiers = incomeCollection.map(incomeItem => getIncomeIdentifier(incomeItem)!);
      const incomesToAdd = incomes.filter(incomeItem => {
        const incomeIdentifier = getIncomeIdentifier(incomeItem);
        if (incomeIdentifier == null || incomeCollectionIdentifiers.includes(incomeIdentifier)) {
          return false;
        }
        incomeCollectionIdentifiers.push(incomeIdentifier);
        return true;
      });
      return [...incomesToAdd, ...incomeCollection];
    }
    return incomeCollection;
  }

  protected convertDateFromClient(income: IIncome): IIncome {
    return Object.assign({}, income, {
      date: income.date?.isValid() ? income.date.toJSON() : undefined,
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
      res.body.forEach((income: IIncome) => {
        income.date = income.date ? dayjs(income.date) : undefined;
      });
    }
    return res;
  }
}
