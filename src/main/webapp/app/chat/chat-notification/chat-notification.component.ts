import { Component } from "@angular/core";
import { SharedChatService } from "app/chat.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { IChatMessage } from "../chat-message.model";


@Component({
  selector: 'jhi-chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss']
})
export class ChatNotificationComponent {

  user!: IUser;
  isShowUsers = true;
  messages: IChatMessage[] = [];
  users: IUser[] = [];
  usersAndCount: any[] = [];
  totalMessages  = 0;

  constructor(private sharedChatService: SharedChatService,
              private generalService: GeneralService){
                if (this.sharedChatService.subsVar === undefined) {
                  this.sharedChatService.subsVar = this.sharedChatService.
                  invokeChatNotification.subscribe(() => {
                    this.loadMessages();
                  });
                }
              }


  loadMessages(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;
      this.generalService.findAllChatMessagesByMessageToAndDateSeenIsNull(this.user.id).subscribe(m => {
        this.messages = m.body!;
        this.totalMessages = this.messages.length;
        });
      });
  }

  openChatWindow(user: IUser): void {
    this.sharedChatService.callClickName(user);
    const uM = this.usersAndCount.find(element => element.user.id === user.id);
    this.totalMessages -= uM.count;
    this.usersAndCount = this.usersAndCount.filter(element => element.user.id !== user.id);
    this.messages.forEach(element => {
      element.dateSeen = new Date();
      this.sharedChatService.update(element).subscribe();
    });
    if(this.users.length > 0) {
        this.isShowUsers = !this.isShowUsers;
    }
  }

  openChatNames(): void {
      this.messages.forEach(message => {
      this.generalService.findWidthAuthoritiesWidthId(message.messageFrom!).subscribe(user => {
        const found = this.users.find(element => element.id === message.messageFrom)
        if(!found) {
          this.users.push(user.body!);
          const messagesUser = this.messages.filter(element => element.messageFrom === user.body!.id);
          this.usersAndCount.push({user: user.body!, count: messagesUser.length});
        }
      });
    });

    if(this.usersAndCount.length > 0) {
      this.isShowUsers = !this.isShowUsers;
    }
  }
}
