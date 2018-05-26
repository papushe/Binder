import {HttpClient} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Activity} from '../../models/activity/activity.interface';
import {SharedService} from "../shared/shared.service";

@Injectable()
export class ActivityService {


  baseUrl: string = '';
  context: string = 'activity';
  thisUserActivities: Activity[];

  constructor(private _http: HttpClient,
              private sharedService: SharedService) {
    this.baseUrl = this.sharedService.baseUrl;
  }

  getActivities(auth) {
    this.getActivitiesByUserId(auth.uid)
      .subscribe((activities) => {
        this.thisUserActivities = <Activity[]>activities;
      }, (err) => {
        console.log(err);
      }, () => {
        console.log('done');
      })
  };

  mapAs(type) {
    let activities: Activity[] = [];

    this.thisUserActivities.map((activity) => {
      activity.status.value === type ? activities.push(activity) : ''
    });
    return activities
  }


  createActivity(activity: Activity) {
    const activityObj = {
      activityName: activity.activity_name,
      activityDescription: activity.activity_description,
      activity_date: activity.activity_date,
      recurring: activity.recurring,
      provider: activity.provider,
      consumer: activity.consumer,
      communityId: activity.community_id,
      notes: activity.notes,
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
      recurring: activity.recurring,
      activity_date: activity.activity_date,
      provider: activity.provider,
      consumer: activity.consumer,
      communityId: activity.community_id,
      notes: activity.notes,
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

  decline(activityId: string) {
    const activityIdObj = {
      activityId: activityId
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/decline`, activityIdObj)
  }

  finish(activityId: string) {
    const activityIdObj = {
      activityId: activityId
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/finish`, activityIdObj)
  }

  cancel(activityId: string) {
    const activityIdObj = {
      activityId: activityId
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/cancel`, activityIdObj)
  }
}
