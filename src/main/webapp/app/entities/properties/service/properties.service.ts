import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProperties, getPropertiesIdentifier } from '../properties.model';

export type EntityResponseType = HttpResponse<IProperties>;
export type EntityArrayResponseType = HttpResponse<IProperties[]>;

@Injectable({ providedIn: 'root' })
export class PropertiesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/properties');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(properties: IProperties): Observable<EntityResponseType> {
    return this.http.post<IProperties>(this.resourceUrl, properties, { observe: 'response' });
  }

  update(properties: IProperties): Observable<EntityResponseType> {
    return this.http.put<IProperties>(`${this.resourceUrl}/${getPropertiesIdentifier(properties) as number}`, properties, {
      observe: 'response',
    });
  }

  partialUpdate(properties: IProperties): Observable<EntityResponseType> {
    return this.http.patch<IProperties>(`${this.resourceUrl}/${getPropertiesIdentifier(properties) as number}`, properties, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProperties>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProperties[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPropertiesToCollectionIfMissing(
    propertiesCollection: IProperties[],
    ...propertiesToCheck: (IProperties | null | undefined)[]
  ): IProperties[] {
    const properties: IProperties[] = propertiesToCheck.filter(isPresent);
    if (properties.length > 0) {
      const propertiesCollectionIdentifiers = propertiesCollection.map(propertiesItem => getPropertiesIdentifier(propertiesItem)!);
      const propertiesToAdd = properties.filter(propertiesItem => {
        const propertiesIdentifier = getPropertiesIdentifier(propertiesItem);
        if (propertiesIdentifier == null || propertiesCollectionIdentifiers.includes(propertiesIdentifier)) {
          return false;
        }
        propertiesCollectionIdentifiers.push(propertiesIdentifier);
        return true;
      });
      return [...propertiesToAdd, ...propertiesCollection];
    }
    return propertiesCollection;
  }
}
