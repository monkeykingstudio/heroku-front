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
      console.log('socket.io connected from client, with id -->', this.socket?.id);
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

  // actionOnRequest(button) {
  // this.socket.emit('sendNotification', {
  //   message: `${button} from ${JSON.parse(localStorage.getItem('currentUser')).pseudo}`,
  //   senderId: JSON.parse(localStorage.getItem('currentUser'))._id,
  //   senderPseudo: JSON.parse(localStorage.getItem('currentUser')).pseudo,
  //   reciever: '6131e7c597f50700160703fe' // User raphael
  // }, () => {

  // });
  // console.log(JSON.parse(localStorage.getItem('currentUser'))._id);
  // }

  sendNotification(data: Notification) {
    // this.socket.emit('sendNotification', {
    //   message: `${data} from ${JSON.parse(localStorage.getItem('currentUser')).pseudo}`,
    //   senderId: JSON.parse(localStorage.getItem('currentUser'))._id,
    //   senderPseudo: JSON.parse(localStorage.getItem('currentUser')).pseudo,
    //   reciever: '6131e7c597f50700160703fe' // User raphael
    // });
    this.socket.emit('sendNotification', data, this.params, () => {
      console.log('USER SEND NOTIFICATION', JSON.parse(localStorage.getItem('currentUser'))._id);
      console.log(`sent data --> ${data}`);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
