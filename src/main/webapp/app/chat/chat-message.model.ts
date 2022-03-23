export interface IChatMessage {
  id?: number;
  messageType?: number;
  messageFrom?: string;
  messageTo?: string;
  message?: string;
  dateSent?: Date;
  dateSeen?: Date;
}

export class ChatMessage implements IChatMessage {

  constructor(public id?: number,
              public messageType?: number,
              public messageFrom?: string,
              public messageTo?: string,
              public message?: string,
              public dateSent?: Date,
              public dateSeen?: Date) {}
}
