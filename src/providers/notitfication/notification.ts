import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Notification} from "../../models/notification/notification.interface";

/*
  Generated class for the NotificationService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationService {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl: string = 'http://localhost:4300';
  context: string = 'notification';
  notifications: Notification[] = [];

  constructor(public _http: HttpClient) {
  }

  createNotification(notification) {
    const obj = {
      from: {
        name: notification.from.fullName,
        id: notification.from.keyForFirebase
      },
      to: {
        name: notification.to.fullName,
        id: notification.to.keyForFirebase
      },
      event: notification.event,
      content: notification.content,
      room: notification.room,
      status: notification.status
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/create`, obj)
  }

  getUserNotifications(userId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/get/${userId}`)
  }
}
