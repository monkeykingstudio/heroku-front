import { environment } from './../../environments/environment';
import { Notification } from '../models/notification.model';
import { io } from 'socket.io-client';

export class SocketioService {

  params = {
    sender: JSON.parse(localStorage.getItem('currentUser'))?._id,
    senderRole: JSON.parse(localStorage.getItem('currentUser'))?.role
  };

  ////
  //// socket.io send message to specific client, and remove item from array.
  ////

  // client.on('disconnect', function (data) {
  //   var key = room.indexOf(client.id);
  //   room.splice(key, 1);
  //   io.sockets.socket(adminId).emit('query-room-list', room);
  //  });

  socket;
  public socketNotifications: Notification[] = [];

  constructor() {
    this.setupSocketConnection();

    this.socket.on('connect', (socket) => {
    });

    this.socket.emit('joinNotifications', this.params, () => {
    });

    this.socket.on('recieveNotifications', request => {
      this.socketNotifications.push(request);
      console.log(this.socketNotifications);
    });
  }

  setupSocketConnection() {
    this.socket = io(`${environment.APIEndpoint}`, {
      path: '/notification/'
    });
    this.socket.emit('connected', 'Socket connected frontend.');
  }

  sendNotification(data: Notification) {
    this.socket.emit('sendNotification', data, this.params, () => {
      console.log('USER SEND NOTIFICATION', JSON.parse(localStorage.getItem('currentUser'))._id);
    });
  }

  removeNotification(socketRef: string) {
    const notif = this.socketNotifications.findIndex(socket => socket.socketRef === socketRef);
    console.log(notif);
    this.socketNotifications.splice(notif, 1);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
