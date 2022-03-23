const config: SocketIoConfig = { url: 'https://chat.createyourevent.org', options: {} };

import { NgChatModule } from 'ng-chat';
import { ChatComponent } from './chat.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ChatComponent],
  imports: [SharedModule, NgChatModule, SocketIoModule.forRoot(config)],
  exports: [ChatComponent]
})
export class ChatModule {}
