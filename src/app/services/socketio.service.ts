import { environment } from './../../environments/environment';
import { Notification } from '../models/notification.model';
import { io } from 'socket.io-client';

export class SocketioService {

  socket;
  socketNotifications: Notification[] = [];

  constructor() {
    this.setupSocketConnection();
    this.socket.on('connect', (socket) => {
      console.log('socket.io connected from client, with id -->', this.socket.id);
    });

    const params = {
      sender: JSON.parse(localStorage.getItem('currentUser'))?._id
    };

    this.socket.emit('joinNotifications', params, () => {
    });

    this.socket.on('recieveNotifications', request => {
      this.socketNotifications.push(request);
      console.log(this.socketNotifications);
      // this.notification = this.socketNotifications.length;
    });
    }


  getSocket() {
    return this.socket;
  }

  setupSocketConnection() {
    this.socket = io(`${environment.APIEndpoint}`, {
      path: '/notification/'
    });
    this.socket.emit('my message', 'Hello there from Angular.');
  }

  actionOnRequest(button) {
  this.socket.emit('sendNotifications', {
    message: `${button} from ${JSON.parse(localStorage.getItem('currentUser')).pseudo}`,
    senderId: JSON.parse(localStorage.getItem('currentUser'))._id,
    senderPseudo: JSON.parse(localStorage.getItem('currentUser')).pseudo,
    reciever: '6131e7c597f50700160703fe' // User raphael
  }, (e) => {
    console.log(e, 'callback here');
  });
  console.log(JSON.parse(localStorage.getItem('currentUser'))._id);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
