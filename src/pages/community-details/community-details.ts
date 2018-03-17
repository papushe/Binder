import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {User} from "firebase/app";

/**
 * Generated class for the CommunityDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community-details',
  templateUrl: 'community-details.html',
})
export class CommunityDetailsPage {
  community: Community;
  authenticatedUser: User;
  isJoined: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private communityService: CommunityService,
              private userService: UserService,
              private toast: ToastController) {

    this.community = navParams.get('community');
    this.isJoined = navParams.get('isUserJoined');

    this.userService.getAuthenticatedUser()
      .subscribe((user: User) => {
        this.authenticatedUser = user;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityDetailsPage');
  }

  leaveCommunity() {
    this.communityService.leaveCommunity(this.community._id, this.authenticatedUser.uid)
      .subscribe(
        res => {
            console.log(`user was removed from community success? : ${res}`);
        },
        err => {
          this.toast.create({
            message:`Failed to leave ${this.community.communityName}`,
            duration:3000
          }).present();
        },
        () => {
          this.navCtrl.setRoot('CommunitiesPage');
          this.toast.create({
            message:`You left ${this.community.communityName}`,
            duration:3000
          }).present();
        }
      );
  }

  joinCommunity() {
    this.communityService.joinCommunity(this.community._id, this.authenticatedUser.uid)
      .subscribe(
        res => {
          console.log(`user was joined from community success? : ${res}`);
        },
        err => {
          this.toast.create({
            message:`Failed to join  ${this.community.communityName}`,
            duration:3000
          }).present();
        },
        () => {
          this.navCtrl.setRoot('CommunitiesPage');
          this.toast.create({
            message:`You joined ${this.community.communityName}`,
            duration:3000
          }).present();
        }
      );
  }
}
