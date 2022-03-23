import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIdeaLikeDislike, getIdeaLikeDislikeIdentifier } from '../idea-like-dislike.model';

export type EntityResponseType = HttpResponse<IIdeaLikeDislike>;
export type EntityArrayResponseType = HttpResponse<IIdeaLikeDislike[]>;

@Injectable({ providedIn: 'root' })
export class IdeaLikeDislikeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/idea-like-dislikes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ideaLikeDislike: IIdeaLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaLikeDislike);
    return this.http
      .post<IIdeaLikeDislike>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ideaLikeDislike: IIdeaLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaLikeDislike);
    return this.http
      .put<IIdeaLikeDislike>(`${this.resourceUrl}/${getIdeaLikeDislikeIdentifier(ideaLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(ideaLikeDislike: IIdeaLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaLikeDislike);
    return this.http
      .patch<IIdeaLikeDislike>(`${this.resourceUrl}/${getIdeaLikeDislikeIdentifier(ideaLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIdeaLikeDislike>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIdeaLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIdeaLikeDislikeToCollectionIfMissing(
    ideaLikeDislikeCollection: IIdeaLikeDislike[],
    ...ideaLikeDislikesToCheck: (IIdeaLikeDislike | null | undefined)[]
  ): IIdeaLikeDislike[] {
    const ideaLikeDislikes: IIdeaLikeDislike[] = ideaLikeDislikesToCheck.filter(isPresent);
    if (ideaLikeDislikes.length > 0) {
      const ideaLikeDislikeCollectionIdentifiers = ideaLikeDislikeCollection.map(
        ideaLikeDislikeItem => getIdeaLikeDislikeIdentifier(ideaLikeDislikeItem)!
      );
      const ideaLikeDislikesToAdd = ideaLikeDislikes.filter(ideaLikeDislikeItem => {
        const ideaLikeDislikeIdentifier = getIdeaLikeDislikeIdentifier(ideaLikeDislikeItem);
        if (ideaLikeDislikeIdentifier == null || ideaLikeDislikeCollectionIdentifiers.includes(ideaLikeDislikeIdentifier)) {
          return false;
        }
        ideaLikeDislikeCollectionIdentifiers.push(ideaLikeDislikeIdentifier);
        return true;
      });
      return [...ideaLikeDislikesToAdd, ...ideaLikeDislikeCollection];
    }
    return ideaLikeDislikeCollection;
  }

  protected convertDateFromClient(ideaLikeDislike: IIdeaLikeDislike): IIdeaLikeDislike {
    return Object.assign({}, ideaLikeDislike, {
      date: ideaLikeDislike.date?.isValid() ? ideaLikeDislike.date.toJSON() : undefined,
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
      res.body.forEach((ideaLikeDislike: IIdeaLikeDislike) => {
        ideaLikeDislike.date = ideaLikeDislike.date ? dayjs(ideaLikeDislike.date) : undefined;
      });
    }
    return res;
  }
}
