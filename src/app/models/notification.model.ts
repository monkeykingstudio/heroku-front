export class Notification {
  senderId: string;
  senderPseudo: string;
  message: string;
  createdAt: Date;
  type: string;
  readBy?: Array<object>;
  url?: string;
  id?: string;
}
