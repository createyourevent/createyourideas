import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from './app.constants';
import { Observable } from 'rxjs';
import { createRequestOption } from './core/request/request-util';


@Injectable({ providedIn: 'root' })
export class FinanceService {

  public resourceUrl = SERVER_API_URL + 'api/calculation';

  constructor(protected http: HttpClient) {}

  getDailyBalance(id: number, req?: any): Observable<HttpResponse<number>> {
    const options = createRequestOption(req);
    return this.http
      .get<number>(`${this.resourceUrl}/${id}/dailyBalance`, { params: options, observe: 'response' });
  }

  getProfitFromRoot(): Observable<HttpResponse<number>> {
    return this.http.get<number>(`${this.resourceUrl}/profitFromRoot`, { observe: 'response'});
  }

  getProfitFromNode(id: number, req?: any): Observable<HttpResponse<number>> {
    const options = createRequestOption(req);
    return this.http
      .get<number>(`${this.resourceUrl}/${id}/profitFromNode`, { params: options, observe: 'response' });
  }
}
