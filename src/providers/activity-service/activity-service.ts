import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Activity} from '../../models/activity/activity.interface';

/*
  Generated class for the ActivityService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ActivityService {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl: string = 'http://localhost:4300';
  context: string = 'activity';

  constructor(public _http: HttpClient,) {

  }

  createActivity(activity: Activity) {
    const activityObj = {
      activityName: activity.activity_name,
      activityDescription: activity.activity_description,
      activity_date: activity.activity_date,
      provider: activity.provider,
      consumer: activity.consumer,
      communityId: activity.community_id,
      notes: activity.notes,
      type: activity.type,
      source: activity.source,
      destination: activity.destination
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/create`, activityObj)
  }

  deleteActivity(activityId: string, communityId: string) {
    const activityIdObj = {
      activityId: activityId,
      communityId: communityId
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/delete/`, activityIdObj)
  }


  getActivitiesByCommunityId(communityId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/community/get/${communityId}`)
  }

  getActivitiesByUserId(userId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/user/get/${userId}`)
  }

  updateActivity(activity: Activity) {
    const activityObj = {
      activityId: activity._id,
      activityName: activity.activity_name,
      activityDescription: activity.activity_description,
      activity_date: activity.activity_date,
      provider: activity.provider,
      consumer: activity.consumer,
      communityId: activity.community_id,
      notes: activity.notes,
      type: activity.type,
      source: activity.source,
      destination: activity.destination
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/update`, activityObj)
  }

}
