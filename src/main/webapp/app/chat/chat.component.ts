import { Component, AfterViewInit, QueryList, ViewChildren, Output, EventEmitter, OnInit } from '@angular/core';
import { SocketIOAdapter } from './SocketIOAdapter';
import { Socket } from 'ngx-socket-io';
import { GeneralService } from '../general.service';

import { IChatController, Message, User } from 'ng-chat';
import { SharedChatService } from 'app/chat.service';
import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit, OnInit {
  userId!: string;
  user!: IUser;

  @Output()
  messageSeen = new EventEmitter<Message[]>();

  public adapter!: SocketIOAdapter;

  thisFirst!: ChatComponent;

  public mentionConfig!: {};


  @ViewChildren('ngChatInstance')
  public ngChatInstances!: QueryList<IChatController>;

  private ngChatInstance!: IChatController;

  constructor(private socket: Socket,
              private generalService: GeneralService,
              private sharedChatService: SharedChatService,
              private http: HttpClient
             ) {
    this.thisFirst = this;
    this.sharedChatService.invokeEvent.subscribe((value: IUser) => {
      if(value !== null){
       this.clickName(value);
     }
    });
  }

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(usr => {
      const user = usr.body!;
      this.socket.emit('reloadPage', user.id);
      setInterval(() => {
        this.socket.emit('timestamp', user.id);
      }, 60 * 1000);
    });

    /*
    const now = dayjs();
    this.generalService.findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(now).subscribe(res => {
      const events = res.body;
      this.generalService.findShopByActiveTrueAndActiveOwnerTrue().subscribe(s => {
        const shops = s.body;

        this.mentionConfig = {
          mentions: [
              {
                  items: events,
                  triggerChar: '@',
                  labelKey: 'name',
                  maxItems:10,
                  dropUp:true,
                  mentionSelect: this.onMentionSelectAt
              },
              {
                items: shops,
                labelKey: 'name',
                triggerChar: '#',
                maxItems:10,
                dropUp:true,
                mentionSelect: this.onMentionSelectHash
            }
          ]}
        });
      });
      */
  }

  onMentionSelectAt(obj: any): any {
      return '<a href="/events/' + obj.id + '/view">' + obj.name + '</a>';
  }

  onMentionSelectHash(obj: any): any {
      return '<a href="/supplier/shop/'+ obj.id +'/overview">' + obj.name + '</a>';
  }


  ngAfterViewInit(): void {
    this.generalService.findWidthAuthorities().subscribe(usr => {
      const user = usr.body!;
        this.initializeSocketListerners(user);
        this.ngChatInstances.changes.subscribe((comps: QueryList<IChatController>) => {
          this.ngChatInstance = comps.first;
          this.adapter.setNgChat(this.ngChatInstance);
        })
    });
  }

  onMentionSelect(selection: any): string {
    return '<a href="#">' + selection.label + '</a>';
  }

  public initializeSocketListerners(user: IUser): void {
      this.adapter = new SocketIOAdapter(user.id!, this.socket, this.http, this.sharedChatService);
      this.userId = user.id!;
  }

  public clickName(user: IUser): void {
    this.generalService.findWidthAuthoritiesWidthId(user.id).subscribe(u => {
      const newUser = u.body!;
      let stat = 3;
      if(newUser.loggedIn === true) {
        stat = 0;
      }
      const chatUser: User = new User();
      chatUser.id = user.id;
      chatUser.avatar = "";
      chatUser.status = stat;
      chatUser.displayName =newUser.firstName + " " + newUser.lastName;
      this.ngChatInstance.triggerOpenChatWindow(chatUser);
    });
  }

  onMessageSeen(messageSeen: Message[]): void {
    this.sharedChatService.sendMessageSeen(messageSeen);
  }
}
