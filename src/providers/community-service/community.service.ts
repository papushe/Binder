import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Community} from "../../models/community/community.interface";
import {User} from "firebase/app";

/*
 Generated class for the CommunityService provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class CommunityService {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl: string = 'http://localhost:4300';

  thisCommunities = {} as Community;
  thisSelectedCommunity: Community;
  context: string = 'community';

  constructor(private _http: HttpClient) {
  }


  createCommunity(community: Community) {
    const obj = {
      communityName: community.communityName,
      communityDescription: community.communityDescription,
      managerId: community.managerId,
      managerName: community.managerName,
      type: community.type
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/create`, obj)
  }

  getCommunities(userId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/get/${userId}`)
  }

  searchCommunity(query: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/search/${query}`)
  }

  leaveCommunity(communityId: string, uid: string) {
    const obj = {
      communityId: communityId,
      uid: uid,
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/leave`, obj)
  }

  deleteCommunity(communityId: string, userId: string) {
    const obj = {
      communityId: communityId,
      uid: userId
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/delete`, obj)
  }

  joinCommunity(communityId: string, uid: string, isPrivileged: boolean) {
    const obj = {
      communityId,
      uid,
      isPrivileged
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/join`, obj)
  }

  getCommunityMembers(communityId: string) {
    const obj = {
      communityId: communityId,
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/members`, obj)
  }

  updateCommunityUserRole(communityId: string, uid: string, role: string) {
    const obj = {
      communityId: communityId,
      uid: uid,
      role: role
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/update-role`, obj)
  }

  addUserToWaitingList(communityId, userId) {
    const obj = {
      communityId: communityId,
      userId: userId
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/add-waiting-list`, obj)
  }

  removeUserFromWaitingList(communityId, userId) {
    const obj = {
      communityId: communityId,
      userId: userId
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/remove-waiting-list`, obj)
  }

}
