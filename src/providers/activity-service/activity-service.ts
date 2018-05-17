import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Activity} from '../../models/activity/activity.interface';

@Injectable()
export class ActivityService {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl: string = 'http://localhost:4300';
  context: string = 'activity';

  constructor(public _http: HttpClient) {

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

  deleteActivity(activityId: string) {
    const activityIdObj = {
      activityId: activityId,
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/delete`, activityIdObj)
  }


  getActivitiesByCommunityId(communityId: string, filters: [string]) {
    const obj = {
      communityId: communityId,
      filters: filters
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/community`, obj);
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

  claim(activityId: string, fullName: string, userId: string) {
    const activityIdObj = {
      activityId: activityId,
      fullName: fullName,
      userId: userId
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/claim`, activityIdObj)
  }

  approve(activityId: string) {
    const activityIdObj = {
      activityId: activityId
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/approve`, activityIdObj)
  }

}
