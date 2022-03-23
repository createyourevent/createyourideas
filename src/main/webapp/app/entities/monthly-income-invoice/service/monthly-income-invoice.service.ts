import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMonthlyIncomeInvoice, getMonthlyIncomeInvoiceIdentifier } from '../monthly-income-invoice.model';

export type EntityResponseType = HttpResponse<IMonthlyIncomeInvoice>;
export type EntityArrayResponseType = HttpResponse<IMonthlyIncomeInvoice[]>;

@Injectable({ providedIn: 'root' })
export class MonthlyIncomeInvoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/monthly-income-invoices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(monthlyIncomeInvoice: IMonthlyIncomeInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(monthlyIncomeInvoice);
    return this.http
      .post<IMonthlyIncomeInvoice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(monthlyIncomeInvoice: IMonthlyIncomeInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(monthlyIncomeInvoice);
    return this.http
      .put<IMonthlyIncomeInvoice>(`${this.resourceUrl}/${getMonthlyIncomeInvoiceIdentifier(monthlyIncomeInvoice) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(monthlyIncomeInvoice: IMonthlyIncomeInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(monthlyIncomeInvoice);
    return this.http
      .patch<IMonthlyIncomeInvoice>(`${this.resourceUrl}/${getMonthlyIncomeInvoiceIdentifier(monthlyIncomeInvoice) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMonthlyIncomeInvoice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMonthlyIncomeInvoice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMonthlyIncomeInvoiceToCollectionIfMissing(
    monthlyIncomeInvoiceCollection: IMonthlyIncomeInvoice[],
    ...monthlyIncomeInvoicesToCheck: (IMonthlyIncomeInvoice | null | undefined)[]
  ): IMonthlyIncomeInvoice[] {
    const monthlyIncomeInvoices: IMonthlyIncomeInvoice[] = monthlyIncomeInvoicesToCheck.filter(isPresent);
    if (monthlyIncomeInvoices.length > 0) {
      const monthlyIncomeInvoiceCollectionIdentifiers = monthlyIncomeInvoiceCollection.map(
        monthlyIncomeInvoiceItem => getMonthlyIncomeInvoiceIdentifier(monthlyIncomeInvoiceItem)!
      );
      const monthlyIncomeInvoicesToAdd = monthlyIncomeInvoices.filter(monthlyIncomeInvoiceItem => {
        const monthlyIncomeInvoiceIdentifier = getMonthlyIncomeInvoiceIdentifier(monthlyIncomeInvoiceItem);
        if (monthlyIncomeInvoiceIdentifier == null || monthlyIncomeInvoiceCollectionIdentifiers.includes(monthlyIncomeInvoiceIdentifier)) {
          return false;
        }
        monthlyIncomeInvoiceCollectionIdentifiers.push(monthlyIncomeInvoiceIdentifier);
        return true;
      });
      return [...monthlyIncomeInvoicesToAdd, ...monthlyIncomeInvoiceCollection];
    }
    return monthlyIncomeInvoiceCollection;
  }

  protected convertDateFromClient(monthlyIncomeInvoice: IMonthlyIncomeInvoice): IMonthlyIncomeInvoice {
    return Object.assign({}, monthlyIncomeInvoice, {
      date: monthlyIncomeInvoice.date?.isValid() ? monthlyIncomeInvoice.date.toJSON() : undefined,
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
      res.body.forEach((monthlyIncomeInvoice: IMonthlyIncomeInvoice) => {
        monthlyIncomeInvoice.date = monthlyIncomeInvoice.date ? dayjs(monthlyIncomeInvoice.date) : undefined;
      });
    }
    return res;
  }
}
