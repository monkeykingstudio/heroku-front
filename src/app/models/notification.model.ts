export class Notification {
  id: string;
  senderId: string;
  senderPseudo: string;
  message: string;
  createdAt: Date;
  readBy: Array<object>;
  type: string;
  url?: string;
}
