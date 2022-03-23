import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMonthlyOutgoingsInvoice, getMonthlyOutgoingsInvoiceIdentifier } from '../monthly-outgoings-invoice.model';

export type EntityResponseType = HttpResponse<IMonthlyOutgoingsInvoice>;
export type EntityArrayResponseType = HttpResponse<IMonthlyOutgoingsInvoice[]>;

@Injectable({ providedIn: 'root' })
export class MonthlyOutgoingsInvoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/monthly-outgoings-invoices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(monthlyOutgoingsInvoice);
    return this.http
      .post<IMonthlyOutgoingsInvoice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(monthlyOutgoingsInvoice);
    return this.http
      .put<IMonthlyOutgoingsInvoice>(
        `${this.resourceUrl}/${getMonthlyOutgoingsInvoiceIdentifier(monthlyOutgoingsInvoice) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(monthlyOutgoingsInvoice);
    return this.http
      .patch<IMonthlyOutgoingsInvoice>(
        `${this.resourceUrl}/${getMonthlyOutgoingsInvoiceIdentifier(monthlyOutgoingsInvoice) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMonthlyOutgoingsInvoice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMonthlyOutgoingsInvoice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMonthlyOutgoingsInvoiceToCollectionIfMissing(
    monthlyOutgoingsInvoiceCollection: IMonthlyOutgoingsInvoice[],
    ...monthlyOutgoingsInvoicesToCheck: (IMonthlyOutgoingsInvoice | null | undefined)[]
  ): IMonthlyOutgoingsInvoice[] {
    const monthlyOutgoingsInvoices: IMonthlyOutgoingsInvoice[] = monthlyOutgoingsInvoicesToCheck.filter(isPresent);
    if (monthlyOutgoingsInvoices.length > 0) {
      const monthlyOutgoingsInvoiceCollectionIdentifiers = monthlyOutgoingsInvoiceCollection.map(
        monthlyOutgoingsInvoiceItem => getMonthlyOutgoingsInvoiceIdentifier(monthlyOutgoingsInvoiceItem)!
      );
      const monthlyOutgoingsInvoicesToAdd = monthlyOutgoingsInvoices.filter(monthlyOutgoingsInvoiceItem => {
        const monthlyOutgoingsInvoiceIdentifier = getMonthlyOutgoingsInvoiceIdentifier(monthlyOutgoingsInvoiceItem);
        if (
          monthlyOutgoingsInvoiceIdentifier == null ||
          monthlyOutgoingsInvoiceCollectionIdentifiers.includes(monthlyOutgoingsInvoiceIdentifier)
        ) {
          return false;
        }
        monthlyOutgoingsInvoiceCollectionIdentifiers.push(monthlyOutgoingsInvoiceIdentifier);
        return true;
      });
      return [...monthlyOutgoingsInvoicesToAdd, ...monthlyOutgoingsInvoiceCollection];
    }
    return monthlyOutgoingsInvoiceCollection;
  }

  protected convertDateFromClient(monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice): IMonthlyOutgoingsInvoice {
    return Object.assign({}, monthlyOutgoingsInvoice, {
      date: monthlyOutgoingsInvoice.date?.isValid() ? monthlyOutgoingsInvoice.date.toJSON() : undefined,
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
      res.body.forEach((monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice) => {
        monthlyOutgoingsInvoice.date = monthlyOutgoingsInvoice.date ? dayjs(monthlyOutgoingsInvoice.date) : undefined;
      });
    }
    return res;
  }
}
