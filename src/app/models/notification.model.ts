export class Notification {
  senderId: string;
  senderPseudo: string;
  message: string;
  createdAt: Date;
  type: string;
  socketRef?: string;
  subType?: string;
  readBy?: Array<object>;
  url?: string;
  id?: string;
  recieverId?: string;
}
