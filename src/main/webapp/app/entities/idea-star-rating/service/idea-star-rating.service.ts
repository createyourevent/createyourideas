import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIdeaStarRating, getIdeaStarRatingIdentifier } from '../idea-star-rating.model';

export type EntityResponseType = HttpResponse<IIdeaStarRating>;
export type EntityArrayResponseType = HttpResponse<IIdeaStarRating[]>;

@Injectable({ providedIn: 'root' })
export class IdeaStarRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/idea-star-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ideaStarRating: IIdeaStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaStarRating);
    return this.http
      .post<IIdeaStarRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ideaStarRating: IIdeaStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaStarRating);
    return this.http
      .put<IIdeaStarRating>(`${this.resourceUrl}/${getIdeaStarRatingIdentifier(ideaStarRating) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(ideaStarRating: IIdeaStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaStarRating);
    return this.http
      .patch<IIdeaStarRating>(`${this.resourceUrl}/${getIdeaStarRatingIdentifier(ideaStarRating) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIdeaStarRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIdeaStarRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIdeaStarRatingToCollectionIfMissing(
    ideaStarRatingCollection: IIdeaStarRating[],
    ...ideaStarRatingsToCheck: (IIdeaStarRating | null | undefined)[]
  ): IIdeaStarRating[] {
    const ideaStarRatings: IIdeaStarRating[] = ideaStarRatingsToCheck.filter(isPresent);
    if (ideaStarRatings.length > 0) {
      const ideaStarRatingCollectionIdentifiers = ideaStarRatingCollection.map(
        ideaStarRatingItem => getIdeaStarRatingIdentifier(ideaStarRatingItem)!
      );
      const ideaStarRatingsToAdd = ideaStarRatings.filter(ideaStarRatingItem => {
        const ideaStarRatingIdentifier = getIdeaStarRatingIdentifier(ideaStarRatingItem);
        if (ideaStarRatingIdentifier == null || ideaStarRatingCollectionIdentifiers.includes(ideaStarRatingIdentifier)) {
          return false;
        }
        ideaStarRatingCollectionIdentifiers.push(ideaStarRatingIdentifier);
        return true;
      });
      return [...ideaStarRatingsToAdd, ...ideaStarRatingCollection];
    }
    return ideaStarRatingCollection;
  }

  protected convertDateFromClient(ideaStarRating: IIdeaStarRating): IIdeaStarRating {
    return Object.assign({}, ideaStarRating, {
      date: ideaStarRating.date?.isValid() ? ideaStarRating.date.toJSON() : undefined,
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
      res.body.forEach((ideaStarRating: IIdeaStarRating) => {
        ideaStarRating.date = ideaStarRating.date ? dayjs(ideaStarRating.date) : undefined;
      });
    }
    return res;
  }
}
