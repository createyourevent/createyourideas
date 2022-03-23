import { IProperties } from './entities/properties/properties.model';
import { IIdeaComment } from './entities/idea-comment/idea-comment.model';
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as dayjs from "dayjs";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SERVER_API_URL } from "./app.constants";
import { IChatMessage } from "./chat/chat-message.model";
import { DATE_TIME_FORMAT, DATE_TIME_FORMAT_OFFSET } from "./config/input.constants";
import { createRequestOption } from "./core/request/request-util";
import { IBalance } from "./entities/balance/balance.model";
import { IEmployee } from "./entities/employee/employee.model";
import { IIdeaLikeDislike } from "./entities/idea-like-dislike/idea-like-dislike.model";
import { IIdeaStarRating } from "./entities/idea-star-rating/idea-star-rating.model";
import { IIdea } from "./entities/idea/idea.model";
import { IIncome } from "./entities/income/income.model";
import { IOutgoings } from "./entities/outgoings/outgoings.model";
import { IPoint } from "./entities/point/point.model";
import { IUserPointAssociation } from "./entities/user-point-association/user-point-association.model";
import { IUser } from "./entities/user/user.model";
import { IWorksheet } from "./entities/worksheet/worksheet.model";


@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  public resourceUrl = SERVER_API_URL + 'api/users';
  public resourceUrl_employees = SERVER_API_URL + 'api/employees';
  public resourceUrl_incomes = SERVER_API_URL + 'api/incomes';
  public resourceUrl_ideas = SERVER_API_URL + 'api/ideas';
  public resourceUrl_outgoings = SERVER_API_URL + 'api/outgoings';
  public resourceUrl_balances = SERVER_API_URL + 'api/balances';
  public resourceUrl_worksheets = SERVER_API_URL + 'api/worksheets';
  public resourceUrl_cye = SERVER_API_URL + 'api/users_createyourevent';
  public resourceUrl_datatrans = SERVER_API_URL + 'api/datatrans';
  public resourceUrl_points = SERVER_API_URL + 'api/points';
  public resourceUrl_pointsUsers = SERVER_API_URL + 'api/user-point-associations';
  public resourceUrl_chat = SERVER_API_URL + 'api/chatMessages';
  public resourceUrl_idea_like_dislikes = SERVER_API_URL + 'api/idea-like-dislikes';
  public resourceUrl_idea_star_rating = SERVER_API_URL + 'api/idea-star-ratings';
  public resourceUrl_keycloak = SERVER_API_URL + 'api/keycloak';
  public resourceUrl_idea_comments = SERVER_API_URL + 'api/idea-comments';
  public resourceUrl_properties = SERVER_API_URL + 'api/properties';

  constructor(protected http: HttpClient) {}


  findWidthAuthorities(): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.resourceUrl_cye}/loggedIn`, { observe: 'response' });
  }

  findWidthAuthoritiesWidthId(id: string): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.resourceUrl}/${id}/byId`, { observe: 'response' });
  }

  // -------------------------------------------------------------------------------------------------------------

  createIncome(income: IIncome): Observable<HttpResponse<IIncome>>   {
    const copy = this.convertIncomeDateFromClient(income);
    copy.id = null;
    return this.http
      .post<IIncome>(this.resourceUrl_incomes, copy, { observe: 'response' });
  }


  createOutgoing(outgoing: IOutgoings): Observable<HttpResponse<IOutgoings>>   {
    const copy = this.convertOutgoingsDateFromClient(outgoing);
    copy.id = null;
    return this.http
      .post<IOutgoings>(this.resourceUrl_outgoings, copy, { observe: 'response' });
  }

  createWorksheet(worksheet: IWorksheet): Observable<HttpResponse<IWorksheet>>   {
    const copy = this.convertWorksheetsDateFromClient(worksheet);
    copy.id = null;
    return this.http
      .post<IWorksheet>(this.resourceUrl_worksheets, copy, { observe: 'response' });
  }



  // --------------------------------------------------------------------------------

  queryIdeasByActiveTrue(req?: any): Observable<HttpResponse<IIdea[]>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea[]>(`${this.resourceUrl_ideas}/activeTrue`, { params: options, observe: 'response' });
  }

  queryIdeasByActiveFalse(req?: any): Observable<HttpResponse<IIdea[]>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea[]>(`${this.resourceUrl_ideas}/activeFalse`, { params: options, observe: 'response' });
  }

  queryIdeasByUserIsLoggedIn(req?: any): Observable<HttpResponse<IIdea[]>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea[]>(`${this.resourceUrl_ideas}/activeUser`, { params: options, observe: 'response' });
  }

  queryIdeasByActiveTrueEagerAll(req?: any): Observable<HttpResponse<IIdea[]>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea[]>(`${this.resourceUrl_ideas}/activeTrue/eagerAll`, { params: options, observe: 'response' });
  }

  queryIdeasByActiveTrueEagerDonations(id: number, req?: any): Observable<HttpResponse<IIdea>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea>(`${this.resourceUrl_ideas}/activeTrue/eagerDonations/${id}`, { params: options, observe: 'response' });
  }

  queryIdeasByActiveTrueEagerEmployees(id: number, req?: any): Observable<HttpResponse<IIdea>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea>(`${this.resourceUrl_ideas}/activeTrue/eagerEmployees/${id}`, { params: options, observe: 'response' });
  }

  queryIdeasByActiveTrueEagerEmployeesApplications(id: number, req?: any): Observable<HttpResponse<IIdea>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea>(`${this.resourceUrl_ideas}/activeTrue/eagerEmployeesApplications/${id}`, { params: options, observe: 'response' });
  }

  queryIdeaByActiveTrueEagerAll(id:number, req?: any): Observable<HttpResponse<IIdea>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea>(`${this.resourceUrl_ideas}/activeTrue/eagerAll/${id}`, { params: options, observe: 'response' });
  }

  //--------------------------------------------------------------------------------------------------------------------------------

  queryEmployeeByUserId(id:string, req?: any): Observable<HttpResponse<IEmployee>> {
    const options = createRequestOption(req);
    return this.http.get<IEmployee>(`${this.resourceUrl_employees}/${id}/byUserId`, { params: options, observe: 'response' });
  }

  // -------------------------------------------------------------------------------------------------------------------------------

  queryIdeaById(id: number, req?: any): Observable<HttpResponse<IIdea>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea>(`${this.resourceUrl_ideas}/${id}/byId`, { params: options, observe: 'response' });
  }

  queryById(id: number, req?: any): Observable<HttpResponse<IIdea[]>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea[]>(`${this.resourceUrl_ideas}/${id}/allById`, { params: options, observe: 'response' });
  }

  queryByUser(req?: any): Observable<HttpResponse<IIdea[]>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea[]>(`${this.resourceUrl_ideas}/user`, { params: options, observe: 'response' });
  }

  queryByNodeId(id: number, req?: any): Observable<HttpResponse<IIdea>> {
    const options = createRequestOption(req);
    return this.http.get<IIdea>(`${this.resourceUrl_ideas}/${id}/allByNodeId`, { params: options, observe: 'response' });
  }

  queryOutgoingByIdeaId(id: number, req?: any): Observable<HttpResponse<IOutgoings[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<IOutgoings[]>(`${this.resourceUrl_outgoings}/${id}/allByIdeaId`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<IOutgoings[]>) => this.convertOutgoingDateArrayFromServer(res)));
  }

  queryIncomeByIdeaId(id: number, req?: any): Observable<HttpResponse<IIncome[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<IIncome[]>(`${this.resourceUrl_incomes}/${id}/allByIdeaId`, { params: options, observe: 'response' })
      .pipe(map((res:HttpResponse<IIncome[]>) => this.convertIncomeDateArrayFromServer(res)));
  }

  queryWorksheetByIdeaId(id: number, req?: any): Observable<HttpResponse<IWorksheet[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<IWorksheet[]>(`${this.resourceUrl_worksheets}/${id}/allByIdeaId`, { params: options, observe: 'response' })
      .pipe(map((res:HttpResponse<IWorksheet[]>) => this.convertWorksheetDateArrayFromServer(res)));
  }

  queryBalanceByIdeaId(ideaId: number, req?: any): Observable<HttpResponse<IBalance[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<IBalance[]>(`${this.resourceUrl_balances}/queryByIdeaId/${ideaId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<IBalance[]>) => this.convertBalanceDateArrayFromServer(res)));
  }




  findAllIncomeByIdeaIdAndDate(id: number, date: dayjs.Dayjs): Observable<HttpResponse<IIncome[]>> {
    const dSF = dayjs(date).format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(dSF));

    return this.http.get<IIncome[]>(`${this.resourceUrl_incomes}/${id}/date`, {
      params: params,
      observe: 'response'
    });
  }

  findAllOutgoingByIdeaIdAndDate(id: number, date: dayjs.Dayjs): Observable<HttpResponse<IOutgoings[]>> {
    const dSF = dayjs(date).format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(dSF));

    return this.http.get<IOutgoings[]>(`${this.resourceUrl_outgoings}/${id}/date`, {
      params: params,
      observe: 'response'
    });
  }

  findAllWorksheetByIdeaIdAndDate(id: number, date: dayjs.Dayjs): Observable<HttpResponse<IWorksheet[]>> {
    const dSF = dayjs(date).format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(dSF));

    return this.http.get<IWorksheet[]>(`${this.resourceUrl_worksheets}/${id}/date`, {
      params: params,
      observe: 'response'
    });
  }



  protected convertIncomeDateArrayFromServer(res: HttpResponse<IIncome[]>): HttpResponse<IIncome[]> {
    if (res.body) {
      res.body.forEach((income: IIncome) => {
        income.date = income.date != null ? dayjs(income.date) : null;
      });
    }
    return res;
  }

  protected convertOutgoingDateArrayFromServer(res: HttpResponse<IOutgoings[]>): HttpResponse<IOutgoings[]> {
    if (res.body) {
      res.body.forEach((outgoings: IOutgoings) => {
        outgoings.date = outgoings.date != null ? dayjs(outgoings.date) : null;
      });
    }
    return res;
  }

  protected convertWorksheetDateArrayFromServer(res: HttpResponse<IWorksheet[]>): HttpResponse<IWorksheet[]> {
    if (res.body) {
      res.body.forEach((worksheet: IWorksheet) => {
        worksheet.dateStart = worksheet.dateStart != null ? dayjs(worksheet.dateStart) : null;
        worksheet.dateEnd = worksheet.dateEnd != null ? dayjs(worksheet.dateEnd) : null;
      });
    }
    return res;
  }

  protected convertBalanceDateArrayFromServer(res: HttpResponse<IBalance[]>): HttpResponse<IBalance[]> {
    if (res.body) {
      res.body.forEach((balance: IBalance) => {
        balance.date = balance.date != null ? dayjs(balance.date) : null;
      });
    }
    return res;
  }

  protected convertIncomeDateFromClient(income: IIncome): IIncome {
    return Object.assign({}, income, {
      date: dayjs(income.date)?.isValid() ? dayjs(income.date).format(DATE_TIME_FORMAT_OFFSET) : undefined,
    });
  }

  protected convertOutgoingsDateFromClient(outgoings: IOutgoings): IOutgoings {
    return Object.assign({}, outgoings, {
      date: dayjs(outgoings.date)?.isValid() ? dayjs(outgoings.date).format(DATE_TIME_FORMAT_OFFSET) : undefined,
    });
  }

  protected convertWorksheetsDateFromClient(worksheets: IWorksheet): IWorksheet {
    return Object.assign({}, worksheets, {
      dateStart: dayjs(worksheets.dateStart)?.isValid() ? dayjs(worksheets.dateStart).format(DATE_TIME_FORMAT_OFFSET) : undefined,
      dateEnd: dayjs(worksheets.dateEnd)?.isValid() ? dayjs(worksheets.dateEnd).format(DATE_TIME_FORMAT_OFFSET) : undefined,
    });
  }

  getTransactionIdFromDatatrans(amount: number, type: string, id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl_datatrans}/${amount}/${type}/${id}`, { observe: 'response' });
  }

  getStatusFromTransactionIdFromDatatrans(id: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl_datatrans}/txId/${id}`, { observe: 'response' });
  }

  updateAddressAndPhoneAndIBanAndBanknameAndBankaddressFromUser(userId: string, address: string, phone: string, iban: string, bankname: string, bankaddress: string): Observable<void> {
    //let params = new HttpParams().set('address',address).set('phone', phone);
    return this.http.put<void>(`${this.resourceUrl}/${userId}/update/${encodeURIComponent(address)}/${encodeURIComponent(phone)}/${encodeURIComponent(iban)}/${encodeURIComponent(bankname)}/${encodeURIComponent(bankaddress)}`, { observe: 'response' });
  }


  getDailyBalance(id: number): Observable<HttpResponse<IBalance>> {
    return this.http.get<IBalance>(`${this.resourceUrl}/calc/dailyBalance/${id}`, { observe: 'response' });
  }

  calcBalances(): Observable<HttpResponse<void>> {
    return this.http.get<void>(`${this.resourceUrl_ideas}/calcBalances`, { observe: 'response' });
  }


  findPointsByKey(key: String): Observable<HttpResponse<IPoint>> {
    return this.http.get<IPoint>(`${this.resourceUrl_points}/key/${key}`, { observe: 'response' });
  }

  updateUserLoggedInAndPoints(userId: string, loggedIn: boolean, points: number): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/${userId}/${loggedIn}/${points}`, { observe: 'response' });
  }

  updatePoints(userId: string, loggedIn: boolean, points: number): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/${userId}/${loggedIn}/${points}`, { observe: 'response' });
  }

  findUserPointAssociationByUsersIdAndPointkey(userId: string, key: string): Observable<HttpResponse<IUserPointAssociation[]>> {
    return this.http.get<IUserPointAssociation[]>(`${this.resourceUrl_pointsUsers}/${userId}/${key}/findByUsersIdAndPointkey`, {
      observe: 'response'
    });
  }

  findAllChatMessagesByMessageToAndDateSeenIsNull(userToId: string): Observable<HttpResponse<IChatMessage[]>> {
    return this.http.get<IChatMessage[]>(`${this.resourceUrl_chat}/${userToId}/messageToAndDateSeenIsNull`, { observe: 'response' });
  }

  findIdeaLikeDislikeByIdeaIdAndUserId(ideaId: number, userId: string): Observable<HttpResponse<IIdeaLikeDislike[]>> {
    return this.http.get<IIdeaLikeDislike[]>(
      `${this.resourceUrl_idea_like_dislikes}/${ideaId}/${userId}/getIdeaLikeDislikeByIdeaIdAndUserId`,
      {
        observe: 'response'
      }
    );
  }

  findIdeaLikeDislikeByIdeaId(ideaId: number): Observable<HttpResponse<IIdeaLikeDislike[]>> {
    return this.http.get<IIdeaLikeDislike[]>(
      `${this.resourceUrl_idea_like_dislikes}/${ideaId}/getIdeaLikeDislikeByIdeaId`,
      {
        observe: 'response'
      }
    );
  }

  findIdeaStarRatingsByIdeaId(ideaId: number): Observable<HttpResponse<IIdeaStarRating[]>> {
    return this.http.get<IIdeaStarRating[]>(`${this.resourceUrl_idea_star_rating}/${ideaId}/findIdeaStarRatingsByIdeaId`, {
      observe: 'response'
    });
  }

  findIdeaStarRatingsByIdeaIdAndUserId(ideaId: number, userId: string): Observable<HttpResponse<IIdeaStarRating>> {
    return this.http.get<IIdeaStarRating>(`${this.resourceUrl_idea_star_rating}/${ideaId}/${userId}/findShopStarRatingsByShopIdAndUserId`, {
      observe: 'response'
    });
  }

  updatePointsKeycloak(points: number, userId: string): Observable<void> {
    return this.http
      .put<void>(`${this.resourceUrl_keycloak}/${userId}/${points}`, { observe: 'response' })
  }

  getPointsFromUser(userId: string): Observable<HttpResponse<number>> {
    return this.http
      .get<number>(`${this.resourceUrl_keycloak}/${userId}`, { observe: 'response' })
  }

  findIdeaCommentsByIdeaId(ideaId: number): Observable<HttpResponse<IIdeaComment[]>> {
    return this.http.get<IIdeaComment[]>(`${this.resourceUrl_idea_comments}/${ideaId}/findAllByIdeaId`, {
      observe: 'response'
    });
  }

  getPropertiesByKey(key: string): Observable<HttpResponse<IProperties>> {
    return this.http
      .get<IProperties>(`${this.resourceUrl_properties}/${key}/byKey`, { observe: 'response' })
  }

}
