import { Injectable } from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {Account} from "../../models/account/account.interface";
import {LoginResponse} from "../../models/login/login-response.interface";
import {AngularFireDatabase} from "angularfire2/database";
import {User} from 'firebase/app'
import {HttpClient} from "@angular/common/http";

@Injectable()
export class UserService {

  // baseUrl:string = 'https://appbinder.herokuapp.com';
  baseUrl:string = 'http://localhost:4300';

  constructor(private _http: HttpClient,
              private database: AngularFireDatabase,
              private auth: AngularFireAuth) {

  }

  getAuthenticatedUser(){
    return this.auth.authState;
  }

  async createUserWithEmailAndPassword(account:Account){
    try {
      return <LoginResponse> {
        result: await this.auth.auth.createUserWithEmailAndPassword(account.email,account.password)
      }
    }catch (e){
      return <LoginResponse> {
        error: e
      }
    }
  }

  async signInWithEmailAndPassword(account:Account){
    try{
      return <LoginResponse> {
        result: await this.auth.auth.signInWithEmailAndPassword(account.email,account.password)
      }
    }catch (e){
      return <LoginResponse> {
        error: e
      }
    }
  }

  saveProfile(profile){
    const obj = {
      firstName:profile.firstName,
      lastName:profile.lastName,
      location:profile.location,
      phoneNumber:profile.phoneNumber,
      description:profile.description,
      dateOfBirth:profile.dateOfBirth,
      type:profile.type,
      skills:profile.skills,
      email:profile.email,
      keyForFirebase:profile.keyForFirebase
    };
      return this._http
        .post(`${this.baseUrl}/createNewUser/`, obj)
  }

  getProfile(user:User){
    return this._http
      .get(`${this.baseUrl}/getProfile/${user.uid}`)

  }

  updateProfile(profile){
    const obj = {
      firstName:profile.firstName,
      lastName:profile.lastName,
      location:profile.location,
      phoneNumber:profile.phoneNumber,
      description:profile.description,
      dateOfBirth:profile.dateOfBirth,
      type:profile.type,
      skills:profile.skills,
      email:profile.email,
      keyForFirebase:profile.keyForFirebase
    };
    return this._http
      .post(`${this.baseUrl}/updateProfile/`, obj)
  }


  private extractData(response: Response) {
    return response;
  }
}
