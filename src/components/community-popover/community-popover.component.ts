import {Component, OnInit} from '@angular/core';
import {AlertController, NavController, NavParams, ViewController} from "ionic-angular";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {Profile} from "../../models/profile/profile.interface";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";
import {SharedService} from "../../providers/shared/shared.service";

@Component({
  selector: 'community-popover',
  templateUrl: 'community-popover.component.html'
})
export class CommunityPopoverComponent implements OnInit {

  isJoined: boolean;
  community: Community;
  profile: Profile;

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams,
              private communityService: CommunityService,
              private userService: UserService,
              private navCtrl: NavController,
              private sharedService: SharedService,
              private alertCtrl: AlertController,
              private socketService: SocketService) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
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
          console.log(`user was removed from community success? : ${!!res}`);
          if (res) {
            this.userService.thisProfile = <Profile> res;
            this.socketService.deleteFromCommunity(this.community, res, '');
            this.sharedService.createToast(`You left ${this.community.communityName}`);
          }
          else {
            this.sharedService.createToast(`Something went wrong, please try again`);
          }
        },
        err => {
          console.debug(`Failed to leave ${this.community.communityName} due to: ${err.message}`);
          this.sharedService.createToast(`Failed to leave ${this.community.communityName}`);
        },
        () => {
          //done
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
            console.debug('Cancel clicked');
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
    this.close();
    this.communityService.deleteCommunity(this.community._id, this.profile.keyForFirebase)
      .subscribe(
        res => {
          console.log(`community ${this.community._id} was deleted success? : ${!!res}`);
          if (res) {
            this.userService.thisProfile = <Profile> res;
            this.sharedService.createToast(`You deleted ${this.community.communityName}`);
          }
          else {
            this.sharedService.createToast(`You are not allowed to delete  ${this.community.communityName}`);
          }
        },
        err => {
          console.debug(`Failed to delete ${this.community.communityName} due to: ${err.message}`);
          this.sharedService.createToast(`Failed to delete ${this.community.communityName}`);
        },
        () => {
          this.navCtrl.setRoot('CommunitiesPage', {fromCommunityDetails: true});
        });
  }

  addMembers() {
    this.navCtrl.push('SearchUsersPage', {community: this.community, profile: this.profile})
      .then(() => {
        this.close();
      })
  }
}
