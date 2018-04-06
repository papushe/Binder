import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {User} from "firebase/app";
import {CreateActivityPage} from "../create-activity/create-activity"

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
              private toast: ToastController,
              private alertCtrl: AlertController) {

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
          console.log(`user  ${this.authenticatedUser.uid} was removed from community ${this.community._id}  success? : ${res == true}`);
          if (res == true) {
            this.navCtrl.setRoot('CommunitiesPage');
            this.toast.create({
              message: `You left ${this.community.communityName}`,
              duration: 3000
            }).present();
          }
          else {
            this.toast.create({
              message: `Something went wrong, please try again`,
              duration: 3000
            }).present();
          }
        },
        err => {
          console.debug(`Failed to leave ${this.community.communityName} due to: ${err}`);
          this.toast.create({
            message: `Failed to leave ${this.community.communityName}`,
            duration: 3000
          }).present();
        },
        () => {
          //done
        }
      );
  }

  joinCommunity() {
    this.communityService.joinCommunity(this.community._id, this.authenticatedUser.uid)
      .subscribe(
        res => {
          console.log(`user ${this.authenticatedUser.uid} was joined from community ${this.community._id} success? : ${res == true}`);
          if (res == true) {
            this.navCtrl.setRoot('CommunitiesPage');
            this.toast.create({
              message: `You joined ${this.community.communityName}`,
              duration: 3000
            }).present();
          }
          else {
            this.toast.create({
              message: `You are not allowed to join  ${this.community.communityName}`,
              duration: 3000
            }).present();
          }
        },
        err => {
          console.debug(`Failed to join ${this.community.communityName} due to: ${err}`);
          this.toast.create({
            message: `Failed to join  ${this.community.communityName}`,
            duration: 3000
          }).present();
        },
        () => {
          //done
        });
  }

  deleteProfilePopup() {
    let alert = this.alertCtrl.create({
      title: 'Delete Community',
      message: 'Do you Really want to delete your Community?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.deleteCommunity();
          }
        }
      ]
    });
    alert.present();
  }


  deleteCommunity() {
    this.communityService.deleteCommunity(this.community._id, this.authenticatedUser.uid)
      .subscribe(
        res => {
          console.log(`community ${this.community._id} was deleted success? : ${res == true}`);
          if (res == true) {
            this.navCtrl.setRoot('CommunitiesPage');
            this.toast.create({
              message: `You deleted ${this.community.communityName}`,
              duration: 3000
            }).present();
          }
          else {
            this.toast.create({
              message: `You are not allowed to delete  ${this.community.communityName}`,
              duration: 3000
            }).present();
          }
        },
        err => {
          console.debug(`Failed to delete ${this.community.communityName} due to: ${err}`);
          this.toast.create({
            message: `Failed to delete ${this.community.communityName}`,
            duration: 3000
          }).present();
        },
        () => {
          //done
        });
  }

  createNewActivity() {
    console.log('TEST');
    this.navCtrl.push('CreateActivityPage');
  }

}
