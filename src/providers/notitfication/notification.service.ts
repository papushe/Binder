import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Notification} from "../../models/notification/notification.interface";

@Injectable()
export class NotificationService {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl: string = 'http://localhost:4300';
  context: string = 'notification';
  notifications: Notification[] = [];
  notificationNumber: number = 0;

  constructor(private _http: HttpClient) {
  }

  createNotification(notification) {
    const obj = {
      from: {
        fullName: notification.from.fullName,
        id: notification.from.keyForFirebase,
        profilePic: notification.from.profilePic

      },
      to: {
        fullName: notification.to.fullName,
        id: notification.to.keyForFirebase || notification.to.id,
        profilePic: notification.from.profilePic
      },
      event: notification.event,
      content: notification.content,
      room: notification.room,
      communityName: notification.communityName,
      status: notification.status
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/create`, obj)
  }

  updateUserNotification(params) {
    const obj = {
      status: params.status,
      id: params.id
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/update`, obj)
  }

  getUserNotifications(userId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/get/${userId}`)
  }

  deleteNotification(notification) {
    const obj = {
      id: notification
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/delete`, obj)
  }
}
