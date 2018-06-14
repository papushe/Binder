import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Notification} from "../../models/notification/notification.interface";
import {SharedService} from "../shared/shared.service";

@Injectable()
export class NotificationService {

  baseUrl: string = '';

  context: string = 'notification';
  notifications: Notification[] = [];
  notificationNumber: number = 0;

  constructor(private _http: HttpClient,
              private sharedService: SharedService) {
    this.baseUrl = this.sharedService.baseUrl;
  }

  createNotification(notification) {
    const obj = {
      from: {
        fullName: notification.from.fullName,
        keyForFirebase: notification.from.keyForFirebase,
        profilePic: notification.from.profilePic

      },
      to: {
        fullName: notification.to.fullName,
        keyForFirebase: notification.to.keyForFirebase || notification.to.keyForFirebase,
        profilePic: notification.from.profilePic
      },
      event: notification.event,
      content: notification.content,
      room: notification.room,
      communityName: notification.communityName,
      status: notification.status,
      activity: notification.activity,
      user: notification.user,
      isAddToCalender: notification.isAddToCalender
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/create`, obj)
  }

  updateUserNotification(params, from) {
    let obj = {};
    if (from === 'notificationPage') {
      obj = {
        status: params.status,
        keyForFirebase: params.keyForFirebase,
        from: 'notificationPage'
      };
    } else {
      obj = {
        isAddToCalender: true,
        keyForFirebase: params._id,
        from: 'tabsPage'
      };
    }

    return this._http
      .post(`${this.baseUrl}/${this.context}/update`, obj)
  }

  getUserNotifications(userId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/get/${userId}`)
  }

  deleteNotification(notification) {
    const obj = {
      keyForFirebase: notification
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/delete`, obj)
  }

  deleteAllNotification(notification) {
    const obj = {
      keyForFirebase: notification
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/delete-all`, obj)
  }
}
