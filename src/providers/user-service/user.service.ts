import {Injectable} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {Account} from "../../models/account/account.interface";
import {LoginResponse} from "../../models/login/login-response.interface";
import {User} from 'firebase/app'
import {HttpClient} from "@angular/common/http";

import * as firebase from 'firebase';
import {Profile} from "../../models/profile/profile.interface";
import {Subscription} from "rxjs/Subscription";
import {SharedService} from "../shared/shared.service";

@Injectable()
export class UserService {

  baseUrl: string = '';
  account = {} as Account;
  thisProfile = {} as Profile;
  thisAuthenticatedUser: User;
  thisAuthenticatedUser$: Subscription;
  thisHasProfile: boolean = false;
  thisFromCommunityDetails: boolean;
  context: string = 'user';

  constructor(private _http: HttpClient,
              private auth: AngularFireAuth,
              private sharedService: SharedService) {
    this.baseUrl = this.sharedService.baseUrl;

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
      .post(`${this.baseUrl}/${this.context}/create`, obj);
  }

  getProfile(user: User) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/get/${user.uid}`);

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
      keyForFirebase: this.thisAuthenticatedUser.uid,
      profilePic: profile.profilePic
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/update`, obj);
  }

  vote(vote) {
    const obj = {
      up: vote.up || false,
      down: vote.down || false,
      userId: this.thisProfile.keyForFirebase
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/vote`, obj);
  }

  deleteProfile(user: User) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/delete/${user.uid}`).subscribe(
        data => {
          this.thisProfile = <Profile>data;
          this.thisHasProfile = false;
        },
        err => {
          this.sharedService.createToast(`Error: ${err.message}`);
        },
        () => {
          this.sharedService.createToast(`Profile Deleted successfully`);
        }
      );
  }

  deleteFromFirebase(user: User, password: string) {
    const self = this;
    const userToDelete = user;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
    );

    user.reauthenticateWithCredential(credential).then(function () {

      user.delete().then(function () {
        self.deleteProfile(userToDelete);

      }).catch(function (error) {
        self.sharedService.createToast(`Error: ${error}`);
      });

    }).catch(function (error) {
      self.sharedService.createToast(`Error: ${error}`);
    });
  }

  searchUsers(query: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/search/${query}`);
  }
}
