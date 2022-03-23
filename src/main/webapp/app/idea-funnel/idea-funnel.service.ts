import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from 'app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class IdeaFunnelService {

  public resourceUrl = SERVER_API_URL + 'api/ideas';

  constructor(protected http: HttpClient) {}

  getIdeaFunnel(): Observable<HttpResponse<string>> {
    return this.http.get<string>(`${this.resourceUrl}/ideafunnel`, { observe: 'response' });
  }

  calculateProfit(): Observable<HttpResponse<string>> {
    return this.http.get<string>(`${this.resourceUrl}/calculateProfit`, { observe: 'response' });
  }
}
