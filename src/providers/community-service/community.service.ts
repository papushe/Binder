import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Community} from "../../models/community/community.interface";

/*
  Generated class for the CommunityService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommunityService {

  // baseUrl:string = 'https://appbinder.herokuapp.com';
  baseUrl:string = 'http://localhost:4300';


  constructor(private _http: HttpClient) {
    console.log('Hello CommunityService Provider');
  }


  createCommunity(community: Community){
    const obj = {
      communityName: community.communityName,
      communityDescription: community.communityDescription,
      managerId: community.managerId,
      type: community.type
    };
    return this._http
      .post(`${this.baseUrl}/createNewCommunity/`, obj)
  }


}
