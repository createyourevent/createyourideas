
import { map, catchError } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { SharedChatService } from 'app/chat.service';
import { SERVER_API_URL } from 'app/app.constants';
import { Observable } from 'rxjs';
import { ChatAdapter, IChatGroupAdapter, IChatController, ParticipantResponse, Message, Group } from 'ng-chat';
import { ChatMessage, IChatMessage } from './chat-message.model';
import { HttpClient } from '@angular/common/http';

export class SocketIOAdapter extends ChatAdapter implements IChatGroupAdapter
{

  public resourceUrl = SERVER_API_URL + 'api/chatMessages';
  private socket: Socket;
  private userId: string;
  private ngChatInstance!: IChatController;


    constructor(userId: string, socket: Socket, private http: HttpClient, private sharedChatService: SharedChatService) {
        super();
        this.socket = socket;
        this.userId = userId;
        this.InitializeSocketListerners();
    }

    public setNgChat(ngChatInstance: IChatController): void {
      this.ngChatInstance = ngChatInstance;
    }

    listFriends(): Observable<ParticipantResponse[]>  {

     return this.http
            .post<ParticipantResponse[]>("https://chat.createyourevent.org/listFriends", {userId: this.userId, observe: 'response' })
            .pipe(
                map((res:ParticipantResponse[]) => res),
                catchError((error:any) => Observable.throw(error.json().error || 'Server error'))
            );
    }

    getMessageHistory(userId: any): Observable<Message[]> {
      const ngMessages: Message[] = [];
      let messages: IChatMessage[] = [];
      const response = this.sharedChatService.query({size: 2000}).pipe(map(res => {
        messages = res.body!;
        messages.forEach(element => {
          if((element.messageFrom === userId && element.messageTo === this.userId) || (element.messageFrom === this.userId && element.messageTo === userId)) {
            const m = new Message();
            m.fromId = element.messageFrom;
            m.toId = element.messageTo;
            m.message = element.message!;
            m.type = element.messageType;
            m.dateSent = element.dateSent;
            m.dateSeen = element.dateSeen;
            ngMessages.push(m);
          }
        });
        return ngMessages;
      }));
      return response;
    }


    sendMessage(message: Message): void {
      const msg = new ChatMessage();
      msg.dateSent = message.dateSent;
      msg.messageFrom = message.fromId;
      msg.messageTo = message.toId;
      msg.messageType = message.type;
      msg.message = message.message;
      this.sharedChatService.create(msg).subscribe(newInstance => {
        this.socket.emit("sendMessage", message, newInstance.body!.id);
      });

    }

    groupCreated(group: Group): void {
      console.log(group);
      // DemoAdapter.mockedParticipants.push(group);

      /*
      DemoAdapter.mockedParticipants = DemoAdapter.mockedParticipants.sort((first, second) =>
          second.displayName > first.displayName ? -1 : 1
      );
      */

      // Trigger update of friends list
      this.listFriends().subscribe(response => {
          this.onFriendsListChanged(response);
      });
  }

    public InitializeSocketListerners(): void
    {

      this.socket.on("messageReceived", (messageWrapper: any, messageId: number) => {
        // Handle the received message to ng-chat
        this.sharedChatService.find(messageId).subscribe(msg => {
          const message = msg.body;
          message!.dateSeen = new Date();
          this.sharedChatService.update(message!).subscribe(() => {
            this.onMessageReceived(messageWrapper.user, messageWrapper.message);
          }
          );
        });

      });

      this.socket.on("friendsListChanged", (usersCollection: Array<ParticipantResponse>) => {
        this.onFriendsListChanged(usersCollection.filter(x => x.participant.id !== this.userId));
      });

      this.socket.on("userLoggedOf", (id: number) => {
        this.ngChatInstance.triggerCloseChatWindow(id);
      });
    }
}
