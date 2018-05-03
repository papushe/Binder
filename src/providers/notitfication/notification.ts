import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the NotitficationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl:string = 'http://localhost:4300';
  context: string = 'notification';


  constructor(public http: HttpClient) {
    console.log('Hello NotitficationProvider Provider');
  }

  createNotification(community: Community) {
    const obj = {
      communityName: community.communityName,
      communityDescription: community.communityDescription,
      managerId: community.managerId,
      type: community.type
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/create`, obj)
  }

  getUserNotifications(userId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/get/${userId}`)
  }
}
