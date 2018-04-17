import {Injectable} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {Account} from "../../models/account/account.interface";
import {LoginResponse} from "../../models/login/login-response.interface";
import {AngularFireDatabase} from "angularfire2/database";
import {User} from 'firebase/app'
import {HttpClient} from "@angular/common/http";

import * as firebase from 'firebase';
import {ToastController} from "ionic-angular";
import {Profile} from "../../models/profile/profile.interface";
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class UserService {

  baseUrl: string = 'https://appbinder.herokuapp.com';
  // baseUrl: string = 'http://localhost:4300';

  thisProfile = {} as Profile;
  thisAuthenticatedUser: User;
  thisAuthenticatedUser$: Subscription;
  thisHasProfile: boolean = false;
  thisFromCommunityDetails: boolean;

  constructor(private _http: HttpClient,
              private database: AngularFireDatabase,
              private auth: AngularFireAuth,
              private toast: ToastController) {

  }

  getAuthenticatedUser() {
    return this.auth.authState;
  }

  async createUserWithEmailAndPassword(account: Account) {
    try {
      return <LoginResponse> {
        result: await this.auth.auth.createUserWithEmailAndPassword(account.email, account.password)
      }
    } catch (e) {
      return <LoginResponse> {
        error: e
      }
    }
  }

  async signInWithEmailAndPassword(account: Account) {
    try {
      return <LoginResponse> {
        result: await this.auth.auth.signInWithEmailAndPassword(account.email, account.password)
      }
    } catch (e) {
      return <LoginResponse> {
        error: e
      }
    }
  }

  signOut() {
    this.auth.auth.signOut();
  }


  saveProfile(profile) {
    const obj = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      location: profile.location,
      phoneNumber: profile.phoneNumber,
      description: profile.description,
      dateOfBirth: profile.dateOfBirth,
      type: profile.type,
      skills: profile.skills,
      email: profile.email,
      keyForFirebase: profile.keyForFirebase,
      profilePic: profile.profilePic
    };
    return this._http
      .post(`${this.baseUrl}/createNewUser/`, obj)
  }

  getProfile(user: User) {
    return this._http
      .get(`${this.baseUrl}/getProfile/${user.uid}`)

  }

  updateProfile(profile) {
    const obj = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      location: profile.location,
      phoneNumber: profile.phoneNumber,
      description: profile.description,
      dateOfBirth: profile.dateOfBirth,
      type: profile.type,
      skills: profile.skills,
      email: profile.email,
      keyForFirebase: profile.keyForFirebase,
      profilePic: profile.profilePic
    };
    return this._http
      .post(`${this.baseUrl}/updateProfile/`, obj)
  }

  deleteProfile(user: User) {
    return this._http
      .get(`${this.baseUrl}/deleteProfile/${user.uid}`).subscribe(
        data => {
          this.thisProfile = <Profile>data;
          this.thisHasProfile = false;
        },
        err => {
          this.toast.create({
            message: `Error: ${err}`,
            duration: 3000
          }).present();
        },
        () => {
          this.toast.create({
            message: `Profile Deleted successfully`,
            duration: 3000
          }).present();
        }
      );
  }

  deleteFromFirebase(user: User, password: string) {

    const me = this;
    const userToDelete = user;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
    );

    user.reauthenticateWithCredential(credential).then(function () {

      user.delete().then(function () {
        me.deleteProfile(userToDelete);

      }).catch(function (error) {
        me.toast.create({
          message: `Error: ${error}`,
          duration: 3000
        }).present();

      });

    }).catch(function (error) {

      me.toast.create({
        message: `Error: ${error}`,
        duration: 3000
      }).present();

    });

  }
}
