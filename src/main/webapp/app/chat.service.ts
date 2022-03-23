import { Injectable, EventEmitter } from '@angular/core';
import { SERVER_API_URL } from './app.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { Message } from 'ng-chat';
import { IChatMessage } from './chat/chat-message.model';
import { createRequestOption } from './core/request/request-util';
import { IUser } from './entities/user/user.model';


type EntityResponseType = HttpResponse<IChatMessage>;
type EntityArrayResponseType = HttpResponse<IChatMessage[]>;

@Injectable({
  providedIn: 'root'
})
export class SharedChatService {

  public resourceUrl = SERVER_API_URL + 'api/chatMessages';

  invokeEvent: Subject<any> = new Subject();
  messageSeen: Subject<Message[]> = new Subject();
  invokeChatNotification = new EventEmitter();
  subsVar!: Subscription;


  constructor(protected http: HttpClient) {}

  onLoginComplete(): void {
    this.invokeChatNotification.emit();
  }

  callClickName(user: IUser): void {
    this.invokeEvent.next(user);
  }

  sendMessageSeen(msgs: Message[]): void  {
    this.messageSeen.next(msgs);
  }

  create(message: IChatMessage): Observable<EntityResponseType> {
    return this.http.post<IChatMessage>(this.resourceUrl, message, { observe: 'response' });
  }

  update(message: IChatMessage): Observable<EntityResponseType> {
    return this.http.put<IChatMessage>(this.resourceUrl, message, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChatMessage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChatMessage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAllByMessageFrom(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IChatMessage[]>(`${this.resourceUrl}/${id}/messageFrom`, { observe: 'response' });
  }

  findOneByMessageToAndMessageFromAndMessageTypeAndDateSent(idTo: string, idFrom: string, messageType: number, dateSent: Date): Observable<EntityResponseType> {
    return this.http.get<IChatMessage>(`${this.resourceUrl}/${idTo}/${idFrom}/${messageType}/${dateSent}/byMessage`, { observe: 'response' });
  }
}
