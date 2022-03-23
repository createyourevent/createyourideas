import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDonation, getDonationIdentifier } from '../donation.model';

export type EntityResponseType = HttpResponse<IDonation>;
export type EntityArrayResponseType = HttpResponse<IDonation[]>;

@Injectable({ providedIn: 'root' })
export class DonationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/donations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(donation: IDonation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(donation);
    return this.http
      .post<IDonation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(donation: IDonation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(donation);
    return this.http
      .put<IDonation>(`${this.resourceUrl}/${getDonationIdentifier(donation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(donation: IDonation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(donation);
    return this.http
      .patch<IDonation>(`${this.resourceUrl}/${getDonationIdentifier(donation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDonation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDonation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDonationToCollectionIfMissing(donationCollection: IDonation[], ...donationsToCheck: (IDonation | null | undefined)[]): IDonation[] {
    const donations: IDonation[] = donationsToCheck.filter(isPresent);
    if (donations.length > 0) {
      const donationCollectionIdentifiers = donationCollection.map(donationItem => getDonationIdentifier(donationItem)!);
      const donationsToAdd = donations.filter(donationItem => {
        const donationIdentifier = getDonationIdentifier(donationItem);
        if (donationIdentifier == null || donationCollectionIdentifiers.includes(donationIdentifier)) {
          return false;
        }
        donationCollectionIdentifiers.push(donationIdentifier);
        return true;
      });
      return [...donationsToAdd, ...donationCollection];
    }
    return donationCollection;
  }

  protected convertDateFromClient(donation: IDonation): IDonation {
    return Object.assign({}, donation, {
      date: donation.date?.isValid() ? donation.date.toJSON() : undefined,
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
      res.body.forEach((donation: IDonation) => {
        donation.date = donation.date ? dayjs(donation.date) : undefined;
      });
    }
    return res;
  }
}
