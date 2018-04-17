import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Activity} from '../../models/activity/activity.interface';
import {Community} from "../../models/community/community.interface";

/*
  Generated class for the ActivityService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ActivityService {

  baseUrl: string = 'https://appbinder.herokuapp.com';
  // baseUrl: string = 'http://localhost:4300';

  constructor(public _http: HttpClient,) {

  }

  createActivity(activity: Activity) {
    const activityObj = {
      activityName: activity.activity_name,
      activityDescription: activity.activity_description,
      providerId: activity.provider_id,
      consumerId: activity.consumer_id,
      communityId: activity.community_id,
      notes: activity.notes,
      type: activity.type,
      source: activity.source,
      destination: activity.destination
    };
    return this._http
      .post(`${this.baseUrl}/createNewActivity/`, activityObj)
  }

  deleteActivity(activityId: string) {
    const activityIdObj = {
      activityId: activityId
    };
    return this._http
      .post(`${this.baseUrl}/deleteActivityById/`, activityIdObj)
  }


  getActivitiesByCommunityId(community: Community) {
    return this._http
      .get(`${this.baseUrl}/getActivitiesByCommunityId/${community._id}`)
  }


}
