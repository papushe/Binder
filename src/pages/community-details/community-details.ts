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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private communityService: CommunityService,
              private userService: UserService,
              private toast: ToastController) {

    this.community = navParams.get('community');

    this.userService.getAuthenticatedUser()
      .subscribe((user: User) => {
        this.authenticatedUser = user;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityDetailsPage');
  }

  leaveCommunity(community) {
    this.communityService.leaveCommunity(community._id, this.authenticatedUser.uid)
      .subscribe(
        res => {
            console.log(`removed user from community success: ${res}`);
        },
        err => {
          this.toast.create({
            message:`Error: ${err}`,
            duration:3000
          }).present();
        },
        () => {
          this.navCtrl.setRoot('CommunitiesPage');
          this.toast.create({
            message:`You left ${community.communityName}`,
            duration:3000
          }).present();
        }
      );
  }

}
