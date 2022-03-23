import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIdea, getIdeaIdentifier } from '../idea.model';

export type EntityResponseType = HttpResponse<IIdea>;
export type EntityArrayResponseType = HttpResponse<IIdea[]>;

@Injectable({ providedIn: 'root' })
export class IdeaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ideas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(idea: IIdea): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(idea);
    return this.http
      .post<IIdea>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(idea: IIdea): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(idea);
    return this.http
      .put<IIdea>(`${this.resourceUrl}/${getIdeaIdentifier(idea) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(idea: IIdea): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(idea);
    return this.http
      .patch<IIdea>(`${this.resourceUrl}/${getIdeaIdentifier(idea) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIdea>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIdea[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIdeaToCollectionIfMissing(ideaCollection: IIdea[], ...ideasToCheck: (IIdea | null | undefined)[]): IIdea[] {
    const ideas: IIdea[] = ideasToCheck.filter(isPresent);
    if (ideas.length > 0) {
      const ideaCollectionIdentifiers = ideaCollection.map(ideaItem => getIdeaIdentifier(ideaItem)!);
      const ideasToAdd = ideas.filter(ideaItem => {
        const ideaIdentifier = getIdeaIdentifier(ideaItem);
        if (ideaIdentifier == null || ideaCollectionIdentifiers.includes(ideaIdentifier)) {
          return false;
        }
        ideaCollectionIdentifiers.push(ideaIdentifier);
        return true;
      });
      return [...ideasToAdd, ...ideaCollection];
    }
    return ideaCollection;
  }

  protected convertDateFromClient(idea: IIdea): IIdea {
    return Object.assign({}, idea, {
      date: idea.date?.isValid() ? idea.date.toJSON() : undefined,
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
      res.body.forEach((idea: IIdea) => {
        idea.date = idea.date ? dayjs(idea.date) : undefined;
      });
    }
    return res;
  }
}
