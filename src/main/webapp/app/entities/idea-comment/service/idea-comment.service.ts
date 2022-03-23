import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIdeaComment, getIdeaCommentIdentifier } from '../idea-comment.model';

export type EntityResponseType = HttpResponse<IIdeaComment>;
export type EntityArrayResponseType = HttpResponse<IIdeaComment[]>;

@Injectable({ providedIn: 'root' })
export class IdeaCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/idea-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ideaComment: IIdeaComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaComment);
    return this.http
      .post<IIdeaComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ideaComment: IIdeaComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaComment);
    return this.http
      .put<IIdeaComment>(`${this.resourceUrl}/${getIdeaCommentIdentifier(ideaComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(ideaComment: IIdeaComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ideaComment);
    return this.http
      .patch<IIdeaComment>(`${this.resourceUrl}/${getIdeaCommentIdentifier(ideaComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIdeaComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIdeaComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIdeaCommentToCollectionIfMissing(
    ideaCommentCollection: IIdeaComment[],
    ...ideaCommentsToCheck: (IIdeaComment | null | undefined)[]
  ): IIdeaComment[] {
    const ideaComments: IIdeaComment[] = ideaCommentsToCheck.filter(isPresent);
    if (ideaComments.length > 0) {
      const ideaCommentCollectionIdentifiers = ideaCommentCollection.map(ideaCommentItem => getIdeaCommentIdentifier(ideaCommentItem)!);
      const ideaCommentsToAdd = ideaComments.filter(ideaCommentItem => {
        const ideaCommentIdentifier = getIdeaCommentIdentifier(ideaCommentItem);
        if (ideaCommentIdentifier == null || ideaCommentCollectionIdentifiers.includes(ideaCommentIdentifier)) {
          return false;
        }
        ideaCommentCollectionIdentifiers.push(ideaCommentIdentifier);
        return true;
      });
      return [...ideaCommentsToAdd, ...ideaCommentCollection];
    }
    return ideaCommentCollection;
  }

  protected convertDateFromClient(ideaComment: IIdeaComment): IIdeaComment {
    return Object.assign({}, ideaComment, {
      date: ideaComment.date?.isValid() ? ideaComment.date.toJSON() : undefined,
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
      res.body.forEach((ideaComment: IIdeaComment) => {
        ideaComment.date = ideaComment.date ? dayjs(ideaComment.date) : undefined;
      });
    }
    return res;
  }
}
