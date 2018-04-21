import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, ToastController, ViewController} from "ionic-angular";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {Profile} from "../../models/profile/profile.interface";
import {UserService} from "../../providers/user-service/user.service";

/**
 * Generated class for the CommunityPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'community-popover',
  templateUrl: 'community-popover.component.html'
})
export class CommunityPopoverComponent {

  isJoined: boolean;
  community: Community;
  profile: Profile;

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams,
              private communityService: CommunityService,
              private userService: UserService,
              private navCtrl: NavController,
              private toast: ToastController,
              private alertCtrl: AlertController) {
    this.isJoined = this.navParams.get('IsJoined');
    this.community = this.communityService.thisSelectedCommunity;
    this.profile = this.userService.thisProfile;
  }

  close() {
    this.viewCtrl.dismiss();
  }

  leaveCommunity() {
    this.close();
    this.communityService.leaveCommunity(this.community._id, this.profile.keyForFirebase)
      .subscribe(
        res => {
          console.log(`user was removed from community success? : ${res == true}`);
          if (res == true) {
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
          console.debug(`Failed to leave ${this.community.communityName} due to: ${err.message}`);
          this.toast.create({
            message: `Failed to leave ${this.community.communityName}`,
            duration: 3000
          }).present();
        },
        () => {
          this.navCtrl.setRoot('CommunitiesPage', {fromCommunityDetails: true});
        }
      );
  }

  deletePopup() {
    this.close();
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
    this.communityService.deleteCommunity(this.community._id, this.profile.keyForFirebase)
      .subscribe(
        res => {
          console.log(`community ${this.community._id} was deleted success? : ${res == true}`);
          if (res == true) {
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
          console.debug(`Failed to delete ${this.community.communityName} due to: ${err.message}`);
          this.toast.create({
            message: `Failed to delete ${this.community.communityName}`,
            duration: 3000
          }).present();
        },
        () => {
          this.navCtrl.setRoot('CommunitiesPage', {fromCommunityDetails: true});
        });
  }

  addMembers() {
    this.navCtrl.push('SearchUsersPage', {community: this.community, profile: this.profile});
  }
}
