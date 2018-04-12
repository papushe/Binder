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

  baseUrl: string = 'https://appbinder.herokuapp.com';
  // baseUrl:string = 'http://localhost:4300';

  thisCommunity = {} as Community;

  constructor(private _http: HttpClient) {
  }


  createCommunity(community: Community) {
    const obj = {
      communityName: community.communityName,
      communityDescription: community.communityDescription,
      managerId: community.managerId,
      type: community.type
    };
    return this._http
      .post(`${this.baseUrl}/createNewCommunity/`, obj)
  }

  getCommunities(user: User) {
    return this._http
      .get(`${this.baseUrl}/getCommunities/${user.uid}`)

  }

  searchCommunity(type: string) {
    return this._http
      .get(`${this.baseUrl}/searchCommunity/${type}`)
  }

  leaveCommunity(communityId: string, uid: string) {
    const obj = {
      communityId: communityId,
      uid: uid,
    };
    return this._http
      .post(`${this.baseUrl}/leaveCommunity/`, obj)
  }

  deleteCommunity(communityId: string, userId: string) {
    const obj = {
      communityId: communityId,
      uid: userId
    };
    return this._http
      .post(`${this.baseUrl}/deleteCommunity/`, obj)
  }

  joinCommunity(communityId: string, uid: string) {
    const obj = {
      communityId: communityId,
      uid: uid,
    };
    return this._http
      .post(`${this.baseUrl}/joinCommunity/`, obj)
  }

  getCommunityMembers(communityId: string) {
    const obj = {
      communityId: communityId,
    };
    return this._http
      .post(`${this.baseUrl}/getCommunityMembers/`, obj)
  }


}
